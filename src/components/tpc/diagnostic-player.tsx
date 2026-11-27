"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Maximize2, Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GalleryViewer,
  type Shot,
} from "@/components/tpc/before-after-gallery";
import type {
  DIAGNOSTIC,
  DiagPinAfter,
  DiagPinBefore,
} from "@/components/tpc/copy";
import { pick, useLang } from "@/lib/i18n";
import { DURATION, EASE, EASE_CLOSE, EASE_IN_OUT, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Diagnostic = typeof DIAGNOSTIC;

/**
 * Where each pin sits on its screenshot, as a fraction of the image (both
 * screenshots are 1440 × 1120): just beside the element the note names, never
 * on top of its label.
 */
const BEFORE_AT: Record<DiagPinBefore, [number, number]> = {
  "one-page": [0.9, 0.205],
  "code-title": [0.388, 0.367],
  "draft-state": [0.585, 0.367],
  "type-palette": [0.385, 0.643],
  "rules-buried": [0.428, 0.808],
};
const AFTER_AT: Record<DiagPinAfter, [number, number]> = {
  "back-link": [0.292, 0.091],
  "draft-actions": [0.535, 0.093],
  pages: [0.305, 0.375],
  "add-question": [0.962, 0.18],
  conditional: [0.6, 0.393],
};

type Beat =
  | { kind: "before"; i: number }
  | { kind: "audit" }
  | { kind: "after"; i: number };

/** Time on each beat, and the hold on the last before it loops. */
const DWELL_MS = 2600;
const END_HOLD_MS = 2000;

/**
 * The template editor as a short annotated film: the v1.0 screen gets its
 * problems pinned one by one, the usability audit's counts come up over it,
 * then it dissolves to v1.1 with the fixes pinned. Plays while on screen; Pause,
 * Replay, a clickable progress bar, and Expand to open both screens full size.
 */
export function DiagnosticPlayer({
  diagnostic,
  shots,
  title,
}: {
  diagnostic: Diagnostic;
  /** [before, after] — the same pair the gallery uses. */
  shots: [Shot, Shot];
  title: Shot["label"];
}) {
  const { lang } = useLang();
  const reduced = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);

  const beats: Beat[] = [
    ...diagnostic.before.map((_, i) => ({ kind: "before" as const, i })),
    { kind: "audit" as const },
    ...diagnostic.after.map((_, i) => ({ kind: "after" as const, i })),
  ];
  const [beat, setBeat] = useState(0);
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [viewer, setViewer] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });
  const playing = inView && !userPaused && !reduced && !viewer.open;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const last = beat === beats.length - 1;
    const id = window.setTimeout(
      () => setBeat((b) => (b + 1) % beats.length),
      last ? DWELL_MS + END_HOLD_MS : DWELL_MS
    );
    return () => window.clearTimeout(id);
  }, [playing, beat, beats.length]);

  const cur = beats[beat];
  const showingAfter = cur.kind === "after";
  const pins =
    cur.kind === "after"
      ? diagnostic.after.map((p, i) => ({
          n: i + 1,
          at: AFTER_AT[p.id],
          shown: i <= cur.i,
          active: i === cur.i,
        }))
      : diagnostic.before.map((p, i) => ({
          n: i + 1,
          at: BEFORE_AT[p.id],
          shown: cur.kind === "audit" || i <= cur.i,
          active: cur.kind === "before" && i === cur.i,
        }));

  const caption =
    cur.kind === "before"
      ? diagnostic.before[cur.i]
      : cur.kind === "after"
        ? diagnostic.after[cur.i]
        : null;

  const phase =
    cur.kind === "before"
      ? shots[0].label
      : cur.kind === "after"
        ? shots[1].label
        : diagnostic.heading;

  const dwell =
    (beat === beats.length - 1 ? DWELL_MS + END_HOLD_MS : DWELL_MS) / 1000;

  return (
    <div
      ref={rootRef}
      className="border-border bg-card overflow-hidden rounded-xl border"
      role="group"
      aria-roledescription={
        lang === "es" ? "diagnóstico animado" : "animated diagnostic"
      }
      aria-label={pick(title, lang)}
    >
      {/* Header: phase, counter, controls */}
      <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-muted-foreground font-mono text-xs whitespace-nowrap tabular-nums">
            {String(beat + 1).padStart(2, "0")} /{" "}
            {String(beats.length).padStart(2, "0")}
          </span>
          <span className="hidden truncate font-mono text-xs sm:inline">
            {pick(phase, lang)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={!playing}
          >
            {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
            <span className="sr-only sm:not-sr-only">
              {playing
                ? lang === "es"
                  ? "Pausa"
                  : "Pause"
                : lang === "es"
                  ? "Reproducir"
                  : "Play"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setBeat(0);
              setUserPaused(false);
            }}
          >
            <RotateCcw aria-hidden />
            <span className="sr-only sm:not-sr-only">
              {lang === "es" ? "Repetir" : "Replay"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setViewer({ open: true, index: showingAfter ? 1 : 0 })
            }
          >
            <Maximize2 aria-hidden />
            <span className="sr-only sm:not-sr-only">
              {lang === "es" ? "Ampliar" : "Expand"}
            </span>
          </Button>
        </div>
      </div>

      {/* Stage and notes side by side on a wide screen, so the screenshot and
          what is being said about it fit in one view without scrolling. */}
      <div className="bg-muted/40 grid grid-cols-1 gap-4 p-2 sm:p-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        {/* Stage: the screenshot, its pins, and the audit card over it */}
        <div>
          <div className="relative aspect-[1440/1120] overflow-hidden rounded-lg">
            {shots.map((s, i) => (
              <motion.div
                key={s.still.src}
                className="absolute inset-0"
                initial={false}
                animate={{
                  opacity: (i === 1) === showingAfter ? 1 : 0,
                }}
                transition={{
                  duration: reduced ? 0 : DURATION.move,
                  ease: EASE,
                }}
              >
                <Image
                  src={s.still.src}
                  alt={pick(s.still.alt, lang)}
                  fill
                  sizes="(min-width: 1024px) 976px, 100vw"
                  className="object-cover object-top"
                />
              </motion.div>
            ))}

            {/* Dim the screen while the audit counts are up */}
            <motion.div
              aria-hidden
              className="bg-background/70 absolute inset-0"
              initial={false}
              animate={{ opacity: cur.kind === "audit" ? 1 : 0 }}
              transition={{ duration: DURATION.base, ease: EASE }}
            />

            {pins.map((p) => (
              <AnimatePresence key={`${showingAfter ? "a" : "b"}-${p.n}`}>
                {p.shown && (
                  <motion.span
                    aria-hidden
                    className={cn(
                      "bg-annotation text-annotation-foreground absolute z-10 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-[9px] font-medium shadow-sm sm:size-7 sm:text-xs",
                      p.active ? "ring-annotation/25 ring-[6px]" : "opacity-90"
                    )}
                    style={{
                      left: `${p.at[0] * 100}%`,
                      top: `${p.at[1] * 100}%`,
                    }}
                    initial={reduced ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: p.active ? 1.1 : 1, opacity: 1 }}
                    exit={{
                      scale: 0.6,
                      opacity: 0,
                      transition: {
                        duration: DURATION.close,
                        ease: EASE_CLOSE,
                      },
                    }}
                    transition={SPRING}
                  >
                    {p.n}
                  </motion.span>
                )}
              </AnimatePresence>
            ))}

            <AnimatePresence>
              {cur.kind === "audit" && (
                <motion.div
                  key="audit"
                  className="absolute inset-0 z-20 flex items-center justify-center p-4"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -6,
                    transition: { duration: DURATION.close, ease: EASE_CLOSE },
                  }}
                  transition={{ duration: DURATION.reveal.normal, ease: EASE }}
                >
                  <div className="dark bg-card text-foreground border-border w-full max-w-2xl rounded-2xl border p-5 shadow-xl sm:p-8">
                    <p className="text-muted-foreground mb-4 font-mono text-xs uppercase">
                      {pick(diagnostic.heading, lang)}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {diagnostic.audit.map((a, i) => (
                        <motion.div
                          key={a.id}
                          className="flex flex-col gap-1"
                          initial={reduced ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: DURATION.reveal.normal,
                            delay: 0.15 + i * 0.07,
                            ease: EASE,
                          }}
                        >
                          <span className="font-display text-3xl leading-none font-bold tracking-tight sm:text-5xl">
                            {pick(a.value, lang)}
                          </span>
                          <span className="text-muted-foreground text-xs leading-snug sm:text-sm">
                            {pick(a.label, lang)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notes: every pin of this screen, the one in focus opened */}
        <aside className="hidden flex-col gap-1 lg:flex" aria-live="polite">
          <p className="text-muted-foreground px-2 pb-2 font-mono text-xs">
            {pick(phase, lang)}
          </p>
          {cur.kind === "audit"
            ? diagnostic.audit.map((a) => (
                <div
                  key={a.id}
                  className="flex items-baseline gap-3 px-2 py-1.5"
                >
                  <span className="font-display w-10 shrink-0 text-2xl leading-none font-bold">
                    {pick(a.value, lang)}
                  </span>
                  <span className="text-foreground text-sm leading-snug">
                    {pick(a.label, lang)}
                  </span>
                </div>
              ))
            : (cur.kind === "before"
                ? diagnostic.before
                : diagnostic.after
              ).map((pin, i) => {
                const active = i === cur.i;
                const seen = i <= cur.i;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => {
                      setBeat(
                        beats.findIndex((b) => b.kind === cur.kind && b.i === i)
                      );
                      setUserPaused(true);
                    }}
                    className={cn(
                      "ease-out-soft flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-[var(--duration-base)]",
                      active ? "bg-card shadow-sm" : "hover:bg-card/60"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] transition-colors duration-[var(--duration-base)]",
                        seen
                          ? "bg-annotation text-annotation-foreground"
                          : "bg-border text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span
                        className={cn(
                          "text-sm leading-snug font-semibold",
                          !seen && "text-muted-foreground"
                        )}
                      >
                        {pick(pin.title, lang)}
                      </span>
                      <motion.span
                        initial={false}
                        animate={{
                          height: active ? "auto" : 0,
                          opacity: active ? 1 : 0,
                        }}
                        transition={{
                          duration: DURATION.fold,
                          ease: EASE_IN_OUT,
                        }}
                        className="text-muted-foreground overflow-hidden text-sm leading-relaxed"
                      >
                        {pick(pin.note, lang)}
                      </motion.span>
                    </span>
                  </button>
                );
              })}
        </aside>
      </div>

      {/* Caption for the pin in focus (below the stage, when there's no room beside it) */}
      <div className="flex flex-col gap-4 px-4 pt-4 pb-4 sm:px-6">
        <div className="min-h-[4.5rem] lg:hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${cur.kind}-${"i" in cur ? cur.i : 0}`}
              initial={reduced ? false : { opacity: 0, x: 12 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: DURATION.base, ease: EASE },
              }}
              exit={{
                opacity: 0,
                x: -8,
                transition: { duration: DURATION.enter, ease: EASE_CLOSE },
              }}
              className="flex items-start gap-3"
            >
              {caption ? (
                <>
                  <span className="bg-annotation text-annotation-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px]">
                    {"i" in cur ? cur.i + 1 : ""}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold">
                      {pick(caption.title, lang)}
                    </p>
                    <p className="text-foreground max-w-prose text-sm leading-relaxed sm:text-base">
                      {pick(caption.note, lang)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-foreground max-w-prose text-sm leading-relaxed sm:text-base">
                  {diagnostic.audit
                    .map((a) => `${pick(a.value, lang)} ${pick(a.label, lang)}`)
                    .join(" · ")}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress: before pins, the audit, after pins; each segment jumps there */}
        <div
          className="flex gap-1"
          role="tablist"
          aria-label={lang === "es" ? "Pasos" : "Steps"}
        >
          {beats.map((b, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === beat}
              aria-label={
                b.kind === "audit"
                  ? pick(diagnostic.heading, lang)
                  : pick(
                      (b.kind === "before"
                        ? diagnostic.before
                        : diagnostic.after)[b.i].title,
                      lang
                    )
              }
              onClick={() => {
                setBeat(i);
                setUserPaused(true);
              }}
              className={cn(
                "group flex h-6 items-center",
                b.kind === "audit" ? "flex-[1.4]" : "flex-1"
              )}
            >
              <span className="bg-border relative block h-1 w-full overflow-hidden rounded-full">
                {i < beat && (
                  <span className="bg-foreground/50 absolute inset-0 rounded-full" />
                )}
                {i === beat && (
                  <motion.span
                    key={`${beat}-${playing}`}
                    className="bg-foreground absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: playing ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: playing ? dwell : 0,
                      ease: "linear",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <GalleryViewer
        shots={shots}
        title={title}
        open={viewer.open}
        onOpenChange={(open) => setViewer((v) => ({ ...v, open }))}
        index={viewer.index}
        onIndexChange={(index) => setViewer((v) => ({ ...v, index }))}
      />
    </div>
  );
}
