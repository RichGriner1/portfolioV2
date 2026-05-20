---
title: "Documentation went load-bearing when AI started reading it"
pillar: process
status: draft
created: 2026-04-27
tags: [design-systems, tokens, primeng, design-md, ai-tools, fintech, ai-at-scale]
seed: journal/2026-04-18-primeng-tokens-rant.md
---

# Documentation went load-bearing when AI started reading it

Documentation used to be a chore. You'd write it eventually. Skipping it cost a few Slack questions and the occasional design-engineering mismatch. Annoying, not fatal.

That changed when AI started generating UI faster than anyone could write CSS. The doc isn't optional now. Without one the AI can read, your brand goes generic. The AI averages its way to whatever it's seen most often.

The artifact I've been writing is called a [**design.md**](https://getdesign.md). Plain Markdown, in the repo. It combines values (your token JSON, your CSS variables) with rules (anti-patterns, contribution policy, the instructions you'd give a teammate on day one). Drop it in. Any agent — Claude, Cursor, Copilot — reads it before generating UI. It isn't a component library. It's the rulebook that sits next to one.

## The setup

I've been writing one for **Wealth Manager**, an AFI product. B2B for financial advisors. Info-dense, tables-and-forms-all-day, where data parity matters more than delight. The frontend is Angular. We migrated to **PrimeNG** earlier this year, off Material.

The team had been adding tokens to the new PrimeNG setup by hand. Slowly. For weeks. I'd already done the same job on AFI's other design system using AI: connected the token JSON in a few hours, not weeks. The contrast was the nudge.

Manual token work doesn't scale to AI-paced workflows. Without rules the agents can read, every prompt fills the gaps from training data. PrimeNG itself isn't well documented for AI consumption either — Cursor, Claude, and Copilot all guess at PrimeNG conventions because the official docs aren't shaped for them. Our design.md doubles as the AI-shaped documentation PrimeNG itself doesn't ship.

## Three tiers, and why

A design.md isn't only tokens. It's tokens, rules, components, anti-patterns, contribution policy. The token architecture is the part that does the most structural work, so it's worth being clear about it. Three layers, top to bottom:

- **Primitives** (87 in our doc): raw atoms. `dimension-8` is just the number 8. No opinion about what it's for.
- **Semantic numbers** (39): aliases that carry intent. `spacing/md` references `dimension-8`, but means "the medium spacing value." Designers and developers reach for these.
- **Custom semantics** (22): component-level overrides. `p-datatable/padding/normal`. Every entry is a paper trail of a hack: a slot PrimeNG didn't expose, that I had to invent so theming the DataTable didn't quietly diverge from the rest of the system.

Why bother with three tiers? It depends on whether you own your components or you're filling in a library's preset.

If you own your source — shadcn, your own components, anything where you control the code — your tiers are mostly for human comprehension. Values live in your code. You change them anywhere.

PrimeNG is different. It's flexible. More flexible than Material, which is why we migrated. But the flexibility runs through a preset and token API. You fill in slots PrimeNG exposes. You don't edit the components directly.

The catch: not every slot is exposed. When PrimeNG's Figma doesn't show a token for breadcrumb padding, you invent one. Every invention is an override. The custom-semantic tier is the paper trail of those overrides. Without it, they live as one-off CSS that nobody can audit six months later.

Writing the doc was the audit. I expected this last tier to be where most of the drift lived. I checked all 22. Almost every one routed cleanly back to a semantic number. Less drift than I'd budgeted for. The doc forced me to verify, which is the work that wasn't getting done before.

## Name palettes, not roles

PrimeNG has one `primary` slot. AFI has two blues. `azulafi` is bright. `azulprofundo` is deep navy. Same role, different modes. Mode picks which one runs.

`azulprofundo` runs in light mode because `azulafi` doesn't reliably pass AA on white surfaces. `azulafi` runs in dark mode, where the dark surface gives it the contrast it needs.

The doc doesn't call this role "primary." I call it `azulprofundo`. The reason is the AI reading the file.

"Primary" slides toward "main brand color" in any reasonable read. A coding agent will paste `azulafi` into action slots because it's the more brand-typical of the two. A human teammate might pause. An agent won't. Pinning the word to the palette kills the ambiguity in the one place it matters: the source of truth the AI reads.

This is also where digital product design has to break with the brand book. Brand books name colors for print and surface. They don't think about light/dark routing, accessibility on white, or AI agents pasting tokens into slots. If your brand has one primary that passes AA everywhere, easy. If it doesn't, you make digital-specific rules. Write them down too.

Naming for AI is a different rule set than naming for humans. Most teams haven't caught up.

## What founders should hear

If you're running a small team and shipping with AI, the design.md isn't a luxury. It's a one-day to one-week artifact. It prevents months of brand drift later.

The cost of skipping it isn't a missing wiki page anymore. Every prompt you send into Cursor, Claude, or Copilot fills the gaps from training data. Training data is the average of every product that didn't write its rules down. Without your doc, that's what your UI inherits.

You don't need a polished docs site. You need a `design.md` in the repo. Tokens, rules, anti-patterns. That's it.

## What I'd tell another designer writing a design.md

- **Do the work up front.** A design.md feels like overhead until your AI starts hallucinating button styles every other week. Write it before you need it. The week of work saves months of cleanup.
- **Start with the variable panel, not the canvas.** The canvas shows what you *made*. The variables show what you *decided*.
- **Three tiers, always.** Primitive → Semantic → Component. PrimeNG hands you the component tier. You build the other two.
- **Name palettes, not roles.** "Primary" is ambiguous. Your palette name isn't. AI agents are the readers most likely to guess wrong if the name stays generic.
- **Audit the AI's first pass.** Every claim it makes about your system is a hypothesis. Check it against the variable panel, not your memory.
- **Write the anti-patterns.** A list of don'ts is more actionable than a list of dos.
- **Treat the doc as the audit.** Writing the rules forces you to find the places they don't exist yet.

The doc used to be optional. Now it's the load-bearing wall. Build it before you need it. By the time you need it, you've already shipped the drift.

---

*Working on something similar? [Say hi](mailto:richardgrinerdesigns@gmail.com) — always up for a chat about design systems or AI tooling.*
