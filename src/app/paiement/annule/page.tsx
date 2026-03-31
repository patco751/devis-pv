"use client";

import { useRouter } from "next/navigation";

export default function AnnulePage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Paiement annulé
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Votre paiement a été annulé. Aucun montant n'a été débité.
          Votre devis est toujours disponible.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-orange-500/25 transition-all"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
