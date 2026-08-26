"use client";

import Link from "next/link";

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
/** The kinds /writing gathers, matching writing-list.tsx and the canvas board. */
const WRITING_KINDS: readonly string[] = ["blog", "process", "methodology"];

export function MoreWork({
  /**
   * Which shelf this is. Case studies by default, which is what both call sites
   * showed before this existed — including the bottom of a blog post, where
   * "More case studies" was the only thing on offer after a piece of writing.
   */
  kind = "case-study",
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
  kind?: "case-study" | "writing";
  excludeSlug?: string;
  limit?: number;
  className?: string;
}) {
  const { lang } = useLang();

  const all = WORK.filter(
    (w) =>
      !w.hidden &&
      (kind === "writing"
        ? WRITING_KINDS.includes(w.kind)
        : w.kind === "case-study") &&
      w.slug !== excludeSlug
  );
  const items = limit ? all.slice(0, limit) : all;

  if (items.length === 0) return null;

  return (
    <section
      className={
        className ?? "border-border/60 flex flex-col gap-6 border-t pt-12"
      }
    >
      {/* Heading and the way out on one line, the same pair the canvas board's
          section headers carry. The shelf shows three of everything, so without
          a route to the index it quietly implies that three is all there is —
          the same argument that put "See all" on the board. */}
      <div className="flex items-baseline gap-3">
        <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
          {t(kind === "writing" ? "work.more_writing" : "work.more", lang)}
        </h2>
        <Link
          href={kind === "writing" ? "/writing" : "/projects"}
          className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-wider transition-colors"
        >
          {t("nav.see_all", lang)} →
        </Link>
      </div>
      <WorkGrid items={items} />
    </section>
  );
}
