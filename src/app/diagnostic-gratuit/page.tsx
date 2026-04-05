"use client";

import { useState } from "react";
import { LogoWithText } from "@/components/logo";

interface QuizState {
  step: number;
  puissance: string;
  prix: string;
  marque: string;
  rge: string;
  credit: string;
  email: string;
}

const initialState: QuizState = {
  step: 0,
  puissance: "",
  prix: "",
  marque: "",
  rge: "",
  credit: "",
  email: "",
};

function computeScore(state: QuizState) {
  let score = 0;
  const alerts: string[] = [];
  const positives: string[] = [];

  const puissanceKwc = parseFloat(state.puissance) || 0;
  const prixTotal = parseFloat(state.prix) || 0;

  if (puissanceKwc > 0 && prixTotal > 0) {
    const prixKwc = prixTotal / puissanceKwc;
    if (prixKwc >= 1500 && prixKwc <= 2500) {
      score += 40;
      positives.push("Prix au kWc dans la fourchette normale du marché");
    } else if (prixKwc > 2500 && prixKwc <= 3000) {
      score += 20;
      alerts.push(`Prix au kWc légèrement élevé (${Math.round(prixKwc)} €/kWc)`);
    } else if (prixKwc > 3000) {
      score += 5;
      alerts.push(`Prix au kWc très élevé (${Math.round(prixKwc)} €/kWc) — risque de surcoût`);
    } else if (prixKwc < 1500 && prixKwc > 0) {
      score += 15;
      alerts.push(`Prix au kWc inhabituellement bas (${Math.round(prixKwc)} €/kWc) — vérifiez ce qui est inclus`);
    }
  }

  const marquesReconnues = [
    "dualsun", "sunpower", "jinko", "trina", "rec", "lg",
    "qcells", "longi", "canadian solar", "enphase", "solaredge", "huawei",
    "sma", "fronius",
  ];
  const marqueNorm = state.marque.toLowerCase().trim();
  if (marquesReconnues.some((m) => marqueNorm.includes(m))) {
    score += 25;
    positives.push("Marque de panneaux/onduleur reconnue");
  } else if (marqueNorm.length > 0) {
    score += 10;
    alerts.push("Marque non identifiée comme référence du marché — vérifiez les fiches techniques");
  }

  if (state.rge === "oui") {
    score += 20;
    positives.push("Installateur certifié RGE (obligatoire pour les aides)");
  } else if (state.rge === "non") {
    alerts.push("Installateur non RGE : vous ne pourrez pas bénéficier des aides de l'État");
  } else {
    score += 5;
    alerts.push("Vérifiez la certification RGE sur qualit-enr.org");
  }

  if (state.credit === "non") {
    score += 15;
    positives.push("Pas de crédit intégré au devis");
  } else if (state.credit === "oui") {
    score += 0;
    alerts.push("Crédit intégré au devis — attention au coût total et au taux");
  } else {
    score += 5;
  }

  return { score: Math.min(score, 100), alerts, positives };
}

export default function DiagnosticGratuit() {
  const [state, setState] = useState<QuizState>(initialState);
  const [showResult, setShowResult] = useState(false);
  const [, setEmailSent] = useState(false);

  const update = (field: keyof QuizState, value: string) =>
    setState((prev) => ({ ...prev, [field]: value }));

  const next = () => setState((prev) => ({ ...prev, step: prev.step + 1 }));
  const prev = () => setState((prev) => ({ ...prev, step: prev.step - 1 }));

  const handleSubmitEmail = async () => {
    setShowResult(true);
    setEmailSent(true);

    if (state.email && state.email.includes("@")) {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          source: "diagnostic-gratuit",
          data: {
            puissance: state.puissance,
            prix: state.prix,
            marque: state.marque,
            rge: state.rge,
            credit: state.credit,
          },
        }),
      }).catch(() => {}); // fire and forget
    }
  };

  const result = computeScore(state);

  const steps = [
    <div key="puissance" className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Quelle puissance est proposée ?
      </h2>
      <p className="text-sm text-zinc-500">Indiquée en kWc sur votre devis.</p>
      <div className="grid grid-cols-3 gap-3">
        {["3", "6", "9"].map((v) => (
          <button
            key={v}
            onClick={() => { update("puissance", v); next(); }}
            className={`rounded-xl border-2 p-4 text-center font-semibold transition-colors ${
              state.puissance === v
                ? "border-primary bg-orange-50 text-primary"
                : "border-zinc-200 hover:border-orange-300"
            }`}
          >
            {v} kWc
          </button>
        ))}
      </div>
      <input
        type="number"
        placeholder="Autre puissance (kWc)"
        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
        value={!["3", "6", "9"].includes(state.puissance) ? state.puissance : ""}
        onChange={(e) => update("puissance", e.target.value)}
      />
      {state.puissance && !["3", "6", "9"].includes(state.puissance) && (
        <button onClick={next} className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
          Suivant
        </button>
      )}
    </div>,

    <div key="prix" className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Quel est le montant total TTC ?
      </h2>
      <p className="text-sm text-zinc-500">Le prix global indiqué sur votre devis.</p>
      <div className="relative">
        <input
          type="number"
          placeholder="Ex: 18500"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-12 text-sm focus:border-primary focus:outline-none"
          value={state.prix}
          onChange={(e) => update("prix", e.target.value)}
          autoFocus
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">€</span>
      </div>
      <div className="flex gap-3">
        <button onClick={prev} className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm hover:bg-zinc-50 transition-colors">
          Retour
        </button>
        <button
          onClick={next}
          disabled={!state.prix}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>,

    <div key="marque" className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Quelle marque de panneaux ?
      </h2>
      <p className="text-sm text-zinc-500">Le nom du fabricant de panneaux indiqué sur le devis.</p>
      <input
        type="text"
        placeholder="Ex: DualSun, Jinko, Trina..."
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
        value={state.marque}
        onChange={(e) => update("marque", e.target.value)}
        autoFocus
      />
      <div className="flex gap-3">
        <button onClick={prev} className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm hover:bg-zinc-50 transition-colors">
          Retour
        </button>
        <button
          onClick={next}
          disabled={!state.marque}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>,

    <div key="rge" className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {"L'installateur est-il certifié RGE ?"}
      </h2>
      <p className="text-sm text-zinc-500">La mention RGE doit figurer sur le devis ou sur qualit-enr.org.</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non" },
          { value: "sais_pas", label: "Je ne sais pas" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => { update("rge", opt.value); next(); }}
            className={`rounded-xl border-2 p-4 text-center text-sm font-semibold transition-colors ${
              state.rge === opt.value
                ? "border-primary bg-orange-50 text-primary"
                : "border-zinc-200 hover:border-orange-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button onClick={prev} className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm hover:bg-zinc-50 transition-colors">
        Retour
      </button>
    </div>,

    <div key="credit" className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Le devis inclut-il un crédit ?
      </h2>
      <p className="text-sm text-zinc-500">Un financement ou crédit proposé directement par {"l'installateur"}.</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non" },
          { value: "sais_pas", label: "Je ne sais pas" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => { update("credit", opt.value); next(); }}
            className={`rounded-xl border-2 p-4 text-center text-sm font-semibold transition-colors ${
              state.credit === opt.value
                ? "border-primary bg-orange-50 text-primary"
                : "border-zinc-200 hover:border-orange-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button onClick={prev} className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm hover:bg-zinc-50 transition-colors">
        Retour
      </button>
    </div>,

    <div key="email" className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {"Votre pré-diagnostic est prêt !"}
      </h2>
      <p className="text-sm text-zinc-500">
        Entrez votre email pour recevoir le résultat et nos conseils personnalisés.
      </p>
      <input
        type="email"
        placeholder="votre@email.fr"
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
        value={state.email}
        onChange={(e) => update("email", e.target.value)}
        autoFocus
      />
      <div className="flex gap-3">
        <button onClick={prev} className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm hover:bg-zinc-50 transition-colors">
          Retour
        </button>
        <button
          onClick={handleSubmitEmail}
          disabled={!state.email.includes("@")}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
        >
          Voir mon résultat
        </button>
      </div>
      <button
        onClick={() => setShowResult(true)}
        className="text-sm text-zinc-400 underline hover:text-zinc-600"
      >
        Continuer sans email
      </button>
    </div>,
  ];

  const scoreColor =
    result.score >= 70
      ? "text-green-600"
      : result.score >= 40
        ? "text-orange-500"
        : "text-red-500";

  const scoreLabel =
    result.score >= 70
      ? "Devis a priori correct"
      : result.score >= 40
        ? "Points de vigilance détectés"
        : "Devis préoccupant";

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/">
            <LogoWithText />
          </a>
          <span className="text-sm text-zinc-500">Pré-diagnostic gratuit</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16 bg-gradient-to-b from-orange-50/50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="w-full max-w-lg">
          {!showResult ? (
            <>
              <div className="mb-8">
                <div className="flex justify-between text-xs text-zinc-400 mb-2">
                  <span>Étape {state.step + 1} / 6</span>
                  <span>{Math.round(((state.step + 1) / 6) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-200">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${((state.step + 1) / 6) * 100}%` }}
                  />
                </div>
              </div>

              {steps[state.step]}
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-extrabold ${scoreColor}`}>
                  {result.score}/100
                </div>
                <p className={`mt-2 text-lg font-semibold ${scoreColor}`}>
                  {scoreLabel}
                </p>
              </div>

              {result.alerts.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                    {"Points d'alerte"}
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-300">
                    {result.alerts.map((a, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">!</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.positives.length > 0 && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
                    Points positifs
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-300">
                    {result.positives.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">&#10003;</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl border-2 border-primary bg-orange-50 p-6 text-center dark:bg-orange-950/20">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {"Obtenez l'analyse complète de votre devis"}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Uploadez votre devis et recevez un rapport détaillé : scoring sur 3
                  axes, vérification du matériel, projection financière sur 25 ans et
                  recommandations personnalisées.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <a
                    href="/#single"
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
                  >
                    Analyse complète — 29 €
                  </a>
                  <a
                    href="/#project"
                    className="rounded-xl border-2 border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-orange-50 transition-colors"
                  >
                    Projet complet — 59 €
                  </a>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setState(initialState);
                    setShowResult(false);
                  }}
                  className="text-sm text-zinc-500 underline hover:text-zinc-700"
                >
                  Recommencer le diagnostic
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
