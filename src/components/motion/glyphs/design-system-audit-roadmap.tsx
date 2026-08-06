"use client";

import { motion } from "motion/react";

import { useStaticResolve } from "./use-static-resolve";

// Token-mirroring constants, `hero.tsx` style.
const EASE_IN_OUT_SOFT = [0.45, 0.05, 0.15, 1] as const; // --ease-in-out-soft
const EASE_OUT_SOFT = [0.2, 0.8, 0.2, 1] as const; // --ease-out-soft
const DURATION_FAST = 0.12; // --duration-fast
const DURATION_SLOW = 0.32; // --duration-slow

const PATH_START = 8;
const PATH_END = 56;
const Y = 32;

// Three day-marker nodes at ~25% / ~58% / ~92% of the path; each brightens
// as the hover draw-front passes it, so its delay is that fraction of the
// full-path draw duration.
const NODES = [20, 36, 52].map((x) => ({
  x,
  delay: DURATION_SLOW * ((x - PATH_START) / (PATH_END - PATH_START)),
}));

/**
 * Design System Audit — 90-day roadmap card glyph.
 * A faint path with three day-marker nodes; on hover a line strokes in
 * left-to-right and each node brightens as the draw passes it. Deliberately
 * the slowest of the three card glyphs — sequencing over 90 days is a patient
 * idea. Hover is passed in as `active` — the svg drives its own variants (a
 * variant-label `initial` makes it a controlling variant node, so parent
 * whileHover propagation would never reach the children).
 */
export function AuditRoadmapGlyph({ active = false }: { active?: boolean }) {
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
      {/* Baseline path — always present, faint. */}
      <line
        x1={PATH_START}
        y1={Y}
        x2={PATH_END}
        y2={Y}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.25}
      />

      {/* Draw front — strokes in over the baseline on hover. */}
      <motion.line
        x1={PATH_START}
        y1={Y}
        x2={PATH_END}
        y2={Y}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        variants={{
          // Reverse fade is quicker than the draw-in, per brief.
          rest: {
            pathLength: 0,
            opacity: 0,
            transition: { duration: DURATION_FAST, ease: EASE_OUT_SOFT },
          },
          hover: {
            pathLength: 1,
            opacity: 0.9,
            transition: { duration: DURATION_SLOW, ease: EASE_IN_OUT_SOFT },
          },
        }}
      />

      {NODES.map((node) => (
        <motion.circle
          key={node.x}
          cx={node.x}
          cy={Y}
          r={3.5}
          fill="currentColor"
          variants={{
            rest: {
              opacity: 0.35,
              transition: { duration: DURATION_FAST, ease: EASE_OUT_SOFT },
            },
            hover: {
              opacity: 1,
              transition: {
                duration: DURATION_FAST,
                delay: node.delay,
                ease: EASE_OUT_SOFT,
              },
            },
          }}
        />
      ))}
    </motion.svg>
  );
}
