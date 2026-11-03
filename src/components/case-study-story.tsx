"use client";

import { useEffect, useRef, useState } from "react";

import type {
  StoryClip,
  StoryMedia,
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

/**
 * Before/after as one frame you drag, not two panels side by side.
 *
 * The "after" clip sits on top and is revealed from the handle to the right edge, so
 * the same pixels of the prototype are compared directly. A visually hidden range
 * input carries keyboard and screen-reader use (arrow keys move the handle); pointer
 * drag sets the same value. Both clips loop on their own: they're different lengths,
 * so they aren't frame-synced and the drag is for comparing layout, not timing.
 */
function CompareSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  before: StoryClip;
  after: StoryClip;
  beforeLabel: string;
  afterLabel: string;
}) {
  const { lang } = useLang();
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromPointer = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  };

  return (
    <div
      ref={frame}
      className="border-border bg-card relative aspect-[8/5] touch-pan-y overflow-hidden rounded-xl border select-none"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromPointer(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromPointer(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <LoopVideo
        clip={before}
        label={pick(before.alt, lang)}
        className="absolute inset-0 h-full w-full"
        showControls={false}
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <LoopVideo
          clip={after}
          label={pick(after.alt, lang)}
          className="absolute inset-0 h-full w-full"
          showControls={false}
        />
      </div>

      <span className="bg-background/90 text-foreground pointer-events-none absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider uppercase backdrop-blur">
        {beforeLabel}
      </span>
      <span className="bg-background/90 text-foreground pointer-events-none absolute top-3 right-3 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider uppercase backdrop-blur">
        {afterLabel}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${beforeLabel} / ${afterLabel}`}
        className="peer sr-only"
      />
      <div
        className="bg-background pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 shadow-md peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-solid"
        style={{ left: `${pos}%` }}
      >
        <span className="bg-background text-foreground border-border absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border shadow-md">
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 7-5 5 5 5" />
            <path d="m15 7 5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function Media({ media }: { media: StoryMedia }) {
  const { lang } = useLang();
  const caption = media.caption ? pick(media.caption, lang) : null;
  return (
    <div className="flex flex-col gap-3">
      {media.kind === "clip" ? (
        <Frame clip={media.clip} />
      ) : (
        <CompareSlider
          before={media.before}
          after={media.after}
          beforeLabel={pick(media.beforeLabel, lang)}
          afterLabel={pick(media.afterLabel, lang)}
        />
      )}
      {caption && (
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {caption}
        </p>
      )}
    </div>
  );
}

/**
 * Each section reads in the order the reader sees it: the heading and the problem
 * (first paragraph), then the clip, then what changed (the paragraphs after it).
 * The text above describes what the clip starts from and the text below what the
 * drag or the loop shows, so the media is evidence for the sentence either side of it.
 */

export function CaseStudyStory({ sections }: { sections: StorySection[] }) {
  const { lang } = useLang();
  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      {sections.map((section, i) => (
        <section
          key={i}
          className="flex flex-col gap-8"
          aria-labelledby={`story-${i}`}
        >
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2
                id={`story-${i}`}
                className="font-display text-2xl leading-tight font-bold tracking-tight sm:text-3xl"
              >
                {pick(section.heading, lang)}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {section.body.slice(0, 1).map((para, j) => (
                <p
                  key={j}
                  className="text-foreground text-base leading-relaxed"
                >
                  {pick(para, lang)}
                </p>
              ))}
            </div>
          </div>
          {section.media?.map((m, k) => (
            <Media key={k} media={m} />
          ))}
          {section.body.length > 1 && (
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
              <div className="hidden md:block" aria-hidden="true" />
              <div className="flex flex-col gap-4">
                {section.body.slice(1).map((para, j) => (
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
      ))}
    </div>
  );
}
