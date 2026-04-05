import { blogPosts } from "@/lib/blog-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Guides et conseils photovoltaïques",
  description:
    "Guides pratiques pour votre projet solaire : vérifier un devis, éviter les arnaques, comprendre les prix et les aides en France.",
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
        Blog
      </h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        Guides et conseils pour votre projet photovoltaïque.
      </p>

      <div className="mt-12 space-y-8">
        {blogPosts.map((post) => (
          <article key={post.slug} className="group">
            <a href={`/blog/${post.slug}`} className="block">
              <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-orange-900/30">
                  {post.category}
                </span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span>· {post.readTime} de lecture</span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-zinc-900 group-hover:text-primary transition-colors dark:text-zinc-100">
                {post.title}
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {post.description}
              </p>
            </a>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl border-2 border-orange-200 bg-orange-50 p-8 text-center dark:border-orange-800 dark:bg-orange-950/20">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Vous avez reçu un devis ?
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Faites-le analyser par notre système expert en moins de 2 minutes.
        </p>
        <a
          href="/#upload"
          className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Analyser mon devis — 29 €
        </a>
      </div>
    </div>
  );
}
