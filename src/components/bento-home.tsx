"use client";

import { BlurFade } from "@/components/motion/blur-fade";
import { IntroParagraphs } from "@/components/home-intro";
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
              <IntroParagraphs className="font-geist" />
            </Tile>
          </BlurFade>
        </div>
        <div className="sm:col-span-2 sm:row-span-2">
          <WorkCard
            item={bySlug("visual-identity")}
            index={0}
            fill
            caption={false}
          />
        </div>

        {/* Row 3 — Afi DS takes the wide, the two brand/process squares follow */}
        {/* Stays one row. It briefly got `row-span-2` alongside the loop tile, but
            the bank list was never what clipped — measurement only ever showed the
            loop scene overflowing (47px at 375px). Two rows just gave the list a
            cell far taller than four rows of content need, and the figure centers
            itself in it, so the extra height showed up as white space above the
            list. Only the tile that actually overflows gets the taller cell. */}
        {/* Modern UI in 2026 took this slot from the Afi Design System case study
            on 2026-08-06. The DS case study is the deeper piece, but it was the
            third Afi tile on a home that already leads with Afi Visual Identity,
            and it's one click away from /projects. The research post earns the
            slot by being the only thing here that shows the thinking BEFORE the
            design — everything else on the page is an outcome. */}
        <div className="sm:col-span-2 sm:row-span-1">
          <WorkCard
            item={bySlug("modern-ui-2026")}
            index={1}
            fill
            caption={false}
          />
        </div>
        <div className="sm:col-span-1 sm:row-span-1">
          <WorkCard item={bySlug("mindfulme")} index={2} fill caption={false} />
        </div>
        <div className="sm:col-span-1 sm:row-span-1">
          <WorkCard
            item={bySlug("design-md-primeng-wealth-manager")}
            index={3}
            fill
            caption={false}
          />
        </div>

        {/* Rows 4–5 — the three tiles whose media is a small layout rather than
            a single mark, each sized to what its content actually needs. The
            token video is 1080² and unreadable below ~400px, so it takes the
            2×2; the loop figure is authored on a 300×190 canvas and the KT360
            terminal is landscape, so both take wides on the right. A 1×1 gives
            the loop figure a 170px scene for 366px of fixed-width nodes — that
            was the smoosh. The second 2×2 also answers the two at the top. */}
        {/* Let's talk takes the 2×2 the token video used to hold. Two reasons:
            the tile wanted height more than the 976×238 strip gave it, and
            keeping "Building color in four layers" off the home leaves /writing
            something of its own. The home now carries only current, highest-value
            work; everything else is a click away from the footer index. */}
        {/* `order-last` below `sm` only. Stacked into one column, the bento reads
            top to bottom as a single sequence, and a contact CTA sitting in the
            middle of it asks for the decision before the work that earns it —
            there were still two tiles below it. On `sm` and up the grid is 4-col
            and this tile shares a row with the two wides beside it, so the reading
            order is no longer purely vertical and the authored position stands. */}
        <div className="order-last sm:order-none sm:col-span-2 sm:row-span-2">
          <TalkTile />
        </div>
        {/* The Afi Design System case study lands here rather than coming off the
            home altogether — it moved out of the row-3 slot when Modern UI took it,
            and took KT360's place on 2026-08-06. KT360 is the weaker of the two for
            this page: the DS work is the current, ongoing thing and the one the
            other Afi tiles build toward. KT360 stays on /projects.

            It sits ABOVE the loops tile: the case study is the stronger of the two,
            and stacked on mobile this block reads top to bottom, so the weaker tile
            takes the last position rather than the case study getting buried. */}
        <div className="sm:col-span-2 sm:row-span-1">
          <WorkCard
            item={bySlug("afi-design-system")}
            index={4}
            fill
            caption={false}
          />
        </div>
        {/* The color methodology took this slot from the loops post on 2026-08-06.
            It's the stronger of the two here: it's Part 1 of the design-system series,
            it's the only interactive piece on the home, and it argues the thing the
            portfolio is positioned on. The loops post is about AI workflow — good, but
            narrower, and it stays on /writing. */}
        <div className="sm:col-span-2 sm:row-span-1">
          <WorkCard
            item={bySlug("color-methodology")}
            index={5}
            fill
            caption={false}
          />
        </div>
      </div>
    </main>
  );
}
