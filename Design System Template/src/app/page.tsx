"use client";

import { useEffect, useState } from "react";
import primitivesJson from "@/design-system/tokens/primitives.json";
import semanticLightJson from "@/design-system/tokens/semantic-light.json";
import semanticDarkJson from "@/design-system/tokens/semantic-dark.json";

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
const RAMPS = ["primary", "surface", "control", "red", "green", "amber", "blue"] as const;

type TokenNode = { $type: string; $value: string };
type Resolved = { primitive: string; hex: string };

function resolveSemantic(name: string, theme: "light" | "dark"): Resolved | null {
  const json = theme === "light" ? semanticLightJson : semanticDarkJson;
  const tokenObj = (json.semantic.color as Record<string, TokenNode>)[name];
  if (!tokenObj) return null;
  const match = tokenObj.$value.match(/^\{color\.([^.]+)\.([^}]+)\}$/);
  if (!match) {
    return { primitive: "(literal)", hex: tokenObj.$value };
  }
  const [, ramp, step] = match;
  const colorRoot = primitivesJson.color as Record<string, Record<string, TokenNode>>;
  const hex = colorRoot[ramp]?.[step]?.$value ?? "";
  return { primitive: `${ramp}-${step}`, hex };
}

function primitiveHex(ramp: string, step: string): string {
  const colorRoot = primitivesJson.color as Record<string, Record<string, TokenNode>>;
  return colorRoot[ramp]?.[step]?.$value ?? "";
}

const SEMANTIC_PAIRS: Array<{ bg: string; fg: string; label: string; usage: string }> = [
  { bg: "background", fg: "foreground", label: "Page", usage: "The main canvas color of the page.\nExamples:\n• Body background\n• Hero section background\n• Default layout color" },
  { bg: "card", fg: "card-foreground", label: "Card", usage: "Surface color for cards sitting on the page background.\nExamples:\n• Article cards in a feed\n• Stat tiles\n• Profile boxes" },
  { bg: "popover", fg: "popover-foreground", label: "Popover", usage: "Surface color for floating UI that opens over the page.\nExamples:\n• Dropdown menus\n• Date picker calendars\n• Command palette" },
  { bg: "muted", fg: "muted-foreground", label: "Muted", usage: "Quieter surface for non-active areas.\nExamples:\n• Sidebar background\n• Table row hover\n• Code block background" },
  { bg: "primary", fg: "primary-foreground", label: "Primary (default)", usage: "Default primary action color.\nExamples:\n• Main 'Save' button background\n• Active tab indicator\n• Default link color" },
  { bg: "primary-hover", fg: "primary-foreground", label: "Primary hover", usage: "Primary action when the cursor is over it.\nExamples:\n• Button under the mouse\n• Hovered nav link\n• Hovered active tab" },
  { bg: "primary-active", fg: "primary-foreground", label: "Primary active", usage: "Primary action while being pressed.\nExamples:\n• Button mid-click\n• Pressed-down state\n• Active toggle handle" },
  { bg: "disabled", fg: "disabled-foreground", label: "Disabled", usage: "Surface and text for controls that can't be interacted with.\nExamples:\n• Greyed-out 'Submit' button\n• Disabled menu item\n• Read-only input field" },
  { bg: "error", fg: "error-foreground", label: "Error", usage: "State color signalling something went wrong.\nExamples:\n• Invalid form field border\n• System-error toast\n• Failed-validation icon" },
  { bg: "error-subtle", fg: "error", label: "Error subtle", usage: "Soft tint for inline error messages.\nExamples:\n• Inline alert banner\n• Validation hint background\n• Error callout bg" },
  { bg: "destructive", fg: "destructive-foreground", label: "Destructive", usage: "Action color for irreversible operations.\nExamples:\n• 'Delete account' button\n• 'Remove' icon button\n• Confirm dialog danger CTA" },
  { bg: "destructive-hover", fg: "destructive-foreground", label: "Destructive hover", usage: "Destructive action when the cursor is over it.\nExamples:\n• Delete button under the mouse\n• Hovered 'Remove' icon\n• Hovered danger CTA" },
  { bg: "destructive-active", fg: "destructive-foreground", label: "Destructive active", usage: "Destructive action while being pressed.\nExamples:\n• Mid-click on a delete\n• Pressed danger button" },
  { bg: "success", fg: "success-foreground", label: "Success", usage: "Affirmative color signaling a positive outcome.\nExamples:\n• 'Saved' toast\n• Success badge\n• Completed checkmark" },
  { bg: "success-hover", fg: "success-foreground", label: "Success hover", usage: "Success-tinted action when hovered.\nExamples:\n• 'Approve' button hover\n• Hovered confirm CTA" },
  { bg: "success-subtle", fg: "success", label: "Success subtle", usage: "Soft tint for inline success messages.\nExamples:\n• 'Profile updated' banner\n• Confirmation note background" },
  { bg: "warning", fg: "warning-foreground", label: "Warning", usage: "Cautionary color signaling 'pay attention but don't panic'.\nExamples:\n• Unsaved changes bar\n• Expiring-soon badge\n• Warning toast" },
  { bg: "warning-hover", fg: "warning-foreground", label: "Warning hover", usage: "Warning-tinted action when hovered.\nExamples:\n• 'Acknowledge' button hover\n• Hovered warning CTA" },
  { bg: "warning-subtle", fg: "warning", label: "Warning subtle", usage: "Soft tint for inline warnings.\nExamples:\n• Caution callout background\n• Soft warning banner" },
  { bg: "info", fg: "info-foreground", label: "Info", usage: "Neutral informational color.\nExamples:\n• 'New' badge\n• Info toast\n• Tip callout accent" },
  { bg: "info-hover", fg: "info-foreground", label: "Info hover", usage: "Info-tinted action when hovered.\nExamples:\n• 'Learn more' button hover\n• Hovered info CTA" },
  { bg: "info-subtle", fg: "info", label: "Info subtle", usage: "Soft tint for inline informational notes.\nExamples:\n• Tip callout background\n• 'Did you know' panel" },
];

const BORDERS: Array<{ name: string; usage: string }> = [
  { name: "border", usage: "Default border for surfaces and dividers.\nExamples:\n• Card outline\n• Section divider line\n• Default input border" },
  { name: "border-strong", usage: "Emphasized border for higher-contrast outlines.\nExamples:\n• Selected card outline\n• Hovered card border\n• Important separator" },
  { name: "input-border", usage: "Border color specifically for input fields.\nExamples:\n• Text field at rest\n• Select dropdown border\n• Textarea outline" },
  { name: "input-border-hover", usage: "Input border on hover, signaling interactivity.\nExamples:\n• Text field under the mouse\n• Hovered combobox\n• Hovered date input" },
  { name: "ring", usage: "Focus ring for keyboard navigation.\nExamples:\n• Focused button outline\n• Focused input ring\n• Focused link halo" },
];

const RADII: Array<{ name: string; usage: string }> = [
  { name: "none", usage: "Sharp corners — no rounding.\nExamples:\n• Full-bleed hero sections\n• Structural dividers\n• Edge-to-edge images" },
  { name: "xs", usage: "Very subtle softening (4px).\nExamples:\n• Tags and chips\n• Inline code snippets\n• Compact controls" },
  { name: "sm", usage: "Small rounding (6px).\nExamples:\n• Small buttons\n• Compact inputs\n• Badges" },
  { name: "md", usage: "Default for most controls (8px).\nExamples:\n• Buttons\n• Text inputs\n• Segmented controls" },
  { name: "lg", usage: "Default for cards and panels (10px).\nExamples:\n• Article cards\n• Settings panels\n• List items" },
  { name: "xl", usage: "Larger rounding for elevated containers (14px).\nExamples:\n• Modal dialogs\n• Side sheets\n• Large feature cards" },
  { name: "2xl", usage: "Prominent rounding (18px).\nExamples:\n• Hero cards\n• Onboarding panels\n• Feature spotlights" },
  { name: "3xl", usage: "Friendly, marketing-feeling rounding (22px).\nExamples:\n• Landing page cards\n• Promo modules\n• Big CTAs" },
  { name: "full", usage: "Pill or circular shape (9999px).\nExamples:\n• Pill buttons\n• Avatars\n• Circular icon buttons" },
];

const SHADOWS: Array<{ name: string; usage: string }> = [
  { name: "xs", usage: "Barely-there elevation.\nExamples:\n• Hovered table row\n• Subtle card lift\n• Hovered list item" },
  { name: "sm", usage: "Default lift for cards.\nExamples:\n• Resting card shadow\n• Default elevated tile\n• Static info panel" },
  { name: "md", usage: "More noticeable lift for interactive elevation.\nExamples:\n• Hovered card\n• Dropdown menu\n• Expanded select" },
  { name: "lg", usage: "Floating element shadow.\nExamples:\n• Popover\n• Tooltip\n• Command palette" },
  { name: "xl", usage: "Strong shadow for fully-floating UI.\nExamples:\n• Modal dialog\n• Side sheet\n• Drawer overlay" },
  { name: "inner", usage: "Inset shadow for a pressed-in feel.\nExamples:\n• Pressed button state\n• 'Pushed in' input look\n• Inset avatar slot" },
];

const SPACES = ["0", "1", "2", "4", "8", "12", "16", "20", "24", "32", "48", "64", "96", "128", "256"];

export default function Home() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur px-32 py-20 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design System Template</h1>
          <p className="text-sm text-muted-foreground mt-4">
            Foundations validation · {dark ? "dark" : "light"} mode · hover any token for usage
          </p>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className="px-16 py-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:bg-primary-active transition-colors"
        >
          Toggle {dark ? "light" : "dark"}
        </button>
      </header>

      <div className="px-32 py-48 space-y-64">
        <Section title="Semantic tokens" description="Named roles components consume. Each chip shows the primitive + hex for the current theme. Hover for both modes + usage.">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {SEMANTIC_PAIRS.map(({ bg, fg, label, usage }) => (
              <SemanticChip key={bg} bg={bg} fg={fg} label={label} usage={usage} dark={dark} />
            ))}
          </div>
        </Section>

        <Section title="Border + ring tokens" description="Each shows the primitive + hex. Hover for both modes + usage.">
          <div className="flex flex-wrap gap-16">
            {BORDERS.map(({ name, usage }) => {
              const light = resolveSemantic(name, "light");
              const dk = resolveSemantic(name, "dark");
              const current = dark ? dk : light;
              const tip = `${usage}\n\nLight: ${light?.primitive ?? "?"} · ${light?.hex ?? ""}\nDark:  ${dk?.primitive ?? "?"} · ${dk?.hex ?? ""}`;
              return (
                <div key={name} className="flex flex-col items-center gap-8 cursor-help" title={tip}>
                  <div
                    className="w-80 h-80 rounded-md bg-card"
                    style={{ border: `2px solid var(--${name})` }}
                  />
                  <code className="text-xs text-muted-foreground">--{name}</code>
                  {current ? (
                    <code className="text-[10px] font-mono text-muted-foreground opacity-70">
                      {current.primitive} · {current.hex}
                    </code>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Primitive ramps" description="Raw scales. Hover any step to see its hex value + role.">
          <div className="space-y-24">
            {RAMPS.map((ramp) => (
              <RampRow key={ramp} ramp={ramp} />
            ))}
          </div>
        </Section>

        <Section title="Radius scale" description="Hover to see usage.">
          <div className="flex flex-wrap gap-16">
            {RADII.map(({ name, usage }) => (
              <div key={name} className="flex flex-col items-center gap-8" title={usage}>
                <div
                  className="w-80 h-80 bg-primary"
                  style={{ borderRadius: `var(--radius-${name})` }}
                />
                <code className="text-xs text-muted-foreground">{name}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Shadow scale" description="Hover to see usage. Shadows read stronger on light bg.">
          <div className="flex flex-wrap gap-24">
            {SHADOWS.map(({ name, usage }) => (
              <div key={name} className="flex flex-col items-center gap-8" title={usage}>
                <div
                  className="w-96 h-96 rounded-lg bg-card"
                  style={{ boxShadow: `var(--shadow-${name})` }}
                />
                <code className="text-xs text-muted-foreground">{name}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Spacing scale" description="1 unit = 1px. p-16 = 16px, gap-24 = 24px.">
          <div className="space-y-8">
            {SPACES.map((sp) => (
              <div key={sp} className="flex items-center gap-16" title={`var(--space-${sp}) — ${sp}px`}>
                <code className="text-xs text-muted-foreground w-48 text-right">{sp}</code>
                <div className="h-12 bg-primary" style={{ width: `var(--space-${sp})` }} />
                <span className="text-xs text-muted-foreground">{sp}px</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Motion" description="Hover any chip to see its duration × easing curve.">
          <div className="flex flex-wrap gap-12">
            {(["fast", "base", "slow", "slower"] as const).map((d) =>
              (["out-soft", "in-out-soft", "spring"] as const).map((e) => (
                <div
                  key={`${d}-${e}`}
                  title={`duration-${d} (${durationMs(d)}ms) × ease-${e}`}
                  className="px-16 py-12 rounded-md bg-card border border-border cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  style={{
                    transitionProperty: "background-color, color, transform",
                    transitionDuration: `var(--duration-${d})`,
                    transitionTimingFunction: `var(--ease-${e})`,
                  }}
                >
                  <div className="text-xs font-medium">{d}</div>
                  <div className="text-xs text-muted-foreground">{e}</div>
                </div>
              ))
            )}
          </div>
        </Section>

        <Section title="Breakpoints" description="Resize the window — width below shows the active breakpoint name.">
          <BreakpointReader />
        </Section>
      </div>
    </main>
  );
}

function durationMs(d: "fast" | "base" | "slow" | "slower"): number {
  return { fast: 120, base: 200, slow: 320, slower: 500 }[d];
}

function Section({
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
        {description ? <p className="text-sm text-muted-foreground mt-4">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function SemanticChip({ bg, fg, label, usage, dark }: { bg: string; fg: string; label: string; usage: string; dark: boolean }) {
  const bgLight = resolveSemantic(bg, "light");
  const bgDark = resolveSemantic(bg, "dark");
  const fgLight = resolveSemantic(fg, "light");
  const fgDark = resolveSemantic(fg, "dark");
  const bgCurrent = dark ? bgDark : bgLight;
  const fgCurrent = dark ? fgDark : fgLight;

  const tooltip = [
    usage,
    "",
    `Pair: bg-${bg} + text-${fg}`,
    "",
    `bg --${bg}`,
    `  Light: ${bgLight?.primitive ?? "?"} · ${bgLight?.hex ?? ""}`,
    `  Dark:  ${bgDark?.primitive ?? "?"} · ${bgDark?.hex ?? ""}`,
    `fg --${fg}`,
    `  Light: ${fgLight?.primitive ?? "?"} · ${fgLight?.hex ?? ""}`,
    `  Dark:  ${fgDark?.primitive ?? "?"} · ${fgDark?.hex ?? ""}`,
  ].join("\n");

  return (
    <div
      title={tooltip}
      className="rounded-lg border border-border overflow-hidden cursor-help"
      style={{ backgroundColor: `var(--${bg})`, color: `var(--${fg})` }}
    >
      <div className="p-16">
        <div className="text-sm font-medium">{label}</div>

        <div className="mt-12 space-y-8">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider opacity-50">bg</div>
            <div className="text-xs font-mono opacity-80">--{bg}</div>
            {bgCurrent ? (
              <div className="text-[10px] font-mono opacity-50 mt-2">
                {bgCurrent.primitive} · {bgCurrent.hex}
              </div>
            ) : null}
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider opacity-50">fg</div>
            <div className="text-xs font-mono opacity-80">--{fg}</div>
            {fgCurrent ? (
              <div className="text-[10px] font-mono opacity-50 mt-2">
                {fgCurrent.primitive} · {fgCurrent.hex}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const RAMP_DESCRIPTIONS: Record<string, string> = {
  primary: "Brand ramp — the white-label hook. Currently pure grayscale.\nExamples:\n• Default button bg comes from primary-800\n• Link color comes from primary-600\n• Hover/active step through 900 / 950",
  surface: "Warm grays used for large flat areas and surrounding text.\nExamples:\n• Page bg from surface-50 (light) / surface-900 (dark)\n• Card surface in dark mode\n• Muted foreground text",
  control: "Pure neutral grays used for interactive chrome.\nExamples:\n• Default input border (control-200)\n• Disabled text (control-500)\n• Focus ring color",
  red: "Status hue powering error + destructive semantics.\nExamples:\n• Error / destructive at red-500\n• Error-subtle bg at red-50\n• Destructive-hover at red-600",
  green: "Status hue powering success semantics.\nExamples:\n• Success badge at green-500\n• Success-subtle bg at green-50\n• Dark-mode success at green-400",
  amber: "Status hue powering warning semantics. Needs dark foreground — amber can't contrast white.\nExamples:\n• Warning bar at amber-500\n• Warning-subtle bg at amber-50\n• 'Expiring soon' chip",
  blue: "Status hue powering info semantics.\nExamples:\n• Info badge at blue-500\n• Info-subtle callout bg\n• 'New' indicator",
};

function RampRow({ ramp }: { ramp: string }) {
  return (
    <div title={RAMP_DESCRIPTIONS[ramp]}>
      <div className="text-sm font-medium mb-8 capitalize cursor-help">{ramp}</div>
      <div className="flex rounded-md overflow-hidden border border-border">
        {STEPS.map((step) => {
          const hex = primitiveHex(ramp, step);
          return (
            <div
              key={step}
              title={`--${ramp}-${step} · ${hex}`}
              className="flex-1 h-64 flex flex-col items-center justify-end pb-8 cursor-help"
              style={{
                backgroundColor: `var(--${ramp}-${step})`,
                color: parseInt(step) >= 500 ? "var(--surface-50)" : "var(--surface-950)",
              }}
            >
              <code className="text-xs">{step}</code>
              <code className="text-[9px] opacity-70 font-mono">{hex}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BreakpointReader() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (width === null) return null;
  const bp = width >= 1536 ? "2xl" : width >= 1280 ? "xl" : width >= 1024 ? "lg" : width >= 768 ? "md" : width >= 640 ? "sm" : width >= 480 ? "xs" : "(below xs)";

  return (
    <div className="rounded-md bg-card border border-border p-16">
      <code className="text-sm">window: {width}px → breakpoint: {bp}</code>
    </div>
  );
}
