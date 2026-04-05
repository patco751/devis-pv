export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "comment-verifier-devis-panneaux-solaires",
    title: "Comment vérifier un devis panneaux solaires en 2026 : le guide complet",
    description:
      "Les 7 points clés à contrôler avant de signer un devis photovoltaïque : prix au kWc, matériel, certification RGE, garanties et rentabilité.",
    date: "2026-04-04",
    readTime: "8 min",
    category: "Guide",
  },
  {
    slug: "arnaques-panneaux-solaires-signaux-alerte",
    title: "Arnaques panneaux solaires : 10 signaux d\’alerte à reconnaître",
    description:
      "Démarchage agressif, promesses irréalistes, crédit dissimulé… Apprenez à repérer les arnaques solaires avant de signer.",
    date: "2026-04-04",
    readTime: "6 min",
    category: "Sécurité",
  },
  {
    slug: "prix-panneaux-solaires-kwc-2026",
    title: "Prix panneaux solaires 2026 : combien coûte le kWc en France ?",
    description:
      "Barème des prix au kWc par puissance (3, 6, 9 kWc), comparaison des marques et aides disponibles. Chiffres actualisés avril 2026.",
    date: "2026-04-04",
    readTime: "7 min",
    category: "Prix",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
