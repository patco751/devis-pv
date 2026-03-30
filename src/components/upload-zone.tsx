"use client";

import { useState, useCallback, useRef } from "react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type PlanId = "single" | "project";

const PLANS: { id: PlanId; name: string; price: string; desc: string }[] = [
  { id: "single", name: "Analyse unique", price: "59€", desc: "1 devis analysé" },
  { id: "project", name: "Projet complet", price: "89€", desc: "Illimité pendant 2 mois" },
];

export default function UploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("single");
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Format non supporté. Envoyez un PDF, JPG, PNG ou WebP.";
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

  const onSubmit = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Stocker le fichier en base64 dans sessionStorage pour le récupérer après paiement
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        base64,
      };

      // Générer un ID unique pour ce fichier
      const fileId = crypto.randomUUID();
      sessionStorage.setItem(`file-${fileId}`, JSON.stringify(fileData));

      // 2. Créer une session Stripe Checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan, fileId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la création du paiement.");
      }

      const { url } = await res.json();

      // 3. Rediriger vers Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("URL de paiement non reçue.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
      setLoading(false);
    }
  }, [file, selectedPlan]);

  const removeFile = useCallback(() => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Zone de drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-10
          text-center transition-all duration-200
          ${
            dragging
              ? "border-primary bg-blue-50 dark:bg-blue-950/30"
              : "border-zinc-300 bg-zinc-50 hover:border-primary hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-primary dark:hover:bg-blue-950/20"
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

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Glissez votre devis ici
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          ou <span className="text-primary font-medium">cliquez pour choisir un fichier</span>
        </p>
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
          PDF, JPG, PNG ou WebP — {MAX_SIZE_MB} Mo max
        </p>
      </div>

      {/* Fichier sélectionné */}
      {file && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {file.name}
              </p>
              <p className="text-xs text-zinc-400">
                {(file.size / 1024 / 1024).toFixed(1)} Mo
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            className="ml-2 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Supprimer le fichier"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Choix du forfait — visible uniquement si fichier sélectionné */}
      {file && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlan(plan.id);
              }}
              className={`
                rounded-xl border-2 px-4 py-3 text-left transition-all
                ${
                  selectedPlan === plan.id
                    ? "border-primary bg-blue-50 dark:bg-blue-950/30"
                    : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{plan.name}</span>
                <span className={`text-sm font-bold ${selectedPlan === plan.id ? "text-primary" : "text-zinc-500"}`}>
                  {plan.price}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{plan.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Bouton payer et analyser */}
      <button
        onClick={onSubmit}
        disabled={!file || loading}
        className={`
          mt-6 w-full rounded-xl px-6 py-4 text-lg font-semibold text-white
          transition-all duration-200
          ${
            file && !loading
              ? "bg-primary hover:bg-primary-hover shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98]"
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
            Redirection vers le paiement...
          </span>
        ) : file ? (
          `Payer ${PLANS.find((p) => p.id === selectedPlan)?.price} et analyser`
        ) : (
          "Analyser mon devis"
        )}
      </button>

      {/* Mention sécurité */}
      {file && (
        <p className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Paiement sécurisé par Stripe. Vos données restent confidentielles.
        </p>
      )}
    </div>
  );
}
