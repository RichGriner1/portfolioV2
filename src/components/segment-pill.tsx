"use client";

import { motion } from "motion/react";

import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The pill behind the chosen option of a segmented control, sliding to the new one.
 *
 * Render it inside the selected button only, with the same `group` for every button
 * of one control (a `useId()` per control): motion animates the shared layout from
 * the old button to the new one. The button needs `relative isolate` so the pill sits
 * behind its label. Same move as the Compliance version picker.
 */
export function SegmentPill({
  group,
  className,
}: {
  group: string;
  className?: string;
}) {
  return (
    <motion.span
      layoutId={`segment-pill-${group}`}
      aria-hidden
      className={cn("bg-foreground absolute inset-0 -z-10", className)}
      transition={{ duration: DURATION.base, ease: EASE }}
    />
  );
}
