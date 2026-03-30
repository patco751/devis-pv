import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

/**
 * Les deux forfaits disponibles.
 * Les price IDs seront créés dynamiquement via Stripe Checkout.
 */
export const PLANS = {
  single: {
    id: "single",
    name: "Analyse unique",
    description: "Analyse complète d'un seul devis photovoltaïque",
    price: 5900, // centimes
    priceDisplay: "59€",
    analyses: 1,
    validityDays: null,
  },
  project: {
    id: "project",
    name: "Projet complet",
    description: "Analyses illimitées pendant 2 mois sur un même projet",
    price: 8900, // centimes
    priceDisplay: "89€",
    analyses: -1, // illimité
    validityDays: 60,
  },
} as const;

export type PlanId = keyof typeof PLANS;
