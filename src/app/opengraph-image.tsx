import { ImageResponse } from "next/og";

export const alt = "DevisPV — Analysez votre devis photovoltaïque";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fff7ed 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            PV
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#18181b",
            }}
          >
            Devis
            <span style={{ color: "#ea580c" }}>PV</span>
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#18181b",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.3,
          }}
        >
          Votre devis solaire est-il au juste prix ?
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#71717a",
            marginTop: "20px",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Analyse experte en 2 minutes. Scoring technique, financier et installateur.
        </div>

        {/* CTA badge */}
        <div
          style={{
            display: "flex",
            marginTop: "40px",
            background: "#ea580c",
            color: "white",
            padding: "14px 40px",
            borderRadius: "16px",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          Analyser mon devis — 29 €
        </div>

        {/* Bottom stats */}
        <div
          style={{
            display: "flex",
            gap: "60px",
            marginTop: "40px",
            color: "#71717a",
            fontSize: "18px",
          }}
        >
          <span>+150 devis analysés</span>
          <span>4.8/5 satisfaction</span>
          <span>Résultat en 2 min</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
