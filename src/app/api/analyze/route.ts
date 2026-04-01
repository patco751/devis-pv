import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { SYSTEM_PROMPT, OUTPUT_SCHEMA } from "@/lib/system-prompt";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const ACCEPTED_MIME: Record<string, ImageMediaType | "application/pdf"> = {
  "application/pdf": "application/pdf",
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
};

export async function POST(request: NextRequest) {
  try {
    // --- Vérifier la clé API ---
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Clé API Anthropic non configurée." },
        { status: 500 }
      );
    }

    // --- Récupérer le fichier ---
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "Aucun fichier envoyé." },
        { status: 400 }
      );
    }

    // --- Validations ---
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "Fichier trop volumineux (max 10 Mo)." },
        { status: 400 }
      );
    }

    const mediaType = ACCEPTED_MIME[file.type];
    if (!mediaType) {
      return Response.json(
        { error: "Format non supporté. Envoyez un PDF, JPG, PNG ou WebP." },
        { status: 400 }
      );
    }

    // --- Lire le fichier en base64 ---
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // --- Construire le contenu pour Claude ---
    const isPdf = mediaType === "application/pdf";

    const fileContent: Anthropic.ContentBlockParam = isPdf
      ? {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64Data,
          },
        }
      : {
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType as ImageMediaType,
            data: base64Data,
          },
        };

    const userMessage = `Voici un devis photovoltaïque à analyser.

Analyse ce devis et fournis ta réponse au format JSON strict suivant ce schéma :
${JSON.stringify(OUTPUT_SCHEMA, null, 2)}

IMPORTANT : Réponds UNIQUEMENT avec le JSON, sans texte avant ni après.`;

    // --- Appeler Claude ---
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            fileContent,
            { type: "text", text: userMessage },
          ],
        },
      ],
    });

    // --- Extraire la réponse JSON ---
    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return Response.json(
        { error: "Réponse vide du système d'analyse." },
        { status: 500 }
      );
    }

    // Nettoyer le texte (enlever les éventuels backticks markdown)
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const analysis = JSON.parse(jsonText);

    return Response.json(analysis);
  } catch (error) {
    console.error("Erreur analyse:", error);

    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Le système n'a pas pu produire une analyse structurée. Réessayez." },
        { status: 500 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Erreur interne du serveur.";
    return Response.json({ error: message }, { status: 500 });
  }
}
