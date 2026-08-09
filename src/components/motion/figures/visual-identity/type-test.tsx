"use client";

import { useEffect, useState } from "react";

import type { Bilingual, Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { firaSans, ibmPlexSans, spaceGrotesk } from "./type-test-fonts";
import { useReducedMotion } from "./use-reduced-motion";

// Section 5 — the number-width test that picked IBM Plex Sans. Same three digit
// patterns, set in each real face, left-aligned and stacked: where a typeface's
// digit widths aren't uniform, the row edges visibly drift against each other.
//
// One face at a time, not all four stacked — four full panels made the card face
// taller than every card around it. At rest the figure shows the winner (IBM Plex,
// the answer); while the card is active it replays the test, sliding each contender
// in and ending on the face that held. Reduced motion pins the winner and never
// cycles: the churn is illustration, the verdict is the content.
const DIGITS = ["0000", "4444", "5555"] as const;

const CARDS: Array<{ name: string; className: string; holds?: boolean }> = [
  { name: "Space Grotesk", className: spaceGrotesk.className },
  { name: "Fira Sans", className: firaSans.className },
  { name: "Geist", className: "font-geist" },
  { name: "IBM Plex Sans", className: ibmPlexSans.className, holds: true },
];

const WINNER = CARDS.length - 1;
// Long enough to read the drift; the winner holds longer — it's the payoff.
const BEAT_MS = 1600;
const WINNER_HOLD_MS = 3600;

const COPY = {
  drifts: { en: "drifts", es: "varía" },
  holds: { en: "holds", es: "se mantiene" },
  caption: {
    en: "The number-width test, set in the real faces. Every line is the same four digits, so the boxes should be identical. Where they aren't, tables and charts jitter as the data changes.",
    es: "La prueba del ancho de cifras, con las tipografías reales. Todas las líneas tienen las mismas cuatro cifras, así que las cajas deberían ser idénticas. Donde no lo son, las tablas y las gráficas bailan cuando cambian los datos.",
  },
} as const satisfies Record<string, Bilingual>;

export function TypeTestFigure({
  lang,
  active,
}: {
  lang: Lang;
  active: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const cycling = active && !reducedMotion;
  const [index, setIndex] = useState(() => (cycling ? 0 : WINNER));

  // Activation restarts the test from the first contender; deactivation snaps
  // back to the verdict so the resting face always shows the answer. Adjusted
  // during render (React's prop-change pattern) rather than in an effect, so
  // the reset frame never paints the stale face.
  const [prevCycling, setPrevCycling] = useState(cycling);
  if (prevCycling !== cycling) {
    setPrevCycling(cycling);
    setIndex(cycling ? 0 : WINNER);
  }

  useEffect(() => {
    if (!cycling) return;
    const timeout = setTimeout(
      () => setIndex((i) => (i + 1) % CARDS.length),
      index === WINNER ? WINNER_HOLD_MS : BEAT_MS
    );
    return () => clearTimeout(timeout);
  }, [cycling, index]);

  const card = CARDS[index];

  return (
    <figure className="flex flex-col gap-3">
      {/* Keyed remount per face; @starting-style (Tailwind `starting:`) slides the
          incoming panel in without a keyframe of its own. */}
      <div
        key={card.name}
        className={cn(
          "bg-card flex flex-col gap-3 rounded-md border p-4",
          "ease-out-soft transition-[opacity,translate] duration-[var(--duration-base)] motion-reduce:transition-none starting:translate-x-3 starting:opacity-0",
          card.holds ? "border-foreground/40" : "border-border"
        )}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-foreground text-sm font-medium">
            {card.name}
          </span>
          {/* The verdict chip is solid primary, not the ds-scope `success` green —
              that token only resolves inside .ds-scope (the color-methodology
              demo), so out here it computed to transparent and the winner's badge
              was invisible. Mono site: the strong chip IS the verdict. */}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium",
              card.holds
                ? "bg-primary text-primary-foreground"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {card.holds ? COPY.holds[lang] : COPY.drifts[lang]}
          </span>
        </div>
        {/* Centered on the panel; the drift still reads because both edges of a
            wider row stick out past the rows above it. */}
        <div className="flex flex-col items-center gap-1.5">
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
        {/* Which face of four you're on — and a hint that there are four. */}
        <div className="flex justify-center gap-1" aria-hidden>
          {CARDS.map((c, i) => (
            <span
              key={c.name}
              className={cn(
                "ease-out-soft size-1 rounded-full transition-[background-color] duration-[var(--duration-base)]",
                i === index ? "bg-foreground" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs italic">
        {COPY.caption[lang]}
      </figcaption>
    </figure>
  );
}
