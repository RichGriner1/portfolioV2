---
title: "From Static Screens to Code-First Design"
pillar: process
status: published
created: 2026-04-29
tags: [design-systems, primeng, angular, ai-tools, wealth-manager]
---

# From Static Screens to Code-First Design

How AWM design went code-first with AI — and why vibe coding is design.

## What wasn't working

AWM is a B2B wealth-management platform. Propuestas (investment proposals) has been priority number one since January 2026. Engineering builds on Angular + PrimeNG with a .NET backend. Design has always been one designer — graphic designer, then Miguel in UX, now me. Miguel still freelances on features.

Speed has always been the constraint. We started on Material, hit its flexibility ceiling, looked at shadcn — but it's React-only, and AWM is Angular. PrimeNG fit, and came with a Figma library. We've been adding new features in it and porting old screens. The catch: the up-front token-and-variable work got compressed at the switch, and the gap kept resurfacing for months. Six pain points still slow us down:

- Source of truth still consolidating. Designs spread across Figma files from the Material and PrimeNG eras. We're centralizing as we port, but legacy work still lives in older files.
- Static screens only. Hover, focus, transitions, drawers, row highlights — none of it shows in Figma. Engineers either guess or wait for the build.
- Figma dev mode is its own tool with its own learning curve. Access is uneven across the team, and not everyone needed to take it on. Handoff details ended up in conversation more than in one place.
- Design context didn't travel. Decisions happened in meetings and Slack but rarely got recorded next to the screens.
- Token pipeline overhead. Tokens weren't fully defined at the PrimeNG switch, so the Figma → Token Studio export kept needing manual cleanup.
- Slow feedback loops. Meetings → notes → Figma updates days later → re-review. Slower than what AI makes possible on the code side.

## What we tried first

Before going code-first, we made real moves on the Figma side:

- Moved from scattered files to a proper component library — faster, more consistent, easier to share.
- Brought AI into the workflow. Token palettes that took an afternoon now take about ten minutes.
- Renamed Figma variable collections to match PrimeNG's --p- prefix so the Token Studio export wouldn't need cleanup.

Real wins, but the medium stayed flat. Interaction behaviour couldn't be reviewed until engineering built it — and by then, fixing meant rework.

## The switch — code-first prototyping

Today is the test. Feedback came in on a screen this morning. Old workflow: open Figma, update, route through review, wait. New workflow: changes go straight into a code prototype here, case study written alongside. That's the switch.

Code first. Start structure in Claude Code (Figma MCP for component specs), correct in Figma only if needed, render locally with OpenCode or Cursor.

- Real interactions from the start — hovers, transitions, loading states, drawers, all before handoff.
- Design decisions documented as you go. Code and case study written together.
- Meeting feedback applied directly. "Make that drawer narrower" lands in the prototype before the meeting ends.
- Client-ready demos. The prototype runs in a browser.

Not theoretical. Aurelien's importaciones prototype was functional before anyone opened a Figma file. This showcase: empty repo to running app in 90 minutes.

## Vibe coding is design

"Vibe coding" makes it sound informal, but the work is the same. Layout, spacing, what sits above the fold, colour for readability — design decisions whether in Figma or TypeScript. The medium changed. The discipline didn't. Figma stays where it earns its place — brand exploration, iconography, quick options. It just doesn't have to carry the whole process anymore.

AI changes the math on systems work too. Tokens, specs, patterns used to feel like overhead — each step pulled a designer away from shipping. With AI on the repetitive parts, the up-front investment is cheap enough to actually do.

Design-team call, three goals: go fast, use AI, stay innovative. One designer, three projects — speed is the constraint we're designing for.

## What this means going forward

- New projects start as code prototypes. Figma when we need it, not by default.
- Design context lives alongside the prototype as a case study.
- Token pipeline gets simpler — define tokens in the PrimeNG preset, skip the Figma → Token Studio chain.
- Less rework. Static designs that missed interactions cost hours across the team. Compressing that loop frees time for shipping or systems work.

[See how the showcase was built →](/writing/bootstrapping-the-showcase)
