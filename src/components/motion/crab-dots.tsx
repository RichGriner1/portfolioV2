"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { EASE_SOFT } from "@/components/motion/constants";

/**
 * The dot-grid pieces of the mark: a coarse lattice-to-X toggle, and the detailed
 * dotted crab.
 *
 * Both exist because of one measured constraint: a dot needs ~3px to read as a dot,
 * so a grid of N columns needs roughly 3N pixels. Anything drawn on the 29-column
 * crab grid therefore wants ~88px. At the header's 32px it is mush — 14×11 through
 * 26×21 were all tried and all came out as a dotted mound.
 *
 * So the two are split by the space they get:
 *
 * - `DotToggle` is 3×3, matching the reference. It carries the open/close state, so
 *   it has to survive the bar's ~20px.
 * - `CrabDots` is the detailed 29×28 crab and is only used where there's room for
 *   it (the menu panel, at 120px — 4.1px a dot, comfortably over the floor).
 */

/**
 * How much Maryland reaches the dots: over half a flag colour mixed into the mark's
 * own ink, so one claw reads red and the opposite legs read gold.
 *
 * Tuned by measuring, because the mix is against WHITE ink and white dominates the
 * result — the hue swing is much smaller than the number suggests. At 0.22 the dots
 * came out a uniform warm tan (oklab a 0.038 → 0.004, b 0.020 → 0.036 end to end)
 * and the ramp wasn't perceptible at 120px at all; 0.32 made the two ends merely
 * distinguishable. This is the third setting, and the first one that reads as a
 * gradient rather than as a warm cast.
 */
const TINT = 0.58;

/**
 * Per-dot ink for the tinted mark: `currentColor` with a red→gold ramp mixed in.
 *
 * The ramp runs on the diagonal (`col + row`), not straight across. Horizontally
 * the crab is symmetrical — pincer, shell, pincer — so a left-to-right ramp put
 * matching colours on both claws and read as two-tone rather than as a gradient.
 * The diagonal crosses the silhouette instead of mirroring it.
 *
 * `currentColor` is the outer operand on purpose: the mark's ink stays whatever the
 * caller set (a semantic token), and these primitives only bend its hue. The caller
 * must pass ink at full alpha and carry any transparency on the box — mixing an
 * opaque colour into a translucent one raises the result's alpha and would brighten
 * the mark. See the note at the call site in site-header.tsx.
 */
function tintFor(col: number, row: number, cols: number, rows: number) {
  const ramp = (col / (cols - 1) + row / (rows - 1)) / 2;
  const flag = `color-mix(in oklab, var(--md-red), var(--md-gold) ${(ramp * 100).toFixed(1)}%)`;
  return `color-mix(in oklab, currentColor ${100 - TINT * 100}%, ${flag})`;
}

/** Shared dot renderer. Cells are percentages so a mark scales by its box alone. */
function DotField({
  rows,
  states,
  active,
  className,
  stagger = 0.18,
  tint = false,
}: {
  rows: number;
  /** One entry per named state: a grid of strings, `#` lit. */
  states: Record<string, string[]>;
  active: string;
  className?: string;
  stagger?: number;
  /** Mix the Maryland ramp into each dot instead of using flat `currentColor`. */
  tint?: boolean;
}) {
  const keys = Object.keys(states);
  const cols = states[keys[0]][0].length;
  const maxD = Math.hypot(cols / 2, rows / 2);

  /**
   * With one state there is nothing to animate, so the dots render as plain spans.
   *
   * `initial={false}` tells Motion to SET the opening value rather than animate to
   * it, and a single-state field never changes `active` afterwards — so every
   * `motion.span` below would exist only to write `opacity: 1` once and then sit
   * there. That is not free: the redrawn crab is 379 dots, and mounting that many
   * motion components cost a 92ms frame as the panel opened, which is a visible
   * hitch on exactly the interaction the mark appears in. Plain spans render it
   * identically — what actually fades the crab in is the `BlurFade` around it.
   *
   * The cross-fade machinery below still earns its place for a multi-state field.
   */
  const animated = keys.length > 1;

  // One element per cell that ANY state lights, so a dot is stable across a swap
  // and animates rather than unmounting. Cells no state uses are never rendered.
  const cells: { col: number; row: number; on: Record<string, boolean> }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const on: Record<string, boolean> = {};
      let any = false;
      for (const k of keys) {
        on[k] = states[k][row][col] === "#";
        if (on[k]) any = true;
      }
      if (any) cells.push({ col, row, on });
    }
  }

  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "relative", aspectRatio: `${cols} / ${rows}` }}
    >
      {cells.map((cell) => {
        // A dot every state shares never blinks; the rest fade with a radial
        // stagger, so a swap reads as the grid rearranging outward rather than one
        // picture cross-dissolving into another.
        const shared = keys.every((k) => cell.on[k]);
        const d =
          Math.hypot(cell.col - (cols - 1) / 2, cell.row - (rows - 1) / 2) /
          maxD;
        // `bg-current` only when untinted — a tinted dot sets its own
        // background-color, and leaving the utility on would be a dead declaration
        // the inline style overrides anyway.
        const dotClass = tint ? undefined : "bg-current";
        const style = {
          position: "absolute",
          left: `${(cell.col / cols) * 100}%`,
          top: `${(cell.row / rows) * 100}%`,
          width: `${(1 / cols) * 100}%`,
          height: `${(1 / rows) * 100}%`,
          ...(tint && {
            backgroundColor: tintFor(cell.col, cell.row, cols, rows),
          }),
          // Inset within the cell, so the gap between dots comes from the grid
          // and keeps scaling with the mark instead of a fixed pixel value.
          transform: "scale(0.68)",
          borderRadius: "9999px",
        } as const;
        const key = `${cell.col}-${cell.row}`;

        if (!animated)
          return <span key={key} className={dotClass} style={style} />;

        return (
          <motion.span
            key={key}
            className={dotClass}
            style={style}
            initial={false}
            animate={{ opacity: cell.on[active] ? 1 : 0 }}
            transition={{
              duration: 0.22,
              delay: shared ? 0 : d * stagger,
              ease: EASE_SOFT,
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- toggle (3×3) */

/**
 * 3×3, matching the reference exactly. Nine dots at rest; opening drops the four
 * edge-centre dots and leaves the corners plus the middle, which is an X at this
 * size. Deliberately this coarse — a 9×9 grid was tried and at the bar's ~20px it
 * was a smudge, because a dot needs ~3px and 9 columns would want ~27px of dot
 * alone. Three columns into 20px is a ~6px cell, which reads.
 */
const GRID_3 = ["###", "###", "###"];
const CROSS_3 = ["#.#", ".#.", "#.#"];

/** Dim floor for a dot the pointer is far from. */
const FAR_OPACITY = 0.3;
/** How far the spotlight reaches, in multiples of the mark's own width. */
const REACH = 0.9;

export function DotToggle({
  open,
  className,
}: {
  /** `false` shows the full grid, `true` shows the X. */
  open: boolean;
  className?: string;
}) {
  const art = open ? CROSS_3 : GRID_3;
  const rows = art.length;
  const cols = art[0].length;

  /**
   * Proximity spotlight, copied from the reference's behaviour: dots near the
   * pointer hold full opacity and distant ones fall back to `FAR_OPACITY`, so the
   * grid appears to light up under the cursor and settles when it leaves.
   *
   * Tracked here rather than on the parent button because the distances that matter
   * are to the dots, and this element is the dots' own box. Events still bubble, so
   * the button keeps its click.
   */
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Pointer-driven, so a touch tap doesn't leave the grid stuck half-lit.
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    });
  };

  return (
    <div
      aria-hidden
      className={className}
      onPointerMove={onMove}
      onPointerLeave={() => setPointer(null)}
      style={{ position: "relative", aspectRatio: `${cols} / ${rows}` }}
    >
      {Array.from({ length: rows * cols }, (_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const on = art[row][col] === "#";

        // Dot centre in the same normalised space as the pointer.
        const cx = (col + 0.5) / cols;
        const cy = (row + 0.5) / rows;
        const near = pointer
          ? Math.max(0, 1 - Math.hypot(pointer.x - cx, pointer.y - cy) / REACH)
          : 1;
        const lit = FAR_OPACITY + (1 - FAR_OPACITY) * near;

        return (
          <motion.span
            key={i}
            className="bg-current"
            style={{
              position: "absolute",
              left: `${(col / cols) * 100}%`,
              top: `${(row / rows) * 100}%`,
              width: `${(1 / cols) * 100}%`,
              height: `${(1 / rows) * 100}%`,
              transform: "scale(0.42)",
              borderRadius: "9999px",
            }}
            initial={false}
            animate={{ opacity: on ? lit : 0 }}
            transition={{ duration: 0.2, ease: EASE_SOFT }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- crab (29×19) */

/**
 * Hand-authored for the grid, NOT rasterised from `crab-mark.tsx`. That path is a
 * single merged silhouette with no negative space, so sampling it fills solid — the
 * claws fuse into the shell and it reads as a beetle at every resolution.
 *
 * Redrawn 2026-08-06 against a reference Richard supplied, because the previous
 * 29×19 version read as a spider. What actually makes it read as a crab, in order
 * of how much each mattered:
 *
 * - The carapace has to be the dominant mass — a wide oval about 17 of 29 columns.
 *   The old art kept the shell narrow and let the legs carry the silhouette, which
 *   is a spider's proportions, not a crab's.
 * - The claws sit ABOVE the shell on visible diagonal arms, and each has a slit cut
 *   from its top so it reads as an open pincer rather than a mitten.
 * - Three legs a side, none horizontal, each hooking further down than the last.
 *   Every leg is 2 dots thick and they are spaced ~36° apart around the shell: at 3
 *   dots or ~22° apart the strokes weld to the carapace and the whole thing becomes
 *   one blob with bumps. The white gaps between the legs are the shape.
 *
 * Edit these strings; don't reintroduce a tracing script.
 */
const CRAB = [
  ".....#..#...........#..#.....",
  "....##..##.........##..##....",
  "...###..###.......###..###...",
  "...####.###.......###.####...",
  "...########.......########...",
  "...########.......########...",
  "...########.......########...",
  "....######.........######....",
  ".......####.......####.......",
  "........###.......###........",
  ".........###.....###.........",
  "..........#########..........",
  ".........###########.........",
  "........#############........",
  "...#######################...",
  "..#########################..",
  "####..#################..####",
  "###...#################...###",
  "......#################......",
  "......#################......",
  "....#####################....",
  "...####.#############.####...",
  "...##....###########....##...",
  "..###....###########....###..",
  "..##....###.......###....##..",
  "...#....##.........##....#...",
  "........##.........##........",
  "........##.........##........",
];

/** Needs ~88px to read. Don't use it small. */
export function CrabDots({
  className,
  tint = false,
}: {
  className?: string;
  /** Mix in the Maryland red→gold ramp. Requires full-alpha ink — see `tintFor`. */
  tint?: boolean;
}) {
  return (
    <DotField
      rows={CRAB.length}
      states={{ crab: CRAB }}
      active="crab"
      className={className}
      stagger={0.5}
      tint={tint}
    />
  );
}
