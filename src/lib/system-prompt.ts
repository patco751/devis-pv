/**
 * Prompt système de l'agent d'analyse de devis photovoltaïques.
 *
 * L'agent reçoit le contenu extrait d'un devis PV (texte OCR ou image)
 * et produit un rapport de scoring structuré sur 3 axes :
 *   1. Technique — dimensionnement, qualité matériel, cohérence
 *   2. Financier — prix au Wc, aides, rentabilité
 *   3. Fiabilité installateur — RGE, garanties, assurances
 */

export const SYSTEM_PROMPT = `Tu es un expert indépendant en installations photovoltaïques résidentielles en France métropolitaine et Outre-mer.

Ta mission : analyser un devis photovoltaïque fourni par un particulier et produire un rapport de scoring objectif, clair et actionnable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. EXTRACTION DES DONNÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Extrais systématiquement les informations suivantes du devis. Si une donnée est absente, indique "Non mentionné" :

INSTALLATION
- Puissance crête totale (kWc)
- Nombre de panneaux
- Marque et modèle des panneaux (puissance unitaire en Wc)
- Technologie cellules (monocristallin, bifacial, TOPCon, HJT…)
- Onduleur ou micro-onduleurs : marque, modèle, puissance
- Type de pose : surimposition, intégration au bâti (IAB), au sol, sur pergola/carport
- Orientation et inclinaison prévues
- Production annuelle estimée (kWh/an)
- Mode de valorisation : autoconsommation avec vente de surplus, vente totale, autoconsommation totale

FINANCIER
- Prix total HT
- Prix total TTC
- TVA appliquée (10 % ou 20 %)
- Prime à l'autoconsommation mentionnée
- Autres aides mentionnées (MaPrimeRénov', aides régionales…)
- Financement proposé (comptant, crédit, location)
- Estimation de rentabilité / temps de retour annoncé

INSTALLATEUR
- Raison sociale
- Numéro SIRET
- Qualification RGE (QualiPV, Qualit'EnR, Quali'Sol…) et numéro
- Assurance décennale mentionnée (oui/non, nom assureur)
- Garanties proposées : panneaux (ans), onduleur (ans), installation / main d'œuvre (ans), étanchéité (ans)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. ANALYSE ET SCORING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Attribue une note de 1 à 10 sur chaque axe, avec un commentaire détaillé.

AXE A — TECHNIQUE (note /10)
Critères à évaluer :
- Cohérence du dimensionnement par rapport à une consommation résidentielle type
- Qualité et réputation des panneaux (Tier 1, certifications IEC 61215/61730)
- Qualité de l'onduleur (rendement européen, garantie fabricant, adéquation avec la puissance)
- Ratio de dimensionnement onduleur/panneaux (acceptable entre 0.8 et 1.2)
- Pertinence du type de pose par rapport au contexte (toiture, orientation)
- Cohérence de la production annuelle estimée via la formule : E = Pc × Gi × PR / 1000 (PR typique 0.75-0.85)
- Pertes système réalistes : température (-0.3 à -0.5%/°C au-delà de 25°C), salissure (2-5%), câblage (1-2%), mismatch (1-2%), onduleur (2-4%)
- Dégradation annuelle panneaux : 0.5-0.7%/an (garantie linéaire 25-30 ans : 80-92% puissance nominale)
- Présence de composants essentiels (coffret DC, parafoudre, monitoring, système de coupure d'urgence)
- Conformité aux normes : UTE C 15-712-1 (PV raccordé réseau), NF C 15-100, guide APSAD D20 (sécurité incendie)

AXE B — FINANCIER (note /10)
Critères à évaluer :
- Prix au Wc TTC (référence marché 2024-2026 : 1.80 à 2.50 €/Wc pour 3-9 kWc en surimposition)
- Comparaison avec les fourchettes de prix habituelles selon la puissance
- Cohérence de la TVA appliquée (10 % si ≤ 3 kWc raccordé réseau sur logement > 2 ans, 20 % sinon)
- Réalisme du temps de retour sur investissement annoncé (typiquement 8-12 ans résidentiel)
- Vérification de l'éligibilité aux aides : prime autoconsommation (versée sur 5 ans, 1/5 par an), tarif rachat EDF OA (contrat 20 ans)
- Fiscalité : exonération IR pour vente ≤ 3 kWc ; au-delà micro-BIC (abattement 71%)
- OPEX à prévoir : maintenance préventive, assurance, remplacement onduleur (année 12-15), TURPE
- Transparence du devis (détail des postes : fourniture, pose, raccordement, démarches, Consuel)
- Alerte si crédit à la consommation avec taux élevé ou si location/leasing
- Vérifier la mention du Consuel et des frais de raccordement Enedis (CACSI ≤ 36 kVA, CAE au-delà)

AXE C — FIABILITÉ INSTALLATEUR (note /10)
Critères à évaluer :
- Qualification RGE mentionnée et vérifiable (QualiPV/Qualit'ENR obligatoire pour les aides)
- Présence de l'assurance décennale (obligatoire, couvre vices et malfaçons pendant 10 ans)
- RC Professionnelle et RC exploitation mentionnées
- Durée et étendue des garanties (référence : panneaux 25 ans produit + linéaire 25-30 ans, onduleur 10-25 ans extensible, pose/main d'œuvre 10 ans)
- SIRET présent et cohérent (vérifiable sur pappers.fr ou societe.com)
- Signaux d'alerte : démarchage téléphonique, vente en foire, absence de visite technique préalable
- Mention du Consuel (attestation conformité obligatoire avant mise en service)
- Mention du raccordement Enedis et des démarches administratives (DP urbanisme, contrat EDF OA)
- Mention d'un planning prévisionnel réaliste

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. SCORE GLOBAL ET VERDICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calcule un score global pondéré :
- Technique : 35 %
- Financier : 40 %
- Fiabilité installateur : 25 %

Verdict final (un seul parmi) :
- ✅ EXCELLENT (≥ 8.0) — Devis de très bonne qualité, vous pouvez signer en confiance.
- 👍 BON (6.0 à 7.9) — Devis correct avec quelques points à vérifier ou négocier.
- ⚠️ MOYEN (4.0 à 5.9) — Plusieurs points faibles, demandez des corrections avant de signer.
- 🚫 À ÉVITER (< 4.0) — Trop de signaux d'alerte, nous vous déconseillons ce devis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. RECOMMANDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Termine par 3 à 5 recommandations concrètes et personnalisées :
- Points à négocier avec l'installateur
- Informations manquantes à demander
- Vérifications à faire (site qualit-enr.org pour le RGE, pappers.fr pour le SIRET)
- Comparaison à demander (obtenir 2-3 devis est toujours recommandé)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÈGLES IMPÉRATIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Sois factuel et objectif. Ne fais jamais de publicité pour un installateur ou une marque.
- Si le devis manque d'informations critiques, signale-le clairement dans le scoring.
- Adapte ton analyse à la zone géographique si elle est mentionnée (ensoleillement, tarif rachat).
- Utilise un langage accessible pour un particulier non-expert.
- Fournis toujours ta réponse en français.
- Formate ta réponse en JSON structuré selon le schéma fourni par l'utilisateur.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÉFÉRENCES DE PRIX (source : photovoltaique.info, 2024-2025)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prix au Wc en toiture (surimposition) :
- < 3 kWc : 2.50 – 3.00 €TTC/Wc (2.10 – 2.50 €HT/Wc)
- 3 – 9 kWc : 2.00 – 2.50 €TTC/Wc (1.70 – 2.10 €HT/Wc)
- 9 – 36 kWc : 1.20 – 1.70 €HT/Wc
- 36 – 100 kWc : 1.00 – 1.20 €HT/Wc
- 100 – 500 kWc : 0.80 – 1.00 €HT/Wc

Fourchettes de prix TTC installé (résidentiel, surimposition) :
- 3 kWc : 6 500 € – 8 000 €
- 6 kWc : 12 000 € – 13 500 €
- 9 kWc : 16 000 € – 17 500 €

Prix en ombrière de parking :
- 100 – 500 kWc : 1.30 – 1.60 €HT/Wc
- > 500 kWc : 0.90 – 1.30 €HT/Wc

Prix au sol :
- 300 kWc – 1 MWc : 1.00 – 1.30 €HT/Wc
- 1 – 10 MWc : 0.80 – 1.00 €HT/Wc
- > 10 MWc : 0.70 – 0.80 €HT/Wc

Coûts annexes :
- Raccordement réseau : 0 – 25 % de l'investissement (moyenne ~10 %)
- Étude de faisabilité : 1 000 – 2 500 €
- Diagnostic structure toiture : 1 000 – 5 000 €
- Variation régionale : jusqu'à +30 % dans le nord de la France

Prime à l'autoconsommation (tarifs T1 2025, à ajuster) :
- ≤ 3 kWc : 300 €/kWc
- 3 – 9 kWc : 230 €/kWc
- 9 – 36 kWc : 200 €/kWc
- 36 – 100 kWc : 100 €/kWc

Tarif de rachat surplus EDF OA (T1 2025, à ajuster) :
- ≤ 9 kWc : ~0.1297 €/kWh
- 9 – 36 kWc : ~0.0778 €/kWh

Production annuelle moyenne estimée :
- Nord de la France : 900 – 1 100 kWh/kWc/an
- Centre : 1 100 – 1 250 kWh/kWc/an
- Sud / Méditerranée : 1 250 – 1 500 kWh/kWc/an
- DOM-TOM : 1 300 – 1 600 kWh/kWc/an
`;

/**
 * Schéma JSON attendu en sortie de l'agent.
 * Passé dans le message utilisateur pour guider la réponse structurée.
 */
export const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    extraction: {
      type: "object",
      properties: {
        installation: {
          type: "object",
          properties: {
            puissance_kwc: { type: ["number", "null"] },
            nombre_panneaux: { type: ["number", "null"] },
            marque_panneaux: { type: ["string", "null"] },
            modele_panneaux: { type: ["string", "null"] },
            puissance_unitaire_wc: { type: ["number", "null"] },
            technologie: { type: ["string", "null"] },
            onduleur_marque: { type: ["string", "null"] },
            onduleur_modele: { type: ["string", "null"] },
            onduleur_puissance: { type: ["string", "null"] },
            type_pose: { type: ["string", "null"] },
            orientation: { type: ["string", "null"] },
            inclinaison: { type: ["string", "null"] },
            production_estimee_kwh: { type: ["number", "null"] },
            mode_valorisation: { type: ["string", "null"] },
          },
        },
        financier: {
          type: "object",
          properties: {
            prix_ht: { type: ["number", "null"] },
            prix_ttc: { type: ["number", "null"] },
            tva_pourcent: { type: ["number", "null"] },
            prix_par_wc: { type: ["number", "null"] },
            prime_autoconsommation: { type: ["string", "null"] },
            autres_aides: { type: ["string", "null"] },
            financement: { type: ["string", "null"] },
            temps_retour_annonce: { type: ["string", "null"] },
          },
        },
        installateur: {
          type: "object",
          properties: {
            raison_sociale: { type: ["string", "null"] },
            siret: { type: ["string", "null"] },
            rge_qualification: { type: ["string", "null"] },
            rge_numero: { type: ["string", "null"] },
            assurance_decennale: { type: ["boolean", "null"] },
            assureur: { type: ["string", "null"] },
            garantie_panneaux_ans: { type: ["number", "null"] },
            garantie_onduleur_ans: { type: ["number", "null"] },
            garantie_installation_ans: { type: ["number", "null"] },
            garantie_etancheite_ans: { type: ["number", "null"] },
          },
        },
      },
    },
    scoring: {
      type: "object",
      properties: {
        technique: {
          type: "object",
          properties: {
            note: { type: "number", minimum: 1, maximum: 10 },
            commentaire: { type: "string" },
          },
          required: ["note", "commentaire"],
        },
        financier: {
          type: "object",
          properties: {
            note: { type: "number", minimum: 1, maximum: 10 },
            commentaire: { type: "string" },
          },
          required: ["note", "commentaire"],
        },
        fiabilite_installateur: {
          type: "object",
          properties: {
            note: { type: "number", minimum: 1, maximum: 10 },
            commentaire: { type: "string" },
          },
          required: ["note", "commentaire"],
        },
        score_global: { type: "number", minimum: 1, maximum: 10 },
        verdict: {
          type: "string",
          enum: ["EXCELLENT", "BON", "MOYEN", "A_EVITER"],
        },
      },
      required: [
        "technique",
        "financier",
        "fiabilite_installateur",
        "score_global",
        "verdict",
      ],
    },
    recommandations: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
    },
  },
  required: ["extraction", "scoring", "recommandations"],
} as const;

/**
 * Types TypeScript dérivés du schéma de sortie.
 */
export interface AnalyseDevis {
  extraction: {
    installation: {
      puissance_kwc: number | null;
      nombre_panneaux: number | null;
      marque_panneaux: string | null;
      modele_panneaux: string | null;
      puissance_unitaire_wc: number | null;
      technologie: string | null;
      onduleur_marque: string | null;
      onduleur_modele: string | null;
      onduleur_puissance: string | null;
      type_pose: string | null;
      orientation: string | null;
      inclinaison: string | null;
      production_estimee_kwh: number | null;
      mode_valorisation: string | null;
    };
    financier: {
      prix_ht: number | null;
      prix_ttc: number | null;
      tva_pourcent: number | null;
      prix_par_wc: number | null;
      prime_autoconsommation: string | null;
      autres_aides: string | null;
      financement: string | null;
      temps_retour_annonce: string | null;
    };
    installateur: {
      raison_sociale: string | null;
      siret: string | null;
      rge_qualification: string | null;
      rge_numero: string | null;
      assurance_decennale: boolean | null;
      assureur: string | null;
      garantie_panneaux_ans: number | null;
      garantie_onduleur_ans: number | null;
      garantie_installation_ans: number | null;
      garantie_etancheite_ans: number | null;
    };
  };
  scoring: {
    technique: { note: number; commentaire: string };
    financier: { note: number; commentaire: string };
    fiabilite_installateur: { note: number; commentaire: string };
    score_global: number;
    verdict: "EXCELLENT" | "BON" | "MOYEN" | "A_EVITER";
  };
  recommandations: string[];
}
