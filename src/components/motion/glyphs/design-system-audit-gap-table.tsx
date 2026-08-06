"use client";

import { motion } from "motion/react";

import { useStaticResolve } from "./use-static-resolve";

// Token-mirroring constants, `hero.tsx` style.
const EASE_OUT_SOFT = [0.2, 0.8, 0.2, 1] as const; // --ease-out-soft
const DURATION_BASE = 0.2; // --duration-base

const STAGGER = 0.07; // ~70ms between rows, per brief

const X1 = 10;
const EDGE = 54; // the shared right edge every row converges on

// A miniature table row set. The first row is already complete (the reference
// the others are measured against). `fake` is the row the card copy calls
// "hard-coded values wearing a component's name": it extends to the shared
// edge like the real fixes do, but keeps its dash pattern and reduced opacity
// — it *looks* aligned, isn't really.
// `order` is the row's position in the extend stagger; rows without one are
// static (already at the edge).
const ROWS: Array<{
  y: number;
  restX2: number;
  restOpacity: number;
  fake: boolean;
  order?: number;
}> = [
  { y: 14, restX2: EDGE, restOpacity: 0.85, fake: false },
  { y: 26, restX2: 32, restOpacity: 0.5, fake: false, order: 0 },
  { y: 38, restX2: 40, restOpacity: 0.5, fake: true, order: 1 },
  { y: 50, restX2: 24, restOpacity: 0.5, fake: false, order: 2 },
];

/**
 * Design System Audit — token & component gap analysis card glyph.
 * Rows at mixed lengths stagger-extend to a shared right edge on hover — the
 * hero's convergence at table scale. Real gaps solidify as they land; the
 * fake-systemized row extends but stays dashed and dim. Hover is passed in as
 * `active` — the svg drives its own variants (a variant-label `initial` makes
 * it a controlling variant node, so parent whileHover propagation would never
 * reach the children).
 */
export function AuditGapTableGlyph({ active = false }: { active?: boolean }) {
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
      {ROWS.map((row) => {
        if (row.order === undefined) {
          return (
            <line
              key={row.y}
              x1={X1}
              y1={row.y}
              x2={row.restX2}
              y2={row.y}
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              opacity={row.restOpacity}
            />
          );
        }
        const delay = row.order * STAGGER;
        return (
          <motion.line
            key={row.y}
            x1={X1}
            y1={row.y}
            y2={row.y}
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={row.fake ? "3 3" : undefined}
            variants={{
              rest: {
                x2: row.restX2,
                opacity: row.restOpacity,
                transition: {
                  duration: DURATION_BASE,
                  delay,
                  ease: EASE_OUT_SOFT,
                },
              },
              hover: {
                x2: EDGE,
                opacity: row.fake ? 0.5 : 1,
                transition: {
                  duration: DURATION_BASE,
                  delay,
                  ease: EASE_OUT_SOFT,
                },
              },
            }}
          />
        );
      })}
    </motion.svg>
  );
}
