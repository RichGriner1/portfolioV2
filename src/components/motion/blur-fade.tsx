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

import { DURATION, EASE, STAGGER } from "@/lib/motion";

type MarginType = UseInViewOptions["margin"];

// Magic UI's BlurFade on the DS light reveal tier (duration, rise, blur, and its
// stagger as the base delay). For content that mounts and unmounts in place;
// content that scrolls into view uses Reveal (components/tpc/reveal.tsx), which
// reads the same tier from CSS.
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
  duration = DURATION.reveal.light,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  inViewMargin = "-50px",
  blur = "4px",
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
        transition={{ delay: STAGGER.light + delay, duration, ease: EASE }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
