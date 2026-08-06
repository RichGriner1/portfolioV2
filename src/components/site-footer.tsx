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
        {/* The place line, back here as of 2026-08-06. It spent a day closing the
            bento's intro tile, where on mobile it read as one more sentence of the
            intro rather than a signature — see the note in bento-home.tsx.
            Here it has the footer rule above it and sits opposite the copyright,
            which is the register it belongs in.

            The socials that were in this row came off in the same move. They were
            duplicated from the nav panel, and on mobile they stacked directly under
            the intro tile, which is what made the whole footer read as a tail on
            the intro. One home for them, in the menu. */}
        <p>{t("footer.built", lang)}</p>
      </div>
    </footer>
  );
}
