---
title: "Building color in four layers"
source: src/app/methodology/color/page.tsx
pillar: authority
stance: noticer
status: draft
created: 2026-07-01
posted_at:
typefully_ids:
  linkedin:
  twitter:
---

## Series-intro tweet (pin above Thread 1 when launching the series)

<!-- Use this as the opener tweet when posting Thread 1 as Part 1 of the series. Drop it for Threads 2–4, which are standalone angles. -->

**Series intro — Part 1 signal**

Rebranding a product with a proper token system takes an afternoon. Without one, it takes months and a freelancer who doesn't know your codebase.

That gap is color strategy. Part 1 of "Building a design system for you." 👇

---

## Twitter thread — Angle 1: The hustle ceiling (7 tweets)

**Tweet 1 — hook**

You can muscle your way to $20k/mo without a color strategy.

You'll hit a wall there and wonder what happened.

---

**Tweet 2 — the mechanism**

The wall isn't marketing. It's not sales.

It's that your product was built by grinding through decisions that should have been settled once — and now every change costs ten times what it should.

---

**Tweet 3 — the color version**

Here's how it shows up in color specifically:

A team I worked with had three brand tokens: `brand`, `brand-light`, `brand-lighter`.

Someone needed something slightly lighter than light.
No slot for it. They eyeballed a value.

The palette drifted from that day forward.

---

**Tweet 4 — the fix isn't design**

The fix isn't "hire a designer."

It's a four-layer structure: raw value → primitive → semantic token → component.

Each layer points only at the one beneath it.
A component never sees a hex.

---

**Tweet 5 — what that actually buys you**

When a client wants a rebrand, you change the primitives.

Everything built on the semantic layer moves with it — buttons, badges, states, the whole UI — in one edit.

Without the structure, you're hunting 400 hex values across 60 files.

---

**Tweet 6 — the timing argument**

It takes a day or two up front to define the strategy.

Nobody wants to hear that when they're chasing the next client.

But the founders who skipped it are paying a freelancer $8k to untangle it later — and still don't know what their brand actually is.

---

**Tweet 7 — CTA + series signal**

I built out the full four-layer model — primitive ramps, semantic roles, component wiring, color rules — and documented it here:

[link]

Part 1 of "Building a design system for you." Next: design language and tokens.

---

---

## Twitter thread — Angle 2: The rebrand math (8 tweets)

**Tweet 1 — hook**

Rebranding a product with no token system takes weeks.

Rebranding one with a proper token layer takes an afternoon.

Same number of components. Completely different problem.

---

**Tweet 2 — why the gap exists**

Without a token layer, colors live in components.

The button has `#0085CA`. The badge has `#0085CA`. The active state in the nav has `#0085CA`. None of them talk to each other.

Swap the brand? Hunt every instance by hand.

---

**Tweet 3 — what a token layer does**

With semantic tokens, the button reads `primary`. The badge reads `primary`. The nav active state reads `primary`.

They all point at one place in the primitives.

Swap the primitive → everything moves. One edit.

---

**Tweet 4 — the four layers**

Bottom up:

Raw value → no name, no reuse.
Primitive — gives it a name and a slot in a scale (`primary-800`).
Semantic token — gives it a role (`background`, `primary`, `error`).
Component — reads the role. Never touches a hex.

---

**Tweet 5 — the two neutrals detail**

One thing most systems get wrong: one neutral ramp.

This one uses two, on purpose.

`neutral` (slate) → surfaces and text.
`control` (zinc) → borders, dividers, focus ring, disabled.

A disabled button shouldn't land on the same gray as the card behind it.

---

**Tweet 6 — rebrand = one token**

The color rules in the system say it plainly:

Swap `primary` to rebrand.
Swap `neutral` to change temperature.

Nothing else moves.

That's only possible because no component ever hardcoded a hex.

---

**Tweet 7 — the real cost of skipping it**

The founders who didn't build this up front aren't paying in design hours.

They're paying in engineering hours, in a freelancer who doesn't know their product, in a rebrand that takes months instead of days.

The token structure is boring. The absence of it isn't.

---

**Tweet 8 — CTA**

The full four-layer model — ramps, semantic roles, border + ring tokens, component wiring, color rules — is documented here:

[link]

---

---

## Twitter thread — Angle 3: The fear angle (7 tweets)

**Tweet 1 — hook**

You don't need taste to ship a good brand. You need a structure that holds until you're ready to drop one in.

Most founders skip that structure. The ones who did are the ones paying to undo it later.

---

**Tweet 2 — why founders skip it**

Creative judgment is scary. If you're not a designer, people mock you for trying.

So founders grab a template, call it "good enough for now," and focus on the work.

The problem: "good enough for now" becomes load-bearing infrastructure.

---

**Tweet 3 — what the system removes**

A layered token structure removes the judgment call from color entirely.

You don't need taste. You need a structure.

Work in black-and-white ramps. Drop a brand in later by swapping the primitives.

The system holds either way.

---

**Tweet 4 — the four layers**

Raw value → Primitive → Semantic token → Component.

Raw value: a bare hex. No name.
Primitive: a name and a slot. `primary-800`.
Semantic token: a role. `background`, `primary`, `error`.
Component: reads the role. Never sees a hex.

Each layer points only at the one beneath it.

---

**Tweet 5 — the actual workflow**

This is how you build without fear:

Pick any neutral ramp to start.
Wire semantic tokens to it.
Build every component against the tokens.
When you're ready to brand — or rebrand — swap the primitives.

The composition stays. The palette changes.

---

**Tweet 6 — the quiet part**

"Design didn't matter — we grew on hustle."

Some businesses do. For a while.

Then they try to white-label the product, or bring on a second client, or just freshen the look — and they find out how much design debt they're carrying.

---

**Tweet 7 — CTA**

Built out the full methodology: four layers, semantic roles, two neutrals, border + ring tokens, color rules. Everything documented.

[link]

---

---

## Twitter thread — Angle 4: Two neutrals (6 tweets)

**Tweet 1 — hook**

Most design systems use one neutral ramp. Surfaces and borders end up sharing the same gray steps — and the UI slowly reads flat.

This system uses two neutrals, on purpose.

---

**Tweet 2 — why one neutral drifts**

With one neutral, surfaces and borders compete for the same steps.

The card background wants `neutral-50`. The border wants something close but visibly distinct.

They inch toward each other. The UI starts reading flat.

---

**Tweet 3 — the split**

`neutral` (slate) → surfaces and text.
`control` (zinc) → borders, dividers, focus ring, disabled.

Different ramps. Different warmth. A disabled button doesn't land on the same gray as the card behind it.

---

**Tweet 4 — where this shows up**

The border token reads `control-200` in light mode.
The card surface reads `neutral-50`.

They're both pale grays. They're visibly different grays.

That gap is invisible when the system is working. You only notice it when it's gone.

---

**Tweet 5 — the rule it enforces**

One of the color rules in the system: a border never matches its surface.

That rule only holds if borders and surfaces are drawing from different ramps.

One neutral ramp makes the rule hard to keep. Two makes it automatic.

---

**Tweet 6 — CTA**

The full model — four layers, two neutrals, semantic roles, border + ring tokens — is here:

[link]

---

---

## Standalone tweets (7)

<!-- Scheduling note: mix into the calendar across the two weeks after the thread drops. Order isn't fixed — pick what fits each day. -->

---

**Standalone A — the rebrand rule**

Rebrand = swap `primary`.
Change temperature = swap `neutral`.

Nothing else moves.

That's only true if no component ever hardcoded a hex.

---

**Standalone B — the drift story**

A team I worked with had three brand tokens: `brand`, `brand-light`, `brand-lighter`.

One day someone needed something slightly lighter than light.

No slot for it. They eyeballed a value.

The palette drifted from that day forward.

Define the full ramps first.

---

**Standalone C — the hustle wall**

You can grind a product to $20k/mo without a color strategy.

You'll stall there, assume design doesn't matter because you made it that far — and miss that the ceiling you're hitting is systems debt, not market size.

---

**Standalone D — the two neutrals rule**

neutral (slate) = surfaces + the text on them.
control (zinc) = borders, dividers, focus ring, disabled.

One neutral ramp means borders and surfaces share steps and start blending.

Two ramps means a border can never accidentally match its surface.

---

**Standalone E — what a component should know**

A button should know it reads `primary`.

It should not know that `primary` is `#0085CA`, or that `primary-800` is the primitive behind it.

The moment it knows the hex, you've lost the ability to change anything cheaply.

---

**Standalone F — the structure holds**

You can build an entire product in black-and-white ramps.

When you're ready to brand it — or rebrand it — you swap the primitives.

The composition stays. The palette changes. Nothing breaks.

That's what the four-layer structure actually buys you.

---

**Standalone G — the per-component override trap**

Most "this component should be different" requests aren't component exceptions.

They're a missing role, or a mis-mapped one.

Reach for the per-component override last — after you've checked whether the semantic layer just needs a new token.

---

---

## LinkedIn post — POSTED 2026-07-01 (Richard's edit; the version below is what actually went live)

Rebranding a product with a proper token system: one or two afternoons.

A Rebrand without a strategy: months of work, a freelancer who doesn't know the codebase, and a final result that still doesn't look quite right.

The difference is a four-layer model: raw value → primitive → semantic token → component. Each layer points only at the one beneath it. When the brand changes, you swap the primitive. Everything built on the semantic layer moves with it.

For example, a team that names their tokens: brand, brand-light, brand-lighter creates problems for their team in future because when something lighter is needed there is no slot for it. They eyeball a value, therefore the palette drifts. A full ramps up front would have made primary-200 available from day one.

The structure doesn't require design taste to execute. You can work in black-and-white ramps and drop a brand in later by swapping the primitives. The patterns and composition stay. The palette changes.

Most founders skip this step in the 0-to-1 sprint, get traction, then pay to undo it. Two days of strategy up front removes a whole class of expensive decisions later.

Part 1 of "Building a design system for you" — a series on the decisions that keep coming up, solved up front. Full methodology here: [link]

#designsystems

## Notes

- **Case-study tie:** The `brand` / `brand-light` / `brand-lighter` drift story from the source post is the concrete anchor for both platforms.
- **Graphic concept (optional):** A two-column before/after showing "three brand tokens (drift)" vs. "full primitive ramp + semantic layer (rebrand = one edit)" — simple, no Figma polish required.
