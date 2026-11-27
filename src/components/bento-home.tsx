"use client";

import { BlurFade } from "@/components/motion/blur-fade";
import { IntroHeadline, IntroParagraphs } from "@/components/home-intro";
import { TalkTile } from "@/components/talk-tile";
import { WorkCard } from "@/components/work-card";
import { WORK } from "@/lib/content/work";
import { cn } from "@/lib/utils";

/**
 * The home page composition. Started as a throwaway prototype under
 * /playground/bento-home and replaced the old stacked intro + work shelves on
 * 2026-08-05.
 *
 * Strict module: 4 columns, 8px gutters, 238px rows; variety comes from spans
 * (2×2 / 2×1 / 1×1), not bespoke layouts. Tiles are 16px-radius frames; the ones
 * holding a graphic inset it by 12px behind a 12px panel, which is where the
 * composition stops reading as an lfs.gd copy. Radii come from `.bento-frame` in
 * globals.css.
 *
 * The home deliberately carries only current, highest-value work — seven of the
 * fifteen WORK entries. Everything else is reachable from the footer index, so
 * /projects and /writing have something the home doesn't.
 */

// EMAIL, TALK, TALK_PARTS, TALK_CLIP and TalkTile itself moved to
// components/talk-tile.tsx on Richard's call — the canvas route needed the same
// contact card and had started growing a second, thinner copy of it.

function bySlug(slug: string) {
  const item = WORK.find((w) => w.slug === slug);
  if (!item) throw new Error(`bento-home: unknown slug ${slug}`);
  return item;
}

/* The shared frame: 16px radius, one border, nothing nested inside. The
   12px-pad-plus-12px-inner-panel treatment belongs to tiles whose content is a
   graphic (WorkCard already renders it, in CardMedia); on a text tile the
   second border is a box around a box, so text tiles are frame + copy and set
   their own padding. */
const FRAME =
  "border-border bg-card relative overflow-hidden rounded-2xl border";

function Tile({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn(FRAME, className)}>{children}</div>;
}

export function BentoHome() {
  return (
    <main className="bento-frame mx-auto w-full max-w-5xl flex-1 px-6 pt-10 pb-24">
      {/* Two layouts, not one that stretches. From `sm` up it's the authored
          module: 4 columns, 8px gutters, 238px rows, so row height = column width
          and a 2×2 span is exactly as tall as it is wide.

          Below `sm` it's a single column, and every span is dropped. The module
          doesn't survive being squeezed: a 1×1 tile on a phone is ~160px across,
          and these figures are authored at fixed sizes — the design.md glyph came
          out mangled and the Mindfulme eye swam in a box far bigger than it. Every
          attempt to fix that by adjusting the grid moved the problem somewhere
          else: matching row height to column width cut "Bankinter" off, a flat
          190px clipped the intro paragraph by 83px, and giving the bank list two
          rows left white space above it.

          One column gives every figure the full content width — 272px at 320, 342px
          at 390 — which is the width they were drawn for. Rows are `auto`, so each
          tile is as tall as its own content needs and the page simply gets longer.
          The composition is a desktop composition; on a phone it's a stack. */}
      <div className="grid auto-rows-auto grid-cols-1 gap-2 sm:auto-rows-[238px] sm:grid-cols-4">
        {/* Rows 1–2 — locked: intro and flagship at equal 2×2 weight */}
        {/* Top-aligned, not centered: the copy fills ~300px of a 484px tile, and
            centering split the slack above and below. Slack under a text block
            reads as breathing room; slack above the first line reads as a
            mistake. pt is a step tighter than the sides so the first line sits
            near the media panel edge of the tile beside it. */}
        {/* Same load-in as the card beside it: WorkCard's own BlurFade with the
            identical props, and delay 0 to match the index={0} tile so the two
            2×2s arrive together rather than the copy simply being there while
            its neighbour animates. */}
        <div className="sm:col-span-2 sm:row-span-2">
          <BlurFade inView inViewMargin="-60px" className="sm:h-full">
            {/* The place line ("Born and raised in DC…") used to close this tile
                as a signature under the prose. It's back in the footer as of
                2026-08-06: stacked into one column on mobile the tile has no
                visible bottom edge to anchor it, so a muted line directly under
                the last paragraph read as a sixth sentence of the intro — a
                non-sequitur about Maryland at the end of a paragraph about
                iterating. The footer gives it a rule above it and nothing to be
                mistaken for. The footer's socials came off in the same move; the
                nav panel already carries them. */}
            <Tile className="flex flex-col justify-start gap-3 p-6 pt-5 sm:h-full sm:p-8 sm:pt-6">
              {/* Color and the type scale both come from the component now —
                  the sizes are Figma-specified, so they live next to the copy. */}
              <IntroHeadline className="font-geist mb-2" />
              <IntroParagraphs className="font-geist" />
            </Tile>
          </BlurFade>
        </div>
        <div className="sm:col-span-2 sm:row-span-2">
          {/* Home shows only the three current case studies (Richard's call,
              2026-11-27): Wealth Planner beside the intro, SAREVI and Compliance
              on the next row. The older studies live on /projects. */}
          <WorkCard
            item={bySlug("wealth-planner")}
            index={0}
            fill
            caption={false}
          />
        </div>

        {/* Rows 3–4 — the two other current studies, side by side at 2×2 */}
        <div className="sm:col-span-2 sm:row-span-2">
          <WorkCard item={bySlug("sarevi")} index={1} fill caption={false} />
        </div>
        <div className="sm:col-span-2 sm:row-span-2">
          <WorkCard
            item={bySlug("third-party-compliance")}
            index={2}
            fill
            caption={false}
          />
        </div>

        {/* Rows 5–6 — writing beside the contact tile. `order-last` below `sm`
            only: stacked, a contact CTA in the middle would ask for the decision
            before the work that earns it. */}
        <div className="order-last sm:order-none sm:col-span-2 sm:row-span-2">
          <TalkTile />
        </div>
        <div className="sm:col-span-2 sm:row-span-1">
          <WorkCard
            item={bySlug("modern-ui-2026")}
            index={3}
            fill
            caption={false}
          />
        </div>
        <div className="sm:col-span-2 sm:row-span-1">
          <WorkCard
            item={bySlug("color-methodology")}
            index={4}
            fill
            caption={false}
          />
        </div>
      </div>
    </main>
  );
}
