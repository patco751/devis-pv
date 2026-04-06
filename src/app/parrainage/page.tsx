"use client";

import { useState } from "react";
import { LogoWithText } from "@/components/logo";

export default function Parrainage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/parrainage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.code) setCode(data.code);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = code
    ? `https://devis-pv.fr/?ref=${code}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/">
            <LogoWithText />
          </a>
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            Retour au site
          </a>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16 bg-gradient-to-b from-orange-50/50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 text-center">
            Parrainez, gagnez
          </h1>
          <p className="mt-3 text-center text-zinc-600 dark:text-zinc-400">
            Partagez votre lien et gagnez des analyses gratuites.
          </p>

          {/* How it works */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Partagez",
                desc: "Envoyez votre lien unique à vos proches",
              },
              {
                step: "2",
                title: "Ils économisent",
                desc: "Vos filleuls obtiennent 5€ de réduction",
              },
              {
                step: "3",
                title: "Vous gagnez",
                desc: "Recevez une analyse gratuite par parrainage",
              },
            ].map((item) => (
              <div key={item.step} className="text-center rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Generate code */}
          {!code ? (
            <div className="mt-10 space-y-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Votre email (celui utilisé lors de votre achat)
              </label>
              <input
                type="email"
                placeholder="votre@email.fr"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={!email.includes("@") || loading}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
              >
                {loading ? "Génération..." : "Obtenir mon lien de parrainage"}
              </button>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              <div className="rounded-xl border-2 border-primary bg-orange-50 p-4 dark:bg-orange-950/20">
                <p className="text-xs text-zinc-500 mb-2">Votre lien de parrainage :</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
                  >
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-500 text-center">
                Code promo pour vos filleuls : <strong className="text-primary">{code}</strong> (-5€)
              </p>

              {/* Share buttons */}
              <div className="flex gap-3 justify-center">
                <a
                  href={`https://wa.me/?text=J'ai fait analyser mon devis solaire sur DevisPV, c'est top ! Utilise mon lien pour avoir 5€ de réduc : ${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:?subject=Fais analyser ton devis solaire&body=J'ai utilisé DevisPV pour vérifier mon devis panneaux solaires et c'était vraiment utile. Utilise mon lien pour avoir 5€ de réduction : ${encodeURIComponent(shareUrl)}`}
                  className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
                >
                  Email
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
