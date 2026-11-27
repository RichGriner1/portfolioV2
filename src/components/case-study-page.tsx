"use client";

import { CaseStudyBento } from "@/components/case-study-bento";
import { CaseStudyStory } from "@/components/case-study-story";
import { BackLink } from "@/components/back-link";
import { HyperText } from "@/components/magicui/hyper-text";
import { MoreWork } from "@/components/more-work";
import type { CaseStudy } from "@/lib/content/case-studies";
import type { RenderedDiagrams } from "@/lib/content/diagrams";
import { type WorkItem, formatYears } from "@/lib/content/work";
import { pick, t, useLang } from "@/lib/i18n";

type Props = {
  item: WorkItem;
  study: CaseStudy | undefined;
  diagrams: RenderedDiagrams;
};

export function CaseStudyPage({ item, study, diagrams }: Props) {
  const { lang } = useLang();
  // The beats layout (house standard, after rows.gg) reads calmer: a narrower column
  // and smaller type. Other studies keep the wide layout.
  const beats = study?.layout === "beats";
  return (
    <main
      className={`mx-auto flex w-full flex-1 flex-col gap-16 px-6 pt-8 pb-24 sm:pt-12 ${beats ? "max-w-[1028px]" : "max-w-5xl"}`}
    >
      {/* mb-0: this main already gaps 64px, which is the target. */}
      <BackLink className="mb-0" />

      {study ? (
        <>
          <div
            className={
              beats
                ? "flex flex-col gap-5"
                : study.story
                  ? "flex flex-col gap-10"
                  : "grid grid-cols-1 gap-10 sm:grid-cols-2"
            }
          >
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
              <h1
                className={
                  beats
                    ? "font-display max-w-[720px] text-[28px] leading-[1.1] font-medium tracking-[-0.03em] text-balance sm:text-[32px]"
                    : study.story
                      ? "font-display text-4xl leading-tight font-bold tracking-tight sm:text-6xl"
                      : "font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
                }
              >
                {/* The project name scrambles; the tagline beside it doesn't. Two
                    runs of different lengths in one heading resolve at different
                    moments and the h1 reads as two competing animations — and the
                    name is the part that changes least between languages, so it's
                    where the effect is doing work.

                    Keyed on `lang` because a project name is often the same string
                    in both languages — Mindfulme, KnowThyself360 — and HyperText
                    replays on a `children` change. Without the key those two titles
                    sat still through a language switch while every other one ran,
                    which reads as the effect being broken rather than absent. */}
                <HyperText key={lang}>{pick(item.title, lang)}</HyperText>
                <span className="text-muted-foreground font-normal">
                  {": "}
                  {pick(study.tagline, lang)}
                </span>
              </h1>
            </div>

            <div
              className={
                beats
                  ? "flex max-w-2xl flex-col gap-5"
                  : study.story
                    ? "flex max-w-2xl flex-col gap-6"
                    : "flex flex-col gap-6"
              }
            >
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
                      className={
                        beats
                          ? "text-foreground text-[14px] leading-[1.6]"
                          : "text-foreground text-base leading-relaxed"
                      }
                    >
                      {para.trim()}
                    </p>
                  ))}
              </div>
              {/* Beats: the meta (role, contribution) sits right under the title, as facts
                  to scan; the intro follows. */}
              <div
                className={
                  beats
                    ? "text-muted-foreground order-first flex flex-col gap-1 pb-2"
                    : "flex flex-col gap-2"
                }
              >
                <p className={beats ? "text-[13px]" : "text-base"}>
                  <span className="text-muted-foreground">
                    {t("work.role", lang)}:{" "}
                  </span>
                  {pick(study.role, lang)}
                </p>
                <p className={beats ? "text-[13px]" : "text-base"}>
                  <span className="text-muted-foreground">
                    {t("work.contribution", lang)}:{" "}
                  </span>
                  {study.contributions[lang].join(", ")}
                </p>
              </div>
              {study.demo && (
                <div className={beats ? "pt-3" : undefined}>
                  <DemoActions href={`/work/${item.slug}/demo`} />
                </div>
              )}
            </div>
          </div>

          {study.confidential && (
            <p className="text-muted-foreground border-border rounded-lg border border-dashed px-4 py-3 text-sm">
              {pick(study.confidential, lang)}
            </p>
          )}

          {study.story ? (
            <div id="story" className="flex scroll-mt-28 flex-col gap-24">
              <CaseStudyStory
                sections={study.story}
                nav={study.nav}
                beats={study.layout === "beats"}
              />
              {study.demo && (
                <div className="flex max-w-xl flex-col gap-6">
                  {study.closing && (
                    <p className="text-foreground text-[15px] leading-[1.55]">
                      {pick(study.closing, lang)}
                    </p>
                  )}
                  <DemoActions href={`/work/${item.slug}/demo`} story={false} />
                </div>
              )}
            </div>
          ) : (
            <CaseStudyBento
              cards={study.bento}
              gallery={study.gallery}
              diagrams={diagrams}
            />
          )}

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
              <HyperText key={lang}>{pick(item.title, lang)}</HyperText>
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

/**
 * The two ways into a study, side by side: play with the thing, or read how it got
 * made. A case study is opened by someone deciding fast; the demo is the proof and the
 * story is for whoever wants the why.
 */
function DemoActions({
  href,
  story = true,
}: {
  href: string;
  story?: boolean;
}) {
  const { lang } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <a
        href={href}
        className="bg-foreground text-background focus-visible:ring-ring inline-flex items-center gap-2 rounded-[9px] px-[22px] py-3 text-[13px] font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]"
      >
        {lang === "es" ? "Probar la demo" : "Enjoy the demo"}
        <span aria-hidden="true">→</span>
      </a>
      {story && (
        <a
          href="#story"
          className="text-foreground inline-flex items-center gap-2 text-[13px] font-medium hover:underline hover:underline-offset-4"
        >
          {lang === "es" ? "Leer la historia" : "Read the story"}
          <span aria-hidden="true">↓</span>
        </a>
      )}
    </div>
  );
}
