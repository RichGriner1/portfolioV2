"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// useLayoutEffect is a no-op (with a warning) during SSR; fall back to
// useEffect there since the gate only ever runs client-side.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Reduced-motion gate for hover-driven glyphs, mirroring hero.tsx's intro
 * gate: SSR and the first client render agree (motion allowed, `false`), then
 * the check runs in a layout effect so a reduced-motion user gets the glyph
 * re-rendered pinned to its resolved state before the browser paints — the
 * settled composition, never an animated settle.
 */
export function useStaticResolve(): boolean {
  const [staticResolve, setStaticResolve] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStaticResolve(true);
    }
  }, []);

  return staticResolve;
}
