"use client";

import { motion, useReducedMotion } from "motion/react";

import { CardMedia } from "@/components/work-card";
import { WORK } from "@/lib/content/work";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The image choreography from Richard's reference clip: a set of tiles that moves
 * between a tight inline strip and a loose collage ringing the headline.
 *
 * Two directions, because they say different things:
 *
 *   "scatter"  — strip first, then the tiles fly outward and settle in a ring.
 *                Faithful to the reference. The ring is the resting state, so it
 *                sits behind the type at reduced opacity or the claim stops being
 *                readable, which is the one thing this hero cannot afford.
 *
 *   "converge" — ring first, tiles fly inward and collapse into a strip below the
 *                claim. The resting state is a clean line of work. This is the one
 *                that means something for the positioning: wide range narrowing to
 *                one specialty, which is the argument the whole page is making.
 *
 * Plays once either way. Nothing loops — a hero that keeps moving competes with
 * the sentence it exists to support.
 */

/**
 * The tiles are the real project cards, not decoration.
 *
 * Taken straight from WORK and rendered through the same `CardMedia` the bento and
 * the index grids use, which is exported for exactly this ("so other surfaces
 * resolve media the same way"). So a tile is whatever that item actually shows —
 * its language-and-theme-keyed video, its animated figure, or its glyph — and it
 * stays correct when the work list changes.
 *
 * Ordered as authored, hidden entries dropped, capped at the number of ring slots.
 */
const TILES = WORK.filter((w) => !w.hidden);

/**
 * Authored, not generated. Random placement re-rolls on every render and would
 * differ between server and client; a fixed table also lets the ring be composed
 * rather than merely scattered — the gaps left and right of centre are where the
 * headline sits.
 *
 * Offsets are px from the container's centre, at the authored scale. The wrapper
 * scales the whole arrangement down at narrow breakpoints instead of each tile
 * carrying breakpoint logic.
 */
const RING = [
  { x: -533, y: -140, r: -7, s: 1.0 },
  { x: -448, y: 101, r: 5, s: 0.88 },
  { x: -321, y: -268, r: 3, s: 0.94 },
  { x: -289, y: 255, r: -5, s: 1.06 },
  { x: -146, y: -333, r: 6, s: 0.9 },
  { x: -130, y: 320, r: -3, s: 0.98 },
  { x: 130, y: 325, r: 4, s: 1.04 },
  { x: 157, y: -325, r: -6, s: 0.92 },
  { x: 297, y: 260, r: 5, s: 0.96 },
  { x: 327, y: -263, r: -4, s: 1.08 },
  { x: 454, y: 107, r: 6, s: 0.9 },
  { x: 540, y: -135, r: -5, s: 1.0 },
];

const ITEMS = TILES.slice(0, RING.length);

/**
 * Ring slots for the items we actually have, sampled evenly across the table.
 *
 * WORK currently surfaces eight entries — seven of the fifteen are `hidden: true`
 * — and taking `RING.slice(0, 8)` grabbed the first eight rows, which are the
 * left-hand ones: six tiles left of centre against two on the right. Spreading the
 * selection keeps the ring balanced at whatever count the work list happens to be.
 */
const SLOTS = ITEMS.map(
  (_, i) =>
    RING[Math.round((i * (RING.length - 1)) / Math.max(ITEMS.length - 1, 1))]
);

/**
 * Tile edge, at the size the cards are everywhere else on the site.
 *
 * /projects and /writing run WorkGrid at `max-w-5xl` in three columns with gap-4,
 * which resolves to ~315px per card. Matching that is the point: a project card
 * should be the same object here as it is on the index, not a thumbnail of one.
 * Earlier passes shrank it to 55px and then 74px, and at those sizes the figure
 * inside is texture rather than work.
 *
 * The cards do NOT scale down in the strip — they stay card-size and overlap, so
 * the resting state reads as a row of real cards running past the frame edge.
 */
const TILE = 300;
const STRIP_SCALE = 1;
const STRIP_GAP = 168; // just over half a card, so they overlap without hiding each other

/**
 * The strip settles BELOW the centre, not on it.
 *
 * At y: 0 the strip lands in the middle of the card — which is also where the copy
 * is — and the first capture had it cutting straight through "crazy fast". The ring
 * can pass over the type while it's moving; the resting state cannot sit on it.
 * The variant reserves matching space under the actions.
 */
const STRIP_Y = 268;

const strip = (i: number) => ({
  x: (i - (ITEMS.length - 1) / 2) * STRIP_GAP,
  y: STRIP_Y,
  rotate: 0,
  scale: STRIP_SCALE,
});

const ring = (i: number) => ({
  x: SLOTS[i].x,
  y: SLOTS[i].y,
  rotate: SLOTS[i].r,
  scale: SLOTS[i].s,
});

export function HeroCollage({
  mode,
  className,
}: {
  mode: "scatter" | "converge";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { lang } = useLang();

  const from = mode === "scatter" ? strip : ring;
  const to = mode === "scatter" ? ring : strip;

  // The ring is the resting state for "scatter", so it has to sit back far enough
  // that dark type stays readable over it. The strip resting state doesn't overlap
  // the words, so it keeps full opacity.
  const restOpacity = mode === "scatter" ? 0.3 : 1;

  return (
    // `hidden sm:flex` — this is a desktop composition, same call bento-home.tsx
    // makes for its grid. Stacked into one column the headline runs to six lines,
    // the card's centre lands mid-sentence, and there is nowhere for a 528px strip
    // or an 800px ring to go that isn't on top of the words. Mobile gets the static
    // hero, which is the version that was already legible.
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex",
        className
      )}
    >
      {/* One scale wrapper for the whole arrangement. The px table above is authored
          against a ~1000px card; below that the composition shrinks as a unit rather
          than reflowing, which keeps the ring's relationship to the type intact. */}
      <div className="relative scale-[0.62] lg:scale-100">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.slug}
            // Same frame the real cards wear (work-card.tsx): bordered, rounded,
            // card surface, and the item's own bgColor when it has one. A tile
            // should read as that project's card, shrunk — not as a cropped image.
            className="border-border bg-card absolute overflow-hidden rounded-2xl border shadow-lg"
            style={{
              width: TILE,
              height: TILE,
              left: -TILE / 2,
              top: -TILE / 2,
              ...(item.bgColor ? { backgroundColor: item.bgColor } : null),
            }}
            initial={{ ...from(i), opacity: mode === "scatter" ? 1 : 0.9 }}
            animate={{ ...to(i), opacity: restOpacity }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    // Staggered so the set arrives as a sequence rather than a
                    // single block. Tiles nearest the centre of the strip move
                    // first, which reads as the line assembling outward.
                    delay: 0.15 + Math.abs(i - (ITEMS.length - 1) / 2) * 0.045,
                    duration: 0.9,
                    ease: [0.2, 0.8, 0.2, 1],
                  }
            }
          >
            <CardMedia item={item} lang={lang} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
