"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Bilingual, Lang } from "@/lib/i18n";

import { MOODBOARD_SLIDES } from "./moodboard-data";

// Section 3 — click-through of the Mobbin moodboard.
const COPY = {
  prev: { en: "Previous screen", es: "Pantalla anterior" },
  next: { en: "Next screen", es: "Pantalla siguiente" },
  caption: {
    en: "The Mobbin inspiration, screen by screen. Use the arrows to go through them.",
    es: "La inspiración de Mobbin, pantalla a pantalla. Usa las flechas para recorrerla.",
  },
} as const satisfies Record<string, Bilingual>;

export function MoodboardGalleryFigure({ lang }: { lang: Lang }) {
  const [index, setIndex] = useState(0);
  const slide = MOODBOARD_SLIDES[index];
  const total = MOODBOARD_SLIDES.length;

  const step = (delta: number) => {
    setIndex((i) => (i + delta + total) % total);
  };

  const alt =
    lang === "en"
      ? `${slide.app} — Mobbin moodboard screen ${index + 1} of ${total}`
      : `${slide.app} — pantalla ${index + 1} de ${total} del moodboard de Mobbin`;

  return (
    <figure className="flex flex-col gap-3">
      <div className="border-border bg-muted aspect-[1920/1325] overflow-hidden rounded-md border">
        <img
          key={slide.src}
          src={slide.src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={COPY.prev[lang]}
          onClick={() => step(-1)}
        >
          <ChevronLeft aria-hidden />
        </Button>
        <span className="text-muted-foreground inline-flex min-w-24 items-baseline justify-center gap-1 text-center text-xs tabular-nums">
          <strong className="text-foreground font-medium">{slide.app}</strong>
          {index + 1} / {total}
        </span>
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={COPY.next[lang]}
          onClick={() => step(1)}
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>

      <figcaption className="text-muted-foreground text-center text-xs italic">
        {COPY.caption[lang]}
      </figcaption>
    </figure>
  );
}
