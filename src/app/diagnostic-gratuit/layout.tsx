import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pré-diagnostic gratuit de votre devis solaire",
  description:
    "Répondez à 5 questions sur votre devis photovoltaïque et obtenez un pré-diagnostic gratuit : est-il au bon prix ? Le matériel est-il fiable ?",
  alternates: { canonical: "/diagnostic-gratuit" },
};

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
