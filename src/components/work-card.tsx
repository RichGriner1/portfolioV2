"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { GLYPHS } from "@/components/motion/glyphs";
import { KIND_LABELS, type WorkItem } from "@/lib/content/work";
import { useIsMobile } from "@/lib/hooks";
import { pick, t, useLang } from "@/lib/i18n";

function OngoingChip({ label }: { label: string }) {
  return (
    <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 absolute top-2 right-2 z-10 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase backdrop-blur-sm">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

const BENTO_CLASS = {
  square: "md:col-span-1 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
  wide: "md:col-span-2 md:row-span-1",
} as const;

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
  const Glyph = GLYPHS[item.glyph];
  const locale = lang === "es" ? "es-ES" : "en-US";
  const bentoClass = BENTO_CLASS[item.bento ?? "square"];

  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Scroll-driven carousel effect on mobile: cards centered in viewport are
  // full opacity + full scale, edges fade and shrink. Desktop ignores this.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const mobileOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 1, 1, 0.3]
  );
  const mobileScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.88, 1, 1, 0.88]
  );

  // Desktop keeps the whileInView entry animation; mobile uses scroll-linked
  // styles instead so there's no conflict between the two.
  if (isMobile) {
    return (
      <motion.div
        ref={cardRef}
        className={bentoClass}
        style={{ opacity: mobileOpacity, scale: mobileScale }}
      >
        <Link href={item.href} className="group flex flex-col gap-4">
          <div
            style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}
            className="bg-card border-border duration-base ease-out-soft relative aspect-square overflow-hidden rounded-2xl border transition-all group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-lg"
          >
            <div className="absolute inset-2 flex items-center justify-center">
              <Glyph active />
            </div>
            {item.ongoing && <OngoingChip label={t("work.ongoing", lang)} />}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-foreground font-display text-base font-bold tracking-tight decoration-2 underline-offset-4 group-hover:underline">
              {pick(item.title, lang)}
            </h3>
            <div className="text-muted-foreground font-mono text-xs tracking-wider">
              {pick(KIND_LABELS[item.kind], lang)} · {formatDate(item, locale)}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
      className={bentoClass}
    >
      <Link href={item.href} className="group flex flex-col gap-4">
        {/* Thumbnail */}
        <div
          style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}
          className="bg-card border-border duration-base ease-out-soft relative aspect-square overflow-hidden rounded-2xl border transition-all group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-lg"
        >
          <div className="absolute inset-2 flex items-center justify-center">
            <Glyph active />
          </div>
          {item.ongoing && <OngoingChip label={t("work.ongoing", lang)} />}
        </div>

        {/* Text below */}
        <div className="flex flex-col gap-1">
          <h3 className="text-foreground font-display text-base font-bold tracking-tight decoration-2 underline-offset-4 group-hover:underline">
            {pick(item.title, lang)}
          </h3>
          <div className="text-muted-foreground font-mono text-xs tracking-wider">
            {pick(KIND_LABELS[item.kind], lang)} · {formatDate(item, locale)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
