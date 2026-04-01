"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllAnalyses, isProjectPlanActive, type StoredAnalysis } from "@/lib/storage";

function ScoreBadge({ note }: { note: number }) {
  const color =
    note >= 8 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
    : note >= 6 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
    : note >= 4 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>
      {note.toFixed(1)}
    </span>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const config: Record<string, { label: string; color: string }> = {
    EXCELLENT: { label: "Excellent", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
    BON: { label: "Bon", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" },
    MOYEN: { label: "Moyen", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
    A_EVITER: { label: "\u00c0 \u00e9viter", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
  };
  const c = config[verdict] ?? config.MOYEN;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${c.color}`}>
      {c.label}
    </span>
  );
}

/** Formate un nombre en euros */
function fmtEur(val: number | null | undefined): string {
  if (val === null || val === undefined) return "N/A";
  return `${val.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} \u20ac`;
}

function globalNote(analysis: StoredAnalysis["analysis"]): number {
  const s = analysis.scoring;
  return (s.technique.note * 35 + s.financier.note * 40 + s.fiabilite_installateur.note * 25) / 100;
}

export default function ComparaisonPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean | null>(null);

  useEffect(() => {
    setIsActive(isProjectPlanActive());
    const all = getAllAnalyses();
    setAnalyses(all);
    setSelected(all.slice(0, 4).map((a) => a.id));
  }, []);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const selectedAnalyses = analyses.filter((a) => selected.includes(a.id));

  if (isActive === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Forfait Projet non actif</h1>
        <p className="mt-2 text-sm text-zinc-500">Souscrivez au forfait Projet pour comparer vos devis.</p>
        <button onClick={() => router.push("/")} className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-all">
          Retour
        </button>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Aucun devis analys&eacute;</h1>
        <p className="mt-2 text-sm text-zinc-500">Analysez au moins 2 devis pour les comparer.</p>
        <button onClick={() => router.push("/projet/analyser")} className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-all">
          Analyser un devis
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
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
            onClick={() => router.push("/projet/analyser")}
            className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouveau devis
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Comparaison de vos devis
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          S&eacute;lectionnez jusqu&apos;&agrave; 4 devis pour les comparer c&ocirc;te &agrave; c&ocirc;te.
        </p>

        {/* S\u00e9lection des devis */}
        <div className="mt-6 flex flex-wrap gap-2">
          {analyses.map((a) => (
            <button
              key={a.id}
              onClick={() => toggleSelection(a.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                selected.includes(a.id)
                  ? "bg-primary text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {selectedAnalyses.length < 2 ? (
          <div className="mt-10 text-center py-16">
            <p className="text-sm text-zinc-500">S&eacute;lectionnez au moins 2 devis pour les comparer.</p>
            {analyses.length < 2 && (
              <button
                onClick={() => router.push("/projet/analyser")}
                className="mt-4 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-all"
              >
                Analyser un autre devis
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tableau comparatif */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-zinc-200 dark:border-zinc-700">
                    <th className="py-3 pr-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-48">Crit&egrave;re</th>
                    {selectedAnalyses.map((a) => (
                      <th key={a.id} className="py-3 px-3 text-center text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-[180px]">
                        <button
                          onClick={() => router.push(`/resultats?id=${a.id}`)}
                          className="hover:text-primary transition-colors"
                        >
                          {a.label}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {/* Verdict */}
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-700 dark:text-zinc-300">Verdict</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center">
                        <VerdictBadge verdict={a.analysis.scoring.verdict} />
                      </td>
                    ))}
                  </tr>

                  {/* Note globale */}
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-700 dark:text-zinc-300">Note globale</td>
                    {selectedAnalyses.map((a) => {
                      const note = globalNote(a.analysis);
                      return (
                        <td key={a.id} className="py-3 px-3 text-center">
                          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{note.toFixed(1)}</span>
                          <span className="text-xs text-zinc-400">/10</span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Technique */}
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-700 dark:text-zinc-300">Technique (35%)</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center">
                        <ScoreBadge note={a.analysis.scoring.technique.note} />
                      </td>
                    ))}
                  </tr>

                  {/* Financier */}
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-700 dark:text-zinc-300">Financier (40%)</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center">
                        <ScoreBadge note={a.analysis.scoring.financier.note} />
                      </td>
                    ))}
                  </tr>

                  {/* Fiabilit\u00e9 */}
                  <tr>
                    <td className="py-3 pr-4 font-medium text-zinc-700 dark:text-zinc-300">Fiabilit&eacute; (25%)</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center">
                        <ScoreBadge note={a.analysis.scoring.fiabilite_installateur.note} />
                      </td>
                    ))}
                  </tr>

                  {/* Separator */}
                  <tr>
                    <td colSpan={selectedAnalyses.length + 1} className="py-2">
                      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Installation</div>
                    </td>
                  </tr>

                  {/* Puissance */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Puissance</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center text-zinc-900 dark:text-zinc-100">
                        {a.analysis.extraction.installation.puissance_kwc
                          ? `${a.analysis.extraction.installation.puissance_kwc} kWc`
                          : "N/A"}
                      </td>
                    ))}
                  </tr>

                  {/* Nb panneaux */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Panneaux</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center text-zinc-900 dark:text-zinc-100">
                        {a.analysis.extraction.installation.nombre_panneaux ?? "N/A"}
                      </td>
                    ))}
                  </tr>

                  {/* Marque panneaux */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Marque panneaux</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center text-zinc-900 dark:text-zinc-100">
                        {a.analysis.extraction.installation.marque_panneaux ?? "N/A"}
                      </td>
                    ))}
                  </tr>

                  {/* Onduleur */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Onduleur</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center text-zinc-900 dark:text-zinc-100">
                        {a.analysis.extraction.installation.onduleur_marque ?? "N/A"}
                      </td>
                    ))}
                  </tr>

                  {/* Production */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Production estim&eacute;e</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center text-zinc-900 dark:text-zinc-100">
                        {a.analysis.extraction.installation.production_estimee_kwh
                          ? `${a.analysis.extraction.installation.production_estimee_kwh.toLocaleString("fr-FR")} kWh`
                          : "N/A"}
                      </td>
                    ))}
                  </tr>

                  {/* Separator Financier */}
                  <tr>
                    <td colSpan={selectedAnalyses.length + 1} className="py-2">
                      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Financier</div>
                    </td>
                  </tr>

                  {/* Prix TTC */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Prix TTC</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center font-semibold text-zinc-900 dark:text-zinc-100">
                        {fmtEur(a.analysis.extraction.financier.prix_ttc)}
                      </td>
                    ))}
                  </tr>

                  {/* Prix/Wc */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Prix/Wc</td>
                    {selectedAnalyses.map((a) => {
                      const ppw = a.analysis.extraction.financier.prix_par_wc;
                      const isGood = ppw !== null && ppw !== undefined && ppw <= 2.5;
                      return (
                        <td key={a.id} className={`py-3 px-3 text-center font-semibold ${isGood ? "text-emerald-600" : "text-zinc-900 dark:text-zinc-100"}`}>
                          {ppw ? `${ppw.toFixed(2)} \u20ac/Wc` : "N/A"}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Retour annonc\u00e9 */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Retour annonc&eacute;</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center text-zinc-900 dark:text-zinc-100">
                        {a.analysis.extraction.financier.temps_retour_annonce ?? "N/A"}
                      </td>
                    ))}
                  </tr>

                  {/* Separator Installateur */}
                  <tr>
                    <td colSpan={selectedAnalyses.length + 1} className="py-2">
                      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Installateur</div>
                    </td>
                  </tr>

                  {/* Installateur */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Installateur</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center text-zinc-900 dark:text-zinc-100">
                        {a.analysis.extraction.installateur.raison_sociale ?? "N/A"}
                      </td>
                    ))}
                  </tr>

                  {/* RGE */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">RGE</td>
                    {selectedAnalyses.map((a) => {
                      const rge = a.analysis.extraction.installateur.rge_qualification;
                      return (
                        <td key={a.id} className={`py-3 px-3 text-center font-medium ${rge ? "text-emerald-600" : "text-red-500"}`}>
                          {rge ?? "Non mentionn\u00e9"}
                        </td>
                      );
                    })}
                  </tr>

                  {/* D\u00e9cennale */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">D&eacute;cennale</td>
                    {selectedAnalyses.map((a) => {
                      const dec = a.analysis.extraction.installateur.assurance_decennale;
                      return (
                        <td key={a.id} className={`py-3 px-3 text-center font-medium ${dec ? "text-emerald-600" : "text-red-500"}`}>
                          {dec === true ? "Oui" : dec === false ? "Non" : "Non mentionn\u00e9"}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Garanties */}
                  <tr>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">Garantie panneaux</td>
                    {selectedAnalyses.map((a) => (
                      <td key={a.id} className="py-3 px-3 text-center text-zinc-900 dark:text-zinc-100">
                        {a.analysis.extraction.installateur.garantie_panneaux_ans
                          ? `${a.analysis.extraction.installateur.garantie_panneaux_ans} ans`
                          : "N/A"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommandation */}
            {selectedAnalyses.length >= 2 && (
              <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-950/30">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  Notre recommandation
                </h2>
                {(() => {
                  const sorted = [...selectedAnalyses].sort((a, b) => globalNote(b.analysis) - globalNote(a.analysis));
                  const best = sorted[0];
                  const bestNote = globalNote(best.analysis);
                  return (
                    <div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        Le devis <strong className="text-primary">{best.label}</strong> obtient la meilleure note globale
                        avec <strong>{bestNote.toFixed(1)}/10</strong>.
                      </p>
                      {sorted.length > 1 && (
                        <p className="mt-2 text-xs text-zinc-500">
                          {sorted.slice(1).map((a, i) => (
                            <span key={a.id}>
                              {i > 0 && ", "}
                              {a.label} ({globalNote(a.analysis).toFixed(1)}/10)
                            </span>
                          ))}
                        </p>
                      )}
                      <p className="mt-3 text-xs text-zinc-400 italic">
                        Cette recommandation est g&eacute;n&eacute;r&eacute;e automatiquement. Consultez chaque rapport d&eacute;taill&eacute; pour une analyse compl&egrave;te.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push("/projet/analyser")}
                className="flex items-center gap-2 rounded-xl border-2 border-primary px-8 py-3 text-sm font-semibold text-primary hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Analyser un autre devis
              </button>
              <button
                onClick={() => router.push("/")}
                className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-orange-500/25 transition-all"
              >
                Retour &agrave; l&apos;accueil
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
