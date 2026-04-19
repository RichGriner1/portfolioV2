"use client";

import { motion } from "motion/react";
import { CvModal } from "@/components/cv-modal";

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
    <section className="flex flex-col gap-5 pt-12 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col gap-1"
      >
        <span className="text-foreground text-base font-normal">
          Richard Griner
        </span>
        <span className="text-muted-foreground text-sm">Updated Apr 2026</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER, ease: EASE }}
        className="text-foreground max-w-xl text-base leading-relaxed"
      >
        I grew up in Washington, DC and now live in Madrid.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 2, ease: EASE }}
        className="text-foreground max-w-xl text-base leading-relaxed"
      >
        I work at{" "}
        <a href="https://www.afi.es" className="underline underline-offset-4">
          Afi
        </a>
        , a financial consultancy in Spain, building AI-powered design systems
        and fintech products for banks and financial institutions. Freelance, I
        do the same for founders and small teams — design systems, products, and
        the AI workflows that make both actually scale.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 3, ease: EASE }}
        className="text-foreground max-w-xl text-base leading-relaxed"
      >
        Design lets you understand someone&apos;s universe and build solutions
        that create real collaboration and work that moves the needle. AI means
        that level of craft is no longer reserved for companies with big teams
        and bigger budgets — and that&apos;s the part I find most exciting.
      </motion.p>

      <motion.nav
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 4, ease: EASE }}
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
          href="mailto:richardgrinerdesigns@gmail.com"
          className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
        >
          Email
        </a>
        <CvModal />
      </motion.nav>
    </section>
  );
}
