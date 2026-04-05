import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pr\u00e9-diagnostic gratuit de votre devis solaire",
  description:
    "R\u00e9pondez \u00e0 5 questions sur votre devis photovolta\u00efque et obtenez un pr\u00e9-diagnostic gratuit : est-il au bon prix ? Le mat\u00e9riel est-il fiable ?",
  alternates: { canonical: "/diagnostic-gratuit" },
};

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
