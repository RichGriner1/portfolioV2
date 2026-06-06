"use client";

import { motion } from "motion/react";

import { WorkCard } from "@/components/work-card";
import { sortKey, WORK, type WorkItem } from "@/lib/content/work";

const BENTO_ORDER: Record<NonNullable<WorkItem["bento"]>, number> = {
  tall: 0,
  wide: 1,
  square: 2,
};

const VISIBLE_WORK = WORK.filter((item) => !item.hidden).sort((a, b) => {
  const aBento = a.bento ?? "square";
  const bBento = b.bento ?? "square";
  const bentoDiff = BENTO_ORDER[aBento] - BENTO_ORDER[bBento];
  if (bentoDiff !== 0) return bentoDiff;
  return sortKey(b).localeCompare(sortKey(a));
});

export function MyWork() {
  return (
    <section className="flex flex-col gap-8 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        className="grid grid-cols-1 gap-16 md:grid-cols-4 md:gap-3"
      >
        {VISIBLE_WORK.map((item, index) => (
          <WorkCard key={item.slug} item={item} index={index} />
        ))}
      </motion.div>
    </section>
  );
}
