export default function CGV() {
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
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Conditions G&eacute;n&eacute;rales de Vente</h1>
        <p className="mt-2 text-sm text-zinc-400">Derni&egrave;re mise &agrave; jour : 31 mars 2026</p>

        <div className="mt-8 space-y-8 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 1 — Objet</h2>
            <p>
              Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente (CGV) r&eacute;gissent les relations
              contractuelles entre l&apos;&eacute;diteur du site DevisPV et tout utilisateur (ci-apr&egrave;s
              &laquo; le Client &raquo;) souhaitant utiliser le service d&apos;analyse de devis photovolta&iuml;ques.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 2 — Services propos&eacute;s</h2>
            <p>DevisPV propose un service d&apos;analyse automatis&eacute;e de devis d&apos;installations photovolta&iuml;ques comprenant :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>L&apos;extraction des donn&eacute;es du devis (mat&eacute;riel, prix, installateur)</li>
              <li>Un scoring sur 3 axes : technique, financier, fiabilit&eacute; installateur</li>
              <li>Une projection financi&egrave;re sur 25 ans</li>
              <li>Des recommandations personnalis&eacute;es</li>
              <li>Un rapport PDF t&eacute;l&eacute;chargeable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 3 — Tarifs</h2>
            <p>Deux formules sont propos&eacute;es :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Analyse unique (29 &euro;)</strong> : analyse compl&egrave;te d&apos;un seul devis</li>
              <li><strong>Projet complet (59 &euro;)</strong> : analyses illimit&eacute;es pendant 2 mois</li>
            </ul>
            <p className="mt-2">
              Les prix sont indiqu&eacute;s en euros TTC. L&apos;&eacute;diteur se r&eacute;serve le droit de
              modifier les tarifs &agrave; tout moment. Les tarifs applicables sont ceux en vigueur au
              moment de la validation du paiement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 4 — Paiement</h2>
            <p>
              Le paiement est effectu&eacute; en ligne par carte bancaire via la plateforme s&eacute;curis&eacute;e
              Stripe. Le service est accessible imm&eacute;diatement apr&egrave;s confirmation du paiement.
              Aucune donn&eacute;e bancaire n&apos;est stock&eacute;e sur nos serveurs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 5 — Droit de r&eacute;tractation</h2>
            <p>
              Conform&eacute;ment &agrave; l&apos;article L221-28 du Code de la consommation, le droit de
              r&eacute;tractation ne peut &ecirc;tre exerc&eacute; pour les contrats de fourniture de contenu
              num&eacute;rique non fourni sur un support mat&eacute;riel dont l&apos;ex&eacute;cution a commenc&eacute;
              avec l&apos;accord du consommateur. En validant le paiement et en lan&ccedil;ant l&apos;analyse,
              le Client accepte que le service soit ex&eacute;cut&eacute; imm&eacute;diatement et renonce &agrave;
              son droit de r&eacute;tractation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 6 — Limitation de responsabilit&eacute;</h2>
            <p>
              Les analyses fournies par DevisPV sont g&eacute;n&eacute;r&eacute;es par analyse automatisée
              &agrave; titre indicatif. Elles ne constituent en aucun cas un avis professionnel, un
              conseil en investissement ou une expertise certifi&eacute;e. L&apos;&eacute;diteur ne saurait
              &ecirc;tre tenu responsable des d&eacute;cisions prises par le Client sur la base de ces
              analyses, ni des &eacute;ventuelles erreurs ou omissions dans les r&eacute;sultats.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 7 — Propri&eacute;t&eacute; intellectuelle</h2>
            <p>
              Le rapport d&apos;analyse g&eacute;n&eacute;r&eacute; est destin&eacute; &agrave; l&apos;usage exclusif du Client.
              Il ne peut &ecirc;tre revendu, redistribu&eacute; ou utilis&eacute; &agrave; des fins commerciales
              sans autorisation pr&eacute;alable de l&apos;&eacute;diteur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 8 — Droit applicable</h2>
            <p>
              Les pr&eacute;sentes CGV sont soumises au droit fran&ccedil;ais. En cas de litige, les
              tribunaux comp&eacute;tents seront ceux du ressort du domicile de l&apos;&eacute;diteur, sauf
              disposition l&eacute;gale contraire.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Article 9 — Contact</h2>
            <p>
              Pour toute question relative aux pr&eacute;sentes CGV ou au service DevisPV,
              contactez-nous &agrave; : <a href="mailto:contact@devis-pv.fr" className="text-primary hover:underline">contact@devis-pv.fr</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
