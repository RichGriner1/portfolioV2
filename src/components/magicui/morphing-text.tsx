"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/** Peak blur, in px. Upstream's base figure, and the one globals.css reveals type at. */
const BLUR = 8;

type MorphingTextProps = {
  /** The current text. Changing it morphs the old string into the new one. */
  children: string;
  /** Defaults to a `span`, so this drops inside an existing heading element. */
  as?: ElementType;
  className?: string;
  /**
   * Run length in ms. 700 is `--duration-sweep` — the token for motion that crosses
   * a whole element rather than nudging one. A number rather than a utility class
   * because the curve is driven frame by frame, not by a CSS transition.
   */
  duration?: number;
};

/**
 * Magic UI's MorphingText (magicui.design/docs/components/morphing-text), ported.
 *
 * Upstream cycles a fixed array of strings forever. Here the two strings are the
 * heading's own previous and current text, because that's the moment worth
 * animating: switching the language morphs each heading into its translation, and
 * the first paint blurs in from nothing. Nothing loops.
 *
 * Both strings sit in the same grid cell — the outgoing one blurring and fading out
 * while the incoming one does the reverse — with `opacity` on the upstream `^0.4`
 * curve, which holds both above half-visible for most of the run so the heading
 * never thins out to nothing in the middle.
 *
 * **Upstream's SVG alpha threshold is not here.** That filter is what makes the demo
 * gooey: it snaps anything under roughly half-opaque to solid and deletes the rest,
 * so two blurred copies of a word appear to flow through each other. It needs the
 * demo's weight to survive — at 6rem black type there's enough alpha inside a
 * blurred glyph to clear the cut. At the 36–72px this site sets headings in, on
 * `--background`, it cleared nothing: the h1 vanished outright for the middle of
 * every run. A plain cross-blur is what's left, and it's the calmer read anyway.
 *
 * Two other things this port does differently:
 *
 * 1. **The current text is a real, unstyled text node.** The outgoing copy is the
 *    overlay and it's `aria-hidden`, so the accessible heading is always the right
 *    string, the server renders it, and no-JS gets it.
 * 2. **`prefers-reduced-motion` renders the text and stops** — no overlay and no
 *    frame loop.
 */
export function MorphingText({
  children,
  as: Component = "span",
  className,
  duration = 700,
}: MorphingTextProps) {
  const incoming = useRef<HTMLSpanElement>(null);
  const outgoing = useRef<HTMLSpanElement>(null);

  const [previous, setPrevious] = useState(children);
  /**
   * The string being morphed away from. Empty on mount: nothing preceded the
   * heading, so the first run is a blur-in rather than a cross-morph.
   */
  const [from, setFrom] = useState("");
  const [morphing, setMorphing] = useState(true);

  // React's pattern for state that has to follow a prop. Doing this in render
  // rather than an effect means the text is never a frame behind the language.
  if (previous !== children) {
    setPrevious(children);
    setFrom(previous);
    setMorphing(true);
  }

  const reduced = useReducedMotion();
  const active = morphing && !reduced;

  useEffect(() => {
    if (reduced) return;

    let raf = 0;
    let start = 0;

    /** `f` runs 0 → 1: 0 is entirely the outgoing string, 1 entirely the incoming. */
    const paint = (f: number) => {
      const back = 1 - f;
      if (incoming.current) {
        incoming.current.style.filter = `blur(${BLUR * back}px)`;
        incoming.current.style.opacity = `${Math.pow(f, 0.4)}`;
      }
      if (outgoing.current) {
        outgoing.current.style.filter = `blur(${BLUR * f}px)`;
        outgoing.current.style.opacity = `${Math.pow(back, 0.4)}`;
      }
    };

    /** Hand the element back to the stylesheet rather than leaving `blur(0px)` on it. */
    const settle = () => {
      if (incoming.current) incoming.current.style.cssText = "";
      setMorphing(false);
    };

    const step = (now: number) => {
      if (!start) start = now;
      const f = Math.min((now - start) / duration, 1);
      paint(f);
      if (f < 1) {
        raf = requestAnimationFrame(step);
        return;
      }
      settle();
    };

    raf = requestAnimationFrame(step);

    /**
     * rAF is suspended in a background tab, so without this a heading morphed while
     * hidden would sit half-dissolved until someone looked at it. Timers still fire
     * there (throttled), and the only thing lost is the animation nobody saw.
     */
    const backstop = setTimeout(settle, duration + 200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(backstop);
    };
  }, [children, duration, reduced]);

  return (
    // `inline-grid` so both strings share one cell: they stack without absolute
    // positioning, the box is as wide as the wider of the two, and each wraps in the
    // same space. `text-wrap: balance` on the h1 rules in globals.css is an inherited
    // property, so the grid items still balance.
    <Component className={cn("inline-grid", className)}>
      <span ref={incoming} className="col-start-1 row-start-1">
        {children}
      </span>
      {active && from ? (
        <span
          ref={outgoing}
          aria-hidden
          className="col-start-1 row-start-1 overflow-hidden"
        >
          {from}
        </span>
      ) : null}
    </Component>
  );
}
