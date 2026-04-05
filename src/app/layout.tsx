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
  metadataBase: new URL("https://devis-pv.fr"),
  title: {
    default:
      "DevisPV \u2014 Analysez votre devis photovolta\u00efque par analyse experte",
    template: "%s | DevisPV",
  },
  description:
    "Uploadez votre devis panneaux solaires et obtenez un rapport d\u2019analyse complet en quelques minutes : scoring technique, financier et fiabilit\u00e9 installateur. \u00c0 partir de 29 \u20ac.",
  keywords: [
    "devis panneaux solaires",
    "analyse devis photovoltaique",
    "v\u00e9rifier devis solaire",
    "prix panneaux solaires",
    "installateur RGE",
    "devis photovoltaique",
    "scoring devis solaire",
    "autoconsommation",
    "prime EDF OA",
    "arnaque panneaux solaires",
    "comparateur devis solaire",
    "prix kWc",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DevisPV \u2014 Votre devis solaire est-il au juste prix ?",
    description:
      "Syst\u00e8me expert en photovolta\u00efque. Scoring technique, financier et fiabilit\u00e9 installateur. Rapport PDF complet avec projection financi\u00e8re sur 25 ans.",
    type: "website",
    locale: "fr_FR",
    siteName: "DevisPV",
    url: "https://devis-pv.fr",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "DevisPV \u2014 Analysez votre devis photovolta\u00efque par analyse experte",
    description:
      "Scoring complet de votre devis solaire : technique, financier, fiabilit\u00e9. \u00c0 partir de 29 \u20ac.",
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
