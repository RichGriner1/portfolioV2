"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { CardMedia } from "@/components/work-card";
import { WORK } from "@/lib/content/work";
import { pick, useLang } from "@/lib/i18n";

/**
 * The work, placed on the canvas as frames.
 *
 * This is the alternative to the orbit: instead of a second interaction turning a
 * wheel, the cards simply sit on the canvas at authored positions and you pan to
 * see them. One interaction, one metaphor — which is also what actually happens
 * when you open somebody's Figma file, so the hero stops being two effects sharing
 * a box and becomes one idea.
 *
 * Each frame wears the label Figma puts above a frame. That's the detail doing the
 * work: a bordered rectangle with a name over it reads as a design file, where a
 * bare rounded card reads as a website.
 */

/**
 * Four, not eight. The canvas already carries a dot field, a selection frame, a
 * custom cursor and a lit trail; eight cards on top is where the composition stops
 * being confident and starts being busy.
 *
 * Chosen rather than sliced: the three case studies plus the methodology piece,
 * which is the set the positioning actually rests on.
 */
const SLUGS = [
  "visual-identity",
  "afi-design-system",
  "mindfulme",
  "color-methodology",
];

const ITEMS = SLUGS.map((slug) => {
  const item = WORK.find((w) => w.slug === slug);
  if (!item) throw new Error(`hero-frames: unknown slug ${slug}`);
  return item;
});

/** Frame edge. Smaller than the 300px index card — four of these plus the claim
    is a lot of surface, and they read as context here rather than as the subject. */
const SIZE = 260;

/**
 * Positions in px from the canvas centre, authored so each frame is CLIPPED at rest.
 *
 * That's deliberate. A sliver of a frame at the edge is what tells a visitor the
 * canvas continues past the viewport and is worth dragging — a fully visible card
 * says the composition is finished and there's nothing to find. The pan clamp
 * (±180 / ±120) is enough travel to bring any of them properly into view.
 */
const SPOTS = [
  { x: -430, y: -240 },
  { x: 430, y: -225 },
  { x: -395, y: 250 },
  { x: 415, y: 265 },
];

export function HeroFrames() {
  const { lang } = useLang();

  return (
    // `hidden lg:block`, and scaled down at the bottom of that range.
    //
    // The spots are fixed px offsets of ±430, which needs real width. Below `sm`
    // all four frames sat entirely off-screen — invisible, still in the DOM, still
    // focusable links — and at 768 they ran ~194px past the viewport edge. Both
    // were caught by the gate, and both are the same root cause: this composition
    // doesn't fit until the viewport is genuinely wide.
    //
    // `scale-90` at lg keeps the outermost frame inside a 1024px viewport (504 of
    // an available 512); from xl there's room for full size. Scaling the layer
    // rather than the spots means the cards shrink with their positions, so the
    // arrangement stays proportional instead of bunching.
    <div className="absolute inset-0 hidden lg:block lg:scale-90 xl:scale-100">
      {ITEMS.map((item, i) => (
        <Frame key={item.slug} item={item} spot={SPOTS[i]} lang={lang} />
      ))}
    </div>
  );
}

function Frame({
  item,
  spot,
  lang,
}: {
  item: (typeof ITEMS)[number];
  spot: { x: number; y: number };
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const box = useRef<HTMLDivElement>(null);

  /**
   * Video plays on hover only, and nothing plays at rest.
   *
   * Four of the work items carry looping autoplay video. The collage variant ran
   * all of them at once above the fold and the responsive check's `networkidle`
   * wait never settled. Gating on hover means first paint costs nothing and the
   * visitor decides what moves — which is also how a frame behaves in Figma.
   */
  const setPlaying = (on: boolean) => {
    box.current?.querySelectorAll("video").forEach((v) => {
      if (on) void v.play().catch(() => {});
      else v.pause();
    });
  };

  /**
   * Pause on mount. `CardMedia` renders its <video> with `autoPlay`, so without
   * this they start on their own and the hover gate above never gets a chance —
   * `onPointerLeave` can't fire before a pointer has entered. Measured two of four
   * frames playing at first paint before this existed.
   */
  useEffect(() => setPlaying(false), []);

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{ translate: `${spot.x - SIZE / 2}px ${spot.y - SIZE / 2}px` }}
    >
      {/* Frame name, in Figma's position: above the top-left corner, small, and in
          mono because everything machine-facing on this site is mono. */}
      <span
        aria-hidden
        className="text-muted-foreground absolute -top-5 left-0 font-mono text-[10px] whitespace-nowrap"
      >
        {pick(item.title, lang)}
      </span>
      <Link
        href={item.href}
        aria-label={pick(item.title, lang)}
        // `pointer-events-auto` against the layer's `none`: the frames are real
        // links, but the canvas around them stays draggable. Same split Figma has —
        // you grab empty canvas to pan, and click a frame to open it.
        className="pointer-events-auto block"
        onPointerEnter={() => setPlaying(true)}
        onPointerLeave={() => setPlaying(false)}
      >
        <div
          ref={box}
          className="border-border bg-card ease-out-soft relative overflow-hidden rounded-lg border shadow-sm transition-shadow duration-[var(--duration-base)] hover:shadow-lg"
          style={{
            width: SIZE,
            height: SIZE,
            ...(item.bgColor ? { backgroundColor: item.bgColor } : null),
          }}
        >
          <CardMedia item={item} lang={lang} />
        </div>
      </Link>
    </div>
  );
}
