export default function Contact() {
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
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Contact</h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          Une question, un probl&egrave;me ou une suggestion ? Contactez-nous.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Email */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Email</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              R&eacute;ponse sous 24h en jours ouvr&eacute;s.
            </p>
            <a
              href="mailto:contact@devis-pv.fr"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              contact@devis-pv.fr
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          {/* Horaires */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Horaires</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Lundi &mdash; Vendredi : 9h &mdash; 18h
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Le service d&apos;analyse est disponible 24h/24, 7j/7.
            </p>
          </div>
        </div>

        {/* FAQ shortcut */}
        <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Avant de nous contacter</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Consultez notre <a href="/#faq" className="text-primary font-medium hover:underline">FAQ</a> — vous y trouverez peut-&ecirc;tre d&eacute;j&agrave; la r&eacute;ponse &agrave; votre question.
          </p>
        </div>

        {/* Formulaire de contact */}
        <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Envoyez-nous un message</h2>
          <form
            action={`https://formsubmit.co/contact@devis-pv.fr`}
            method="POST"
            className="space-y-4"
          >
            {/* Anti-spam honeypot */}
            <input type="text" name="_honey" className="hidden" />
            {/* Disable captcha */}
            <input type="hidden" name="_captcha" value="false" />
            {/* Redirect after submit */}
            <input type="hidden" name="_next" value="https://devis-pv.fr/contact?sent=1" />
            <input type="hidden" name="_subject" value="Nouveau message depuis DevisPV" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Sujet
              </label>
              <select
                id="subject"
                name="subject_type"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="question">Question sur le service</option>
                <option value="problem">Probl&egrave;me technique</option>
                <option value="billing">Paiement / facturation</option>
                <option value="partnership">Partenariat</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="Votre message..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-orange-500/25 transition-all sm:w-auto sm:px-8"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
