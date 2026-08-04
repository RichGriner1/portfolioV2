---
title: "Reverse-engineering Shopify Polaris instead of eyeballing it"
source: journal/2026-07-08-afi-design-system-content-pipeline.md
pillar: process
stance: practitioner
status: draft
created: 2026-07-10
posted_at:
typefully_ids:
  linkedin:
  twitter:
---

## Twitter thread (7 tweets)

**Tweet 1 — hook**

The best-looking button we'd seen in months turned out to be Shopify's. Instead of eyeballing it, we had an AI go find the real spec.

---

**Tweet 2 — the move**

We fed the AI a screenshot of the Shopify button and asked it to recreate it using our own system's names. Separately, we had it dig up Shopify's actual published spec: padding, shadow layers, gradient details, the real numbers, not our guesses at them.

---

**Tweet 3 — why it matters**

Rebuilding from the real spec beat rebuilding from memory. Every time we'd tried to recreate a button we liked without the actual numbers, we were matching a feeling instead of a fact.

---

**Tweet 4 — the honest snag**

One setting stayed invisible until I turned on a display option buried in a menu. Pulling the real spec still means reading the tool carefully, not just asking for the answer.

---

**Tweet 5 — the preference (honest, not a miss)**

Once we had both versions side by side, the AI-recreated one built on our own names, and the literal original, I actually preferred ours. The point was never to copy Shopify. It was to match what already worked.

---

**Tweet 6 — what else the comparison surfaced**

Comparing the two also surfaced something we hadn't noticed: our button sizes run bigger across the board than Shopify's, closer to a scale built for marketing pages than the dense product screens we're actually building. Flagged it, haven't fixed it yet.

---

**Tweet 7 — kicker**

If there's a product you admire, don't rebuild it from memory.

Feed the real thing to an AI and ask for the actual spec. The gap between your guess and the real numbers is usually where you learn the most.

## Standalone tweets (6)

Each one stands on its own. Mix into the schedule across the two weeks after the thread drops. Order isn't fixed.

---

**Standalone A — the reframe**

Eyeballing a design you admire gets you a vibe. Pulling the actual spec gets you the reason it works.

---

**Standalone B — the honest preference**

We rebuilt a button two ways: an AI's interpretation using our own names, and a literal copy of the original spec. I ended up preferring our version. Copying wasn't the point, matching what worked was.

---

**Standalone C — what comparing surfaced**

Comparing our button against Shopify's real spec surfaced something we'd missed: ours runs bigger across the board, built more for marketing pages than the dense screens we actually ship.

---

**Standalone D — the mechanism**

Feed an AI a screenshot of something you admire and ask it to find the real spec behind it, not just describe the vibe. Padding, shadows, gradients, the actual numbers, not your memory of them.

---

**Standalone E — the honest snag**

One setting in my design tool stayed invisible until I turned on an option buried in a menu. Even pulling a "real spec" still means reading carefully, not just trusting the first answer.

---

**Standalone F — short kicker cut**

The gap between your guess and the real numbers is usually where you learn the most.

## LinkedIn post (~245 words)

The best-looking button we'd seen in months turned out to be Shopify's. Instead of eyeballing it, we had an AI go find the real spec.

We fed it a screenshot and asked for a recreation using our own system's names. Separately, we had it dig up Shopify's actual published spec: padding, shadow layers, gradient details, the real numbers instead of our guesses at them.

Rebuilding from the real spec beat rebuilding from memory. Every time we'd tried to recreate a button we liked without the actual numbers, we were matching a feeling instead of a fact. One setting stayed invisible on my end until I turned on a display option buried in a menu, a reminder that pulling the real spec still means reading carefully, not just asking and trusting the first answer.

Once we had both versions side by side, our AI-built recreation and the literal original, I actually preferred ours. The point was never to copy Shopify. It was to match what already worked.

Comparing the two also surfaced something we'd missed: our button sizes run bigger across the board than Shopify's, closer to a scale built for marketing pages than the dense product screens we're actually building. Flagged it, haven't fixed it yet.

If there's a product you admire, don't rebuild it from memory. Feed the real thing to an AI and ask for the actual spec. The gap between your guess and the real numbers is usually where you learn the most.

## Notes

- **Optional post, included:** the coordinator flagged this as "your call whether it stands." Kept it: the lesson survives without any of the "Still thin" numbers (opacity percentages, blur values, gradient stops are all omitted, only the categories of value are named, "padding," "shadow layers," "gradient details").
- **Skipped per brief:** the specific shadow-tuning numbers, the "James" stacked-shadow technique, and the garbled visuals-tool name from the same session. Those all belong to the neomorphic-shadow build, not this seed.
- **Case-study tie:** none. No long-form exists on this yet, so no CTA on either platform; the kicker carries the close on both.
- **Lead positive:** hook opens on the admired reference and the move (had an AI find the real spec), not on a critique of guessing. The "preferred ours over the literal original" beat is framed as a genuine outcome, not a correction of a mistake.
