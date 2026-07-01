// Shared data + helpers for the ported Color methodology page. Plain TS (no
// JSX) so it can be imported by the client page. Ported from the Design System
// Template showcase — SCAFFOLD, not part of the kit.

import primitivesJson from "./tokens/primitives.json";
import semanticLightJson from "./tokens/semantic-light.json";
import semanticDarkJson from "./tokens/semantic-dark.json";

export const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
export const RAMPS = ["primary", "neutral", "control", "red", "green", "amber", "blue"] as const;

export type TokenNode = { $type: string; $value: string };
export type Resolved = { primitive: string; hex: string };

export function resolveSemantic(name: string, theme: "light" | "dark"): Resolved | null {
  const json = theme === "light" ? semanticLightJson : semanticDarkJson;
  const tokenObj = (json.semantic.color as Record<string, TokenNode>)[name];
  if (!tokenObj) return null;
  const match = tokenObj.$value.match(/^\{color\.([^.]+)\.([^}]+)\}$/);
  if (!match) {
    return { primitive: "(literal)", hex: tokenObj.$value };
  }
  const [, ramp, step] = match;
  const colorRoot = primitivesJson.color as unknown as Record<string, Record<string, TokenNode>>;
  const hex = colorRoot[ramp]?.[step]?.$value ?? "";
  return { primitive: `${ramp}-${step}`, hex };
}

export function primitiveHex(ramp: string, step: string): string {
  const colorRoot = primitivesJson.color as unknown as Record<string, Record<string, TokenNode>>;
  return colorRoot[ramp]?.[step]?.$value ?? "";
}

export function durationMs(d: "fast" | "base" | "slow" | "slower"): number {
  return { fast: 120, base: 200, slow: 320, slower: 500 }[d];
}

// WCAG relative luminance for a #rrggbb hex. null if unparseable.
function relLuminance(hex: string): number | null {
  const h = hex.replace("#", "");
  if (h.length < 6) return null;
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLin(parseInt(h.slice(0, 2), 16));
  const g = toLin(parseInt(h.slice(2, 4), 16));
  const b = toLin(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Pick a readable text token (light vs dark) for a given hex background.
// Returns a CSS var so it still tracks the theme.
export function readableOn(hex: string): string {
  const L = relLuminance(hex);
  if (L === null) return "var(--neutral-950)";
  return L > 0.45 ? "var(--neutral-950)" : "var(--neutral-50)";
}

// WCAG contrast ratio between two hex colors (1–21). null if unparseable.
export function contrastRatio(a: string, b: string): number | null {
  const La = relLuminance(a);
  const Lb = relLuminance(b);
  if (La === null || Lb === null) return null;
  return (Math.max(La, Lb) + 0.05) / (Math.min(La, Lb) + 0.05);
}

// Map a ratio to its WCAG level for normal text.
export function wcagLevel(ratio: number): { label: string; pass: boolean } {
  if (ratio >= 7) return { label: "AAA", pass: true };
  if (ratio >= 4.5) return { label: "AA", pass: true };
  if (ratio >= 3) return { label: "AA Large", pass: true };
  return { label: "Fail", pass: false };
}

// Split a usage string ("overview\nExamples:\n• a\n• b") into parts.
export function parseUsage(usage: string): { overview: string; examples: string[] } {
  const [overview, rest] = usage.split(/\nExamples:\n/);
  const examples = rest
    ? rest.split("\n").map((l) => l.replace(/^•\s*/, "").trim()).filter(Boolean)
    : [];
  return { overview: overview.trim(), examples };
}

// Subtitle + overview + which step represents the ramp in the bento card.
export const PRIMITIVE_RAMP_INFO: Record<
  string,
  { subtitle: string; overview: string; base: string; uses: string[] }
> = {
  primary: {
    subtitle: "Brand ramp",
    base: "800",
    overview: "The white-label hook. Every primary action derives from this scale — swap it to rebrand the whole system.",
    uses: ["Primary buttons & key CTAs (800)", "Links and active states (600)", "Hover / active steps (900 / 950)"],
  },
  neutral: {
    subtitle: "Slate · text + surfaces",
    base: "50",
    overview: "A cool blue-gray (slate) that does double duty — the surfaces you read on (page, cards, popovers) and the text on them (foreground, muted). Named neutral, not surface, because it's both.",
    uses: ["Page, card & popover backgrounds (50)", "Foreground & muted text (600+ / 950)", "Muted / secondary surfaces (100)"],
  },
  control: {
    subtitle: "Zinc · cool chrome",
    base: "100",
    overview: "The grays for the lines and states around controls — input borders, dividers, the focus ring, disabled. Kept separate from the neutral ramp so a border never blends into the surface it sits on.",
    uses: ["Input borders & dividers (200)", "Focus ring (400)", "Disabled surface & text (100 / 500)"],
  },
  red: {
    subtitle: "Status · danger",
    base: "50",
    overview: "Drives both error (a state) and destructive (an action).",
    uses: ["Error & destructive surfaces (600)", "Subtle error tints (50)", "Destructive hover / active (700 / 800)"],
  },
  green: {
    subtitle: "Status · success",
    base: "50",
    overview: "Positive outcomes — success states and confirmations.",
    uses: ["Success surfaces (700, AA on white)", "Subtle success tints (50)", "Success text on a tint (700)"],
  },
  amber: {
    subtitle: "Status · warning",
    base: "50",
    overview: "Caution without alarm. Needs a dark foreground — amber can't carry white text.",
    uses: ["Warning surfaces (500, dark text)", "Subtle warning tints (50)", "Warning text on a tint (700)"],
  },
  blue: {
    subtitle: "Status · info",
    base: "50",
    overview: "Informational accents — tips, 'new' markers, info states.",
    uses: ["Info surfaces (600)", "Subtle info tints (50)", "Info hover (700)"],
  },
};

export type SemanticPair = { bg: string; fg: string; label: string; usage: string; ghost?: boolean };

// Semantic tokens grouped by family — each group renders as its own row.
// Each group is a set of rows. A "variant" (filled / subtle / ghost) is one row
// of default · hover · active. Surfaces + status groups use a single row.
// `flat` groups (actions) render non-ghost cards with no border — a filled
// button is a solid surface, not an outlined one. Ghost keeps its border.
export const SEMANTIC_GROUPS: Array<{ label: string; flat?: boolean; rows: SemanticPair[][] }> = [
  {
    label: "Surfaces",
    rows: [
      [
        { bg: "canvas", fg: "foreground", label: "Canvas", usage: "The outermost base layer the whole app sits on. Pure white in light, near-black slate in dark.\nExamples:\n• App shell / body background\n• The backdrop pages float on\n• Behind every surface" },
        { bg: "background", fg: "foreground", label: "Page", usage: "The page surface that sits on the canvas.\nExamples:\n• Body background\n• Hero section background\n• Default layout color" },
        { bg: "card", fg: "card-foreground", label: "Card", usage: "Surface color for cards sitting on the page background.\nExamples:\n• Article cards in a feed\n• Stat tiles\n• Profile boxes" },
        { bg: "popover", fg: "popover-foreground", label: "Popover", usage: "Surface for anything that floats above the page — small or large.\nExamples:\n• Dialogs & drawers / sheets\n• Dropdown menus & command palette\n• Tooltips & date pickers" },
        { bg: "muted", fg: "muted-foreground", label: "Muted", usage: "Quieter surface for non-active areas.\nExamples:\n• Sidebar background\n• Table row hover\n• Code block background" },
        { bg: "disabled", fg: "disabled-foreground", label: "Disabled", usage: "The one surface + text combo used for anything non-interactive. Reach for it on any disabled control.\nExamples:\n• Greyed-out 'Submit' button\n• Disabled menu item\n• Read-only input field" },
      ],
    ],
  },
  {
    label: "Primary action",
    flat: true,
    rows: [
      [
        { bg: "primary", fg: "primary-foreground", label: "Default", usage: "Filled — the main affirmative action.\nExamples:\n• 'Save' / 'Continue' button\n• Primary CTA\n• Active tab indicator" },
        { bg: "primary-hover", fg: "primary-foreground", label: "Hover", usage: "Filled primary under the cursor.\nExamples:\n• Button on hover" },
        { bg: "primary-active", fg: "primary-foreground", label: "Active", usage: "Filled primary while pressed.\nExamples:\n• Button mid-click" },
      ],
      [
        { bg: "primary-subtle", fg: "primary-subtle-foreground", label: "Subtle", usage: "Low-emphasis filled — a light brand tint + brand text. (Looks grey until you rebrand primary.)\nExamples:\n• Low-emphasis primary action\n• Selected filter chip\n• Active nav item background" },
        { bg: "primary-subtle-hover", fg: "primary-subtle-foreground", label: "Hover", usage: "Subtle primary under the cursor.\nExamples:\n• Subtle button on hover" },
        { bg: "primary-subtle-active", fg: "primary-subtle-foreground", label: "Active", usage: "Subtle primary while pressed.\nExamples:\n• Subtle button mid-click" },
      ],
      [
        { bg: "primary", fg: "primary", label: "Ghost", ghost: true, usage: "No fill — primary text on the surface; faint tint on hover. Lowest-emphasis primary.\nExamples:\n• Tertiary toolbar action\n• 'Learn more' link-button" },
        { bg: "primary-ghost-hover", fg: "primary", label: "Hover", usage: "Ghost primary under the cursor — a faint brand tint appears.\nExamples:\n• Ghost button on hover" },
        { bg: "primary-ghost-active", fg: "primary", label: "Active", usage: "Ghost primary while pressed — a slightly stronger tint.\nExamples:\n• Ghost button mid-click" },
      ],
    ],
  },
  {
    label: "Neutral action · secondary",
    flat: true,
    rows: [
      [
        { bg: "secondary", fg: "secondary-foreground", label: "Default", usage: "The neutral secondary action — quiet, color-free.\nExamples:\n• 'Cancel' button\n• Secondary toolbar action\n• Filter chips" },
        { bg: "secondary-hover", fg: "secondary-foreground", label: "Hover", usage: "Secondary under the cursor.\nExamples:\n• Cancel on hover" },
        { bg: "secondary-active", fg: "secondary-foreground", label: "Active", usage: "Secondary while pressed.\nExamples:\n• Cancel mid-click" },
      ],
      [
        { bg: "secondary", fg: "foreground", label: "Ghost", ghost: true, usage: "No fill — plain text on the surface; neutral tint on hover. The tertiary text button.\nExamples:\n• 'Skip' / 'Maybe later'\n• Overflow-menu items\n• Icon-only toolbar buttons" },
        { bg: "secondary", fg: "foreground", label: "Hover", usage: "Ghost neutral under the cursor — a faint neutral tint.\nExamples:\n• Text button on hover" },
        { bg: "secondary-hover", fg: "foreground", label: "Active", usage: "Ghost neutral while pressed.\nExamples:\n• Text button mid-click" },
      ],
    ],
  },
  {
    label: "Destructive action",
    flat: true,
    rows: [
      [
        { bg: "destructive", fg: "destructive-foreground", label: "Default", usage: "Filled — highest-emphasis danger action.\nExamples:\n• 'Delete account' confirm\n• Primary danger CTA in a dialog" },
        { bg: "destructive-hover", fg: "destructive-foreground", label: "Hover", usage: "Filled destructive under the cursor.\nExamples:\n• Delete button on hover" },
        { bg: "destructive-active", fg: "destructive-foreground", label: "Active", usage: "Filled destructive while pressed.\nExamples:\n• Delete mid-click" },
      ],
      [
        { bg: "destructive-subtle", fg: "destructive-subtle-foreground", label: "Subtle", usage: "Low-emphasis filled — a quiet delete/remove.\nExamples:\n• 'Remove' in a list row\n• Secondary danger action" },
        { bg: "destructive-subtle-hover", fg: "destructive-subtle-foreground", label: "Hover", usage: "Subtle destructive under the cursor.\nExamples:\n• 'Remove' on hover" },
        { bg: "destructive-subtle-active", fg: "destructive-subtle-foreground", label: "Active", usage: "Subtle destructive while pressed.\nExamples:\n• 'Remove' mid-click" },
      ],
      [
        { bg: "destructive", fg: "destructive-subtle-foreground", label: "Ghost", ghost: true, usage: "No fill — destructive text on the surface; tint on hover. Lowest-emphasis danger.\nExamples:\n• Tertiary 'Delete' in a menu\n• Icon-only remove" },
        { bg: "destructive-ghost-hover", fg: "destructive-subtle-foreground", label: "Hover", usage: "Ghost destructive under the cursor — a faint red tint.\nExamples:\n• Ghost delete on hover" },
        { bg: "destructive-ghost-active", fg: "destructive-subtle-foreground", label: "Active", usage: "Ghost destructive while pressed.\nExamples:\n• Ghost delete mid-click" },
      ],
    ],
  },
  {
    label: "Control · form fields",
    rows: [
      [
        { bg: "control", fg: "control-foreground", label: "Default", usage: "A form control at rest — the fill used for any input, select, checkbox or toggle.\nExamples:\n• Text field background\n• Checkbox / toggle track\n• Segmented control" },
        { bg: "control-hover", fg: "control-foreground", label: "Hover", usage: "A control under the cursor.\nExamples:\n• Field on hover\n• Hovered toggle\n• Hovered segment" },
        { bg: "control-active", fg: "control-foreground", label: "Active", usage: "A control while pressed or switched on.\nExamples:\n• Pressed segment\n• Checked toggle track\n• Active field" },
      ],
    ],
  },
  {
    label: "Error",
    rows: [
      [
        { bg: "error", fg: "error-foreground", label: "Default", usage: "State color signalling something went wrong.\nExamples:\n• Invalid form field border\n• System-error toast\n• Failed-validation icon" },
        { bg: "error-subtle", fg: "error-subtle-foreground", label: "Subtle", usage: "Soft tint for inline error messages.\nExamples:\n• Inline alert banner\n• Validation hint background\n• Error callout bg" },
      ],
    ],
  },
  {
    label: "Success",
    rows: [
      [
        { bg: "success", fg: "success-foreground", label: "Default", usage: "Affirmative color signaling a positive outcome.\nExamples:\n• 'Saved' toast\n• Success badge\n• Completed checkmark" },
        { bg: "success-subtle", fg: "success-subtle-foreground", label: "Subtle", usage: "Soft tint for inline success messages.\nExamples:\n• 'Profile updated' banner\n• Confirmation note background" },
      ],
    ],
  },
  {
    label: "Warning",
    rows: [
      [
        { bg: "warning", fg: "warning-foreground", label: "Default", usage: "Cautionary color — 'pay attention but don't panic'.\nExamples:\n• Unsaved changes bar\n• Expiring-soon badge\n• Warning toast" },
        { bg: "warning-subtle", fg: "warning-subtle-foreground", label: "Subtle", usage: "Soft tint for inline warnings.\nExamples:\n• Caution callout background\n• Soft warning banner" },
      ],
    ],
  },
  {
    label: "Info",
    rows: [
      [
        { bg: "info", fg: "info-foreground", label: "Default", usage: "Neutral informational color.\nExamples:\n• 'New' badge\n• Info toast\n• Tip callout accent" },
        { bg: "info-subtle", fg: "info-subtle-foreground", label: "Subtle", usage: "Soft tint for inline informational notes.\nExamples:\n• Tip callout background\n• 'Did you know' panel" },
      ],
    ],
  },
];

export const BORDERS: Array<{ name: string; usage: string }> = [
  { name: "border", usage: "Default border for surfaces and dividers.\nExamples:\n• Card outline\n• Section divider line\n• Default input border" },
  { name: "border-strong", usage: "Emphasized border for higher-contrast outlines.\nExamples:\n• Selected card outline\n• Hovered card border\n• Important separator" },
  { name: "input-border", usage: "Border color specifically for input fields.\nExamples:\n• Text field at rest\n• Select dropdown border\n• Textarea outline" },
  { name: "input-border-hover", usage: "Input border on hover, signaling interactivity.\nExamples:\n• Text field under the mouse\n• Hovered combobox\n• Hovered date input" },
  { name: "ring", usage: "Focus ring for keyboard navigation.\nExamples:\n• Focused button outline\n• Focused input ring\n• Focused link halo" },
];
