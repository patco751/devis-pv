"use client";

import { useState, useRef } from "react";
import { LogoWithText } from "@/components/logo";

const ADMIN_CODE = "DEVISPV2026";

export default function AdminAnalyser() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const resultRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setAuthenticated(true);
    } else {
      setError("Code incorrect");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  async function handleAnalyze() {
    if (!file) return;
    setStatus("analyzing");
    setError("");

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

      const analysis = await res.json();
      sessionStorage.setItem("analyse-result", JSON.stringify(analysis));
      resultRef.current = JSON.stringify(analysis);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setStatus("error");
    }
  }

  function viewResults() {
    window.location.href = "/resultats";
  }

  function reset() {
    setFile(null);
    setStatus("idle");
    setError("");
    resultRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-900">
        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <LogoWithText />
            <h1 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Accès admin</h1>
          </div>
          <input
            type="password"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            placeholder="Code d'accès"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            autoFocus
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Accéder
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/"><LogoWithText /></a>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-primary">Admin</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Analyse gratuite</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Uploadez un devis client pour lancer une analyse sans paiement.
        </p>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-950">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
              id="admin-file"
            />
            <label htmlFor="admin-file" className="cursor-pointer">
              {file ? (
                <div>
                  <svg className="mx-auto h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">{file.name}</p>
                  <p className="text-xs text-zinc-400">{(file.size / 1024).toFixed(0)} Ko</p>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-10 w-10 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="mt-2 text-sm text-zinc-500">Cliquez pour sélectionner un devis</p>
                  <p className="text-xs text-zinc-400">PDF, JPG, PNG ou WebP — max 10 Mo</p>
                </div>
              )}
            </label>
          </div>

          {status === "idle" && file && (
            <button
              onClick={handleAnalyze}
              className="w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Lancer {"l'analyse"}
            </button>
          )}

          {status === "analyzing" && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 text-center dark:border-orange-800 dark:bg-orange-950/20">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Analyse en cours...</p>
              <p className="mt-1 text-xs text-zinc-500">Cela prend environ 30 secondes.</p>
            </div>
          )}

          {status === "done" && (
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950/20">
                <svg className="mx-auto h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-3 font-semibold text-green-800 dark:text-green-200">Analyse terminée !</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={viewResults}
                  className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
                >
                  Voir le rapport
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-zinc-300 px-6 py-3 text-sm hover:bg-zinc-50 transition-colors dark:border-zinc-700"
                >
                  Nouveau
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-950/20">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
              <button
                onClick={reset}
                className="w-full rounded-xl border border-zinc-300 px-6 py-3 text-sm hover:bg-zinc-50 transition-colors dark:border-zinc-700"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
