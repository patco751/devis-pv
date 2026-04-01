/**
 * Gestion du stockage localStorage pour le forfait Projet (59€).
 * Stocke les analyses multiples et l'état du plan.
 */

import type { AnalyseDevis } from "@/lib/system-prompt";

export interface StoredAnalysis {
  id: string;
  label: string;
  createdAt: string;
  analysis: AnalyseDevis;
}

export interface ProjectSession {
  planId: "single" | "project";
  stripeSessionId: string;
  createdAt: string;
  expiresAt: string; // createdAt + 60 jours
  analyses: StoredAnalysis[];
}

const STORAGE_KEY = "devispv-session";

export function getProjectSession(): ProjectSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProjectSession;
  } catch {
    return null;
  }
}

export function saveProjectSession(session: ProjectSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function isProjectPlanActive(): boolean {
  const session = getProjectSession();
  if (!session) return false;
  if (session.planId !== "project") return false;
  return new Date(session.expiresAt) > new Date();
}

export function createProjectSession(stripeSessionId: string): ProjectSession {
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + 60);

  const session: ProjectSession = {
    planId: "project",
    stripeSessionId,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    analyses: [],
  };
  saveProjectSession(session);
  return session;
}

export function addAnalysisToSession(analysis: AnalyseDevis, label?: string): StoredAnalysis {
  let session = getProjectSession();
  if (!session) {
    // Fallback : creer une session si elle n'existe pas
    session = {
      planId: "project",
      stripeSessionId: "unknown",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      analyses: [],
    };
  }

  const defaultLabel =
    label ||
    analysis.extraction.installateur.raison_sociale ||
    `Devis ${session.analyses.length + 1}`;

  const stored: StoredAnalysis = {
    id: crypto.randomUUID(),
    label: defaultLabel,
    createdAt: new Date().toISOString(),
    analysis,
  };

  session.analyses.push(stored);
  saveProjectSession(session);
  return stored;
}

export function getAnalysisById(id: string): StoredAnalysis | null {
  const session = getProjectSession();
  if (!session) return null;
  return session.analyses.find((a) => a.id === id) ?? null;
}

export function getAllAnalyses(): StoredAnalysis[] {
  const session = getProjectSession();
  if (!session) return [];
  return session.analyses;
}

export function getAnalysisCount(): number {
  return getAllAnalyses().length;
}
