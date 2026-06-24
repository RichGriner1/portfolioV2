"use client";

import { motion } from "motion/react";

const EASE = [0.2, 0.8, 0.2, 1] as const;

const LOOP = 6;
const TIMES = [0, 0.28, 0.34, 0.62, 0.68, 0.94, 1] as const;

const A_OPACITY = [0.7, 0.7, 0, 0, 0, 0, 0.7];
const B_OPACITY = [0, 0, 0.75, 0.75, 0, 0, 0];
const C_OPACITY = [0, 0, 0, 0, 0.9, 0.9, 0];

const SLOT_TRANSITION = {
  duration: LOOP,
  repeat: Infinity,
  times: [...TIMES],
  ease: "easeInOut" as const,
};

const TABLE_ROWS = [
  { y: 30, w: 58 },
  { y: 36, w: 48 },
  { y: 42, w: 54 },
  { y: 48, w: 42 },
];

const BARS = [
  { x: 13, h: 14 },
  { x: 22, h: 22 },
  { x: 31, h: 10 },
  { x: 40, h: 24 },
  { x: 49, h: 16 },
  { x: 58, h: 20 },
  { x: 67, h: 8 },
];

const LINE_POINTS = "11,48 21,40 31,42 41,32 51,34 61,26 69,28";

export function LayoutGrammarGlyph(_props?: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 64"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      {/* Chrome — draws in once, stays put. This is the rule. */}

      <motion.rect
        x={6}
        y={8}
        width={68}
        height={48}
        rx={4}
        stroke="currentColor"
        strokeWidth={1.5}
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 0.55, pathLength: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      />

      <motion.line
        x1={11}
        y1={15}
        x2={44}
        y2={15}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 0.95, pathLength: 1 }}
        transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
      />

      <motion.circle
        cx={67}
        cy={15}
        r={2}
        fill="currentColor"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
      />

      <motion.line
        x1={6}
        y1={22}
        x2={74}
        y2={22}
        stroke="currentColor"
        strokeWidth={1}
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 0.3, pathLength: 1 }}
        transition={{ duration: 0.55, delay: 0.4, ease: EASE }}
      />

      {/* Slot — cycles forever. Same chrome, different content. */}

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: A_OPACITY }}
        transition={SLOT_TRANSITION}
      >
        {TABLE_ROWS.map((r, i) => (
          <line
            key={`row-${i}`}
            x1={11}
            y1={r.y}
            x2={11 + r.w}
            y2={r.y}
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        ))}
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: B_OPACITY }}
        transition={SLOT_TRANSITION}
      >
        {BARS.map((b, i) => (
          <rect
            key={`bar-${i}`}
            x={b.x}
            y={50 - b.h}
            width={5}
            height={b.h}
            rx={1}
            fill="currentColor"
          />
        ))}
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: C_OPACITY }}
        transition={SLOT_TRANSITION}
      >
        <polyline
          points={LINE_POINTS}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={11} cy={48} r={1.4} fill="currentColor" />
        <circle cx={41} cy={32} r={1.4} fill="currentColor" />
        <circle cx={69} cy={28} r={1.4} fill="currentColor" />
      </motion.g>
    </svg>
  );
}
