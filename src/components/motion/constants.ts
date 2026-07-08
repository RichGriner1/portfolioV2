import type { Transition } from "motion/react";

// Shared easing/spring vocabulary — mirrors the constants in case-study-bento.tsx.
// Figures import from here instead of the (large) bento module.
export const EASE = [0.2, 0.8, 0.2, 1] as const;
export const EASE_SOFT = [0.32, 0.72, 0.18, 1] as const;
export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 22,
};
export const SPRING_SNAP: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};
