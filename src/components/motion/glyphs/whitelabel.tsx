"use client";

import { motion } from "motion/react";

/**
 * Afi Simulators — WHITE-LABELING.
 * Outer frame stays constant; internal bars shift positions on hover —
 * same structure, different arrangement for each client.
 */
export function WhitelabelGlyph() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      {/* Frame — the DS shell */}
      <rect
        x={8}
        y={8}
        width={32}
        height={32}
        rx={4}
        stroke="currentColor"
        strokeWidth={1.5}
        fill="none"
        opacity={0.7}
      />

      {/* Internal bars — reskin on hover */}
      <motion.rect
        y={14}
        width={8}
        height={4}
        rx={1}
        fill="currentColor"
        variants={{
          rest: { x: 14, opacity: 0.55 },
          hover: { x: 26, opacity: 1 },
        }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <motion.rect
        y={22}
        width={8}
        height={4}
        rx={1}
        fill="currentColor"
        variants={{
          rest: { x: 26, opacity: 0.55 },
          hover: { x: 14, opacity: 1 },
        }}
        transition={{
          duration: 0.4,
          delay: 0.06,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />
      <motion.rect
        y={30}
        width={8}
        height={4}
        rx={1}
        fill="currentColor"
        variants={{
          rest: { x: 14, opacity: 0.55 },
          hover: { x: 26, opacity: 1 },
        }}
        transition={{
          duration: 0.4,
          delay: 0.12,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />
    </svg>
  );
}
