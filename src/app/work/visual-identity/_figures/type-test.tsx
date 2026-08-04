"use client";

import type { Bilingual, Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { firaSans, ibmPlexSans, spaceGrotesk } from "./type-test-fonts";

// Section 5 — the number-width test that picked IBM Plex Sans. Same three
// digit patterns, set in each real face, left-aligned and stacked: where a
// typeface's digit widths aren't uniform, the row edges visibly drift
// against each other. (Coherence drops an extra guide-line overlay on top of
// this same effect — skipped here, the stacked-box drift already reads on
// its own without a second absolutely-positioned element to keep in sync.)
const DIGITS = ["0000", "4444", "5555"] as const;

const CARDS: Array<{ name: string; className: string; holds?: boolean }> = [
  { name: "Space Grotesk", className: spaceGrotesk.className },
  { name: "Fira Sans", className: firaSans.className },
  { name: "Geist", className: "font-geist" },
  { name: "IBM Plex Sans", className: ibmPlexSans.className, holds: true },
];

const COPY = {
  drifts: { en: "drifts", es: "varía" },
  holds: { en: "holds", es: "se mantiene" },
  caption: {
    en: "The number-width test, set in the real faces. Every line is the same four digits, so the boxes should be identical. Where they aren't, tables and charts jitter as the data changes.",
    es: "La prueba del ancho de cifras, con las tipografías reales. Todas las líneas tienen las mismas cuatro cifras, así que las cajas deberían ser idénticas. Donde no lo son, las tablas y las gráficas bailan cuando cambian los datos.",
  },
} as const satisfies Record<string, Bilingual>;

export function TypeTestFigure({ lang }: { lang: Lang }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <div
            key={card.name}
            className={cn(
              "bg-card flex flex-col gap-3 rounded-md border p-4",
              card.holds ? "border-foreground/40" : "border-border"
            )}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-foreground text-sm font-medium">
                {card.name}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  card.holds
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {card.holds ? COPY.holds[lang] : COPY.drifts[lang]}
              </span>
            </div>
            <div className="flex flex-col items-start gap-1.5">
              {DIGITS.map((digits) => (
                <span
                  key={digits}
                  className={cn(
                    "border-border bg-muted text-foreground rounded-xs border px-2 py-1 text-lg",
                    card.className
                  )}
                >
                  {digits}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="text-muted-foreground text-xs italic">
        {COPY.caption[lang]}
      </figcaption>
    </figure>
  );
}
