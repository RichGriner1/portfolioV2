"use client";

import { CaseStudyBento } from "@/components/case-study-bento";
import { BackLink } from "@/components/back-link";
import { HyperText } from "@/components/magicui/hyper-text";
import { MoreWork } from "@/components/more-work";
import type { CaseStudy } from "@/lib/content/case-studies";
import { type WorkItem, formatYears } from "@/lib/content/work";
import { pick, t, useLang } from "@/lib/i18n";

type Props = {
  item: WorkItem;
  study: CaseStudy | undefined;
};

export function CaseStudyPage({ item, study }: Props) {
  const { lang } = useLang();
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 pt-8 pb-24 sm:pt-12">
      {/* mb-0: this main already gaps 64px, which is the target. */}
      <BackLink className="mb-0" />

      {study ? (
        <>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  {formatYears(item)}
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
                {/* The project name scrambles; the tagline beside it doesn't. Two
                    runs of different lengths in one heading resolve at different
                    moments and the h1 reads as two competing animations — and the
                    name is the part that changes least between languages, so it's
                    where the effect is doing work. */}
                <HyperText>{pick(item.title, lang)}</HyperText>{" "}
                <span className="text-muted-foreground font-normal">
                  — {pick(study.tagline, lang)}
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-6">
              {/* Split on blank lines: an intro is written in beats, and squeezing
                  three of them into one paragraph is how a context section turns into
                  a wall. The field stays a single string so the content file reads as
                  prose rather than an array. */}
              <div className="flex flex-col gap-4">
                {pick(study.intro, lang)
                  .split(/\n\s*\n/)
                  .map((para, i) => (
                    <p
                      key={i}
                      className="text-foreground text-base leading-relaxed"
                    >
                      {para.trim()}
                    </p>
                  ))}
              </div>
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

          <MoreWork excludeSlug={item.slug} limit={3} />
        </>
      ) : (
        <>
          <header className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {formatYears(item)}
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
              <HyperText>{pick(item.title, lang)}</HyperText>
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
