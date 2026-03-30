import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalyseDevis } from "@/lib/system-prompt";

const VERDICT_LABELS: Record<string, string> = {
  EXCELLENT: "EXCELLENT",
  BON: "BON",
  MOYEN: "MOYEN",
  A_EVITER: "A EVITER",
};

/**
 * Génère un PDF du rapport d'analyse de devis PV.
 */
export function generatePDF(data: AnalyseDevis): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // --- En-tête ---
  doc.setFillColor(37, 99, 235); // primary blue
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("DevisPV", margin, 18);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Rapport d'analyse de devis photovoltaique", margin, 28);

  doc.setFontSize(9);
  doc.text(`Genere le ${new Date().toLocaleDateString("fr-FR")}`, margin, 35);

  y = 50;

  // --- Score global ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Score global", margin, y);

  y += 10;
  const verdict = VERDICT_LABELS[data.scoring.verdict] ?? "N/A";
  doc.setFontSize(36);
  doc.text(`${data.scoring.score_global.toFixed(1)}/10`, margin, y + 5);

  doc.setFontSize(14);
  const verdictColor = getVerdictColor(data.scoring.verdict);
  doc.setTextColor(...verdictColor);
  doc.text(verdict, margin + 55, y + 5);

  doc.setTextColor(0, 0, 0);
  y += 20;

  // --- Scores détaillés ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Scoring detaille", margin, y);
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
        "Fiabilite installateur",
        `${data.scoring.fiabilite_installateur.note.toFixed(1)}/10`,
        "25%",
        data.scoring.fiabilite_installateur.commentaire,
      ],
    ],
    headStyles: { fillColor: [37, 99, 235], fontSize: 9, font: "helvetica" },
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
  doc.text("Donnees extraites — Installation", margin, y);
  y += 5;

  const inst = data.extraction.installation;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Puissance", inst.puissance_kwc ? `${inst.puissance_kwc} kWc` : "Non mentionne"],
      ["Panneaux", inst.nombre_panneaux ? `${inst.nombre_panneaux}x ${inst.marque_panneaux ?? ""} ${inst.modele_panneaux ?? ""}`.trim() : "Non mentionne"],
      ["Technologie", inst.technologie ?? "Non mentionne"],
      ["Onduleur", inst.onduleur_marque ? `${inst.onduleur_marque} ${inst.onduleur_modele ?? ""}`.trim() : "Non mentionne"],
      ["Type de pose", inst.type_pose ?? "Non mentionne"],
      ["Production estimee", inst.production_estimee_kwh ? `${inst.production_estimee_kwh} kWh/an` : "Non mentionne"],
      ["Valorisation", inst.mode_valorisation ?? "Non mentionne"],
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
  doc.text("Donnees extraites — Financier", margin, y);
  y += 5;

  const fin = data.extraction.financier;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Prix HT", fin.prix_ht ? `${fin.prix_ht.toLocaleString("fr-FR")} EUR` : "Non mentionne"],
      ["Prix TTC", fin.prix_ttc ? `${fin.prix_ttc.toLocaleString("fr-FR")} EUR` : "Non mentionne"],
      ["Prix/Wc", fin.prix_par_wc ? `${fin.prix_par_wc.toFixed(2)} EUR/Wc` : "Non mentionne"],
      ["TVA", fin.tva_pourcent ? `${fin.tva_pourcent}%` : "Non mentionne"],
      ["Prime autoconsommation", fin.prime_autoconsommation ?? "Non mentionne"],
      ["Financement", fin.financement ?? "Non mentionne"],
      ["Retour annonce", fin.temps_retour_annonce ?? "Non mentionne"],
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
  doc.text("Donnees extraites — Installateur", margin, y);
  y += 5;

  const inst2 = data.extraction.installateur;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Raison sociale", inst2.raison_sociale ?? "Non mentionne"],
      ["SIRET", inst2.siret ?? "Non mentionne"],
      ["RGE", inst2.rge_qualification ?? "Non mentionne"],
      ["Assurance decennale", inst2.assurance_decennale === true ? "Oui" : inst2.assurance_decennale === false ? "Non" : "Non mentionne"],
      ["Garantie panneaux", inst2.garantie_panneaux_ans ? `${inst2.garantie_panneaux_ans} ans` : "Non mentionne"],
      ["Garantie onduleur", inst2.garantie_onduleur_ans ? `${inst2.garantie_onduleur_ans} ans` : "Non mentionne"],
      ["Garantie installation", inst2.garantie_installation_ans ? `${inst2.garantie_installation_ans} ans` : "Non mentionne"],
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
      return [37, 99, 235]; // blue
    case "MOYEN":
      return [245, 158, 11]; // amber
    case "A_EVITER":
      return [239, 68, 68]; // red
    default:
      return [0, 0, 0];
  }
}
