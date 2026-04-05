import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l\u2019\u00e9quipe DevisPV pour toute question sur l\u2019analyse de votre devis photovolta\u00efque.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
