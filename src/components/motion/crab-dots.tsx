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
 * - `CrabDots` is the detailed 29×19 crab and is only used where there's room for
 *   it (the menu panel, at ~88px).
 */

/** Shared dot renderer. Cells are percentages so a mark scales by its box alone. */
function DotField({
  rows,
  states,
  active,
  className,
  stagger = 0.18,
}: {
  rows: number;
  /** One entry per named state: a grid of strings, `#` lit. */
  states: Record<string, string[]>;
  active: string;
  className?: string;
  stagger?: number;
}) {
  const keys = Object.keys(states);
  const cols = states[keys[0]][0].length;
  const maxD = Math.hypot(cols / 2, rows / 2);

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
        return (
          <motion.span
            key={`${cell.col}-${cell.row}`}
            className="bg-current"
            style={{
              position: "absolute",
              left: `${(cell.col / cols) * 100}%`,
              top: `${(cell.row / rows) * 100}%`,
              width: `${(1 / cols) * 100}%`,
              height: `${(1 / rows) * 100}%`,
              // Inset within the cell, so the gap between dots comes from the grid
              // and keeps scaling with the mark instead of a fixed pixel value.
              transform: "scale(0.68)",
              borderRadius: "9999px",
            }}
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
 * Three passes to get here. The rules that made it read: the pincers sit OUTSIDE
 * the shell's width with visible diagonal arms, the shell stays narrow (9 of 29
 * columns), and the legs reach past it. Edit these strings; don't reintroduce a
 * tracing script.
 */
const CRAB = [
  "..####.................####..",
  ".###.##...............##.###.",
  ".######...............######.",
  "..#####...............#####..",
  ".....####...........####.....",
  "........###.......###........",
  "..........#########..........",
  ".........###########.........",
  ".........##.#####.##.........",
  ".....##..###########..##.....",
  "..##.....###########.....##..",
  ".....##..###########..##.....",
  ".##.......#########.......##.",
  ".....##...#########...##.....",
  "..##.......#######.......##..",
  "......##....#####....##......",
  "....##.......###.......##....",
  "......##....##.##....##......",
  ".......##...#...#...##.......",
];

/** Needs ~88px to read. Don't use it small. */
export function CrabDots({ className }: { className?: string }) {
  return (
    <DotField
      rows={CRAB.length}
      states={{ crab: CRAB }}
      active="crab"
      className={className}
      stagger={0.5}
    />
  );
}
