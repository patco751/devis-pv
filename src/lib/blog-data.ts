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
    title: "Comment v\u00e9rifier un devis panneaux solaires en 2026 : le guide complet",
    description:
      "Les 7 points cl\u00e9s \u00e0 contr\u00f4ler avant de signer un devis photovolta\u00efque : prix au kWc, mat\u00e9riel, certification RGE, garanties et rentabilit\u00e9.",
    date: "2026-04-04",
    readTime: "8 min",
    category: "Guide",
  },
  {
    slug: "arnaques-panneaux-solaires-signaux-alerte",
    title: "Arnaques panneaux solaires : 10 signaux d\u2019alerte \u00e0 reconna\u00eetre",
    description:
      "D\u00e9marchage agressif, promesses irr\u00e9alistes, cr\u00e9dit dissimul\u00e9\u2026 Apprenez \u00e0 rep\u00e9rer les arnaques solaires avant de signer.",
    date: "2026-04-04",
    readTime: "6 min",
    category: "S\u00e9curit\u00e9",
  },
  {
    slug: "prix-panneaux-solaires-kwc-2026",
    title: "Prix panneaux solaires 2026 : combien co\u00fbte le kWc en France ?",
    description:
      "Bar\u00e8me des prix au kWc par puissance (3, 6, 9 kWc), comparaison des marques et aides disponibles. Chiffres actualis\u00e9s avril 2026.",
    date: "2026-04-04",
    readTime: "7 min",
    category: "Prix",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
