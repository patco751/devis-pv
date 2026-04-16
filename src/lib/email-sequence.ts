type EmailStep = {
  subject: string;
  preheader: string;
  html: (firstName: string) => string;
};

const brand = "#ea580c";

const wrap = (preheader: string, body: string) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title></title></head>
<body style="margin:0;padding:0;background:#f7f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:12px;padding:40px 36px;max-width:560px;">
        <tr><td style="font-size:16px;line-height:1.6;">
          <div style="font-size:13px;letter-spacing:3px;color:${brand};margin-bottom:24px;">DEVISPV</div>
          ${body}
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0 20px;">
          <div style="font-size:12px;color:#888;line-height:1.6;">
            DevisPV · Analyse indépendante de devis photovoltaïques<br>
            <a href="https://devis-pv.fr" style="color:${brand};text-decoration:none;">devis-pv.fr</a>
            · <a href="mailto:unsubscribe@devis-pv.fr?subject=unsubscribe" style="color:#888;">Se désinscrire</a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const hi = (n: string) => (n ? `Bonjour ${n},` : "Bonjour,");

export const EMAIL_SEQUENCE: EmailStep[] = [
  {
    subject: "Votre checklist devis solaire (à ouvrir avant de signer)",
    preheader: "Les 5 points que 90% des propriétaires oublient de vérifier.",
    html: (n) => wrap(
      "Les 5 points que 90% des propriétaires oublient de vérifier.",
      `<p>${hi(n)}</p>
       <p>Merci pour votre inscription. Avant toute chose, voici la checklist que vous pouvez utiliser dès maintenant, avant même de parler à un nouveau commercial :</p>
       <p><strong>1. Prix au kWc</strong><br>Prix TTC ÷ puissance installée. Seuils de marché sérieux 2026 (TVA 5,5 % via RGE) :<br>
       → 3 kWc : suspect au-dessus de 3 500 €/kWc<br>
       → 6 kWc : suspect au-dessus de 2 800 €/kWc<br>
       → 9 kWc : suspect au-dessus de 2 500 €/kWc<br>
       Au-dessus du seuil correspondant à votre puissance, demandez des justifications écrites.</p>
       <p><strong>2. Certification RGE</strong><br>Vérifiable en 30 secondes sur <a href="https://qualit-enr.org" style="color:${brand};">qualit-enr.org</a>. Sans RGE valide = zéro aide de l'État.</p>
       <p><strong>3. Marque des panneaux</strong><br>Introuvable sur Google ? Signal rouge. Références fiables : Jinko, Trina, DualSun, REC, QCells, Canadian Solar.</p>
       <p><strong>4. Onduleur</strong><br>Marques sérieuses : Enphase, SolarEdge, Huawei, SMA, Fronius. Durée de vie attendue : 15 ans minimum.</p>
       <p><strong>5. Crédit caché</strong><br>Cherchez "mensualité", "TAEG", "financement inclus". Un crédit à 6% sur 15 ans transforme un devis à 15 000€ en 22 000€ réels.</p>
       <p>Un seul de ces 5 points qui cloche = demandez un autre devis.</p>
       <p>Je vous recontacte demain avec un cas concret d'un devis surévalué de 6 800€.</p>
       <p>— Hakim<br>Fondateur DevisPV</p>`,
    ),
  },
  {
    subject: "18 000€ au lieu de 13 500€ (le devis de Marc)",
    preheader: "Même puissance, même région. L'écart vient d'où ?",
    html: (n) => wrap(
      "Même puissance, même région. L'écart vient d'où ?",
      `<p>${hi(n)}</p>
       <p>Marc, 48 ans, région de Lyon. Il reçoit un devis à 18 000€ pour 6 kWc. Le commercial lui dit : <em>"C'est le prix du marché."</em></p>
       <p>Ce que l'analyse a révélé :</p>
       <p>→ <strong>Prix au kWc : 3 000 €.</strong> Au-dessus du seuil suspect 6 kWc (2 800 €/kWc). Marché sérieux : 1 670 à 2 580 €/kWc.<br>
          → <strong>Crédit intégré</strong> à 5,9% sur 12 ans, caché page 4 du devis.<br>
          → <strong>Onduleur bas de gamme</strong>, durée de vie 8 ans (vs 15+ attendus).</p>
       <p>Surévaluation réelle : <strong>6 800€</strong>.</p>
       <p>Marc a présenté le rapport DevisPV au commercial. Nouveau devis signé : <strong>13 500€, matériel premium</strong>.</p>
       <p>Coût de l'analyse : 29€. Économie nette : 6 771€.</p>
       <p>Ce n'est pas magique. C'est juste que les devis photovoltaïques sont rarement lus ligne par ligne — et les commerciaux le savent.</p>
       <p><a href="https://devis-pv.fr" style="background:${brand};color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:500;">Analyser mon devis →</a></p>
       <p>— Hakim</p>`,
    ),
  },
  {
    subject: `"Mon installateur est RGE, donc c'est bon" — pas vraiment`,
    preheader: "Pourquoi la certification RGE ne garantit rien sur le prix.",
    html: (n) => wrap(
      "Pourquoi la certification RGE ne garantit rien sur le prix.",
      `<p>${hi(n)}</p>
       <p>Une idée reçue qu'on entend beaucoup : <em>"S'il est RGE, c'est qu'il est sérieux."</em></p>
       <p>La certification RGE est <strong>nécessaire</strong> pour toucher les aides de l'État. Elle n'est <strong>pas suffisante</strong> pour garantir un bon prix.</p>
       <p>Ce qu'un installateur RGE peut quand même faire :</p>
       <ul>
         <li>Gonfler ses marges (la certification ne régule pas les prix)</li>
         <li>Intégrer un crédit à TAEG élevé sans l'afficher clairement</li>
         <li>Installer du matériel entrée de gamme avec présentation premium</li>
         <li>Gonfler la projection de rentabilité</li>
       </ul>
       <p>RGE veut dire : passage obligé, jamais un critère suffisant.</p>
       <p>Prenez 3 devis, vérifiez le prix au kWc, lisez les petites lignes. Ou laissez DevisPV le faire en 2 minutes.</p>
       <p><a href="https://devis-pv.fr" style="color:${brand};">→ devis-pv.fr</a></p>
       <p>— Hakim</p>`,
    ),
  },
  {
    subject: "Avant de signer : 2 minutes qui peuvent valoir 4 000€",
    preheader: "Diagnostic DevisPV à 29€ (rapport PDF complet inclus).",
    html: (n) => wrap(
      "Diagnostic DevisPV à 29€ (rapport PDF complet inclus).",
      `<p>${hi(n)}</p>
       <p>Sur les 150 derniers devis que nous avons analysés :</p>
       <p><strong>62% étaient surévalués</strong> par rapport au marché.<br>
          <strong>Surcoût moyen détecté : 4 200€.</strong><br>
          <strong>34% contenaient un crédit mal expliqué.</strong></p>
       <p>Ce que vous recevez avec le diagnostic DevisPV :</p>
       <ol>
         <li>Score global /100 — comparé au marché réel</li>
         <li>Analyse du prix au kWc — zone verte / orange / rouge</li>
         <li>Vérification RGE + matériel (marques, garanties, durée de vie)</li>
         <li>Détection de crédit caché (TAEG, mensualité, coût total réel)</li>
         <li>Projection 25 ans honnête (production, économies, rentabilité)</li>
         <li>Arguments de négociation prêts à envoyer</li>
       </ol>
       <p><strong>29€. 2 minutes. Satisfait ou remboursé.</strong></p>
       <p><a href="https://devis-pv.fr" style="background:${brand};color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:500;">Lancer mon diagnostic →</a></p>
       <p>— Hakim</p>`,
    ),
  },
  {
    subject: "Je n'insisterai plus",
    preheader: "Un dernier conseil avant de disparaître de votre boîte.",
    html: (n) => wrap(
      "Un dernier conseil avant de disparaître de votre boîte.",
      `<p>${hi(n)}</p>
       <p>Je ne vais plus vous envoyer d'emails commerciaux après celui-ci.</p>
       <p>Trois possibilités :</p>
       <p><strong>1. Vous avez déjà signé.</strong><br>
          Ouvrez votre devis. Vérifiez le prix au kWc, la marque des panneaux, la présence d'un crédit. Si quelque chose cloche, vous avez encore 14 jours pour vous rétracter (loi Hamon).</p>
       <p><strong>2. Vous hésitez encore.</strong><br>
          Envoyez-moi votre devis en réponse à cet email. Je regarde, je vous dis en 2 lignes s'il vaut la peine de passer par un diagnostic complet. Gratuit.</p>
       <p><strong>3. Vous avez abandonné le projet.</strong><br>
          Pas de souci. Si ça repart un jour, vous savez où me trouver.</p>
       <p>Merci pour votre attention.</p>
       <p>— Hakim<br><a href="mailto:contact@devis-pv.fr" style="color:${brand};">contact@devis-pv.fr</a></p>
       <p style="color:#666;font-size:14px;"><em>P.S. Si vous connaissez quelqu'un qui reçoit actuellement des devis solaires, transférez-lui cet email. Un devis vérifié = potentiellement 4 000€ économisés.</em></p>`,
    ),
  },
];
