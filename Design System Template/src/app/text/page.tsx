"use client";

import { PageShell, Section } from "../_showcase/ui";

const FAMILIES: Array<{ name: string; varName: string; sample: string }> = [
  { name: "sans", varName: "--font-sans", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "display", varName: "--font-display", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "mono", varName: "--font-mono", sample: "const cn = twMerge(clsx())" },
];

// The approved typography roles — built next. See HANDOFF / token design.
const PLANNED: Array<{ role: string; size: string; weight: string; family: string }> = [
  { role: "display", size: "60", weight: "bold", family: "display" },
  { role: "heading-1", size: "36", weight: "bold", family: "display" },
  { role: "heading-2", size: "30", weight: "semibold", family: "display" },
  { role: "heading-3", size: "24", weight: "semibold", family: "display" },
  { role: "heading-4", size: "20", weight: "semibold", family: "display" },
  { role: "body", size: "16", weight: "normal", family: "sans" },
  { role: "body-sm", size: "14", weight: "normal", family: "sans" },
  { role: "caption", size: "12", weight: "normal", family: "sans" },
  { role: "overline", size: "12", weight: "semibold", family: "sans" },
  { role: "code", size: "14", weight: "normal", family: "mono" },
];

export default function TextPage() {
  return (
    <PageShell
      title="Text"
      description="Typography foundations. Font families exist today; the semantic type scale + roles are being built next."
    >
      <Section title="Font families" description="The three primitive families. Everything else (size, weight, leading) is coming.">
        <div className="space-y-16">
          {FAMILIES.map(({ name, varName, sample }) => (
            <div key={name} className="rounded-lg border border-border bg-card p-16">
              <code className="text-xs text-muted-foreground">{varName}</code>
              <p className="mt-8 text-2xl" style={{ fontFamily: `var(${varName})` }}>
                {sample}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Planned type roles" description="Coming next: a primitive size/weight/leading/tracking scale, then these semantic bundles. Text will expose them via a `variant` prop.">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-16 py-12 text-left font-medium">Role</th>
                <th className="px-16 py-12 text-left font-medium">Size (px)</th>
                <th className="px-16 py-12 text-left font-medium">Weight</th>
                <th className="px-16 py-12 text-left font-medium">Family</th>
              </tr>
            </thead>
            <tbody>
              {PLANNED.map((r) => (
                <tr key={r.role} className="border-t border-border">
                  <td className="px-16 py-12 font-mono">text-{r.role}</td>
                  <td className="px-16 py-12">{r.size}</td>
                  <td className="px-16 py-12">{r.weight}</td>
                  <td className="px-16 py-12">{r.family}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}
