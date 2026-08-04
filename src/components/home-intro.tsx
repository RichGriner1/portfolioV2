"use client";

import type { ReactNode } from "react";

import { BlurFade } from "@/components/motion/blur-fade";
import { pick, useLang, type Bilingual } from "@/lib/i18n";

// Final copy from Richard, updated 2026-08-04 — supersedes Figma Story-architect 104:359. Do not rewrite.
// ES reviewed 2026-08-04 (afi-redaccion pass: la banca, generan, matutina, colon).
const INTRO: Bilingual<ReactNode[]> = {
  en: [
    "Hi, I'm Richard.",
    <>
      <strong>{"I'm a designer"}</strong>
      {", currently designing fintech products for Spanish banks and design systems at Afi."}
    </>,
    "Studying anthropology taught me to deeply understand the systems that create behavior. My master's in design opened my eyes to combining the two to improve people's lives and to how much design covers.",
    <em key="en-everything">Everything.</em>,
    "A morning routine, an onboarding, a brand, a team workflow, they are all designed.",
  ],
  es: [
    "Hola, soy Richard.",
    <>
      <strong>Soy diseñador</strong>
      {" y ahora mismo diseño productos fintech para bancos españoles y sistemas de diseño en Afi."}
    </>,
    "Estudiar antropología me enseñó a entender profundamente los sistemas que generan comportamiento. Mi máster en diseño me abrió los ojos a combinar ambas disciplinas para mejorar la vida de la gente y a todo lo que abarca el diseño.",
    <em key="es-todo">Todo.</em>,
    "Una rutina matutina, un onboarding, una marca, un flujo de trabajo de equipo: todo está diseñado.",
  ],
};

export function HomeIntro() {
  const { lang } = useLang();

  return (
    <section className="flex max-w-xl flex-col gap-4 pt-12 sm:pt-20">
      {pick(INTRO, lang).map((p, i) => (
        <BlurFade key={`${lang}-${i}`} delay={i * 0.08}>
          <p className="font-geist text-foreground leading-relaxed">{p}</p>
        </BlurFade>
      ))}
    </section>
  );
}
