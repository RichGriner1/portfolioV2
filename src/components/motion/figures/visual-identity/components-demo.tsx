"use client";

import { useId } from "react";

import { Button } from "@/components/ui/button";
import type { Bilingual, Lang } from "@/lib/i18n";

// Section 6 — "components in code, documentation in Figma". The Coherence
// demo drops the team's own afi-button-v2 / afi-input-v2 primitives inline to
// prove they're live components, not a screenshot. This repo doesn't have an
// Input primitive yet, so the field is a small local element styled on the
// same tokens/focus treatment as <Button> rather than a new shadcn/ui/
// component — this figure is presentational only, no new design-system
// surface is being introduced.
const COPY = {
  primary: { en: "Primary action", es: "Acción principal" },
  secondary: { en: "Secondary", es: "Secundaria" },
  ghost: { en: "Ghost", es: "Ghost" },
  label: { en: "Client", es: "Cliente" },
  caption: {
    en: "Not a screenshot: these are the live components, running on the same tokens that style this article. Hover them.",
    es: "No es una captura: son los componentes reales, funcionando con los mismos tokens que dan estilo a este artículo. Pasa el cursor por encima.",
  },
} as const satisfies Record<string, Bilingual>;

export function ComponentsDemoFigure({ lang }: { lang: Lang }) {
  const inputId = useId();

  return (
    <div className="border-border bg-background flex flex-col gap-4 rounded-md border p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="default">{COPY.primary[lang]}</Button>
        <Button variant="secondary">{COPY.secondary[lang]}</Button>
        <Button variant="ghost">{COPY.ghost[lang]}</Button>
        <div className="min-w-40 flex-1">
          <label
            htmlFor={inputId}
            className="text-muted-foreground mb-1 block text-xs font-medium"
          >
            {COPY.label[lang]}
          </label>
          <input
            id={inputId}
            type="text"
            placeholder="Ana García"
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border px-2.5 text-sm transition-colors outline-none focus-visible:ring-3"
          />
        </div>
      </div>
      <p className="text-muted-foreground text-xs italic">
        {COPY.caption[lang]}
      </p>
    </div>
  );
}
