"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CaseStudyBento } from "@/components/case-study-bento";
import { CardMedia } from "@/components/work-card";
import type { CaseStudy } from "@/lib/content/case-studies";
import { WORK, type WorkItem } from "@/lib/content/work";
import { pick, t, useLang } from "@/lib/i18n";

type Props = {
  item: WorkItem;
  study: CaseStudy | undefined;
};

export function CaseStudyPage({ item, study }: Props) {
  const { lang } = useLang();
  const otherCaseStudies = WORK.filter(
    (w) => w.slug !== item.slug && !w.hidden && w.kind === "case-study"
  );

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
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  {item.year}
                </div>
                {item.ongoing && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    {t("work.ongoing", lang)}
                  </span>
                )}
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

          {otherCaseStudies.length > 0 && (
            <section className="border-border/60 flex flex-col gap-6 border-t pt-12">
              <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {t("work.more", lang)}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {otherCaseStudies.map((w) => (
                  <Link
                    key={w.slug}
                    href={w.href}
                    className="group border-border bg-card hover:border-foreground/30 flex items-center justify-between gap-4 rounded-2xl border p-5 transition-all hover:shadow-md"
                    style={
                      w.bgColor ? { backgroundColor: w.bgColor } : undefined
                    }
                  >
                    <div
                      className="border-border bg-card relative size-24 shrink-0 overflow-hidden rounded-xl border"
                      style={
                        w.bgColor ? { backgroundColor: w.bgColor } : undefined
                      }
                    >
                      <CardMedia item={w} lang={lang} />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-foreground font-display text-lg font-bold tracking-tight">
                        {pick(w.title, lang)}
                      </span>
                      <span className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {pick(w.description, lang)}
                      </span>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-foreground size-5 shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          <header className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {item.year}
              </div>
              {item.ongoing && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  {t("work.ongoing", lang)}
                </span>
              )}
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
