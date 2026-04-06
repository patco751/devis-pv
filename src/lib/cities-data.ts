export interface CityData {
  slug: string;
  name: string;
  region: string;
  department: string;
  sunHours: number; // heures d'ensoleillement annuelles
  avgProduction: number; // kWh/kWc/an
}

export const cities: CityData[] = [
  { slug: "paris", name: "Paris", region: "Île-de-France", department: "75", sunHours: 1660, avgProduction: 1050 },
  { slug: "marseille", name: "Marseille", region: "Provence-Alpes-Côte d'Azur", department: "13", sunHours: 2850, avgProduction: 1400 },
  { slug: "lyon", name: "Lyon", region: "Auvergne-Rhône-Alpes", department: "69", sunHours: 2010, avgProduction: 1200 },
  { slug: "toulouse", name: "Toulouse", region: "Occitanie", department: "31", sunHours: 2100, avgProduction: 1280 },
  { slug: "nice", name: "Nice", region: "Provence-Alpes-Côte d'Azur", department: "06", sunHours: 2720, avgProduction: 1380 },
  { slug: "nantes", name: "Nantes", region: "Pays de la Loire", department: "44", sunHours: 1790, avgProduction: 1100 },
  { slug: "montpellier", name: "Montpellier", region: "Occitanie", department: "34", sunHours: 2600, avgProduction: 1350 },
  { slug: "strasbourg", name: "Strasbourg", region: "Grand Est", department: "67", sunHours: 1640, avgProduction: 1020 },
  { slug: "bordeaux", name: "Bordeaux", region: "Nouvelle-Aquitaine", department: "33", sunHours: 2035, avgProduction: 1200 },
  { slug: "lille", name: "Lille", region: "Hauts-de-France", department: "59", sunHours: 1560, avgProduction: 950 },
  { slug: "rennes", name: "Rennes", region: "Bretagne", department: "35", sunHours: 1720, avgProduction: 1050 },
  { slug: "grenoble", name: "Grenoble", region: "Auvergne-Rhône-Alpes", department: "38", sunHours: 2020, avgProduction: 1200 },
  { slug: "toulon", name: "Toulon", region: "Provence-Alpes-Côte d'Azur", department: "83", sunHours: 2800, avgProduction: 1400 },
  { slug: "dijon", name: "Dijon", region: "Bourgogne-Franche-Comté", department: "21", sunHours: 1840, avgProduction: 1100 },
  { slug: "angers", name: "Angers", region: "Pays de la Loire", department: "49", sunHours: 1810, avgProduction: 1100 },
  { slug: "clermont-ferrand", name: "Clermont-Ferrand", region: "Auvergne-Rhône-Alpes", department: "63", sunHours: 1910, avgProduction: 1150 },
  { slug: "perpignan", name: "Perpignan", region: "Occitanie", department: "66", sunHours: 2530, avgProduction: 1350 },
  { slug: "aix-en-provence", name: "Aix-en-Provence", region: "Provence-Alpes-Côte d'Azur", department: "13", sunHours: 2800, avgProduction: 1380 },
  { slug: "tours", name: "Tours", region: "Centre-Val de Loire", department: "37", sunHours: 1800, avgProduction: 1100 },
  { slug: "la-rochelle", name: "La Rochelle", region: "Nouvelle-Aquitaine", department: "17", sunHours: 2200, avgProduction: 1250 },
];

export function getCity(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}
