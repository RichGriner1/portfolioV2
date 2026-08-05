"use client";

import { useLang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    // Two glyphs of 14px type is a 20×20 box, under the 24px WCAG 2.5.8 minimum
    // and the smallest control left in the mobile bar. `p-1.5 -m-1.5` takes it to
    // 32×32 while the negative margin keeps the header row's spacing unchanged —
    // the same pairing the CV button and the header nav links use.
    <button
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground -m-1.5 p-1.5 text-sm tracking-wider uppercase transition-colors"
      aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
    >
      {lang === "en" ? "ES" : "EN"}
    </button>
  );
}
