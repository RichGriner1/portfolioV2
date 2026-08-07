"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Replaces the pointer with a solid dot that trails the mouse, matching the
 * reference. The trail is the whole point: the dot eases toward the real pointer
 * rather than tracking it exactly, which is what reads as it flying out and
 * settling when you leave an element.
 *
 * Guards, in order of how much they matter:
 *
 * - `(hover: hover) and (pointer: fine)` only. On touch there is no cursor to
 *   replace, and hiding the native one there would do nothing but risk breaking
 *   scroll. The query is watched, not read once, so plugging in a mouse or moving
 *   to an external display starts it without a reload.
 * - `prefers-reduced-motion` drops the easing and pins the dot to the pointer.
 *   Lag IS the motion here, so removing it is the honest reduction.
 * - The native cursor is only hidden while this is active, and never over text
 *   inputs or selectable prose — a 10px dot over a text field loses the I-beam
 *   that tells you where the caret will land. `.dot-cursor-active` in globals.css
 *   scopes that.
 *
 * Position is written straight to the element's `translate` in a rAF loop rather
 * than through React state: this runs every frame, and a state update per frame
 * would re-render the tree 60 times a second for a decoration.
 */
const LERP = 0.18;

export function DotCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  /** Last ink written, so a boundary crossing is one assignment and not one a frame. */
  const ink = useRef("var(--foreground)");
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Watch both queries rather than sampling once — a mouse can arrive later, and
  // the motion preference can change while the page is open.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnabled(fine.matches);
      setReduced(still.matches);
    };
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
    document.documentElement.classList.add("dot-cursor-active");
    return () => document.documentElement.classList.remove("dot-cursor-active");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Re-mounting gives a fresh element carrying only the `bg-foreground` class, so
    // the cache has to start there too or the first crossing could be skipped.
    ink.current = "var(--foreground)";

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let frame = 0;
    const tick = () => {
      const t = target.current;
      const c = current.current;
      // Reduced motion: no easing, so there is no trailing lag to chase.
      const k = reduced ? 1 : LERP;
      c.x += (t.x - c.x) * k;
      c.y += (t.y - c.y) * k;
      const el = dot.current;
      if (!el) {
        frame = requestAnimationFrame(tick);
        return;
      }
      el.style.translate = `${c.x}px ${c.y}px`;

      /**
       * The dot has to survive both surfaces it crosses. On the page it's
       * `--foreground`; on an inverted surface — the nav panel and the "Let's talk"
       * tile, both `bg-primary` — a `--foreground` dot is black on black and simply
       * disappears. Those surfaces mark themselves with `data-cursor-invert` and the
       * dot takes `--primary-foreground`, the ink they already use for their own
       * text. Both tokens flip with the theme, so this is right in dark mode too,
       * where `--primary` is the light surface.
       *
       * Hit-tested in the frame loop rather than on `pointermove`, for two reasons:
       *
       * - The surface can change while the pointer is perfectly still. Opening the
       *   nav is exactly that — you press the mark and a black panel grows out from
       *   under a stationary cursor. On a move-only hit test the dot kept the ink it
       *   computed before the press and sat invisible on the panel until you moved.
       * - The dot TRAILS the pointer by design, so the pointer's position is the
       *   wrong thing to sample. `c` is where the dot actually is, which is what has
       *   to match the surface under it — otherwise it flips ink early on the way in
       *   and late on the way out.
       *
       * `elementFromPoint` is a real hit test, so this is the one non-trivial cost
       * in the loop; it stays cheap because the write is guarded by `ink` and the dot
       * itself is `pointer-events-none`, so it can never hit-test itself.
       */
      const hit = document.elementFromPoint(c.x, c.y);

      /**
       * Surfaces that bring their own cursor mark themselves `data-cursor-hide` and
       * the dot steps aside. Same hit test as the invert check below, for the same
       * reasons — the surface can appear under a stationary pointer, and it's the
       * DOT's position that has to be tested, not the pointer's.
       *
       * Opacity rather than unmounting: the rAF loop keeps running, so the dot is
       * already in the right place when it comes back rather than flying in from
       * wherever it was left.
       */
      const hidden = !!hit?.closest("[data-cursor-hide]");
      const nextOpacity = hidden ? "0" : "1";
      if (el.style.opacity !== nextOpacity) el.style.opacity = nextOpacity;

      const over = hit?.closest("[data-cursor-invert]");
      const next = over ? "var(--primary-foreground)" : "var(--foreground)";
      if (next !== ink.current) {
        ink.current = next;
        el.style.backgroundColor = next;
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled, reduced]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      // `-ml/-mt` center the dot on the pointer, so `translate` can carry the raw
      // client coordinates and stay readable.
      //
      // `bg-foreground` is the starting ink only — from the first pointermove the
      // color is written inline (see above), and an inline style outranks the
      // utility. It still has to be here, or the dot is transparent until the
      // pointer first moves.
      className="bg-foreground pointer-events-none fixed top-0 left-0 z-[100] -mt-[5px] -ml-[5px] size-[10px] rounded-full"
    />
  );
}
