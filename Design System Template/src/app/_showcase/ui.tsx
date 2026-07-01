"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/design-system/lib/utils";
import {
  PRIMITIVE_RAMP_INFO,
  STEPS,
  contrastRatio,
  parseUsage,
  primitiveHex,
  readableOn,
  resolveSemantic,
  wcagLevel,
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
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-canvas/80 px-32 py-20 backdrop-blur">
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
    <main className="min-h-screen bg-canvas text-foreground">
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
  const ratio = bgC && fgC ? contrastRatio(bgC.hex, fgC.hex) : null;
  const level = ratio !== null ? wcagLevel(ratio) : null;

  return (
    <div
      className="group overflow-hidden rounded-lg border border-border"
      style={{ backgroundColor: `var(--${bg})`, color: `var(--${fg})` }}
    >
      <div className="p-16">
        <div className="flex items-center justify-between gap-8">
          <div className="text-sm font-medium">{label}</div>
          {ratio !== null && level ? (
            <span
              title={`Foreground on background · WCAG ${level.label}`}
              className="shrink-0 rounded-full px-8 py-1 font-mono text-[10px]"
              style={{ backgroundColor: "color-mix(in srgb, currentColor 14%, transparent)" }}
            >
              {ratio.toFixed(2)}:1 {level.label} {level.pass ? "✓" : "✕"}
            </span>
          ) : null}
        </div>
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
      </div>

      {/* Overview + use cases + full-bleed ramp; all revealed on hover. */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="space-y-8 px-24 pb-12">
            <p className="max-w-[46ch] text-sm leading-snug opacity-90">{info.overview}</p>
            <ul className="space-y-1 text-xs opacity-80">
              {info.uses.map((u) => (
                <li key={u}>• {u}</li>
              ))}
            </ul>
          </div>
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

/**
 * Pure black & white — the accessibility escape hatch, shown as one bento
 * card. Instead of an 11-step ramp the attachment is two bars (white, black)
 * that hover-expand to reveal use cases.
 */
export function AccessibilityCard({ span }: { span?: boolean }) {
  const swatches = [
    {
      name: "white",
      hex: "#ffffff",
      varName: "--accessibility-white",
      uses: [
        "Maximum-contrast text on dark or colored surfaces",
        "Forced high-contrast mode foreground",
        "Knockout text over photography",
      ],
    },
    {
      name: "black",
      hex: "#000000",
      varName: "--accessibility-black",
      uses: [
        "AAA body text on light surfaces",
        "Crisp 1px hairlines and rules",
        "Scrims behind dialogs and sheets",
      ],
    },
  ];

  return (
    <div
      className={cn(
        "group flex min-h-[240px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card",
        span && "sm:col-span-2",
      )}
    >
      <div className="p-24">
        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Primitive
        </div>
        <h3 className="mt-4 text-3xl font-bold">Accessibility</h3>
        <div className="mt-2 text-sm text-muted-foreground">Maximum contrast · escape hatch</div>
        <code className="mt-2 block font-mono text-[11px] text-muted-foreground">
          #ffffff · #000000
        </code>
      </div>

      {/* Overview + white/black bars with use cases; all revealed on hover. */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <p className="max-w-[46ch] px-24 pb-12 text-sm leading-snug text-muted-foreground">
            Pure #fff and #000, outside the themed ramps. Reach for them only when a semantic token
            can&apos;t hit the contrast you need — AAA text, high-contrast mode, hairlines.
          </p>
          <div className="border-t border-border">
            {swatches.map((s) => (
              <div
                key={s.name}
                style={{ backgroundColor: `var(${s.varName})`, color: readableOn(s.hex) }}
              >
                <div className="flex items-center justify-between px-24 pt-3 font-mono text-[10px]">
                  <span className="opacity-90">{s.name}</span>
                  <span className="opacity-70">{s.hex}</span>
                </div>
                <ul className="space-y-1 px-24 pb-3 pt-2 text-[11px] leading-snug opacity-90">
                  {s.uses.map((u) => (
                    <li key={u}>• {u}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Border / ring token card. Swatch + name at rest; hover expands to reveal
 * use cases and the primitive + hex in both themes (mirrors SemanticCard).
 */
export function BorderRingCard({
  name,
  usage,
  dark,
}: {
  name: string;
  usage: string;
  dark: boolean;
}) {
  const { overview, examples } = parseUsage(usage);
  const light = resolveSemantic(name, "light");
  const dk = resolveSemantic(name, "dark");
  const current = dark ? dk : light;

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card">
      <div className="p-16">
        <div className="flex items-center gap-12">
          <div
            className="size-40 shrink-0 rounded-md bg-background"
            style={{ border: `2px solid var(--${name})` }}
          />
          <div className="min-w-0">
            <div className="text-sm font-medium">{name}</div>
            {current ? (
              <code className="font-mono text-[10px] text-muted-foreground">
                {current.primitive} · {current.hex}
              </code>
            ) : null}
          </div>
        </div>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="space-y-12 pt-12 text-xs text-muted-foreground">
              <p className="leading-snug">{overview}</p>
              {examples.length ? (
                <ul className="space-y-2">
                  {examples.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              ) : null}
              <div className="space-y-2 border-t border-border pt-8 font-mono text-[10px]">
                <div>--{name}</div>
                <div>light · {light?.primitive ?? "?"} · {light?.hex ?? ""}</div>
                <div>dark · {dk?.primitive ?? "?"} · {dk?.hex ?? ""}</div>
              </div>
            </div>
          </div>
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
