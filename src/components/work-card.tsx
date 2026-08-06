"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { BlurFade } from "@/components/motion/blur-fade";
import { FIGURES } from "@/components/motion/figures";
import { GLYPHS } from "@/components/motion/glyphs";
import { formatYears, KIND_LABELS, type WorkItem } from "@/lib/content/work";
import { cn } from "@/lib/utils";
import { pick, t, useLang, type Lang } from "@/lib/i18n";

/**
 * Card media. A language-keyed video (object-cover, fills the tile) when the
 * item has one, else its glyph centered on the surface. Exported so other
 * surfaces (e.g. the "More case studies" tiles) resolve media the same way.
 */
export function CardMedia({ item, lang }: { item: WorkItem; lang: Lang }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const mode = mounted && resolvedTheme === "dark" ? "dark" : "light";

  if (item.video) {
    const src = `${item.video}_${lang}_${mode}_thumb.mp4`;
    // Same inner-panel treatment as figures: content in the middle, border
    // around it, at the standard p-3 inset.
    return (
      <div className="pointer-events-none absolute inset-0 p-3">
        <div className="bg-card border-border/60 h-full overflow-hidden rounded-xl border">
          <video
            key={src}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            ref={(el) => {
              if (el) el.muted = true;
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      </div>
    );
  }
  if (item.figure) {
    const Figure = FIGURES[item.figure];
    // The figure's framed panel fills the standard p-3 inset, so the tile
    // reads like every other thumbnail: content in the middle, border around.
    return (
      <div className="pointer-events-none absolute inset-0 p-3">
        <Figure />
      </div>
    );
  }
  if (item.glyph) {
    const Glyph = GLYPHS[item.glyph];
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3">
        <Glyph active />
      </div>
    );
  }
  return null;
}

function formatDate(item: WorkItem, locale: string): string {
  if (item.date) {
    const [y, m, d] = item.date.split("-").map(Number);
    const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }
  return formatYears(item);
}

export function WorkCard({
  item,
  index,
  fill = false,
  caption = true,
}: {
  item: WorkItem;
  index: number;
  /** Fill the parent's height (for bento spans) instead of forcing a square.
      Square media (1080×1080 thumbs) center-crops via object-cover. */
  fill?: boolean;
  /**
   * Render the touch-device caption under the tile. On in the index grids
   * (/projects, /writing), off in the bento.
   *
   * The caption exists because the title panel is hover-only, so a touch device
   * would otherwise get an unlabelled graphic. In a list that's the only label
   * there is, and it has room to sit under a square. The bento has neither: its
   * rows are a fixed 238px track and the caption's height lands *outside* the
   * tile, so every captioned card grew taller than its grid cell and the whole
   * composition stopped lining up. That's the "straight bento" the home wants.
   *
   * Defaults to on so the failure mode of forgetting it is a visible layout
   * break rather than a silently unlabelled link.
   */
  caption?: boolean;
}) {
  const { lang } = useLang();
  const locale = lang === "es" ? "es-ES" : "en-US";
  /**
   * `fill` only means "fill the cell" from `sm` up. Below that the bento is a
   * single column with `auto` rows, so there is no cell height to fill — `h-full`
   * would resolve against an auto-height row and collapse the tile. A square at
   * full column width is both the right proportion there and the most room these
   * fixed-size figures can get.
   */
  const aspect = fill
    ? "aspect-square sm:aspect-auto sm:h-full"
    : "aspect-square";

  return (
    <BlurFade
      inView
      inViewMargin="-60px"
      delay={Math.min(index, 8) * 0.06}
      className={fill ? "sm:h-full" : undefined}
    >
      {/* Explicit accessible name, not left to whichever visual layer happens to
          be showing. The title panel is hover-only and the caption is touch-only,
          so with `caption={false}` a touch device has no text in the link at all
          — display:none keeps it out of the accessibility tree too. Naming the
          link here means it reads the same at every width. */}
      <Link
        href={item.href}
        aria-label={`${pick(KIND_LABELS[item.kind], lang)}: ${pick(item.title, lang)}`}
        className={cn("group block", fill && "sm:h-full")}
      >
        {/* Media tile */}
        <div
          className={cn(
            "border-border bg-card ease-out-soft relative w-full overflow-hidden rounded-2xl border transition-all duration-[var(--duration-base)] group-hover:-translate-y-1 group-hover:shadow-lg",
            aspect
          )}
          style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}
        >
          <CardMedia item={item} lang={lang} />

          {/* Hover devices only: glass panel revealed on hover. z-10 keeps it
              above media content whose internals carry their own z-index
              (e.g. figure dots), which would otherwise punch through it. */}
          <div className="bg-background/60 ease-out-soft absolute inset-0 z-10 hidden flex-col justify-between p-4 opacity-0 backdrop-blur-md transition-opacity duration-[var(--duration-base)] group-hover:opacity-100 [@media(hover:hover)]:flex">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground font-mono text-[10px] font-medium">
                {pick(KIND_LABELS[item.kind], lang)}
              </span>
              <h3 className="text-foreground font-display text-lg font-bold tracking-tight text-balance">
                {pick(item.title, lang)}
              </h3>
              <div className="text-foreground/70 font-mono text-xs tracking-wider">
                {formatDate(item, locale)}
              </div>
              <p className="text-foreground/80 mt-2 line-clamp-3 max-w-[36ch] text-sm leading-snug">
                {pick(item.description, lang)}
              </p>
            </div>
            <div className="text-foreground self-end font-mono text-xs font-medium tracking-wider">
              {t("home.read_more", lang)} →
            </div>
          </div>
        </div>

        {/* Touch devices only: title + info below the graphic */}
        {caption ? (
          <div className="mt-3 hidden flex-col gap-1 [@media(hover:none)]:flex">
            <span className="text-muted-foreground font-mono text-[10px] font-medium">
              {pick(KIND_LABELS[item.kind], lang)}
            </span>
            <h3 className="text-foreground font-display text-base font-bold tracking-tight">
              {pick(item.title, lang)}
            </h3>
            <div className="text-muted-foreground font-mono text-xs tracking-wider">
              {formatDate(item, locale)}
            </div>
          </div>
        ) : null}
      </Link>
    </BlurFade>
  );
}
