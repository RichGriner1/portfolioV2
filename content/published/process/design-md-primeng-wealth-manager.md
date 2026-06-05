---
title: "Writing the rulebook PrimeNG doesn't ship with"
pillar: process
status: published
created: 2026-04-23
tags: [design-systems, tokens, primeng, design-md, ai-tools, fintech]
---

# Writing the rulebook PrimeNG doesn't ship with

I'm the sole designer at AFI, a fintech consultancy. One of our products, **Wealth Manager**, is a B2B platform for wealth advisors — info-dense, tables-and-forms-all-day, used by finance people who care about parity with their data more than delight. The frontend is Angular on top of **PrimeNG**, an off-the-shelf component library.

Teams using an off-the-shelf library usually do one of two things. Either they adopt the library's defaults wholesale and the product looks like every other PrimeNG app, or they theme it heavily and immediately introduce drift — because "theming" tends to mean one designer tweaking colors in Figma while the code preset quietly keeps its defaults. We were doing the second thing, and nobody had written down the rules. So I wrote a [design.md](https://getdesign.md) — a plain Markdown file that encodes the system (tokens, rules, component usage, anti-patterns) in a form that humans *and* AI coding agents can read as instructions. You drop it in the repo, and any coding agent (Claude, Cursor, Copilot) follows it when generating UI. It's not a component library. It's the rulebook *next to* one.

The complication with PrimeNG: its Figma library is minimal. It ships component-level tokens (button colors, input sizes) but **no primitive layer** — no standalone spacing, radius, or font-size scales. Its color system is built around a "surface" ramp (used for both text and backgrounds — that's what gives PrimeNG apps their monochrome look) and a single "primary" for actions. Theming PrimeNG means inventing the primitive and semantic layers yourself. And because that invention happens inside a Figma file, it rarely makes it back to the code side — which is exactly how drift starts.

## How I did it with Claude

I worked through it with Claude (Anthropic's coding agent) over a couple hours — not because I couldn't write it alone, but because thinking out loud with an AI pair surfaced decisions I'd been making implicitly.

Before a single word of the doc got written, we looked at two references: PrimeNG's own theming docs, and [getdesign.md](https://getdesign.md)'s format conventions. The point wasn't to copy either — it was to avoid reinventing a convention that already existed. Then Claude used the Figma MCP to pull the actual variable definitions from our file — not a screenshot guess, the real token names and values. That gave us three tiers:

- **AFI Primitives** (87 variables): numbers, colors, fonts.
- **Semantic numbers** (39 variables): aliases like `spacing/md` that reference primitives.
- **AFI Custom Semantics** (22 variables): PrimeNG component overrides like `p-datatable/padding/normal`.

That structure — from raw to meaningful to component-specific — turned out to be the spine of the whole doc.

**Tier 1 — Primitives.** Raw atoms. A hex. A pixel number. A font-family string. They have no opinion about what they're for. `dimension-8` is just the number 8.

**Tier 2 — Semantic numbers.** Aliases with meaning. `spacing/md` *references* `dimension-8`, but now it carries intent: "this is the medium spacing value." A designer or developer reaching for a value goes here, not to primitives.

**Tier 3 — Custom Semantics.** Component-level. `p-datatable/padding/normal` references `spacing/lg`. This tier exists because PrimeNG's Figma didn't expose these slots — so when I was theming the DataTable, I had to create the variables myself. That's where the drift risk lives: if the code preset doesn't also have a matching `p-datatable/padding/normal` routed to the same value, Figma and code quietly disagree.

Tier 3 is where I expected the worst. Every custom semantic is hand-made in Figma, so every one is a place Figma and the code preset could quietly disagree. When I audited all 22 of ours, almost every one routed cleanly back to a semantic number — less drift than I'd budgeted for. Still worth checking every single one, because this is where drift hides even when it's not obvious.

Writing the doc was the audit. Claude's first pass routed surfaces to `grisafi`, our AFI-branded gray palette — plausible, but wrong for a data-dense product. `grisafi`'s steps are too close together; a 12-row table reads as one gray blur. I pointed it at PrimeNG's **Slate** ramp instead — more contrast, easier to scan. `grisafi` still ships, but for accents (tags, illustrations, charts), not surfaces. Every AI claim about the system got the same treatment: a hypothesis, checked against the variable panel, corrected in the doc as we went.

Primary was the other decision worth explaining. PrimeNG uses a single `primary` slot for action color — buttons, links, focused states — and expects you to pick one color for it. Our brand has two blues, so I routed `primary` to both: `AzulProfundo` (deep navy) in light mode, `azulafi` (bright blue) in dark mode, auto-swapped by the theme. The darker blue goes in light mode for accessibility — bright `azulafi` on a white surface doesn't reliably pass AA on small text, but `AzulProfundo` does. The bright one earns its keep in dark mode, where dark surfaces give it the contrast it needs. Same role, two palettes, mode picks the right one.

That's also why the doc doesn't call the role "primary." I call it `AzulProfundo`. If the doc said "primary" generically, an AI agent reading the file would happily paste `azulafi` into an action slot, because "primary" slides toward "main brand color" in any reasonable reading. A human teammate might pause; a coding agent won't. Pinning the word to the palette — `AzulProfundo` — removes the ambiguity in the one place it matters: the source of truth the AI is reading.

On responsiveness: this wasn't in Figma — the team had told me early on "don't worry about it," and then started worrying about it. For a B2B wealth product, phone support is out of scope; advisors work at laptops and desktops. We committed to three breakpoints (`md 768` tablet, `lg 1024` laptop, `xl 1440` desktop) and five per-surface rules (tables, nav, forms, KPI grids, dialogs). No `sm`, no `2xl` — naming them would imply support we don't provide.

## What I'd tell another designer working with PrimeNG and AI

- **Start with the variable panel, not the canvas.** The canvas shows what you *made*; the variables show what you *decided*. Design built on "here's the screen" reads totally differently from design built on "here's the system."
- **Three tiers, always.** Primitive → Semantic → Component. PrimeNG hands you the third tier; you have to build the first two yourself; the doc exists to prove all three exist and agree.
- **Name palettes, not roles.** "Primary" is ambiguous. Your palette name isn't — and AI agents are the ones most likely to guess wrong if the name stays generic.
- **Audit the AI's first pass.** An AI pair will fill gaps with plausible-sounding defaults. Every claim it makes about your system is a hypothesis — verify against the variable panel, not your memory of what the system does.
- **Write the anti-patterns.** A list of don'ts is often more actionable than a list of dos. "Don't manually swap the primary color by mode" is a more useful rule than "the primary color is routed automatically."
- **Responsiveness: pick the minimum viewport that matters, skip the rest.** A B2B product that names a phone breakpoint is about to have phone-support expectations it didn't sign up for.

---

*Working on something similar? [Say hi](mailto:richardgrinerdesigns@gmail.com) — always up for a chat about design systems or AI tooling.*
