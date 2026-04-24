"use client";

import { motion } from "motion/react";

import { CvModal } from "@/components/cv-modal";
import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const STAGGER = 0.08;

const HERO_P1: Bilingual<string> = {
  en: "Born and raised in Washington, DC — now I call Madrid home.",
  es: "Nací y crecí en Washington, DC — ahora Madrid es mi hogar.",
};

const HERO_P3: Bilingual<string> = {
  en: "Design creates real differences when it starts by truly understanding someone's universe — what makes each person different is exactly what I'm looking for. Before AI, that depth of craft was reserved for companies with big teams and bigger budgets. Now it isn't, and that's the part I find most exciting.",
  es: "El diseño crea diferencias reales cuando empieza por entender de verdad el universo de alguien — lo que hace única a cada persona es justo lo que busco. Antes de la IA, ese nivel de oficio estaba reservado para empresas con grandes equipos y presupuestos mayores. Ya no es así, y esa es la parte que más me entusiasma.",
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
        transition={{ duration: 0.5, delay: STAGGER, ease: EASE }}
        className="text-foreground max-w-xl text-base leading-relaxed"
      >
        {pick(HERO_P1, lang)}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: STAGGER * 2, ease: EASE }}
        className="text-foreground max-w-xl text-base leading-relaxed"
      >
        {lang === "en" ? (
          <>
            I work at{" "}
            <a
              href="https://www.afi.es"
              className="underline underline-offset-4"
            >
              Afi
            </a>
            , a financial consultancy in Spain, building AI-powered design
            systems and fintech products for banks and financial institutions.
            Freelance, I do the same for founders and small teams — design
            systems, products, and the AI workflows that make both actually
            scale.
          </>
        ) : (
          <>
            Trabajo en{" "}
            <a
              href="https://www.afi.es"
              className="underline underline-offset-4"
            >
              Afi
            </a>
            , una consultora financiera en España, construyendo sistemas de
            diseño impulsados por IA y productos fintech para bancos e
            instituciones financieras. Como freelance, hago lo mismo para
            founders y equipos pequeños — sistemas de diseño, productos y los
            flujos de IA que hacen que ambos escalen de verdad.
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
