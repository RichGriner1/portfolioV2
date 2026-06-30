"use client";

import {
  PageShell,
  Section,
  SemanticCard,
  PrimitiveRampCard,
  BorderRingDemo,
  useDark,
} from "../_showcase/ui";
import { RAMPS, SEMANTIC_PAIRS } from "../_showcase/data";

export default function ColorPage() {
  const { dark } = useDark();

  return (
    <PageShell
      title="Color"
      description="Three layers, bottom-up: primitive ramps → semantic roles → component use."
    >
      <Section
        title="Primitives"
        description="Raw color scales — the bottom layer, with no meaning attached. Each card shows the ramp's base color, what it's for, and all 11 steps."
      >
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
          {RAMPS.map((ramp) => (
            <PrimitiveRampCard key={ramp} ramp={ramp} span={ramp === "primary"} />
          ))}
        </div>
      </Section>

      <Section
        title="Accessibility"
        description="Pure black and white — an escape hatch for maximum contrast when a semantic token isn't enough (WCAG AAA text, high-contrast mode)."
      >
        <div className="grid max-w-md grid-cols-2 gap-16">
          <div
            className="rounded-xl border border-border p-24"
            style={{ backgroundColor: "var(--accessibility-white)", color: "var(--accessibility-black)" }}
          >
            <h3 className="text-xl font-bold">White</h3>
            <code className="mt-2 block font-mono text-[11px] opacity-70">--accessibility-white · #ffffff</code>
          </div>
          <div
            className="rounded-xl p-24"
            style={{ backgroundColor: "var(--accessibility-black)", color: "var(--accessibility-white)" }}
          >
            <h3 className="text-xl font-bold">Black</h3>
            <code className="mt-2 block font-mono text-[11px] opacity-70">--accessibility-black · #000000</code>
          </div>
        </div>
      </Section>

      <Section
        title="Semantic tokens"
        description="Named roles components consume. Hover a card to expand its overview, use cases, and the primitive + hex behind bg/fg."
      >
        <div className="grid grid-cols-2 items-start gap-12 md:grid-cols-3 lg:grid-cols-4">
          {SEMANTIC_PAIRS.map(({ bg, fg, label, usage }) => (
            <SemanticCard key={bg} bg={bg} fg={fg} label={label} usage={usage} dark={dark} />
          ))}
        </div>
      </Section>

      <Section
        title="Border + ring"
        description="Interactive — hover and focus the controls to see each token in its natural state."
      >
        <BorderRingDemo />
      </Section>
    </PageShell>
  );
}
