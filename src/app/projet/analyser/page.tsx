"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isProjectPlanActive, addAnalysisToSession, getAnalysisCount } from "@/lib/storage";
import type { AnalyseDevis } from "@/lib/system-prompt";
import { LogoWithText } from "@/components/logo";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function ProjetAnalyserPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "analyzing" | "done">("upload");
  const [isActive, setIsActive] = useState<boolean | null>(null); // null = loading
  const [count, setCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsActive(isProjectPlanActive());
    setCount(getAnalysisCount());
  }, []);

  const validate = useCallback((f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Format non support\é. Envoyez un PDF, JPG, PNG ou WebP.";
    }
    if (f.size > MAX_SIZE_BYTES) {
      return `Fichier trop volumineux (max ${MAX_SIZE_MB} Mo).`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const err = validate(f);
      if (err) {
        setError(err);
        setFile(null);
        return;
      }
      setError(null);
      setFile(f);
    },
    [validate]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const removeFile = useCallback(() => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const onSubmit = useCallback(async () => {
    if (!file || !isActive) return;
    setLoading(true);
    setError(null);
    setStep("analyzing");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'analyse.");
      }

      const analysis: AnalyseDevis = await res.json();

      // Sauvegarder dans localStorage
      const stored = addAnalysisToSession(analysis);

      setStep("done");

      // Rediriger vers les r\ésultats
      await new Promise((r) => setTimeout(r, 500));
      router.push(`/resultats?id=${stored.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
      setStep("upload");
      setLoading(false);
    }
  }, [file, isActive, router]);

  // Chargement initial
  if (isActive === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
            <a href="/" className="flex items-center gap-2">
              <LogoWithText />
            </a>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Forfait Projet non actif</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            Vous n&apos;avez pas de forfait Projet actif ou celui-ci a expir&eacute;.
            Souscrivez au forfait Projet (59&euro;) pour analyser et comparer plusieurs devis.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-orange-500/25 transition-all"
          >
            Retour &agrave; l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <LogoWithText />
          </a>
          <button
            onClick={() => router.push("/comparaison")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir mes devis ({count})
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl px-6 py-16">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Analyser un nouveau devis
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Forfait Projet actif &mdash; {count} devis d&eacute;j&agrave; analys&eacute;{count > 1 ? "s" : ""}
          </p>
        </div>

        {step === "analyzing" ? (
          <div className="text-center py-16">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Analyse en cours...
            </p>
            <p className="mt-1 text-xs text-zinc-400">Cela prend environ 30 secondes.</p>
          </div>
        ) : (
          <>
            {/* Zone de drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative cursor-pointer rounded-2xl border-2 border-dashed p-10
                text-center transition-all duration-200
                ${dragging
                  ? "border-primary bg-orange-50 dark:bg-orange-950/30"
                  : "border-zinc-300 bg-zinc-50 hover:border-primary hover:bg-orange-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-primary dark:hover:bg-orange-950/20"
                }
              `}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={onFileChange}
                className="hidden"
              />

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>

              <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                Glissez votre devis ici
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                ou <span className="text-primary font-medium">cliquez pour choisir un fichier</span>
              </p>
              <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                PDF, JPG, PNG ou WebP &mdash; {MAX_SIZE_MB} Mo max
              </p>
            </div>

            {/* Fichier s\électionn\é */}
            {file && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{file.name}</p>
                    <p className="text-xs text-zinc-400">{(file.size / 1024 / 1024).toFixed(1)} Mo</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="ml-2 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Bouton analyser (pas de paiement) */}
            <button
              onClick={onSubmit}
              disabled={!file || loading}
              className={`
                mt-6 w-full rounded-xl px-6 py-4 text-lg font-semibold text-white
                transition-all duration-200
                ${file && !loading
                  ? "bg-primary hover:bg-primary-hover shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98]"
                  : "cursor-not-allowed bg-zinc-300 dark:bg-zinc-700"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyse en cours...
                </span>
              ) : (
                "Analyser ce devis"
              )}
            </button>

            <p className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Inclus dans votre forfait Projet. Aucun paiement suppl&eacute;mentaire.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
