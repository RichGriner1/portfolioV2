"use client";

import { WorkCard } from "@/components/work-card";
import { sortKey, WORK, type WorkItem } from "@/lib/content/work";

// Newest first. Order flows down the masonry columns.
const VISIBLE_WORK = WORK.filter((item) => !item.hidden).sort((a, b) =>
  sortKey(b).localeCompare(sortKey(a))
);

// Home is split into two labeled shelves (Figma: Story-architect 104:359):
// Projects = the built work, Processes = the writing about how it was built.
const PROJECTS = VISIBLE_WORK.filter((item) => item.type !== "writing");
const PROCESSES = VISIBLE_WORK.filter((item) => item.type === "writing");

// Section labels stay English in both languages for now. TODO(afi-redaccion)
function SectionRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-muted-foreground shrink-0 font-mono text-xs tracking-wider uppercase">
        {label}
      </h2>
      <div aria-hidden="true" className="bg-border h-px flex-1" />
    </div>
  );
}

function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    // Pinterest / shopify.design-style masonry: cards keep their natural
    // height and pack into columns.
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map((item, index) => (
        <WorkCard key={item.slug} item={item} index={index} />
      ))}
    </div>
  );
}

export function MyWork() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <SectionRow label="Projects" />
        <WorkGrid items={PROJECTS} />
      </section>
      <section className="flex flex-col gap-6">
        <SectionRow label="Processes" />
        <WorkGrid items={PROCESSES} />
      </section>
    </div>
  );
}
