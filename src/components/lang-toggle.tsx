"use client";

import { useLang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground text-sm tracking-wider uppercase transition-colors"
      aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
    >
      {lang === "en" ? "ES" : "EN"}
    </button>
  );
}
