import UploadZone from "@/components/upload-zone";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Devis<span className="text-primary">PV</span>
            </span>
          </div>
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
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-blue-50/50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-2xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-primary dark:border-blue-800 dark:bg-blue-950/40">
            Analyse par IA experte
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
        <div className="mt-12 w-full max-w-xl">
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
                title: "L'IA analyse tout",
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
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
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
                  59€
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
              <button className="mt-8 w-full rounded-xl border-2 border-primary py-3 text-sm font-semibold text-primary hover:bg-blue-50 transition-colors dark:hover:bg-blue-950/30">
                Choisir ce forfait
              </button>
            </div>

            {/* Forfait 2 */}
            <div className="relative rounded-2xl border-2 border-primary bg-white p-8 shadow-lg shadow-blue-500/10 dark:bg-zinc-950">
              <div className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                Populaire
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Projet complet
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  89€
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
              <button className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-blue-500/25 transition-all">
                Choisir ce forfait
              </button>
            </div>
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
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Mentions légales
            </a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              CGV
            </a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
