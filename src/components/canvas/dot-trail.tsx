"use client";

import { useEffect, useRef, useState } from "react";

import { DotPattern } from "@/components/magicui/dot-pattern";

/**
 * A lit trail through the dot field, following the pointer.
 *
 * Not a WebGL shader, deliberately. The effect is a second copy of the same dot
 * pattern at a brighter ink, revealed through a mask built from the pointer's
 * recent positions — so the dots themselves light up and fade behind the cursor.
 * A real shader would mean a canvas element, a GL context and a bundle cost, to
 * animate a decoration that has to sit behind readable type. This gets the same
 * read for the price of a style write per frame.
 *
 * How the trail is made: every frame the head position is eased toward the pointer
 * and pushed onto a short history. The mask is one radial gradient per sampled
 * point, with the radius shrinking down the tail. CSS composites multiple mask
 * layers additively by default, so the blobs union into a continuous streak rather
 * than reading as separate dots.
 *
 * Guards match dot-cursor.tsx and hero-cursor.tsx: fine pointers only, and
 * `prefers-reduced-motion` disables it outright — a trail IS the motion here, so
 * there's no honest reduced version, only its absence.
 */

/**
 * Tuned tighter than the first pass on Richard's call — it was reading as a wide
 * smear rather than a trail. Every value here pulls the effect closer to the
 * pointer: a shorter tail, a smaller lit radius, and a head that keeps up.
 */
/** Frames of history kept. Longer tail, more samples to composite. */
const HISTORY = 9;
/** Every Nth sample becomes a mask blob — thinning keeps the mask string short. */
const STRIDE = 2;
/** Radius of the newest blob, and of the oldest. */
const HEAD_R = 58;
const TAIL_R = 10;
/** How hard the head chases the pointer. Lower lags further and smears more. */
const LERP = 0.5;

/**
 * `scale` is the board's zoom, and it multiplies BOTH the tile and the dot — the
 * trail has to be the same grid as the field underneath it at every zoom level, and
 * scaling the spacing without the ink would turn the lit dots into a second, finer
 * pattern the moment you zoomed. One number so the two can't be set apart.
 */
export function DotTrail({
  tile,
  scale = 1,
}: {
  tile: number;
  scale?: number;
}) {
  const layer = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -9999, y: -9999 });
  const head = useRef({ x: -9999, y: -9999 });
  const history = useRef<{ x: number; y: number }[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !still.matches);
    sync();
    fine.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = layer.current;
    if (!el) return;

    /**
     * Listening on `window`, not on this layer or its parent.
     *
     * Both are `pointer-events: none` — they have to be, or the dot field would
     * swallow the canvas drag. An element with pointer-events disabled never
     * receives pointer events at all, so a listener there fires exactly never.
     * Hit-testing the rect ourselves is the way to have it both ways: the layer
     * stays transparent to input, and the trail still knows where the pointer is.
     */
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      // Park it far off-canvas when the pointer leaves, so the tail drains out of
      // frame instead of freezing wherever it was abandoned.
      target.current = inside ? { x, y } : { x: -9999, y: -9999 };
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    let frame = 0;
    const tick = () => {
      const t = target.current;
      const h = head.current;
      h.x += (t.x - h.x) * LERP;
      h.y += (t.y - h.y) * LERP;

      const hist = history.current;
      hist.unshift({ x: h.x, y: h.y });
      if (hist.length > HISTORY) hist.length = HISTORY;

      const el = layer.current;
      if (el) {
        const blobs: string[] = [];
        for (let i = 0; i < hist.length; i += STRIDE) {
          const p = hist[i];
          const k = i / Math.max(hist.length - 1, 1);
          const r = HEAD_R + (TAIL_R - HEAD_R) * k;
          blobs.push(
            `radial-gradient(${r}px circle at ${p.x}px ${p.y}px, white, transparent)`
          );
        }
        const mask = blobs.join(",");
        el.style.maskImage = mask;
        el.style.webkitMaskImage = mask;
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={layer}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      {/* Same grid geometry as the field underneath, so the lit dots land exactly
          on the dim ones instead of forming a second, offset grid. The ink is
          `--foreground` — the brightest thing available that still inverts with
          the theme, which is what makes the trail read as the dots turning ON
          rather than a light being laid over them. */}
      <DotPattern
        width={tile * scale}
        height={tile * scale}
        cr={1.15 * scale}
        className="fill-foreground/70"
      />
    </div>
  );
}
