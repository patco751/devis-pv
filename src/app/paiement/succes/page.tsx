"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "analyzing" | "done" | "error">("verifying");
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("Session de paiement introuvable.");
      setStatus("error");
      return;
    }

    async function processPaymentAndAnalyze() {
      try {
        // 1. Vérifier le paiement
        const verifyRes = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const verifyData = await verifyRes.json();

        if (!verifyData.paid) {
          throw new Error("Paiement non confirmé. Veuillez réessayer.");
        }

        setStatus("analyzing");

        // 2. Récupérer le fichier depuis sessionStorage
        const fileId = verifyData.fileId;
        const fileRaw = sessionStorage.getItem(`file-${fileId}`);

        if (!fileRaw) {
          throw new Error(
            "Fichier introuvable. Il a peut-être expiré. Veuillez refaire l'upload."
          );
        }

        const fileData = JSON.parse(fileRaw);

        // Convertir base64 en File
        const binaryString = atob(fileData.base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: fileData.type });
        const file = new File([blob], fileData.name, { type: fileData.type });

        // 3. Lancer l'analyse
        const formData = new FormData();
        formData.append("file", file);

        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!analyzeRes.ok) {
          const data = await analyzeRes.json().catch(() => ({}));
          throw new Error(data.error || "Erreur lors de l'analyse.");
        }

        const analysis = await analyzeRes.json();

        // 4. Stocker le résultat et rediriger
        sessionStorage.setItem("analyse-result", JSON.stringify(analysis));
        sessionStorage.removeItem(`file-${fileId}`);

        setStatus("done");
        router.push("/resultats");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
        setStatus("error");
      }
    }

    processPaymentAndAnalyze();
  }, [searchParams, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <svg className="h-8 w-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Vérification du paiement...
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Nous confirmons votre paiement avec Stripe.
            </p>
          </>
        )}

        {status === "analyzing" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
              <svg className="h-8 w-8 animate-spin text-amber-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Analyse en cours...
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Notre IA experte analyse votre devis photovoltaïque. Cela prend environ 30 secondes.
            </p>
            <div className="mt-6 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div className="h-2 rounded-full bg-primary animate-pulse" style={{ width: "70%" }} />
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Oups, une erreur est survenue
            </h1>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Retour à l'accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SuccesContent />
    </Suspense>
  );
}
