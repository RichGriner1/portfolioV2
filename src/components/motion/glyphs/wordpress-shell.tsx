"use client";

import { motion } from "motion/react";

export function WordpressShellGlyph(_props?: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      <motion.rect
        x={12}
        y={32}
        width={40}
        height={14}
        rx={2}
        fill="currentColor"
        variants={{
          rest: { opacity: 0.35 },
          hover: { opacity: 0.6 },
        }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      />

      <motion.line
        x1={12}
        y1={31}
        x2={52}
        y2={31}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        variants={{
          rest: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 0.7 },
        }}
        transition={{
          duration: 0.25,
          delay: 0.32,
          ease: "linear",
        }}
      />

      <motion.rect
        x={12}
        width={40}
        height={14}
        rx={2}
        fill="currentColor"
        variants={{
          rest: { y: 12, opacity: 0.6 },
          hover: { y: 18, opacity: 1 },
        }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </svg>
  );
}
