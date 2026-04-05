import type { Metadata } from "next";
import { LogoWithText } from "@/components/logo";

export const metadata: Metadata = {
  title: {
    template: "%s | Blog DevisPV",
    default: "Blog | DevisPV",
  },
  description:
    "Conseils et guides pour votre projet photovolta\u00efque : v\u00e9rifier un devis, \u00e9viter les arnaques, comprendre les prix et les aides.",
  alternates: { canonical: "/blog" },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/">
            <LogoWithText />
          </a>
          <nav className="flex items-center gap-4">
            <a
              href="/blog"
              className="text-sm font-medium text-primary"
            >
              Blog
            </a>
            <a
              href="/#tarifs"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
            >
              Tarifs
            </a>
            <a
              href="/contact"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} DevisPV</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="/mentions-legales" className="hover:text-zinc-900">Mentions l\u00e9gales</a>
            <a href="/cgv" className="hover:text-zinc-900">CGV</a>
            <a href="/contact" className="hover:text-zinc-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
