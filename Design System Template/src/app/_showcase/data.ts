// Shared data + helpers for the showcase pages. Plain TS (no JSX) so it can be
// imported by any client page. This is SCAFFOLD — not part of the kit.

import primitivesJson from "@/design-system/tokens/primitives.json";
import semanticLightJson from "@/design-system/tokens/semantic-light.json";
import semanticDarkJson from "@/design-system/tokens/semantic-dark.json";

export const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
export const RAMPS = ["primary", "surface", "control", "red", "green", "amber", "blue"] as const;

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

// Pick a readable text token (light vs dark) for a given hex background, via
// WCAG relative luminance. Returns a CSS var so it still tracks the theme.
export function readableOn(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return "var(--surface-950)";
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLin(parseInt(h.slice(0, 2), 16));
  const g = toLin(parseInt(h.slice(2, 4), 16));
  const b = toLin(parseInt(h.slice(4, 6), 16));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.45 ? "var(--surface-950)" : "var(--surface-50)";
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
  { subtitle: string; overview: string; base: string }
> = {
  primary: { subtitle: "Brand ramp", base: "800", overview: "The white-label hook. Every primary action derives from this scale — swap it to rebrand the whole system." },
  surface: { subtitle: "Warm neutrals", base: "50", overview: "Backgrounds, cards, popovers, and the muted text on them. Slightly warm so large areas feel softer than pure gray." },
  control: { subtitle: "Pure neutrals", base: "100", overview: "Interactive chrome — input borders, dividers, disabled states, focus ring. Neutral so it never competes with content." },
  red: { subtitle: "Status · danger", base: "50", overview: "Powers both error (a state) and destructive (an action) semantics." },
  green: { subtitle: "Status · success", base: "50", overview: "Affirmative, positive outcomes — success states and confirmations." },
  amber: { subtitle: "Status · warning", base: "50", overview: "Caution without alarm. Needs a dark foreground — amber can't carry white text." },
  blue: { subtitle: "Status · info", base: "50", overview: "Neutral informational accents — tips, 'new' markers, info states." },
};

export const SEMANTIC_PAIRS: Array<{ bg: string; fg: string; label: string; usage: string }> = [
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

export const RAMP_DESCRIPTIONS: Record<string, string> = {
  primary: "Brand ramp — the white-label hook. Currently pure grayscale.\nExamples:\n• Default button bg comes from primary-800\n• Link color comes from primary-600\n• Hover/active step through 900 / 950",
  surface: "Warm grays used for large flat areas and surrounding text.\nExamples:\n• Page bg from surface-50 (light) / surface-900 (dark)\n• Card surface in dark mode\n• Muted foreground text",
  control: "Pure neutral grays used for interactive chrome.\nExamples:\n• Default input border (control-200)\n• Disabled text (control-500)\n• Focus ring color",
  red: "Status hue powering error + destructive semantics.\nExamples:\n• Error / destructive at red-500\n• Error-subtle bg at red-50\n• Destructive-hover at red-600",
  green: "Status hue powering success semantics.\nExamples:\n• Success badge at green-500\n• Success-subtle bg at green-50\n• Dark-mode success at green-400",
  amber: "Status hue powering warning semantics. Needs dark foreground — amber can't contrast white.\nExamples:\n• Warning bar at amber-500\n• Warning-subtle bg at amber-50\n• 'Expiring soon' chip",
  blue: "Status hue powering info semantics.\nExamples:\n• Info badge at blue-500\n• Info-subtle callout bg\n• 'New' indicator",
};
