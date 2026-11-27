"use client";

import type { ReactNode } from "react";

import { IntroPreviewLink } from "@/components/intro-preview-link";
import { HEADLINE, SUBTITLE } from "@/lib/content/intro";
import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Inline case-study links inside the intro: dotted underline, emphasis ink, and
// the linked project's thumbnail on hover (see intro-preview-link.tsx).
// "a brand" → Mindfulme, "a workflow" → loops.

// Intro copy, under the same headline the canvas opens with (see IntroHeadline).
// Iterated with Richard directly, no "final" marker, because this keeps
// improving. The first two paragraphs are the canvas subtitle, so the two layouts
// say the same thing in the same words; the current role rides on the first one
// because "where do they work now" is the question a recruiter scans for.
const INTRO: Bilingual<ReactNode[]> = {
  en: [
    <>
      <span className="text-foreground">{SUBTITLE.en.positioning}</span>
      {
        " Right now that means fintech products for Spanish banks and design systems at Afi."
      }
    </>,
    SUBTITLE.en.perspective,
    <>
      {
        "Working across banks, startups, and on both B2B and B2C products, I learned that "
      }
      <em>design is a mindset</em>
      {", not just a profession."}
    </>,
    "Because of that, I approach every project the same way. Understand, build, test, iterate.",
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
    // "Tras trabajar con…", "abordar" rather than "enfocar", and "onboarding"
    // left untranslated are deliberate Peninsular choices from the afi-redaccion
    // pass; the reader is technical and there's no clean equivalent.
    <>
      <span className="text-foreground">{SUBTITLE.es.positioning}</span>
      {
        // TODO(afi-redaccion)
        " Ahora mismo trabajo en productos fintech para bancos españoles y sistemas de diseño en Afi."
      }
    </>,
    SUBTITLE.es.perspective,
    <>
      {
        "Tras trabajar con bancos y startups, y en productos tanto B2B como B2C, he aprendido que "
      }
      <em>el diseño es una mentalidad</em>
      {", no solo una profesión."}
    </>,
    // TODO(afi-redaccion)
    "Por eso abordo cada proyecto de la misma manera. Entender, construir, probar, iterar.",
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
 * The canvas claim, without the scramble: name in muted ink, claim in full. It's
 * the one line a visitor who reads nothing else should leave with, so it's the
 * only thing in the tile above the body size.
 */
export function IntroHeadline({ className }: { className?: string }) {
  const { lang } = useLang();
  const { name, claim } = pick(HEADLINE, lang);
  return (
    <h1
      className={cn(
        "max-w-[18em] text-2xl font-medium tracking-tight text-balance",
        className
      )}
    >
      <span className="text-muted-foreground">{name}</span>
      <span className="text-foreground">{claim}</span>
    </h1>
  );
}

/**
 * One type size for the whole block, specified by Richard from Figma
 * (2026-08-05): Geist 14px / 17.5px (1.25) / -0.02% tracking. Arbitrary values
 * on purpose — measured from the design, and 14px/17.5px isn't a step on the
 * Tailwind scale. Figma states tracking as a percentage of font size, which
 * converts straight to `em` (-0.02% → -0.0002em).
 *
 * No lead size and no bold inside the body. The headline above carries the size
 * step; within the paragraphs hierarchy is color alone, the opening clause at
 * `--foreground` and everything after it at `--prose-body`.
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
