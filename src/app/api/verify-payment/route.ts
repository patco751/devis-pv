import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

/**
 * Vérifie qu'une session Stripe Checkout est bien payée.
 * Retourne les metadata (planId, fileId) si OK.
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return Response.json(
        { error: "session_id manquant." },
        { status: 400 }
      );
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return Response.json(
        { error: "Paiement non confirmé.", paid: false },
        { status: 402 }
      );
    }

    return Response.json({
      paid: true,
      planId: session.metadata?.planId,
      fileId: session.metadata?.fileId,
      customerEmail: session.customer_details?.email,
    });
  } catch (error) {
    console.error("Erreur vérification paiement:", error);
    return Response.json(
      { error: "Session introuvable ou invalide." },
      { status: 400 }
    );
  }
}
