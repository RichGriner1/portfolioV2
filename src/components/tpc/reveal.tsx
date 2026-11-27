"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Tier = "light" | "normal" | "heavy";

// One tier sets the duration, the rise and the blur together, so a surface reads as
// one motion. They are the Afi apps reveal tiers (see the reveal block in globals.css);
// `light` reuses the original --reveal-rise since that name predates the tiers.
const DURATION: Record<Tier, string> = {
  light: "var(--duration-reveal-light)",
  normal: "var(--duration-reveal-normal)",
  heavy: "var(--duration-reveal-heavy)",
};
const RISE: Record<Tier, string> = {
  light: "var(--reveal-rise)",
  normal: "var(--reveal-rise-normal)",
  heavy: "var(--reveal-rise-heavy)",
};
const BLUR: Record<Tier, string> = {
  light: "var(--reveal-blur-light)",
  normal: "var(--reveal-blur-normal)",
  heavy: "var(--reveal-blur-heavy)",
};
const STAGGER: Record<Tier, string> = {
  light: "var(--reveal-stagger)",
  normal: "var(--reveal-stagger-normal)",
  heavy: "var(--reveal-stagger-heavy)",
};

/**
 * Content that enters the page: fades up out of a soft blur on --ease-enter, whose
 * tail is flat, which is what lets a 500ms move read as smooth rather than as lag.
 *
 * `index` staggers siblings by the tier's own stagger. `immediate` plays on mount
 * instead of waiting to scroll into view, for content that swaps in place (the rule
 * explorer's preview). With `prefers-reduced-motion` it just shows.
 */
export function Reveal({
  children,
  tier = "normal",
  index = 0,
  immediate = false,
  className,
}: {
  children: ReactNode;
  tier?: Tier;
  index?: number;
  immediate?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      // Show at once, with no transition and no offset: motion is opt-in.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduced(true);
      setShown(true);
      return;
    }
    if (immediate) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const dur = DURATION[tier];
  // Once shown, transform and filter go back to `none` rather than 0 values: a
  // `translateY(0)` or `blur(0)` still makes a stacking context and a containing
  // block, which would trap fixed and absolute children (tooltips, drawers).
  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${RISE[tier]})`,
        filter: shown ? "none" : `blur(${BLUR[tier]})`,
        transitionProperty: "opacity, transform, filter",
        transitionDuration: dur,
        transitionTimingFunction: "var(--ease-enter)",
        transitionDelay: `calc(${STAGGER[tier]} * ${index})`,
      };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
