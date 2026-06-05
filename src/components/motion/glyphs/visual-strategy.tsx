"use client";

import { motion } from "motion/react";

const BLOCKS = [
  { x: 6, y: 6, w: 48, h: 10, rx: 2, opacity: 0.7, hoverX: 0, hoverY: -2 },
  { x: 6, y: 20, w: 20, h: 30, rx: 2, opacity: 0.5, hoverX: -2, hoverY: 0 },
  { x: 30, y: 20, w: 24, h: 14, rx: 2, opacity: 0.35, hoverX: 2, hoverY: 0 },
  { x: 30, y: 38, w: 24, h: 12, rx: 2, opacity: 0.25, hoverX: 2, hoverY: 0 },
];

const DELAYS = [0, 0.08, 0.14, 0.2];

export function VisualStrategyGlyph(_props?: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 56"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      {BLOCKS.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={b.rx}
          fill="currentColor"
          initial={{ opacity: 0, y: b.y + 6 }}
          animate={{ opacity: b.opacity, y: b.y }}
          variants={{
            rest: { opacity: b.opacity, x: b.x, y: b.y },
            hover: {
              opacity: b.opacity + 0.15,
              x: b.x + b.hoverX,
              y: b.y + b.hoverY,
            },
          }}
          transition={{
            duration: 0.4,
            delay: DELAYS[i],
            ease: [0.2, 0.8, 0.2, 1],
          }}
        />
      ))}
    </svg>
  );
}
