import { NextRequest } from "next/server";
import { Resend } from "resend";

const SUBJECT_LABELS: Record<string, string> = {
  question: "Question sur le service",
  problem: "Probl\u00e8me technique",
  billing: "Paiement / facturation",
  partnership: "Partenariat",
  other: "Autre",
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Service email non configur\u00e9." },
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

    // Validation
    if (!name || !email || !message) {
      return Response.json(
        { error: "Tous les champs obligatoires doivent \u00eatre remplis." },
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
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "DevisPV <noreply@devis-pv.fr>",
      to: ["contact@devis-pv.fr"],
      replyTo: email,
      subject: `[DevisPV] ${subjectLabel} — ${name}`,
      html: `
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
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi email:", error);
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
