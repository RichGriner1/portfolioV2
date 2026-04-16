"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Site-wide smooth scroll via Lenis. Wraps the app so every page inherits
 * the same scroll feel. Tune via `options` — lerp controls inertia, duration
 * governs programmatic scrolls.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      {children}
    </ReactLenis>
  );
}
