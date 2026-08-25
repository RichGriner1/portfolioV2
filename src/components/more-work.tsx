"use client";

import { WorkGrid } from "@/components/my-work";
import { WORK } from "@/lib/content/work";
import { t, useLang } from "@/lib/i18n";

/**
 * The "More case studies" shelf that closes a long read — a case study or a post.
 *
 * One component, on purpose: every page with a "more work" section shows the SAME
 * animated cards the bento and /projects are built from. `/writing/<slug>` used to
 * hand-roll a text row here (title + description + arrow), which meant the site had
 * two different answers to "what does a work card look like", and the hand-rolled one
 * also read `w.title.en` / `w.description.en` directly — so a Spanish reader got an
 * English shelf.
 *
 * Don't shrink the media to make a compact variant. CardMedia can't be scaled down:
 * its figures and glyphs are authored at fixed pixel sizes (the loop figure's nodes
 * are 366px wide), so a small frame crops the composition rather than fitting it. A
 * 96px thumbnail rendered a meaningless corner — "BBVA / Caix" sliced mid-word, the
 * KT360 terminal cut off after its first path. intro-preview-link.tsx hit the same
 * wall and solved it the same way: give the figure its full square.
 */
export function MoreWork({
  /** Omit the piece being read, so the shelf never points back at this page. */
  excludeSlug,
  /**
   * Cap the shelf. A case study passes 3: the reader has just finished a long
   * page, and a full grid of everything else reads as a second board rather
   * than a suggestion. Left open elsewhere.
   */
  limit,
  className,
}: {
  excludeSlug?: string;
  limit?: number;
  className?: string;
}) {
  const { lang } = useLang();

  const all = WORK.filter(
    (w) => !w.hidden && w.kind === "case-study" && w.slug !== excludeSlug
  );
  const items = limit ? all.slice(0, limit) : all;

  if (items.length === 0) return null;

  return (
    <section
      className={
        className ?? "border-border/60 flex flex-col gap-6 border-t pt-12"
      }
    >
      <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
        {t("work.more", lang)}
      </h2>
      <WorkGrid items={items} />
    </section>
  );
}
