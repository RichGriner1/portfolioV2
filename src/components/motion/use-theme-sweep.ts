"use client";

import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

export type ThemeChoice = "light" | "dark" | "system";
type Resolved = "light" | "dark";
/** Which edge the new theme arrives from. */
type Direction = "ttb" | "btt" | "ltr" | "rtl";

/**
 * Adapted from animate-ui's `theme-toggler` effect primitive
 * (animate-ui.com/docs/components/buttons/theme-toggler).
 *
 * Their version ships as a whole BUTTON that cycles light → dark → system on click.
 * Only the effect is taken here: this site's theme control is a three-item dropdown
 * that sets a mode outright, and it's deliberately paired with the language selector
 * beside it, so swapping in a cycling button would break that pair and hide which
 * mode is active behind a guess.
 *
 * How it works. The View Transitions API snapshots the page, we swap the theme, then
 * animate a `clipPath` on `::view-transition-new(root)` so the new theme wipes across
 * the old one. Two details make it work rather than flicker:
 *
 * - The `dark` class is toggled by hand INSIDE the transition callback, under
 *   `flushSync`. next-themes writes that class asynchronously, which would land after
 *   the snapshot and animate nothing.
 * - `setTheme` is called only once the wipe finishes, so next-themes persists the
 *   choice and re-syncs without fighting the animation mid-flight.
 *
 * The default cross-fade is cancelled in globals.css; without that it plays underneath
 * the wipe and the whole thing reads as a smear.
 */

const CLIP: Record<Direction, [from: string, to: string]> = {
  ttb: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
  btt: ["inset(100% 0 0 0)", "inset(0 0 0 0)"],
  ltr: ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
  rtl: ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
};

/**
 * Top-down, because the control that triggers it lives in the header. A wipe that
 * starts at the opposite edge from the click reads as unrelated to it.
 */
const DIRECTION: Direction = "ttb";

/** `startViewTransition` still isn't in the DOM lib TypeScript ships. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/**
 * CSS time → milliseconds. Tailwind normalises `550ms` in `@theme` down to `.55s`, so
 * a bare `parseFloat` on the computed value returned 0.55 and the wipe ran for half a
 * millisecond — present in the animation list, invisible on screen. Anything that
 * isn't explicitly `ms` is seconds; a unitless time is invalid CSS.
 */
function toMs(value: string, fallback: number): number {
  const v = value.trim();
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n)) return fallback;
  return v.endsWith("ms") ? n : n * 1000;
}

function systemResolved(): Resolved {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Returns a `setTheme` that sweeps. Falls back to an instant change — no animation,
 * no delay before the theme lands — in the three cases where the sweep is wrong:
 *
 * - `prefers-reduced-motion`. This is a 550ms animation across the entire viewport,
 *   which is the largest movement on the site; honouring the preference is not
 *   optional. animate-ui's original doesn't check, so this is an addition.
 * - No `startViewTransition` (Firefox at time of writing, older Safari).
 * - The resolved theme isn't actually changing — picking "system" while system
 *   already matches the current theme. There is nothing to reveal, so a wipe would
 *   be 550ms of animation over an identical picture.
 */
export function useThemeSweep() {
  const { setTheme } = useTheme();

  return useCallback(
    (next: ThemeChoice) => {
      const root = document.documentElement;
      const resolved: Resolved = next === "system" ? systemResolved() : next;
      const unchanged =
        root.classList.contains("dark") === (resolved === "dark");
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const doc = document as ViewTransitionDocument;

      if (unchanged || reduced || !doc.startViewTransition) {
        setTheme(next);
        return;
      }

      const [from, to] = CLIP[DIRECTION];
      const duration = toMs(
        getComputedStyle(root).getPropertyValue("--duration-sweep"),
        550
      );

      void doc
        .startViewTransition(() => {
          flushSync(() => {
            root.classList.toggle("dark", resolved === "dark");
          });
        })
        .ready.then(() => {
          root
            .animate(
              { clipPath: [from, to] },
              {
                duration,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
              }
            )
            .finished.finally(() => setTheme(next));
        })
        // A transition can be abandoned — a second pick mid-wipe, or a tab hidden
        // before it starts. The theme still has to end up where the user asked.
        .catch(() => setTheme(next));
    },
    [setTheme]
  );
}
