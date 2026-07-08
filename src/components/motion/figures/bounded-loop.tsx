"use client";

import { Check, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE, EASE_SOFT } from "@/components/motion/constants";

const CHURN_COUNTS = [1200, 3400, 6100, 9800] as const;
const AFTER_CHIPS = ["Audit", "Fix · one pass"] as const;

type Stage = "idle" | "before" | "beat" | "after";

export function BoundedLoopFigure() {
  const [stage, setStage] = useState<Stage>("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        setStage("idle");
        setCount(0);
        await wait(500);
        if (cancelled) return;

        setStage("before");
        for (const step of CHURN_COUNTS) {
          setCount(step);
          await wait(350);
          if (cancelled) return;
        }
        await wait(200);
        if (cancelled) return;

        setStage("beat");
        await wait(500);
        if (cancelled) return;

        setStage("after");
        await wait(2200);
        if (cancelled) return;
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, []);

  const spinning = stage === "before";
  const showAfter = stage === "after";

  return (
    <div className="group bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="bg-card flex min-h-[200px] flex-col justify-center gap-7 rounded-xl p-5">
        {/* Before — spins on its own fix-verify churn, never stops. */}
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Before
          </span>
          <div className="flex items-center gap-3">
            <motion.div
              className="text-muted-foreground"
              animate={{ rotate: spinning ? [0, 360, 720] : 0 }}
              transition={{ duration: 1.6, ease: EASE }}
            >
              <RefreshCw className="size-4" />
            </motion.div>
            <span className="text-muted-foreground font-mono text-[10px]">
              fix → verify → fix …
            </span>
            <AnimatePresence>
              {count > 0 ? (
                <motion.span
                  key="churn-count"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE_SOFT }}
                  className="text-muted-foreground/70 font-mono text-[9px] tabular-nums"
                >
                  {count.toLocaleString()} tok
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* After — a bounded pass that lands on a stop. */}
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            After
          </span>
          <div className="flex min-h-6 flex-wrap items-center gap-1.5">
            <AnimatePresence>
              {showAfter
                ? AFTER_CHIPS.map((chip, i) => (
                    <motion.span
                      key={chip}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.35,
                        ease: EASE_SOFT,
                      }}
                      className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-mono text-[9px]"
                    >
                      {chip}
                    </motion.span>
                  ))
                : null}
              {showAfter ? (
                <motion.span
                  key="stop"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: AFTER_CHIPS.length * 0.35,
                    ease: EASE_SOFT,
                  }}
                  className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px]"
                >
                  <Check className="size-2.5" />
                  Stop
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {showAfter ? (
              <motion.span
                key="deep-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: (AFTER_CHIPS.length + 1) * 0.35,
                  ease: EASE_SOFT,
                }}
                className="text-muted-foreground/70 font-mono text-[8px]"
              >
                --deep capped at 2
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
