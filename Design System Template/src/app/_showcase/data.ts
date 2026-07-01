// Shared data + helpers for the showcase pages. Plain TS (no JSX) so it can be
// imported by any client page. This is SCAFFOLD — not part of the kit.

import primitivesJson from "@/design-system/tokens/primitives.json";
import semanticLightJson from "@/design-system/tokens/semantic-light.json";
import semanticDarkJson from "@/design-system/tokens/semantic-dark.json";

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

export type SemanticPair = { bg: string; fg: string; label: string; usage: string };

// Semantic tokens grouped by family — each group renders as its own row.
export const SEMANTIC_GROUPS: Array<{ label: string; pairs: SemanticPair[] }> = [
  {
    label: "Surfaces",
    pairs: [
      { bg: "canvas", fg: "foreground", label: "Canvas", usage: "The outermost base layer the whole app sits on. Pure white in light, near-black slate in dark.\nExamples:\n• App shell / body background\n• The backdrop pages float on\n• Behind every surface" },
      { bg: "background", fg: "foreground", label: "Page", usage: "The page surface that sits on the canvas.\nExamples:\n• Body background\n• Hero section background\n• Default layout color" },
      { bg: "card", fg: "card-foreground", label: "Card", usage: "Surface color for cards sitting on the page background.\nExamples:\n• Article cards in a feed\n• Stat tiles\n• Profile boxes" },
      { bg: "popover", fg: "popover-foreground", label: "Popover", usage: "Surface for anything that floats above the page — small or large.\nExamples:\n• Dialogs & drawers / sheets\n• Dropdown menus & command palette\n• Tooltips & date pickers" },
      { bg: "muted", fg: "muted-foreground", label: "Muted", usage: "Quieter surface for non-active areas.\nExamples:\n• Sidebar background\n• Table row hover\n• Code block background" },
    ],
  },
  {
    label: "Primary action",
    pairs: [
      { bg: "primary", fg: "primary-foreground", label: "Default", usage: "Default primary action color.\nExamples:\n• Main 'Save' button background\n• Active tab indicator\n• Default link color" },
      { bg: "primary-hover", fg: "primary-foreground", label: "Hover", usage: "Primary action when the cursor is over it.\nExamples:\n• Button under the mouse\n• Hovered nav link\n• Hovered active tab" },
      { bg: "primary-active", fg: "primary-foreground", label: "Active", usage: "Primary action while being pressed.\nExamples:\n• Button mid-click\n• Pressed-down state\n• Active toggle handle" },
    ],
  },
  {
    label: "Neutral action · secondary (deferred)",
    pairs: [
      { bg: "muted", fg: "foreground", label: "Default", usage: "Quiet, neutral action — our stand-in for a secondary button until a brand needs a dedicated token.\nExamples:\n• 'Cancel' button\n• Secondary toolbar action\n• Filter chips" },
      { bg: "disabled", fg: "disabled-foreground", label: "Disabled", usage: "Surface and text for controls that can't be interacted with.\nExamples:\n• Greyed-out 'Submit' button\n• Disabled menu item\n• Read-only input field" },
    ],
  },
  {
    label: "Destructive action",
    pairs: [
      { bg: "destructive", fg: "destructive-foreground", label: "Default", usage: "Action color for irreversible operations.\nExamples:\n• 'Delete account' button\n• 'Remove' icon button\n• Confirm dialog danger CTA" },
      { bg: "destructive-hover", fg: "destructive-foreground", label: "Hover", usage: "Destructive action when the cursor is over it.\nExamples:\n• Delete button under the mouse\n• Hovered 'Remove' icon\n• Hovered danger CTA" },
      { bg: "destructive-active", fg: "destructive-foreground", label: "Active", usage: "Destructive action while being pressed.\nExamples:\n• Mid-click on a delete\n• Pressed danger button" },
    ],
  },
  {
    label: "Error",
    pairs: [
      { bg: "error", fg: "error-foreground", label: "Default", usage: "State color signalling something went wrong.\nExamples:\n• Invalid form field border\n• System-error toast\n• Failed-validation icon" },
      { bg: "error-subtle", fg: "error-subtle-foreground", label: "Subtle", usage: "Soft tint for inline error messages.\nExamples:\n• Inline alert banner\n• Validation hint background\n• Error callout bg" },
    ],
  },
  {
    label: "Success",
    pairs: [
      { bg: "success", fg: "success-foreground", label: "Default", usage: "Affirmative color signaling a positive outcome.\nExamples:\n• 'Saved' toast\n• Success badge\n• Completed checkmark" },
      { bg: "success-hover", fg: "success-foreground", label: "Hover", usage: "Success-tinted action when hovered.\nExamples:\n• 'Approve' button hover\n• Hovered confirm CTA" },
      { bg: "success-subtle", fg: "success-subtle-foreground", label: "Subtle", usage: "Soft tint for inline success messages.\nExamples:\n• 'Profile updated' banner\n• Confirmation note background" },
    ],
  },
  {
    label: "Warning",
    pairs: [
      { bg: "warning", fg: "warning-foreground", label: "Default", usage: "Cautionary color signaling 'pay attention but don't panic'.\nExamples:\n• Unsaved changes bar\n• Expiring-soon badge\n• Warning toast" },
      { bg: "warning-hover", fg: "warning-foreground", label: "Hover", usage: "Warning-tinted action when hovered.\nExamples:\n• 'Acknowledge' button hover\n• Hovered warning CTA" },
      { bg: "warning-subtle", fg: "warning-subtle-foreground", label: "Subtle", usage: "Soft tint for inline warnings.\nExamples:\n• Caution callout background\n• Soft warning banner" },
    ],
  },
  {
    label: "Info",
    pairs: [
      { bg: "info", fg: "info-foreground", label: "Default", usage: "Neutral informational color.\nExamples:\n• 'New' badge\n• Info toast\n• Tip callout accent" },
      { bg: "info-hover", fg: "info-foreground", label: "Hover", usage: "Info-tinted action when hovered.\nExamples:\n• 'Learn more' button hover\n• Hovered info CTA" },
      { bg: "info-subtle", fg: "info-subtle-foreground", label: "Subtle", usage: "Soft tint for inline informational notes.\nExamples:\n• Tip callout background\n• 'Did you know' panel" },
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

export const RADII: Array<{ name: string; usage: string }> = [
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

export const SHADOWS: Array<{ name: string; usage: string }> = [
  { name: "xs", usage: "Barely-there elevation.\nExamples:\n• Hovered table row\n• Subtle card lift\n• Hovered list item" },
  { name: "sm", usage: "Default lift for cards.\nExamples:\n• Resting card shadow\n• Default elevated tile\n• Static info panel" },
  { name: "md", usage: "More noticeable lift for interactive elevation.\nExamples:\n• Hovered card\n• Dropdown menu\n• Expanded select" },
  { name: "lg", usage: "Floating element shadow.\nExamples:\n• Popover\n• Tooltip\n• Command palette" },
  { name: "xl", usage: "Strong shadow for fully-floating UI.\nExamples:\n• Modal dialog\n• Side sheet\n• Drawer overlay" },
  { name: "inner", usage: "Inset shadow for a pressed-in feel.\nExamples:\n• Pressed button state\n• 'Pushed in' input look\n• Inset avatar slot" },
];

export const SPACES = ["0", "1", "2", "4", "8", "12", "16", "20", "24", "32", "48", "64", "96", "128", "256"];

export const BREAKPOINTS: Array<{ name: string; px: number; usage: string }> = [
  { name: "xs", px: 480, usage: "Large phones, landscape." },
  { name: "sm", px: 640, usage: "Small tablets." },
  { name: "md", px: 768, usage: "Tablets / small laptops." },
  { name: "lg", px: 1024, usage: "Laptops." },
  { name: "xl", px: 1280, usage: "Desktops." },
  { name: "2xl", px: 1536, usage: "Large desktops." },
];
