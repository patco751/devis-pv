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
  title: "Devis PV - Analyseur de devis photovoltaïques",
  description:
    "Faites analyser votre devis panneaux solaires par une IA experte. Scoring technique, financier et fiabilité installateur en quelques minutes.",
  keywords: [
    "devis panneaux solaires",
    "analyse devis photovoltaique",
    "vérifier devis solaire",
    "prix panneaux solaires",
    "installateur RGE",
  ],
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
