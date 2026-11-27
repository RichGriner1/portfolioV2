import type { Transition } from "motion/react";

// The motion tokens from globals.css, in the form the Motion library takes:
// curves as cubic-bezier arrays, durations in seconds. Both files follow the
// Whitelabel DS timing (WhitelabelDesignsystem/src/styles/tokens/motion.css);
// change a value in both or neither.

type Curve = readonly [number, number, number, number];

/** --ease-out-soft / --ease-enter: enter, hover, select. */
export const EASE: Curve = [0.16, 1, 0.3, 1];
/** --ease-in-out-soft: something on screen moving somewhere else, folds. */
export const EASE_IN_OUT: Curve = [0.7, 0, 0.15, 1];
/** --ease-close: anything that closes or leaves. */
export const EASE_CLOSE: Curve = [0.7, 0, 0.15, 1];
/** --ease-spring (cubic fallback): lands with a little overshoot. */
export const EASE_SPRING: Curve = [0.34, 1.35, 0.5, 1];
/** --ease-ambient: slow background loops. */
export const EASE_AMBIENT: Curve = [0.2, 0.8, 0.2, 1];

/** Durations in seconds, named as in globals.css. */
export const DURATION = {
  press: 0.08,
  enter: 0.16,
  close: 0.3,
  base: 0.4,
  fold: 0.45,
  slower: 0.8,
  move: 0.8,
  spring: 1,
  decode: 1.15,
  ambient: 10,
  reveal: { light: 0.4, normal: 0.5, heavy: 0.6 },
} as const;

/** Reveal stagger in seconds (--reveal-stagger*). */
export const STAGGER = { light: 0.04, normal: 0.07, heavy: 0.1 } as const;

/**
 * The DS spring as a physical spring: about 8% overshoot, visually there in
 * ~250ms, which matches the sampled linear() curve behind --ease-spring.
 * Use this where Motion needs a spring (drag release, layout moves); use
 * EASE_SPRING with a duration where a timed curve is enough.
 */
export const SPRING: Transition = {
  type: "spring",
  visualDuration: 0.25,
  bounce: 0.37,
};
