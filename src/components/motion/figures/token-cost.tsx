"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE_SOFT } from "@/components/motion/constants";

const BEFORE_TOKENS = "102,000";
const AFTER_TOKENS = "~70,000";

const BEFORE_DRIVERS = [
  "re-reads the main thread",
  "dumps full logs",
  "200-line prompt",
] as const;

const AFTER_CHIPS = ["audit-only default", "logs filtered"] as const;

type Stage = "idle" | "before" | "fixing" | "after";

export function TokenCostFigure() {
  const [stage, setStage] = useState<Stage>("idle");

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        setStage("idle");
        await wait(600);
        if (cancelled) return;

        setStage("before");
        await wait(1400);
        if (cancelled) return;

        setStage("fixing");
        await wait(700);
        if (cancelled) return;

        setStage("after");
        await wait(2000);
        if (cancelled) return;
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, []);

  const beforeFilled = stage === "before" || stage === "fixing" || stage === "after";
  const afterFilled = stage === "after";

  return (
    <div className="group bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="bg-card flex min-h-[200px] flex-col justify-center gap-7 rounded-xl p-5">
        {/* Before the fix — races up to 102,000 and keeps going. */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
              Before the fix
            </span>
            <AnimatePresence>
              {beforeFilled ? (
                <motion.span
                  key="before-amount"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_SOFT }}
                  className="text-foreground font-mono text-xs"
                >
                  {BEFORE_TOKENS} tokens
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <motion.div
              className="bg-foreground/50 h-full rounded-full"
              animate={{ width: beforeFilled ? "100%" : "0%" }}
              transition={{ duration: 0.9, ease: EASE_SOFT }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BEFORE_DRIVERS.map((driver, i) => (
              <AnimatePresence key={driver}>
                {beforeFilled ? (
                  <motion.span
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.15 + i * 0.15,
                      ease: EASE_SOFT,
                    }}
                    className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-mono text-[9px]"
                  >
                    {driver}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            ))}
          </div>
        </div>

        {/* After the fix — climbs slowly and stops low. */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
              After the fix
            </span>
            <AnimatePresence>
              {afterFilled ? (
                <motion.span
                  key="after-amount"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_SOFT }}
                  className="text-foreground font-mono text-xs"
                >
                  {AFTER_TOKENS} tokens
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <motion.div
              className="bg-primary h-full rounded-full"
              animate={{ width: afterFilled ? "68%" : "0%" }}
              transition={{ duration: 1.3, ease: EASE_SOFT }}
            />
          </div>
          <div className="flex min-h-4 flex-wrap items-center gap-1.5">
            <AnimatePresence>
              {afterFilled ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 1.1, ease: EASE_SOFT }}
                  className="text-primary inline-flex items-center gap-1 font-mono text-[9px]"
                >
                  <Check className="size-2.5" />
                  bounded · stops on its own
                </motion.span>
              ) : null}
              {afterFilled
                ? AFTER_CHIPS.map((chip, i) => (
                    <motion.span
                      key={chip}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: 1.3 + i * 0.15,
                        ease: EASE_SOFT,
                      }}
                      className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-mono text-[9px]"
                    >
                      {chip}
                    </motion.span>
                  ))
                : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
