"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE_SOFT } from "@/components/motion/constants";

/**
 * Diagram 6 — one primitive decision cascading through semantic tokens into every
 * component that reads them.
 *
 * The source SVG made this point by recolouring a blue swatch, which this figure
 * deliberately does NOT do: a hard-coded hex is the exact thing the post argues
 * against, and inventing an accent token just to animate it would break the repo's
 * token rule for a decoration. So the cascade is shown as PROPAGATION instead of hue
 * — a wave moves left to right, and each layer flips from `bg-muted` (hasn't heard
 * yet) to `bg-primary` (took the decision) as it arrives.
 *
 * That turns out to be the more accurate picture anyway. What matters isn't that the
 * colour changed; it's that nobody edited a component file for it to change.
 *
 * The primitive is labelled `brand-500`, not the post's `blue-500`: the swatch renders
 * as `--primary`, so a label promising blue over a black square just read as a bug.
 * `brand-500` still carries the descriptive-vs-functional contrast the post is making
 * (a ramp step versus `button-primary`) without naming a hue the figure can't show.
 */
const SEMANTIC = ["color-action", "color-link", "color-badge"] as const;

/** How far the wave has travelled: 0 nothing, 1 primitive, 2 semantic, 3 components. */
type Wave = 0 | 1 | 2 | 3;

function Layer({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function Arrow({ lit }: { lit: boolean }) {
  return (
    <motion.div
      className="text-muted-foreground mt-6 hidden shrink-0 sm:block"
      initial={false}
      animate={{ opacity: lit ? 1 : 0.25, x: lit ? 0 : -3 }}
      transition={{ duration: 0.3, ease: EASE_SOFT }}
    >
      <ArrowRight className="size-3.5" />
    </motion.div>
  );
}

export function TokenCascadeFigure() {
  const [wave, setWave] = useState<Wave>(0);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        setWave(0);
        await wait(800);
        for (const step of [1, 2, 3] as const) {
          if (cancelled) return;
          setWave(step);
          await wait(560);
        }
        await wait(2400);
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, []);

  const on = (at: Wave) => wave >= at;
  const fill = (at: Wave) =>
    on(at)
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground";

  return (
    <div className="bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
        TokenOps
      </div>

      <div className="flex min-h-[150px] flex-col gap-4 sm:flex-row sm:items-start sm:gap-3">
        <Layer label="Primitive">
          <motion.div
            className="border-border flex items-center gap-2 rounded-lg border p-2"
            initial={false}
            animate={{ opacity: on(1) ? 1 : 0.55 }}
            transition={{ duration: 0.3, ease: EASE_SOFT }}
          >
            <motion.span
              className={`size-6 shrink-0 rounded-md ${on(1) ? "bg-primary" : "bg-muted"}`}
              animate={{ scale: wave === 1 ? [1, 1.16, 1] : 1 }}
              transition={{ duration: 0.45, ease: EASE_SOFT }}
            />
            <span className="text-foreground font-mono text-[10px]">
              brand-500
            </span>
          </motion.div>
        </Layer>

        <Arrow lit={on(2)} />

        <Layer label="Semantic">
          <div className="flex flex-col gap-1.5">
            {SEMANTIC.map((name, i) => (
              <motion.div
                key={name}
                className="border-border flex items-center gap-2 rounded-lg border px-2 py-1.5"
                initial={false}
                animate={{ opacity: on(2) ? 1 : 0.55 }}
                transition={{
                  duration: 0.3,
                  delay: on(2) ? i * 0.08 : 0,
                  ease: EASE_SOFT,
                }}
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${on(2) ? "bg-primary" : "bg-muted"}`}
                />
                <span className="text-foreground font-mono text-[9px]">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
        </Layer>

        <Arrow lit={on(3)} />

        <Layer label="Components">
          <div className="flex flex-col items-start gap-2">
            <motion.span
              className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium ${fill(3)}`}
              initial={false}
              animate={{ opacity: on(3) ? 1 : 0.55 }}
              transition={{ duration: 0.3, ease: EASE_SOFT }}
            >
              Confirm
            </motion.span>
            <motion.span
              className={
                on(3)
                  ? "text-foreground text-[10px] underline underline-offset-2"
                  : "text-muted-foreground text-[10px]"
              }
              initial={false}
              animate={{ opacity: on(3) ? 1 : 0.55 }}
              transition={{ duration: 0.3, delay: 0.08, ease: EASE_SOFT }}
            >
              See more →
            </motion.span>
            <motion.span
              className={`rounded-full px-2 py-0.5 font-mono text-[9px] ${fill(3)}`}
              initial={false}
              animate={{ opacity: on(3) ? 1 : 0.55 }}
              transition={{ duration: 0.3, delay: 0.16, ease: EASE_SOFT }}
            >
              NEW
            </motion.span>
          </div>
        </Layer>
      </div>

      <p className="text-muted-foreground border-border/60 border-t pt-3 text-[11px] leading-snug">
        <span className="font-mono text-[10px]">
          brand-500 → color-action → button.background
        </span>
        <br />
        One decision moves through three layers without anyone opening a
        component file.
      </p>
    </div>
  );
}
