"use client";

import {
  PageShell,
  Section,
  SemanticCard,
  PrimitiveRampCard,
  BorderRingCard,
  useDark,
} from "../_showcase/ui";
import { BORDERS, RAMPS, SEMANTIC_PAIRS } from "../_showcase/data";

export default function ColorPage() {
  const { dark } = useDark();

  return (
    <PageShell
      title="Color"
      description="Three layers, bottom-up: primitive ramps → semantic roles → component use."
    >
      <div className="max-w-3xl space-y-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          Color here is built in three layers. <strong className="font-medium text-foreground">Primitives</strong>{" "}
          are the raw scales — complete ramps of every hue, with no meaning attached.{" "}
          <strong className="font-medium text-foreground">Semantic tokens</strong> map those primitives to roles
          like <code className="font-mono">background</code>, <code className="font-mono">primary</code>, or{" "}
          <code className="font-mono">error</code>. Components only ever touch the semantic layer, so they never
          hard-code a hex.
        </p>
        <p>
          I worked with a team that had three brand colors: <code className="font-mono">brand</code>,{" "}
          <code className="font-mono">brand-light</code>, and <code className="font-mono">brand-lighter</code>. Then
          someone needed something a bit lighter than light. There was nowhere to put it, so they eyeballed a value
          and the palette drifted. Define the full ramps first and that doesn&apos;t happen &mdash;{" "}
          <strong className="font-medium text-foreground">&ldquo;lighter&rdquo; already exists</strong>, so you reach
          for <code className="font-mono">primary-200</code>{" "}
          instead of inventing it. You make a thousand small decisions building a product. Settling the scale once
          removes a whole class of them. It also lets you swap a brand color, or an entire neutral scale, without
          touching a single component. That matters most when you&apos;re shipping several products, or
          white-labeling one.
        </p>
      </div>

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
        description="Hover a card to see its use cases and the primitive + hex behind it."
      >
        <div className="grid grid-cols-2 items-start gap-12 md:grid-cols-3 lg:grid-cols-4">
          {BORDERS.map(({ name, usage }) => (
            <BorderRingCard key={name} name={name} usage={usage} dark={dark} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
