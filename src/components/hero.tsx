"use client";

import { motion } from "motion/react";

import { CvModal } from "@/components/cv-modal";
import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const STAGGER = 0.08;

const HERO_P3: Bilingual<string> = {
  en: "I believe great design starts by understanding someone's world. Before AI, that took time and money most businesses didn't have. Now it doesn't.",
  es: "Creo que el gran diseño empieza por entender el mundo de alguien. Antes de la IA, eso requería tiempo y dinero que la mayoría de las empresas no tenía. Ahora no.",
};

export function Hero() {
  const { lang } = useLang();
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
        <span className="text-muted-foreground text-sm">
          {t("hero.updated", lang)}
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 2, ease: EASE }}
        className="text-foreground max-w-xl text-base leading-relaxed"
      >
        {lang === "en" ? (
          <>
            Currently building AI-powered design systems and fintech products
            for banks and financial institutions at{" "}
            <a
              href="https://www.afi.es"
              className="underline underline-offset-4"
            >
              Afi
            </a>
            , and freelancing — building AI systems, workflows, and products
            for small teams.
          </>
        ) : (
          <>
            Actualmente construyendo sistemas de diseño impulsados por IA y
            productos fintech para bancos e instituciones financieras en{" "}
            <a
              href="https://www.afi.es"
              className="underline underline-offset-4"
            >
              Afi
            </a>
            , y como freelance — construyendo sistemas de IA, flujos de trabajo
            y productos para equipos pequeños.
          </>
        )}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 3, ease: EASE }}
        className="text-foreground max-w-xl text-base leading-relaxed"
      >
        {pick(HERO_P3, lang)}
      </motion.p>

      <motion.nav
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 4, ease: EASE }}
        aria-label="Social links"
        className="text-muted-foreground flex flex-wrap gap-4 text-sm"
      >
        <a
          href="https://www.linkedin.com/in/richardgriner"
          className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {t("nav.linkedin", lang)}
        </a>
        <a
          href="mailto:richardgrinerdesigns@gmail.com"
          className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {t("nav.email", lang)}
        </a>
        <CvModal />
      </motion.nav>
    </section>
  );
}
