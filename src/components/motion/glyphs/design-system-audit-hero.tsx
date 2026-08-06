"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { useStaticResolve } from "./use-static-resolve";

// Token-mirroring constants, `hero.tsx` style — comment marks the CSS custom
// property each one stands in for.
const EASE_IN_OUT_SOFT = [0.45, 0.05, 0.15, 1] as const; // --ease-in-out-soft
const EASE_OUT_SOFT = [0.2, 0.8, 0.2, 1] as const; // --ease-out-soft
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const; // --ease-spring
const DURATION_FAST = 0.12; // --duration-fast
const DURATION_SLOW = 0.32; // --duration-slow

const STAGGER = 0.09; // ~90ms between pill starts, per brief
const LAST_PILL_ARRIVAL = 4 * STAGGER + DURATION_SLOW; // ~0.68s — the "click" moment

// Canonical (resolved) pill geometry, centered in the 240x160 viewBox.
const TARGET = { x: 76, y: 66, width: 88, height: 28, rx: 8 };
const RESOLVED = {
  x: TARGET.x,
  y: TARGET.y,
  width: TARGET.width,
  height: TARGET.height,
  rx: TARGET.rx,
  rotate: 0,
  opacity: 1,
};

// Five drifted variants — each individually wrong (its own radius, height,
// width, and tilt) before converging on the shared canonical pill above.
const PILLS = [
  { x: 33, y: 34, width: 46, height: 20, rx: 3, rotate: -9, opacity: 0.4 },
  { x: 143, y: 31, width: 58, height: 10, rx: 14, rotate: 7, opacity: 0.45 },
  { x: 62, y: 102, width: 40, height: 24, rx: 2, rotate: -6, opacity: 0.5 },
  { x: 147, y: 102, width: 66, height: 16, rx: 11, rotate: 10, opacity: 0.35 },
  { x: 89, y: 24, width: 50, height: 12, rx: 6, rotate: 5, opacity: 0.55 },
];

/**
 * Design System Audit — hero centerpiece.
 * Five drifted button-pill variants converge on a shared, canonical pill on
 * scroll-into-view (one-shot), with a baseline rule drawing through the
 * resolved pill at the same moment. A small confirm-pulse rewards hover
 * afterward; nothing scatters back out.
 */
export function DesignSystemAuditHeroGlyph() {
  const staticResolve = useStaticResolve();
  const [viewportResolved, setViewportResolved] = useState(false);

  const canAnimate = !staticResolve;
  const hasResolved = staticResolve || viewportResolved;

  return (
    <motion.svg
      viewBox="0 0 240 160"
      fill="none"
      className="text-foreground h-auto w-full max-w-[300px]"
      aria-hidden="true"
      initial={canAnimate ? "rest" : "resolved"}
      // Hover pulse only arms after the convergence has played (and never
      // under reduced motion) so a stray pointer can't fire the "hover"
      // variant while the pills are still scattered.
      whileHover={canAnimate && hasResolved ? "hover" : undefined}
      {...(canAnimate
        ? {
            whileInView: "resolved",
            viewport: { once: true, amount: 0.5 },
            onViewportEnter: () => setViewportResolved(true),
          }
        : { animate: "resolved" })}
    >
      {/* Ghost target — dashed at rest, crossfades to a solid stroke as the
          last pill lands. */}
      <motion.rect
        x={TARGET.x}
        y={TARGET.y}
        width={TARGET.width}
        height={TARGET.height}
        rx={TARGET.rx}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        variants={{ rest: { opacity: 0.35 }, resolved: { opacity: 0 } }}
        transition={{
          duration: DURATION_FAST,
          delay: LAST_PILL_ARRIVAL,
          ease: EASE_OUT_SOFT,
        }}
      />
      <motion.rect
        x={TARGET.x}
        y={TARGET.y}
        width={TARGET.width}
        height={TARGET.height}
        rx={TARGET.rx}
        stroke="currentColor"
        strokeWidth={1.5}
        variants={{ rest: { opacity: 0 }, resolved: { opacity: 1 } }}
        transition={{
          duration: DURATION_FAST,
          delay: LAST_PILL_ARRIVAL,
          ease: EASE_OUT_SOFT,
        }}
      />

      {/* Five drifted pills, converging. The last pill carries the hover
          confirm-pulse — a small scale keyframe on top of the resolved
          geometry ("this holds"); nothing scatters back out. */}
      {PILLS.map((pill, i) => {
        const delay = i * STAGGER;
        const isLast = i === PILLS.length - 1;
        return (
          <motion.rect
            key={i}
            fill="currentColor"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            variants={{
              rest: pill,
              resolved: RESOLVED,
              ...(isLast
                ? { hover: { ...RESOLVED, scale: [1, 1.03, 1] } }
                : {}),
            }}
            transition={{
              x: { duration: DURATION_SLOW, delay, ease: EASE_IN_OUT_SOFT },
              y: { duration: DURATION_SLOW, delay, ease: EASE_IN_OUT_SOFT },
              width: {
                duration: DURATION_SLOW,
                delay,
                ease: EASE_IN_OUT_SOFT,
              },
              height: {
                duration: DURATION_SLOW,
                delay,
                ease: EASE_IN_OUT_SOFT,
              },
              rx: { duration: DURATION_SLOW, delay, ease: EASE_IN_OUT_SOFT },
              opacity: { duration: DURATION_SLOW, delay, ease: EASE_OUT_SOFT },
              rotate: { duration: DURATION_SLOW, delay, ease: EASE_SPRING },
              scale: { duration: DURATION_FAST, ease: EASE_SPRING },
            }}
          />
        );
      })}

      {/* Reference line — draws left-to-right through the resolved pill as
          it lands; briefly raises opacity on hover ("this holds"). */}
      <motion.line
        x1={30}
        y1={TARGET.y + TARGET.height / 2}
        x2={210}
        y2={TARGET.y + TARGET.height / 2}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        variants={{
          rest: { pathLength: 0, opacity: 0 },
          resolved: {
            pathLength: 1,
            opacity: 0.7,
            transition: {
              duration: DURATION_FAST,
              delay: LAST_PILL_ARRIVAL,
              ease: EASE_OUT_SOFT,
            },
          },
          hover: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: DURATION_FAST, ease: EASE_OUT_SOFT },
          },
        }}
      />
    </motion.svg>
  );
}
