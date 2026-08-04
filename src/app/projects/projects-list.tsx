"use client";

import Link from "next/link";

import { WorkGrid } from "@/components/my-work";
import { sortKey, WORK } from "@/lib/content/work";
import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 pt-12 pb-24 sm:pt-20">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground w-fit font-mono text-xs tracking-wider uppercase transition-colors"
      >
        {t("work.back", lang)}
      </Link>

      <header className="flex flex-col gap-4">
        <h1 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          {pick(TITLE, lang)}
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
          {pick(INTRO, lang)}
        </p>
      </header>

      <WorkGrid items={ALL_PROJECTS} />
    </main>
  );
}
