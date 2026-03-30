"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AnalyseDevis } from "@/lib/system-prompt";
import { generatePDF } from "@/lib/export-pdf";

const VERDICT_CONFIG = {
  EXCELLENT: { label: "Excellent", emoji: "✅", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800" },
  BON: { label: "Bon", emoji: "👍", color: "text-blue-600", bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" },
  MOYEN: { label: "Moyen", emoji: "⚠️", color: "text-amber-600", bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800" },
  A_EVITER: { label: "À éviter", emoji: "🚫", color: "text-red-600", bg: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" },
};

function ScoreBar({ note, label }: { note: number; label: string }) {
  const pct = (note / 10) * 100;
  const color =
    note >= 8 ? "bg-emerald-500" : note >= 6 ? "bg-blue-500" : note >= 4 ? "bg-amber-500" : "bg-red-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{note.toFixed(1)}/10</span>
      </div>
      <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-3 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
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
      <span className={`text-sm font-medium ${isMissing ? "text-zinc-400 italic" : "text-zinc-900 dark:text-zinc-100"}`}>
        {display}
      </span>
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
        {/* Verdict global */}
        <div className={`rounded-2xl border p-8 text-center ${verdict.bg}`}>
          <div className="text-5xl">{verdict.emoji}</div>
          <h1 className={`mt-3 text-3xl font-extrabold ${verdict.color}`}>
            {verdict.label}
          </h1>
          <p className="mt-2 text-5xl font-black text-zinc-900 dark:text-zinc-50">
            {scoring.score_global.toFixed(1)}<span className="text-2xl font-semibold text-zinc-500">/10</span>
          </p>
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

        {/* Recommandations */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Recommandations
          </h2>
          <ul className="space-y-3">
            {recommandations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-primary dark:bg-blue-900/40">
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
            <DataRow label="Production estimée" value={extraction.installation.production_estimee_kwh ? `${extraction.installation.production_estimee_kwh} kWh/an` : null} />
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
            <DataRow label="Prix HT" value={extraction.financier.prix_ht ? `${extraction.financier.prix_ht.toLocaleString("fr-FR")} €` : null} />
            <DataRow label="Prix TTC" value={extraction.financier.prix_ttc ? `${extraction.financier.prix_ttc.toLocaleString("fr-FR")} €` : null} />
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
            className="flex items-center gap-2 rounded-xl border-2 border-primary px-8 py-3 text-sm font-semibold text-primary hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Telecharger le rapport PDF
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-blue-500/25 transition-all"
          >
            Analyser un autre devis
          </button>
        </div>
      </main>
    </div>
  );
}
