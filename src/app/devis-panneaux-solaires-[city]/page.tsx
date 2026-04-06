import { cities, getCity } from "@/lib/cities-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LogoWithText } from "@/components/logo";

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return {};

  return {
    title: `Devis panneaux solaires ${city.name} — Analyse et vérification`,
    description: `Faites analyser votre devis photovoltaïque à ${city.name} (${city.department}). Vérification du prix, du matériel et de l'installateur. Résultat en 2 minutes.`,
    alternates: { canonical: `/devis-panneaux-solaires-${city.slug}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const priceRange3 = { min: 8500, max: 10500 };
  const priceRange6 = { min: 14000, max: 17000 };
  const priceRange9 = { min: 18000, max: 23000 };

  const roi6kWc = Math.round(
    (6 * city.avgProduction * 0.18 * 25 - 15500) / 15500 * 100
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Analyse de devis photovoltaïque à ${city.name}`,
            provider: {
              "@type": "Organization",
              name: "DevisPV",
              url: "https://devis-pv.fr",
            },
            areaServed: {
              "@type": "City",
              name: city.name,
            },
            description: `Service d'analyse et de vérification de devis panneaux solaires à ${city.name} (${city.region}).`,
          }),
        }}
      />

      <div className="flex flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
            <a href="/">
              <LogoWithText />
            </a>
            <nav className="flex items-center gap-4">
              <a href="/blog" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Blog</a>
              <a href="/#tarifs" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">Tarifs</a>
            </nav>
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-6 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-zinc-500">
            <a href="/" className="hover:text-primary">Accueil</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-zinc-100">Devis panneaux solaires {city.name}</span>
          </nav>

          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Devis panneaux solaires à {city.name} : vérifiez avant de signer
          </h1>

          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Vous avez reçu un devis pour une installation photovoltaïque à {city.name} ({city.department}) ?
            Avant de signer, faites-le analyser par notre système expert pour vous assurer que le prix, le matériel
            et l'installateur sont conformes au marché en {city.region}.
          </p>

          {/* CTA */}
          <div className="mt-8 rounded-2xl border-2 border-primary bg-orange-50 p-6 text-center dark:bg-orange-950/20">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Faites analyser votre devis maintenant
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Résultat en moins de 2 minutes. Rapport PDF complet.
            </p>
            <a
              href="/#upload"
              className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Analyser mon devis — 29 €
            </a>
          </div>

          {/* Local data */}
          <h2 className="mt-12 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Le solaire à {city.name} en chiffres
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <div className="text-3xl font-extrabold text-primary">{city.sunHours}h</div>
              <p className="mt-1 text-sm text-zinc-500">{"d'ensoleillement par an"}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <div className="text-3xl font-extrabold text-primary">{city.avgProduction}</div>
              <p className="mt-1 text-sm text-zinc-500">kWh/kWc/an produits</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <div className="text-3xl font-extrabold text-primary">{roi6kWc}%</div>
              <p className="mt-1 text-sm text-zinc-500">ROI estimé sur 25 ans (6 kWc)</p>
            </div>
          </div>

          {/* Prix */}
          <h2 className="mt-12 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Prix des panneaux solaires à {city.name} en 2026
          </h2>

          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-100">Puissance</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-100">Fourchette de prix TTC</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-100">Production estimée/an</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                <tr className="bg-white dark:bg-zinc-950">
                  <td className="px-4 py-3 font-medium">3 kWc</td>
                  <td className="px-4 py-3">{priceRange3.min.toLocaleString("fr-FR")} – {priceRange3.max.toLocaleString("fr-FR")} €</td>
                  <td className="px-4 py-3">{(3 * city.avgProduction).toLocaleString("fr-FR")} kWh</td>
                </tr>
                <tr className="bg-zinc-50 dark:bg-zinc-900">
                  <td className="px-4 py-3 font-medium">6 kWc</td>
                  <td className="px-4 py-3">{priceRange6.min.toLocaleString("fr-FR")} – {priceRange6.max.toLocaleString("fr-FR")} €</td>
                  <td className="px-4 py-3">{(6 * city.avgProduction).toLocaleString("fr-FR")} kWh</td>
                </tr>
                <tr className="bg-white dark:bg-zinc-950">
                  <td className="px-4 py-3 font-medium">9 kWc</td>
                  <td className="px-4 py-3">{priceRange9.min.toLocaleString("fr-FR")} – {priceRange9.max.toLocaleString("fr-FR")} €</td>
                  <td className="px-4 py-3">{(9 * city.avgProduction).toLocaleString("fr-FR")} kWh</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            Ces prix incluent les panneaux, l'onduleur, la pose, le raccordement Enedis et la mise en service.
            Avec {city.sunHours} heures d'ensoleillement par an, {city.name} offre un bon potentiel solaire
            {city.sunHours >= 2000 ? ", supérieur à la moyenne nationale" : ""}.
          </p>

          {/* What we check */}
          <h2 className="mt-12 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Ce que nous vérifions dans votre devis
          </h2>

          <ul className="mt-6 space-y-3 text-zinc-600 dark:text-zinc-400">
            {[
              "Prix au kWc conforme au marché local",
              "Qualité du matériel (panneaux, onduleur, fixation)",
              "Certification RGE de l'installateur",
              "Garanties (production 25 ans, décennale, onduleur)",
              "Projection financière réaliste (autoconsommation, EDF OA)",
              "Absence de crédit déguisé ou de clauses abusives",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {/* Bottom CTA */}
          <div className="mt-12 rounded-2xl border-2 border-primary bg-orange-50 p-6 text-center dark:bg-orange-950/20">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Ne signez pas sans vérifier
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Un devis mal calibré peut vous coûter des milliers d'euros.
              Faites le bon choix pour votre installation à {city.name}.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/#upload"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Analyser mon devis — 29 €
              </a>
              <a
                href="/diagnostic-gratuit"
                className="rounded-xl border-2 border-green-600 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors dark:text-green-300"
              >
                Pré-diagnostic gratuit
              </a>
            </div>
          </div>

          {/* Internal links to other cities */}
          <div className="mt-12">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Autres villes
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {cities
                .filter((c) => c.slug !== city.slug)
                .slice(0, 10)
                .map((c) => (
                  <a
                    key={c.slug}
                    href={`/devis-panneaux-solaires-${c.slug}`}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 hover:border-primary hover:text-primary transition-colors dark:border-zinc-700 dark:text-zinc-400"
                  >
                    {c.name}
                  </a>
                ))}
            </div>
          </div>
        </article>

        <footer className="border-t border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} DevisPV</p>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="/mentions-legales" className="hover:text-zinc-900">Mentions légales</a>
              <a href="/cgv" className="hover:text-zinc-900">CGV</a>
              <a href="/contact" className="hover:text-zinc-900">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
