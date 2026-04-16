"use client";

import { motion } from "motion/react";

/**
 * Audemic — SIBLINGS.
 * Two products under one umbrella. Arc connects them at the top; on hover,
 * the arc fills in fully and the siblings lean together.
 */
export function SiblingsGlyph() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      {/* Umbrella arc — the shared brand */}
      <motion.path
        d="M 12 26 Q 24 10 36 26"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        variants={{
          rest: { pathLength: 0.6, opacity: 0.5 },
          hover: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      />

      {/* Sibling 1 */}
      <motion.circle
        r={3.5}
        fill="currentColor"
        variants={{
          rest: { cx: 12, cy: 34, scale: 1 },
          hover: { cx: 14, cy: 32, scale: 1.1 },
        }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* Sibling 2 */}
      <motion.circle
        r={3.5}
        fill="currentColor"
        variants={{
          rest: { cx: 36, cy: 34, scale: 1 },
          hover: { cx: 34, cy: 32, scale: 1.1 },
        }}
        transition={{
          duration: 0.3,
          delay: 0.05,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      />
    </svg>
  );
}
