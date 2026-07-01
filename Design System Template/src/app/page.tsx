"use client";

import Link from "next/link";
import {
  ArrowRight,
  Component,
  Monitor,
  Palette,
  Ruler,
  Type,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/design-system/primitives";
import { PageShell } from "./_showcase/ui";

type Status = "ready" | "wip";

const CARDS: Array<{
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  status: Status;
}> = [
  { href: "/color", icon: Palette, title: "Color", desc: "Palettes, semantic roles, light & dark themes.", status: "ready" },
  { href: "/dimension", icon: Ruler, title: "Dimension", desc: "Spacing, radius, and elevation scales.", status: "ready" },
  { href: "/text", icon: Type, title: "Text", desc: "Typographic scale, weights, and roles.", status: "wip" },
  { href: "/motion", icon: Zap, title: "Motion", desc: "Durations and easing curves.", status: "ready" },
  { href: "/responsive", icon: Monitor, title: "Responsive design", desc: "Breakpoints and adaptive layout.", status: "ready" },
  { href: "/primitives", icon: Component, title: "Primitive components", desc: "Box, Stack, Text, Icon, Slot.", status: "ready" },
];

export default function Home() {
  return (
    <PageShell
      title="Design System Template"
      description="A portable, token-driven kit. Pick a topic to explore the foundations and components."
      showBack={false}
    >
      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col gap-12 rounded-lg border border-border bg-card p-24 transition-all hover:border-border-strong hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <Icon as={c.icon} size="lg" tone="primary" />
              {c.status === "wip" ? (
                <span className="rounded-full bg-warning-subtle px-8 py-2 text-[10px] font-medium uppercase tracking-wider text-warning">
                  In progress
                </span>
              ) : null}
            </div>
            <div className="space-y-4">
              <h2 className="flex items-center gap-4 text-lg font-semibold tracking-tight">
                {c.title}
                <Icon
                  as={ArrowRight}
                  size="sm"
                  tone="muted"
                  className="transition-transform group-hover:translate-x-1"
                />
              </h2>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
