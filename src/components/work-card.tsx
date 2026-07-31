"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { FIGURES } from "@/components/motion/figures";
import { GLYPHS } from "@/components/motion/glyphs";
import { KIND_LABELS, type WorkItem } from "@/lib/content/work";
import { cn } from "@/lib/utils";
import { pick, t, useLang, type Lang } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * Card media. A language-keyed video (object-cover, fills the tile) when the
 * item has one, else its glyph centered on the surface.
 */
function CardMedia({ item, lang }: { item: WorkItem; lang: Lang }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const mode = mounted && resolvedTheme === "dark" ? "dark" : "light";

  if (item.video) {
    const src = `${item.video}_${lang}_${mode}_thumb.mp4`;
    // Same inner-panel treatment as figures: content in the middle, border
    // around it, at the standard p-2 inset.
    return (
      <div className="pointer-events-none absolute inset-0 p-2">
        <div className="bg-card border-border/60 h-full overflow-hidden rounded-2xl border">
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
    // The figure's framed panel fills the standard p-2 inset, so the tile
    // reads like every other thumbnail: content in the middle, border around.
    return (
      <div className="pointer-events-none absolute inset-0 p-2">
        <Figure />
      </div>
    );
  }
  if (item.glyph) {
    const Glyph = GLYPHS[item.glyph];
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-2">
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
  return String(item.year);
}

export function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const { lang } = useLang();
  const locale = lang === "es" ? "es-ES" : "en-US";
  // Every tile is square; the v4 thumbnails are 1080×1080 so they fill it exactly.
  const aspect = "aspect-square";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index, 8) * 0.06,
        ease: EASE,
      }}
      className="mb-6 break-inside-avoid"
    >
      <Link href={item.href} className="group block">
        {/* Media tile */}
        <div
          className={cn(
            "border-border bg-card duration-base ease-out-soft relative w-full overflow-hidden rounded-2xl border transition-all group-hover:-translate-y-1 group-hover:shadow-lg",
            aspect
          )}
          style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}
        >
          <CardMedia item={item} lang={lang} />

          {/* Hover devices only: glass panel revealed on hover */}
          <div className="bg-background/60 duration-base ease-out-soft absolute inset-0 hidden flex-col justify-between p-4 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 [@media(hover:hover)]:flex">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground font-mono text-[10px] font-medium tracking-wider uppercase">
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
        <div className="mt-3 hidden flex-col gap-1 [@media(hover:none)]:flex">
          <span className="text-muted-foreground font-mono text-[10px] font-medium tracking-wider uppercase">
            {pick(KIND_LABELS[item.kind], lang)}
          </span>
          <h3 className="text-foreground font-display text-base font-bold tracking-tight">
            {pick(item.title, lang)}
          </h3>
          <div className="text-muted-foreground font-mono text-xs tracking-wider">
            {formatDate(item, locale)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
