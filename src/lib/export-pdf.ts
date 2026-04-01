import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalyseDevis } from "@/lib/system-prompt";
import { LOGO_BASE64 } from "@/lib/logo-data";

const VERDICT_LABELS: Record<string, string> = {
  EXCELLENT: "EXCELLENT",
  BON: "BON",
  MOYEN: "MOYEN",
  A_EVITER: "A EVITER",
};

/** Formate un nombre en euros pour le PDF (ex: 13 476,60 EUR) — sans caractères spéciaux */
function fmtEur(val: number | null | undefined): string {
  if (val === null || val === undefined) return "Non mentionn\u00E9";
  // Formater manuellement pour éviter les problèmes d'encodage jsPDF
  const parts = val.toFixed(2).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${intPart},${parts[1]} EUR`;
}

/**
 * Génère un PDF du rapport d'analyse de devis PV.
 */
export function generatePDF(data: AnalyseDevis): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Couleurs palette orange/soleil
  const primaryRGB: [number, number, number] = [234, 88, 12]; // #ea580c
  const accentRGB: [number, number, number] = [245, 158, 11]; // #f59e0b

  // --- En-tête ---
  doc.setFillColor(...primaryRGB);
  doc.rect(0, 0, pageWidth, 40, "F");
  // Bande accent en bas du header
  doc.setFillColor(...accentRGB);
  doc.rect(0, 38, pageWidth, 2, "F");

  // Logo
  try {
    doc.addImage(`data:image/png;base64,${LOGO_BASE64}`, "PNG", margin, 5, 12, 12);
  } catch { /* fallback sans logo */ }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("DevisPV", margin + 15, 15);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Rapport d'analyse de devis photovolta\u00EFque", margin, 28);

  doc.setFontSize(9);
  doc.text(`G\u00E9n\u00E9r\u00E9 le ${new Date().toLocaleDateString("fr-FR")}`, margin, 35);

  y = 50;

  // --- Score global ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Score global", margin, y);

  y += 10;
  const verdict = VERDICT_LABELS[data.scoring.verdict] ?? "N/A";
  // Calculer le score global de fa\u00E7on identique \u00E0 la page r\u00E9sultats
  const scoreGlobal = (data.scoring.technique.note * 35 + data.scoring.financier.note * 40 + data.scoring.fiabilite_installateur.note * 25) / 100;
  doc.setFontSize(36);
  doc.text(`${scoreGlobal.toFixed(1)}/10`, margin, y + 5);

  doc.setFontSize(14);
  const verdictColor = getVerdictColor(data.scoring.verdict);
  doc.setTextColor(...verdictColor);
  doc.text(verdict, margin + 55, y + 5);

  doc.setTextColor(0, 0, 0);
  y += 20;

  // --- Scores détaillés ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Scoring d\u00E9taill\u00E9", margin, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Axe", "Note", "Poids", "Commentaire"]],
    body: [
      [
        "Technique",
        `${data.scoring.technique.note.toFixed(1)}/10`,
        "35%",
        data.scoring.technique.commentaire,
      ],
      [
        "Financier",
        `${data.scoring.financier.note.toFixed(1)}/10`,
        "40%",
        data.scoring.financier.commentaire,
      ],
      [
        "Fiabilit\u00E9 installateur",
        `${data.scoring.fiabilite_installateur.note.toFixed(1)}/10`,
        "25%",
        data.scoring.fiabilite_installateur.commentaire,
      ],
    ],
    headStyles: { fillColor: primaryRGB, fontSize: 9, font: "helvetica" },
    bodyStyles: { fontSize: 8, font: "helvetica", cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: "bold" },
      1: { cellWidth: 18, halign: "center" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: "auto" },
    },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // --- Nouvelle page si nécessaire ---
  if (y > 200) {
    doc.addPage();
    y = 20;
  }

  // --- Données extraites : Installation ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Donn\u00E9es extraites \u2014 Installation", margin, y);
  y += 5;

  const inst = data.extraction.installation;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Puissance", inst.puissance_kwc ? `${inst.puissance_kwc} kWc` : "Non mentionn\u00E9"],
      ["Panneaux", inst.nombre_panneaux ? `${inst.nombre_panneaux}x ${inst.marque_panneaux ?? ""} ${inst.modele_panneaux ?? ""}`.trim() : "Non mentionn\u00E9"],
      ["Technologie", inst.technologie ?? "Non mentionn\u00E9"],
      ["Onduleur", inst.onduleur_marque ? `${inst.onduleur_marque} ${inst.onduleur_modele ?? ""}`.trim() : "Non mentionn\u00E9"],
      ["Type de pose", inst.type_pose ?? "Non mentionn\u00E9"],
      ["Production estim\u00E9e", inst.production_estimee_kwh ? `${inst.production_estimee_kwh.toLocaleString("en-US").replace(/,/g, " ")} kWh/an` : "Non mentionn\u00E9"],
      ["Valorisation", inst.mode_valorisation ?? "Non mentionn\u00E9"],
    ],
    bodyStyles: { fontSize: 8, font: "helvetica", cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: "bold", textColor: [100, 100, 100] },
      1: { cellWidth: "auto" },
    },
    theme: "plain",
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // --- Données extraites : Financier ---
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Donn\u00E9es extraites \u2014 Financier", margin, y);
  y += 5;

  const fin = data.extraction.financier;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Prix HT", fmtEur(fin.prix_ht)],
      ["Prix TTC", fmtEur(fin.prix_ttc)],
      ["Prix/Wc", fin.prix_par_wc ? `${fin.prix_par_wc.toFixed(2)} EUR/Wc` : "Non mentionn\u00E9"],
      ["TVA", fin.tva_pourcent ? `${fin.tva_pourcent}%` : "Non mentionn\u00E9"],
      ["Prime autoconsommation", fin.prime_autoconsommation ?? "Non mentionn\u00E9"],
      ["Financement", fin.financement ?? "Non mentionn\u00E9"],
      ["Retour annonc\u00E9", fin.temps_retour_annonce ?? "Non mentionn\u00E9"],
    ],
    bodyStyles: { fontSize: 8, font: "helvetica", cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: "bold", textColor: [100, 100, 100] },
      1: { cellWidth: "auto" },
    },
    theme: "plain",
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // --- Données extraites : Installateur ---
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Donn\u00E9es extraites \u2014 Installateur", margin, y);
  y += 5;

  const inst2 = data.extraction.installateur;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Raison sociale", inst2.raison_sociale ?? "Non mentionn\u00E9"],
      ["SIRET", inst2.siret ?? "Non mentionn\u00E9"],
      ["RGE", inst2.rge_qualification ?? "Non mentionn\u00E9"],
      ["Assurance d\u00E9cennale", inst2.assurance_decennale === true ? "Oui" : inst2.assurance_decennale === false ? "Non" : "Non mentionn\u00E9"],
      ["Garantie panneaux", inst2.garantie_panneaux_ans ? `${inst2.garantie_panneaux_ans} ans` : "Non mentionn\u00E9"],
      ["Garantie onduleur", inst2.garantie_onduleur_ans ? `${inst2.garantie_onduleur_ans} ans` : "Non mentionn\u00E9"],
      ["Garantie installation", inst2.garantie_installation_ans ? `${inst2.garantie_installation_ans} ans` : "Non mentionn\u00E9"],
    ],
    bodyStyles: { fontSize: 8, font: "helvetica", cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: "bold", textColor: [100, 100, 100] },
      1: { cellWidth: "auto" },
    },
    theme: "plain",
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // --- Recommandations ---
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Recommandations", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  data.recommandations.forEach((rec, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 3;
  });

  // --- Projection financière ---
  const prixTtc = data.extraction.financier.prix_ttc;
  const productionAn = data.extraction.installation.production_estimee_kwh;
  const puissanceKwc = data.extraction.installation.puissance_kwc;

  if (prixTtc && productionAn && puissanceKwc) {
    doc.addPage();
    y = 20;

    // Paramètres (identiques à resultats/page.tsx)
    const tauxAC = 0.45;
    const prixElec = 0.2516;
    const tarifRachat = puissanceKwc <= 9 ? 0.1297 : 0.0778;
    const degrad = 0.005;
    const augElec = 0.04;
    const opexAn = prixTtc * 0.01;
    const coutOnduleur = prixTtc * 0.12;

    let primeKwc = 0;
    if (puissanceKwc <= 3) primeKwc = 300;
    else if (puissanceKwc <= 9) primeKwc = 230;
    else if (puissanceKwc <= 36) primeKwc = 200;
    else primeKwc = 100;
    const primeTotal = primeKwc * puissanceKwc;
    const primeAn = primeTotal / 5;
    const coutNet = prixTtc - primeTotal;

    let cumul = 0;
    let anneeRetour: number | null = null;
    const rows: { a: number; prod: number; eco: number; rev: number; prime: number; opex: number; net: number; cumul: number }[] = [];

    for (let a = 1; a <= 25; a++) {
      const prod = productionAn * Math.pow(1 - degrad, a - 1);
      const pElec = prixElec * Math.pow(1 + augElec, a - 1);
      const eco = prod * tauxAC * pElec;
      const rev = prod * (1 - tauxAC) * tarifRachat;
      const prime = a <= 5 ? primeAn : 0;
      const opex = opexAn + (a === 13 ? coutOnduleur : 0);
      const net = eco + rev + prime - opex;
      cumul += net;
      if (anneeRetour === null && cumul >= coutNet) anneeRetour = a;
      rows.push({ a, prod: Math.round(prod), eco: Math.round(eco), rev: Math.round(rev), prime: Math.round(prime), opex: Math.round(opex), net: Math.round(net), cumul: Math.round(cumul) });
    }

    const gainTotal = Math.round(cumul);
    const rendement = ((cumul / coutNet - 1) * 100).toFixed(0);

    // Titre section
    doc.setFillColor(...primaryRGB);
    doc.rect(0, y - 5, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Projection financi\u00E8re sur 25 ans", margin, y + 3);
    y += 15;

    // KPIs en ligne
    doc.setTextColor(0, 0, 0);
    const kpis = [
      { label: "Investissement net", value: fmtEur(coutNet), sub: `apr\u00E8s prime de ${fmtEur(primeTotal)}` },
      { label: "Retour sur invest.", value: anneeRetour ? `${anneeRetour} ans` : "N/A", sub: "temps de retour" },
      { label: "Gains sur 25 ans", value: fmtEur(gainTotal), sub: "\u00E9conomies + revente" },
      { label: "Rendement total", value: `${rendement}%`, sub: "sur 25 ans" },
    ];

    const kpiW = (pageWidth - margin * 2) / 4;
    kpis.forEach((kpi, i) => {
      const x = margin + i * kpiW;
      // Box fond
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x + 1, y, kpiW - 2, 22, 2, 2, "F");
      // Label
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(kpi.label, x + kpiW / 2, y + 5, { align: "center" });
      // Value
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryRGB);
      doc.text(kpi.value, x + kpiW / 2, y + 13, { align: "center" });
      // Sub
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 160, 160);
      doc.text(kpi.sub, x + kpiW / 2, y + 18, { align: "center" });
    });

    y += 30;

    // Tableau projection
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("D\u00E9tail ann\u00E9e par ann\u00E9e", margin, y);
    y += 4;

    const tableRows = rows
      .filter((r) => r.a <= 10 || r.a % 5 === 0)
      .map((r) => [
        `An ${r.a}`,
        `${r.prod.toLocaleString("en-US").replace(/,/g, " ")} kWh`,
        `${r.eco} EUR`,
        `${r.rev} EUR`,
        r.prime > 0 ? `+${r.prime} EUR` : "\u2014",
        `-${r.opex} EUR`,
        `${r.net} EUR`,
        `${r.cumul.toLocaleString("en-US").replace(/,/g, " ")} EUR`,
      ]);

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Ann\u00E9e", "Production", "\u00C9conomies", "Revente", "Prime", "OPEX", "Gain net", "Cumul"]],
      body: tableRows,
      headStyles: { fillColor: primaryRGB, fontSize: 7, font: "helvetica", halign: "center" },
      bodyStyles: { fontSize: 7, font: "helvetica", cellPadding: 1.5, halign: "right" },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold", cellWidth: 14 },
        4: { textColor: [16, 185, 129] },
        5: { textColor: [239, 68, 68] },
        7: { fontStyle: "bold" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      didParseCell: (hookData: any) => {
        // Colorer la ligne cumul en vert quand seuil atteint
        if (hookData.section === "body" && hookData.column.index === 7) {
          const val = parseInt(hookData.cell.text[0]?.replace(/[^\d-]/g, "") || "0");
          if (val >= coutNet) {
            hookData.cell.styles.fillColor = [236, 253, 245]; // emerald-50
          }
        }
      },
    });

    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

    // Hypothèses
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    const hyp = `Hypoth\u00E8ses : autoconsommation 45%, prix \u00E9lectricit\u00E9 0,2516 EUR/kWh (+4%/an), tarif rachat EDF OA ${(tarifRachat * 100).toFixed(2)} c/kWh (contrat 20 ans), d\u00E9gradation 0,5%/an, OPEX ~1%/an, remplacement onduleur an 13, prime vers\u00E9e sur 5 ans.`;
    const hypLines = doc.splitTextToSize(hyp, pageWidth - margin * 2);
    doc.text(hypLines, margin, y);
  }

  // --- Pied de page ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPages = (doc as any).getNumberOfPages() as number;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `DevisPV — Rapport d'analyse — Page ${i}/${totalPages}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  return doc;
}

function getVerdictColor(verdict: string): [number, number, number] {
  switch (verdict) {
    case "EXCELLENT":
      return [16, 185, 129]; // emerald
    case "BON":
      return [234, 88, 12]; // orange
    case "MOYEN":
      return [245, 158, 11]; // amber
    case "A_EVITER":
      return [239, 68, 68]; // red
    default:
      return [0, 0, 0];
  }
}
