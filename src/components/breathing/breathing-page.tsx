"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";

import { BreathingBall } from "./breathing-ball";
import { type Exercise, pickRandom } from "./exercises";

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function BreathingPage() {
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [running, setRunning] = useState(false);

  function handleRandomize() {
    const next = pickRandom(selected ?? undefined);
    setSelected(next);
    setRunning(true);
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 pt-8 pb-24 sm:pt-12">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground w-fit font-mono text-xs tracking-wider uppercase transition-colors"
      >
        ← Richard Griner
      </Link>

      <header className="flex flex-col gap-3">
        <h1 className="font-display text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          Breathing
        </h1>
        <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
          Take a micro-break. Hit Randomize for a guided breathing exercise — up
          to 5 minutes.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex flex-col gap-1"
          >
            <h2 className="font-display text-foreground text-xl font-bold">
              {selected.name}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {selected.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-80 items-center justify-center">
        {selected ? (
          <BreathingBall key={selected.id} exercise={selected} running={running} />
        ) : (
          <p className="text-muted-foreground font-mono text-sm">
            Press Randomize to begin.
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleRandomize} size="lg">
          Randomize
        </Button>
        {selected && (
          <Button variant="outline" onClick={() => setRunning((r) => !r)}>
            {running ? "Pause" : "Resume"}
          </Button>
        )}
      </div>
    </main>
  );
}
