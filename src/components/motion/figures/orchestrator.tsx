"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE, EASE_SOFT } from "@/components/motion/constants";

const VB_W = 300;
const VB_H = 190;
const ORCH = { x: 150, y: 28 };
const REVIEWER = { x: 84, y: 155 };
const FIXER = { x: 216, y: 155 };

const toLeft = (x: number) => `${(x / VB_W) * 100}%`;
const toTop = (y: number) => `${(y / VB_H) * 100}%`;

const COUNT_STEPS = [18000, 47000, 74000, 96000, 102000] as const;

type Stage = "idle" | "dispatch" | "reviewing" | "fixing";

export function OrchestratorFigure() {
  const [stage, setStage] = useState<Stage>("idle");
  const [cycle, setCycle] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        setStage("idle");
        setCount(0);
        setCycle((c) => c + 1);
        await wait(600);
        if (cancelled) return;

        setStage("dispatch");
        await wait(900);
        if (cancelled) return;

        setStage("reviewing");
        for (const step of COUNT_STEPS) {
          setCount(step);
          await wait(180);
          if (cancelled) return;
        }
        await wait(500);
        if (cancelled) return;

        setStage("fixing");
        await wait(900);
        if (cancelled) return;

        await wait(900);
        if (cancelled) return;
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, []);

  const dispatching = stage === "dispatch";
  const reviewing = stage === "reviewing";
  const fixing = stage === "fixing";

  return (
    <div className="group bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="bg-card relative min-h-[200px] overflow-hidden rounded-xl">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {[REVIEWER, FIXER].map((target, i) => (
            <motion.path
              key={`line-${cycle}-${i}`}
              d={`M ${ORCH.x} ${ORCH.y} L ${target.x} ${target.y}`}
              className="stroke-border"
              strokeWidth={1}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_SOFT }}
            />
          ))}

          {dispatching
            ? [REVIEWER, FIXER].map((target, i) => (
                <motion.circle
                  key={`pulse-${cycle}-${i}`}
                  r={3}
                  className="fill-primary"
                  initial={{ cx: ORCH.x, cy: ORCH.y, opacity: 0 }}
                  animate={{
                    cx: [ORCH.x, target.x],
                    cy: [ORCH.y, target.y],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{ duration: 0.75, delay: i * 0.15, ease: EASE }}
                />
              ))
            : null}
        </svg>

        {/* Orchestrator — the loop dispatching to its two helpers. */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: toLeft(ORCH.x), top: toTop(ORCH.y) }}
        >
          <motion.div
            className="bg-card border-border relative flex flex-col items-center gap-0.5 rounded-lg border px-3 py-1.5 shadow-sm"
            animate={{ scale: dispatching ? [1, 1.06, 1] : 1 }}
            transition={{ duration: 0.5, ease: EASE_SOFT }}
          >
            <span className="text-primary font-mono text-[8px] tracking-wider uppercase">
              ORCHESTRATOR
            </span>
            <span className="text-foreground font-mono text-[10px]">
              the loop
            </span>
          </motion.div>
        </div>

        {/* Reviewer — audits and lists what's broken; nearly all of the 102k. */}
        <motion.div
          className="bg-card absolute flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-lg border px-2.5 py-2"
          style={{ left: toLeft(REVIEWER.x), top: toTop(REVIEWER.y) }}
          animate={{
            borderColor: reviewing
              ? "var(--color-primary)"
              : "var(--color-border)",
          }}
          transition={{ duration: 0.4, ease: EASE_SOFT }}
        >
          <span className="text-muted-foreground font-mono text-[7px] tracking-wider uppercase">
            REVIEWER
          </span>
          <span className="text-muted-foreground/80 font-mono text-[8px]">
            audits · lists what&apos;s broken
          </span>
          <span className="text-foreground font-mono text-[11px] tabular-nums">
            {count > 0 ? `${count.toLocaleString()} tok` : "—"}
          </span>
        </motion.div>

        {/* Fixer — applies the changes the reviewer flagged. */}
        <motion.div
          className="bg-card absolute flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-lg border px-2.5 py-2"
          style={{ left: toLeft(FIXER.x), top: toTop(FIXER.y) }}
          animate={{
            borderColor: fixing
              ? "var(--color-primary)"
              : "var(--color-border)",
          }}
          transition={{ duration: 0.4, ease: EASE_SOFT }}
        >
          <span className="text-muted-foreground font-mono text-[7px] tracking-wider uppercase">
            FIXER
          </span>
          <span className="text-muted-foreground/80 font-mono text-[8px]">
            applies changes
          </span>
        </motion.div>
      </div>
    </div>
  );
}
