"use client";

import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useState } from "react";

import { pick, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const; // mirrors --ease-out-soft
const STAGGER = 0.08;
const DURATION_FAST = 0.12; // --duration-fast
const DURATION_SLOW = 0.32; // --duration-slow

// Tailwind's `tracking-tight` computed value (no override in globals.css) — the
// intro settles into this exact value so the class stays the single source of
// truth for the resting state once the animation completes.
const TRACKING_TIGHT = "-0.025em";
const TRACKING_LOOSE = "0.01em"; // transient-only starting value, not a token

// Mirrors --font-display-width (the approved wide display cut). Roboto Flex
// is variable, so the tagline's resolve can settle width alongside tracking
// — weight stays on the font-extrabold utility below rather than animating.
const FONT_STRETCH_WIDE = "125%";
const FONT_STRETCH_NORMAL = "100%"; // transient-only starting value, not a token

const HERO_INTRO_KEY = "hero-intro-played";

// useLayoutEffect is a no-op (with a warning) during SSR; fall back to
// useEffect there since the intro gate only ever runs client-side.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const HERO_EYEBROW: Bilingual<string> = {
  en: "Currently — Designing fintech products and design systems at Afi",
  // TODO(afi-redaccion)
  es: "Actualmente — Diseñando productos fintech y sistemas de diseño en Afi",
};

// TODO(afi-redaccion): polish ES copy
const HERO_TAGLINE: Bilingual<string> = {
  en: "Design that holds up",
  es: "Diseño que aguanta",
};

const HERO_SUBHEAD: Bilingual<string> = {
  en: "Designers are now builders. In order to create consistent products and workflows I focus on systems, building internal tools, and iterating my design process.",
  // TODO(afi-redaccion)
  es: "Los diseñadores ahora somos builders. Para crear productos y flujos de trabajo consistentes, mi foco está en los sistemas, en construir herramientas internas y en iterar mi proceso de diseño.",
};

export function Hero() {
  const { lang } = useLang();

  // Plays the resolve sequence once per session. Defaults to `true` so SSR
  // and the first client render agree (no hydration mismatch); the gate
  // check runs in a layout effect so a skip is decided — and every element
  // re-rendered into its final state — before the browser paints, avoiding
  // any flash of the pre-animation state on repeat visits.
  const [playIntro, setPlayIntro] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadyPlayed = sessionStorage.getItem(HERO_INTRO_KEY) === "true";

    if (reducedMotion || alreadyPlayed) {
      setPlayIntro(false);
      return;
    }

    sessionStorage.setItem(HERO_INTRO_KEY, "true");
  }, []);

  return (
    <section className="flex flex-col gap-5 pt-12 sm:pt-20">
      <motion.div
        initial={playIntro ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 0.5, ease: EASE }}
        className="sm:text-center"
      >
        <a
          href="https://www.afi.es"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground hover:bg-muted bg-muted/50 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors"
        >
          <motion.span
            aria-hidden="true"
            initial={playIntro ? { scale: 1 } : false}
            animate={{ scale: playIntro ? [1, 1.15, 1] : 1 }}
            transition={{
              duration: DURATION_FAST,
              delay: STAGGER * 0.5,
              ease: EASE,
            }}
            className="bg-primary size-1.5 shrink-0 rounded-full"
          />
          <span>{pick(HERO_EYEBROW, lang)}</span>
        </a>
      </motion.div>

      <div className="relative">
        {/* Baseline rule — the grid asserting itself before the tagline
            commits, then receding once the tagline's own type has settled. */}
        <motion.div
          aria-hidden="true"
          initial={playIntro ? { scaleX: 0 } : false}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{
            scaleX: { duration: DURATION_FAST, ease: EASE },
            opacity: {
              duration: DURATION_FAST,
              delay: STAGGER + DURATION_SLOW,
              ease: EASE,
            },
          }}
          style={{ transformOrigin: "left" }}
          className="border-border/40 absolute inset-x-0 -bottom-2 border-t"
        />

        <motion.h1
          initial={
            playIntro
              ? {
                  opacity: 0,
                  y: 8,
                  letterSpacing: TRACKING_LOOSE,
                  fontStretch: FONT_STRETCH_NORMAL,
                }
              : false
          }
          animate={{
            opacity: 1,
            y: 0,
            letterSpacing: TRACKING_TIGHT,
            fontStretch: FONT_STRETCH_WIDE,
          }}
          transition={{
            opacity: { duration: 0.5, delay: STAGGER, ease: EASE },
            y: { duration: 0.5, delay: STAGGER, ease: EASE },
            letterSpacing: {
              duration: DURATION_SLOW,
              delay: STAGGER,
              ease: EASE,
            },
            fontStretch: {
              duration: DURATION_SLOW,
              delay: STAGGER,
              ease: EASE,
            },
          }}
          className="font-display text-foreground text-6xl leading-tight font-extrabold tracking-tight text-balance sm:text-center sm:text-7xl lg:text-8xl"
        >
          {pick(HERO_TAGLINE, lang)}
        </motion.h1>
      </div>

      <motion.p
        initial={playIntro ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 2, ease: EASE }}
        className="text-muted-foreground max-w-xl text-lg leading-relaxed sm:mx-auto sm:max-w-3xl sm:text-center"
      >
        {pick(HERO_SUBHEAD, lang)}
      </motion.p>
    </section>
  );
}
