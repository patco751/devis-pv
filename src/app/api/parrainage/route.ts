import { NextRequest } from "next/server";

function generateCode(email: string): string {
  // Deterministic short code from email
  const hash = email
    .split("")
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  const code = "PV" + Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email: string };

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Email invalide" }, { status: 400 });
    }

    const code = generateCode(email);

    // Send confirmation + code to the referrer
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DevisPV <noreply@devis-pv.fr>",
          to: [email],
          subject: "Votre lien de parrainage DevisPV",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <div style="background: #ea580c; padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">Votre lien de parrainage</h1>
              </div>
              <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
                <p>Partagez ce lien avec vos proches :</p>
                <p style="background: #fff7ed; border: 2px solid #ea580c; border-radius: 8px; padding: 12px; font-weight: bold; text-align: center;">
                  <a href="https://devis-pv.fr/?ref=${code}" style="color: #ea580c; text-decoration: none;">
                    https://devis-pv.fr/?ref=${code}
                  </a>
                </p>
                <p style="font-size: 14px; color: #6b7280;">
                  Vos filleuls obtiennent <strong>5€ de réduction</strong> sur leur première analyse.
                  Pour chaque filleul qui achète, vous recevez une <strong>analyse gratuite</strong>.
                </p>
              </div>
            </div>
          `,
        }),
      });

      // Notify admin
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DevisPV <noreply@devis-pv.fr>",
          to: ["contact@devis-pv.fr"],
          subject: `[DevisPV] Nouveau parrain — ${email}`,
          html: `<p>Nouveau parrain inscrit : <strong>${email}</strong></p><p>Code : <strong>${code}</strong></p>`,
        }),
      });
    }

    return Response.json({ code });
  } catch (error) {
    console.error("[parrainage] Error:", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
