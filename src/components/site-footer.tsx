"use client";

import { t, useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 border-t">
      {/* Geist across the whole footer, on every page. The place line below
          dropped its `font-mono` for the same reason — it would have overridden
          this back to Roboto Mono. */}
      <div className="text-muted-foreground font-geist mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} Richard Griner. {t("footer.rights", lang)}
        </p>
        <nav aria-label="Social links" className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/richardgriner"
            rel="noopener noreferrer"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            {t("nav.linkedin", lang)}
          </a>
          <a
            href="https://x.com/poppa_richhh"
            rel="noopener noreferrer"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            X
          </a>
          <a
            href="mailto:richardgrinerdesigns@gmail.com"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            {t("nav.email", lang)}
          </a>
        </nav>
      </div>
    </footer>
  );
}
