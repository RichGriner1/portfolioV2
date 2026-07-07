# Worked example: portfolioV2 (Tailwind v4, three layers)

A real, correct token system to use as the reference standard for "good." This is the *example*, not the rule other projects are judged by — each project is judged against its own discovered token source.

**Source:** `src/app/globals.css`. **Stack:** Next.js 16, Tailwind v4 (CSS-first `@theme`, no `tailwind.config.ts`).

## The three layers
1. **Primitives** — raw OKLCH colors, ms durations, rems. Live in `:root` / `.dark`. *Components never touch these.*
2. **Semantic** — role aliases: `--background`, `--foreground`, `--card`, `--popover`, `--muted`, `--primary`, `--secondary`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, chart + sidebar sets. *This is the only layer components use.*
3. **Component** — extra tokens a shadcn component adds as needed.

`@theme inline` bridges the semantic layer to Tailwind utilities. Dark mode is class-based (`.dark`, toggled by `next-themes`); `@custom-variant dark (&:is(.dark *))` wires the `dark:` modifier.

## The vocabulary a component is allowed to use
- **Surfaces/text:** `bg-background`/`text-foreground`, `bg-card`/`text-card-foreground`, `bg-popover`, `bg-muted`/`text-muted-foreground`.
- **Actions:** `bg-primary`/`text-primary-foreground`, `bg-secondary`, `bg-accent`, `bg-destructive`.
- **Chrome:** `border-border`, `bg-input`, `ring-ring`.
- **Radius** (all derived from one `--radius: 0.625rem`): `rounded-xs|sm|md|lg|xl|2xl|3xl|4xl`.
- **Shadow:** `shadow-xs|sm|md|lg|xl` (tuned per light/dark theme).
- **Motion:** `duration-fast` (120ms) · `duration-base` (200ms) · `duration-slow` (320ms); `ease-out-soft` · `ease-in-out-soft` · `ease-spring`.
- **Type:** `font-sans` · `font-mono` · `font-display`.

## Reference component
`src/components/ui/button.tsx` is the model: `cva` variants + `cn()`, only semantic utilities (`bg-primary`, `text-primary-foreground`, `bg-muted`, `border-border`, `focus-visible:ring-ring/50`, `rounded-lg`), `data-slot` attributes, built on **Base UI** (not Radix — use the `render` prop, not `asChild`). `work-card.tsx` shows the one legitimate escape hatch: `style={{ backgroundColor: item.bgColor }}` for a data-driven per-item color.

## The `.ds-scope` caveat
`globals.css` also has a large `.ds-scope` block (a separate, scoped token layer for the ported `/methodology/color` page) that redefines `--spacing` and full primitive ramps. It's intentionally inert outside `.ds-scope` — don't treat its tokens as globally available.
