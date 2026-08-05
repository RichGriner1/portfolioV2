"use client";

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
 * - `DotToggle` is 9×9. At 32px that's ~3.5px per dot, which reads. It carries the
 *   open/close state, so it has to survive small.
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

/* ---------------------------------------------------------------- toggle (9×9) */

/** A tidy lattice — the "dot grid" the crab dissolves into before it becomes an X. */
const LATTICE = [
  "#.#.#.#.#",
  ".........",
  "#.#.#.#.#",
  ".........",
  "#.#.#.#.#",
  ".........",
  "#.#.#.#.#",
  ".........",
  "#.#.#.#.#",
];

const CROSS = [
  "#.......#",
  ".#.....#.",
  "..#...#..",
  "...#.#...",
  "....#....",
  "...#.#...",
  "..#...#..",
  ".#.....#.",
  "#.......#",
];

export function DotToggle({
  open,
  className,
}: {
  /** `false` shows the lattice, `true` shows the X. */
  open: boolean;
  className?: string;
}) {
  return (
    <DotField
      rows={9}
      states={{ lattice: LATTICE, cross: CROSS }}
      active={open ? "cross" : "lattice"}
      className={className}
    />
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
