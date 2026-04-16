import { WorkCard } from "@/components/work-card";
import { WORK } from "@/lib/content/work";

/**
 * Combined index of projects (and later, writing). Reverse-chronological.
 * Card grid — each card has a glyph stage at the top encoding the project's
 * central idea via `motion/react` (see `.choreograph` agent).
 */
export function WorkIndex() {
  return (
    <section className="flex flex-col gap-6 pt-4">
      <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
        Selected work
      </h2>
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
        {WORK.map((item, index) => (
          <WorkCard key={item.slug} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
