"use client";

import { PageShell, Section } from "../_showcase/ui";
import { RADII, SHADOWS, SPACES } from "../_showcase/data";

export default function DimensionPage() {
  return (
    <PageShell
      title="Dimension"
      description="Spacing, radius, and elevation. Primitive scales today; semantic roles (space-md, radius-card…) are next."
    >
      <Section title="Spacing scale" description="1 unit = 1px. p-16 = 16px, gap-24 = 24px.">
        <div className="space-y-8">
          {SPACES.map((sp) => (
            <div key={sp} className="flex items-center gap-16" title={`var(--space-${sp}) — ${sp}px`}>
              <code className="w-48 text-right text-xs text-muted-foreground">{sp}</code>
              <div className="h-12 bg-primary" style={{ width: `var(--space-${sp})` }} />
              <span className="text-xs text-muted-foreground">{sp}px</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius scale" description="Hover to see usage.">
        <div className="flex flex-wrap gap-16">
          {RADII.map(({ name, usage }) => (
            <div key={name} className="flex flex-col items-center gap-8" title={usage}>
              <div className="size-80 bg-primary" style={{ borderRadius: `var(--radius-${name})` }} />
              <code className="text-xs text-muted-foreground">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow scale" description="Hover to see usage. Shadows read stronger on light bg.">
        <div className="flex flex-wrap gap-24">
          {SHADOWS.map(({ name, usage }) => (
            <div key={name} className="flex flex-col items-center gap-8" title={usage}>
              <div className="size-96 rounded-lg bg-card" style={{ boxShadow: `var(--shadow-${name})` }} />
              <code className="text-xs text-muted-foreground">{name}</code>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
