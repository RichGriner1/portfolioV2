"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/design-system/lib/utils";
import {
  PRIMITIVE_RAMP_INFO,
  STEPS,
  parseUsage,
  primitiveHex,
  readableOn,
  resolveSemantic,
} from "./data";

/** Theme state with a mount guard (next-themes resolves only after mount). */
export function useDark() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return { dark: mounted && resolvedTheme === "dark", setTheme };
}

function ShowcaseHeader({
  title,
  description,
  showBack = true,
}: {
  title: string;
  description?: string;
  showBack?: boolean;
}) {
  const { dark, setTheme } = useDark();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 px-32 py-20 backdrop-blur">
      <div className="flex items-center gap-16">
        {showBack ? (
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Home
          </Link>
        ) : null}
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      <button
        onClick={() => setTheme(dark ? "light" : "dark")}
        className="rounded-md bg-primary px-16 py-10 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-active"
      >
        Toggle {dark ? "light" : "dark"}
      </button>
    </header>
  );
}

/** Page chrome: sticky header + centered content column. */
export function PageShell({
  title,
  description,
  showBack = true,
  children,
}: {
  title: string;
  description?: string;
  showBack?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ShowcaseHeader title={title} description={description} showBack={showBack} />
      <div className="mx-auto max-w-5xl space-y-64 px-32 py-48">{children}</div>
    </main>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-16">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-4 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/**
 * Semantic token card. Collapsed = just the label. On hover it grows
 * vertically (grid-rows 0fr → 1fr, fast-in ease-out-soft) to reveal the
 * overview, use cases, and the primitive + hex behind bg/fg.
 */
export function SemanticCard({
  bg,
  fg,
  label,
  usage,
  dark,
}: {
  bg: string;
  fg: string;
  label: string;
  usage: string;
  dark: boolean;
}) {
  const { overview, examples } = parseUsage(usage);
  const bgC = resolveSemantic(bg, dark ? "dark" : "light");
  const fgC = resolveSemantic(fg, dark ? "dark" : "light");

  return (
    <div
      className="group overflow-hidden rounded-lg border border-border"
      style={{ backgroundColor: `var(--${bg})`, color: `var(--${fg})` }}
    >
      <div className="p-16">
        <div className="text-sm font-medium">{label}</div>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="space-y-12 pt-12 text-xs">
              <p className="leading-snug opacity-90">{overview}</p>
              {examples.length ? (
                <ul className="space-y-2 opacity-75">
                  {examples.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              ) : null}
              <div
                className="space-y-2 pt-8 font-mono text-[10px] opacity-75"
                style={{ borderTop: "1px solid color-mix(in srgb, currentColor 20%, transparent)" }}
              >
                <div>bg --{bg} · {bgC?.primitive ?? "?"} · {bgC?.hex ?? ""}</div>
                <div>fg --{fg} · {fgC?.primitive ?? "?"} · {fgC?.hex ?? ""}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Bento card for a primitive ramp: big base color, title + subtitle +
 * overview, and the full 11-step ramp strip inside the card. Inspired by
 * Pantone-style swatch cards.
 */
export function PrimitiveRampCard({ ramp, span }: { ramp: string; span?: boolean }) {
  const info = PRIMITIVE_RAMP_INFO[ramp];
  const baseHex = primitiveHex(ramp, info.base);
  const textColor = readableOn(baseHex);

  return (
    <div
      className={cn(
        "group flex min-h-[240px] flex-col justify-between overflow-hidden rounded-xl",
        span && "sm:col-span-2",
      )}
      style={{ backgroundColor: `var(--${ramp}-${info.base})`, color: textColor }}
    >
      <div className="p-24">
        <div className="text-[11px] font-mono uppercase tracking-wider opacity-70">
          Primitive ramp
        </div>
        <h3 className="mt-4 text-3xl font-bold capitalize">{ramp}</h3>
        <div className="mt-2 text-sm opacity-80">{info.subtitle}</div>
        <code className="mt-2 block font-mono text-[11px] opacity-70">
          {info.base} · {baseHex}
        </code>
        <p className="mt-12 max-w-[46ch] text-sm leading-snug opacity-80">{info.overview}</p>
      </div>

      {/* Full-bleed ramp attached to the bottom; expands vertically on hover. */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          {STEPS.map((s) => {
            const stepHex = primitiveHex(ramp, s);
            return (
              <div
                key={s}
                title={`--${ramp}-${s} · ${stepHex}`}
                className="flex items-center justify-between px-24 py-2 font-mono text-[10px]"
                style={{ backgroundColor: `var(--${ramp}-${s})`, color: readableOn(stepHex) }}
              >
                <span className="opacity-90">{s}</span>
                <span className="opacity-70">{stepHex}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Interactive border + ring demo — the tokens shown in their natural states. */
export function BorderRingDemo() {
  return (
    <div className="space-y-24">
      <div className="max-w-md space-y-8">
        <label htmlFor="ring-demo" className="block text-sm font-medium">
          Live input — hover it, then click or Tab in to see the ring
        </label>
        <input
          id="ring-demo"
          type="text"
          placeholder="Focus me…"
          className="w-full rounded-md border border-input-border bg-input px-12 py-8 text-sm text-foreground outline-none transition-colors placeholder:text-input-placeholder hover:border-input-border-hover focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        <p className="text-xs text-muted-foreground">
          <code className="font-mono">input-border</code> at rest ·{" "}
          <code className="font-mono">input-border-hover</code> on hover ·{" "}
          <code className="font-mono">ring</code> on focus
        </p>
      </div>

      <div>
        <button
          type="button"
          className="rounded-md bg-primary px-16 py-10 text-sm font-medium text-primary-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Tab to me — focus ring
        </button>
      </div>

      <div className="flex flex-wrap gap-16">
        <div className="group rounded-lg border border-border bg-card p-16 text-sm transition-colors hover:border-border-strong">
          <div className="font-medium">border</div>
          <code className="text-xs text-muted-foreground">--border · hover → border-strong</code>
        </div>
        <div className="rounded-lg border border-border-strong bg-card p-16 text-sm">
          <div className="font-medium">border-strong</div>
          <code className="text-xs text-muted-foreground">--border-strong</code>
        </div>
      </div>
    </div>
  );
}

export function BreakpointReader() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (width === null) return null;
  const bp =
    width >= 1536 ? "2xl"
    : width >= 1280 ? "xl"
    : width >= 1024 ? "lg"
    : width >= 768 ? "md"
    : width >= 640 ? "sm"
    : width >= 480 ? "xs"
    : "(below xs)";

  return (
    <div className="rounded-md border border-border bg-card p-16">
      <code className="text-sm">window: {width}px → breakpoint: {bp}</code>
    </div>
  );
}
