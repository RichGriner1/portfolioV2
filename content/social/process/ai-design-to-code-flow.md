---
title: "The flow we use so AI products don't end up looking AI"
pillar: process
source: drafts/process/ai-design-to-code-flow.md
status: draft
created: 2026-06-22
platforms: [twitter, linkedin]
---

# Social copy: The flow we use so AI products don't end up looking AI

Source: [drafts/process/ai-design-to-code-flow.md](../../drafts/process/ai-design-to-code-flow.md).

---

## Twitter thread (7 tweets)

**Tweet 1 — hook**

Most AI products end up looking AI-shaped. Competent screens that don't quite hold together as a product.

It happens because of one missing decision.

---

**Tweet 2 — failure mode**

Engineer ships a Claude Code screen. Designer polishes in Figma. Frames hand off to engineers. Product ships.

Six months later it's in production and something is off. The screens look right. They don't feel right.

---

**Tweet 3 — insight**

Product quality lives in one decision: does this screen go to designer for polish, or does it ship as-is from engineer?

Not the tools. Not the prompts.

---

**Tweet 4 — the rule**

Our rule: anything client-facing routes to designer by default. Team lead overrides either direction.

Quick experiment? Ship as-is. Client showcase? Designer takes over.

---

**Tweet 5 — Figma + Paper**

For this to work, designers need a tool that emits code. Figma alone isn't enough.

Figma stays for client review. For the final design, we use Paper (paper.design). Visual editing, real HTML/CSS output.

---

**Tweet 6 — DS grounding**

The biggest quality jump we got wasn't from the round-trip. It was from loading our DS into Claude Code at the start.

AI without context makes generic UI. AI with context makes our UI. Night and day.

---

**Tweet 7 — CTA**

Full write-up of the flow we use — six tools, ten steps, the routing rule, what we gave up:

[link]

---

## Standalone tweets (8)

Each one stands on its own. Mix into the schedule across the two weeks after the thread drops. Order isn't fixed — pick whatever lands best with what's happening that day.

---

**Standalone A — DS grounding**

AI without context makes generic UI. AI with context makes our UI.

The single biggest quality jump we got from AI wasn't from any tool. It was from loading our DS into Claude Code at the start.

---

**Standalone B — more thinking, not more screens**

Most teams use AI to ship more screens with less designer involvement.

We use AI to ship more thinking with the same designer involvement. The designer doesn't shrink. They get more time per project because the engineer did the first 80%.

---

**Standalone C — the failure mode**

Why most AI products end up looking AI-shaped:

Engineer ships generic UI. Designer polishes in Figma. Engineers ship from frames. Client signs the deck.

Six months later the product is in production and something is off. The screens look right. They don't feel right.

---

**Standalone D — Figma's gap**

Designers need a tool that emits code. Figma alone hands engineers frames to interpret. They interpret wrong, often.

Paper (paper.design) closes the gap. Visual editing, real HTML/CSS output. Designs that ship as code, not frames.

---

**Standalone E — brand creation parallel**

Brand creation can't run inline with a demo. It's a weeks-long project — moodboard, palette, type, motion language.

Use your defaults as a stand-in. Ship the demo. Let the brand project finish on its own clock.

---

**Standalone F — the load-bearing decision**

The most important decision in an AI workflow is this: does this screen need designer fine-tuning, or does it ship as-is from the engineer?

Not which model. Not which tool. That decision is what makes products feel coherent.

---

**Standalone G — the routing rule**

Our routing rule: anything client-facing goes to designer by default. Team lead can override either direction.

Quick experiment? Ship as-is. Client showcase? Designer takes over.

Clear rule beats ad-hoc decisions every time.

---

**Standalone H — the symptom**

"The screens look right. They don't feel right."

That's the failure mode of AI-shaped products. Animations are wrong, empty states don't breathe, micro-interactions are inconsistent because every screen got its language from a different Claude session.

---

## LinkedIn post (~240 words)

Most AI products end up looking AI-shaped. Competent screens that don't quite hold together as a product. We figured out a flow that stops this. The key piece is a routing decision at the design handoff.

Here's the failure mode we kept watching ourselves fall into. Engineer ships a Claude Code screen. Designer polishes in Figma. Frames hand off to engineers. Product ships. Six months later it's in production and something is off. The screens look right. They don't feel right.

What was missing was the routing decision. Every screen we ship now gets one question at the moment of handoff. Does this need designer fine-tuning, or does it ship as-is from the engineer?

Our rule: anything client-facing routes to designer by default. The team lead can override either direction. Quick experiments ship as-is. Client showcases get the full designer treatment.

Two other things mattered, in order of surprise. Designers need a tool that emits code. Figma alone isn't enough. And AI grounds itself when given a design system. The single biggest quality jump we got wasn't from any tool. It was from loading our DS into Claude Code at the start.

Wrote up the full flow with six tools and ten steps if it's useful. → [link]
