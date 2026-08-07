"use client";

import { useCallback, useEffect, useState, type ElementType } from "react";
import { useReducedMotion } from "motion/react";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

/**
 * Case-preserving replacement. `toLowerCase`/`toUpperCase` comparison rather than
 * an `/[a-z]/` test, because the Spanish copy is full of `ñ í ó é` — those are
 * letters and should scramble like any other, and a regex range would freeze them
 * in place while everything around them moved.
 */
function scramble(char: string): string {
  if (char >= "0" && char <= "9") {
    return DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  const lower = char.toLowerCase();
  const upper = char.toUpperCase();
  if (lower === upper) return char; // not a letter — space, comma, dash, em dash
  const pool = char === upper ? UPPERCASE : LOWERCASE;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * One paint: the characters currently on screen, and how many of them from the
 * left have landed on their final value. Both in one object because they always
 * change together — split into two states they'd render one frame apart and a
 * character would clear its blur a beat before (or after) it stopped scrambling.
 */
type Frame = { chars: string[]; locked: number };

const settledFrame = (text: string): Frame => {
  const chars = Array.from(text);
  return { chars, locked: chars.length };
};

type HyperTextProps = {
  /** The final text. Changing it replays the scramble. */
  children: string;
  /** Defaults to a `span`, so this drops inside an existing heading element. */
  as?: ElementType;
  className?: string;
  /**
   * Total run length in ms. 700 is `--duration-sweep` — the token for motion that
   * crosses a whole element rather than nudging one. It's a number rather than a
   * utility class because the cadence is driven by `setInterval`, not by a CSS
   * transition.
   */
  duration?: number;
  /**
   * Hold the scramble before it starts resolving, in ms.
   *
   * For a heading split across more than one instance — the canvas claim is two,
   * because its halves are different ink. Delaying the second by the first's run
   * length makes the pair sweep as one continuous pass from the first letter of the
   * first word, instead of two waves starting at once in the middle of a sentence.
   * The delayed instance is scrambled the whole time it's waiting, so the line goes
   * soft together and only the resolve is sequential.
   */
  delay?: number;
  /** Replay on pointer-enter. Off for long headings, where it becomes a tic. */
  animateOnHover?: boolean;
};

/**
 * Magic UI's HyperText (magicui.design/docs/components/hyper-text), ported.
 *
 * It replays whenever `children` changes, which is the reason it's here: the
 * language toggle runs each page heading through the scramble on its way to the
 * other language, so the switch reads as the page rewriting itself rather than as
 * a silent substitution you only notice on the second glance.
 *
 * Four deliberate changes from the published source:
 *
 * 1. **Characters blur and fade while they're still churning**, and clear as each
 *    one lands. Upstream swaps glyphs at full opacity and full focus, which at this
 *    size is genuinely hard to look at — a heading of hard-edged type flickering
 *    through a dozen values a second. Softening the unsettled characters turns the
 *    same sequence into type coming into focus, left to right. It's the reason each
 *    character is its own element; the cost is kerning pairs during the run, which
 *    is 700ms of a portfolio heading.
 *
 * 2. **The scramble stays in the original character's alphabet** (see `scramble`).
 *    Upstream draws every replacement from `A–Z`, which in a proportional display
 *    face means a lowercase heading jitters its own width for the length of the
 *    animation — `W` is nearly twice `i`. Non-letters are left alone, so word
 *    boundaries never move and the `text-balance` on the `h1` rules in globals.css
 *    keeps resolving to the same line breaks while the type settles.
 *
 * 3. **The real text is what gets announced.** The scrambling run is `aria-hidden`
 *    with the final string beside it in an `sr-only` span, so a screen reader reads
 *    the heading rather than 700ms of noise. It also means the server renders the
 *    real words and the scramble is a client-side effect layered on correct HTML —
 *    no-JS and the crawler both get the heading.
 *
 * 4. **`prefers-reduced-motion` renders the text and stops.** Same code path, but
 *    every character starts locked, so there is one paint, no blur and no interval.
 */
export function HyperText({
  children,
  as: Component = "span",
  className,
  duration = 700,
  delay = 0,
  animateOnHover = true,
}: HyperTextProps) {
  const [frame, setFrame] = useState<Frame>(() => settledFrame(children));
  // Bumped to replay the same string on hover. `children` alone can't do it — an
  // effect only re-runs on a dependency that actually changed.
  const [run, setRun] = useState(0);
  const reduced = useReducedMotion();

  /**
   * Snap to the new text during render, before the effect below scrambles it.
   *
   * Without this the displayed string is only ever corrected from inside a
   * `requestAnimationFrame`, and rAF doesn't run in a hidden tab: switch the
   * language, switch tabs, and the heading sits in the old language until you come
   * back. The animation is decoration, so it can wait for a frame — the text
   * itself can't. React's own pattern for a prop the state has to follow.
   */
  const [previous, setPrevious] = useState(children);
  if (previous !== children) {
    setPrevious(children);
    setFrame(settledFrame(children));
  }

  useEffect(() => {
    const chars = Array.from(children);
    // Each tick locks one more character, left to right. Floored at roughly one
    // frame: a two-letter heading would otherwise ask for a 350ms interval and
    // read as a glitch rather than a resolve.
    const step = Math.max(duration / chars.length, 16);
    let locked = reduced ? chars.length : 0;
    let elapsed = 0;

    const tick = () => {
      // Background tabs throttle `setInterval` to about a tick a second, which would
      // leave a 40-character heading scrambling for half a minute and still be at it
      // when someone came back to the tab. Nobody is watching, so finish.
      if (document.hidden) locked = chars.length;

      setFrame({
        chars: chars.map((c, i) => (i < locked ? c : scramble(c))),
        locked,
      });
      // Ticks during `delay` keep churning the unresolved characters but don't
      // advance the front — a frozen scramble next to a moving one reads as broken.
      if (elapsed >= delay) locked += 1;
      elapsed += step;
    };

    let interval: ReturnType<typeof setInterval> | undefined;
    // The first frame is scheduled rather than run inline: the heading is already
    // painted with its real text (that's the state's initial value and the server
    // HTML), so this is the swap into the scramble, and it belongs after paint.
    const frame = requestAnimationFrame(() => {
      tick();
      if (reduced) return;
      interval = setInterval(() => {
        if (locked > chars.length) {
          clearInterval(interval);
          return;
        }
        tick();
      }, step);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (interval) clearInterval(interval);
    };
  }, [children, delay, duration, reduced, run]);

  const replay = useCallback(() => {
    if (animateOnHover) setRun((r) => r + 1);
  }, [animateOnHover]);

  return (
    <Component className={className} onPointerEnter={replay}>
      <span className="sr-only">{children}</span>
      {/* `whitespace-pre-wrap`, because each character is its own element and a lone
          space inside a span is collapsible whitespace — without it the word gaps
          close up mid-run and every heading with a leading space (the canvas claim)
          loses it. */}
      <span aria-hidden className="whitespace-pre-wrap">
        {frame.chars.map((char, i) => (
          <span
            key={i}
            className={
              // The transition is on the settled state only, so the blur arrives
              // with the scramble and only the clearing is eased. Easing both ways
              // was the first attempt and it swallowed the effect: a character locks
              // every ~20ms while the ramp into blur takes `--duration-base`, so the
              // early letters were transitioning out before they had finished
              // transitioning in and the heading barely softened at all.
              //
              // No duration or curve named here — globals.css sets
              // `--default-transition-duration` to `--duration-base` and the default
              // curve to `--ease-out-soft`, so the bare utility lands on the tokens.
              // 4px is the blur the wordmark reveal already uses: the site has one
              // answer for "type arriving", and this is it per character.
              i < frame.locked
                ? "blur-[0px] transition-[filter,opacity]"
                : "opacity-60 blur-xs"
            }
          >
            {char}
          </span>
        ))}
      </span>
    </Component>
  );
}
