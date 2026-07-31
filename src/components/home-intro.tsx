"use client";

import { motion } from "motion/react";

import { pick, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const; // mirrors --ease-out-soft

// Final copy from Richard (Figma: Story-architect 104:359) — do not rewrite.
// TODO(afi-redaccion)
const INTRO: Bilingual<string[]> = {
  en: [
    "Hi, I'm Richard. I'm a designer. Currently designing fintech products for Spanish banks and design systems at Afi.",
    "Coming from anthropology, I look for the deeper meaning of things and the systems that create behavior.",
    "My master's in design opened my eyes to combining the two to improve people's lives and to how much design covers. A morning routine, a workflow, onboarding, a brand. Everything.",
    "I feel like a superhero with AI. Now I can document how I incorporate both in everything I do, not just a few UX/UI projects.",
  ],
  es: [
    "Hi, I'm Richard. I'm a designer. Currently designing fintech products for Spanish banks and design systems at Afi.",
    "Coming from anthropology, I look for the deeper meaning of things and the systems that create behavior.",
    "My master's in design opened my eyes to combining the two to improve people's lives and to how much design covers. A morning routine, a workflow, onboarding, a brand. Everything.",
    "I feel like a superhero with AI. Now I can document how I incorporate both in everything I do, not just a few UX/UI projects.",
  ],
};

export function HomeIntro() {
  const { lang } = useLang();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex max-w-xl flex-col gap-4 pt-12 sm:pt-20"
    >
      {pick(INTRO, lang).map((p) => (
        <p
          key={p.slice(0, 24)}
          className="font-geist text-foreground leading-relaxed"
        >
          {p}
        </p>
      ))}
    </motion.section>
  );
}
