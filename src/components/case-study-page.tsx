"use client";

import Link from "next/link";

import { CaseStudyBento } from "@/components/case-study-bento";
import type { CaseStudy } from "@/lib/content/case-studies";
import type { WorkItem } from "@/lib/content/work";
import { pick, t, useLang } from "@/lib/i18n";

type Props = {
  item: WorkItem;
  study: CaseStudy | undefined;
};

export function CaseStudyPage({ item, study }: Props) {
  const { lang } = useLang();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 pt-8 pb-24">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-wider uppercase transition-colors"
      >
        {t("work.back", lang)}
      </Link>

      {study ? (
        <>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {item.year}
              </div>
              <h1 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                {pick(item.title, lang)}{" "}
                <span className="text-muted-foreground font-normal">
                  — {pick(study.tagline, lang)}
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-foreground text-base leading-relaxed">
                {pick(study.intro, lang)}
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-base">
                  <span className="text-muted-foreground">
                    {t("work.role", lang)}:{" "}
                  </span>
                  {pick(study.role, lang)}
                </p>
                <p className="text-base">
                  <span className="text-muted-foreground">
                    {t("work.contribution", lang)}:{" "}
                  </span>
                  {study.contributions[lang].join(", ")}
                </p>
              </div>
            </div>
          </div>

          {study.confidential && (
            <p className="text-muted-foreground border-border rounded-lg border border-dashed px-4 py-3 text-sm">
              {pick(study.confidential, lang)}
            </p>
          )}

          <CaseStudyBento cards={study.bento} gallery={study.gallery} />
        </>
      ) : (
        <>
          <header className="flex flex-col gap-3">
            <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {item.year}
            </div>
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
              {pick(item.title, lang)}
            </h1>
          </header>
          <section className="border-border/60 text-muted-foreground rounded-xl border border-dashed p-8 text-sm">
            {t("work.coming_soon", lang)}
          </section>
        </>
      )}
    </main>
  );
}
