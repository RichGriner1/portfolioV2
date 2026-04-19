"use client";

import { motion } from "motion/react";

const ROWS = [12, 24, 36];

export function BrandRulesGlyph() {
  return (
    <svg
      viewBox="0 0 56 48"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      {ROWS.map((y, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.12 }}
        >
          <motion.circle
            cx={10}
            cy={y}
            r={5}
            stroke="currentColor"
            strokeWidth={1.5}
            fill="none"
            variants={{
              rest: { opacity: 0.35 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
          <motion.path
            d={`M7.5 ${y} l2 2 l4 -4`}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={{
              rest: { pathLength: 0, opacity: 0 },
              hover: { pathLength: 1, opacity: 1 },
            }}
            transition={{
              duration: 0.3,
              delay: i * 0.1 + 0.05,
              ease: "easeOut",
            }}
          />
          <motion.rect
            x={20}
            y={y - 3}
            width={30}
            height={5}
            rx={2.5}
            fill="currentColor"
            variants={{
              rest: { opacity: 0.25 },
              hover: { opacity: 0.65 },
            }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
        </motion.g>
      ))}
    </svg>
  );
}
