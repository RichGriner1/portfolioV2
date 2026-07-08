"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE, EASE_SOFT } from "@/components/motion/constants";

const VB_W = 300;
const VB_H = 190;
const HOME = { x: 60, y: 95 };
const PROJECTS = [
  { id: "portfolio", label: "Portfolio", tag: "React", x: 236, y: 30 },
  { id: "afi", label: "Afi", tag: "Angular", x: 236, y: 95 },
  { id: "side", label: "Side project", tag: "—", x: 236, y: 160 },
] as const;

const toLeft = (x: number) => `${(x / VB_W) * 100}%`;
const toTop = (y: number) => `${(y / VB_H) * 100}%`;

export function UseAnywhereFigure() {
  const [cycle, setCycle] = useState(0);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        setPulsing(false);
        setCycle((c) => c + 1);
        await wait(1200);
        if (cancelled) return;

        setPulsing(true);
        await wait(1300);
        if (cancelled) return;

        await wait(1000);
        if (cancelled) return;
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="group bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="bg-card relative min-h-[200px] overflow-hidden rounded-xl">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {PROJECTS.map((p, i) => (
            <motion.path
              key={`line-${cycle}-${p.id}`}
              d={`M ${HOME.x} ${HOME.y} L ${p.x} ${p.y}`}
              className="stroke-border"
              strokeWidth={1}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: EASE_SOFT }}
            />
          ))}

          {pulsing
            ? PROJECTS.map((p, i) => (
                <motion.circle
                  key={`dot-${cycle}-${p.id}`}
                  r={3}
                  className="fill-primary"
                  initial={{ cx: HOME.x, cy: HOME.y, opacity: 0 }}
                  animate={{
                    cx: [HOME.x, p.x],
                    cy: [HOME.y, p.y],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
                />
              ))
            : null}
        </svg>

        {/* Project nodes — highlight briefly as they "receive" the update. */}
        {PROJECTS.map((p, i) => (
          <motion.div
            key={`node-${cycle}-${p.id}`}
            className="bg-card absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-lg border px-2.5 py-1.5"
            style={{ left: toLeft(p.x), top: toTop(p.y) }}
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: 1,
              y: 0,
              borderColor: pulsing
                ? [
                    "var(--color-border)",
                    "var(--color-primary)",
                    "var(--color-border)",
                  ]
                : "var(--color-border)",
            }}
            transition={
              pulsing
                ? {
                    duration: 0.6,
                    delay: 0.9 + i * 0.12,
                    ease: EASE_SOFT,
                  }
                : { duration: 0.4, delay: 0.15 + i * 0.1, ease: EASE_SOFT }
            }
          >
            <span className="text-muted-foreground font-mono text-[10px]">
              {p.label}
            </span>
            <span className="text-muted-foreground/70 font-mono text-[7px] tracking-wider uppercase">
              {p.tag}
            </span>
          </motion.div>
        ))}

        {/* Home base — the single shared source every project points back to. */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: toLeft(HOME.x), top: toTop(HOME.y) }}
        >
          <div className="relative flex h-16 w-28 items-center justify-center">
            <motion.div
              className="border-primary/40 absolute inset-0 rounded-xl border"
              animate={{
                scale: pulsing ? [1, 1.28, 1] : 1,
                opacity: pulsing ? [0.7, 0, 0] : 0,
              }}
              transition={{ duration: 0.6, ease: EASE_SOFT }}
            />
            <motion.div
              className="bg-card border-border relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border shadow-sm"
              animate={{ scale: pulsing ? [1, 1.06, 1] : 1 }}
              transition={{ duration: 0.6, ease: EASE_SOFT }}
            >
              <span className="text-primary font-mono text-[8px] tracking-wider uppercase">
                HOME BASE
              </span>
              <span className="text-foreground font-mono text-[11px]">
                .claude/lib
              </span>
              <div className="flex gap-1">
                <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 font-mono text-[7px]">
                  skill
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 font-mono text-[7px]">
                  loop
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
