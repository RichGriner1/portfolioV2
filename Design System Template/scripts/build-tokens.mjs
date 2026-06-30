#!/usr/bin/env node
// Reads W3C Design Tokens JSON files and emits a Tailwind v4-ready tokens.css.
// Zero deps — runs without `pnpm install`.
//
// Source files:
//   src/design-system/tokens/primitives.json
//   src/design-system/tokens/semantic-light.json
//   src/design-system/tokens/semantic-dark.json
//
// Output:
//   src/design-system/tokens/tokens.css

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TOKEN_DIR = resolve(ROOT, "src/design-system/tokens");

const primitives = readJson(resolve(TOKEN_DIR, "primitives.json"));
const light      = readJson(resolve(TOKEN_DIR, "semantic-light.json"));
const dark       = readJson(resolve(TOKEN_DIR, "semantic-dark.json"));

const flatPrimitives = flatten(primitives);
const flatLight      = flatten(light);
const flatDark       = flatten(dark);

const css = buildCss({ flatPrimitives, flatLight, flatDark });

mkdirSync(TOKEN_DIR, { recursive: true });
writeFileSync(resolve(TOKEN_DIR, "tokens.css"), css);

console.log(`✓ wrote ${resolve(TOKEN_DIR, "tokens.css")}`);
console.log(`  ${Object.keys(flatPrimitives).length} primitives`);
console.log(`  ${Object.keys(flatLight).length} semantic (light)`);
console.log(`  ${Object.keys(flatDark).length} semantic (dark)`);

/* -------------------------------------------------------------------------- */

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

// Walk the token tree and return a flat map of dotted-path -> { type, value }.
// Strips $description and any other $-prefixed metadata at the root.
function flatten(tree, prefix = "", out = {}) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (node && typeof node === "object" && "$value" in node) {
      out[path] = { type: node.$type, value: node.$value };
    } else if (node && typeof node === "object") {
      flatten(node, path, out);
    }
  }
  return out;
}

// Convert a dotted token path to a CSS variable name.
//   color.primary.500           -> --primary-500
//   semantic.color.background   -> --background
//   dimension.16                -> --space-16
//   breakpoint.md               -> --breakpoint-md
//   radius.lg                   -> --radius-lg
//   duration.base               -> --duration-base
//   easing.out-soft             -> --ease-out-soft
//   shadow.md                   -> --shadow-md
//   font.sans                   -> --font-sans
function toVarName(path) {
  const parts = path.split(".");
  const [ns, ...rest] = parts;
  switch (ns) {
    case "color":     return `--${rest.join("-")}`;
    case "semantic":  return `--${rest.slice(1).join("-")}`; // drop the inner "color"
    case "dimension": return `--space-${rest.join("-")}`;
    case "breakpoint":return `--breakpoint-${rest.join("-")}`;
    case "radius":    return `--radius-${rest.join("-")}`;
    case "duration":  return `--duration-${rest.join("-")}`;
    case "easing":    return `--ease-${rest.join("-")}`;
    case "shadow":    return `--shadow-${rest.join("-")}`;
    case "font":      return `--font-${rest.join("-")}`;
    default:          return `--${parts.join("-")}`;
  }
}

// Resolve {token.path.alias} references in a value string.
// Recursive so aliases-of-aliases work.
function resolveValue(value, allFlats, seen = new Set()) {
  if (typeof value !== "string") return value;
  return value.replace(/\{([^}]+)\}/g, (_, ref) => {
    if (seen.has(ref)) throw new Error(`circular alias: ${ref}`);
    seen.add(ref);
    for (const flat of allFlats) {
      if (flat[ref]) {
        return resolveValue(flat[ref].value, allFlats, seen);
      }
    }
    throw new Error(`unresolved alias: {${ref}}`);
  });
}

// Build the full tokens.css output:
//   :root { ...primitives + light semantic... }
//   .dark { ...dark semantic overrides... }
//   @theme inline { ...Tailwind bridge... }
function buildCss({ flatPrimitives, flatLight, flatDark }) {
  const allFlats = [flatPrimitives, flatLight, flatDark];

  const primitiveLines = Object.entries(flatPrimitives)
    .map(([path, t]) => `  ${toVarName(path)}: ${resolveValue(t.value, allFlats)};`)
    .join("\n");

  const lightLines = Object.entries(flatLight)
    .map(([path, t]) => `  ${toVarName(path)}: ${resolveValue(t.value, allFlats)};`)
    .join("\n");

  const darkLines = Object.entries(flatDark)
    .map(([path, t]) => `  ${toVarName(path)}: ${resolveValue(t.value, allFlats)};`)
    .join("\n");

  const themeBridge = buildThemeBridge({ flatPrimitives, flatLight });

  return `/* ============================================================================
   GENERATED FILE — DO NOT EDIT BY HAND.
   Edit primitives.json / semantic-light.json / semantic-dark.json instead,
   then run \`pnpm tokens:build\`.
   ============================================================================ */

@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

/* ----------------------------------------------------------------------------
   :root — primitives + light-theme semantic tokens
   ---------------------------------------------------------------------------- */
:root {
${primitiveLines}

${lightLines}

  /* Tailwind v4 spacing primitive: 1 unit = 1px. So \`p-4\` = 4px, \`gap-16\` = 16px. */
  --spacing: 0.0625rem;

  /* Default transition (Tailwind \`transition\` utility uses these) */
  --default-transition-duration: var(--duration-base);
  --default-transition-timing-function: var(--ease-out-soft);
}

/* ----------------------------------------------------------------------------
   .dark — semantic overrides
   ---------------------------------------------------------------------------- */
.dark {
${darkLines}
}

/* ----------------------------------------------------------------------------
   @theme inline — bridge to Tailwind v4 utility classes.
   Exposes semantic tokens as \`bg-*\`, \`text-*\`, \`border-*\`, \`rounded-*\`, etc.
   ---------------------------------------------------------------------------- */
@theme inline {
${themeBridge}
}

/* ----------------------------------------------------------------------------
   Base layer — sensible defaults so components don't have to repeat them
   ---------------------------------------------------------------------------- */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    @apply font-sans antialiased;
  }
  body {
    @apply bg-background text-foreground;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-display tracking-tight text-balance;
  }
  p {
    @apply text-pretty;
  }
}
`;
}

// Emit the @theme bridge.
//
// Semantic colors stay as `var(--name)` so the .dark override works at runtime.
// Everything else emits the LITERAL resolved value — necessary because Tailwind
// generates `@media (width >= var(--breakpoint-md))` from breakpoint tokens, and
// CSS @media queries cannot resolve var() at parse time.
function buildThemeBridge({ flatPrimitives, flatLight }) {
  const allFlats = [flatPrimitives, flatLight];
  const lines = [];

  // Semantic colors — keep as var() so dark-mode override propagates
  for (const path of Object.keys(flatLight)) {
    const name = path.replace(/^semantic\.color\./, "");
    lines.push(`  --color-${name}: var(--${name});`);
  }

  // Helper — emit literal resolved value for a primitive
  const emitLiteral = (prefix, stripLen, themeNs) => {
    for (const path of Object.keys(flatPrimitives)) {
      if (!path.startsWith(prefix)) continue;
      const name = path.slice(stripLen).replace(/\./g, "-");
      const value = resolveValue(flatPrimitives[path].value, allFlats);
      lines.push(`  --${themeNs}-${name}: ${value};`);
    }
  };

  emitLiteral("color.",      "color.".length,      "color");
  emitLiteral("breakpoint.", "breakpoint.".length, "breakpoint");
  emitLiteral("radius.",     "radius.".length,     "radius");
  emitLiteral("shadow.",     "shadow.".length,     "shadow");
  emitLiteral("duration.",   "duration.".length,   "duration");
  emitLiteral("easing.",     "easing.".length,     "ease");
  emitLiteral("font.",       "font.".length,       "font");

  return lines.join("\n");
}
