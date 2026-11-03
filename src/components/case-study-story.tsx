"use client";

import { useEffect, useRef, useState } from "react";

import type {
  StoryClip,
  StoryMedia,
  StoryOption,
  StorySection,
} from "@/lib/content/case-studies";
import { pick, useLang } from "@/lib/i18n";

/**
 * A silent looping clip that only plays while it's on screen.
 *
 * Autoplay-everything is how a page with six videos ends up decoding six streams at
 * once. The observer starts a clip when a third of it is visible and pauses it when
 * it leaves. With `prefers-reduced-motion` the clip stays on its poster and shows the
 * native controls instead, so motion is something the reader asks for.
 */
function LoopVideo({
  clip,
  label,
  className = "aspect-[8/5] h-auto w-full",
  showControls = true,
}: {
  clip: StoryClip;
  label: string;
  className?: string;
  showControls?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    if (reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      className={`bg-muted block object-cover ${className}`}
      src={clip.src}
      poster={clip.poster}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reduced && showControls}
      aria-label={label}
    />
  );
}

function Frame({ clip, tag }: { clip: StoryClip; tag?: string }) {
  const { lang } = useLang();
  const alt = pick(clip.alt, lang);
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      <div className="border-border bg-card relative overflow-hidden rounded-xl border">
        <LoopVideo clip={clip} label={alt} />
        {tag && (
          <span className="bg-background/90 text-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider uppercase backdrop-blur">
            {tag}
          </span>
        )}
      </div>
    </figure>
  );
}

function Media({ media }: { media: StoryMedia }) {
  const { lang } = useLang();
  const caption = media.caption ? pick(media.caption, lang) : null;
  return (
    <div className="flex flex-col gap-3">
      <Frame clip={media.clip} />
      {caption && (
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {caption}
        </p>
      )}
    </div>
  );
}

const OUTCOME_LABEL: Record<
  StoryOption["outcome"],
  { en: string; es: string }
> = {
  original: { en: "Original", es: "Original" },
  proposed: { en: "Proposed", es: "Propuesta" },
  chosen: { en: "Chosen", es: "Elegida" },
  merged: { en: "Folded in", es: "Integrada" },
  dropped: { en: "Dropped", es: "Descartada" },
  open: { en: "Open", es: "Abierta" },
};

const OUTCOME_STYLE: Record<StoryOption["outcome"], string> = {
  original: "bg-muted text-muted-foreground",
  proposed: "border-foreground text-foreground border",
  chosen: "bg-primary text-primary-foreground",
  merged: "bg-muted text-foreground",
  dropped: "bg-muted text-muted-foreground",
  open: "border-border text-muted-foreground border border-dashed",
};

/**
 * The directions on the table for a decision and what became of each. It sits between
 * the problem and the result so the reader sees the alternatives first. A row with a
 * clip is a button: pick a direction and the viewer under the list plays it, so the
 * options are compared by looking at each one rather than by a before and after.
 */
function Options({ options }: { options: StoryOption[] }) {
  const { lang } = useLang();
  const firstWithClip = options.findIndex((o) => o.clip);
  const [selected, setSelected] = useState(firstWithClip);
  const current = selected >= 0 ? options[selected] : undefined;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
        {lang === "es" ? "Direcciones estudiadas" : "Directions considered"}
      </p>
      <ul className="border-border divide-border divide-y overflow-hidden rounded-xl border">
        {options.map((o, i) => {
          const row = (
            <>
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase ${OUTCOME_STYLE[o.outcome]}`}
              >
                {pick(OUTCOME_LABEL[o.outcome], lang)}
              </span>
              <span
                className={`text-sm font-semibold ${
                  o.outcome === "dropped"
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {pick(o.name, lang)}
              </span>
              <span className="text-muted-foreground text-sm leading-relaxed">
                {pick(o.note, lang)}
              </span>
            </>
          );
          const grid =
            "grid w-full grid-cols-1 items-baseline gap-x-6 gap-y-1 px-4 py-3 text-left sm:grid-cols-[7.5rem_minmax(0,14rem)_minmax(0,1fr)]";
          return (
            <li key={i}>
              {o.clip ? (
                <button
                  type="button"
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
                  className={`${grid} hover:bg-muted/60 cursor-pointer transition-colors ${
                    selected === i ? "bg-muted" : ""
                  }`}
                >
                  {row}
                </button>
              ) : (
                <div className={grid}>{row}</div>
              )}
            </li>
          );
        })}
      </ul>
      {current?.clip && <Frame key={current.clip.src} clip={current.clip} />}
    </div>
  );
}

export function CaseStudyStory({ sections }: { sections: StorySection[] }) {
  const { lang } = useLang();
  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      {sections.map((section, i) => {
        const decision = Boolean(section.kicker);
        const hasAfter = Boolean(section.media?.length || section.options);
        const first = hasAfter ? section.body.slice(0, 1) : section.body;
        const rest = hasAfter ? section.body.slice(1) : [];
        return (
          <section
            key={i}
            className="flex flex-col gap-8"
            aria-labelledby={`story-${i}`}
          >
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
              <div className="flex flex-col gap-3">
                {decision && (
                  <span className="bg-foreground text-background w-fit rounded-full px-3 py-1 font-mono text-[10px] font-medium tracking-wider uppercase">
                    {pick(section.kicker!, lang)}
                  </span>
                )}
                <h2
                  id={`story-${i}`}
                  className={
                    decision
                      ? "font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
                      : "font-display text-xl leading-tight font-bold tracking-tight sm:text-2xl"
                  }
                >
                  {pick(section.heading, lang)}
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                {first.map((para, j) => (
                  <p
                    key={j}
                    className="text-foreground text-base leading-relaxed"
                  >
                    {pick(para, lang)}
                  </p>
                ))}
              </div>
            </div>
            {section.options && <Options options={section.options} />}
            {section.media?.map((m, k) => (
              <Media key={k} media={m} />
            ))}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div className="hidden md:block" aria-hidden="true" />
                <div className="flex flex-col gap-4">
                  {rest.map((para, j) => (
                    <p
                      key={j}
                      className="text-foreground text-base leading-relaxed"
                    >
                      {pick(para, lang)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
