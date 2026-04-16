"use client";

import { motion } from "motion/react";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const STAGGER = 0.08;

/**
 * Hero — benji-style. Name, short prose, links. Staggered entrance on mount.
 * TODO: rewrite copy in your voice. The current version leans into the
 * range-weighted homepage (DS depth + passion projects) without
 * over-explaining.
 */
export function Hero() {
  return (
    <section className="flex flex-col gap-6 pt-12 sm:pt-20">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="font-display text-6xl font-black tracking-tighter sm:text-7xl"
      >
        Richard Griner
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER, ease: EASE }}
        className="text-foreground max-w-xl text-lg leading-relaxed"
      >
        I design systems for AI and fintech teams — and every so often I brand a
        children&apos;s center or a friend&apos;s video-game AI studio, because
        that&apos;s how I got here.
      </motion.p>

      <motion.nav
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 2, ease: EASE }}
        aria-label="Social links"
        className="text-muted-foreground flex flex-wrap gap-4 text-sm"
      >
        {/* TODO: replace with real handles. */}
        <a
          href="#"
          className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
        >
          X
        </a>
        <a
          href="https://github.com/RichGriner1"
          className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
        >
          GitHub
        </a>
        <a
          href="mailto:hello@richardgriner.com"
          className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
        >
          Email
        </a>
      </motion.nav>
    </section>
  );
}
