---
name: design-tokens
description: The universal design-token rule and how to enforce it in any codebase. Components touch only the semantic token layer — never hard-code color, spacing, radius, shadow, or motion. Use when reviewing or writing UI code and checking that values come from the token system, when running /ds-cleanup, or when you need to find a project's token source and the framework-specific ways people bypass it (React/Tailwind or Angular). Framework- and library-agnostic via a discovery step.
---

# Design tokens (the enforceable rule)

## The universal rule (every project, every framework)

1. **Components touch only the semantic layer.** primitives → **semantic** → component. Components use role-based tokens (`background`, `foreground`, `primary`, `border`…), never raw primitives and never raw values.
2. **Never hard-code** color, spacing, radius, shadow, or motion (duration/easing). If it's a hex, an `rgb()`, a raw px/rem for spacing, a magic radius, a magic shadow, or a magic duration — it's a violation.
3. **Never skip a layer.** A component reaching past semantic tokens to a primitive (or a raw value) is drift, even when the value "looks right."
4. **If a value doesn't exist in the token system, pause.** Don't invent one inline. Either extend the token system (and document it) or ask. Inventing values inline is the single most common way a design system rots.

This rule is constant. What *changes* per project is **where the tokens live** and **how people bypass them** — that's what discovery and the framework tell-sheets handle.

## Before you review or write: discover

Read [discovery.md](references/discovery.md) and detect **three things independently** — do not infer one from another:
- **(a) Framework** → picks the tell-sheet: React/Next → [react-tailwind.md](references/react-tailwind.md); Angular → [angular.md](references/angular.md).
- **(b) Token source** → the vocabulary of legal values (Tailwind `@theme`, a `tokens.json`, a PrimeNG preset, Angular theme/SCSS maps).
- **(c) Component library** → shadcn / PrimeNG / a project-custom DS / none. (Handled by the `components` skill — **do not assume Angular means PrimeNG; only one Afi team uses it.**)

## Then apply the matching tell-sheet
Each tell-sheet lists the concrete ways that framework hard-codes values and the correct semantic replacement. Flag violations as `<file:line> — <what's hard-coded> → <the token/utility it should use>`.

## Worked example
[example-portfoliov2.md](references/example-portfoliov2.md) shows a real, correct token system (this repo's three-layer Tailwind v4 setup) as the reference standard for what "good" looks like. Other projects are judged against *their own* discovered token source, not this one.

## What is NOT a violation
- A documented escape hatch (an explicitly-named exception token, or a data-driven value that can't be a token — e.g. a user-chosen brand color bound at runtime). Flag it only if it's undocumented.
- Values inside the token *definitions* themselves (the primitive layer is *allowed* to hold raw values — that's its job). Only *components* reaching for raw values are violations.
