"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  PRIMITIVE_RAMP_INFO,
  STEPS,
  contrastRatio,
  parseUsage,
  primitiveHex,
  readableOn,
  resolveSemantic,
  wcagLevel,
  type Lang,
} from "./data";

/** Theme state with a mount guard (next-themes resolves only after mount). */
export function useDark() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return { dark: mounted && resolvedTheme === "dark", setTheme };
}

/**
 * Click / tap to pin a card open, on top of the hover-to-expand behaviour.
 * Hover devices reveal on hover; touch devices (no hover) rely on the tap.
 * Returns props for the card root and the grid-rows class for the reveal.
 */
function useExpand() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);
  const rootProps = {
    onClick: toggle,
    role: "button" as const,
    tabIndex: 0,
    "aria-expanded": open,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
  };
  const rowsClass = open ? "grid-rows-[1fr]" : "grid-rows-[0fr]";
  return { rootProps, rowsClass };
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
          <p className="text-muted-foreground mt-4 text-sm">{description}</p>
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
  ghost = false,
  flat = false,
}: {
  bg: string;
  fg: string;
  label: string;
  usage: string;
  dark: boolean;
  ghost?: boolean;
  flat?: boolean;
}) {
  const { overview, examples } = parseUsage(usage);
  const theme = dark ? "dark" : "light";
  const bgC = resolveSemantic(bg, theme);
  const fgC = resolveSemantic(fg, theme);
  // A ghost has no fill — it sits on the canvas, so its contrast is text-vs-canvas.
  const contrastBg = ghost ? resolveSemantic("canvas", theme) : bgC;
  const ratio =
    contrastBg && fgC ? contrastRatio(contrastBg.hex, fgC.hex) : null;
  const level = ratio !== null ? wcagLevel(ratio) : null;
  const { rootProps, rowsClass } = useExpand();

  return (
    <div
      {...rootProps}
      className={
        ghost || flat
          ? "group cursor-pointer overflow-hidden rounded-lg select-none"
          : "group border-border cursor-pointer overflow-hidden rounded-lg border select-none"
      }
      style={
        ghost
          ? {
              color: `var(--${fg})`,
              border: `1px solid color-mix(in srgb, var(--${fg}) 45%, transparent)`,
            }
          : { backgroundColor: `var(--${bg})`, color: `var(--${fg})` }
      }
    >
      <div className="p-16">
        <div className="flex items-center justify-between gap-8">
          <div className="text-sm font-medium">{label}</div>
          {ratio !== null && level ? (
            <span
              title={`${ghost ? "Text on canvas" : "Foreground on background"} · WCAG ${level.label}`}
              className="shrink-0 rounded-full px-8 py-1 font-mono text-[10px]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, currentColor 14%, transparent)",
              }}
            >
              {ratio.toFixed(2)}:1 {level.label} {level.pass ? "✓" : "✕"}
            </span>
          ) : null}
        </div>
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]",
            rowsClass
          )}
        >
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
                style={{
                  borderTop:
                    "1px solid color-mix(in srgb, currentColor 20%, transparent)",
                }}
              >
                {ghost ? (
                  <>
                    <div>bg transparent — sits on canvas</div>
                    <div>
                      text --{fg} · {fgC?.primitive ?? "?"} · {fgC?.hex ?? ""}
                    </div>
                    <div>hover → subtle tint</div>
                  </>
                ) : (
                  <>
                    <div>
                      bg --{bg} · {bgC?.primitive ?? "?"} · {bgC?.hex ?? ""}
                    </div>
                    <div>
                      fg --{fg} · {fgC?.primitive ?? "?"} · {fgC?.hex ?? ""}
                    </div>
                  </>
                )}
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
export function PrimitiveRampCard({
  ramp,
  span,
  lang,
}: {
  ramp: string;
  span?: boolean;
  lang: Lang;
}) {
  const info = PRIMITIVE_RAMP_INFO[ramp];
  const baseHex = primitiveHex(ramp, info.base);
  const textColor = readableOn(baseHex);
  const { rootProps, rowsClass } = useExpand();

  return (
    <div
      {...rootProps}
      className={cn(
        "group flex min-h-[240px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl select-none",
        span && "sm:col-span-2"
      )}
      style={{
        backgroundColor: `var(--${ramp}-${info.base})`,
        color: textColor,
      }}
    >
      <div className="p-24">
        <div className="font-mono text-[11px] tracking-wider uppercase opacity-70">
          Primitive ramp
        </div>
        <h3 className="mt-4 text-3xl font-bold capitalize">{ramp}</h3>
        <div className="mt-2 text-sm opacity-80">{info.subtitle}</div>
        <code className="mt-2 block font-mono text-[11px] opacity-70">
          {info.base} · {baseHex}
        </code>
      </div>

      {/* Overview + use cases + full-bleed ramp; revealed on hover or tap. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]",
          rowsClass
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-8 px-24 pb-12">
            <p className="max-w-[46ch] text-sm leading-snug opacity-90">
              {info.overview[lang]}
            </p>
            <ul className="space-y-1 text-xs opacity-80">
              {info.uses[lang].map((u) => (
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
                style={{
                  backgroundColor: `var(--${ramp}-${s})`,
                  color: readableOn(stepHex),
                }}
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
export function AccessibilityCard({
  span,
  lang,
}: {
  span?: boolean;
  lang: Lang;
}) {
  const swatches = [
    {
      name: "white",
      hex: "#ffffff",
      varName: "--accessibility-white",
      uses: {
        en: [
          "Maximum-contrast text on dark or colored surfaces",
          "Forced high-contrast mode foreground",
          "Knockout text over photography",
        ],
        es: [
          "Texto de contraste máximo sobre superficies oscuras o de color",
          "Texto en modo de alto contraste forzado",
          "Texto recortado sobre fotografía",
        ],
      },
    },
    {
      name: "black",
      hex: "#000000",
      varName: "--accessibility-black",
      uses: {
        en: [
          "AAA body text on light surfaces",
          "Crisp 1px hairlines and rules",
          "Scrims behind dialogs and sheets",
        ],
        es: [
          "Texto de cuerpo AAA sobre superficies claras",
          "Filetes y líneas nítidas de 1px",
          "Veladuras detrás de diálogos y hojas",
        ],
      },
    },
  ];

  const { rootProps, rowsClass } = useExpand();

  return (
    <div
      {...rootProps}
      className={cn(
        // The card IS the pure extreme: white in light, black in dark. The
        // border shows its edge against the (matching) canvas.
        "group border-border flex min-h-[240px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl border select-none",
        "bg-[var(--accessibility-white)] text-[var(--accessibility-black)]",
        "dark:bg-[var(--accessibility-black)] dark:text-[var(--accessibility-white)]",
        span && "sm:col-span-2"
      )}
    >
      <div className="p-24">
        <div className="font-mono text-[11px] tracking-wider uppercase opacity-60">
          Primitive
        </div>
        <h3 className="mt-4 text-3xl font-bold">Accessibility</h3>
        <div className="mt-2 text-sm opacity-70">Maximum contrast</div>
        <code className="mt-2 block font-mono text-[11px] opacity-60">
          #ffffff · #000000
        </code>
      </div>

      {/* Overview + per-color use cases; revealed on hover or tap. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]",
          rowsClass
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-12 px-24 pb-24 text-xs">
            <p className="leading-snug opacity-75">
              {lang === "es"
                ? "#fff y #000 puros, fuera de las escalas temáticas. Recurre a ellos solo cuando un token semántico no alcanza el contraste que necesitas."
                : "Pure #fff and #000, outside the themed ramps. Reach for them only when a semantic token can’t hit the contrast you need."}
            </p>
            {swatches.map((s) => (
              <div key={s.name}>
                <div className="flex items-center gap-8 font-mono text-[11px]">
                  <span
                    className="size-10 shrink-0 rounded-full"
                    style={{
                      backgroundColor: `var(${s.varName})`,
                      border:
                        "1px solid color-mix(in srgb, currentColor 35%, transparent)",
                    }}
                  />
                  {s.name} · {s.hex}
                </div>
                <ul className="mt-2 space-y-1 pl-18 leading-snug opacity-70">
                  {s.uses[lang].map((u) => (
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
  const { rootProps, rowsClass } = useExpand();

  return (
    <div
      {...rootProps}
      className="group border-border bg-card cursor-pointer overflow-hidden rounded-lg border select-none"
    >
      <div className="p-16">
        <div className="flex items-center gap-12">
          <div
            className="bg-background size-40 shrink-0 rounded-md"
            style={{ border: `2px solid var(--${name})` }}
          />
          <div className="min-w-0">
            <div className="text-sm font-medium">{name}</div>
            {current ? (
              <code className="text-muted-foreground font-mono text-[10px]">
                {current.primitive} · {current.hex}
              </code>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:grid-rows-[1fr]",
            rowsClass
          )}
        >
          <div className="overflow-hidden">
            <div className="text-muted-foreground space-y-12 pt-12 text-xs">
              <p className="leading-snug">{overview}</p>
              {examples.length ? (
                <ul className="space-y-2">
                  {examples.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              ) : null}
              <div className="border-border space-y-2 border-t pt-8 font-mono text-[10px]">
                <div>--{name}</div>
                <div>
                  light · {light?.primitive ?? "?"} · {light?.hex ?? ""}
                </div>
                <div>
                  dark · {dk?.primitive ?? "?"} · {dk?.hex ?? ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
