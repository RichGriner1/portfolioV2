"use client";

import { useEffect, useState } from "react";

// Local copy of the useIsMobile pattern in @/lib/hooks — kept alongside
// these figures so they stay self-contained. Lets animated figures
// (micro-interactions demo) skip motion for prefers-reduced-motion.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
