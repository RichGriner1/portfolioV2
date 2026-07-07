# Tell-sheet: React / Tailwind

Framework lens for React/Next codebases using Tailwind (v4 `@theme` semantic utilities). Scan `.tsx` / `.jsx` / any CSS. For each hit, report `<file:line> — <hard-coded value> → <semantic token/utility>`.

## Hard-coded color (most common)
- **Tailwind palette utilities**: `bg-zinc-50`, `text-gray-500`, `border-slate-200`, `bg-blue-600` → use semantic: `bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`.
- **Hex / rgb / hsl in className or CSS**: `text-[#111]`, `bg-[#0a0a0a]`, `border-[rgb(0,0,0)]` → semantic utility.
- **Inline style color**: `style={{ color: "#111", background: "#fff" }}` → className with semantic utility. (Exception: genuinely data-driven values — e.g. `style={{ backgroundColor: item.brandColor }}` — are allowed; they can't be tokens.)

## Hard-coded radius / shadow
- **Arbitrary radius**: `rounded-[7px]`, `rounded-[0.5rem]` → the radius scale (`rounded-sm|md|lg|xl…`). A bracketed radius is allowed only when it's clamping to a token (`rounded-[min(var(--radius-md),10px)]`).
- **Arbitrary / raw shadow**: `shadow-[0_2px_8px_rgba(0,0,0,.2)]`, or an over-heavy `shadow-2xl` where the scale tops out lower → the shadow scale (`shadow-xs|sm|md|lg|xl`). Over-heavy elevation is also a principle-04/anti-pattern flag (Material bloat).

## Hard-coded spacing (softer — Tailwind's scale is already tokens)
- Tailwind's `p-4`, `gap-2`, `mt-6` **are** the spacing tokens — fine. Flag only **arbitrary** spacing: `p-[13px]`, `gap-[7px]`, `mt-[22px]` → nearest scale step, or extend the scale if the value recurs.

## Hard-coded motion
- **Arbitrary duration/easing**: `duration-[240ms]`, `ease-[cubic-bezier(...)]`, or an inline `transition: all 0.24s` → the motion tokens (`duration-fast|base|slow`, `ease-out-soft|in-out-soft|spring`).
- **Decorative animation** (animates for its own sake) → principle 07 (Motion Explains State), not a token issue.

## Not violations
- Semantic utilities (`bg-background`, `text-foreground`, `border-border`, `ring-ring`, `bg-primary`, …).
- Scale utilities (`p-4`, `rounded-md`, `shadow-sm`, `duration-base`).
- Data-driven inline values that can't be tokens (flag only if undocumented).
