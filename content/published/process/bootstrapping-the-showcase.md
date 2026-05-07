---
title: "Bootstrapping the AWM Design Showcase"
pillar: process
status: published
created: 2026-04-29
tags: [design-systems, primeng, angular, ai-tools, wealth-manager]
---

# Bootstrapping the AWM Design Showcase

Setting up an internal design showcase on PrimeNG + Angular 21 — repo layout, agent rulebook, theme preset, page shell, all from a clean machine.

## Why this exists

The AWM Design Showcase exists to speed up the path from design to code — and to cover the parts that static Figma frames can't. Our team works in static screens; we don't prototype in Figma. That leaves a real gap: hover, focus, transitions, loading states, how a row reacts when it gets highlighted, how a panel slides in — the small interactions that define how the product actually feels — never get pinned down before engineering picks the design up.

The showcase fills that gap. Every project lives here as an interactive PrimeNG prototype with a case study, so the team can see and feel the real component behaviour, not a flat approximation. It also doubles as a feasibility test: if a screen can ship in PrimeNG with our brand on top, the prototype proves it. If something doesn't fit, we catch it here instead of in engineering hand-off. And anything that holds up can be taken back into Figma as a static reference, or pinned to a specific component spec when that's the clearer artefact.

## Contents

Inside the repo: two main folders, plus a few things at the root. The list grows as the repo grows.

- design/ — design.md (the rulebook), Figma token snapshots, content/ for writing rules.
- engineering/ — what the eng team gave us (Angular, .NET, code style, tests).
- showcase/ — the Angular 21 app you're looking at right now.
- AGENTS.md — the rulebook agents read first.
- CLAUDE.md — points at AGENTS.md so Claude Code and OpenCode follow the same rules.
- opencode.json — OpenCode's config (MCP servers, providers).
- .mcp.json — same idea for Claude Code.
- .claude/skills/ — skills that fire when relevant (e.g. spanish-writing kicks in on Spanish copy).

## Decisions and pivots

A few choices to know about. A couple of these changed during the build.

- Two flat folders, not nested docs. The first plan put engineering docs under docs/engineering-standards/. Mid-review we flattened it: design/ for design-team material, engineering/ for programmer-team material — easier to find things, no buried directory chain.
- PrimeNG preset, not generated CSS. Going in, the assumption was we'd need a CSS-generation step (Style Dictionary, SCSS pipeline). PrimeNG v20+ already takes a TypeScript preset object and produces CSS variables at runtime — for our scope (mostly default Slate surface + AzulProfundo/AzulAfi primary swap + ~22 Tier 3 component overrides) it's the right tool. Total preset is roughly a hundred lines of TS.
- Plain Angular, not NX. The engineering team uses NX for the AWM monorepo (libs/modern/**). This is a separate showcase repo with one app — NX would be overhead without payoff. We can fold into NX later if the showcase ever moves into the monorepo.
- Angular 21, not 20. The CLI installed the latest stable. Engineering's "Angular 20+" rule is satisfied, and 21 makes zoneless the default — one less provider to wire up.

## The MCP gotcha — read this if you're onboarding

Both Claude Code and OpenCode auto-load their MCP config from the directory they're launched in. opencode.json and .mcp.json both live at the repo root (AWM/), so to use the PrimeNG MCP (or any of the others wired up), you have to start your agent from inside the AWM folder — not from a parent directory.

```bash
cd /path/to/AWM
claude    # or: opencode
```

Launching from the parent directory still works — you just won't have PrimeNG MCP, context7, or the Angular CLI MCP available, which means the agent has to fall back on training knowledge and WebFetch. Workable, but slower and slightly less reliable on exact API names.

## Step-by-step recap

- Cloned the AWM repo from GitHub locally — empty repo, default branch main.
- Moved design.md + screenshots into design/, engineering team docs into engineering/, hoisted opencode.json to the repo root.
- Wrote AGENTS.md — the canonical agent rulebook with Current focus, Mission, Where things live, MCPs, anti-patterns, open questions.
- Wrote CLAUDE.md as a one-line redirect to AGENTS.md so Claude Code and OpenCode follow the same rules.
- Wrote .mcp.json mirroring opencode.json's primeng / context7 / angular-cli entries, for Claude Code parity.
- Scaffolded showcase/ with ng new (Angular 21, routing, SCSS, no SSR, skip-git).
- Installed primeng + @primeuix/themes + lucide-angular (note: @primeng/themes was deprecated and renamed to @primeuix/themes mid-flight — npm warned us).
- Wrote theme/afi.preset.ts — translates design/design.md tokens (AzulProfundo/AzulAfi/grisafi/blancoafi/positives/negatives + Tier 3 component overrides) into a PrimeNG preset.
- Wired app.config.ts with providePrimeNG (preset + dark mode selector), provideAnimationsAsync, withComponentInputBinding.
- Built the page shell (p-menubar with asymmetric padding from design.md, brand on left, theme toggle on right, router-outlet for content).
- Built the Novidades home (hero + case-study card grid) and the case study template (hero + breadcrumb + sections renderer).
- Added design/content/writing-rules.md (RAE-aligned Spanish writing rules) plus the spanish-writing skill so any agent generating Spanish copy stays on rails.
- Filed this case study as the first entry on the home page. Recursive.

## What's next

- Pull today's AFI feedback meeting transcript via the Granola MCP and revise design/design.md (header section).
- Build the Propuestas prototype — the next entry on Novidades.
- Expand the theme preset to cover all 22 Tier 3 component overrides (currently only menubar/card/tag/breadcrumb).
- Set up a deploy target so the design team can play with it without running it locally.
- Round-trip refined prototypes back into Figma via Claude Code — the long-term flow.

## Changelog

Repo updates land in the changelog with a date and a one-line note. Decisions like this one (writing this case study, dropping the SSH narrative, starting the not-this rulebook) all show up there.

Open the changelog inside the AWM showcase.
