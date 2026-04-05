import UploadZone from "@/components/upload-zone";
import { LogoWithText } from "@/components/logo";
import {
  OrganizationJsonLd,
  FAQPageJsonLd,
  ProductJsonLd,
} from "@/components/json-ld";

const faqItems = [
  {
    question: "Comment fonctionne l\’analyse ?",
    answer:
      "Vous uploadez votre devis (PDF ou photo) et notre système expert en photovoltaïque extrait toutes les données, vérifie les prix par rapport au marché, contrôle la qualité du matériel et la certification RGE de l\’installateur. Vous recevez un rapport complet en moins de 2 minutes.",
  },
  {
    question: "L\’analyse est-elle fiable ?",
    answer:
      "Notre système s\’appuie sur les références de prix officielles (photovoltaique.info, CRE, tarifs EDF OA en vigueur) et les normes du secteur. Elle détecte les prix anormalement élevés, les matériels de mauvaise qualité et les signaux d\’arnaque.",
  },
  {
    question: "Mes données sont-elles protégées ?",
    answer:
      "Oui. Votre devis est analysé en temps réel et n\’est pas stocké sur nos serveurs. Le traitement est effectué de manière sécurisée et les données sont supprimées immédiatement après l\’analyse.",
  },
  {
    question: "Pourquoi 29 € et pas gratuit ?",
    answer:
      "L\’analyse mobilise un système avancé spécialisé en photovoltaïque. Le coût couvre le traitement et vous garantit un rapport de qualité professionnelle. C\’est bien moins cher qu\’un audit expert (200-500 €) et peut vous faire économiser des milliers d\’euros.",
  },
  {
    question: "Que contient le rapport PDF ?",
    answer:
      "Le rapport inclut : le scoring global et par axe (technique, financier, fiabilité), toutes les données extraites du devis, une projection financière sur 25 ans (ROI, gains cumulés, rendement), et 3 à 5 recommandations personnalisées.",
  },
  {
    question: "Quels types de devis puis-je analyser ?",
    answer:
      "Tout devis d\’installation photovoltaïque résidentielle en France : panneaux solaires en toiture (surimposition ou IAB), sur pergola, carport ou au sol. Autoconsommation avec vente de surplus ou vente totale.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <OrganizationJsonLd />
      <ProductJsonLd />
      <FAQPageJsonLd
        faqs={faqItems.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <LogoWithText />
          <nav className="flex items-center gap-4">
            <a
              href="#comment-ca-marche"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Comment ça marche
            </a>
            <a
              href="#tarifs"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Tarifs
            </a>
            <a
              href="#faq"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              FAQ
            </a>
            <a
              href="/blog"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Blog
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-orange-50/50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-2xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-primary dark:border-orange-800 dark:bg-orange-950/40">
            Analyse par système expert
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Votre devis solaire est-il{" "}
            <span className="text-primary">au juste prix</span> ?
          </h1>
          <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Uploadez votre devis photovoltaïque et obtenez en quelques minutes un
            rapport de scoring sur 3 axes : <strong>technique</strong>,{" "}
            <strong>financier</strong> et <strong>fiabilité installateur</strong>.
          </p>
        </div>

        {/* Upload Zone */}
        <div id="upload" className="mt-12 w-full max-w-xl">
          <UploadZone />
        </div>
      </section>

      {/* Comment ça marche */}
      <section
        id="comment-ca-marche"
        className="border-t border-zinc-200 bg-white px-6 py-20 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Comment ça marche
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Uploadez votre devis",
                desc: "Glissez votre devis en PDF ou photo (JPG, PNG). Vos données restent confidentielles.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                ),
              },
              {
                step: "2",
                title: "Le système analyse tout",
                desc: "Extraction des données, vérification des prix, du matériel et de la certification RGE.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3.375 3.375 0 01-4.06.454L12 17.25l-.47.174a3.375 3.375 0 01-4.06-.454L5 14.5m14 0V17a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 17v-2.5"
                  />
                ),
              },
              {
                step: "3",
                title: "Recevez votre rapport",
                desc: "Score global, détail par axe, alertes et recommandations personnalisées.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                ),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/30">
                  <svg
                    className="h-7 w-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    {item.icon}
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Diagnostic gratuit */}
      <section className="border-t border-zinc-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-12 dark:from-zinc-900 dark:to-zinc-900">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Gratuit
          </span>
          <h2 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {"Pas encore sûr ? Testez le pré-diagnostic gratuit"}
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            5 questions rapides pour savoir si votre devis est dans les clous, sans rien payer.
          </p>
          <a
            href="/diagnostic-gratuit"
            className="mt-4 inline-block rounded-xl border-2 border-green-600 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors dark:text-green-300 dark:hover:bg-green-950/30"
          >
            {"Pré-diagnostic gratuit"}
          </a>
        </div>
      </section>

      {/* Tarifs */}
      <section
        id="tarifs"
        className="border-t border-zinc-200 bg-zinc-50 px-6 py-20 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Tarifs
          </h2>
          <p className="mt-3 text-center text-zinc-500 dark:text-zinc-400">
            Deux formules simples, sans abonnement.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {/* Forfait 1 */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-950">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Analyse unique
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  29€
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Analyse complète d'un seul devis.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                {[
                  "Extraction de toutes les données",
                  "Scoring sur 3 axes",
                  "Recommandations personnalisées",
                  "Rapport téléchargeable en PDF",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#single" className="mt-8 block w-full rounded-xl border-2 border-primary py-3 text-sm font-semibold text-primary hover:bg-orange-50 transition-colors dark:hover:bg-orange-950/30 text-center">
                Choisir ce forfait
              </a>
            </div>

            {/* Forfait 2 */}
            <div className="relative rounded-2xl border-2 border-primary bg-white p-8 shadow-lg shadow-orange-500/10 dark:bg-zinc-950">
              <div className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                Populaire
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Projet complet
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  59€
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Analyses illimitées pendant 2 mois.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                {[
                  "Tout du forfait Analyse unique",
                  "Analyses illimitées sur un projet",
                  "Comparez plusieurs devis entre eux",
                  "Valable 2 mois",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#project" className="mt-8 block w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-orange-500/25 transition-all text-center">
                Choisir ce forfait
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-zinc-200 bg-white px-6 py-20 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Questions fréquentes
          </h2>
          <div className="mt-12 space-y-4">
            {faqItems.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {faq.question}
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
                <p className="px-6 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} DevisPV. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="/mentions-legales" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Mentions légales
            </a>
            <a href="/cgv" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              CGV
            </a>
            <a href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Contact
            </a>
            <a href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Blog
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
