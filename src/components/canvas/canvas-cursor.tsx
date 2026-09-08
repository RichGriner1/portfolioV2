"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
 * covers the visitor who reads the chip and ignores it.
 *
 * Was 8s, which across four steps meant up to 32 seconds of chip. It also never
 * behaved like 8s: the effect that owns it depended on the step OBJECT, which
 * the step list was rebuilt on every render, so any re-render tore it down and
 * started a fresh one — and canvas-site calls `setHovered` on every pointermove
 * over the board, which re-renders this component. Moving the mouse across
 * sections held a step open indefinitely. The clock is keyed on the step id now,
 * and 5s is enough to read six words without outstaying its welcome.
 */
const STEP_MS = 5000;

/** Screen px of travel with the button down before a press reads as a pan. */
const DRAG_THRESHOLD = 24;

/**
 * Where the tutorial remembers what it has already taught.
 *
 * Nothing here persisted before, so every reload walked a returning visitor
 * through their own canvas from step one. Versioned in the key rather than in
 * the payload: if the sequence is ever reshaped, bumping `v1` retires the old
 * record instead of needing a migration for a value this disposable.
 */
const TAUGHT_KEY = "rg:canvas-tutorial:v1";

/**
 * A gesture the board honours, in the words of whoever is holding the mouse.
 *
 * `cue` is the input and `text` is what it does, kept apart so the chip can give
 * them different weight — the input is the part you have to copy, the result is
 * the part that tells you whether you want to. `id` is what the gesture-watcher
 * ticks off, so a step nobody needs is never shown.
 *
 * A `cue` MUST name a physical action — what the hands actually do. It once read
 * "Drag", which is the RESULT, and the verdict on that was blunt: it "literally
 * means nothing to a user if they need to click a button or use both fingers".
 * It never says to hold the button down. So every cue is a key, a button, or a
 * scroll.
 */
type Step = {
  id: "pan" | "zoom" | "panx" | "keys";
  cue: Bilingual<string>;
  text: Bilingual<string>;
};

/**
 * The sequence. One list, for everybody.
 *
 * This deliberately detects NOTHING — not the OS, not the pointing device — and
 * that is the whole design, arrived at the long way round.
 *
 * The OS branch went first. The zoom modifier used to be ⌘ on macOS and Ctrl
 * elsewhere, read from `navigator`. But `navigator` reports the OS, not the
 * KEYBOARD, and those are different things: Richard runs macOS with a Windows
 * keyboard, so the chip printed "⌘" for a key whose cap says Win, naming a
 * modifier he could not find. No API exposes key legends either —
 * `KeyboardEvent.code` is "MetaLeft" whether the cap reads ⌘, Win or Super.
 *
 * The device branch went second, and that one was never winnable. No web API
 * reports whether a mouse is plugged in: `PointerEvent.pointerType` says
 * "mouse" for a trackpad too, and `maxTouchPoints` is about touchscreens. The
 * only evidence is the shape of a wheel event, which arrives after the visitor
 * has already scrolled, and even then it is a guess — a Magic Mouse scrolls
 * like a trackpad. Every version of that guess shipped a wrong instruction to
 * somebody: seeding from the OS told a Mac-with-a-mouse to "Pinch", and naming
 * both options read as mush, since half of "Click + drag or two fingers"
 * describes hardware the reader isn't holding.
 *
 * What dissolved it: every gesture the board honours is ALREADY true on both
 * devices. A trackpad's two-finger swipe is a scroll, Shift makes it sideways,
 * and Ctrl + scroll zooms exactly as a pinch would. "Scroll" is not a hedge —
 * it is the honest word for what a wheel and a trackpad both do. So one list is
 * correct for every visitor on every OS with any hardware, and there is nothing
 * left that can be wrong because nothing is being detected.
 *
 * The cost, stated plainly: a trackpad visitor is never told "Pinch", their most
 * natural zoom. They are told Ctrl + scroll, which genuinely works.
 *
 * A module constant, not a function, so the objects are referentially stable
 * across renders — see the fallback timer, which used to restart every render
 * because this rebuilt them.
 */
const STEPS: Step[] = [
  // TODO(afi-redaccion): "Rueda", "arriba y abajo", "Mayús", "acerca y aleja",
  // "ajusta poco a poco".
  {
    id: "pan",
    cue: { en: "Scroll", es: "Rueda" },
    text: { en: "up and down", es: "arriba y abajo" },
  },
  {
    id: "panx",
    cue: { en: "Shift + scroll", es: "May\u00fas + rueda" },
    text: { en: "left and right", es: "izquierda y derecha" },
  },
  {
    id: "zoom",
    cue: { en: "Ctrl + scroll", es: "Ctrl + rueda" },
    text: { en: "zoom in and out", es: "acerca y aleja" },
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
  /**
   * Mirrors `dismissed` for `remember` alone.
   *
   * `remember` has to be identity-stable, since two effects depend on it, so it
   * cannot close over the `dismissed` STATE. Without this ref, a gesture marked
   * after an Esc would write `dismissed: false` back over the record and the
   * tutorial would return on the next visit.
   */
  const dismissedRef = useRef(false);

  /**
   * Persist what has been taught. Every access guarded — a private window or a
   * browser with site data blocked throws on both read and write, and the
   * tutorial behaves exactly as it did before in that case.
   */
  const remember = useCallback((dismiss?: boolean) => {
    if (dismiss) dismissedRef.current = true;
    try {
      window.localStorage.setItem(
        TAUGHT_KEY,
        JSON.stringify({
          done: [...done.current],
          dismissed: dismissedRef.current,
        })
      );
    } catch {
      // No storage, no memory. The tutorial still runs.
    }
  }, []);

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

  /**
   * Rehydrate what the visitor has already been taught, so a reload doesn't
   * teach them their own canvas from step one again.
   *
   * Every access is guarded: a private window, blocked site data or a browser
   * with storage disabled throws on read, and the tutorial simply runs as it
   * always did in that case. Runs before the gesture-watcher mounts so the very
   * first render already reflects a returning visitor.
   */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(TAUGHT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { done?: string[]; dismissed?: boolean };
      for (const id of saved.done ?? []) done.current.add(id as Step["id"]);
      if (saved.dismissed) {
        dismissedRef.current = true;
        setDismissed(true);
      }
      if (saved.done?.length) setGestures((n) => n + 1);
    } catch {
      // No storage, no memory. Not worth reporting.
    }
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
      remember();
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
     * What is NOT tested any more is whether the press landed on a link. It used
     * to be, on the reasoning that clicking a case study and twitching 25px
     * before releasing is not a pan. But the board is covered in case-study
     * cards, and it PANS from inside one — a section's surface is
     * `pointer-events-none` precisely so it can be grabbed from anywhere. So the
     * most natural place to grab the board was the one place the tutorial
     * refused to count: the camera moved, the gesture plainly worked, and the
     * chip went on telling the visitor to drag. Measured live — a 150px drag
     * starting on the Afi card moved the board and advanced nothing.
     *
     * `DRAG_THRESHOLD` is what separates a click from a pan, and it is the
     * honest test: past 24px the board has moved, whatever sat under the
     * pointer. A click that never crosses it still navigates and still teaches
     * nothing, which is the case the old exclusion was actually aiming at.
     */
    const onBoard = (e: Event) => {
      const target = e.target as HTMLElement | null;
      return !!target && host.contains(target);
    };

    let from: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      from = onBoard(e) ? { x: e.clientX, y: e.clientY } : null;
    };
    const onMove = (e: PointerEvent) => {
      if (!from) return;
      if (Math.hypot(e.clientX - from.x, e.clientY - from.y) > DRAG_THRESHOLD)
        mark("pan");
    };
    const onUp = () => {
      from = null;
    };
    const onWheel = (e: WheelEvent) => {
      if (!onBoard(e)) return;
      /**
       * Which taught gesture this wheel was. No device to consider any more, so
       * it reads off the modifiers alone.
       *
       * Shift is the sideways pan, and so is a purely horizontal delta, which is
       * how macOS delivers Shift + scroll and how a trackpad delivers a
       * two-finger swipe sideways. A held Ctrl or Meta is the zoom. ANY OTHER
       * WHEEL COMPLETES THE PAN STEP: a comment here once dismissed a plain
       * vertical wheel as "the gesture nobody has to be taught", which had it
       * backwards. canvas-site pans the camera on a bare wheel, so the first
       * thing any visitor does moved the board while the tutorial marked nothing
       * and went on instructing them. It is the primary gesture.
       */
      if (e.ctrlKey || e.metaKey) mark("zoom");
      else if (e.shiftKey || (e.deltaX !== 0 && e.deltaY === 0)) mark("panx");
      else mark("pan");
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
  }, [enabled, remember]);

  const steps = STEPS;
  /**
   * The step actually on screen: `step`, or the next one past it the visitor
   * hasn't already performed. Computed during render rather than stored, so a
   * gesture landing on the step currently showing replaces it on the same frame
   * instead of leaving a stale instruction up for the rest of its 2.4s.
   */
  let showAt = step;
  while (showAt < steps.length && done.current.has(steps[showAt].id)) showAt++;
  const resolved = dismissed
    ? null
    : showAt < steps.length
      ? steps[showAt]
      : null;

  /**
   * Nothing freezes the wording any more, because nothing can change it.
   *
   * There used to be a `shown` Map pinning the first resolution of each step id,
   * because a device correction arriving mid-step rewrote the visible text under
   * the visitor: sitting on the zoom step reading "Pinch", one plain scroll —
   * performing no taught gesture and advancing nothing — silently swapped it for
   * "⌘ + scroll". Same step, different words, which from the visitor's side is
   * indistinguishable from the thing glitching.
   *
   * `STEPS` is a module constant with no device or OS input, so a cue is fixed
   * the moment it is written. The guard had nothing left to guard.
   */
  const current = resolved;

  /**
   * Advance one step per interval, and stop when the list runs out.
   *
   * Keyed on the step ID, never on the step object. This used to build fresh
   * step objects every render, so depending on `current` meant every re-render
   * tore the timer down and started a new one — and canvas-site calls
   * `setHovered` on each pointermove over the board, re-rendering this
   * component. Moving the mouse could hold one step open indefinitely, which is
   * most of why the pacing felt arbitrary. `STEPS` being a constant fixes that
   * at the source; keying on the id keeps it fixed.
   *
   * `gestures` stays in the list so ticking a step off restarts the clock: the
   * replacement gets its own full read rather than inheriting what was left of
   * the step it displaced.
   */
  const currentId = current?.id ?? null;
  useEffect(() => {
    if (!teach || !currentId) return;
    const timer = setTimeout(() => setStep(showAt + 1), STEP_MS);
    return () => clearTimeout(timer);
  }, [teach, currentId, showAt, gestures]);

  /**
   * Escape dismisses the tutorial for good, separate from the gesture-watcher's
   * own `onKey` above (which only ever ticks the "keys" step off) so the two
   * don't tangle over the same event.
   */
  useEffect(() => {
    if (!teach || dismissed) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDismissed(true);
      remember(true);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [teach, dismissed, remember]);

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
