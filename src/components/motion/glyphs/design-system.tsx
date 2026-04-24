"use client";

import { motion } from "motion/react";

const TOP = { cx: 40, cy: 10 };
const MIDS = [
  { cx: 22, cy: 30 },
  { cx: 58, cy: 30 },
];
const BOTTOMS = [
  { cx: 12, cy: 50 },
  { cx: 32, cy: 50 },
  { cx: 48, cy: 50 },
  { cx: 68, cy: 50 },
];

const TOP_LINES = [
  { x1: 40, y1: 10, x2: 22, y2: 30 },
  { x1: 40, y1: 10, x2: 58, y2: 30 },
];
const BOTTOM_LINES = [
  { x1: 22, y1: 30, x2: 12, y2: 50 },
  { x1: 22, y1: 30, x2: 32, y2: 50 },
  { x1: 58, y1: 30, x2: 48, y2: 50 },
  { x1: 58, y1: 30, x2: 68, y2: 50 },
];

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function DesignSystemGlyph() {
  return (
    <svg
      viewBox="0 0 80 60"
      fill="none"
      className="text-foreground h-28 w-28"
      aria-hidden
    >
      {TOP_LINES.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="currentColor"
          strokeWidth={1.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          variants={{
            rest: { opacity: 0.5, transition: { duration: 0.2 } },
            hover: { opacity: 1, transition: { duration: 0.25, delay: 0.1 } },
          }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
        />
      ))}

      {BOTTOM_LINES.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="currentColor"
          strokeWidth={1.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          variants={{
            rest: { opacity: 0.5, transition: { duration: 0.2 } },
            hover: { opacity: 1, transition: { duration: 0.25, delay: 0.3 } },
          }}
          transition={{ duration: 0.45, delay: 0.12 + i * 0.06, ease: EASE }}
        />
      ))}

      <motion.circle
        cx={TOP.cx}
        cy={TOP.cy}
        r={4}
        fill="currentColor"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        variants={{
          rest: { opacity: 0.9, scale: 1, transition: { duration: 0.2 } },
          hover: { opacity: 1, scale: 1.2, transition: { duration: 0.3, delay: 0 } },
        }}
        transition={{ duration: 0.3, delay: 0.38 }}
      />

      {MIDS.map((m, i) => (
        <motion.circle
          key={i}
          cx={m.cx}
          cy={m.cy}
          r={4}
          fill="currentColor"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.65, scale: 1 }}
          variants={{
            rest: { opacity: 0.65, scale: 1, transition: { duration: 0.2 } },
            hover: { opacity: 1, scale: 1.1, transition: { duration: 0.3, delay: 0.2 } },
          }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
        />
      ))}

      {BOTTOMS.map((b, i) => (
        <motion.circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={3}
          fill="currentColor"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          variants={{
            rest: { opacity: 0.4, scale: 1, transition: { duration: 0.2 } },
            hover: {
              opacity: 1,
              scale: 1.2,
              transition: { duration: 0.3, delay: 0.4 + i * 0.04 },
            },
          }}
          transition={{ duration: 0.3, delay: 0.65 + i * 0.05 }}
        />
      ))}
    </svg>
  );
}
