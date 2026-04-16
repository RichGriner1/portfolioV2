"use client";

import { motion } from "motion/react";

/**
 * Afi Wealth Manager — MIGRATION.
 * Three component-dots stream from source grid (Material) to target grid
 * (PrimeNG) on hover. The target grid wakes from ghosted to full.
 */
export function MigrationGlyph() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      {/* Source dots — travel across on hover */}
      {[0, 1, 2].map((row) => (
        <motion.circle
          key={`src-${row}`}
          cy={14 + row * 10}
          r={2}
          fill="currentColor"
          variants={{
            rest: { cx: 10, opacity: 1 },
            hover: { cx: 38, opacity: 0.85 },
          }}
          transition={{
            duration: 0.55,
            delay: row * 0.08,
            ease: [0.45, 0.05, 0.15, 1],
          }}
        />
      ))}

      {/* Target grid — wakes on hover */}
      {[0, 1, 2].map((row) => (
        <motion.circle
          key={`dst-${row}`}
          cx={38}
          cy={14 + row * 10}
          r={2}
          fill="currentColor"
          variants={{
            rest: { opacity: 0.15 },
            hover: { opacity: 1 },
          }}
          transition={{
            duration: 0.3,
            delay: 0.3 + row * 0.05,
          }}
        />
      ))}
    </svg>
  );
}
