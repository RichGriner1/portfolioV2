---
name: design-principles
description: Richard's design-principles baseline — the judgment layer behind any design-system decision. 11 principles, the anti-patterns to avoid, and the 10-question decision filter. Use when reviewing or building a UI and you need to decide whether a choice is right (not just token-legal), when running /ds-cleanup, or when the question is "should this exist / does this fit the system" rather than "is this value in the token set." Seeded from enterprise-fintech work + competitor / Modern-UI research; each principle is tagged universal or enterprise-lean so it flexes by project context.
---

# Design principles (Richard Griner — baseline template)

Tokens tell you **what values are legal**. These principles tell you **why one choice beats another** — the judgment tokens can't encode. Load this whenever a design decision needs a *reason*, not just a lookup.

**This is a reusable baseline, not client dogma.** It was authored for Afi Next (enterprise fintech) but is backed by competitor research and the Modern-UI blog — so it encodes modern product-UI thinking, and it travels to other projects as a strong default you adjust, not a fixed law.

**Two kinds of principle** (tagged inline below):
- **[universal]** — holds on basically any serious product UI. Apply everywhere.
- **[enterprise-lean]** — a *stance* tuned for dense, professional, productivity/fintech UI. On a consumer app, marketing site, or brand-led product these often invert (whitespace and expressive color become *good*). **Relax these off-context** — don't apply "compact & dense" to a marketing page.

**Source of truth:** the Figma frames in **AFI-FOUNDATIONS-MODERN** (`node-id=2035-2` principles, `node-id=2035-65` benchmarks & what to avoid). This skill is the synced copy — if it drifts from Figma, Figma wins; re-sync the text.

Two companion references sharpen this skill:
- [what-to-avoid.md](references/what-to-avoid.md) — the directly-checkable anti-patterns. **Check every design against these.**
- [decision-filter.md](references/decision-filter.md) — the 10 pre-ship questions. **Use these as the review lens.**
- [benchmarks.md](references/benchmarks.md) — reference products, as vocabulary only (not a checklist).

---

## First: declare the context

Before applying the principles, state the project's context in one line — **enterprise/productivity/fintech UI** (apply all 11) or **consumer / marketing / brand-led** (apply the [universal] ones; relax or invert the [enterprise-lean] ones). When it's ambiguous, say so and default to universal-only. This one line decides whether "density beats whitespace" is advice or a misfire.

## The 11 principles

**01 · Information Density Without Visual Density** — **[enterprise-lean]**
Show a large amount of information while maintaining visual calm. Density comes from *organization*, not compression. Every screen stays highly scannable regardless of how much data it displays.
*Ask:* Can more information be shown without making the interface feel heavier? Can hierarchy replace whitespace instead of removing information?
*Off-context:* a consumer/marketing surface may deliberately show *less* per screen — don't force density there.

**02 · Compact by Default** — **[enterprise-lean]**
Components occupy only the space they genuinely require. Never shrink typography below comfortable readability. Whitespace is intentional, not generous.
*Prefer:* smaller controls · tighter paddings · shorter dialogs · condensed toolbars.
*Off-context:* brand-led / marketing UI often uses generous space as the point — relax this.

**03 · Calm Interfaces** — **[universal]**
The interface never competes with the user's work. Color is used sparingly. Every screen should feel quiet.
*Emphasis comes from:* hierarchy · spacing · typography · motion — not color.

**04 · Functional Minimalism** — **[universal]**
Every visible element must justify its existence. Complex *workflows* are acceptable; complex *visuals* are not.
*Remove:* decorative borders · unnecessary labels · duplicate actions · redundant icons · visual noise.

**05 · Progressive Disclosure** — **[universal]**
Only expose complexity when the user asks for it. Overview first, details second, editing third, advanced config last.
*Examples:* expandable tables · drawers · dialogs · contextual actions · progressive filters.

**06 · Consistency Above Novelty** — **[universal]**
Users learn a pattern once. Every similar interaction behaves identically. Never invent a new interaction when an existing one solves the problem.
*Applies to:* buttons · dialogs · tables · filters · navigation · animations.

**07 · Motion Explains State** — **[universal]**
Animation exists to communicate, never to decorate. Animations stay subtle and fast.
*Motion explains:* hierarchy · navigation · cause and effect · loading · success · focus.
*Off-context:* marketing/brand work may use expressive motion — but it should still be intentional, not noise.

**08 · Color Communicates Meaning** — **[universal, with a brand caveat]**
Color is reserved for information. Don't use color just to add visual interest. Neutral interfaces age better.
*Primary uses:* semantic states · selected objects · charts · primary actions.
*Caveat:* brand-led product/marketing UI legitimately uses expressive color as identity — there, this softens to "color still shouldn't create ambiguity," not "color only carries information."

**09 · Enterprise Does Not Mean Outdated** — **[enterprise-lean, universal core]**
Financial/enterprise software should feel contemporary — closer to the best productivity software than to legacy enterprise UI. Professionalism comes from refinement, not conservatism.
*Universal core:* "contemporary and refined, not dated" holds anywhere; the "enterprise" framing is the context-specific part.

**10 · Build Systems, Not Screens** — **[universal]**
Every screen is assembled from reusable building blocks. Every decision should improve the design system before it improves an individual page. Components always take priority over one-off solutions.

**11 · Context over Pages** — **[enterprise-lean]**
Navigation exists to preserve context. Keep users inside their current workflow when possible. Prefer drawers, progressive disclosure, inline editing, expandable cards, and contextual actions over unnecessary page transitions. Reserve full-page navigation for fundamentally different tasks.
*Off-context:* a marketing site *is* page-based by nature — this principle largely doesn't apply there.

---

## How to apply

- **Reviewing a design/diff:** run each change through [decision-filter.md](references/decision-filter.md) and scan for the anti-patterns in [what-to-avoid.md](references/what-to-avoid.md). Cite the specific principle number when you flag something ("violates 03 Calm Interfaces — color used for interest, not information").
- **Building:** the principles rank choices. When two token-legal options exist, the one that better serves *calm*, *functional minimalism*, *consistency*, and *the system over the screen* wins (plus density in enterprise contexts).
- **Respect the context you declared.** On enterprise/productivity/fintech UI, apply all 11. On consumer / marketing / brand-led UI, apply the **[universal]** ones and relax or invert the **[enterprise-lean]** ones — flagging a marketing page for "too much whitespace" or "not dense enough" is a misfire, not a finding. When context is ambiguous, apply universal-only and say so.
