"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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
 */

/**
 * Where the collapsed choice is remembered. Versioned like `TAUGHT_KEY` in
 * canvas-cursor.tsx: if the legend's shape ever changes, bumping `v1` retires
 * the old record instead of needing a migration for a value this disposable.
 */
const COLLAPSED_KEY = "canvas-help-collapsed-v1";

export function CanvasHelp({ show }: { show: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const titleId = useId();

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
    const onPointerDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) collapse();
    };
    // Closes the legend when focus leaves `wrap` entirely (e.g. Tab past the
    // last focusable element) — the pointer/Escape handlers above don't cover
    // keyboard-only navigation away from the panel.
    const onFocusOut = (e: FocusEvent) => {
      if (!wrap.current?.contains(e.relatedTarget as Node)) collapse();
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
  }, [isOpen]);

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
    // Bottom-right, matching the rail's own p-4 gutter. The rail itself sits
    // centered at the bottom of the viewport (`inset-x-0 ... justify-center`),
    // so this corner is clear of it — and everything else fixed to the board
    // (theme, language, zoom) lives inside that same centered bar. z-30 clears
    // the rail (z-20) but stays below the CV backdrop/panel (z-40/z-50), which
    // doesn't matter in practice since `show` already goes false while the CV
    // is open, but keeps the stacking honest if that ever changes.
    <div ref={wrap} className="fixed right-4 bottom-4 z-30">
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
            exit={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 8 }}
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
                at rest and answers to hover/focus on top of that. */}
            <div
              className={cn(
                "bg-card border-border rounded-2xl border p-4 shadow-lg",
                "opacity-60 focus-within:opacity-100 hover:opacity-100",
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
            </div>
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
  );
}
