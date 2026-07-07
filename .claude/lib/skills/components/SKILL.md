---
name: components
description: Prefer the project's design-system components over bespoke ones. Use when reviewing or writing UI and deciding whether a hand-rolled element should be a shared DS component, when running /ds-cleanup, or when judging "should this be a one-off or a system component." Works with whatever component library the project actually uses — shadcn, PrimeNG, a custom DS, or none.
---

# Components: build systems, not screens

Embodies principle **10 (Build Systems, Not Screens)**: every screen is assembled from reusable building blocks; a decision that improves the design system beats one that improves a single page. Components take priority over one-off solutions.

## First: what DS does this project have?
From discovery (see the `design-tokens` skill's discovery step), the component library is one of:
- **shadcn** (`components.json`, `src/components/ui/*`) — owned code, edit freely; extend variants via `cva`, don't fork.
- **PrimeNG** (`primeng`, `p-*` selectors) — used by *one* Afi team, not all. Customize via the preset/theme, never `::ng-deep`.
- **Project-custom DS** — a local component set; treat it like shadcn (extend, don't bypass).
- **None** — bespoke components are expected. Then this skill relaxes to "keep the bespoke ones consistent and factor out repetition," not "swap for a library."

## The core check
For any hand-rolled UI element, ask (this is decision-filter Q3 + Q5):
1. **Does a DS component already do this?** → use it. A bespoke `<button>` where `<Button>` exists is the textbook violation.
2. **Could this become a reusable component?** → if this is the 2nd+ time the pattern appears, factor it into the DS instead of copy-pasting.
3. **Is this genuinely a one-off?** → sometimes yes. See below.

## Replacement guidance
When you find a bespoke element that duplicates a DS component:
- Report it: `<file:line> — bespoke <thing> duplicates <DS component> → replace`.
- The fix preserves behavior/props and moves styling to the component's tokened variants — it does **not** re-hard-code styles on the replacement.
- If the bespoke element does something the DS component *almost* does, prefer **extending the DS component** (a new variant) over keeping the fork.

## When a one-off is legitimate
Not everything must be a shared component. A one-off is fine when **all** hold:
- It appears exactly once and there's no near-duplicate elsewhere.
- It composes existing DS primitives (still uses tokens) rather than reinventing them.
- Making it generic now would be speculative (you'd invent props no one needs — over-engineering).

Document the intentional one-off briefly so the next reviewer doesn't re-flag it. When in doubt between "extract now" and "wait," extract on the *second* occurrence, not the first.
