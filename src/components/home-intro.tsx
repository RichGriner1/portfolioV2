"use client";

import type { ReactNode } from "react";

import { IntroPreviewLink } from "@/components/intro-preview-link";
import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Inline case-study links inside the intro: dotted underline, emphasis ink, and
// the linked project's thumbnail on hover (see intro-preview-link.tsx).
// "a brand" → Mindfulme, "a workflow" → loops.

// Intro copy. Iterated with Richard directly — no "final" marker, because this
// keeps improving. Reference: Figma 3340:17900.
//
// 2026-08-05, after a teammate's read: paragraph two used to be two clauses
// about schooling, which read as credentials rather than method. And the closer
// used to end "they are all designed" — a claim about the world, when the point
// is that Richard brings a design mindset to things that don't arrive designed.
// Both now say the mindset thing outright.
//
// The italic "Everything." pivot is gone: the new third paragraph already says
// "I approach everything the same way", so the standalone line repeated the word
// and no longer answered anything. The closing list survives as a fragment —
// it's the concrete part, and it carries the two preview links.
const INTRO: Bilingual<ReactNode[]> = {
  en: [
    <>
      <span className="text-foreground">{"I'm Richard, a designer"}</span>
      {
        " currently working on fintech products for Spanish banks and design systems at Afi."
      }
    </>,
    "Anthropology taught me to understand behavior. Design gave me the tools to build experiences that fit it.",
    <>
      {
        "Working across banks, startups, and on both B2B and B2C products, I learned that "
      }
      <em>design is a mindset</em>
      {", not just a profession."}
    </>,
    "Because of that I approach everything the same way: understand, build, test, and iterate.",
    <>
      {"A morning routine, an onboarding, "}
      <IntroPreviewLink slug="mindfulme">a brand</IntroPreviewLink>
      {", "}
      <IntroPreviewLink slug="loops-and-skills-are-components">
        a workflow
      </IntroPreviewLink>
      {"."}
    </>,
  ],
  es: [
    // ES reviewed 2026-08-05 (afi-redaccion pass). Three fixes, all calques:
    // "Trabajando con…" → "Tras trabajar con…" (sentence-initial gerund is an
    // English construction, not Peninsular); "lo enfoco todo" → "lo abordo todo"
    // ("enfocar" means to focus, not to approach — that's "abordar"); and the
    // mixed prepositions in the bancos/startups/productos list.
    // "onboarding" stays: no clean Spanish equivalent, and the reader is technical.
    <>
      <span className="text-foreground">{"Soy Richard, diseñador."}</span>
      {
        " Ahora mismo trabajo en productos fintech para bancos españoles y sistemas de diseño en Afi."
      }
    </>,
    "La antropología me enseñó a entender el comportamiento. El diseño me dio las herramientas para crear experiencias que encajen con él.",
    <>
      {
        "Tras trabajar con bancos y startups, y en productos tanto B2B como B2C, he aprendido que "
      }
      <em>el diseño es una mentalidad</em>
      {", no solo una profesión."}
    </>,
    "Por eso lo abordo todo igual: entender, construir, probar e iterar.",
    <>
      {"Una rutina matutina, un onboarding, "}
      <IntroPreviewLink slug="mindfulme">una marca</IntroPreviewLink>
      {", "}
      <IntroPreviewLink slug="loops-and-skills-are-components">
        un flujo de trabajo
      </IntroPreviewLink>
      {"."}
    </>,
  ],
};

/**
 * One type size for the whole block, specified by Richard from Figma
 * (2026-08-05): Geist 14px / 17.5px (1.25) / -0.02% tracking. Arbitrary values
 * on purpose — measured from the design, and 14px/17.5px isn't a step on the
 * Tailwind scale. Figma states tracking as a percentage of font size, which
 * converts straight to `em` (-0.02% → -0.0002em).
 *
 * There is deliberately no lead size and no bold. Hierarchy is carried by colour
 * alone: the opening clause sits at `--foreground`, everything after it at
 * `--prose-body`. Size and weight steps were tried and removed — three signals
 * doing one job.
 */
const INTRO_BODY = "text-[14px] leading-[17.5px] tracking-[-0.0002em]";

/**
 * Prose ink. Paragraphs default to `--prose-body`; the opening clause and the
 * inline links opt up to `--foreground` themselves. Semantic tokens, so the ramp
 * inverts in dark rather than pinning a hex.
 */
const PROSE = "text-prose-body";

// The intro copy. `HomeIntro` — the standalone stacked section this file used to
// export — was deleted on 2026-08-05 when the bento replaced it; the copy itself
// and this renderer are what the bento consumes.
export function IntroParagraphs({ className }: { className?: string }) {
  const { lang } = useLang();
  return (
    <>
      {pick(INTRO, lang).map((p, i) => (
        <p key={`${lang}-${i}`} className={cn(className, INTRO_BODY, PROSE)}>
          {p}
        </p>
      ))}
    </>
  );
}
