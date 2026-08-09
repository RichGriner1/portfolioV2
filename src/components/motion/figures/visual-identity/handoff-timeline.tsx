"use client";

import { Blocks, Frame, ImageIcon, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

import type { Bilingual, Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Section 1 — "four handoff eras" diagram. The Coherence source draws this as
// a hand-authored inline SVG on a fixed 700×300 viewBox; that layout doesn't
// reflow, so it's rebuilt here as a flex timeline (icon tile → track/dot →
// label) that wraps naturally on narrow screens instead of shrinking text.
type Stage = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: Bilingual;
  meta: Bilingual;
  now?: boolean;
};

const STAGES: Stage[] = [
  {
    icon: ImageIcon,
    label: { en: "PNGs", es: "PNG" },
    meta: { en: "images by email", es: "imágenes por correo" },
  },
  {
    icon: Frame,
    label: { en: "Figma screens", es: "Pantallas de Figma" },
    meta: { en: "flows, no system", es: "flujos, sin sistema" },
  },
  {
    icon: Blocks,
    label: { en: "Material components", es: "Componentes Material" },
    meta: { en: "systemized, opinionated", es: "sistematizado, con opiniones" },
  },
  {
    icon: Sparkles,
    label: { en: "Our own system", es: "Sistema propio" },
    meta: { en: "in code, with AI", es: "en código, con IA" },
    now: true,
  },
];

const COPY = {
  eyebrow: { en: "FOUR HANDOFF ERAS", es: "CUATRO ERAS DE ENTREGA" },
  title: {
    en: "How design reaches code at Afi",
    es: "Cómo llega el diseño al código en Afi",
  },
  now: { en: "NOW", es: "AHORA" },
  caption: {
    en: "Four handoff eras: PNGs from communications, Figma screens without a system, Material components, and now our own system in code.",
    es: "Cuatro eras de entrega: PNG desde comunicación, pantallas de Figma sin sistema, componentes de Material y ahora nuestro propio sistema en código.",
  },
} as const satisfies Record<string, Bilingual>;

export function HandoffTimelineFigure({ lang }: { lang: Lang }) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        className="border-border bg-card rounded-md border p-4 sm:p-6"
        role="img"
        aria-label={COPY.title[lang]}
      >
        <div className="text-center">
          <div className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            {COPY.eyebrow[lang]}
          </div>
          <div className="text-foreground mt-1 text-base font-semibold sm:text-lg">
            {COPY.title[lang]}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="flex min-w-[560px] items-start justify-between gap-2 px-2">
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.label.en}
                  className="flex flex-1 flex-col items-center gap-3"
                >
                  <div
                    className={cn(
                      "bg-background flex size-14 items-center justify-center rounded-lg border",
                      stage.now ? "border-foreground/60" : "border-border"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5",
                        stage.now ? "text-foreground" : "text-muted-foreground"
                      )}
                      aria-hidden
                    />
                  </div>

                  <div className="flex w-full items-center gap-2">
                    <div
                      className={cn(
                        "h-px flex-1",
                        i > 0 ? "bg-border" : "bg-transparent"
                      )}
                    />
                    <div
                      className={cn(
                        "size-2 shrink-0 rounded-full border",
                        stage.now
                          ? "border-foreground bg-foreground"
                          : "border-border bg-background"
                      )}
                    />
                    <div
                      className={cn(
                        "h-px flex-1",
                        i < STAGES.length - 1 ? "bg-border" : "bg-transparent"
                      )}
                    />
                  </div>

                  <div className="text-center">
                    <div className="text-foreground text-xs font-medium">
                      {stage.label[lang]}
                    </div>
                    <div className="text-muted-foreground mt-0.5 text-[11px]">
                      {stage.meta[lang]}
                    </div>
                    {stage.now ? (
                      <span className="bg-foreground text-background mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide">
                        {COPY.now[lang]}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs italic">
        {COPY.caption[lang]}
      </figcaption>
    </figure>
  );
}
