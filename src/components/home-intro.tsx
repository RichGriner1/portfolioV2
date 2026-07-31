"use client";

import { BlurFade } from "@/components/motion/blur-fade";
import { pick, useLang, type Bilingual } from "@/lib/i18n";

// Final copy from Richard (Figma: Story-architect 104:359) — do not rewrite.
// ES is a first-pass translation of Richard's EN — reviewed copy welcome.
const INTRO: Bilingual<string[]> = {
  en: [
    "Hi, I'm Richard. I'm a designer. Currently designing fintech products for Spanish banks and design systems at Afi.",
    "Coming from anthropology, I look for the deeper meaning of things and the systems that create behavior.",
    "My master's in design opened my eyes to combining the two to improve people's lives and to how much design covers. A morning routine, a workflow, onboarding, a brand. Everything.",
    "I feel like a superhero with AI. Now I can document how I incorporate both in everything I do, not just a few UX/UI projects.",
  ],
  es: [
    "Hola, soy Richard. Soy diseñador. Ahora mismo diseño productos fintech para banca española y sistemas de diseño en Afi.",
    "Vengo de la antropología: busco el significado profundo de las cosas y los sistemas que crean comportamiento.",
    "El máster en diseño me abrió los ojos a combinar las dos cosas para mejorar la vida de la gente, y a todo lo que abarca el diseño. Una rutina de mañana, un flujo de trabajo, un onboarding, una marca. Todo.",
    "Con la IA me siento un superhéroe. Ahora puedo documentar cómo incorporo ambas en todo lo que hago, no solo en unos pocos proyectos de UX/UI.",
  ],
};

export function HomeIntro() {
  const { lang } = useLang();

  return (
    <section className="flex max-w-xl flex-col gap-4 pt-12 sm:pt-20">
      {pick(INTRO, lang).map((p, i) => (
        <BlurFade key={p.slice(0, 24)} delay={i * 0.08}>
          <p className="font-geist text-foreground leading-relaxed">{p}</p>
        </BlurFade>
      ))}
    </section>
  );
}
