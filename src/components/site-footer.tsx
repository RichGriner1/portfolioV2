"use client";

import { t, useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
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
            href="mailto:richardgrinerdesigns@gmail.com"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            {t("nav.email", lang)}
          </a>
        </nav>
        <p className="font-mono text-xs">{t("footer.built", lang)}</p>
      </div>
    </footer>
  );
}
