"use client";

import { Check, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE_SOFT } from "@/components/motion/constants";

/**
 * Diagram 4 — the 150–250ms beat that makes a high-stakes action feel real.
 *
 * Played at 4× slower than life, and it says so on screen.
 *
 * The first cut ran the true numbers — 50ms against 200ms. It was unreadable: a
 * 150ms gap is under the threshold where you can watch two things happen in
 * sequence, so both rows simply arrived at "Confirmed" together and the figure
 * looked like two identical buttons. The claim was invisible in the one diagram
 * whose entire subject is timing.
 *
 * Slowing it down is the honest fix, but only with the scale declared — a reader who
 * takes the on-screen delay as the recommendation would build something that feels
 * broken, since 800ms is well past the 250ms ceiling. So the real numbers stay
 * printed on each row, the caption states the window, and `SLOWDOWN` is shown.
 */
const SLOWDOWN = 4;
const INSTANT_MS = 50 * SLOWDOWN;
const PAUSED_MS = 200 * SLOWDOWN;

type Phase = "idle" | "pressed" | "working" | "done";

function Row({
  eyebrow,
  timing,
  verdict,
  phase,
  emphasis,
}: {
  eyebrow: string;
  timing: string;
  verdict: string;
  phase: Phase;
  emphasis: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-[86px] shrink-0 flex-col gap-0.5">
        <span
          className={
            emphasis
              ? "text-foreground font-mono text-[9px] tracking-wider uppercase"
              : "text-muted-foreground font-mono text-[9px] tracking-wider uppercase"
          }
        >
          {eyebrow}
        </span>
        <span className="text-muted-foreground font-mono text-[9px]">
          {timing}
        </span>
      </div>

      <motion.div
        className="border-border bg-card flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border text-[11px] font-medium"
        animate={{ scale: phase === "pressed" ? 0.97 : 1 }}
        transition={{ duration: 0.1, ease: EASE_SOFT }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {phase === "done" ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: EASE_SOFT }}
              className="text-foreground inline-flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              Confirmed
            </motion.span>
          ) : phase === "working" ? (
            <motion.span
              key="working"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              className="text-muted-foreground inline-flex items-center gap-1.5"
            >
              <Loader2 className="size-3.5 animate-spin" />
              Confirming
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="text-foreground"
            >
              Confirm payment
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <span
        className={
          emphasis
            ? "text-foreground w-[76px] shrink-0 text-[10px] italic"
            : "text-muted-foreground w-[76px] shrink-0 text-[10px] italic"
        }
      >
        {phase === "done" ? verdict : ""}
      </span>
    </div>
  );
}

export function PauseConfidenceFigure() {
  const [instant, setInstant] = useState<Phase>("idle");
  const [paused, setPaused] = useState<Phase>("idle");

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        setInstant("idle");
        setPaused("idle");
        await wait(800);
        if (cancelled) return;

        // Both pressed on the same beat, so the only variable is the response.
        setInstant("pressed");
        setPaused("pressed");
        await wait(110);
        if (cancelled) return;

        setInstant("working");
        setPaused("working");
        await wait(INSTANT_MS);
        if (cancelled) return;
        setInstant("done");

        await wait(PAUSED_MS - INSTANT_MS);
        if (cancelled) return;
        setPaused("done");

        // Shorter than the other figures' rest beat on purpose. The only moment that
        // carries the claim is the 600ms where one row has confirmed and the other is
        // still working; a long tail made that a small fraction of the loop, so a
        // reader could watch a full cycle and miss it.
        await wait(1600);
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
          High-impact actions
        </span>
        <span className="text-muted-foreground font-mono text-[9px]">
          shown {SLOWDOWN}× slower
        </span>
      </div>

      <div className="flex min-h-[120px] flex-col justify-center gap-5">
        <Row
          eyebrow="Instant"
          timing="~50 ms"
          verdict="feels broken"
          phase={instant}
          emphasis={false}
        />
        <Row
          eyebrow="Deliberate"
          timing="150–250 ms"
          verdict="feels reliable"
          phase={paused}
          emphasis
        />
      </div>

      <p className="text-muted-foreground border-border/60 border-t pt-3 text-[11px] leading-snug">
        Too fast and the brain doesn&apos;t believe the work happened. The
        window is narrow — under 150ms reads as anxious, over 250ms as broken.
      </p>
    </div>
  );
}
