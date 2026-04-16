import { NextRequest } from "next/server";
import { EMAIL_SEQUENCE } from "@/lib/email-sequence";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Contact = {
  id: string;
  email: string;
  first_name?: string;
  created_at: string;
  unsubscribed: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  const now = Date.now();
  return Math.floor((now - then) / DAY_MS);
}

async function sendEmail(
  apiKey: string,
  to: string,
  firstName: string,
  stepIdx: number,
  contactId: string,
) {
  const step = EMAIL_SEQUENCE[stepIdx];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Idempotency: one send per contact per step, even if cron retries
      "Idempotency-Key": `seq-${contactId}-${stepIdx}`,
    },
    body: JSON.stringify({
      from: "DevisPV <contact@devis-pv.fr>",
      to: [to],
      subject: step.subject,
      html: step.html(firstName || ""),
      headers: { "List-Unsubscribe": "<mailto:unsubscribe@devis-pv.fr>" },
    }),
  });
  return res.ok;
}

export async function GET(request: NextRequest) {
  // Protect the endpoint
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return Response.json({ error: "Resend not configured" }, { status: 500 });
  }

  // Fetch all contacts from the audience
  const listRes = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );
  if (!listRes.ok) {
    return Response.json({ error: "Resend list failed" }, { status: 502 });
  }
  const { data: contacts } = (await listRes.json()) as { data: Contact[] };

  // Day offset that triggers each step (index = step number)
  const TRIGGERS = [0, 1, 3, 6, 10];

  const results = { sent: 0, skipped: 0, failed: 0 };

  for (const c of contacts) {
    if (c.unsubscribed) {
      results.skipped++;
      continue;
    }
    const elapsed = daysSince(c.created_at);
    // Send every step whose trigger day has already passed. Resend's
    // Idempotency-Key (seq-{contactId}-{stepIdx}) prevents duplicate sends
    // on subsequent runs, so this also backfills leads that joined before
    // the cron was live.
    let anySent = false;
    for (let stepIdx = 0; stepIdx < TRIGGERS.length; stepIdx++) {
      if (TRIGGERS[stepIdx] > elapsed) break;
      const ok = await sendEmail(apiKey, c.email, c.first_name || "", stepIdx, c.id);
      ok ? results.sent++ : results.failed++;
      anySent = true;
    }
    if (!anySent) results.skipped++;
  }

  return Response.json({ success: true, ...results, scanned: contacts.length });
}
