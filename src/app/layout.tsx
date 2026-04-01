import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevisPV — Analysez votre devis photovoltaïque par IA",
  description:
    "Uploadez votre devis panneaux solaires et obtenez un rapport d'analyse complet en quelques minutes : scoring technique, financier et fiabilité installateur. À partir de 29 €.",
  keywords: [
    "devis panneaux solaires",
    "analyse devis photovoltaique",
    "vérifier devis solaire",
    "prix panneaux solaires",
    "installateur RGE",
    "devis photovoltaique",
    "scoring devis solaire",
    "autoconsommation",
    "prime EDF OA",
  ],
  openGraph: {
    title: "DevisPV — Votre devis solaire est-il au juste prix ?",
    description:
      "IA experte en photovoltaïque. Scoring technique, financier et fiabilité installateur. Rapport PDF complet avec projection financière sur 25 ans.",
    type: "website",
    locale: "fr_FR",
    siteName: "DevisPV",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevisPV — Analysez votre devis photovoltaïque par IA",
    description:
      "Scoring complet de votre devis solaire : technique, financier, fiabilité. À partir de 29 €.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
