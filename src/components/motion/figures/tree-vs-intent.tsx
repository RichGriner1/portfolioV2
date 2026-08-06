"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE_SOFT } from "@/components/motion/constants";

/**
 * Diagram 3 — walking a menu tree against taking a short route from an intent.
 *
 * Drawn as two SVGs rather than divs because the argument is the PATH LENGTH, and a
 * path is the thing SVG measures for free: both sides animate the same dot along
 * `offsetPath`-style stroke reveals, so "four hops" and "one hop" are the same
 * animation at different lengths. Comparing them as boxes would need the reader to
 * count nodes instead of watching the trip.
 *
 * Every stroke and fill is `currentColor` at an opacity, so the figure inherits the
 * theme's ink instead of carrying its own palette.
 */

/** Node positions for the tree, in the 0–100 viewBox. Four levels, one live path. */
const TREE_NODES = [
  { x: 50, y: 10, live: true },
  { x: 26, y: 33, live: true },
  { x: 74, y: 33, live: false },
  { x: 14, y: 56, live: true },
  { x: 38, y: 56, live: false },
  { x: 62, y: 56, live: false },
  { x: 86, y: 56, live: false },
  { x: 14, y: 79, live: true },
] as const;

const TREE_EDGES = [
  { a: 0, b: 1, live: true },
  { a: 0, b: 2, live: false },
  { a: 1, b: 3, live: true },
  { a: 1, b: 4, live: false },
  { a: 2, b: 5, live: false },
  { a: 2, b: 6, live: false },
  { a: 3, b: 7, live: true },
] as const;

const DUR = 2.4;

function Panel({
  eyebrow,
  title,
  caption,
  children,
}: {
  eyebrow: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
        {eyebrow}
      </span>
      <span className="text-foreground text-[11px] font-medium">{title}</span>
      <div className="text-foreground min-h-[150px] flex-1">{children}</div>
      <span className="text-muted-foreground text-[10px] leading-snug">
        {caption}
      </span>
    </div>
  );
}

export function TreeVsIntentFigure() {
  const [run, setRun] = useState(0);

  // One shared clock, so the two trips start together and the difference in how long
  // each takes to arrive is the readable part.
  useEffect(() => {
    const id = setInterval(() => setRun((n) => n + 1), (DUR + 1.2) * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
        <Panel
          eyebrow="Traditional"
          title="Menu tree"
          caption="Four hops, and three of them are guesses."
        >
          <svg viewBox="0 0 100 92" className="h-full w-full" aria-hidden>
            {TREE_EDGES.map((e) => {
              const a = TREE_NODES[e.a];
              const b = TREE_NODES[e.b];
              return (
                <line
                  key={`${e.a}-${e.b}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="currentColor"
                  strokeOpacity={e.live ? 0.45 : 0.15}
                  strokeWidth={1}
                />
              );
            })}
            {TREE_NODES.map((n, i) => (
              <rect
                key={i}
                x={n.x - 9}
                y={n.y - 5}
                width={18}
                height={10}
                rx={2.5}
                fill="currentColor"
                fillOpacity={n.live ? 0.14 : 0.06}
                stroke="currentColor"
                strokeOpacity={n.live ? 0.35 : 0.15}
                strokeWidth={0.8}
              />
            ))}
            {/* The trip: one dot stepping node → node → node → node. */}
            <motion.circle
              key={run}
              r={2.6}
              fill="currentColor"
              initial={{ cx: TREE_NODES[0].x, cy: TREE_NODES[0].y }}
              animate={{
                cx: [26, 14, 14],
                cy: [33, 56, 79],
              }}
              transition={{
                duration: DUR,
                ease: EASE_SOFT,
                times: [0.33, 0.66, 1],
              }}
            />
          </svg>
        </Panel>

        <Panel
          eyebrow="Intent-based"
          title="Short route"
          caption="One intent, one hop. The tree is still there, behind it."
        >
          <svg viewBox="0 0 100 92" className="h-full w-full" aria-hidden>
            {[22, 66].map((cx, i) => (
              <g key={cx}>
                <rect
                  x={cx - 20}
                  y={10}
                  width={40}
                  height={14}
                  rx={3}
                  fill="currentColor"
                  fillOpacity={0.14}
                  stroke="currentColor"
                  strokeOpacity={0.35}
                  strokeWidth={0.8}
                />
                <line
                  x1={cx}
                  y1={24}
                  x2={cx}
                  y2={62}
                  stroke="currentColor"
                  strokeOpacity={0.45}
                  strokeWidth={1}
                />
                <rect
                  x={cx - 20}
                  y={62}
                  width={40}
                  height={14}
                  rx={3}
                  fill="currentColor"
                  fillOpacity={0.9}
                />
                <motion.circle
                  key={`${run}-${i}`}
                  r={2.6}
                  cx={cx}
                  fill="currentColor"
                  initial={{ cy: 24 }}
                  animate={{ cy: 62 }}
                  transition={{
                    duration: DUR / 3,
                    ease: EASE_SOFT,
                    delay: i * 0.12,
                  }}
                />
              </g>
            ))}
          </svg>
        </Panel>
      </div>
    </div>
  );
}
