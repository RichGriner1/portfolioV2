"use client";

import { useEffect, useRef, useState } from "react";

import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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

/**
 * The timed fallback advance, for a step nobody performs.
 *
 * Completing a step's gesture is what actually retires it — `mark()` below
 * ticks it off and the next render shows the following one. This timer only
 * covers the visitor who reads the chip and ignores it: 8s is long enough
 * that it never fires on someone who's mid-attempt, short enough that the
 * tutorial still ends on its own for someone who never tries the gesture
 * at all.
 */
const STEP_MS = 8000;

/** Screen px of travel with the button down before a press reads as a drag. */
const DRAG_THRESHOLD = 24;

/**
 * A gesture the board honours, in the words of whoever is holding the mouse.
 *
 * `cue` is the input and `text` is what it does, kept apart so the chip can give
 * them different weight — the input is the part you have to copy, the result is
 * the part that tells you whether you want to. `id` is what the gesture-watcher
 * ticks off, so a step nobody needs is never shown.
 */
type Step = {
  id: "drag" | "zoom" | "panx" | "keys";
  cue: Bilingual<string>;
  text: Bilingual<string>;
};

/**
 * The sequence, which depends on what the visitor is holding.
 *
 * Two axes, and only one of them is knowable at first paint:
 *
 *   - OS decides the zoom modifier, ⌘ against Ctrl, and `navigator` answers that
 *     before anything has been touched. Naming the wrong key is worse than naming
 *     no key, because the visitor tries it, nothing happens, and they conclude
 *     the board is broken rather than that the hint is.
 *   - Mouse against trackpad has NO first-paint answer — there is no API for it,
 *     only the shape of a wheel event, which by definition arrives after the
 *     visitor has already scrolled. So it starts as a prior (Mac ships a trackpad
 *     on every laptop; a Windows desktop ships a mouse) and corrects itself the
 *     first time a real wheel event says otherwise, which lands mid-sequence and
 *     fixes the steps still to come.
 *
 * A mouse and a trackpad genuinely need different instructions here, not just
 * different wording: a trackpad pans both axes with two fingers and zooms with a
 * pinch, while a wheel has one axis and needs a modifier for each of the other
 * two. Telling a mouse user to pinch is telling them nothing.
 */
function stepsFor(mac: boolean, trackpad: boolean): Step[] {
  const zoomKey = mac ? "\u2318" : "Ctrl";
  return [
    {
      id: "drag",
      cue: { en: "Drag", es: "Arrastra" },
      text: { en: "move around", es: "muévete por el tablero" },
    },
    trackpad
      ? {
          id: "zoom",
          cue: { en: "Pinch", es: "Pellizca" },
          text: { en: "zoom in and out", es: "acerca y aleja" },
        }
      : {
          id: "zoom",
          cue: { en: `${zoomKey} + scroll`, es: `${zoomKey} + rueda` },
          text: { en: "zoom in and out", es: "acerca y aleja" },
        },
    trackpad
      ? {
          id: "panx",
          cue: { en: "Two fingers", es: "Dos dedos" },
          text: {
            en: "left, right, up and down",
            es: "izquierda, derecha, arriba y abajo",
          },
        }
      : {
          id: "panx",
          cue: { en: "Shift + scroll", es: "Mayús + rueda" },
          text: { en: "left and right", es: "izquierda y derecha" },
        },
    {
      id: "keys",
      cue: {
        en: "\u2190 \u2192 \u2191 \u2193",
        es: "\u2190 \u2192 \u2191 \u2193",
      },
      text: { en: "nudge anywhere", es: "ajusta poco a poco" },
    },
  ];
}

/**
 * Whether this is a Mac, for the zoom modifier only.
 *
 * `userAgentData.platform` where it exists, `navigator.platform` where it
 * doesn't. The latter is deprecated and still the only thing Safari and Firefox
 * answer, and the cost of it eventually returning nothing is that a Mac visitor
 * is told "Ctrl" — wrong, but not broken, since the fallback is a real key on a
 * real keyboard rather than a blank.
 */
function isMac(): boolean {
  const uaPlatform = (
    navigator as Navigator & { userAgentData?: { platform?: string } }
  ).userAgentData?.platform;
  const platform = uaPlatform ?? navigator.platform ?? "";
  return /mac/i.test(platform);
}

/**
 * Read a wheel event for what produced it.
 *
 * A pinch arrives as a wheel with `ctrlKey` set and nothing else does, so that
 * one is certain. Past that it's the shape of the delta: a wheel notch is a
 * whole number of lines or a round pixel step with no horizontal component,
 * where a trackpad streams small fractional deltas on both axes. Fractional or
 * two-axis is the trackpad tell; a lone integer delta of 50px or more is the
 * mouse tell. Anything else returns null rather than guessing, and the prior
 * stands.
 */
function readWheelDevice(e: WheelEvent): "mouse" | "trackpad" | null {
  if (e.ctrlKey) return "trackpad";
  if (e.deltaX !== 0 || !Number.isInteger(e.deltaY)) return "trackpad";
  if (e.deltaMode === 0 && Math.abs(e.deltaY) >= 50) return "mouse";
  if (e.deltaMode === 1) return "mouse";
  return null;
}

export function CanvasCursor({
  label = "You",
  /**
   * Set while the CV overlay is open. The cursor then swaps its arrow-and-label
   * skin for a close affordance over the dismissible backdrop — Shopify's move, and
   * the answer to the overlay leaving the canvas with no visible pointer at all.
   */
  closeMode = false,
  /**
   * Whether the board is ready to be taught — pannable, past its opening camera
   * move, and not covered by an overlay. The sequence itself lives in here; the
   * caller only says when the board can honour what it's about to promise.
   *
   * A canvas only reads as navigable to someone who has used one. The rail
   * guarantees every section is one click away, so nobody is ever stranded — but
   * a visitor navigating a board through a menu isn't using the board. The chip
   * already following the pointer is the one surface that's guaranteed to be
   * where the visitor is looking, so it does the teaching and then stops.
   *
   * Deliberately NOT a tooltip, an overlay or a coach mark. Those are objects a
   * visitor has to dismiss; this one is already on screen, already attached to
   * the thing it's talking about, and retires itself.
   */
  teach = false,
}: {
  label?: string;
  closeMode?: boolean;
  teach?: boolean;
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

  const { lang } = useLang();
  /**
   * The tutorial's state: which input we think the visitor is holding, which
   * step is showing, and which gestures they've already performed.
   *
   * `done` is a Set of step ids rather than a counter because the sequence SKIPS
   * what the visitor has already done. Someone who drags the board on the first
   * second has been taught that one by the board itself, and repeating it back
   * to them is the part of every onboarding tour that makes people close it.
   * `step` is an index into the full list; the advance below walks past anything
   * in `done`, so the two never have to be kept in sync.
   */
  const [mac, setMac] = useState(false);
  const [trackpad, setTrackpad] = useState(false);
  const [step, setStep] = useState(0);
  /**
   * True once the visitor presses Escape while a step is showing. Forces
   * `current` to null for good — Esc is the exit, since the chip trails the
   * pointer inside a `pointer-events-none` layer and can't hold a clickable
   * ×. The chip collapses back to just the label, same as the closed state
   * between steps.
   */
  const [dismissed, setDismissed] = useState(false);
  const done = useRef(new Set<Step["id"]>());
  /**
   * Bumped whenever a gesture lands, purely to re-run the advance effect.
   *
   * `done` is a ref, not state — it's read inside a timer that must not restart
   * every time it changes, or a visitor performing gestures in quick succession
   * would keep resetting the clock on the step they're currently reading. This
   * counter is the explicit, once-per-gesture nudge instead.
   */
  const [gestures, setGestures] = useState(0);

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

  // Platform is read once, on the client. It decides one word — ⌘ or Ctrl — and
  // `navigator` doesn't exist during the server render.
  useEffect(() => {
    const onMac = isMac();

    setMac(onMac);
    // The prior, before any wheel event has had a chance to correct it. Every
    // Mac laptop ships a trackpad; a Windows or Linux machine with a fine
    // pointer is more often a desktop with a mouse.

    setTrackpad(onMac);
  }, []);

  /**
   * Watch for the gestures the tutorial teaches, and tick them off.
   *
   * Runs whenever the cursor is live rather than only while teaching, so a
   * gesture performed during the opening camera move still counts — that's
   * exactly the visitor who needs the fewest steps.
   *
   * The wheel listener does double duty: it ticks off a gesture AND reads the
   * device off the event shape, which is the only moment either is knowable.
   */
  useEffect(() => {
    if (!enabled) return;
    const host = wrap.current?.parentElement;
    if (!host) return;
    const mark = (id: Step["id"]) => {
      if (done.current.has(id)) return;
      done.current.add(id);
      setGestures((n) => n + 1);
    };

    /**
     * Only what happens ON the board counts.
     *
     * The listeners sit on `window` because a pan can carry the pointer off the
     * host mid-gesture and a listener on the host would lose the rest of it. That
     * makes the origin the thing to test instead — and it has to be tested, or
     * every drag anywhere on the page marks the board as learned. Measured that
     * one live: the tutorial opened on step three because a drag somewhere else
     * entirely had already ticked off two gestures nobody performed here.
     *
     * A press that lands on a link or a control is excluded for the same reason.
     * Clicking a case study and twitching 25px before releasing is not a pan —
     * the board doesn't move, so the visitor has learned nothing and the step
     * still has a job to do.
     */
    const onBoard = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target || !host.contains(target)) return false;
      return !target.closest("a, button, input, textarea, select, label");
    };

    let from: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      from = onBoard(e) ? { x: e.clientX, y: e.clientY } : null;
    };
    const onMove = (e: PointerEvent) => {
      if (!from) return;
      if (Math.hypot(e.clientX - from.x, e.clientY - from.y) > DRAG_THRESHOLD)
        mark("drag");
    };
    const onUp = () => {
      from = null;
    };
    const onWheel = (e: WheelEvent) => {
      // The device read is NOT gated on the board — a wheel anywhere tells you
      // what the visitor is holding, and knowing that early is what keeps the
      // remaining steps from naming a gesture their hardware can't perform.
      const device = readWheelDevice(e);
      if (device) setTrackpad(device === "trackpad");
      if (!onBoard(e)) return;
      // A pinch or a modifier held over the wheel is a zoom; a plain wheel with
      // a horizontal component, or Shift held, is the sideways pan. A plain
      // vertical wheel is neither — it's the gesture nobody has to be taught.
      if (e.ctrlKey || e.metaKey) mark("zoom");
      else if (e.shiftKey || e.deltaX !== 0) mark("panx");
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key.startsWith("Arrow") ||
        e.key === "PageUp" ||
        e.key === "PageDown"
      )
        mark("keys");
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled]);

  const steps = stepsFor(mac, trackpad);
  /**
   * The step actually on screen: `step`, or the next one past it the visitor
   * hasn't already performed. Computed during render rather than stored, so a
   * gesture landing on the step currently showing replaces it on the same frame
   * instead of leaving a stale instruction up for the rest of its 2.4s.
   */
  let showAt = step;
  while (showAt < steps.length && done.current.has(steps[showAt].id)) showAt++;
  const current = dismissed
    ? null
    : showAt < steps.length
      ? steps[showAt]
      : null;

  /**
   * Advance one step per interval, and stop when the list runs out.
   *
   * `gestures` is in the dependency list so ticking a step off re-runs this and
   * restarts the clock — the replacement step gets its own full read, rather
   * than inheriting whatever was left of the one it displaced.
   */
  useEffect(() => {
    if (!teach || !current) return;
    const timer = setTimeout(() => setStep(showAt + 1), STEP_MS);
    return () => clearTimeout(timer);
  }, [teach, current, showAt, gestures]);

  /**
   * Escape dismisses the tutorial for good, separate from the gesture-watcher's
   * own `onKey` above (which only ever ticks the "keys" step off) so the two
   * don't tangle over the same event.
   */
  useEffect(() => {
    if (!teach || dismissed) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDismissed(true);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [teach, dismissed]);

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
            className="bg-primary text-primary-foreground absolute top-0 left-0 mt-4 ml-3.5 flex items-center rounded-md px-2 py-1 font-mono text-[11px] leading-none whitespace-nowrap shadow-md will-change-transform"
          >
            {/* Three tiers, so the chip reads as one object with a hierarchy
                rather than a run-on line: the label at full weight because it's
                the visitor's name on the board, the CUE boxed like a key because
                it's the part they have to copy, and the RESULT dimmed because
                it's the part they only have to understand. Without the boxing,
                "Shift + scroll left and right" is six words of the same
                importance and nobody can see where the instruction ends. */}
            <span className="font-medium">{label}</span>
            {/* The padding lives on the INNER span. `max-w-0` clips content, not
                box, so a padded outer element would leave a few px of coloured
                gutter sitting past the label in the closed state — a chip that
                reads as "You " with a trailing space. */}
            <span
              className={cn(
                "ease-out-soft overflow-hidden transition-all duration-[var(--duration-slow)]",
                teach && current ? "max-w-[380px]" : "max-w-0 opacity-0"
              )}
            >
              <span className="flex items-center gap-1.5 pl-2">
                <span
                  aria-hidden
                  className="bg-primary-foreground/25 h-3.5 w-px shrink-0"
                />
                {/* Keyed on the step id so React swaps the node rather than
                    mutating the text of one that's mid-transition — the fade
                    below has to run on arrival, and an in-place text change
                    gives it nothing to animate from. */}
                <span
                  key={current?.id ?? "none"}
                  className="animate-in fade-in slide-in-from-bottom-0.5 flex items-center gap-1.5 duration-[var(--duration-slow)]"
                >
                  <span className="bg-primary-foreground/20 rounded-[3px] px-1.5 py-0.5">
                    {current ? pick(current.cue, lang) : ""}
                  </span>
                  <span className="opacity-70">
                    {current ? pick(current.text, lang) : ""}
                  </span>
                </span>
              </span>
            </span>
          </span>
        </>
      )}
    </div>
  );
}
