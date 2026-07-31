"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  type MotionProps,
  type UseInViewOptions,
  type Variants,
} from "motion/react";

import { EASE_SOFT } from "@/components/motion/constants";

type MarginType = UseInViewOptions["margin"];

// Magic UI's BlurFade, adapted to this repo: eased with the site's
// EASE_SOFT token instead of the stock easeOut.
type BlurFadeProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  variant?: Variants;
  duration?: number;
  delay?: number;
  /** Pixels the element travels while fading in. */
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
};

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
  ...props
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const from = direction === "right" || direction === "down" ? -offset : offset;
  const defaultVariants: Variants = {
    hidden: { [axis]: from, opacity: 0, filter: `blur(${blur})` },
    visible: { [axis]: 0, opacity: 1, filter: "blur(0px)" },
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={variant ?? defaultVariants}
        transition={{ delay: 0.04 + delay, duration, ease: EASE_SOFT }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
