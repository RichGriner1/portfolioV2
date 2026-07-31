"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE, EASE_SOFT } from "@/components/motion/constants";

const VB_W = 300;
const VB_H = 190;
const LOOP_NODE = { x: 56, y: 95 };
const SKILLS = [
  { id: "design-principles", label: "design-principles", x: 236, y: 30 },
  { id: "design-tokens", label: "design-tokens", x: 236, y: 95 },
  { id: "components", label: "components", x: 236, y: 160 },
] as const;

const toLeft = (x: number) => `${(x / VB_W) * 100}%`;
const toTop = (y: number) => `${(y / VB_H) * 100}%`;

type Step = -1 | 0 | 1 | 2 | 3;

/**
 * The framed panel adapts to its container: auto height in a blog post
 * (scene keeps its 200px floor), full height inside a WorkCard tile —
 * so the thumbnail reads like every other card: content in the middle,
 * border around it.
 */
export function LoopVsSkillFigure() {
  const [step, setStep] = useState<Step>(-1);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        setStep(-1);
        await wait(500);
        if (cancelled) return;

        for (let i = 0; i < 3; i++) {
          setStep(i as Step);
          await wait(900);
          if (cancelled) return;
        }

        setStep(3);
        await wait(1700);
        if (cancelled) return;
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, []);

  const reachingSkill =
    step === 0 || step === 1 || step === 2 ? SKILLS[step] : null;

  const scene = (
    <div className="bg-card relative min-h-[200px] flex-1 overflow-hidden rounded-xl">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {reachingSkill ? (
          <motion.path
            key={`connector-${step}`}
            d={`M ${LOOP_NODE.x} ${LOOP_NODE.y} L ${reachingSkill.x} ${reachingSkill.y}`}
            className="stroke-primary"
            strokeWidth={1}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_SOFT }}
          />
        ) : null}

        {reachingSkill ? (
          <motion.circle
            key={`pulse-${step}`}
            r={2.5}
            className="fill-primary"
            initial={{ cx: LOOP_NODE.x, cy: LOOP_NODE.y, opacity: 0 }}
            animate={{
              cx: [LOOP_NODE.x, reachingSkill.x],
              cy: [LOOP_NODE.y, reachingSkill.y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        ) : null}
      </svg>

      {/* Skill cards — the manuals the loop opens as it steps through. */}
      {SKILLS.map((skill, i) => (
        <motion.div
          key={skill.id}
          className="bg-card absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-lg border px-2.5 py-1.5"
          style={{ left: toLeft(skill.x), top: toTop(skill.y) }}
          animate={{
            borderColor:
              step === i ? "var(--color-primary)" : "var(--color-border)",
          }}
          transition={{ duration: 0.4, ease: EASE_SOFT }}
        >
          <span className="text-muted-foreground/70 font-mono text-[7px] tracking-wider uppercase">
            SKILL
          </span>
          <span className="text-foreground font-mono text-[9px]">
            {skill.label}
          </span>
        </motion.div>
      ))}

      {/* Loop node — the worker, with its own bounded step track. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: toLeft(LOOP_NODE.x), top: toTop(LOOP_NODE.y) }}
      >
        <div className="bg-card border-border relative flex h-20 w-32 flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2 shadow-sm">
          <span className="text-primary font-mono text-[8px] tracking-wider uppercase">
            LOOP
          </span>
          <span className="text-foreground font-mono text-[10px]">
            /ds-cleanup
          </span>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-full"
                animate={{
                  backgroundColor:
                    step >= i && step !== -1
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                }}
                transition={{ duration: 0.3, ease: EASE_SOFT }}
              />
            ))}
            <span className="bg-border h-px w-1.5" aria-hidden />
            <motion.span
              className="flex size-2.5 items-center justify-center rounded-xs"
              animate={{
                backgroundColor:
                  step === 3 ? "var(--color-primary)" : "var(--color-muted)",
              }}
              transition={{ duration: 0.3, ease: EASE_SOFT }}
            >
              {step === 3 ? (
                <Check className="text-primary-foreground size-2" />
              ) : null}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="group bg-card border-border/60 flex h-full flex-col gap-4 rounded-sm border p-5">
      {scene}
    </div>
  );
}
