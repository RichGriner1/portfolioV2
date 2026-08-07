"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { CardMedia } from "@/components/work-card";
import { WORK } from "@/lib/content/work";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The orbit composition from Richard's ORBIT reference: the project cards sit on
 * the rim of a wheel whose centre is below the frame, each rotated tangentially.
 * The card at top-centre is upright, largest and frontmost; the rest tilt away and
 * drop as they travel out. Scrolling turns the wheel, so one card is always the
 * focused one.
 *
 * Why this beats the strip it replaces: eight cards in a row all read at the same
 * weight, so the line becomes texture. An arc gives the set a focal point, which
 * is the difference between decoration and something a visitor browses.
 *
 * Three states, same discipline as everything else in this hero:
 *   - No scroll yet, no JS, reduced motion: the wheel rests at index 0 with the
 *     first card focused. That is a finished composition on its own.
 *   - Scrolling: the wheel turns with normal page scroll as the hero moves up. It
 *     does NOT hold the page hostage — no scroll-jacking, no sticky trap.
 *   - Only the focused card plays. See the video effect below.
 */

const ITEMS = WORK.filter((w) => !w.hidden);

/** Card edge — the size WorkGrid renders on /projects, same as the collage. */
const TILE = 300;

/**
 * Wheel geometry. R is the radius from the (off-frame, below) centre to a card's
 * middle; STEP is the angle between neighbours.
 *
 * R 1100 / STEP 11° puts the outermost of eight cards at 38.5°, which drops it
 * ~239px and pushes it ~684px off centre — the pronounced arc the reference has,
 * with the outer cards bleeding past the frame like they do there. A larger radius
 * flattens the arc into a straight row, which is the strip this replaces.
 */
const R = 1100;
const STEP = 11;

const rad = (deg: number) => (deg * Math.PI) / 180;

const HALF = ITEMS.length / 2;

/**
 * How many steps card `i` sits from the focused position, taking the short way
 * round the wheel — so the result lands in [-HALF, HALF).
 *
 * Without the wrap, focus 0 gives every card a positive offset and the whole fan
 * piles up to the right of centre instead of spreading both ways. Wrapping keeps
 * the arc full and symmetric at every focus, which is what the reference shows and
 * how a carousel is expected to behave.
 */
function offsetOf(i: number, focus: number) {
  const n = ITEMS.length;
  return ((((i - focus + HALF) % n) + n) % n) - HALF;
}

/** Placement for a card sitting `offset` steps away from the focused position. */
function place(offset: number) {
  const theta = offset * STEP;
  return {
    x: R * Math.sin(rad(theta)),
    // 1 - cos, so the card drops as it travels out from top-centre.
    y: R * (1 - Math.cos(rad(theta))),
    rotate: theta,
    // The focused card is the biggest thing on the arc; everything else recedes.
    scale: Math.max(1 - (Math.abs(theta) / 90) * 0.35, 0.6),
    // Nearest the centre paints on top, so the fan overlaps inward like the clip.
    zIndex: 100 - Math.round(Math.abs(theta)),
    // The card at the very back is the one that jumps from one end of the arc to
    // the other when the wheel wraps. Holding it at zero opacity means that jump
    // is never seen — without this, a card visibly flies across the frame once per
    // revolution.
    opacity:
      Math.abs(offset) >= HALF - 0.5
        ? 0
        : Math.max(1 - (Math.abs(theta) / 90) * 0.5, 0.45),
  };
}

export function HeroOrbit({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(0);

  // Progress across the hero as it scrolls out of view, 0 → 1. `target` is this
  // section, so the wheel turns at the pace the page is already moving. Nothing
  // is pinned and nothing is intercepted.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Across the hero's own height the wheel advances through the whole set.
  const position = useTransform(scrollYProgress, [0, 1], [0, ITEMS.length - 1]);

  useMotionValueEvent(position, "change", (v) => {
    const next = Math.round(Math.min(Math.max(v, 0), ITEMS.length - 1));
    setFocus((prev) => (prev === next ? prev : next));
  });

  /**
   * Only the focused card plays.
   *
   * Four of the eight cards carry looping autoplay video, and the earlier strip
   * had all four running at once above the fold — enough that the responsive
   * check's `networkidle` wait never settled. CardMedia is shared with the bento
   * and the index grids so it isn't the place to add a paused mode; reaching for
   * the elements here keeps that component untouched.
   */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-orbit-card]").forEach((card) => {
      const active = Number(card.dataset.orbitCard) === focus;
      card.querySelectorAll("video").forEach((v) => {
        if (active) void v.play().catch(() => {});
        else v.pause();
      });
    });
  }, [focus]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* The arc is a desktop composition for the same reason the collage was:
          eight 300px cards on a 1100px radius have nowhere to go in a phone
          column. Mobile keeps the static hero. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[420px] sm:block">
        {/* Lifted off the bottom edge so the focused card is ~80% visible rather
            than cut in half. Card centres sit ON this line, so at bottom-0 exactly
            half of every card hangs below the frame — measured at 51%, where the
            reference shows most of the centre card and clips only its foot. The
            offset is unscaled px (Tailwind emits `translate` and `scale` as
            separate properties, so the wrapper's scale doesn't divide it), which is
            why it steps with the breakpoint. */}
        <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2 scale-[0.55] lg:bottom-[80px] lg:scale-90">
          {ITEMS.map((item, i) => {
            const p = place(offsetOf(i, focus));
            return (
              <motion.div
                key={item.slug}
                data-orbit-card={i}
                className="border-border bg-card absolute overflow-hidden rounded-2xl border shadow-xl"
                style={{
                  width: TILE,
                  height: TILE,
                  left: -TILE / 2,
                  top: -TILE / 2,
                  zIndex: p.zIndex,
                  ...(item.bgColor ? { backgroundColor: item.bgColor } : null),
                }}
                animate={{
                  x: p.x,
                  y: p.y,
                  rotate: p.rotate,
                  scale: p.scale,
                  opacity: p.opacity,
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }
                }
              >
                <CardMedia item={item} lang={lang} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
