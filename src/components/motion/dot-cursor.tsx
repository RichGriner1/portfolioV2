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
      if (el) el.style.translate = `${c.x}px ${c.y}px`;
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
      // `-ml/-mt` centre the dot on the pointer, so `translate` can carry the raw
      // client coordinates and stay readable.
      className="bg-foreground pointer-events-none fixed top-0 left-0 z-[100] -mt-[5px] -ml-[5px] size-[10px] rounded-full"
    />
  );
}
