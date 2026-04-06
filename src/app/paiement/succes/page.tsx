"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createProjectSession, addAnalysisToSession, getProjectSession } from "@/lib/storage";

const STEPS = [
  { id: "payment", label: "Paiement", desc: "Confirmation Stripe" },
  { id: "reading", label: "Lecture", desc: "Extraction du devis" },
  { id: "analysis", label: "Analyse", desc: "Scoring expert" },
  { id: "report", label: "Rapport", desc: "G\én\ération du rapport" },
] as const;

type StepStatus = "pending" | "active" | "done" | "error";

function StepIndicator({ steps }: { steps: { label: string; desc: string; status: StepStatus }[] }) {
  return (
    <div className="w-full max-w-sm mx-auto mt-10">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-4">
          {/* Connector + Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                step.status === "done"
                  ? "border-emerald-500 bg-emerald-500"
                  : step.status === "active"
                  ? "border-primary bg-primary animate-pulse"
                  : step.status === "error"
                  ? "border-red-500 bg-red-500"
                  : "border-zinc-300 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800"
              }`}
            >
              {step.status === "done" ? (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : step.status === "active" ? (
                <svg className="h-5 w-5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : step.status === "error" ? (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500">{i + 1}</span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-0.5 h-8 transition-all duration-500 ${
                  step.status === "done" ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              />
            )}
          </div>
          {/* Text */}
          <div className="pt-1.5 pb-4">
            <p
              className={`text-sm font-semibold transition-colors duration-300 ${
                step.status === "done"
                  ? "text-emerald-600"
                  : step.status === "active"
                  ? "text-primary"
                  : step.status === "error"
                  ? "text-red-500"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {step.label}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SuccesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0); // 0=payment, 1=reading, 2=analysis, 3=report
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(["active", "pending", "pending", "pending"]);
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  function advanceStep(step: number) {
    setStepStatuses((prev) => {
      const next = [...prev];
      next[step] = "done";
      if (step + 1 < next.length) next[step + 1] = "active";
      return next;
    });
    setCurrentStep(step + 1);
  }

  function failStep(step: number) {
    setStepStatuses((prev) => {
      const next = [...prev];
      next[step] = "error";
      return next;
    });
  }

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("Session de paiement introuvable.");
      failStep(0);
      return;
    }

    async function processPaymentAndAnalyze() {
      try {
        // Step 1: Verify payment
        const verifyRes = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const verifyData = await verifyRes.json();

        if (!verifyData.paid) {
          throw new Error("Paiement non confirm\é. Veuillez r\éessayer.");
        }

        advanceStep(0); // payment done -> reading

        // Step 2: Read file from sessionStorage
        const fileId = verifyData.fileId;
        const fileRaw = sessionStorage.getItem(`file-${fileId}`);

        if (!fileRaw) {
          throw new Error("Fichier introuvable. Il a peut-\être expir\é. Veuillez refaire l'upload.");
        }

        const fileData = JSON.parse(fileRaw);
        const binaryString = atob(fileData.base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: fileData.type });
        const file = new File([blob], fileData.name, { type: fileData.type });

        // Small delay so user sees "reading" step
        await new Promise((r) => setTimeout(r, 800));
        advanceStep(1); // reading done -> analysis

        // Step 3: Launch analysis
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

        advanceStep(2); // analysis done -> report

        // Step 4: Store result
        const planId = verifyData.planId;
        sessionStorage.setItem("analyse-result", JSON.stringify(analysis));
        sessionStorage.removeItem(`file-${fileId}`);

        if (planId === "project") {
          // Forfait 59€ : sauvegarder dans localStorage pour comparaison
          if (!getProjectSession()) {
            createProjectSession(sessionId || "");
          }
          const stored = addAnalysisToSession(analysis);
          sessionStorage.setItem("last-analysis-id", stored.id);
        }

        await new Promise((r) => setTimeout(r, 600));
        advanceStep(3); // report done

        // Redirect after a brief pause to show completion
        await new Promise((r) => setTimeout(r, 500));
        if (planId === "project") {
          router.push(`/resultats?id=${sessionStorage.getItem("last-analysis-id") || ""}`);
        } else {
          router.push("/resultats");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue.";
        setError(msg);
        // Mark current step as error
        setStepStatuses((prev) => {
          const next = [...prev];
          const activeIdx = next.findIndex((s) => s === "active");
          if (activeIdx >= 0) next[activeIdx] = "error";
          return next;
        });
      }
    }

    processPaymentAndAnalyze();
  }, [searchParams, router]);

  const isError = stepStatuses.includes("error");
  const allDone = stepStatuses.every((s) => s === "done");

  const stepsWithStatus = STEPS.map((step, i) => ({
    label: step.label,
    desc: step.desc,
    status: stepStatuses[i],
  }));

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        {/* Header icon */}
        <div
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${
            isError
              ? "bg-red-100 dark:bg-red-900/40"
              : allDone
              ? "bg-emerald-100 dark:bg-emerald-900/40"
              : "bg-orange-100 dark:bg-orange-900/40"
          }`}
        >
          {isError ? (
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          ) : allDone ? (
            <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {isError
            ? "Une erreur est survenue"
            : allDone
            ? "Analyse termin\ée !"
            : "Analyse de votre devis"}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {isError
            ? error
            : allDone
            ? "Redirection vers votre rapport..."
            : "Notre système expert traite votre devis. Cela prend environ 30 secondes."}
        </p>

        {/* Stepper */}
        <StepIndicator steps={stepsWithStatus} />

        {/* Error action */}
        {isError && (
          <button
            onClick={() => router.push("/")}
            className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-orange-500/25 transition-all"
          >
            Retour \à l&apos;accueil
          </button>
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
