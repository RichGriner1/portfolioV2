"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A Figma-style collaborator cursor, scoped to whatever element it's rendered in.
 *
 * The reference Richard sent is a multiplayer cursor: an arrow with a name chip
 * trailing it. Labelling the *visitor* rather than the site owner is the joke that
 * makes it worth doing — you land on the canvas and you're the designer in the file.
 *
 * On colour: the reference is pink, and this isn't. `brand-guide.md` names one
 * opinionated colour, specified as a blue that hasn't been routed into the token
 * system yet, and lists "two accent colors" as an anti-pattern outright. Until that
 * blue is routed, `--primary` is the honest choice — it's the role the canvas
 * selection frame already uses, and it inverts with the theme. Swapping to the real
 * accent is a one-token change here once it exists.
 *
 * Guards mirror dot-cursor.tsx, which this sits alongside:
 *   - `(hover: hover) and (pointer: fine)` only; touch has no cursor to replace.
 *   - `prefers-reduced-motion` pins the label to the arrow instead of trailing it.
 *   - Position is written to `translate` in a rAF loop, never through React state.
 */

/**
 * How hard the label chases the arrow. Lower trails further.
 *
 * 0.22 read as broken rather than alive — the chip lagged far enough behind that
 * it looked like a separate floating object. In Figma the label is rigidly welded
 * to the cursor; this keeps a trace of give so it has some weight, without ever
 * looking detached.
 */
const LERP = 0.45;

export function CanvasCursor({
  label = "You",
  /**
   * Set while the CV overlay is open. The cursor then swaps its arrow-and-label
   * skin for a close affordance over the dismissible backdrop — Shopify's move, and
   * the answer to the overlay leaving the canvas with no visible pointer at all.
   */
  closeMode = false,
}: {
  label?: string;
  closeMode?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLSpanElement>(null);
  const target = useRef({ x: -200, y: -200 });
  const trail = useRef({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inside, setInside] = useState(false);
  /** True while the pointer is over the backdrop rather than the CV panel. */
  const [overBackdrop, setOverBackdrop] = useState(false);

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
    // The host is the positioning context — the cursor is absolute inside it, so
    // coordinates are measured against its box rather than the viewport.
    const host = wrap.current?.parentElement;
    if (!host) return;

    /**
     * Bounds-tested on `window`, NOT `pointerenter`/`pointerleave` on the host.
     *
     * `pointerenter` only fires when the pointer CROSSES the boundary. Land on this
     * page with the mouse already sitting over it — which is what happens on every
     * ordinary navigation — and it never fires at all, so the cursor stayed
     * unmounted until you moved off the element and back on. Measured: the wrapper
     * had zero children after a normal page load.
     *
     * Testing the rect on every move makes the first event authoritative regardless
     * of where the pointer started, and it doubles as the leave detection.
     */
    let wasInside = false;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const p = { x: e.clientX - r.left, y: e.clientY - r.top };
      const nowInside =
        p.x >= 0 && p.y >= 0 && p.x <= r.width && p.y <= r.height;

      target.current = p;
      // Seed the trail on the way in. The label eases toward the arrow, so without
      // this it starts wherever it was last left and slides in from off-canvas.
      if (nowInside && !wasInside) trail.current = { ...p };

      if (nowInside !== wasInside) {
        wasInside = nowInside;
        setInside(nowInside);
      }

      // Only meaningful while an overlay is up. `elementFromPoint` is a real hit
      // test, so it stays behind the `closeMode` guard rather than running on every
      // move of an ordinary pan.
      if (closeMode) {
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        setOverBackdrop(!hit?.closest("[data-cv-dialog]"));
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    let frame = 0;
    const tick = () => {
      const t = target.current;
      const c = trail.current;
      const k = reduced ? 1 : LERP;
      c.x += (t.x - c.x) * k;
      c.y += (t.y - c.y) * k;
      // The arrow is exact — a cursor that lags its own pointer feels broken. Only
      // the chip trails, which is what reads as the label being dragged along.
      if (arrow.current) arrow.current.style.translate = `${t.x}px ${t.y}px`;
      if (chip.current) chip.current.style.translate = `${c.x}px ${c.y}px`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled, reduced, closeMode]);

  if (!enabled) return null;

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-60 overflow-hidden"
    >
      {/* Mounted only while the pointer is over the canvas, not merely faded out.
          Parked at -200,-200 the chip is a real box with real text sitting off the
          left edge of the viewport — invisible, but the responsive gate measures
          geometry, not paint, and flagged it as out-of-bounds. Nothing to measure
          is the honest fix. */}
      {inside && closeMode && overBackdrop ? (
        /* The close affordance. Shown only over the BACKDROP — that's the surface
           that actually dismisses on click, so putting it over the panel too would
           promise an exit the panel doesn't deliver.

           It has no trailing label: a chip reading "You" beside an "×" would be two
           messages at once, and the one that matters here is what a click does. */
        <div
          ref={arrow}
          className="absolute top-0 left-0 will-change-transform"
        >
          <div className="bg-primary text-primary-foreground -m-5 grid size-10 place-items-center rounded-full shadow-lg">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 3L11 11M11 3L3 11"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ) : !inside ? null : (
        <>
          <div
            ref={arrow}
            className="absolute top-0 left-0 will-change-transform"
          >
            {/* A rounded triangle, NOT the OS pointer.
             *
             * The first pass drew the classic hooked arrow — the notched silhouette
             * with a tail — which is the shape an operating system uses. Figma's
             * multiplayer cursor is a plain three-sided arrowhead, and that
             * difference is most of what makes the reference read as "someone else
             * is in this file" rather than "here is your mouse".
             *
             * The corner rounding comes from stroking the path in its own fill
             * colour with a round line join, which is cheaper and more even than
             * hand-authoring arcs at each vertex. The drop shadow does the work the
             * old contrasting outline did: separation when the cursor passes over
             * the dark Projects button, without a hard rim around the shape. */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary drop-shadow-sm"
            >
              <path
                d="M5 4L20 12.5L11.5 20Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {/* Down and to the right of the tip, not level with it. Figma hangs the
              label off the cursor's tail; sitting it at the same y made the two read
              as an arrow and a separate pill floating beside each other. */}
          <span
            ref={chip}
            className="bg-primary text-primary-foreground absolute top-0 left-0 mt-4 ml-3.5 rounded-md px-2 py-1 font-mono text-[11px] leading-none whitespace-nowrap shadow-md will-change-transform"
          >
            {label}
          </span>
        </>
      )}
    </div>
  );
}
