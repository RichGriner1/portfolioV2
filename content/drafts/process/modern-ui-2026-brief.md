---
title: "Modern UI in 2026 — partial research brief"
status: brief-partial
pillar: process
created: 2026-06-24
related:
  - .claude/plans/sorry-to-interupt-but-crystalline-starfish.md
  - src/lib/content/work.ts#afi-design-system
source_pdf: /Users/richardgriner/Desktop/Code/Coherence/Research modern UI notes.pdf
source_workflow: deep-research wf_6099a6e7-561 (interrupted before synthesis)
sources_fetched: 23
claims_extracted: 109
verifier_verdicts: "63 not-refuted, 12 refuted, of 75 collected before kill"
---

# Modern UI in 2026 — partial brief

**Provenance.** Synthesized from a `deep-research` workflow that was stopped before the synthesis stage ran. The agents extracted 109 candidate claims from 23 fetched URLs (more than the 12 in the source PDF — the harness pulled adjacent triangulation: PAIR guidebook, NN/G, design-system maturity literature, fintech-specific blogs). 75 adversarial-verification verdicts came back before the kill: ~84% not-refuted. Per-claim mapping wasn't preserved, so individual claims read as **candidate findings** here, not stamped facts. Verify load-bearing ones before publishing.

**Use case.** Anchor for the portfolio blog framed as *"I got a fuzzy challenge from my boss, here's how I research before I sketch."* Also feeds Phase 0 of the visual-identity plan (mood-board direction studies).

---

## 1. Personalization & context-aware experiences

What the field is converging on:

- AI-driven personalization in 2026 fintech dashboards should let users save preferred layouts and auto-filter datasets based on behavioral patterns — but **requires opt-in controls and transparency about how recommendations are generated** rather than silent inference.
- Customizable B2B dashboards (toggle modules on/off by experience level) are the dominant personalization pattern. For analytics-heavy/power-user products, a dashboard *builder* outperforms a perfect default layout. Opinionated curation is reserved for task-management tools.
- Context-aware design means adapting to a user's situation (commuting, multitasking, switching devices) **without forcing them to think about their interaction mode**.
- The defining 2026 dashboard shift: AI-native surfaces summarize and prioritize automatically instead of asking users to build charts.

**B2B fintech actionable:** for a wealth-advisor surface, expose a layout-builder, not a "smart default." Make personalization opt-in. When the AI surfaces something, show why.

> **Q4 answered:** Personalize layouts by letting the advisor compose them. The system observes which modules they save and offers stronger defaults — never silent reordering of a layout they were using yesterday.

> **Q5 answered:** Context-aware in B2B fintech ≠ consumer fintech. It's session-state (where they are in a meeting flow), client context (which advisor file is open), and device (laptop vs. demo screen). Not mood or commute.

---

## 2. Intent-driven structure (vs tree navigation)

- Intent-driven design recognizes what a user is trying to *accomplish* across four categories — informational, navigational, commercial, transactional — and moves UX from layout to logic.
- Intent-driven dashboard IA helps users **spot what matters, understand what changed, and know what to do next** — not just present data.
- Onboarding/IA best practice favors aggressive progressive disclosure (one piece of info per screen) — useful as a counterpoint for dense advisor outputs: knowing when to chunk vs. when to show density.

> **Q8 answered:** IA in 2026 is intent-keyed at the entry point, then density-rich inside the chosen task. The tree isn't gone — it's secondary to the "what are you trying to do today?" surface.

---

## 3. Glassmorphism / liquid glass / modern depth

The most-researched topic in the run. Strong convergence on what works, where it breaks.

**Why it's back:**
- Modern GPUs now render `backdrop-filter` smoothly on mid-range mobile, which separates 2026 glass from earlier glass trends that suffered performance penalties.
- Apple's Liquid Glass framing treats it as a *functional* layer that prepares interfaces for spatial computing and AR.

**Concrete recipe (cite-worthy):**
- Baseline: background `rgba(255,255,255,0.15)` + `backdrop-filter: blur(10px)` + 1px `rgba(255,255,255,0.3)` border.
- Avoid blur ≥20px (compounds accessibility issues, drains battery).
- Layer semi-opaque color (black at 20–30% opacity) beneath text. Reducing panel opacity to 85–90% materially improves readability.

**Accessibility constraints (load-bearing for fintech):**
- Glass surfaces frequently fail WCAG 2.2 contrast (4.5:1 body / 3:1 large) when backgrounds shift on scroll.
- Need solid-color fallbacks for `prefers-reduced-transparency`. Respect `prefers-reduced-motion`. Surface a user-controlled transparency setting.
- Dynamic backgrounds (video, animated gradients) behind glass **particularly harm users with cognitive impairments**.

**Where it belongs:**
- Secondary surfaces only: nav bars, modals, callout cards. Body paragraphs sit on solid backgrounds.
- Counter-trend (verified): **Linear rebuilt their glass system to remove refractive distortion** for legibility in high-density UI workflows.

> **Q2 answered:** Glass feels modern (vs nostalgic neumorphism) because it's a *system primitive* now — Apple SwiftUI and Microsoft Fluent encode patterns that avoid the early-2020s contrast traps. Neumorphism is better suited to wellness / medical / smart-home. For B2B fintech, glass goes on chrome (sidebar, modals), not on data surfaces.

---

## 4. Multimodal experiences

Strong skepticism in the research about multimodal as the headline trend in B2B fintech.

- Voice/NLP for hands-free queries ("show me last month's expenses above $500") is a 2026 trend — **with the constraint that voice should always include an explicit fallback to standard navigation**. Multimodal in fintech needs redundancy, not replacement.
- The bigger multimodal move isn't voice or gesture — it's user-controlled motion as a visible front-of-house feature (microsoft.ai's Reduce Motion toggle), with the implied stance: interfaces that *require* animation are broken interfaces.

> **Q10 answered:** Multimodal in B2B fintech ≠ voice + gesture + screen. It's cross-device continuity (laptop → demo screen → handoff PDF), screen-reader honor, and motion preferences as visible controls. Voice is a power-user feature behind an "as-if" fallback, not the headline.

---

## 5. Emotional design (Don Norman extended)

- Emotional design in 2026 extends Don Norman's three layers (visceral / behavioral / reflective) into **mode-based UI** — "morning mode," "focus mode," "evening mode" — that adapt to a user's internal context (mood, energy, time of day).
- For B2B fintech: emotional design isn't decorative. Stressful financial tasks need to feel *manageable*, not just data-presentation exercises.
- Emerging frame: fintech is shifting toward **empowerment, not guilt/anxiety** as the dominant tone.

> **Q7 answered:** Emotional connection in a data-heavy product comes from *calibrating tension*. Reframe losses with contextual benchmarking (your portfolio vs. an index). Use restraint on display weight for negative deltas. Animation confirms processing, not entertainment.

---

## 6. Animation as functional

- Motion design in 2026 has shifted from decorative to **structural** — animation's role is to clarify processing states and reduce uncertainty.
- Gamification + extravagant motion are being displaced by calmer micro-interactions and strategic motion, addressing cognitive overload.
- Counterintuitive: **purposeful motion in 2026 sometimes adds artificial delays** to form submissions because instantaneous confirmation feels suspicious. Perceived reliability is being designed-for above actual speed.
- For fintech: animation should function as feedback for data processing (loading, progress) — never decorative.

> **Q6 answered:** Concrete fintech micro-interaction rules — animate state transitions (data updating, calculation running), don't animate identity (logos, headers). Use motion to make wait time legible, not to make the product feel "alive."

---

## 7. Inclusive / accessible design

- Accessibility in 2026 is **foundational infrastructure**, not a feature. Users expect it as a baseline.
- Accessibility tokens (contrast, motion preference, focus, font scaling) are now considered **foundational token categories** on par with color and spacing — not bolt-on.
- Best practice for dark mode: pick one accent color, neutral greys elsewhere, prioritize status/functional color (red errors) over aesthetic choices.
- Financial charts need to supplement red/green with **arrow icons** and meet WCAG AAA, not AA.

> **Q9 answered:** Dark/light in 2026 is implemented at the token layer via variable modes. The same semantic token (`text-primary`) points to different primitives per mode. Theme swaps happen instantly across every frame without component-level overrides. Use neutral foundations with high-contrast data and accent colors used with precision — *not* full saturation.

---

## 8. Semantic component design & design maturity

Heavily researched. The most actionable theme for the visual-identity plan.

**The maturity model** (designsystems.one):
- Five stages: Ad hoc → Managed → Defined → Optimized → Adaptive
- Tokens become the source of truth at the **Defined** stage (64% capability) and beyond
- At Adaptive maturity, the system shapes the product, not the other way around
- The highest stage is characterized by AI agents being able to read the design system **as structured data via MCP servers** — framing AI integration as a design-system capability, not a feature

**Token architecture:**
- Three-layer hierarchy: primitive → semantic → component
- Components only reference semantic tokens, never raw primitives (matches Richard's existing design.md)
- Semantic tokens encode role, not value (`color-action-primary`, not `blue-500`)
- 2026 token systems extend to composite/array types (grouped values like shadows) and **expression-based conditional logic** (`if(is-dark, #FFF, #111)`) — theming logic lives in the token layer
- Component variants strictly limited to **3–5 per component** covering hierarchy and common states

**TokenOps as a discipline:**
- Mature orgs in 2025–2026 formalize this — assigned ownership, semantic versioning, quarterly audits, dependency mapping
- Accessibility validation belongs at the token-creation layer so semantic tokens **ship pre-WCAG-compliant** by construction

**The AI angle:**
- AI agents now consume design as "Machine Experience" (MX) and require semantic design systems with **embedded intent and documentation** — not just visual components
- AI-generated design systems risk *"consistency without conviction"* — speeding production while skipping contextual decisions

> **Direct match to Richard's plan:** the Coherence work already sits at Defined → Optimized maturity per design.md and the three-tier token system. The visual-identity refresh has runway to push toward Adaptive (theming via expression-based tokens, MCP-readable system).

---

## 9. AI as teammate, not just tool

Strongest open-source reference: **Google PAIR Guidebook v2** (updated for generative AI). Multiple verified claims pull directly from PAIR.

**Where AI should and shouldn't be:**
- Automation = tedious/dangerous tasks; augmentation = activities people *want* to do themselves. Maps directly to the advisor-product question of where AI disappears vs. where it stays a visible collaborator.
- AI struggles with predictability-required, high-stakes-error, complete-transparency-required situations. Shapes which advisor workflows are AI-augmented vs. deterministic.
- Users resist automation in three specific scenarios: personal responsibility, high-stakes decisions, enjoyed tasks. B2B advisor tools live in scenarios 1 and 2 — they need manual fallbacks and editability.

**Visible reasoning (open question 11 answered):**
- AI reasoning should be **partial, not comprehensive** — PAIR recommends four explanation modes (general system, specific output, example-based, explanation via interaction).
- Explanations are most effective when **triggered by a user action**, not shown proactively. Non-chat AI surfaces can make reasoning visible through interaction-bound disclosures, not always-on rationale.
- Explanations can be grounded in **underlying data sources** (highlighted phrases, similar cases) rather than in model internals — making reasoning visible without a chat interface.
- Numeric confidence indicators are risky (assume users understand probability). Categorical labels (High/Medium/Low), n-best alternatives, or data visualizations are safer.
- PAIR explicitly flags "how to explain how generative AI works in-product" as an **unsolved design problem**, not a settled pattern. Fintech designers asking the same question aren't late — they're at the frontier.

**Trust framing:**
- Trust in AI products is built across three dimensions (ability, reliability, benevolence) and develops slowly across the full interaction lifecycle — not at a single onboarding moment.
- Trust must be **calibrated** — users need to know when to trust the output and when to apply judgment, with more explanation required when stakes are higher.
- Trust in fintech specifically is delivered through visual craft — consistent spacing, purposeful color palettes, earned iconography, zero visual noise — **not** through legal disclaimers.

**One refuted-ish claim worth flagging:** the framing that PAIR positions AI as a "teammate" or "collaborator." Even in PAIR's updated guidance, "human-in-the-loop" is framed narrowly as **decision points** (e.g., whether to rewrite generated text), not as AI-as-teammate. The collaborator framing comes from elsewhere — don't put it in PAIR's mouth.

> **Q1 answered:** Examples of guided interactions in 2026 — Google Gemini's recipe assistant suggests alternatives in a sidebar without modifying user content (sidebar/margin assistant pattern). For advisor products: the AI lives in the margin of the diagnostic, suggesting next moves, never overwriting the advisor's narrative.

> **Q3 answered:** "Frictionless journeys" via interaction-pattern learning works through **explicit feedback loops** — when a user gives feedback (rating, accept/reject, edit), the system confirms receipt and tells the user how it will respond. Implicit signals (clicks, engagement) are ambiguous and should not be treated as approval.

> **Q11 answered:** Yes, "make the system's reasoning visible" applies to non-chat fintech — but **not as always-on rationale**. As progressive, action-triggered, data-source-grounded disclosures. And not always: there are cases where explaining AI behavior adds no value or implies false precision. It's a judgment call about whether the explanation changes a user decision.

---

## What I'd do next (for the visual-identity work)

1. **Lead with the token-layer story.** Section 8 above is the single strongest narrative thread for a portfolio piece — your existing three-tier design.md sits at Defined / Optimized maturity, and the visual-identity refresh is the move toward Adaptive. The 2026 industry framing makes that move legible to non-designers. Mood-board "Direction A" should be *"Adaptive Tokens"* — the visual identity emerges from the token architecture, not the other way around.

2. **Glass on chrome, not data.** Use glassmorphism in the demo for nav, modals, and callout cards. Body data sits on solid surfaces. This matches Linear's correction and avoids the WCAG trap. Direction B could be *"Quiet Glass"* — glass as a depth signal, restrained.

3. **Make reasoning visible through data sources, not chat.** When the AI demo surfaces a recommendation, ground it in the actual data point that triggered it (highlighted row, similar past case) rather than a chat-style explanation. This is PAIR-aligned, fintech-appropriate, and a differentiator vs. consumer AI products.

4. **Calibrate, don't quantify, confidence.** If the demo shows AI confidence anywhere, use High/Medium/Low or n-best alternatives, not percentages. A fintech advisor surface with "73% confidence" reads as false precision.

5. **Visible motion controls in the demo itself.** Add a Reduce Motion toggle to the demo's chrome — small visible move that signals 2026-current accessibility posture and gives the team lead a defense line when a client asks "is this accessible?"

---

## Caveats

- 12 of the 75 collected verifier verdicts came back **refuted**. Without per-claim mapping I couldn't filter those out. Treat any claim you plan to publish as candidate-finding and run a sanity check (Google PAIR direct quote, NN/G direct quote, etc.) before citing.
- Verification stopped at ~25 of 109 claims. The remaining 80+ are extracted but unverified.
- The synthesis stage (which would have ranked findings by confidence and merged dupes) never ran. So some claims overlap and some are noisier than others.
- Sources include both the 12 the researcher curated and ~11 the agent surfaced via web search. New triangulation sources include: NN/G, designsystems.one, atomize.tools, eleken.co, timgraf.com, axesslab.com, designsystemproblems.com, designsystemscollective.com, lollypop.design, theskinsfactory.com, wildnetedge.com, plus Google PAIR's v2 guidebook and Codelabs.

## Sources fetched

The 12 the researcher curated, plus what the workflow surfaced:

- Google PAIR Guidebook v2 (multiple chapters) — pair.withgoogle.com
- People + AI Guidebook update (Medium, People + AI Research)
- Building Trusted AI Products with the PAIR Guidebook (Google Codelabs)
- Glassmorphism: Definition and Best Practices — Nielsen Norman Group
- Glassmorphism Meets Accessibility — Axess Lab
- Glassmorphism vs. Neumorphism: High-End UI Guide (2026) — Timothy Graf
- Neumorphism vs Glassmorphism — Zignuts
- Glassmorphism Web Design — Neel Networks
- Glassmorphism with Website Accessibility in Mind — New Target
- Glassmorphism (Liquid Glass framing) — Digital Thrive AI
- 2026 Web Design Trends — Digital Upward
- Design System Maturity Model — designsystems.one
- Design System Mastery with Figma Variables — Design Systems Collective
- Figma Design System Best Practices (2026) — Atomize.tools
- Schema 2025: Design Systems For A New Era — Figma Blog
- Design Tokens — Figma Resource Library
- Semantic vs Primitive Tokens Explained — Design System Problems
- Investment Dashboard UX Design Guide — Lollypop
- 35 SaaS Dashboard Design Examples (2026) — 925studios
- Best Dashboard Design Agencies for SaaS and Fintech — Cieden
- Fintech UX Best Practices 2026 — Eleken
- Fintech UI/UX Design Best Practices — The Skins Factory
- Fintech UX Design: 10 Best Practices for Dashboards — Wildnet Edge
- 21 Web Design Trends 2026 — UIUX Showcase
- The most popular experience design trends of 2026 — UX Collective
- UX/UI design trends for 2026 — Envato
- What's Next: 7 UI Design Trends of 2026 — Tubik

Plus the originals from the researcher's list: tubikstudio, blushush, uxdesign.cc, envato, spunk.pics, velvetum, stan.vision, vezadigital, merveilleux.design, findasaas, and the two LinkedIn pieces.
