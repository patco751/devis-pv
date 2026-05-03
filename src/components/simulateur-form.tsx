"use client";

import { useState } from "react";
import { cities, getCity } from "@/lib/cities-data";

const ELECTRICITY_PRICE = 0.194;
const SURPLUS_PRICE = 0.04;
const AUTOCONSO_RATE = 0.4;

const ORIENTATION: Record<string, { label: string; coeff: number }> = {
  sud: { label: "Sud", coeff: 1.0 },
  "sud-est": { label: "Sud-Est", coeff: 0.95 },
  "sud-ouest": { label: "Sud-Ouest", coeff: 0.95 },
  est: { label: "Est", coeff: 0.85 },
  ouest: { label: "Ouest", coeff: 0.85 },
};

const INCLINAISON: Record<string, { label: string; desc: string; coeff: number }> = {
  plat: { label: "Plat", desc: "0–10°", coeff: 0.9 },
  faible: { label: "Faible", desc: "10–25°", coeff: 0.95 },
  optimal: { label: "Optimal", desc: "25–35°", coeff: 1.0 },
  fort: { label: "Fort", desc: "35–45°", coeff: 0.95 },
};

type Power = 3 | 6 | 9;

const INSTALL: Record<Power, { min: number; max: number; median: number; panels: number; surface: number; prime: number }> = {
  3: { min: 6500, max: 8000, median: 7250, panels: 8, surface: 14, prime: 240 },
  6: { min: 12000, max: 13500, median: 12750, panels: 15, surface: 26, prime: 480 },
  9: { min: 16000, max: 17500, median: 16750, panels: 22, surface: 38, prime: 720 },
};

interface Result {
  power: Power;
  panels: number;
  surface: number;
  productionAnnuelle: number;
  economiesAnnuelles: number;
  coutMin: number;
  coutMax: number;
  coutMedian: number;
  prime: number;
  coutNet: number;
  retourAnnees: number;
  economies25ans: number;
  consoAnnuelle: number;
  cityName: string;
}

function calculate(citySlug: string, factureMensuelle: number, orient: string, inclin: string): Result | null {
  const city = getCity(citySlug);
  if (!city || factureMensuelle <= 0) return null;

  const consoAnnuelle = (factureMensuelle * 12) / ELECTRICITY_PRICE;

  let power: Power = 3;
  if (consoAnnuelle >= 8000) power = 9;
  else if (consoAnnuelle >= 4000) power = 6;

  const orientCoeff = ORIENTATION[orient]?.coeff ?? 1;
  const inclinCoeff = INCLINAISON[inclin]?.coeff ?? 1;
  const productionAnnuelle = power * city.avgProduction * orientCoeff * inclinCoeff;

  const autoconsoKwh = productionAnnuelle * AUTOCONSO_RATE;
  const surplusKwh = productionAnnuelle * (1 - AUTOCONSO_RATE);
  const economiesAnnuelles = autoconsoKwh * ELECTRICITY_PRICE + surplusKwh * SURPLUS_PRICE;

  const data = INSTALL[power];
  const coutNet = data.median - data.prime;
  const retourAnnees = Math.round((coutNet / economiesAnnuelles) * 10) / 10;
  const economies25ans = economiesAnnuelles * 25 - coutNet;

  return {
    power,
    panels: data.panels,
    surface: data.surface,
    productionAnnuelle: Math.round(productionAnnuelle),
    economiesAnnuelles: Math.round(economiesAnnuelles),
    coutMin: data.min,
    coutMax: data.max,
    coutMedian: data.median,
    prime: data.prime,
    coutNet,
    retourAnnees,
    economies25ans: Math.round(economies25ans),
    consoAnnuelle: Math.round(consoAnnuelle),
    cityName: city.name,
  };
}

const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));

export default function SimulateurForm() {
  const [ville, setVille] = useState("");
  const [facture, setFacture] = useState("");
  const [orientation, setOrientation] = useState("");
  const [inclinaison, setInclinaison] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "sent">("idle");

  const isValid = ville && facture && orientation && inclinaison;

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const r = calculate(ville, parseFloat(facture), orientation, inclinaison);
    setResult(r);
    if (r) {
      setTimeout(() => {
        document.getElementById("simulateur-resultats")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || !result) return;
    setEmailStatus("loading");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "simulateur",
          data: {
            ville: result.cityName,
            puissance: `${result.power} kWc`,
            production: `${result.productionAnnuelle} kWh/an`,
            economies: `${result.economiesAnnuelles} €/an`,
          },
        }),
      });
    } catch {}
    setEmailStatus("sent");
  }

  const fmt = (n: number) => n.toLocaleString("fr-FR");

  return (
    <div className="space-y-10">
      <form onSubmit={handleCalculate} className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="ville" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Votre ville
            </label>
            <select
              id="ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="">Sélectionnez votre ville</option>
              {sortedCities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.department})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="facture" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Facture électrique mensuelle
            </label>
            <div className="relative">
              <input
                id="facture"
                type="number"
                min="30"
                max="500"
                placeholder="Ex : 120"
                value={facture}
                onChange={(e) => setFacture(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-16 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">€/mois</span>
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Orientation de votre toit
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ORIENTATION).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOrientation(key)}
                  className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    orientation === key
                      ? "border-primary bg-orange-50 text-primary dark:bg-orange-950/30"
                      : "border-zinc-200 text-zinc-600 hover:border-orange-300 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Inclinaison de votre toit
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(INCLINAISON).map(([key, { label, desc }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setInclinaison(key)}
                  className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    inclinaison === key
                      ? "border-primary bg-orange-50 text-primary dark:bg-orange-950/30"
                      : "border-zinc-200 text-zinc-600 hover:border-orange-300 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {label} <span className="text-xs opacity-60">({desc})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="mt-8 w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Calculer mes économies
        </button>
      </form>

      {result && (
        <div id="simulateur-resultats" className="space-y-8">
          <div className="rounded-2xl border-2 border-primary bg-gradient-to-b from-orange-50 to-white p-6 sm:p-8 text-center dark:from-orange-950/20 dark:to-zinc-950">
            <p className="text-sm font-medium text-zinc-500">Économies estimées sur 25 ans</p>
            <div className="mt-2 text-5xl font-extrabold text-primary">{fmt(result.economies25ans)} €</div>
            <p className="mt-2 text-sm text-zinc-500">
              pour une installation de {result.power} kWc à {result.cityName}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{fmt(result.productionAnnuelle)}</div>
              <p className="mt-1 text-xs text-zinc-500">kWh produits / an</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{fmt(result.economiesAnnuelles)} €</div>
              <p className="mt-1 text-xs text-zinc-500">économies / an</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{result.retourAnnees} ans</div>
              <p className="mt-1 text-xs text-zinc-500">retour sur investissement</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{result.power} kWc</div>
              <p className="mt-1 text-xs text-zinc-500">{result.panels} panneaux · {result.surface} m²</p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Détail financier</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-600 dark:text-zinc-400">Coût installation (fourchette)</dt>
                <dd className="font-semibold text-zinc-900 dark:text-zinc-100">{fmt(result.coutMin)} – {fmt(result.coutMax)} €</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600 dark:text-zinc-400">Prime autoconsommation</dt>
                <dd className="font-semibold text-green-600">- {fmt(result.prime)} €</dd>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between dark:border-zinc-700">
                <dt className="text-zinc-600 dark:text-zinc-400">Coût net estimé</dt>
                <dd className="font-semibold text-zinc-900 dark:text-zinc-100">{fmt(result.coutNet)} €</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600 dark:text-zinc-400">Votre consommation annuelle</dt>
                <dd className="font-semibold text-zinc-900 dark:text-zinc-100">{fmt(result.consoAnnuelle)} kWh</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-zinc-400">
              Estimation indicative basée sur {AUTOCONSO_RATE * 100}% {"d'autoconsommation"}, un tarif EDF de {ELECTRICITY_PRICE} €/kWh
              et un rachat surplus à {SURPLUS_PRICE} €/kWh. Les aides peuvent varier.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-primary bg-orange-50 p-6 text-center dark:bg-orange-950/20">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Vous avez déjà reçu un devis ?
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Vérifiez si le prix, le matériel et {"l'installateur"} sont conformes au marché.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/diagnostic-gratuit"
                className="rounded-xl border-2 border-green-600 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors dark:text-green-300"
              >
                Pré-diagnostic gratuit
              </a>
              <a
                href="/#upload"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Analyse complète — 29 €
              </a>
            </div>
          </div>

          {emailStatus === "sent" ? (
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950/20">
              <svg className="mx-auto h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-3 font-semibold text-green-800 dark:text-green-200">Estimation envoyée !</p>
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">Vérifiez votre boîte mail.</p>
            </div>
          ) : (
            <form onSubmit={handleEmail} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recevez cette estimation par email</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  disabled={emailStatus === "loading"}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {emailStatus === "loading" ? "Envoi..." : "Recevoir par email"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
