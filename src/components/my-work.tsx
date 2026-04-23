"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { WorkCard } from "@/components/work-card";
import { cn } from "@/lib/utils";
import { sortKey, WORK, type WorkItem } from "@/lib/content/work";
import { t, useLang, type UIKey } from "@/lib/i18n";

type TabKey = "new-releases" | "all" | "case-studies" | "processes";

const TABS: Array<{ key: TabKey; labelKey: UIKey }> = [
  { key: "new-releases", labelKey: "tabs.new_releases" },
  { key: "all", labelKey: "tabs.all" },
  { key: "case-studies", labelKey: "tabs.case_studies" },
  { key: "processes", labelKey: "tabs.processes" },
];

function filterItems(tab: TabKey, items: WorkItem[]): WorkItem[] {
  const sorted = [...items].sort((a, b) =>
    sortKey(b).localeCompare(sortKey(a))
  );
  switch (tab) {
    case "new-releases":
      return sorted.slice(0, 3);
    case "case-studies":
      return sorted.filter((i) => i.kind === "case-study");
    case "processes":
      return sorted.filter((i) => i.kind === "process");
    case "all":
    default:
      return sorted;
  }
}

export function MyWork() {
  const { lang } = useLang();
  const [active, setActive] = useState<TabKey>("new-releases");
  const items = useMemo(() => filterItems(active, WORK), [active]);

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

      <nav
        className="border-border flex flex-wrap gap-6 border-b pb-3 text-sm"
        aria-label="Work categories"
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              aria-pressed={isActive}
              className={cn(
                "relative -mb-[13px] pb-3 transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(tab.labelKey, lang)}
              {isActive && (
                <motion.span
                  layoutId="my-work-tab-underline"
                  className="bg-foreground absolute inset-x-0 -bottom-px h-px"
                />
              )}
            </button>
          );
        })}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, index) => (
            <WorkCard key={item.slug} item={item} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
