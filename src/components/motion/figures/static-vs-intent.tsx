"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE_SOFT, SPRING_SOFT } from "@/components/motion/constants";

/**
 * Diagram 2 — the same product serving a different composition per intent.
 *
 * The mechanism has to be legible in the motion itself, not just the labels: the
 * modules REORDER rather than being replaced. `layout` on each row does that work —
 * changing the array order animates rows past each other, so you see the same four
 * modules rearranging instead of a screen cross-fading into a different screen. That
 * distinction is the whole argument (rearranging the dashboard wholesale "breaks
 * spatial memory and reads as creepy"; promoting a module into a known slot doesn't).
 */
const MODULES = ["Holdings", "Cash flow", "Property", "Tax"] as const;

/** Each intent promotes a different module to the top slot. */
const INTENTS = [
  { label: "Reviewing wealth", lead: "Holdings" },
  { label: "Buying a home", lead: "Cash flow" },
  { label: "Selling to reinvest", lead: "Property" },
] as const;

export function StaticVsIntentFigure() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % INTENTS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const intent = INTENTS[i];
  // Lead module first, the rest in their authored order behind it.
  const order = [
    intent.lead,
    ...MODULES.filter((m) => m !== intent.lead),
  ] as const;

  return (
    <div className="bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
          Arriving with an intent
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={intent.label}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.25, ease: EASE_SOFT }}
            className="text-foreground font-mono text-[10px]"
          >
            {intent.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* The frame stays put — same product, same slots. Only the order changes. */}
      <div className="border-border/60 bg-muted/30 flex min-h-[180px] flex-col gap-2 rounded-xl border p-3">
        {order.map((name, slot) => (
          <motion.div
            key={name}
            layout
            transition={SPRING_SOFT}
            className={
              slot === 0
                ? "bg-primary text-primary-foreground flex h-11 items-center rounded-lg px-3 text-[11px] font-medium"
                : "bg-muted text-muted-foreground flex h-8 items-center rounded-lg px-3 text-[10px]"
            }
          >
            {name}
          </motion.div>
        ))}
      </div>

      <p className="text-muted-foreground border-border/60 border-t pt-3 text-[11px] leading-snug">
        Same modules, same slots. The intent decides which one leads.
      </p>
    </div>
  );
}
