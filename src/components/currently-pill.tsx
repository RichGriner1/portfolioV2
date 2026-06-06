"use client";

import { pick, useLang, type Bilingual } from "@/lib/i18n";

const CURRENTLY_LABEL: Bilingual = {
  en: "Currently",
  es: "Actualmente", // TODO(afi-redaccion)
};

// TODO(afi-redaccion): polish ES copy
const CURRENTLY: Bilingual = {
  en: "Design systems @ Afi",
  es: "Sistemas de diseño @ Afi",
};

const CURRENTLY_ARIA: Bilingual = {
  en: "Richard Griner — currently at Afi",
  es: "Richard Griner — actualmente en Afi", // TODO(afi-redaccion)
};

export function CurrentlyPill() {
  const { lang } = useLang();
  return (
    <div className="hidden items-center gap-2 sm:inline-flex">
      <span className="text-muted-foreground text-sm">
        {pick(CURRENTLY_LABEL, lang)}
      </span>
      <a
        href="https://www.afi.es"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={pick(CURRENTLY_ARIA, lang)}
        className="bg-muted text-foreground hover:bg-accent inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm transition-colors"
      >
        <span
          aria-hidden="true"
          className="bg-primary size-1.5 shrink-0 rounded-full"
        />
        <span>{pick(CURRENTLY, lang)}</span>
      </a>
    </div>
  );
}
