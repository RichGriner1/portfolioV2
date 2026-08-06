"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE_SOFT } from "@/components/motion/constants";

/**
 * Diagram 1 — the five stages of design maturity, as a rising ladder.
 *
 * The source SVG pinned a specific org at *Managed* and drew *Defined* as its
 * dashed target. That marker is deliberately not here: the five-stage scale is
 * published research (dsruptr), but "we are at Managed" is an internal assessment
 * and this repo is public. The figure teaches the ladder and which jump is the hard
 * one; the post's prose says who is standing where.
 *
 * The point the shape has to carry: the Managed→Defined jump is not a skill gap. So
 * Names only, no per-stage gloss. This figure is also the home page's tile for the
 * post, where it gets a 238px-tall box about 468px wide — at that size a note like
 * "rules in designers' heads" wraps to two lines and the labels clip off the bottom
 * edge. The post defines all five stages in the list directly above, so the gloss was
 * repeating prose the reader has just read. Dropping it fits both contexts.
 */
const STAGES = [
  // "Chaos" is Richard's name for the stage the research calls "Ad hoc" — his post
  // says so outright, and it's the more honest label for design happening screen by
  // screen with no collaboration until after high fidelity.
  { name: "Chaos", height: 22 },
  { name: "Managed", height: 40 },
  { name: "Defined", height: 58 },
  { name: "Optimized", height: 78 },
  { name: "Adaptive", height: 100 },
] as const;

/**
 * The last stage the design team can reach on its own. Everything past *Defined* is
 * won by the rest of the organisation adopting the vocabulary, which is why the bars
 * beyond it are drawn at a lighter weight.
 */
const PIVOT = 2;

export function MaturityStagesFigure() {
  const [grown, setGrown] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        setGrown(0);
        await wait(700);
        for (let i = 1; i <= STAGES.length; i++) {
          if (cancelled) return;
          setGrown(i);
          await wait(320);
        }
        await wait(2600);
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
        Five maturity stages
      </div>

      <div className="flex min-h-0 flex-1 items-end gap-2">
        {STAGES.map((stage, i) => {
          const on = i < grown;
          // Past the pivot the bar is lighter, not an outline. Outlines were tried
          // first and lost: three of five stages rendered as empty frames, so the
          // ladder read as mostly-missing rather than as a climb. Weight carries
          // "not yours to win" without taking the bar away.
          const beyond = i > PIVOT;
          return (
            <div key={stage.name} className="flex flex-1 flex-col gap-2">
              <div className="flex h-[104px] items-end">
                <motion.div
                  className={`w-full rounded-md ${beyond ? "bg-foreground/25" : "bg-foreground/70"}`}
                  initial={false}
                  // Floors at 12%, not 4%: the reset used to leave five hairlines,
                  // and a figure scrolled past mid-reset looked broken.
                  animate={{
                    height: on ? `${stage.height}%` : "12%",
                    opacity: on ? 1 : 0.35,
                  }}
                  transition={{ duration: 0.45, ease: EASE_SOFT }}
                />
              </div>
              <span className="text-foreground text-[10px] leading-tight font-medium">
                {stage.name}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-muted-foreground border-border/60 border-t pt-3 text-[11px] leading-snug">
        Vocabulary the whole team shares is what carries a system past{" "}
        <span className="text-foreground">Defined</span>.
      </p>
    </div>
  );
}
