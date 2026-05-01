"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import type { Exercise, Phase } from "./exercises";

const SESSION_SECONDS = 300;

type FlatPhase = {
  label: "Inhale" | "Hold" | "Exhale";
  duration: number;
  targetScale: number;
};

function flattenPhases(phases: Phase[]): FlatPhase[] {
  const result: FlatPhase[] = [];
  let currentScale = 1.0;
  for (const phase of phases) {
    if (phase.kind === "inhale") {
      currentScale = 1.6;
      result.push({
        label: "Inhale",
        duration: phase.duration,
        targetScale: currentScale,
      });
    } else if (phase.kind === "hold") {
      result.push({
        label: "Hold",
        duration: phase.duration,
        targetScale: currentScale,
      });
    } else if (phase.kind === "exhale") {
      currentScale = 1.0;
      result.push({
        label: "Exhale",
        duration: phase.duration,
        targetScale: currentScale,
      });
    } else if (phase.kind === "double-inhale") {
      result.push({
        label: "Inhale",
        duration: phase.durations[0],
        targetScale: 0.9,
      });
      currentScale = 1.6;
      result.push({
        label: "Inhale",
        duration: phase.durations[1],
        targetScale: currentScale,
      });
    }
  }
  return result;
}

type DisplayState = {
  label: "Inhale" | "Hold" | "Exhale" | "Done";
  countdown: number;
  phaseDuration: number;
  scale: number;
  opacity: number;
  sessionLeft: number;
};

export function BreathingBall({
  exercise,
  running,
}: {
  exercise: Exercise;
  running: boolean;
}) {
  const flatPhases = flattenPhases(exercise.phases);
  const phaseIndexRef = useRef(0);
  const countdownRef = useRef(flatPhases[0].duration);
  const sessionRef = useRef(SESSION_SECONDS);

  const [display, setDisplay] = useState<DisplayState>({
    label: flatPhases[0].label,
    countdown: flatPhases[0].duration,
    phaseDuration: flatPhases[0].duration,
    scale: flatPhases[0].targetScale,
    opacity: 1,
    sessionLeft: SESSION_SECONDS,
  });

  useEffect(() => {
    if (!running) return;

    const flat = flattenPhases(exercise.phases);

    const interval = setInterval(() => {
      // Session timer
      sessionRef.current -= 1;
      if (sessionRef.current <= 0) {
        clearInterval(interval);
        setDisplay((prev) => ({
          ...prev,
          label: "Done",
          countdown: 0,
          scale: 1.0,
          opacity: 0.4,
          sessionLeft: 0,
        }));
        return;
      }

      // Phase timer
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        const nextIndex = (phaseIndexRef.current + 1) % flat.length;
        phaseIndexRef.current = nextIndex;
        countdownRef.current = flat[nextIndex].duration;
        setDisplay({
          label: flat[nextIndex].label,
          countdown: flat[nextIndex].duration,
          phaseDuration: flat[nextIndex].duration,
          scale: flat[nextIndex].targetScale,
          opacity: 1,
          sessionLeft: sessionRef.current,
        });
      } else {
        setDisplay((prev) => ({
          ...prev,
          countdown: countdownRef.current,
          sessionLeft: sessionRef.current,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running, exercise]);

  const EASE_OUT = [0.2, 0.8, 0.2, 1] as const; // --ease-out-soft
  const EASE_IN_OUT = [0.45, 0.05, 0.15, 1] as const; // --ease-in-out-soft

  const transition =
    display.label === "Inhale"
      ? { duration: display.phaseDuration, ease: EASE_OUT }
      : display.label === "Exhale"
        ? { duration: display.phaseDuration, ease: EASE_IN_OUT }
        : { duration: 0.1 };

  const mins = Math.floor(display.sessionLeft / 60);
  const secs = String(display.sessionLeft % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-50 w-50">
        <motion.div
          className="bg-primary absolute inset-0 rounded-full"
          animate={{ scale: display.scale, opacity: display.opacity }}
          transition={transition}
        />
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-primary-foreground font-mono text-xs tracking-widest uppercase">
            {display.label}
          </span>
          {display.label !== "Done" && (
            <span className="text-primary-foreground font-display text-5xl leading-none font-bold tabular-nums">
              {display.countdown}
            </span>
          )}
        </div>
      </div>
      <span className="text-muted-foreground font-mono text-xs tabular-nums">
        {display.label === "Done" ? "Session complete" : `${mins}:${secs} left`}
      </span>
    </div>
  );
}
