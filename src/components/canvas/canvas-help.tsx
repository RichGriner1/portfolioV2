"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { STEPS as GESTURES } from "@/components/canvas/canvas-cursor";
import { EASE } from "@/components/motion/constants";
import { pick, t, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The persistent counterpart to the timed chip in canvas-cursor.tsx.
 *
 * The chip teaches once, on its own clock, to whoever is looking at the
 * cursor when it appears — and retires itself the moment every gesture is
 * marked taught, or on Escape. Anyone who missed that window (looked away,
 * dismissed it, or is a returning visitor the chip never shows again) has no
 * way back to the same four lines. This is that way back: the legend itself,
 * open by default in the same corner the chip's ? button used to occupy,
 * showing the same four gestures for as long as the board is pannable.
 *
 * Idle, the panel sits at reduced opacity so it reads as present without
 * competing with the board; hovering or focusing it brings it to full
 * opacity. The × collapses it to the same 44px ? button the legend used to
 * hide behind, and that choice is remembered in localStorage — dismiss it
 * once and it stays dismissed on later visits.
 *
 * It shares `GESTURES` with the chip rather than keeping its own copy, and it
 * never touches `TAUGHT_KEY` — reading the legend teaches nothing, so it
 * can't retire anything either.
 *
 * The panel can be dragged anywhere on screen, like an object on the board.
 * While it moves, it snaps to anything marked `data-snap` and a red guide
 * shows each line they share. Those targets are the claim frame and the
 * sections: the board's top-level objects, which is what Figma snaps a
 * top-level object to. The work frames are children of a section, so they're
 * left out. It stays a screen overlay rather than a board object, so it keeps
 * its size at every zoom and stays in view while the board pans under it.
 */

/**
 * Where the collapsed choice is remembered. Versioned like `TAUGHT_KEY` in
 * canvas-cursor.tsx: if the legend's shape ever changes, bumping `v1` retires
 * the old record instead of needing a migration for a value this disposable.
 */
const COLLAPSED_KEY = "canvas-help-collapsed-v1";

/** How close, in screen px, a panel line has to come to a target's to snap. */
const SNAP = 6;
/** Screen px the panel keeps clear of the viewport edge while it's dragged. */
const EDGE = 8;

type Box = { left: number; top: number; right: number; bottom: number };
type Guide = { axis: "x" | "y"; at: number; from: number; to: number };

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

type Line = { at: number; kind: "start" | "centre" | "end" };

/** A box's lines on one axis: left, centre, right (or top, middle, bottom). */
const linesOf = (b: Box, axis: Guide["axis"]): Line[] => {
  const [start, end] = axis === "x" ? [b.left, b.right] : [b.top, b.bottom];
  return [
    { at: start, kind: "start" },
    { at: (start + end) / 2, kind: "centre" },
    { at: end, kind: "end" },
  ];
};

/**
 * Which lines may align. A centre only meets a centre; an edge meets any
 * edge, which covers flush edges and objects set side by side.
 */
const pairs = (a: Line, b: Line) =>
  (a.kind === "centre") === (b.kind === "centre");

/**
 * The pixel a 1px guide fills to sit ON a line: an edge's outermost pixel,
 * inside the box, so the guide lands on the border rather than beside it, and
 * a centre's middle pixel.
 */
const pixelOf = (l: Line) =>
  l.kind === "end"
    ? Math.round(l.at) - 1
    : l.kind === "centre"
      ? Math.round(l.at - 0.5)
      : Math.round(l.at);

/** Everything on the board the panel can line up with, as it sits on screen. */
const snapTargets = (): Box[] =>
  [...document.querySelectorAll("[data-snap]")]
    .map((el) => el.getBoundingClientRect())
    .filter(
      (r) =>
        r.width > 0 &&
        r.right > 0 &&
        r.bottom > 0 &&
        r.left < window.innerWidth &&
        r.top < window.innerHeight
    );

/** The smallest shift, within SNAP, that lands one of the box's lines on a target's. */
function nudge(box: Box, targets: Box[], axis: Guide["axis"]) {
  let best = Infinity;
  for (const t of targets)
    for (const p of linesOf(box, axis))
      for (const q of linesOf(t, axis))
        if (pairs(p, q) && Math.abs(q.at - p.at) < Math.abs(best))
          best = q.at - p.at;
  return Math.abs(best) <= SNAP ? best : 0;
}

/**
 * One guide per line the box shares with a target, spanning both objects, as
 * a design tool draws them. Targets on the same line merge into one segment.
 */
function guidesFor(box: Box, targets: Box[]) {
  const found = new Map<string, Guide>();
  for (const axis of ["x", "y"] as const)
    for (const t of targets)
      for (const p of linesOf(box, axis))
        for (const q of linesOf(t, axis)) {
          if (!pairs(p, q) || Math.abs(q.at - p.at) > 0.5) continue;
          // On the target's pixel: it's the object that stays put.
          const at = pixelOf(q);
          const from = Math.round(
            axis === "x" ? Math.min(box.top, t.top) : Math.min(box.left, t.left)
          );
          const to = Math.round(
            axis === "x"
              ? Math.max(box.bottom, t.bottom)
              : Math.max(box.right, t.right)
          );
          const key = `${axis}${at}`;
          const seen = found.get(key);
          found.set(
            key,
            seen
              ? {
                  ...seen,
                  from: Math.min(seen.from, from),
                  to: Math.max(seen.to, to),
                }
              : { axis, at, from, to }
          );
        }
  return [...found.values()];
}

export function CanvasHelp({ show }: { show: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const titleId = useId();

  /**
   * Where the panel has been dragged to, as an offset from its corner. Held
   * here rather than on the panel, so closing and reopening it puts it back
   * where it was left.
   */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  /**
   * Set once the panel has been moved. A placed panel stays until × or Escape:
   * the outside-click and focus-out collapses below would otherwise throw it
   * away the first time the board is touched.
   */
  const [placed, setPlaced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  /**
   * The pointer, the panel's box and its offset when the drag started. Every
   * move is worked out from here rather than from the last move, so a snap
   * never carries into the next frame.
   */
  const press = useRef<{
    px: number;
    py: number;
    ox: number;
    oy: number;
    box: Box;
  } | null>(null);

  // A placement only holds for the window it was made in: a smaller one could
  // strand the panel off-screen, so a resize sends it back to its corner.
  useEffect(() => {
    const reset = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("resize", reset);
    return () => window.removeEventListener("resize", reset);
  }, [x, y]);

  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    // The × keeps its click; the rest of the card is the handle.
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    // No focus change and no text selection: a press here is a grab. Moving
    // focus off the × would also fire the focus-out collapse below.
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    press.current = {
      px: e.clientX,
      py: e.clientY,
      ox: x.get(),
      oy: y.get(),
      box: { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
    };
    setDragging(true);
  };

  const moveDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p) return;
    const w = p.box.right - p.box.left;
    const h = p.box.bottom - p.box.top;
    // Where the pointer puts the panel, held inside the viewport.
    const left = clamp(
      p.box.left + e.clientX - p.px,
      EDGE,
      window.innerWidth - EDGE - w
    );
    const top = clamp(
      p.box.top + e.clientY - p.py,
      EDGE,
      window.innerHeight - EDGE - h
    );
    const targets = snapTargets();
    const raw = { left, top, right: left + w, bottom: top + h };
    const sx = nudge(raw, targets, "x");
    const sy = nudge(raw, targets, "y");
    const box = {
      left: left + sx,
      top: top + sy,
      right: left + sx + w,
      bottom: top + sy + h,
    };
    x.set(p.ox + box.left - p.box.left);
    y.set(p.oy + box.top - p.box.top);
    setGuides(guidesFor(box, targets));
    if (box.left !== p.box.left || box.top !== p.box.top) setPlaced(true);
  };

  const endDrag = () => {
    press.current = null;
    setDragging(false);
    setGuides([]);
  };

  /**
   * Which button an isOpen change should move focus to, if any.
   *
   * Set only by the interactive dismiss/open paths below — the × button, the
   * ? trigger, Escape, a click outside, and tabbing away. Left `null`
   * everywhere else: the initial default (open by default, before the
   * localStorage read below has had a chance to run), the localStorage
   * rehydration itself, and the `show`-driven auto-close during render. None
   * of those are a visitor asking for focus to move, so none of them should
   * steal it from wherever it already is.
   */
  const focusTarget = useRef<"close" | "trigger" | null>(null);

  // Board went un-pannable, or an overlay covered it — close with it rather
  // than leaving the legend open over whatever replaced the board. Adjusting
  // state during render (React's documented alternative to an effect that
  // mirrors a prop) instead of setState-in-an-effect, which react-hooks'
  // set-state-in-effect rule rejects.
  const [prevShow, setPrevShow] = useState(show);
  if (show !== prevShow) {
    setPrevShow(show);
    if (!show) setOpen(false);
  }
  const isOpen = open && show;

  /**
   * Rehydrate a returning visitor's collapsed choice.
   *
   * Renders expanded on the server and on first client paint — there's no
   * way to know the stored preference before mount — and reads it right
   * after, same guarded try/catch as the language rehydrate in i18n.tsx: a
   * private window or storage-disabled browser throws on read, and the
   * legend just stays expanded, same as a first-time visitor.
   */
  useEffect(() => {
    try {
      if (window.localStorage.getItem(COLLAPSED_KEY) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(false);
      }
    } catch {
      // No storage, no memory. Stays expanded.
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const collapse = () => {
      focusTarget.current = "trigger";
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") collapse();
    };
    // Neither of these applies once the panel has been placed: see `placed`.
    const onPointerDown = (e: PointerEvent) => {
      if (!placed && !wrap.current?.contains(e.target as Node)) collapse();
    };
    // Closes the legend when focus leaves `wrap` entirely (e.g. Tab past the
    // last focusable element) — the pointer/Escape handlers above don't cover
    // keyboard-only navigation away from the panel.
    const onFocusOut = (e: FocusEvent) => {
      if (!placed && !wrap.current?.contains(e.relatedTarget as Node))
        collapse();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    wrap.current?.addEventListener("focusout", onFocusOut);
    const wrapEl = wrap.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      wrapEl?.removeEventListener("focusout", onFocusOut);
    };
  }, [isOpen, placed]);

  /**
   * Move focus to whichever button `focusTarget` names, then clear it. Only
   * the click/Escape/outside-click/focusout handlers above and the ?
   * trigger's own handler below ever set it, so a silent open or close (the
   * default, the localStorage read, the `show`-driven auto-close) never
   * moves focus nobody asked to move.
   */
  useEffect(() => {
    const target = focusTarget.current;
    focusTarget.current = null;
    if (target === "close") closeRef.current?.focus();
    else if (target === "trigger") triggerRef.current?.focus();
  }, [isOpen]);

  const persistCollapsed = (collapsed: boolean) => {
    try {
      window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      // No storage, no memory. The choice just doesn't survive a reload.
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Bottom-right, matching the rail's own p-4 gutter. The rail itself sits
        centered at the bottom of the viewport (`inset-x-0 ... justify-center`),
        so this corner is clear of it — and everything else fixed to the board
        (theme, language, zoom) lives inside that same centered bar. z-30 clears
        the rail (z-20) but stays below the CV backdrop/panel (z-40/z-50), which
        doesn't matter in practice since `show` already goes false while the CV
        is open, but keeps the stacking honest if that ever changes. */}
      {/* `data-cursor-hide`: the canvas cursor draws the pointer here, so the
          site's dot steps aside instead of doubling it. */}
      <div ref={wrap} data-cursor-hide className="fixed right-4 bottom-4 z-30">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              role="dialog"
              aria-labelledby={titleId}
              initial={{
                opacity: 0,
                scale: reduced ? 1 : 0.96,
                y: reduced ? 0 : 8,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: reduced ? 1 : 0.96,
                y: reduced ? 0 : 8,
              }}
              transition={{ duration: reduced ? 0.1 : 0.2, ease: EASE }}
              className="absolute right-0 bottom-full mb-3 w-64"
            >
              {/* The idle/hover opacity lives on its own inner layer rather than
                on this `motion.div`. Framer writes `opacity` to this element's
                inline style for the enter/exit animation above and never
                clears it once the animation settles, so a Tailwind opacity
                utility placed on the SAME element would be permanently
                overridden by that inline style the instant the entrance
                finishes. Nesting keeps the two independent: this element
                fades 0→1 once on mount, the inner one sits at reduced opacity
                at rest and answers to hover/focus on top of that. The drag
                offset rides on this inner layer too, as a transform only, so
                it never touches either opacity. */}
              <motion.div
                style={{ x, y }}
                // The canvas cursor turns into a hand over this.
                data-cursor-drag
                onPointerDown={startDrag}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={cn(
                  "bg-card border-border rounded-2xl border p-4 shadow-lg",
                  "touch-none select-none",
                  dragging
                    ? "cursor-grabbing opacity-100"
                    : "cursor-grab opacity-60 focus-within:opacity-100 hover:opacity-100",
                  reduced
                    ? "transition-none"
                    : "ease-out-soft transition-opacity duration-[var(--duration-base)]"
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2
                    id={titleId}
                    className="text-foreground text-sm font-semibold"
                  >
                    {t("canvas.help_title", lang)}
                  </h2>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => {
                      focusTarget.current = "trigger";
                      setOpen(false);
                      persistCollapsed(true);
                    }}
                    aria-label={t("canvas.help_close", lang)}
                    className="text-muted-foreground hover:text-foreground text-lg leading-none transition-colors"
                  >
                    ×
                  </button>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {GESTURES.map((gesture) => (
                    <li key={gesture.id} className="flex items-center gap-2.5">
                      <span className="bg-muted text-foreground shrink-0 rounded-[3px] px-1.5 py-0.5 font-mono text-[11px] leading-none">
                        {pick(gesture.cue, lang)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {pick(gesture.text, lang)}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => {
              focusTarget.current = "close";
              setOpen(true);
              persistCollapsed(false);
            }}
            aria-expanded={false}
            // No aria-controls: the panel unmounts on close so AnimatePresence can
            // play its exit animation, so the id would not always resolve
            // to a live element. Keeping it mounted with `hidden` to satisfy
            // aria-controls would kill that exit animation, so this drops the
            // attribute instead — aria-expanded still tells the trigger's state.
            aria-label={t("canvas.help_open", lang)}
            className="bg-card border-border text-foreground hover:bg-muted grid size-11 place-items-center rounded-full border font-mono text-sm shadow-lg transition-colors"
          >
            ?
          </button>
        )}
      </div>
      {/* The guides. After the panel in the DOM, on the same layer, so they
          draw over it the way a design tool draws them over the object being
          moved. A guide spans every object on its line, including ones partly
          off-screen, so the layer clips to the viewport. */}
      {guides.length > 0 && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
        >
          {guides.map((g) => (
            <span
              key={`${g.axis}${g.at}`}
              className="bg-canvas-guide absolute"
              style={
                g.axis === "x"
                  ? { left: g.at, top: g.from, width: 1, height: g.to - g.from }
                  : { top: g.at, left: g.from, height: 1, width: g.to - g.from }
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
