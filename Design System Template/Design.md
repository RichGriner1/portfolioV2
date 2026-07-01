# Design.md

Rules for building with this design system. Written for an AI (or a new engineer)
to produce **consistent** UI without re-deciding foundations each time. Built out
as the system grows — **Color** is complete; other sections land with their pages.

---

## Color

### The three layers — never skip down a layer
1. **Primitives** — raw ramps (`primary`, `neutral`, `control`, `red`/`green`/`amber`/`blue`, `accessibility`). 50→950 steps. **No meaning. Never use a primitive or a raw hex in a component.**
2. **Semantic** — named roles (`background`, `primary`, `error`, `card`…). **This is the only layer components touch.**
3. **Component-scoped** — added per component when needed; still references semantic roles, never raw steps.

If you're reaching for `red-600` in a component, stop — use `destructive` or `error`.

### Which neutral
- **`neutral`** (slate, cool) — the surfaces you read on *and* the text on them: `background`, `card`, `popover`, `foreground`, `muted-foreground`.
- **`control`** (zinc, cool) — chrome around controls: borders, dividers, focus `ring`, `disabled`.
- **Rule:** a border (`control`) must never land on the same value as the surface (`neutral`) it sits on. That's why they're two ramps.

### Surfaces — the elevation stack (bottom → top)
`canvas` → `background` → `card` → `popover`
- **`canvas`** — the app's base layer (pure white / near-black). The body sits on it. Decoupled from the brand.
- **`background`** — the page surface on the canvas.
- **`card`** — raised content (cards, tiles, panels).
- **`popover`** — anything that floats above the page: dropdowns, menus, tooltips, **and dialogs / drawers / sheets**. (There's no separate dialog token — a modal panel is `popover`.)

### Actions — emphasis tiers (each carries default / hover / active)
- **Filled** — solid fill + contrasting text. Highest emphasis. One filled primary and one filled destructive per view, max.
- **Subtle** (`*-subtle*`) — light tint bg + colored text. Low emphasis.
- **Ghost** — no fill; colored text on the surface, tint on hover. Lowest emphasis.

Which tiers each action has:
- **Primary** — Filled · Subtle · Ghost
- **Neutral (secondary)** — Filled · Ghost (no subtle — the neutral button is already the quiet tier)
- **Destructive** — Filled · Subtle · Ghost

The **secondary** action *is* the neutral button — use it for Cancel and secondary actions. **Never color Cancel.**

**Ghost vs. outline:** same tokens. "Outline" is just ghost with a border drawn — a component decision, not a new token. Pick one convention and stick to it.

### Destructive vs. neutral vs. error (the one people get wrong)
- **`destructive`** = an ACTION that deletes / is irreversible. A button. Filled red for the confirm; subtle/ghost for lower-emphasis danger.
- **`neutral`** (secondary) = a non-dangerous secondary action. **Cancel is never red** — Cancel is neutral.
- **`error`** = a STATE (something went wrong). A message, badge, field outline, toast — **not a button.**
- Different token, different job — even though `error` and `destructive` share the red ramp, they're separate so a brand can tune the state and the action independently.

### Status colors are states, not buttons
- `error` / `success` / `warning` / `info` mark STATES: badges, banners, toasts, inline validation.
- **Tonal**: light tint bg (`400`) + same-hue `950` text. Soft, not shouty. Each has `default` + `subtle`.
- **No hover / active.** A state isn't clicked, so it gets no interaction states — unlike systems that give status colors hover/active because they reuse them for buttons. If you need a colored *action*, use `primary` / `destructive`, not a status color.

### Disabled
- One combo for everything non-interactive: `disabled` + `disabled-foreground`. Apply it to any disabled control — don't invent a per-component gray.

### Accessibility
- Every semantic bg/fg pair is **AA (≥4.5:1)**. If you retint, keep it AA — check the contrast tag on `/color`.
- `accessibility.white` / `accessibility.black` are an **escape hatch** for maximum contrast only (AAA body text, 1px hairlines, modal scrims). Not a general surface.

### Rebranding / white-label
- **`primary`** is the only brand-coupled ramp. Swap it to rebrand — nothing else moves (canvas, neutrals, status all stay).
- Swap **`neutral`** (slate → another gray) to change the whole temperature. Both are one-token changes that flow through every component.
