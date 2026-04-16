"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { GLYPHS } from "@/components/motion/glyphs";
import type { WorkItem } from "@/lib/content/work";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * WorkCard — card-grid tile with a centered glyph "stage" above project
 * meta/title/description. Glyph animations play via the shared
 * `rest → hover` variant system, driven by the card's hover state.
 */
export function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const Glyph = GLYPHS[item.glyph];

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
    >
      <motion.div
        className="h-full"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <Link
          href={item.href}
          className="border-border/60 bg-card/50 hover:border-border hover:bg-card group flex h-full flex-col overflow-hidden rounded-3xl border transition-colors"
        >
          <div className="bg-muted/40 flex h-56 items-center justify-center p-8">
            <Glyph />
          </div>

          <div className="flex flex-1 flex-col gap-1.5 px-6 py-5">
            <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
              <span>{item.year}</span>
              {item.revamp && <span aria-label="Revamping">· revamping</span>}
            </div>
            <h3 className="font-display flex items-center gap-2 text-xl font-bold tracking-tight">
              <span>{item.title}</span>
              <motion.span
                aria-hidden
                variants={{
                  rest: { opacity: 0, x: -4 },
                  hover: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-muted-foreground text-base"
              >
                →
              </motion.span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
