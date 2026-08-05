"use client";

import { WorkCard } from "@/components/work-card";
import { type WorkItem } from "@/lib/content/work";

/**
 * The shared work grid, used by /projects and /writing.
 *
 * This file used to also hold `MyWork` — the old home page's two labelled
 * shelves, plus the FEATURED_ORDER / PROJECTS / PROCESSES / SHELF_LABELS /
 * SectionRow scaffolding behind it. All of that went unused when the bento
 * replaced the stacked home on 2026-08-05, and was deleted rather than left
 * behind as a second home layout for a future session to mistake for the live
 * one.
 */
export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    // Every tile is square, so a real grid beats masonry: three per row on
    // desktop, with rows staying aligned instead of packing ragged columns.
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <WorkCard key={item.slug} item={item} index={index} />
      ))}
    </div>
  );
}
