export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DevisPV",
    url: "https://devis-pv.fr",
    logo: "https://devis-pv.fr/icon-512.png",
    description:
      "Système expert d\’analyse de devis photovoltaïques pour les particuliers en France.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@devis-pv.fr",
      contactType: "customer service",
      availableLanguage: "French",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQPageJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DevisPV",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description:
      "Analysez votre devis photovoltaïque et obtenez un scoring complet : technique, financier et fiabilité installateur.",
    offers: [
      {
        "@type": "Offer",
        name: "Analyse unique",
        price: "29.00",
        priceCurrency: "EUR",
        description:
          "Analyse complète d\’un seul devis photovoltaïque avec rapport PDF.",
      },
      {
        "@type": "Offer",
        name: "Projet complet",
        price: "59.00",
        priceCurrency: "EUR",
        description:
          "Analyses illimitées pendant 2 mois + comparaison de devis.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
