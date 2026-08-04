---
title: "An AI-built button surfaces a token architecture bug"
source: journal/2026-07-08-afi-design-system-content-pipeline.md
pillar: breakdown
stance: critic
status: draft
created: 2026-07-10
posted_at:
typefully_ids:
  linkedin:
  twitter:
---

## Twitter thread (7 tweets)

**Tweet 1 — hook**

I found three holes in my own design rules by making an AI build one button. That's the fastest rule-audit I've run yet.

---

**Tweet 2 — context**

Quick context: a design system is a shared rulebook for a product, its colors, spacing, button styles. A "token" is a named slot in that rulebook: change it once and every screen using it updates. I had an AI agent build a real button from ours: one button, twelve variations.

---

**Tweet 3 — the good news first**

The good news first: it mostly worked. Every slot pointed where it should, and swapping one shared value would correctly recolor every version of that button at once. The rulebook held up.

---

**Tweet 4 — gap one**

Gap one: the color for a "disabled" button wasn't pulling from the same gray scale as the rest of the system. That rule was right on purpose: one shared color for every disabled component. It was just pointing at the wrong shared value.

---

**Tweet 5 — gap two**

Gap two: two states were missing entirely. No rule for what the button looks like when you're tabbing to it with a keyboard, and no rule for what it looks like while it's loading. Nobody had ever asked the rulebook that question before.

---

**Tweet 6 — gap three**

Gap three: no rule existed for the shadow a button shows the moment you press it. We had shadows for buttons sitting still. Nothing for the moment you actually click one.

---

**Tweet 7 — kicker**

None of these gaps showed up when the rules just sat on a page. They showed up the moment something got built from them.

Make it build. That's how you find out which rules are actually ready.

## Standalone tweets (6)

Each one stands on its own. Mix into the schedule across the two weeks after the thread drops. Order isn't fixed.

---

**Standalone A — the summary**

Building one button against my design rules found three gaps a read-through never would have: a miscolored disabled state, two missing interaction states, and a shadow rule that only worked for buttons sitting still.

---

**Standalone B — the trade-off**

The fix wasn't throwing out the rule. The disabled-color rule was right, one shared color for every component, that part was intentional. It was just pointing at the wrong shared value.

---

**Standalone C — the missing-states gap**

My rulebook had no answer for what a button looks like while it's loading, or while you're tabbing to it with a keyboard. Nobody had ever asked it that question until an AI tried to build one.

---

**Standalone D — the generalization**

A rulebook that's never been built from only looks finished. Build one real thing against it and you find out fast which rules were actually thought through.

---

**Standalone E — the validation**

Change one shared color and every version of a component should update correctly. That's the actual test of whether a design system works. Ours passed, the disabled-state color was just pointed at the wrong shelf.

---

**Standalone F — the short reframe**

The fastest way to audit a rulebook isn't rereading it. It's making something build from it.

## LinkedIn post (~240 words)

I found three holes in my own design rules by making an AI build one button. That's the fastest rule-audit I've run yet.

Quick context: a design system is a shared rulebook for a product, its colors, spacing, button styles. A "token" is a named slot in that rulebook: change it once and every screen using it updates. I had an AI agent build a real button from ours: one button, twelve variations.

The good news first: it mostly worked. Every slot pointed where it should, and swapping one shared value would correctly recolor every version of the button at once. The rulebook held up.

Then the gaps showed up. The color for a "disabled" button wasn't pulling from the same gray scale as the rest of the system. That rule was right on purpose: one shared color for every disabled component. It was just pointing at the wrong shared value. Two states were missing entirely: no rule for a keyboard-focus look, no rule for loading. And no rule existed yet for the shadow a button shows the moment you press it. We only had shadows for buttons sitting still.

None of these showed up when the rules just sat on a page. They showed up the moment something got built from them.

If you have rules for how your product should look, the fastest way to find out which ones are actually finished is to make something build from them.

## Notes

- **Case-study tie:** none. No long-form exists on this yet, so no CTA on either platform; the kicker carries the close on both.
- **Design-token vocabulary handled per brief:** every term of trade (design system, token) gets a plain-language gloss in the same breath it's introduced (Tweet 2 / LinkedIn paragraph 2). Avoided "primitive," "semantic," "elevation," and "neomorphism" entirely, they're accurate to the journal but add nothing a non-technical reader needs; "shared value" and "gray scale" do the same work in plain words.
- **Grant the trade-off (breakdown stance):** led each gap with what the rule got right before naming what was wrong, per journal, the disabled-color rule's intent was correct, only the wiring was off. Kept that distinction explicit rather than flattening it into "the AI found a bug."
- **Skipped per brief:** the garbled tool name and the unexplained "James" from the second meeting's shadow-tuning session; those belong to the neomorphic-shadow build, not this seed.
- **Lead positive:** hook and kicker open on the opportunity (the audit method, the move of making something build) rather than a put-down of the earlier rulebook; "gaps" is named plainly but each one gets to what it revealed, not just what was missing.
