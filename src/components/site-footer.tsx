"use client";

import { t, useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 border-t">
      {/* `font-geist` is redundant now — layout.tsx points every family slot at
          Geist site-wide — but kept as the explicit statement of intent for a
          surface that sits outside `main`. It used to be load-bearing: the footer
          was outside the bento's font scope and rendered Roboto without it. */}
      <div className="text-muted-foreground font-geist mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} Richard Griner. {t("footer.rights", lang)}
        </p>
        {/* Off-site links open in a new tab; the mailto below deliberately does
            not — a blank tab that immediately hands off to a mail client just
            leaves an empty tab behind. `rel="noopener noreferrer"` was already
            here, which only ever mattered alongside the target it was missing. */}
        <nav aria-label="Social links" className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/richardgriner"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            {t("nav.linkedin", lang)}
          </a>
          <a
            href="https://x.com/poppa_richhh"
            target="_blank"
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
