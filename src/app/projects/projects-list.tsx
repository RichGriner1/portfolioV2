"use client";

import { WorkGrid } from "@/components/my-work";
import { BackLink } from "@/components/back-link";
import { MorphingText } from "@/components/magicui/morphing-text";
import { sortKey, WORK } from "@/lib/content/work";
import { pick, useLang, type Bilingual } from "@/lib/i18n";

// Every case study, newest first — including the ones the home shelf doesn't
// feature. Home curates; this page is the full list.
const ALL_PROJECTS = WORK.filter(
  (item) => item.kind === "case-study" && !item.hidden
).sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

const TITLE: Bilingual<string> = {
  en: "Projects",
  es: "Proyectos",
};

const INTRO: Bilingual<string> = {
  en: "Design systems, brand identities, and products shipped for banks, startups, and my own experiments.",
  es: "Sistemas de diseño, identidades de marca y productos entregados para bancos, startups y mis propios experimentos.",
};

export function ProjectsList() {
  const { lang } = useLang();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 pt-8 pb-24 sm:pt-12">
      <BackLink />

      <header className="flex flex-col gap-4">
        <h1 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          <MorphingText>{pick(TITLE, lang)}</MorphingText>
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
          {pick(INTRO, lang)}
        </p>
      </header>

      <WorkGrid items={ALL_PROJECTS} />
    </main>
  );
}
