"use client";

import * as React from "react";
import { flushSync } from "react-dom";

/**
 * animate-ui's `primitives/effects/theme-toggler`, kept at its upstream path so it can
 * be diffed against the registry (animate-ui.com/r/primitives-effects-theme-toggler).
 *
 * Two deliberate departures from upstream:
 * - `prefers-reduced-motion` skips straight to the theme change. This is a 700ms
 *   animation across the whole viewport, the largest movement on the site.
 * - The duration reads `--duration-sweep` instead of a literal 700, so the value lives
 *   with the rest of the motion scale. Note the unit trap in `toMs()`.
 */

type ThemeSelection = "light" | "dark" | "system";
type Resolved = "light" | "dark";
type Direction = "btt" | "ttb" | "ltr" | "rtl";

type ChildrenRender =
  | React.ReactNode
  | ((state: {
      resolved: Resolved;
      effective: ThemeSelection;
      toggleTheme: (theme: ThemeSelection) => void;
    }) => React.ReactNode);

/** `startViewTransition` still isn't in the DOM lib TypeScript ships. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

function getSystemEffective(): Resolved {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getClipKeyframes(direction: Direction): [string, string] {
  switch (direction) {
    case "rtl":
      return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
    case "ttb":
      return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
    case "btt":
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
    case "ltr":
    default:
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
  }
}

/**
 * CSS time → milliseconds. Tailwind normalises `700ms` in `@theme` down to `.7s`, so a
 * bare `parseFloat` returns 0.7 and the wipe runs for under a millisecond — present in
 * the animation list, invisible on screen. Anything not explicitly `ms` is seconds.
 */
function toMs(value: string, fallback: number): number {
  const v = value.trim();
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n)) return fallback;
  return v.endsWith("ms") ? n : n * 1000;
}

type ThemeTogglerProps = {
  theme: ThemeSelection;
  resolvedTheme: Resolved;
  setTheme: (theme: ThemeSelection) => void;
  direction?: Direction;
  onImmediateChange?: (theme: ThemeSelection) => void;
  children?: ChildrenRender;
};

function ThemeToggler({
  theme,
  resolvedTheme,
  setTheme,
  onImmediateChange,
  direction = "ltr",
  children,
}: ThemeTogglerProps) {
  const [preview, setPreview] = React.useState<null | {
    effective: ThemeSelection;
    resolved: Resolved;
  }>(null);
  const [current, setCurrent] = React.useState<{
    effective: ThemeSelection;
    resolved: Resolved;
  }>({ effective: theme, resolved: resolvedTheme });

  React.useEffect(() => {
    if (
      preview &&
      theme === preview.effective &&
      resolvedTheme === preview.resolved
    ) {
      setPreview(null);
    }
  }, [theme, resolvedTheme, preview]);

  // Keep the rendered icon honest when the theme changes from outside this control
  // (the OS flipping while on `system`, or another tab).
  React.useEffect(() => {
    setCurrent((prev) =>
      prev.effective === theme && prev.resolved === resolvedTheme
        ? prev
        : { effective: theme, resolved: resolvedTheme }
    );
  }, [theme, resolvedTheme]);

  const [fromClip, toClip] = getClipKeyframes(direction);

  const toggleTheme = React.useCallback(
    async (next: ThemeSelection) => {
      const resolved = next === "system" ? getSystemEffective() : next;
      const root = document.documentElement;
      const doc = document as ViewTransitionDocument;

      setCurrent({ effective: next, resolved });
      onImmediateChange?.(next);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Nothing to reveal, or no way to reveal it.
      if (resolved === resolvedTheme || reduced || !doc.startViewTransition) {
        flushSync(() => setPreview({ effective: next, resolved }));
        setTheme(next);
        return;
      }

      const duration = toMs(
        getComputedStyle(root).getPropertyValue("--duration-sweep"),
        700
      );

      try {
        await doc.startViewTransition(() => {
          flushSync(() => {
            setPreview({ effective: next, resolved });
            root.classList.toggle("dark", resolved === "dark");
          });
        }).ready;

        await root.animate(
          { clipPath: [fromClip, toClip] },
          {
            duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        ).finished;
      } finally {
        // Runs whether the transition completed or was abandoned mid-flight; the
        // theme still has to end up where it was asked to go.
        setTheme(next);
      }
    },
    [onImmediateChange, resolvedTheme, fromClip, toClip, setTheme]
  );

  return (
    <>
      {typeof children === "function"
        ? children({
            effective: current.effective,
            resolved: current.resolved,
            toggleTheme,
          })
        : children}
    </>
  );
}

export {
  ThemeToggler,
  type ThemeTogglerProps,
  type ThemeSelection,
  type Resolved,
  type Direction,
};
