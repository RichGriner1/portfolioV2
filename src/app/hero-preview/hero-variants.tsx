"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { HeroCanvas } from "./hero-canvas";
import { HeroCollage } from "./hero-collage";
import { HeroFrames } from "./hero-frames";
import { HeroOrbit } from "./hero-orbit";
import { slugOf } from "./variant-keys";

/**
 * Hero candidates for the home page rebuild (task #3).
 *
 * Preview surface only — nothing here is wired into `/`. The point is to judge
 * type scale, measure, and hierarchy in the real font stack and the real token
 * ramp, in both themes, at every breakpoint. A static mockup can't show any of
 * that, and the type decisions are the whole question.
 *
 * Copy is locked (task #1). What varies between variants is the frame, the type
 * scale, and how much weight the subtitle carries.
 */

/**
 * The claim in two pieces. `name` sits back at muted ink in the two-weight
 * variants; `claim` carries the specialty.
 *
 * "crazy fast" came off on Richard's call — it read as cheesy, and it was also the
 * one part of the line claiming the thing `lexicon.md` calls the baseline rather
 * than the differentiator. The italic went with it; there is nothing left to
 * emphasise, and an `<em>` on "with AI" would stress the tool over the work.
 * The ES no longer needs its awkward "a una velocidad absurda" either.
 */
type HeadlineBits = { name: string; claim: string };

const HEADLINE: Bilingual<HeadlineBits> = {
  en: {
    name: "I'm Richard.",
    claim: " I build design systems with AI.",
  },
  es: {
    name: "Soy Richard.",
    claim: " Construyo sistemas de diseño con IA.",
  },
};

/** The claim as one run of type — used by the centered variants. */
function Headline() {
  const { lang } = useLang();
  const { name, claim } = pick(HEADLINE, lang);
  return (
    <>
      {name}
      {claim}
    </>
  );
}

/** The claim with the self-introduction dropped to muted ink. */
function HeadlineSplit({ block = false }: { block?: boolean }) {
  const { lang } = useLang();
  const { name, claim } = pick(HEADLINE, lang);
  return (
    <>
      <span className={cn("text-muted-foreground", block && "block")}>
        {name}
      </span>
      <span className={cn("text-foreground", block && "block")}>{claim}</span>
    </>
  );
}

// Promoted verbatim from the existing intro block (home-intro.tsx, paragraph 2)
// rather than rewritten — the ES here already went through the 2026-08-05
// afi-redaccion pass.
const SUBTITLE: Bilingual<string> = {
  en: "Anthropology taught me to understand behavior. Design gave me the tools to create experiences that fit it.",
  es: "La antropología me enseñó a entender el comportamiento. El diseño me dio las herramientas para crear experiencias que encajen con él.",
};

// "Blog" in both languages — it's the word Richard's reviewer reached for, it's
// already loaned into Peninsular Spanish, and "Textos" read wrong to him. The
// route stays /writing; only the label changes. Matches nav.writing in i18n.tsx.
const NAV: Bilingual<readonly [string, string]> = {
  en: ["Projects", "Blog"],
  es: ["Proyectos", "Blog"],
};

/**
 * The rotator's word list, ending on the specialty. Order is range → specialty:
 * the broad categories set up how wide the net is, then it narrows and stops.
 * Never loops — see `Rotator`.
 */
const ROTATION: Bilingual<readonly string[]> = {
  en: ["fintech products", "B2C apps", "AI products", "design systems"],
  es: [
    "productos fintech",
    "apps B2C",
    "productos de IA",
    // TODO(afi-redaccion)
    "sistemas de diseño",
  ],
};

function Actions({ className }: { className?: string }) {
  const { lang } = useLang();
  const [projects, blog] = pick(NAV, lang);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link href="/projects" className={cn(buttonVariants({ size: "lg" }))}>
        {projects}
      </Link>
      <Link
        href="/writing"
        className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
      >
        {blog}
      </Link>
    </div>
  );
}

/** Text-link actions, for the variant that doesn't want two pills under the claim. */
function TextActions({ className }: { className?: string }) {
  const { lang } = useLang();
  const [projects, blog] = pick(NAV, lang);
  return (
    <div className={cn("flex items-center gap-6 text-sm", className)}>
      {[
        { href: "/projects", label: projects },
        { href: "/writing", label: blog },
      ].map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-foreground group inline-flex items-center gap-1 underline-offset-4 hover:underline"
        >
          {label}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}

/**
 * Cycles the range words once and stops on the last one.
 *
 * Three states have to be right, not just the animated one:
 *   - Server render and no-JS: the LAST word, already in place. The resting state
 *     is the correct statement, so a crawler or a reader with JS off gets the
 *     specialty rather than a half-finished sentence.
 *   - `prefers-reduced-motion`: same as above, no cycle at all.
 *   - Animated: rewinds to index 0 after first paint, then steps to the end.
 *
 * It never loops. A looping rotator means the one moment a visitor can't control
 * — whenever they happen to land — shows an arbitrary word, which is the exact
 * "I don't know what I'm looking at" problem the rebuild exists to fix.
 *
 * The rewind is deferred through rAF rather than set straight from the effect
 * body. Setting it synchronously cascades a second render before paint (which is
 * what @typescript-eslint flags), and deferring a frame is the better behaviour
 * anyway: the correct resting sentence paints first, then the rotation plays.
 *
 * No "already ran" ref guard. StrictMode invokes effects twice in dev — mount,
 * cleanup, mount — and a guard makes the second run bail out after the first
 * run's cleanup already cleared the timers, freezing the rotator on word one.
 */
function Rotator({
  words,
  className,
}: {
  words: readonly string[];
  className?: string;
}) {
  const last = words.length - 1;
  const [i, setI] = useState(last);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let step = 0;
    const raf = requestAnimationFrame(() => setI(0));
    const id = setInterval(() => {
      step += 1;
      setI(step);
      if (step >= last) clearInterval(id);
    }, 420);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [last]);

  return (
    // Inline-grid with both states stacked in one cell: the box stays as wide as
    // the WIDEST word, so the words after it don't jump sideways as the rotation
    // steps. A plain inline-block would reflow the rest of the line four times.
    <span className={cn("relative inline-grid align-bottom", className)}>
      {/* Reserves the width. Hidden from AT and from paint, but it's what the
          grid measures. */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <span className="col-start-1 row-start-1 text-left">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[i]}
            initial={{ opacity: 0, y: "0.25em" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-0.25em" }}
            transition={{ duration: 0.28 }}
            className="inline-block"
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
      {children}
    </span>
  );
}

/* ── A — as drawn ─────────────────────────────────────────────────────────────
   The wireframe, built literally: hero on a card, page on the gray beneath it,
   subtitle small, two pills. Included as the control. */
function VariantA() {
  const { lang } = useLang();
  return (
    <div className="bg-muted rounded-2xl p-2">
      <div className="bg-card border-border flex flex-col items-center gap-5 rounded-xl border px-6 py-16 text-center sm:py-24">
        <h1 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
          <Headline />
        </h1>
        <p className="text-prose-body max-w-md text-xs">
          {pick(SUBTITLE, lang)}
        </p>
        <Actions className="pt-2" />
      </div>
    </div>
  );
}

/* ── A1 / A2 — A's layout, carrying the collage choreography ──────────────────
   Same card, same copy, same pills. The only new thing is the image set moving
   between a strip and a ring — see hero-collage.tsx for which direction says what.

   The card grows a fixed min-height and `overflow-hidden`: the ring is authored in
   px around the centre, so the frame has to be tall enough to hold it and has to
   clip whatever reaches past the edge rather than extending the page. Type sits at
   z-10 throughout — the claim is never the thing that gets obscured. */
function VariantCollage({ mode }: { mode: "scatter" | "converge" }) {
  const { lang } = useLang();
  return (
    <div className="bg-muted rounded-2xl p-2">
      {/* Taller than the static variants because the cards are full size now: the
          ring reaches ±483px vertically at 300px tiles, and the strip settles 330px
          below centre. Anything shorter clips the composition into a letterbox. */}
      <div className="bg-card border-border relative min-h-[520px] overflow-hidden rounded-xl border px-6 py-16 sm:min-h-[780px] sm:py-24">
        <HeroCollage mode={mode} />
        {/* The bottom padding reserves the band the strip settles into (STRIP_Y in
            hero-collage.tsx). Only from `sm`, where the collage is visible at all. */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 text-center sm:pb-[380px]">
          <h1 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
            <Headline />
          </h1>
          <p className="text-prose-body max-w-md text-xs">
            {pick(SUBTITLE, lang)}
          </p>
          <Actions className="pt-2" />
        </div>
      </div>
    </div>
  );
}

/* ── A4 — canvas ──────────────────────────────────────────────────────────────
   The claim as a selected layer on a pannable design file. Copy and buttons only,
   per Richard's brief — the work isn't on the canvas yet. Drag to pan; the wheel
   still scrolls the page. See hero-canvas.tsx for the constraints. */
function VariantCanvas() {
  const { lang } = useLang();
  return (
    <div className="bg-muted rounded-2xl p-2">
      <HeroCanvas className="bg-card border-border min-h-[520px] rounded-xl border sm:min-h-[560px]">
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
            <Headline />
          </h1>
          <p className="text-prose-body max-w-md text-xs">
            {pick(SUBTITLE, lang)}
          </p>
          <Actions className="pt-2" />
        </div>
      </HeroCanvas>
    </div>
  );
}

/* ── A5 — canvas + frames ─────────────────────────────────────────────────────
   A4's canvas with the work placed on it as frames. The alternative to A3: rather
   than a wheel turning on scroll while the canvas pans on drag — two interaction
   models in one hero — there is one interaction. You drag, everything moves, and
   the frames clipped at the edges are what tell you it's worth dragging.

   Taller than A4 because the frames sit ±250px off centre and need somewhere to be. */
function VariantCanvasFrames() {
  const { lang } = useLang();
  return (
    <div className="bg-muted rounded-2xl p-2">
      <HeroCanvas
        frames={<HeroFrames />}
        className="bg-card border-border min-h-[520px] rounded-xl border sm:min-h-[700px]"
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
            <Headline />
          </h1>
          <p className="text-prose-body max-w-md text-xs">
            {pick(SUBTITLE, lang)}
          </p>
          <Actions className="pt-2" />
        </div>
      </HeroCanvas>
    </div>
  );
}

/* ── A3 — orbit ───────────────────────────────────────────────────────────────
   The ORBIT reference: cards on the rim of a wheel below the frame, one focused at
   top-centre, the wheel turning with page scroll. Copy sits above the arc rather
   than over it, which is how the reference composes too — the fan rises from the
   bottom edge and the top of the frame stays clear. */
function VariantOrbit() {
  const { lang } = useLang();
  return (
    <div className="bg-muted rounded-2xl p-2">
      {/* Height is set by what's actually in the frame, not by a round number: the
          top padding, the copy, a small gap, and the visible slice of the arc. At
          780px there was ~490px of dead space between the buttons and the cards,
          because only the focused card's top ~80% sits above the bottom edge — the
          rest of the wheel is below the frame and needs no room. */}
      <div className="bg-card border-border relative min-h-[520px] overflow-hidden rounded-xl border px-6 pt-16 pb-0 sm:min-h-[510px] sm:pt-24 lg:min-h-[590px]">
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">
          <h1 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl">
            <Headline />
          </h1>
          <p className="text-prose-body max-w-md text-xs">
            {pick(SUBTITLE, lang)}
          </p>
          <Actions className="pt-2" />
        </div>
        <HeroOrbit className="absolute inset-0" />
      </div>
    </div>
  );
}

/* ── B — bigger claim, readable subtitle ──────────────────────────────────────
   Same centered shape, no card. Two changes that matter: the claim steps up a
   size, and the subtitle comes off `text-xs`. At 12px centered under a 48px
   headline the subtitle reads as a caption and gets skipped — which would waste
   the one line that carries the anthropology angle. */
function VariantB() {
  const { lang } = useLang();
  return (
    <div className="bg-card border-border flex flex-col items-center gap-6 rounded-2xl border px-6 py-20 text-center sm:py-28">
      <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
        <Headline />
      </h1>
      <p className="text-prose-body max-w-lg text-sm sm:text-base">
        {pick(SUBTITLE, lang)}
      </p>
      <Actions className="pt-2" />
    </div>
  );
}

/* ── C — two weights, text actions ────────────────────────────────────────────
   Splits the line so the claim outranks the introduction: "I'm Richard." sits at
   muted ink, the specialty at full. Same trick the current intro block uses, one
   level up. Pills become text links — two filled buttons under a 60px headline
   is a lot of contrast competing at the same focal point. */
function VariantC() {
  const { lang } = useLang();
  return (
    <div className="bg-card border-border flex flex-col items-center gap-6 rounded-2xl border px-6 py-20 text-center sm:py-28">
      <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
        <HeadlineSplit />
      </h1>
      <p className="text-prose-body max-w-lg text-sm sm:text-base">
        {pick(SUBTITLE, lang)}
      </p>
      <TextActions className="pt-2" />
    </div>
  );
}

/* ── D — rotator ──────────────────────────────────────────────────────────────
   Your range-then-commit idea. The sentence is rebuilt around the rotating slot,
   so the claim reads straight once it lands. Resting state is "design systems"
   before the cycle ever runs — see Rotator. */
function VariantD() {
  const { lang } = useLang();
  const words = pick(ROTATION, lang);
  const isEs = lang === "es";
  return (
    <div className="bg-card border-border flex flex-col items-center gap-6 rounded-2xl border px-6 py-20 text-center sm:py-28">
      <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl">
        {isEs ? "Soy Richard. Construyo " : "I'm Richard. I build "}
        <Rotator words={words} className="text-muted-foreground" />
        {isEs ? " con IA." : " with AI."}
      </h1>
      <p className="text-prose-body max-w-lg text-sm sm:text-base">
        {pick(SUBTITLE, lang)}
      </p>
      <Actions className="pt-2" />
    </div>
  );
}

/* ── E — editorial (the foil) ─────────────────────────────────────────────────
   Not the direction you picked. Here to compare against, because it's the one
   that answers "play with typography" and the one nobody else's portfolio looks
   like. Left-aligned, oversized, rule, two columns under it. */
function VariantE() {
  const { lang } = useLang();
  return (
    <div className="bg-card border-border rounded-2xl border px-6 py-16 sm:px-10 sm:py-20">
      <h1 className="text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">
        <HeadlineSplit block />
      </h1>
      <div className="border-border mt-10 grid gap-6 border-t pt-6 sm:grid-cols-2 sm:gap-10">
        <p className="text-prose-body max-w-md text-sm sm:text-base">
          {pick(SUBTITLE, lang)}
        </p>
        <TextActions className="sm:justify-end" />
      </div>
    </div>
  );
}

/**
 * The registry. Exported so the full-screen route can render one on its own —
 * stacked in the index at a few hundred pixels each, none of these read the way
 * they will on a real page, and the composition questions are the whole point.
 *
 * `slug` is the URL segment: /hero-preview/a4.
 */
export const VARIANTS = [
  {
    key: "A5",
    note: "canvas + frames — the work placed on the canvas, one interaction",
    el: <VariantCanvasFrames />,
  },
  {
    key: "A4",
    note: "canvas — drag to pan, claim as a selected layer",
    el: <VariantCanvas />,
  },
  {
    key: "A3",
    note: "orbit — cards on a wheel, scroll turns it, one card focused",
    el: <VariantOrbit />,
  },
  {
    key: "A1",
    note: "collage — converge: ring collapses into a strip (range → specialty)",
    el: <VariantCollage mode="converge" />,
  },
  {
    key: "A2",
    note: "collage — scatter: strip flies out to a ring (the reference clip)",
    el: <VariantCollage mode="scatter" />,
  },
  {
    key: "A",
    note: "as drawn — card, small subtitle, two pills, no motion",
    el: <VariantA />,
  },
  {
    key: "B",
    note: "bigger claim, subtitle at reading size",
    el: <VariantB />,
  },
  { key: "C", note: "two weights, text actions", el: <VariantC /> },
  { key: "D", note: "rotator — range, then commits", el: <VariantD /> },
  {
    key: "E",
    note: "editorial foil — not the picked direction",
    el: <VariantE />,
  },
];

/** One variant, filling the viewport, with nothing around it but a way back. */
export function HeroVariantSolo({ slug }: { slug: string }) {
  const found = VARIANTS.find((v) => slugOf(v.key) === slug);
  if (!found) return null;
  const others = VARIANTS.filter((v) => slugOf(v.key) !== slug);
  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-5xl">{found.el}</div>
      </div>
      {/* Switcher pinned under the composition rather than over it — an overlay
          would sit on the very thing being judged. */}
      <nav className="flex flex-wrap items-center justify-center gap-2 px-4 pb-8">
        <Link
          href="/hero-preview"
          className="text-muted-foreground hover:text-foreground font-mono text-[10px] tracking-wider uppercase"
        >
          all
        </Link>
        {others.map((v) => (
          <Link
            key={v.key}
            href={`/hero-preview/${slugOf(v.key)}`}
            className="border-border text-muted-foreground hover:text-foreground rounded-md border px-2 py-1 font-mono text-[10px] tracking-wider uppercase"
          >
            {v.key}
          </Link>
        ))}
      </nav>
    </main>
  );
}

export function HeroVariants() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 px-6 py-16">
      <div className="flex flex-col gap-2">
        <Label>Hero candidates — task #3</Label>
        <p className="text-prose-body max-w-xl text-sm">
          Same locked copy in every variant. Toggle language and theme in the
          header — the ES claim is a first pass and still needs a native read.
          Click a variant name to see it full screen.
        </p>
      </div>
      {VARIANTS.map(({ key, note, el }) => (
        <div key={key} className="flex flex-col gap-3">
          <Link
            href={`/hero-preview/${slugOf(key)}`}
            className="w-fit hover:underline"
          >
            <Label>
              {key} — {note} →
            </Label>
          </Link>
          {el}
        </div>
      ))}
    </main>
  );
}
