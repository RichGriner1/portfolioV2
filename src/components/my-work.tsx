"use client";

import { WorkCard } from "@/components/work-card";
import { sortKey, WORK } from "@/lib/content/work";

// Newest first. Order flows down the masonry columns.
const VISIBLE_WORK = WORK.filter((item) => !item.hidden).sort((a, b) =>
  sortKey(b).localeCompare(sortKey(a))
);

export function MyWork() {
  return (
    <section className="pt-4">
      {/* Pinterest / shopify.design-style masonry: cards keep their natural
          height and pack into columns. */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {VISIBLE_WORK.map((item, index) => (
          <WorkCard key={item.slug} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
