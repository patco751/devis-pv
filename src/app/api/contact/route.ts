import { NextRequest } from "next/server";

const SUBJECT_LABELS: Record<string, string> = {
  question: "Question sur le service",
  problem: "Problème technique",
  billing: "Paiement / facturation",
  partnership: "Partenariat",
  other: "Autre",
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    console.log("[contact] RESEND_API_KEY present:", !!apiKey);

    if (!apiKey) {
      console.error("[contact] RESEND_API_KEY is not set. Available env keys:", Object.keys(process.env).filter(k => k.startsWith("RESEND") || k.startsWith("NEXT_PUBLIC")).join(", "));
      return Response.json(
        { error: "Service email non configuré." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    if (!name || !email || !message) {
      return Response.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const subjectLabel = SUBJECT_LABELS[subject] || subject || "Contact";

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ea580c; padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Nouveau message DevisPV</h1>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Nom</td>
              <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Sujet</td>
              <td style="padding: 8px 0; font-size: 14px;">${escapeHtml(subjectLabel)}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
      </div>
    `;

    // Use fetch directly instead of Resend SDK for better error visibility
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DevisPV <noreply@devis-pv.fr>",
        to: ["contact@devis-pv.fr"],
        reply_to: email,
        subject: `[DevisPV] ${subjectLabel} — ${name}`,
        html: htmlContent,
      }),
    });

    const resBody = await res.json();
    console.log("[contact] Resend response:", res.status, JSON.stringify(resBody));

    if (!res.ok) {
      return Response.json(
        { error: resBody.message || "Erreur lors de l'envoi." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[contact] Error:", error);
    const message =
      error instanceof Error ? error.message : "Erreur lors de l'envoi.";
    return Response.json({ error: message }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
