"use client";

import { motion } from "motion/react";

import { EASE_SOFT } from "@/components/motion/constants";
import { pick, useLang, type Bilingual } from "@/lib/i18n";

// Port of the `proceso` thumb from Coherence's blog landing (blog.landing.html):
// a vertical process timeline — spine, one pill per stage, the last stage still
// ahead (dashed pill, dimmer label). Stages land one by one on scroll-in.
const STAGES: Bilingual<string[]> = {
  en: ["Context", "Moodboards", "Principles", "Tokens", "Components", "Charts"],
  es: [
    "Contexto",
    "Moodboards",
    "Principios",
    "Tokens",
    "Componentes",
    "Gráficas",
  ],
};

/**
 * The framed panel adapts to its container: auto height in a blog post,
 * full height inside a WorkCard tile — same contract as the other figures.
 */
export function VisualIdentityProcessFigure() {
  const { lang } = useLang();
  const stages = pick(STAGES, lang);

  return (
    <div className="bg-card relative flex min-h-[200px] flex-1 flex-col justify-center overflow-hidden rounded-xl px-6 py-5">
      <div className="relative flex flex-col gap-2.5">
        {/* Spine */}
        <motion.div
          aria-hidden
          className="bg-border absolute top-2 bottom-2 left-[5px] w-px origin-top"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_SOFT }}
        />
        {stages.map((label, i) => {
          const next = i === stages.length - 1;
          return (
            <motion.div
              key={label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: 0.15 + i * 0.12,
                ease: EASE_SOFT,
              }}
            >
              <span
                aria-hidden
                className={
                  next
                    ? "border-muted-foreground/50 bg-card z-10 size-[11px] shrink-0 rounded-full border border-dashed"
                    : "bg-primary z-10 size-[11px] shrink-0 rounded-full"
                }
              />
              <span
                className={
                  next
                    ? "border-muted-foreground/40 text-muted-foreground flex-1 rounded-full border border-dashed px-3 py-1 font-mono text-[10px]"
                    : "border-border bg-muted/40 text-foreground flex-1 rounded-full border px-3 py-1 font-mono text-[10px]"
                }
              >
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
