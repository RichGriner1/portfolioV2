"use client";

import { motion } from "motion/react";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const CX = 40;
const CY = 30;

const RINGS = [
  { r: 6, hoverR: 6, restOpacity: 1, hoverOpacity: 1 },
  { r: 14, hoverR: 18, restOpacity: 0.45, hoverOpacity: 0.7 },
  { r: 22, hoverR: 28, restOpacity: 0.2, hoverOpacity: 0.45 },
];

export function BreathingGlyph(_props?: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 60"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      {/* Center dot */}
      <motion.circle
        cx={CX}
        cy={CY}
        r={4}
        fill="currentColor"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        variants={{
          rest: { opacity: 0.9, scale: 1 },
          hover: {
            opacity: 1,
            scale: 1.15,
            transition: { duration: 0.3, ease: EASE },
          },
        }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
      {/* Concentric rings */}
      {RINGS.map((ring, i) => (
        <motion.circle
          key={i}
          cx={CX}
          cy={CY}
          r={ring.r}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: ring.restOpacity }}
          variants={{
            rest: {
              r: ring.r,
              opacity: ring.restOpacity,
              transition: { duration: 0.4, ease: EASE },
            },
            hover: {
              r: [ring.r, ring.hoverR, ring.r],
              opacity: [ring.restOpacity, ring.hoverOpacity, ring.restOpacity],
              transition: {
                duration: 2.0,
                delay: i * 0.25,
                repeat: Infinity,
                ease: EASE,
              },
            },
          }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
        />
      ))}
    </svg>
  );
}
