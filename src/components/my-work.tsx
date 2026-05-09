"use client";

import { motion } from "motion/react";

import { WorkCard } from "@/components/work-card";
import { sortKey, WORK } from "@/lib/content/work";
import { t, useLang } from "@/lib/i18n";

const VISIBLE_WORK = WORK.filter((item) => !item.hidden).sort((a, b) =>
  sortKey(b).localeCompare(sortKey(a))
);

export function MyWork() {
  const { lang } = useLang();

  return (
    <section className="flex flex-col gap-8 pt-4">
      <header className="flex flex-col gap-3">
        <h2 className="text-foreground font-display text-4xl font-bold tracking-tight md:text-5xl">
          {t("home.my_work", lang)}
        </h2>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
          {t("home.my_work_intro", lang)}
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
      >
        {VISIBLE_WORK.map((item, index) => (
          <WorkCard key={item.slug} item={item} index={index} />
        ))}
      </motion.div>
    </section>
  );
}
