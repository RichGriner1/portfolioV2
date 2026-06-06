"use client";

import { motion } from "motion/react";

import { pick, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const STAGGER = 0.08;

const HERO_EYEBROW: Bilingual<string> = {
  en: "Currently — Designing fintech products and design systems at Afi",
  // TODO(afi-redaccion)
  es: "Actualmente — Diseñando productos fintech y sistemas de diseño en Afi",
};

// TODO(afi-redaccion): polish ES copy
const HERO_TAGLINE: Bilingual<string> = {
  en: "Ship taste at scale",
  es: "Llevar el gusto a escala",
};

const HERO_SUBHEAD: Bilingual<string> = {
  en: "Designers are now builders. In order to create consistent products and workflows I focus on systems, building internal tools, and iterating on my design process.",
  // TODO(afi-redaccion)
  es: "Los diseñadores ahora somos builders. Para crear productos y flujos de trabajo consistentes, mi foco está en los sistemas, en construir herramientas internas y en iterar sobre mi proceso de diseño.",
};

export function Hero() {
  const { lang } = useLang();
  return (
    <section className="flex flex-col gap-5 pt-12 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
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
          <span
            aria-hidden="true"
            className="bg-primary size-1.5 shrink-0 rounded-full"
          />
          <span>{pick(HERO_EYEBROW, lang)}</span>
        </a>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER, ease: EASE }}
        className="font-display text-foreground text-6xl leading-tight font-bold tracking-tight text-balance sm:text-center sm:text-7xl lg:text-8xl"
      >
        {pick(HERO_TAGLINE, lang)}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 2, ease: EASE }}
        className="text-muted-foreground max-w-xl text-lg leading-relaxed sm:mx-auto sm:max-w-3xl sm:text-center"
      >
        {pick(HERO_SUBHEAD, lang)}
      </motion.p>
    </section>
  );
}
