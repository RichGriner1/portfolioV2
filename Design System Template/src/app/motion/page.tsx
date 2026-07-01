"use client";

import { PageShell, Section } from "../_showcase/ui";
import { durationMs } from "../_showcase/data";

export default function MotionPage() {
  return (
    <PageShell
      title="Motion"
      description="Durations × easing curves. Hover any chip to play its transition."
    >
      <Section title="Duration × easing" description="4 durations, 3 easing curves. Hover to feel the difference.">
        <div className="flex flex-wrap gap-12">
          {(["fast", "base", "slow", "slower"] as const).map((d) =>
            (["out-soft", "in-out-soft", "spring"] as const).map((e) => (
              <div
                key={`${d}-${e}`}
                title={`duration-${d} (${durationMs(d)}ms) × ease-${e}`}
                className="cursor-pointer rounded-md border border-border bg-card px-16 py-12 hover:bg-primary hover:text-primary-foreground"
                style={{
                  transitionProperty: "background-color, color, transform",
                  transitionDuration: `var(--duration-${d})`,
                  transitionTimingFunction: `var(--ease-${e})`,
                }}
              >
                <div className="text-xs font-medium">{d}</div>
                <div className="text-xs text-muted-foreground">{e}</div>
              </div>
            )),
          )}
        </div>
      </Section>
    </PageShell>
  );
}
