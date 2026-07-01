"use client";

import {
  PageShell,
  Section,
  SemanticCard,
  PrimitiveRampCard,
  AccessibilityCard,
  BorderRingCard,
  useDark,
} from "../_showcase/ui";
import { BORDERS, RAMPS, SEMANTIC_GROUPS } from "../_showcase/data";

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
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Two neutral ramps, on purpose.{" "}
          <strong className="font-medium text-foreground">Neutral</strong>{" "}
          is for the surfaces and text you read on.{" "}
          <strong className="font-medium text-foreground">Control</strong>{" "}
          is for the lines and states around them: borders, dividers, focus ring, disabled. Keeping them apart stops
          neutrals from blending &mdash; a disabled button shouldn&apos;t land on the same gray as the card behind it.
        </p>
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
          {RAMPS.map((ramp) => (
            <PrimitiveRampCard key={ramp} ramp={ramp} span={ramp === "primary"} />
          ))}
          <AccessibilityCard />
        </div>
      </Section>

      <Section
        title="Semantic tokens"
        description="Named roles components consume, grouped by family. Hover a card to expand its overview, use cases, and the primitive + hex behind bg/fg."
      >
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">Canvas vs. surfaces.</strong>{" "}
          With one flat background you can&apos;t tell the app frame from the content, and cards float with nothing
          grounding them. Canvas is the fix: a true base layer (pure white in light, near-black in dark) that
          everything sits on. Page, card, and popover stack on top of it, each a small step apart, so content reads
          as raised sections instead of one flat sheet.
        </p>
        <div className="space-y-24">
          {SEMANTIC_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="mb-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
              <div className="grid grid-cols-2 items-start gap-12 md:grid-cols-3 lg:grid-cols-4">
                {group.pairs.map((p) => (
                  <SemanticCard
                    key={`${p.bg}-${p.fg}-${p.label}`}
                    bg={p.bg}
                    fg={p.fg}
                    label={p.label}
                    usage={p.usage}
                    dark={dark}
                  />
                ))}
              </div>
            </div>
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
