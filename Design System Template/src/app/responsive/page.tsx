"use client";

import { PageShell, Section, BreakpointReader } from "../_showcase/ui";
import { BREAKPOINTS } from "../_showcase/data";

export default function ResponsivePage() {
  return (
    <PageShell
      title="Responsive design"
      description="Breakpoints that drive Tailwind's responsive variants (sm:, md:, lg:…)."
    >
      <Section title="Live reader" description="Resize the window — the active breakpoint updates below.">
        <BreakpointReader />
      </Section>

      <Section title="Breakpoints" description="Min-width thresholds. Utilities apply at and above each value.">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-16 py-12 text-left font-medium">Name</th>
                <th className="px-16 py-12 text-left font-medium">Min width</th>
                <th className="px-16 py-12 text-left font-medium">Typical device</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((b) => (
                <tr key={b.name} className="border-t border-border">
                  <td className="px-16 py-12 font-mono">{b.name}</td>
                  <td className="px-16 py-12">{b.px}px</td>
                  <td className="px-16 py-12 text-muted-foreground">{b.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}
