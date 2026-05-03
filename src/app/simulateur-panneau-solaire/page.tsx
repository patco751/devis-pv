import type { Metadata } from "next";
import { LogoWithText } from "@/components/logo";
import SimulateurForm from "@/components/simulateur-form";

export const metadata: Metadata = {
  title: "Simulateur Panneau Solaire Gratuit 2026 — Estimation en 2 min",
  description:
    "Estimez gratuitement vos économies avec des panneaux solaires. Production, rentabilité, aides et prix : résultat en 2 minutes, sans inscription.",
  alternates: { canonical: "/simulateur-panneau-solaire" },
};

const faqs = [
  {
    q: "Comment fonctionne ce simulateur solaire ?",
    a: "Le simulateur utilise les données d'ensoleillement de votre ville, votre consommation électrique et les caractéristiques de votre toiture pour estimer la production solaire, les économies réalisables et le temps de retour sur investissement.",
  },
  {
    q: "Combien de panneaux solaires pour une maison de 100 m² ?",
    a: "Pour une maison de 100 m², une installation de 3 à 6 kWc (8 à 15 panneaux) couvre généralement 40 à 60 % de la consommation. La puissance idéale dépend de votre consommation réelle et de votre ensoleillement.",
  },
  {
    q: "Quelle est la rentabilité des panneaux solaires en 2026 ?",
    a: "Avec la hausse des tarifs EDF et la baisse du coût des panneaux, le retour sur investissement se situe entre 8 et 12 ans selon la région. Sur 25 ans, une installation de 6 kWc peut générer 15 000 à 25 000 € d'économies nettes.",
  },
  {
    q: "Quelles aides pour les panneaux solaires en 2026 ?",
    a: "La prime à l'autoconsommation (240 € pour 3 kWc, 480 € pour 6 kWc, 720 € pour 9 kWc), l'obligation d'achat EDF OA pour le surplus à 0,04 €/kWh, et la TVA réduite à 5,5 % pour les installations ≤ 9 kWc. Un installateur certifié RGE est requis pour bénéficier de ces aides.",
  },
  {
    q: "Quelle différence entre ce simulateur et l'analyse de devis ?",
    a: "Le simulateur donne une estimation générale de rentabilité avant tout projet. L'analyse de devis vérifie un devis précis que vous avez reçu : prix, matériel, installateur et clauses du contrat.",
  },
];

export default function SimulateurPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="flex flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
            <a href="/">
              <LogoWithText />
            </a>
            <nav className="flex items-center gap-4">
              <a href="/blog" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Blog</a>
              <a href="/#tarifs" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Tarifs</a>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl px-6 py-16">
          <nav className="mb-8 text-sm text-zinc-500">
            <a href="/" className="hover:text-primary">Accueil</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-zinc-100">Simulateur solaire</span>
          </nav>

          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Simulateur panneaux solaires gratuit
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Estimez en 2 minutes la production, les économies et la rentabilité
            {"d'une"} installation photovoltaïque chez vous. Sans inscription, 100 % gratuit.
          </p>

          <div className="mt-10">
            <SimulateurForm />
          </div>

          <section className="mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Questions fréquentes
            </h2>
            <div className="mt-6 space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {f.q}
                    <svg
                      className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} DevisPV</p>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="/mentions-legales" className="hover:text-zinc-900">Mentions légales</a>
              <a href="/cgv" className="hover:text-zinc-900">CGV</a>
              <a href="/contact" className="hover:text-zinc-900">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
