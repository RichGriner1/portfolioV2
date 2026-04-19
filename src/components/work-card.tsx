"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { GLYPHS } from "@/components/motion/glyphs";
import type { WorkItem } from "@/lib/content/work";

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const Glyph = GLYPHS[item.glyph];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
      className={item.featured ? "col-span-2" : "col-span-1"}
    >
      <motion.div
        className="group relative overflow-hidden rounded-3xl"
        style={{ aspectRatio: item.featured ? "16/7" : "4/3" }}
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <Link href={item.href} className="absolute inset-0">
          {/* Background stage */}
          <div className="bg-muted/50 absolute inset-0 flex items-center justify-center">
            <Glyph />
          </div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-6"
            variants={{
              rest: { backgroundColor: "hsl(var(--background)/0)" },
              hover: { backgroundColor: "hsl(var(--background)/0.88)" },
            }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <motion.div
              className="flex flex-col gap-2"
              variants={{
                rest: { opacity: 0, y: 12 },
                hover: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, delay: 0.05, ease: EASE }}
            >
              <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {item.year}
              </div>
              <h3 className="text-foreground font-display text-2xl font-bold tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                {item.description}
              </p>
              <span className="text-foreground mt-1 font-mono text-xs">
                View case study →
              </span>
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
