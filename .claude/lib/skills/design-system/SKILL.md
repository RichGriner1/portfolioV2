---
name: design-system
description: Umbrella entry point for design-system work — loads the principles, token rules, and component rules together, and holds the exceptions policy. Use when asked to check or enforce design-system usage, when running /ds-cleanup, or whenever a task is "make sure the DS is being used" and you want the full judgment + enforcement stack in one place. Thin by design — it indexes the other DS skills, it doesn't duplicate them.
---

# Design system (umbrella)

This is the entry point for any "is the design system actually being used?" work. It's deliberately thin — it composes three focused skills and adds the exceptions policy. Load all three:

1. **[design-principles](../design-principles/SKILL.md)** — the *why*. The 11 principles, the anti-patterns to avoid, the 10-question decision filter. The judgment layer.
2. **[design-tokens](../design-tokens/SKILL.md)** — the *what's legal*. Universal token rule + discovery (framework / token source / component library) + framework tell-sheets. The enforcement layer for values.
3. **[components](../components/SKILL.md)** — the *build systems, not screens* layer. Prefer the project's DS components over bespoke.

## How they stack
- **Tokens + components** answer *"is this technically compliant?"* — deterministic-ish, checkable.
- **Principles** answer *"is this the right choice?"* — judgment, applied via the decision filter.
- A change can be token-legal and still fail the principles (e.g. color used for interest, not information). Both gates matter.

## Exceptions policy (the escape hatch)
A design system that can't accommodate exceptions gets bypassed wholesale. So:
- **Data-driven values** that genuinely can't be tokens (a user/brand-chosen color bound at runtime) are allowed — *if documented at the site*.
- **A new value that recurs** is not an exception — it's a missing token. Extend the token system and document it, don't inline it.
- **A one-off component** is allowed under the `components` skill's criteria — document the intent.
- Undocumented exceptions are violations. The rule is: *pause, extend, or ask* — never invent inline silently.

## When to reach for this
- Running `/ds-cleanup` (this skill is what the loop loads first).
- Any code review touching UI where you want the DS lens.
- A design decision where "is this in the tokens?" isn't enough and you need "is this the right call?"
