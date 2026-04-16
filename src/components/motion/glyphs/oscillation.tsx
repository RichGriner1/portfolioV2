"use client";

import { motion } from "motion/react";

/**
 * Beetested — OSCILLATION.
 * A hexagonal perimeter (honeycomb nod to "bee") with a dot at rest in the
 * center. On hover the dot oscillates side-to-side, loose and repeating —
 * bee-flight, iterative testing passes.
 */
export function OscillationGlyph() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      {/* Hexagon perimeter */}
      <motion.path
        d="M 24 8 L 38 16 L 38 32 L 24 40 L 10 32 L 10 16 Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        fill="none"
        variants={{
          rest: { opacity: 0.6 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.25 }}
      />

      {/* Oscillating dot */}
      <motion.circle
        cy={24}
        r={3}
        fill="currentColor"
        variants={{
          rest: { cx: 24, scale: 1 },
          hover: {
            cx: [24, 32, 24, 16, 24],
            scale: [1, 1, 1.15, 1, 1],
            transition: {
              duration: 1.4,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.15, 1],
            },
          },
        }}
      />
    </svg>
  );
}
