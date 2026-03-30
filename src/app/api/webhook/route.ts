import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { planId, fileId } = session.metadata ?? {};

      console.log(
        `[Webhook] Paiement réussi — plan: ${planId}, fichier: ${fileId}, session: ${session.id}`
      );

      // TODO: Quand on ajoutera une base de données,
      // on stockera ici le statut "payé" pour ce fileId.
      // Pour l'instant, la vérification se fait côté client via session_id.
      break;
    }

    default:
      // Événements non gérés
      break;
  }

  return Response.json({ received: true });
}
