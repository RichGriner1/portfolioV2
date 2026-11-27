"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type {
  StoryClip,
  StoryMapColumn,
  StoryMedia,
  StoryOption,
  StorySection,
  StoryStep,
} from "@/lib/content/case-studies";
import { Artboard } from "@/components/case-study-artboards";
import { SegmentPill } from "@/components/segment-pill";
import { pick, useLang } from "@/lib/i18n";

/**
 * True inside a beat (the half-width visual column of the "beats" layout). Visuals read
 * it to pick their compact form: a pair becomes one frame with a Before / After toggle,
 * a map stacks, the scale and the stats drop to their phone layout.
 */
const BeatContext = createContext(false);

/**
 * A silent looping clip that only plays while it's on screen.
 *
 * Autoplay-everything is how a page with six videos ends up decoding six streams at
 * once. The observer starts a clip when a third of it is visible and pauses it when
 * it leaves. With `prefers-reduced-motion` the clip stays on its poster and shows the
 * native controls instead, so motion is something the reader asks for.
 */
export function LoopVideo({
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
  // Inside a beat a clip keeps its own shape: the crops there are cut to one element.
  const beat = useContext(BeatContext);
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      <div className="border-border bg-card relative overflow-hidden rounded-xl border">
        {/* A still (.png/.jpg/.webp) renders as an image at its own aspect ratio;
            anything else is a looping clip. Screenshots of a shipped version
            have nothing to play. */}
        {/\.(png|jpe?g|webp)$/i.test(clip.src) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={clip.src}
            alt={alt}
            loading="lazy"
            className="bg-muted block h-auto w-full"
          />
        ) : (
          <LoopVideo
            clip={clip}
            label={alt}
            className={beat ? "block h-auto w-full" : undefined}
          />
        )}
        {tag && (
          <span className="bg-background/90 text-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-medium backdrop-blur">
            {tag}
          </span>
        )}
      </div>
    </figure>
  );
}

function Media({ media }: { media: StoryMedia }) {
  const { lang } = useLang();
  const beat = useContext(BeatContext);
  if (media.kind === "steps")
    return <Steps steps={media.steps} stepWord={media.stepWord} />;
  if (media.kind === "map") return <MapDiagram media={media} />;
  if (media.kind === "pair") return <Pair media={media} />;
  if (media.kind === "scale") return <Scale media={media} />;
  if (media.kind === "stats") return <Stats media={media} />;
  if (media.kind === "embed") return <Embed media={media} />;
  if (media.kind === "composition")
    return (
      <div className={`flex flex-col ${beat ? "" : "gap-3"}`}>
        <Composition media={media} />
        {media.legend && (
          <ol
            className={`flex flex-col gap-1 text-xs leading-relaxed ${beat ? "px-7 pb-7 text-[#4f5761]" : "text-muted-foreground"}`}
          >
            {media.legend.map((l, k) => (
              <li key={k} className="flex gap-2">
                <span
                  className={`inline-flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[9px] ${beat ? "bg-[#062D3F] text-white" : "bg-foreground text-background"}`}
                >
                  {k + 1}
                </span>
                {pick(l, lang)}
              </li>
            ))}
          </ol>
        )}
        {media.caption && (
          <p
            className={`max-w-2xl leading-relaxed ${beat ? "px-7 pb-7 text-xs text-[#4f5761]" : "text-muted-foreground text-sm"}`}
          >
            {pick(media.caption, lang)}
          </p>
        )}
      </div>
    );
  if (media.kind === "live")
    return (
      <div className="flex flex-col gap-3">
        <LiveCrop media={media} />
        {media.caption && (
          <p
            className={`max-w-2xl leading-relaxed ${beat ? "px-7 pb-7 text-xs text-[#4f5761]" : "text-muted-foreground text-sm"}`}
          >
            {pick(media.caption, lang)}
          </p>
        )}
      </div>
    );
  if (media.kind === "artboard")
    return (
      <div className="flex flex-col gap-3">
        {/* Artboards draw the product, which is light whatever the site theme is,
            the same as the screenshots and clips beside them. */}
        <div className="rounded-[10px] bg-[#eceeef] p-4 sm:p-5">
          <Artboard name={media.name} />
        </div>
        {media.caption && (
          <p
            className={`max-w-2xl leading-relaxed ${beat ? "px-7 pb-7 text-xs text-[#4f5761]" : "text-muted-foreground text-sm"}`}
          >
            {pick(media.caption, lang)}
          </p>
        )}
      </div>
    );
  const caption = media.caption ? pick(media.caption, lang) : null;
  return (
    <div className="flex flex-col gap-3">
      <Frame clip={media.clip} />
      {caption && (
        <p
          className={`max-w-2xl leading-relaxed ${beat ? "px-7 pb-7 text-xs text-[#4f5761]" : "text-muted-foreground text-sm"}`}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

/** Arrow keys move along a row of tabs, as a tablist should; Home and End jump. */
function useRovingKeys(
  count: number,
  current: number,
  select: (i: number) => void
) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (current + 1) % count;
    else if (e.key === "ArrowLeft") next = (current - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    refs.current[next]?.focus();
  };
  return { refs, onKeyDown };
}

/**
 * The versions of one screen as a horizontal segmented control, the screen under it.
 * The one we kept carries a small "Kept" tag, so the reader sees the outcome
 * without a legend.
 */
function Variants({ step }: { step: StoryStep }) {
  const { lang } = useLang();
  const id = useId();
  const [v, setV] = useState(0);
  const { refs, onKeyDown } = useRovingKeys(step.variants.length, v, setV);
  const current = step.variants[v];
  const note = current.note ? pick(current.note, lang) : null;
  return (
    <div className="flex flex-col gap-3">
      {step.variants.length > 1 && (
        <div
          role="tablist"
          aria-label={lang === "es" ? "Versiones" : "Versions"}
          onKeyDown={onKeyDown}
          className="border-border bg-muted/40 flex w-fit max-w-full flex-wrap gap-1 rounded-xl border p-1"
        >
          {step.variants.map((x, k) => (
            <button
              key={k}
              ref={(el) => {
                refs.current[k] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-v${k}`}
              aria-selected={k === v}
              aria-controls={`${id}-vp`}
              tabIndex={k === v ? 0 : -1}
              onClick={() => setV(k)}
              className={`focus-visible:ring-ring relative isolate inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                k === v
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k === v && (
                <SegmentPill
                  group={id}
                  className="bg-background rounded-lg shadow-sm"
                />
              )}
              {pick(x.label, lang)}
              {x.chosen && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[9px]">
                  {lang === "es" ? "Elegida" : "Kept"}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      <div
        role={step.variants.length > 1 ? "tabpanel" : undefined}
        id={`${id}-vp`}
        aria-labelledby={step.variants.length > 1 ? `${id}-v${v}` : undefined}
        className="flex flex-col gap-3"
      >
        {note && (
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            {note}
          </p>
        )}
        <Frame key={current.clip.src} clip={current.clip} />
      </div>
    </div>
  );
}

/**
 * Iterations that switch in place. A long scroll of screens loses the reader ("why am
 * I seeing a different page?"), so each step leads with its reasoning and keeps its
 * screens under one segmented control. Tabs scroll sideways on a phone instead of
 * widening the page.
 */
function Steps({
  steps,
  stepWord,
}: {
  steps: StoryStep[];
  stepWord?: { en: string; es: string };
}) {
  const { lang } = useLang();
  const id = useId();
  const [i, setI] = useState(0);
  const { refs, onKeyDown } = useRovingKeys(steps.length, i, setI);
  const step = steps[i];
  const word = stepWord
    ? pick(stepWord, lang)
    : lang === "es"
      ? "Paso"
      : "Step";
  return (
    <div className="flex flex-col gap-8">
      {steps.length > 1 && (
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <div
            role="tablist"
            aria-label={word}
            onKeyDown={onKeyDown}
            className="border-border flex min-w-max gap-1 rounded-xl border p-1"
          >
            {steps.map((s, k) => (
              <button
                key={k}
                ref={(el) => {
                  refs.current[k] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-t${k}`}
                aria-selected={k === i}
                aria-controls={`${id}-p`}
                tabIndex={k === i ? 0 : -1}
                onClick={() => setI(k)}
                className={`focus-visible:ring-ring relative isolate flex min-w-[9.5rem] flex-1 flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                  k === i
                    ? "text-background"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {k === i && <SegmentPill group={id} className="rounded-lg" />}
                <span className="text-[10px] opacity-80">
                  {word} {k + 1}
                </span>
                <span className="text-sm leading-snug font-semibold">
                  {pick(s.label, lang)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div
        role={steps.length > 1 ? "tabpanel" : undefined}
        id={`${id}-p`}
        aria-labelledby={steps.length > 1 ? `${id}-t${i}` : undefined}
        className="flex flex-col gap-6"
      >
        {(step.title || step.body) && (
          <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div>
              {step.title && (
                <h3 className="font-display text-lg leading-tight font-bold tracking-tight sm:text-xl">
                  {pick(step.title, lang)}
                </h3>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {step.body?.map((para, j) => (
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
        <Variants key={i} step={step} />
      </div>
    </div>
  );
}

function MapColumn({
  col,
  layered,
}: {
  col: StoryMapColumn;
  layered?: boolean;
}) {
  const { lang } = useLang();
  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5">
      <p className="text-muted-foreground text-xs">{pick(col.title, lang)}</p>
      <ol className="flex flex-col gap-3">
        {col.groups.map((g, k) => (
          <li
            key={k}
            className={`flex flex-col gap-2 ${layered ? "border-border bg-muted/40 rounded-lg border p-3" : ""}`}
          >
            <span className="text-foreground flex items-baseline gap-2 text-sm font-semibold">
              {layered && (
                <span className="text-muted-foreground font-mono text-xs">
                  {k + 1}
                </span>
              )}
              {pick(g.name, lang)}
            </span>
            <span className="flex flex-wrap gap-1.5">
              {g.items.map((it, j) => (
                <span
                  key={j}
                  className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-xs leading-relaxed"
                >
                  {pick(it, lang)}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Where things were, where they went: two columns and an arrow, built from data. */
function MapDiagram({
  media,
}: {
  media: Extract<StoryMedia, { kind: "map" }>;
}) {
  const { lang } = useLang();
  const beat = useContext(BeatContext);
  return (
    <figure className="flex flex-col gap-3">
      <div
        className={`grid grid-cols-1 items-stretch gap-4 ${beat ? "" : "md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"}`}
      >
        <MapColumn col={media.before} />
        <div
          className="text-muted-foreground flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className={`size-6 rotate-90 ${beat ? "" : "md:rotate-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M4 12h16m-6-6 6 6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <MapColumn col={media.after} layered />
      </div>
      {media.caption && (
        <figcaption className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {pick(media.caption, lang)}
        </figcaption>
      )}
    </figure>
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
function Options({
  options,
  label,
}: {
  options: StoryOption[];
  label?: { en: string; es: string };
}) {
  const { lang } = useLang();
  const firstWithClip = options.findIndex((o) => o.clip);
  const [selected, setSelected] = useState(firstWithClip);
  const current = selected >= 0 ? options[selected] : undefined;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-xs">
        {label
          ? pick(label, lang)
          : lang === "es"
            ? "Direcciones estudiadas"
            : "Directions considered"}
      </p>
      <ul className="border-border divide-border divide-y overflow-hidden rounded-xl border">
        {options.map((o, i) => {
          const row = (
            <>
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-medium ${OUTCOME_STYLE[o.outcome]}`}
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

/**
 * A sticky list of the section names in the left margin, opt-in per study (`nav`).
 *
 * The page column is max-w-5xl, so the margin only has room for it from about
 * 1400 px; below that it's hidden and the sections stand on their own. It sits
 * outside the column (right-full) so it never narrows the text. The current
 * section is the one crossing the band 40 % down the viewport.
 */
function StoryNav({
  sections,
  wideFrom = 1400,
}: {
  sections: StorySection[];
  wideFrom?: 1200 | 1400;
}) {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = sections
      .map((_, i) => document.getElementById(`section-${i}`))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting)
            setActive(Number(e.target.getAttribute("data-index")));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);
  return (
    <nav
      aria-label={lang === "es" ? "Secciones" : "Sections"}
      className={`absolute top-0 right-full mr-12 hidden h-full w-44 ${wideFrom === 1200 ? "min-[1200px]:block" : "min-[1400px]:block"}`}
    >
      <ol className="sticky top-28 flex flex-col gap-1">
        {sections.map((s, i) => (
          <li key={i}>
            <a
              href={`#section-${i}`}
              aria-current={active === i ? "true" : undefined}
              // The last section cannot always scroll up into the band, so a click sets it.
              onClick={() => setTimeout(() => setActive(i), 900)}
              className={`flex gap-3 rounded-md py-1.5 text-sm leading-snug transition-colors ${
                active === i
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="w-5 shrink-0 font-mono text-xs leading-5 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{pick(s.navLabel ?? s.heading, lang)}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CaseStudyStory({
  sections,
  nav = false,
  beats = false,
}: {
  sections: StorySection[];
  nav?: boolean;
  beats?: boolean;
}) {
  const { lang } = useLang();
  if (beats) return <Beats sections={sections} nav={nav} />;
  return (
    <div className="relative flex flex-col gap-20 sm:gap-28">
      {nav && <StoryNav sections={sections} />}
      {sections.map((section, i) => {
        const decision = Boolean(section.kicker);
        const hasAfter = Boolean(section.media?.length || section.options);
        const first = hasAfter ? section.body.slice(0, 1) : section.body;
        const rest = hasAfter ? section.body.slice(1) : [];
        return (
          <section
            key={i}
            id={nav ? `section-${i}` : undefined}
            data-index={i}
            className="flex scroll-mt-28 flex-col gap-8"
            aria-labelledby={`story-${i}`}
          >
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
              <div className="flex flex-col gap-3">
                {decision && (
                  <span className="bg-foreground text-background w-fit rounded-full px-3 py-1 text-xs font-medium">
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
            {section.options && (
              <Options options={section.options} label={section.optionsLabel} />
            )}
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

/** Before and after, side by side on wide screens and stacked on a phone. */
function Pair({ media }: { media: Extract<StoryMedia, { kind: "pair" }> }) {
  const { lang } = useLang();
  const beat = useContext(BeatContext);
  if (beat) return <PairToggle media={media} />;
  return (
    <figure className="flex flex-col gap-3">
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <Frame clip={media.before} tag={lang === "es" ? "Antes" : "Before"} />
        <Frame clip={media.after} tag={lang === "es" ? "Después" : "After"} />
      </div>
      {media.caption && (
        <figcaption className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {pick(media.caption, lang)}
        </figcaption>
      )}
    </figure>
  );
}

/** Levels from quiet to loud. The bar grows with the level, so the ladder reads without the text. */
function Scale({ media }: { media: Extract<StoryMedia, { kind: "scale" }> }) {
  const { lang } = useLang();
  const beat = useContext(BeatContext);
  const n = media.levels.length;
  return (
    <figure className="flex flex-col gap-3">
      <ol className="border-border divide-border divide-y overflow-hidden rounded-xl border">
        {media.levels.map((l, k) => (
          <li
            key={k}
            className={`grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-4 gap-y-2 px-4 py-4 ${beat ? "" : "sm:grid-cols-[2rem_minmax(0,12rem)_minmax(0,1fr)_6rem] sm:items-center"}`}
          >
            <span className="text-muted-foreground font-mono text-sm tabular-nums">
              {k + 1}
            </span>
            <span className="text-foreground text-sm font-semibold">
              {pick(l.name, lang)}
            </span>
            <span
              className={`text-muted-foreground col-start-2 text-sm leading-relaxed ${beat ? "" : "sm:col-start-auto"}`}
            >
              {pick(l.note, lang)}
            </span>
            <span
              className={`bg-muted col-start-2 h-1.5 w-full overflow-hidden rounded-full ${beat ? "" : "sm:col-start-auto"}`}
              aria-hidden="true"
            >
              <span
                className="bg-foreground block h-full rounded-full"
                style={{ width: `${((k + 1) / n) * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ol>
      {media.caption && (
        <figcaption className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {pick(media.caption, lang)}
        </figcaption>
      )}
    </figure>
  );
}

function Stats({ media }: { media: Extract<StoryMedia, { kind: "stats" }> }) {
  const { lang } = useLang();
  const beat = useContext(BeatContext);
  return (
    <dl
      className={`bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl ${beat ? "" : "border-border border sm:grid-cols-4"}`}
    >
      {media.items.map((it, k) => (
        <div
          key={k}
          className={`bg-card flex flex-col gap-1 ${beat ? "p-6" : "p-5"}`}
        >
          <dt className="sr-only">{pick(it.label, lang)}</dt>
          <dd className="font-display text-foreground text-3xl font-bold tracking-tight tabular-nums">
            {it.value}
          </dd>
          <dd
            className="text-muted-foreground text-sm leading-snug"
            aria-hidden="true"
          >
            {pick(it.label, lang)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A live prototype, drawn at desktop size and scaled to the column. Loaded lazily, and
 * only once it's near the screen, because a prototype is megabytes of script. Below the
 * frame, a link opens it on its own page for a real play.
 */
function Embed({ media }: { media: Extract<StoryMedia, { kind: "embed" }> }) {
  const { lang } = useLang();
  const w = media.width ?? 1440;
  const h = media.height ?? 900;
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / w));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [w]);
  const title = pick(media.title, lang);
  return (
    <figure className="flex flex-col gap-3">
      <div
        ref={box}
        className="border-border bg-muted relative w-full overflow-hidden rounded-xl border"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        {near && scale > 0 && (
          <iframe
            src={media.src}
            title={title}
            loading="lazy"
            className="absolute top-0 left-0 origin-top-left border-0"
            style={{ width: w, height: h, transform: `scale(${scale})` }}
          />
        )}
      </div>
      <figcaption className="text-muted-foreground flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm leading-relaxed">
        {media.caption && (
          <span className="max-w-2xl">{pick(media.caption, lang)}</span>
        )}
        <a
          href={media.src}
          target="_blank"
          rel="noopener"
          className="text-foreground font-medium underline underline-offset-4"
        >
          {lang === "es" ? "Abrir a pantalla completa" : "Open full screen"}
        </a>
      </figcaption>
    </figure>
  );
}

/** Inside a beat a pair is one frame and a Before / After toggle: two crops in half a column are too small to read. */
function PairToggle({
  media,
}: {
  media: Extract<StoryMedia, { kind: "pair" }>;
}) {
  const { lang } = useLang();
  const id = useId();
  const [after, setAfter] = useState(false);
  const labels = [
    media.beforeLabel
      ? pick(media.beforeLabel, lang)
      : lang === "es"
        ? "Antes"
        : "Before",
    media.afterLabel
      ? pick(media.afterLabel, lang)
      : lang === "es"
        ? "Después"
        : "After",
  ];
  const { refs, onKeyDown } = useRovingKeys(2, after ? 1 : 0, (k) =>
    setAfter(k === 1)
  );
  return (
    <figure className="flex flex-col gap-3">
      <div
        role="tablist"
        aria-label={lang === "es" ? "Antes y después" : "Before and after"}
        onKeyDown={onKeyDown}
        className="border-border bg-background/60 flex w-fit gap-1 rounded-lg border p-1"
      >
        {labels.map((l, k) => (
          <button
            key={k}
            ref={(el) => {
              refs.current[k] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-t${k}`}
            aria-selected={(k === 1) === after}
            aria-controls={`${id}-p`}
            tabIndex={(k === 1) === after ? 0 : -1}
            onClick={() => setAfter(k === 1)}
            className={`focus-visible:ring-ring relative isolate rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
              (k === 1) === after
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {(k === 1) === after && (
              <SegmentPill group={id} className="rounded-md" />
            )}
            {l}
          </button>
        ))}
      </div>
      {/* Both frames stay mounted in one grid cell, so a toggle never reloads an image
          or changes the box's height: the glitch was the swap re-fetching and resizing. */}
      <div
        role="tabpanel"
        id={`${id}-p`}
        aria-labelledby={`${id}-t${after ? 1 : 0}`}
        className="grid"
      >
        {[media.before, media.after].map((c, k) => (
          <div
            key={c.src}
            className={`col-start-1 row-start-1 self-center transition-opacity duration-300 ${(k === 1) === after ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={(k === 1) !== after}
          >
            {k === 1 && media.afterLive ? (
              <LiveCrop media={{ kind: "live", ...media.afterLive }} />
            ) : (
              <Frame clip={c} />
            )}
          </div>
        ))}
      </div>
      {media.caption && (
        <figcaption className="text-muted-foreground text-xs leading-relaxed">
          {pick(media.caption, lang)}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * The house layout for a story (2026-11-27, after rows.gg). One beat per section: a
 * small visual on a grey card on the left, the claim and two short paragraphs on the
 * right, a lot of air between beats. The headline carries the story for a skimmer; the
 * paragraphs are for whoever stops.
 */
function Beats({ sections, nav }: { sections: StorySection[]; nav: boolean }) {
  return (
    <div className="relative flex flex-col gap-[150px] sm:gap-[210px]">
      {nav && <StoryNav sections={sections} wideFrom={1200} />}
      {sections.map((section, i) =>
        section.switch ? (
          <SwitchBeat key={i} index={i} nav={nav} section={section} />
        ) : (
          <BeatRow
            key={i}
            index={i}
            nav={nav}
            kicker={section.kicker}
            heading={section.heading}
            body={section.body}
            media={section.media ?? []}
          />
        )
      )}
    </div>
  );
}

/** One beat: the visual on the left, the claim and two short paragraphs on the right. */
function BeatRow({
  index,
  nav,
  heading,
  body,
  media,
  top,
  level = 2,
  stable = false,
}: {
  index: number;
  nav: boolean;
  kicker?: { en: string; es: string };
  heading: { en: string; es: string };
  body: { en: string; es: string }[];
  media: StoryMedia[];
  top?: React.ReactNode;
  level?: 2 | 3;
  /** In a switch: the visual box keeps the tallest height it has had, so switching never makes the page jump. */
  stable?: boolean;
}) {
  const { lang } = useLang();
  const H = level === 3 ? "h3" : "h2";
  const visual = useRef<HTMLDivElement>(null);
  const [minH, setMinH] = useState(0);
  useEffect(() => {
    const el = visual.current;
    if (!stable || !el) return;
    const ro = new ResizeObserver(() =>
      setMinH((m) => Math.max(m, el.scrollHeight))
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [stable]);
  return (
    <section
      id={nav ? `section-${index}` : undefined}
      data-index={index}
      aria-labelledby={`story-${index}`}
      className="flex scroll-mt-28 flex-col gap-5"
    >
      {top}
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1fr)_260px] md:gap-10">
        <div
          // One surface: the light product stage, the same in both themes, so a
          // component never sits inside three frames.
          className="flex flex-col justify-center overflow-hidden rounded-md bg-[#eef1f4] text-[#1f2328]"
          // The stage is light in both themes, so the site's dot cursor stays navy here.
          data-cursor-ink="#062D3F"
        >
          <div
            ref={visual}
            className="flex flex-col justify-center gap-4"
            style={stable && minH ? { minHeight: minH } : undefined}
          >
            <BeatContext.Provider value={true}>
              {media.map((m, k) => (
                <Media
                  // Keyed by its own title, so a switch gives each tab a fresh
                  // visual: its play runs once for it, not once for the beat.
                  key={`${k}-${m.kind}-${"title" in m && m.title ? m.title.en : ""}`}
                  media={m}
                />
              ))}
            </BeatContext.Provider>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 md:pt-0.5">
          {/* No eyebrow above the headline (Richard, 2026-11-27: all-caps kickers
              read as AI-made). `kicker` stays in the data for the nav and
              screen readers' context, and is not shown. */}
          <H
            id={level === 2 ? `story-${index}` : undefined}
            className="font-display text-[17px] leading-[1.25] font-medium tracking-[-0.025em] text-balance"
          >
            {pick(heading, lang)}
          </H>
          {body.map((para, j) => (
            <p
              key={j}
              className="text-foreground/85 text-[13px] leading-[1.55] text-pretty"
            >
              {pick(para, lang)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Several beats behind one selector on top. Picking one swaps the visual and the text,
 * so a run of related beats (the cases of one animation) stays one stop on the page.
 */
function SwitchBeat({
  index,
  nav,
  section,
}: {
  index: number;
  nav: boolean;
  section: StorySection;
}) {
  const { lang } = useLang();
  const id = useId();
  const items = section.switch ?? [];
  const [k, setK] = useState(0);
  const { refs, onKeyDown } = useRovingKeys(items.length, k, setK);
  const cur = items[k];
  const top = (
    <div className="flex flex-col gap-3">
      <h2
        id={`story-${index}`}
        className="font-display text-[22px] leading-[1.2] font-medium tracking-[-0.03em] text-balance"
      >
        {pick(section.heading, lang)}
      </h2>
      {section.body.map((para, j) => (
        <p
          key={j}
          className="text-foreground/85 max-w-xl text-[13px] leading-[1.55] text-pretty"
        >
          {pick(para, lang)}
        </p>
      ))}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div
          role="tablist"
          aria-label={pick(section.heading, lang)}
          onKeyDown={onKeyDown}
          className="border-border bg-muted/40 flex w-max gap-1 rounded-lg border p-1"
        >
          {items.map((it, j) => (
            <button
              key={j}
              ref={(el) => {
                refs.current[j] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-t${j}`}
              aria-selected={j === k}
              tabIndex={j === k ? 0 : -1}
              onClick={() => setK(j)}
              className={`focus-visible:ring-ring relative isolate rounded-md px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                j === k
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {j === k && <SegmentPill group={id} className="rounded-md" />}
              {pick(it.label, lang)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <BeatRow
      index={index}
      stable
      nav={nav}
      kicker={cur.kicker}
      heading={cur.heading}
      body={cur.body}
      media={cur.media}
      top={top}
      level={3}
    />
  );
}

/**
 * A crop of a real prototype page, live. The page renders at its own viewport size in
 * an iframe; the box shows only the crop, scaled to the box's width. HTML scales without
 * losing sharpness, so the crop is crisp on any screen, and the animation is the real one.
 * Loads when it's near the screen; ignores the pointer, since it's a picture, not the demo.
 */
function LiveCrop({ media }: { media: Extract<StoryMedia, { kind: "live" }> }) {
  const { lang } = useLang();
  const vw = media.viewport?.w ?? 1440;
  const vh = media.viewport?.h ?? 900;
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);
  const crop =
    width && width < 480 && media.cropSmall ? media.cropSmall : media.crop;
  const scale = width ? width / crop.w : 0;
  const cropH = crop.h * scale;
  const frameH = media.frame ? Math.max(width * media.frame, cropH) : cropH;
  return (
    <div
      ref={box}
      // A crop of a live page on purpose: the responsive check skips it.
      data-crop
      className="relative w-full overflow-hidden rounded-md bg-white"
      style={{
        height: frameH || undefined,
        aspectRatio: width ? undefined : `${crop.w} / ${crop.h}`,
      }}
      aria-label={pick(media.title, lang)}
      role="img"
    >
      {near && scale > 0 && (
        // The crop gets its own clipped window, centred in the frame: without it a frame
        // taller than the crop shows whatever sits above and below it on the page.
        <div
          className="absolute left-0 w-full overflow-hidden"
          style={{ top: (frameH - cropH) / 2, height: cropH }}
        >
          <iframe
            src={media.src}
            title={pick(media.title, lang)}
            tabIndex={-1}
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
            style={{
              // Same colour scheme as the board, or the browser paints an opaque
              // white canvas behind it on the dark site.
              colorScheme: "light",
              width: vw,
              height: vh,
              transform: `scale(${scale}) translate(${-crop.x}px, ${-crop.y}px)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * A stage of fixed shape with whole components placed on it, scaled as one. Live items
 * run the real prototype page in an iframe clipped to the element's exact bounds, so they
 * read as components, not as pieces of a screen. Nothing is cropped by the stage: on a
 * phone the same picture is simply smaller.
 */
/** Padding inside a beat's stage, on every side; the legend and caption share it. */
const STAGE_PAD = 28;
const REPLAY_BAND = 24;

function Composition({
  media,
}: {
  media: Extract<StoryMedia, { kind: "composition" }>;
}) {
  const { lang } = useLang();
  const beat = useContext(BeatContext);
  const aspect = media.aspect ?? 1.6;
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(0);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);
  // Inside a beat the stage fits its contents: the items' bounding box plus the same
  // padding on every side, so every card in the story has the same air around it.
  // `track`: the piece follows an element inside its board (its live box plus
  // `trackPad`), so it grows when the component opens.
  const [tracked, setTracked] = useState<
    Record<number, { x: number; y: number; w: number; h: number }>
  >({});
  const rectOf = (k: number) => tracked[k] ?? media.items[k].rect;
  const geo = media.items.map((it, k) => {
    const w = it.w / 100;
    const r = rectOf(k);
    const h = w * (r ? r.h / r.w : (it.imageRatio ?? 0.625));
    return {
      l: it.x / 100 - w / 2,
      t: it.y / 100 / aspect - h / 2,
      w,
      h,
      label: !!it.label,
    };
  });
  const markPts = (media.marks ?? []).map((m) => ({
    x: m.x / 100,
    y: m.y / 100 / aspect,
  }));
  const markPx = Math.max(16, W / 30);
  let fit: { U: number; x0: number; y0: number; h: number } | null = null;
  if (beat && W > 0 && geo.length) {
    let U = 1;
    let b = { x0: 0, x1: 0, y0: 0, y1: 0 };
    for (let pass = 0; pass < 3; pass++) {
      const r = pass ? markPx / 2 / U : 0;
      const lab = pass ? 22 / U : 0;
      b = {
        x0: Math.min(...geo.map((g) => g.l), ...markPts.map((m) => m.x - r)),
        x1: Math.max(
          ...geo.map((g) => g.l + g.w),
          ...markPts.map((m) => m.x + r)
        ),
        y0: Math.min(
          ...geo.map((g) => g.t - (g.label ? lab : 0)),
          ...markPts.map((m) => m.y - r)
        ),
        y1: Math.max(
          ...geo.map((g) => g.t + g.h),
          ...markPts.map((m) => m.y + r)
        ),
      };
      U = (W - 2 * STAGE_PAD) / (b.x1 - b.x0);
    }
    fit = {
      U,
      x0: b.x0,
      y0: b.y0,
      // A band under the content for Replay, so the button never covers the component.
      h: (b.y1 - b.y0) * U + 2 * STAGE_PAD + (media.play ? REPLAY_BAND : 0),
    };
  }
  // Play once when half on screen, then on demand. The boards are same-origin copies,
  // so the stage can press their own controls.
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [seen, setSeen] = useState(false);
  const played = useRef(false);
  useEffect(() => {
    const el = box.current;
    if (!el || !media.play) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      {
        threshold: 0.5,
      }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [media.play]);
  const liveCount = media.items.filter((it) => it.src && it.rect).length;
  // "click": press the element whose own text is `playClick`, as a person would.
  // A replay reloads the board first, so it starts closed again.
  const pendingClick = useRef(false);
  // `playSetup`: clicks that bring the board to the right screen first (open a
  // plan, go to a page). They run hidden on every load; the piece shows after.
  // Lab boards run their animation once on load; they stay hidden until the
  // stage plays them, so the reader sees it once, not twice.
  const [veiled, setVeiled] = useState(
    Boolean(media.playSetup?.length) || media.play === "lab"
  );
  const runSetup = async (doc: Document) => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await wait(1500);
    for (const t of media.playSetup ?? []) {
      clickIn(doc, t);
      await wait(700);
    }
  };
  const steps = Array.isArray(media.playClick)
    ? media.playClick
    : media.playClick
      ? [media.playClick]
      : [];
  // One step: "range:N" moves the board's first slider to N; anything else is
  // the text of the control to press.
  const stepIn = (doc: Document, step: string) => {
    if (step.startsWith("range:")) {
      const input = doc.querySelector<HTMLInputElement>('input[type="range"]');
      const win = doc.defaultView;
      if (!input || !win) return;
      Object.getOwnPropertyDescriptor(
        win.HTMLInputElement.prototype,
        "value"
      )?.set?.call(input, step.slice(6));
      input.dispatchEvent(new win.Event("input", { bubbles: true }));
      input.dispatchEvent(new win.Event("change", { bubbles: true }));
    } else clickIn(doc, step);
  };
  const runSteps = (doc: Document) =>
    steps.forEach((st, i) => setTimeout(() => stepIn(doc, st), i * 1600));
  const clickIn = (doc: Document, text?: string) => {
    // The deepest element whose text is exactly `text`, first in the page.
    const all = [...doc.querySelectorAll("body *")].filter(
      (e) => e.textContent?.trim() === text
    );
    const el = all.find((e) => !all.some((o) => o !== e && e.contains(o)));
    const target = (el?.closest("tr,button,a,[role=button],li") ??
      el) as HTMLElement | null;
    if (!target) return;
    // The full press, for controls that listen to pointer events, not only click.
    const win = doc.defaultView ?? window;
    for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup"])
      target.dispatchEvent(
        new (type.startsWith("pointer") ? win.PointerEvent : win.MouseEvent)(
          type,
          { bubbles: true, cancelable: true }
        )
      );
    target.click();
  };
  const play = () => {
    frames.current.forEach((f) => {
      const doc = f?.contentDocument;
      if (!f || !doc) return;
      if (media.play === "click") {
        if (played.current && doc.body.dataset.clicked) {
          pendingClick.current = true;
          if (media.playSetup?.length) setVeiled(true);
          f.contentWindow?.location.reload();
        } else {
          doc.body.dataset.clicked = "1";
          runSteps(doc);
        }
        return;
      }
      if (media.play === "reload") f.contentWindow?.location.reload();
      else if (media.play === "case")
        (doc.querySelector(".r4-demo__play") as HTMLElement | null)?.click();
      else {
        (
          [...doc.querySelectorAll("button")].find((b) =>
            b.textContent?.includes("Repetir")
          ) as HTMLElement | undefined
        )?.click();
        setVeiled(false);
      }
    });
  };
  useEffect(() => {
    if (!media.play || played.current || !seen || loaded < liveCount) return;
    played.current = true;
    // Give the board a moment to mount its components after load.
    const t = setTimeout(
      play,
      media.play === "reload" ? 0 : media.play === "click" ? 1800 : 900
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, loaded, liveCount, media.play]);
  // One radius for every piece, taken from the item `radiusFrom` names, so pieces
  // drawn at different scales still have the same corners on the stage.
  const sharedRadius = (() => {
    const ref =
      media.radiusFrom !== undefined ? media.items[media.radiusFrom] : null;
    if (!ref || ref.radius === undefined) return undefined;
    const g = geo[media.radiusFrom!];
    const iw = fit ? g.w * fit.U : g.w * W;
    const base = ref.rect ? ref.rect.w : (ref.sourceW ?? iw);
    return ref.radius * (iw / base);
  })();
  return (
    <div
      ref={box}
      role="img"
      aria-label={pick(media.title, lang)}
      data-composition
      className={`relative w-full ${beat ? "" : "overflow-hidden rounded-md"}`}
      style={{
        ...(beat && fit ? { height: fit.h } : { aspectRatio: `${aspect}` }),
        background: beat
          ? "transparent"
          : "radial-gradient(120% 90% at 50% 40%, #f7f8f9 0%, #eceef0 100%)",
      }}
    >
      {W > 0 &&
        media.items.map((it, k) => {
          const g = geo[k];
          const iw = fit ? g.w * fit.U : g.w * W;
          const ih = fit ? g.h * fit.U : g.h * W;
          const left = fit ? (g.l - fit.x0) * fit.U + STAGE_PAD : g.l * W;
          const top = fit ? (g.t - fit.y0) * fit.U + STAGE_PAD : g.t * W;
          const mask =
            it.fade === "right"
              ? "linear-gradient(90deg, #000 78%, transparent)"
              : it.fade === "bottom"
                ? "linear-gradient(180deg, #000 72%, transparent)"
                : undefined;
          return (
            <div
              key={k}
              className="absolute"
              style={{
                left,
                top,
                width: iw,
                // Hidden while its board gets ready, then fades in: never an empty
                // white card.
                opacity: veiled && it.src ? 0 : 1,
                transition: "opacity 300ms",
              }}
            >
              {it.label && (
                <span
                  className="absolute -top-5 left-0 text-[11px] font-medium text-[#4f5761]"
                  style={{ fontSize: Math.max(8, Math.min(11, W / 64)) }}
                >
                  {pick(it.label, lang)}
                </span>
              )}
              <div
                // Shows only `rect` of a live page on purpose: the responsive check skips it.
                data-crop
                className={`relative overflow-hidden ${it.flat ? "" : "bg-white shadow-[0_1px_2px_rgba(0,0,0,.06),0_12px_32px_rgba(15,23,42,.12)]"}`}
                style={{
                  height: ih,
                  // The component's real radius, scaled; 10 px when it has none given.
                  borderRadius:
                    sharedRadius !== undefined
                      ? sharedRadius
                      : it.radius !== undefined
                        ? it.radius *
                          (rectOf(k)
                            ? iw / rectOf(k)!.w
                            : it.sourceW
                              ? iw / it.sourceW
                              : 1)
                        : it.flat
                          ? 0
                          : 10,
                  WebkitMaskImage: mask,
                  maskImage: mask,
                }}
              >
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image}
                    alt=""
                    className="block h-full w-full object-cover"
                  />
                ) : (
                  near &&
                  it.src &&
                  rectOf(k) && (
                    <iframe
                      ref={(el) => {
                        frames.current[k] = el;
                      }}
                      onLoad={(e) => {
                        // Hide the board's scrollbars. On a system that shows
                        // classic scrollbars they take ~15 px from the panel and
                        // shift the measured element off its rect, leaving uneven
                        // padding and a strip of background at one edge.
                        const d = e.currentTarget.contentDocument;
                        if (d?.head) {
                          const st = d.createElement("style");
                          st.textContent =
                            "*{scrollbar-width:none!important}*::-webkit-scrollbar{display:none!important}";
                          d.head.appendChild(st);
                        }
                        const after = () => {
                          if (it.track && d) {
                            const el = d.querySelector<HTMLElement>(it.track);
                            const pad = it.trackPad ?? 0;
                            const read = () => {
                              if (!el) return;
                              const r = el.getBoundingClientRect();
                              setTracked((m) => ({
                                ...m,
                                [k]: {
                                  x: r.x - pad,
                                  y: r.y - pad,
                                  w: r.width + 2 * pad,
                                  h: r.height + 2 * pad,
                                },
                              }));
                            };
                            read();
                            if (el && d.defaultView)
                              new d.defaultView.ResizeObserver(read).observe(
                                el
                              );
                          }
                          if (media.play !== "lab") setVeiled(false);
                          if (pendingClick.current && d) {
                            pendingClick.current = false;
                            setTimeout(() => {
                              d.body.dataset.clicked = "1";
                              runSteps(d);
                            }, 900);
                          }
                          setLoaded((n) => n + 1);
                        };
                        if (media.playSetup?.length && d) {
                          void runSetup(d).then(after);
                        } else after();
                      }}
                      src={it.src}
                      title=""
                      tabIndex={it.interactive ? 0 : -1}
                      aria-hidden={it.interactive ? undefined : true}
                      loading="lazy"
                      className={`absolute top-0 left-0 origin-top-left border-0 ${it.interactive ? "" : "pointer-events-none"}`}
                      style={{
                        // Same colour scheme as the board, or the browser paints an opaque
                        // white canvas behind it on the dark site.
                        colorScheme: "light",
                        width: it.viewport?.w ?? 1440,
                        height: it.viewport?.h ?? 900,
                        transform: `scale(${iw / rectOf(k)!.w}) translate(${-rectOf(k)!.x}px, ${-rectOf(k)!.y}px)`,
                      }}
                    />
                  )
                )}
              </div>
            </div>
          );
        })}
      {media.play && W > 0 && (
        <button
          type="button"
          onClick={play}
          className={`focus-visible:ring-ring absolute ${fit ? "right-7 bottom-4" : "right-3 bottom-3"} inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[#1f2328] shadow-[0_1px_2px_rgba(0,0,0,.08),0_4px_12px_rgba(0,0,0,.08)] backdrop-blur transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none`}
        >
          <span aria-hidden="true">↺</span>
          {lang === "es" ? "Repetir" : "Replay"}
        </button>
      )}
      {W > 0 &&
        media.marks?.map((m) => (
          <span
            key={m.n}
            aria-hidden="true"
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#062D3F] font-mono font-medium text-white shadow-[0_0_0_3px_rgba(255,255,255,.9)]"
            style={{
              left: fit ? (m.x / 100 - fit.x0) * fit.U + STAGE_PAD : `${m.x}%`,
              top: fit
                ? (m.y / 100 / aspect - fit.y0) * fit.U + STAGE_PAD
                : `${m.y}%`,
              width: markPx,
              height: markPx,
              fontSize: Math.max(9, W / 60),
            }}
          >
            {m.n}
          </span>
        ))}
    </div>
  );
}
