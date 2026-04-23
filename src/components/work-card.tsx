"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { GLYPHS } from "@/components/motion/glyphs";
import { Badge } from "@/components/ui/badge";
import { KIND_LABELS, type WorkItem } from "@/lib/content/work";
import { pick, useLang } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const AUTHOR = "Richard Griner";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
    >
      <Link href={item.href} className="group flex flex-col gap-4">
        <motion.div
          className="bg-muted/50 relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl"
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          <Glyph />
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className="bg-background/70 backdrop-blur">
              {pick(KIND_LABELS[item.kind], lang)}
            </Badge>
          </div>
        </motion.div>
        <div className="flex flex-col gap-2">
          <h3 className="text-foreground font-display text-xl font-bold tracking-tight decoration-2 underline-offset-4 group-hover:underline">
            {pick(item.title, lang)}
          </h3>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {pick(item.description, lang)}
          </p>
          <div className="text-muted-foreground mt-2 font-mono text-xs tracking-wider">
            {AUTHOR} · {formatDate(item, locale)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
