export default function MentionsLegales() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Devis<span className="text-primary">PV</span>
            </span>
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Mentions l&eacute;gales</h1>

        <div className="mt-8 space-y-8 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">&Eacute;diteur du site</h2>
            <p>
              Le site DevisPV (ci-apr&egrave;s &laquo; le Site &raquo;) est &eacute;dit&eacute; par :<br />
              <strong>Patrick Azatassou</strong><br />
              Entrepreneur individuel<br />
              Email : dessapatrick@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">H&eacute;bergement</h2>
            <p>
              Le Site est h&eacute;berg&eacute; par :<br />
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133, Covina, CA 91723, &Eacute;tats-Unis<br />
              Site web : vercel.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Propri&eacute;t&eacute; intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du Site (textes, graphismes, logiciels, images, vid&eacute;os, sons, plans,
              logos, marques, etc.) est la propri&eacute;t&eacute; exclusive de l&apos;&eacute;diteur ou de ses partenaires. Toute
              reproduction, repr&eacute;sentation, modification ou adaptation, totale ou partielle, est interdite
              sans autorisation pr&eacute;alable &eacute;crite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Donn&eacute;es personnelles</h2>
            <p>
              Les devis upload&eacute;s sont trait&eacute;s en temps r&eacute;el par notre IA et ne sont pas stock&eacute;s sur
              nos serveurs apr&egrave;s analyse. Aucune donn&eacute;e personnelle n&apos;est collect&eacute;e en dehors des
              informations strictement n&eacute;cessaires au traitement du paiement (g&eacute;r&eacute; par Stripe).
            </p>
            <p className="mt-2">
              Conform&eacute;ment au RGPD, vous disposez d&apos;un droit d&apos;acc&egrave;s, de rectification et de
              suppression de vos donn&eacute;es. Pour exercer ces droits, contactez-nous &agrave;
              dessapatrick@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Cookies</h2>
            <p>
              Le Site utilise uniquement des cookies techniques strictement n&eacute;cessaires au
              fonctionnement du service (session, paiement). Aucun cookie publicitaire ou de
              tra&ccedil;age n&apos;est utilis&eacute;.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Responsabilit&eacute;</h2>
            <p>
              Les analyses fournies par DevisPV sont g&eacute;n&eacute;r&eacute;es par intelligence artificielle
              &agrave; titre informatif. Elles ne constituent ni un conseil professionnel, ni un avis
              d&apos;expert agr&eacute;&eacute;. L&apos;&eacute;diteur ne saurait &ecirc;tre tenu responsable des d&eacute;cisions
              prises sur la base de ces analyses.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
