"use client";

import { WorkCard } from "@/components/work-card";
import { sortKey, WORK, type WorkItem } from "@/lib/content/work";

// Newest first. Order flows down the masonry columns.
const VISIBLE_WORK = WORK.filter((item) => !item.hidden).sort((a, b) =>
  sortKey(b).localeCompare(sortKey(a))
);

// Home is split into two labeled shelves (Figma: Story-architect 104:359):
// Projects = case studies; Processes = how the work gets made (writing,
// methodology — e.g. "Building color in four layers" is a process).
const PROJECTS = VISIBLE_WORK.filter((item) => item.kind === "case-study");
const PROCESSES = VISIBLE_WORK.filter((item) => item.kind !== "case-study");

// Section labels stay English in both languages for now. TODO(afi-redaccion)
function SectionRow({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 id={id} className="text-muted-foreground shrink-0 font-mono text-xs">
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
      <section aria-labelledby="shelf-projects" className="flex flex-col gap-6">
        <SectionRow id="shelf-projects" label="Projects" />
        <WorkGrid items={PROJECTS} />
      </section>
      <section
        aria-labelledby="shelf-processes"
        className="flex flex-col gap-6"
      >
        <SectionRow id="shelf-processes" label="Processes" />
        <WorkGrid items={PROCESSES} />
      </section>
    </div>
  );
}
