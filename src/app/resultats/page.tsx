"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AnalyseDevis } from "@/lib/system-prompt";
import { generatePDF } from "@/lib/export-pdf";

const VERDICT_CONFIG = {
  EXCELLENT: { label: "Excellent", emoji: "✅", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800" },
  BON: { label: "Bon", emoji: "👍", color: "text-orange-600", bg: "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800" },
  MOYEN: { label: "Moyen", emoji: "⚠️", color: "text-amber-600", bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800" },
  A_EVITER: { label: "À éviter", emoji: "🚫", color: "text-red-600", bg: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" },
};

/** Camembert SVG pour le scoring global */
function DonutChart({ scores }: { scores: { label: string; note: number; weight: number; color: string }[] }) {
  const total = scores.reduce((s, x) => s + x.weight, 0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 120 120">
          {scores.map((s, i) => {
            const pct = s.weight / total;
            const dash = pct * circumference;
            const gap = circumference - dash;
            const rotation = (offset / total) * 360 - 90;
            offset += s.weight;
            return (
              <circle
                key={i}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth="18"
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(${rotation} 60 60)`}
                className="transition-all duration-700"
              />
            );
          })}
          <circle cx="60" cy="60" r="38" fill="white" className="dark:fill-zinc-950" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {(scores.reduce((s, x) => s + x.note * x.weight, 0) / total).toFixed(1)}
          </span>
          <span className="text-xs text-zinc-400">/10</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {scores.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {s.label} <span className="font-semibold text-zinc-900 dark:text-zinc-100">{s.note.toFixed(1)}</span>/10
              <span className="text-xs text-zinc-400 ml-1">({s.weight}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ note, label }: { note: number; label: string }) {
  const pct = (note / 10) * 100;
  const color =
    note >= 8 ? "bg-emerald-500" : note >= 6 ? "bg-orange-500" : note >= 4 ? "bg-amber-500" : "bg-red-500";

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{note.toFixed(1)}/10</span>
        </div>
      )}
      <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-3 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Formate un nombre en euros lisible (7 500 €) */
function formatEur(val: number | null | undefined): string | null {
  if (val === null || val === undefined) return null;
  return `${val.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
}

function DataRow({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  const display =
    value === null || value === undefined
      ? "Non mentionné"
      : typeof value === "boolean"
      ? value ? "Oui" : "Non"
      : String(value);

  const isMissing = display === "Non mentionné";

  return (
    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className={`text-sm font-medium text-right ${isMissing ? "text-zinc-400 italic" : "text-zinc-900 dark:text-zinc-100"}`}>
        {display}
      </span>
    </div>
  );
}

/** Section Projection Financière */
function FinancialProjection({ extraction }: { extraction: AnalyseDevis["extraction"] }) {
  const prixTtc = extraction.financier.prix_ttc;
  const productionAn = extraction.installation.production_estimee_kwh;
  const puissanceKwc = extraction.installation.puissance_kwc;

  if (!prixTtc || !productionAn || !puissanceKwc) return null;

  // Paramètres de calcul (source : expert-pv / photovoltaique.info)
  const tauxAutoconsoEst = 0.45; // 45% d'autoconsommation estimé
  const prixElecKwh = 0.2516; // prix moyen TTC 2025
  const tarifRachat = puissanceKwc <= 9 ? 0.1297 : 0.0778; // tarif rachat surplus EDF OA
  const degradation = 0.005; // 0.5%/an dégradation panneaux (garantie linéaire constructeur)
  const augElec = 0.04; // +4%/an prix électricité (hypothèse RTE/CRE)
  const dureeVie = 25;
  const opexAnnuel = prixTtc * 0.01; // OPEX ~1% investissement/an (maintenance, assurance, nettoyage)
  const coutRemplacementOnduleur = prixTtc * 0.12; // remplacement onduleur année 12-15 (~12% CAPEX)

  // Prime autoconsommation (versée sur 5 ans, 1/5 par an)
  let primeParKwc = 0;
  if (puissanceKwc <= 3) primeParKwc = 300;
  else if (puissanceKwc <= 9) primeParKwc = 230;
  else if (puissanceKwc <= 36) primeParKwc = 200;
  else primeParKwc = 100;
  const primeTotal = primeParKwc * puissanceKwc;
  const primeAnnuelle = primeTotal / 5; // versement sur 5 ans

  // Projection année par année
  const coutNet = prixTtc - primeTotal;
  let cumulGains = 0;
  let anneeRetour: number | null = null;
  const projections: { annee: number; production: number; econAutoconsos: number; reventeS: number; opex: number; prime: number; gainAn: number; cumul: number }[] = [];

  for (let a = 1; a <= dureeVie; a++) {
    const prod = productionAn * Math.pow(1 - degradation, a - 1);
    const autoconsoKwh = prod * tauxAutoconsoEst;
    const surplusKwh = prod * (1 - tauxAutoconsoEst);
    const prixElecAnnee = prixElecKwh * Math.pow(1 + augElec, a - 1);
    const econAutoconsos = autoconsoKwh * prixElecAnnee;
    const reventeS = surplusKwh * tarifRachat;
    const prime = a <= 5 ? primeAnnuelle : 0;
    const opex = opexAnnuel + (a === 13 ? coutRemplacementOnduleur : 0); // remplacement onduleur année 13
    const gainAn = econAutoconsos + reventeS + prime - opex;
    cumulGains += gainAn;

    if (anneeRetour === null && cumulGains >= coutNet) {
      anneeRetour = a;
    }

    projections.push({
      annee: a,
      production: Math.round(prod),
      econAutoconsos: Math.round(econAutoconsos),
      reventeS: Math.round(reventeS),
      opex: Math.round(opex),
      prime: Math.round(prime),
      gainAn: Math.round(gainAn),
      cumul: Math.round(cumulGains),
    });
  }

  const gainTotal = Math.round(cumulGains);
  const rendement = ((cumulGains / coutNet - 1) * 100);

  // Points clés pour le graphique simplifié (années 1, 5, 10, 15, 20, 25)
  const keyYears = [1, 5, 10, 15, 20, 25].map(a => projections[a - 1]).filter(Boolean);
  const maxCumul = projections[projections.length - 1]?.cumul || 1;

  return (
    <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
        </svg>
        Projection financière sur 25 ans
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Investissement net", value: formatEur(coutNet), sub: `après prime de ${formatEur(primeTotal)}` },
          { label: "Retour sur investissement", value: anneeRetour ? `${anneeRetour} ans` : "N/A", sub: "temps de retour" },
          { label: "Gains sur 25 ans", value: formatEur(gainTotal), sub: "économies + revente" },
          { label: "Rendement total", value: `${rendement.toFixed(0)}%`, sub: "sur 25 ans" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-zinc-50 p-4 text-center dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{kpi.value}</p>
            <p className="text-xs text-zinc-400">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Graphique barres simplifiées */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Gains cumulés vs Investissement</h3>
        <div className="space-y-2">
          {keyYears.map((p) => {
            const pctGain = (p.cumul / maxCumul) * 100;
            const isPaid = p.cumul >= coutNet;
            return (
              <div key={p.annee} className="flex items-center gap-3">
                <span className="w-16 text-right text-xs font-medium text-zinc-500">An {p.annee}</span>
                <div className="flex-1 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isPaid ? "bg-emerald-500" : "bg-primary"}`}
                    style={{ width: `${pctGain}%` }}
                  />
                  {/* Ligne seuil d'investissement */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-red-500"
                    style={{ left: `${(coutNet / maxCumul) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {formatEur(p.cumul)}
                </span>
              </div>
            );
          })}
          <div className="flex items-center gap-3 mt-1">
            <span className="w-16" />
            <div className="flex-1 flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Seuil investissement ({formatEur(coutNet)})</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Investissement amorti</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
          Voir le détail année par année
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 text-left font-semibold text-zinc-500">Année</th>
                <th className="py-2 text-right font-semibold text-zinc-500">Production</th>
                <th className="py-2 text-right font-semibold text-zinc-500">Économies</th>
                <th className="py-2 text-right font-semibold text-zinc-500">Revente</th>
                <th className="py-2 text-right font-semibold text-zinc-500">Prime</th>
                <th className="py-2 text-right font-semibold text-zinc-500">OPEX</th>
                <th className="py-2 text-right font-semibold text-zinc-500">Gain net</th>
                <th className="py-2 text-right font-semibold text-zinc-500">Cumul</th>
              </tr>
            </thead>
            <tbody>
              {projections.filter((_, i) => i < 10 || (i + 1) % 5 === 0).map((p) => (
                <tr key={p.annee} className={`border-b border-zinc-100 dark:border-zinc-800 ${p.cumul >= coutNet ? "bg-emerald-50/50 dark:bg-emerald-950/10" : ""}`}>
                  <td className="py-1.5 font-medium text-zinc-700 dark:text-zinc-300">An {p.annee}</td>
                  <td className="py-1.5 text-right text-zinc-600 dark:text-zinc-400">{p.production.toLocaleString("fr-FR")} kWh</td>
                  <td className="py-1.5 text-right text-zinc-600 dark:text-zinc-400">{p.econAutoconsos.toLocaleString("fr-FR")} €</td>
                  <td className="py-1.5 text-right text-zinc-600 dark:text-zinc-400">{p.reventeS.toLocaleString("fr-FR")} €</td>
                  <td className="py-1.5 text-right text-emerald-600">{p.prime > 0 ? `+${p.prime.toLocaleString("fr-FR")} €` : "—"}</td>
                  <td className="py-1.5 text-right text-red-500">-{p.opex.toLocaleString("fr-FR")} €</td>
                  <td className="py-1.5 text-right font-medium text-zinc-700 dark:text-zinc-300">{p.gainAn.toLocaleString("fr-FR")} €</td>
                  <td className={`py-1.5 text-right font-bold ${p.cumul >= coutNet ? "text-emerald-600" : "text-zinc-900 dark:text-zinc-100"}`}>
                    {p.cumul.toLocaleString("fr-FR")} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-zinc-400 italic">
          Hypothèses : autoconsommation 45%, prix électricité 0,2516 €/kWh (+4%/an), tarif rachat EDF OA {(tarifRachat * 100).toFixed(2)} c€/kWh (contrat 20 ans), dégradation 0,5%/an, OPEX ~1%/an, remplacement onduleur an 13, prime versée sur 5 ans.
        </p>
      </details>
    </div>
  );
}

export default function ResultatsPage() {
  const [data, setData] = useState<AnalyseDevis | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("analyse-result");
    if (!raw) {
      router.push("/");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.push("/");
    }
  }, [router]);

  const downloadPDF = useCallback(() => {
    if (!data) return;
    const doc = generatePDF(data);
    doc.save("rapport-devis-pv.pdf");
  }, [data]);

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const { extraction, scoring, recommandations } = data;
  const verdict = VERDICT_CONFIG[scoring.verdict] ?? VERDICT_CONFIG.MOYEN;

  const chartScores = [
    { label: "Technique", note: scoring.technique.note, weight: 35, color: "#f59e0b" },
    { label: "Financier", note: scoring.financier.note, weight: 40, color: "#ea580c" },
    { label: "Fiabilité", note: scoring.fiabilite_installateur.note, weight: 25, color: "#16a34a" },
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
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
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Nouvelle analyse
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        {/* Verdict global + Camembert */}
        <div className={`rounded-2xl border p-8 ${verdict.bg}`}>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <div className="text-5xl">{verdict.emoji}</div>
              <h1 className={`mt-3 text-3xl font-extrabold ${verdict.color}`}>
                {verdict.label}
              </h1>
            </div>
            <DonutChart scores={chartScores} />
          </div>
        </div>

        {/* Scores par axe */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { key: "technique" as const, label: "Technique", weight: "35%" },
            { key: "financier" as const, label: "Financier", weight: "40%" },
            { key: "fiabilite_installateur" as const, label: "Fiabilité installateur", weight: "25%" },
          ].map(({ key, label, weight }) => (
            <div key={key} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{label}</h3>
                <span className="text-xs text-zinc-400">({weight})</span>
              </div>
              <ScoreBar note={scoring[key].note} label="" />
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {scoring[key].commentaire}
              </p>
            </div>
          ))}
        </div>

        {/* Projection financière */}
        <FinancialProjection extraction={extraction} />

        {/* Recommandations */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Recommandations
          </h2>
          <ul className="space-y-3">
            {recommandations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-primary dark:bg-orange-900/40">
                  {i + 1}
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Données extraites */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Installation */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              Installation
            </h3>
            <DataRow label="Puissance" value={extraction.installation.puissance_kwc ? `${extraction.installation.puissance_kwc} kWc` : null} />
            <DataRow label="Panneaux" value={extraction.installation.nombre_panneaux} />
            <DataRow label="Marque" value={extraction.installation.marque_panneaux} />
            <DataRow label="Modèle" value={extraction.installation.modele_panneaux} />
            <DataRow label="Technologie" value={extraction.installation.technologie} />
            <DataRow label="Onduleur" value={extraction.installation.onduleur_marque ? `${extraction.installation.onduleur_marque} ${extraction.installation.onduleur_modele ?? ""}` : null} />
            <DataRow label="Type de pose" value={extraction.installation.type_pose} />
            <DataRow label="Production estimée" value={extraction.installation.production_estimee_kwh ? `${extraction.installation.production_estimee_kwh.toLocaleString("fr-FR")} kWh/an` : null} />
            <DataRow label="Valorisation" value={extraction.installation.mode_valorisation} />
          </div>

          {/* Financier */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              Financier
            </h3>
            <DataRow label="Prix HT" value={formatEur(extraction.financier.prix_ht)} />
            <DataRow label="Prix TTC" value={formatEur(extraction.financier.prix_ttc)} />
            <DataRow label="Prix/Wc" value={extraction.financier.prix_par_wc ? `${extraction.financier.prix_par_wc.toFixed(2)} €/Wc` : null} />
            <DataRow label="TVA" value={extraction.financier.tva_pourcent ? `${extraction.financier.tva_pourcent} %` : null} />
            <DataRow label="Prime autoconso" value={extraction.financier.prime_autoconsommation} />
            <DataRow label="Autres aides" value={extraction.financier.autres_aides} />
            <DataRow label="Financement" value={extraction.financier.financement} />
            <DataRow label="Retour annoncé" value={extraction.financier.temps_retour_annonce} />
          </div>

          {/* Installateur */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
              </svg>
              Installateur
            </h3>
            <DataRow label="Raison sociale" value={extraction.installateur.raison_sociale} />
            <DataRow label="SIRET" value={extraction.installateur.siret} />
            <DataRow label="RGE" value={extraction.installateur.rge_qualification} />
            <DataRow label="N° RGE" value={extraction.installateur.rge_numero} />
            <DataRow label="Décennale" value={extraction.installateur.assurance_decennale} />
            <DataRow label="Assureur" value={extraction.installateur.assureur} />
            <DataRow label="Garantie panneaux" value={extraction.installateur.garantie_panneaux_ans ? `${extraction.installateur.garantie_panneaux_ans} ans` : null} />
            <DataRow label="Garantie onduleur" value={extraction.installateur.garantie_onduleur_ans ? `${extraction.installateur.garantie_onduleur_ans} ans` : null} />
            <DataRow label="Garantie installation" value={extraction.installateur.garantie_installation_ans ? `${extraction.installateur.garantie_installation_ans} ans` : null} />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 rounded-xl border-2 border-primary px-8 py-3 text-sm font-semibold text-primary hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Télécharger le rapport PDF
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-orange-500/25 transition-all"
          >
            Analyser un autre devis
          </button>
        </div>
      </main>
    </div>
  );
}
