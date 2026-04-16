"use client";

import { motion } from "motion/react";

/**
 * SSPC — SCHEDULE / MESSAGING.
 * Three message bubbles stacked chat-style. On hover they light up in
 * sequence — the WhatsApp bot pinging tour updates to administrators.
 */
export function ScheduleGlyph() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="text-foreground h-24 w-24"
      aria-hidden
    >
      <motion.rect
        x={8}
        y={10}
        width={22}
        height={7}
        rx={3.5}
        fill="currentColor"
        variants={{
          rest: { opacity: 0.5 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.rect
        x={18}
        y={20}
        width={22}
        height={7}
        rx={3.5}
        fill="currentColor"
        variants={{
          rest: { opacity: 0.35 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
      />
      <motion.rect
        x={8}
        y={30}
        width={22}
        height={7}
        rx={3.5}
        fill="currentColor"
        variants={{
          rest: { opacity: 0.2 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
      />
    </svg>
  );
}
