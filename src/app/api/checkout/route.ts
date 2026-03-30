import { NextRequest } from "next/server";
import { getStripe, PLANS, type PlanId } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, fileId } = body as { planId: string; fileId: string };

    // Valider le plan
    if (!planId || !(planId in PLANS)) {
      return Response.json(
        { error: "Forfait invalide." },
        { status: 400 }
      );
    }

    if (!fileId) {
      return Response.json(
        { error: "Aucun fichier associé." },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as PlanId];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Créer la session Checkout
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId,
        fileId,
      },
      success_url: `${baseUrl}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/paiement/annule`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Erreur checkout:", error);
    const message =
      error instanceof Error ? error.message : "Erreur lors de la création du paiement.";
    return Response.json({ error: message }, { status: 500 });
  }
}
