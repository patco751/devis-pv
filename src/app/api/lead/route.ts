import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Silently fail — don't block the user experience
      console.error("[lead] RESEND_API_KEY not set");
      return Response.json({ success: true });
    }

    const { email, source, data } = (await request.json()) as {
      email: string;
      source: string;
      data?: Record<string, string>;
    };

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Email invalide" }, { status: 400 });
    }

    // Add contact to Resend Audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          first_name: data?.name || "",
          unsubscribed: false,
        }),
      });
    }

    // Send notification email to admin
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DevisPV <noreply@devis-pv.fr>",
        to: ["contact@devis-pv.fr"],
        subject: `[DevisPV] Nouveau lead — ${source}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px;">
            <h2 style="color: #ea580c;">Nouveau prospect</h2>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Source :</strong> ${source}</p>
            ${data ? `<p><strong>Détails :</strong> ${JSON.stringify(data)}</p>` : ""}
          </div>
        `,
      }),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[lead] Error:", error);
    return Response.json({ success: true }); // Don't expose errors to user
  }
}
