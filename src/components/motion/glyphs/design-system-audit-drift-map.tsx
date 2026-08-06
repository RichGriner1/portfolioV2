"use client";

import { motion } from "motion/react";

import { useStaticResolve } from "./use-static-resolve";

// Token-mirroring constants, `hero.tsx` style.
const EASE_OUT_SOFT = [0.2, 0.8, 0.2, 1] as const; // --ease-out-soft
const DURATION_FAST = 0.12; // --duration-fast

const STAGGER = 0.07; // ~70ms between ticks, per brief

// 3×2 grid of screen frames. `order` (on flagged cells) is the position in
// the tick-draw stagger sequence.
const CELLS: Array<{ x: number; y: number; order?: number }> = [
  { x: 8, y: 16 },
  { x: 25, y: 16, order: 0 },
  { x: 42, y: 16 },
  { x: 8, y: 34, order: 1 },
  { x: 25, y: 34 },
  { x: 42, y: 34, order: 2 },
];
const FLAGGED_COUNT = 3;
const CELL = 14;

/**
 * Design System Audit — UI drift map card glyph.
 * A grid of screen frames; on hover, slash-ticks stroke-draw onto the flagged
 * cells in sequence (the audit's act of finding and marking inconsistencies),
 * and the flagged cells wake to full opacity. Ticks fade back out in reverse
 * order, quicker, on unhover. Hover is passed in as `active` — the svg drives
 * its own variants (a variant-label `initial` makes it a controlling variant
 * node, so parent whileHover propagation would never reach the children).
 */
export function AuditDriftMapGlyph({ active = false }: { active?: boolean }) {
  const staticResolve = useStaticResolve();
  const resolved = staticResolve || active;

  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden="true"
      initial={staticResolve ? "hover" : "rest"}
      animate={resolved ? "hover" : "rest"}
    >
      {CELLS.map((cell) => {
        const flagged = cell.order !== undefined;
        const order = cell.order ?? 0;
        return (
          <g key={`${cell.x}-${cell.y}`}>
            <motion.rect
              x={cell.x}
              y={cell.y}
              width={CELL}
              height={CELL}
              rx={2}
              stroke="currentColor"
              strokeWidth={1.25}
              variants={
                flagged
                  ? {
                      rest: {
                        opacity: 0.35,
                        transition: {
                          duration: DURATION_FAST,
                          ease: EASE_OUT_SOFT,
                        },
                      },
                      hover: {
                        opacity: 0.9,
                        transition: {
                          duration: DURATION_FAST,
                          delay: order * STAGGER,
                          ease: EASE_OUT_SOFT,
                        },
                      },
                    }
                  : { rest: { opacity: 0.35 }, hover: { opacity: 0.35 } }
              }
            />
            {flagged && (
              <motion.line
                x1={cell.x + 3}
                y1={cell.y + CELL - 3}
                x2={cell.x + CELL - 3}
                y2={cell.y + 3}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                variants={{
                  // Exit runs in reverse order and quicker, per brief.
                  rest: {
                    pathLength: 0,
                    opacity: 0,
                    transition: {
                      duration: DURATION_FAST * 0.75,
                      delay: (FLAGGED_COUNT - 1 - order) * STAGGER * 0.5,
                      ease: EASE_OUT_SOFT,
                    },
                  },
                  hover: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      duration: DURATION_FAST,
                      delay: order * STAGGER,
                      ease: EASE_OUT_SOFT,
                    },
                  },
                }}
              />
            )}
          </g>
        );
      })}
    </motion.svg>
  );
}
