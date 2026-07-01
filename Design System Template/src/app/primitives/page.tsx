"use client";

import { ArrowRight, Bell, Check, Heart, Search } from "lucide-react";
import { Box, HStack, Text, Icon } from "@/design-system/primitives";
import { PageShell, Section } from "../_showcase/ui";

const GAPS = [4, 8, 12, 16, 24, 32] as const;
const ICON_SIZES = [
  ["xs", 12],
  ["sm", 16],
  ["md", 20],
  ["lg", 24],
  ["xl", 32],
] as const;
const TONES = ["primary", "success", "warning", "error", "info", "destructive"] as const;

export default function PrimitivesPage() {
  return (
    <PageShell
      title="Primitive components"
      description="Box · Stack · Text · Icon · Slot — the atomic, brand-agnostic building blocks every component composes from."
    >
      <Section title="Stack — gap (space between children)" description="Same blocks every row; only gap changes. The light track shows the space. 1 gap unit = 1px.">
        <div className="space-y-12">
          {GAPS.map((g) => (
            <div key={g} className="flex items-center gap-16">
              <code className="w-112 shrink-0 text-xs font-mono text-muted-foreground">
                gap={`{${g}}`} · {g}px
              </code>
              <HStack gap={g} className="w-fit rounded-md bg-muted p-4">
                {[0, 1, 2, 3].map((i) => (
                  <Box key={i} className="size-32 rounded-sm bg-primary" />
                ))}
              </HStack>
            </div>
          ))}
        </div>
        <pre className="mt-16 overflow-x-auto rounded-md bg-muted p-16 text-xs font-mono text-muted-foreground">
{`<HStack gap={16}>
  <Box />
  <Box />
</HStack>`}
        </pre>
      </Section>

      <Section title="Text — size · weight · tone · family" description="Typographic primitive. Tones map to semantic color tokens.">
        <div className="space-y-8">
          <Text size="3xl" weight="bold">size 3xl · bold</Text>
          <Text size="xl" weight="semibold">size xl · semibold</Text>
          <Text>size base · normal (default)</Text>
          <Text size="sm" tone="muted">size sm · muted tone</Text>
          <HStack gap={16} wrap className="pt-4">
            {TONES.map((t) => (
              <Text key={t} tone={t} weight="medium">{t}</Text>
            ))}
          </HStack>
          <Text family="mono" size="sm" className="pt-4">
            font-mono · const cn = twMerge(clsx())
          </Text>
        </div>
      </Section>

      <Section title="Icon — size · tone (inherits currentColor)" description="SVG wrapper. Adopts the surrounding text color unless given a tone.">
        <HStack gap={24} wrap>
          {ICON_SIZES.map(([s, px]) => (
            <div key={s} className="flex flex-col items-center gap-4">
              <Icon as={Bell} size={s} />
              <code className="text-[10px] font-mono text-muted-foreground">{s} · {px}px</code>
            </div>
          ))}
        </HStack>
        <HStack gap={16} wrap className="mt-16">
          <Icon as={Search} size="md" tone="muted" />
          <Icon as={Check} size="md" tone="success" />
          <Icon as={Heart} size="md" tone="destructive" />
          <Icon as={ArrowRight} size="md" tone="primary" />
        </HStack>
        <HStack gap={8} className="mt-16 text-info">
          <Icon as={Bell} size="sm" />
          <Text tone="inherit" size="sm">Untoned icon adopts the parent text color (info here)</Text>
        </HStack>
      </Section>

      <Section title="Slot — asChild (renders as another element)" description="Merges props onto its child instead of wrapping it. No Radix.">
        <Text asChild tone="primary" weight="medium" size="lg">
          <a href="#" className="underline underline-offset-4">
            This is an &lt;a&gt; styled entirely by Text via asChild — no wrapper span
          </a>
        </Text>
      </Section>
    </PageShell>
  );
}
