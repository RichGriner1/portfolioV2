---
title: "The flow we use so AI products don't end up looking AI"
pillar: process
source: drafts/process/ai-design-to-code-flow.md
stance: practitioner
status: draft
created: 2026-06-22
revised: 2026-07-01
platforms: [twitter, linkedin]
posted_at:
typefully_ids:
  linkedin:
  twitter:
---

# Social copy: The flow we use so AI products don't end up looking AI

Source: [drafts/process/ai-design-to-code-flow.md](../../drafts/process/ai-design-to-code-flow.md).

**Revised 2026-07-01 — Matt Gray pass, standalone-only.** Rewritten against `content-os/05-content-production/tweet-frameworks.md` and the swipe file in `02-voice-guide/examples/liked-posts.md`. What changed:

- **No thread.** Matt Gray's feed is all standalone aphorisms and list-posts — no threads. The 7-tweet thread that used to live here has been dismantled; its material is folded into the standalone bench below (deduped against the standalones that already existed).
- **Named skeletons.** Each standalone is mapped to a framework (tagged in italics), filled with a real specific from the flow — never a guru maxim.
- **Compression.** One idea per post, then stop.
- **Letter labels kept stable.** `backlog.md` points at this file by `Standalone A`, `B`, etc. — order preserved so those references still resolve.

Skeleton legend: §1 biggest-mistake · §3 old→new · §4 don't-need-X · §5 don't-need/do-need · §6 N-things+kicker · §7 equation · §8 comparison · §9 stop-X-do-Y · §10 contrarian lever · §11 setup→payoff→kicker · §12 simple-advice · §13 every-role · §14 the-breakdown · §15 stages ladder · §16 99%-skip · §17 one-sentence opener.

---

## Standalone tweets (12)

Each one stands on its own. Mix into the schedule per `backlog.md`'s AI-tooling rotation slot. Order isn't fixed beyond keeping the letters stable for existing calendar references.

---

**Standalone A — DS grounding** *(§10)*

We got Claude Code to stop generating generic UI. What actually did it wasn't a better prompt.

It was loading our design system in at the start of the session. AI without context makes generic UI. AI with context makes our UI consistent and on brand.

---

**Standalone B — more thinking, not more screens** *(§8)*

Most teams use AI to ship more screens with less designer involvement.

We use it to ship more thinking with the same designer involvement — the engineer does the first 80%, the designer gets more time per project, not less.

---

**Standalone C — the failure mode** *(§14)*

Why AI products end up looking AI-shaped:

Engineer ships a Claude Code screen. Designer polishes in Figma. Engineers ship from the frames. Client signs off. Six months later it's in production and something is off.

The screens look right. They don't feel right.

---

**Standalone D — Figma's gap** *(⚠️ RETIRED — superseded by breakdown/2026-07-02-tools-market-batch.md; Figma is closing this gap. Kept to preserve E–L lettering. Do not schedule.)*

Figma can't emit code > Figma can only hand engineers a frame to interpret.

They interpret it wrong, often enough that it shows up in production. That's the gap Paper (paper.design) closes — visual editing, real HTML/CSS out the other side.

---

**Standalone E — brand runs on its own clock** *(§9)*

Stop trying to squeeze brand creation into a demo timeline.

It's a weeks-long project — moodboard, palette, type, motion language. Use your defaults as a stand-in, ship the demo, let brand finish on its own clock.

---

**Standalone F — the load-bearing decision** *(§17)*

Product quality with AI doesn't live in the tools or the prompts. It lives in one decision at handoff: does this screen go to a designer for polish, or ship as-is from the engineer?

Miss that decision and no tool saves you.

---

**Standalone G — the routing rule** *(§12)*

Our routing rule, written down so nobody re-litigates it per screen:

— anything client-facing goes to a designer by default
— team lead can override either direction
— quick experiment: ship as-is
— client showcase: designer takes over

---

**Standalone H — the symptom** *(§17)*

"The screens look right. They don't feel right."

That's the tell of an AI-shaped product. Animations landing wrong, empty states that don't breathe, micro-interactions that shift screen to screen because each one got its language from a different Claude session.

---

**Standalone I — the six and the ten** *(§6)*

What actually makes the AI-to-code flow hold together:

— six tools, not one
— ten steps, in order
— one routing decision at handoff
— a design system loaded before the first prompt

Skip the last one and the other nine don't matter.

---

**Standalone J — old way → new way** *(§3)*

How screens get built here now:

Old way: designer mocks every screen in Figma, engineer interprets the frame.
New way: engineer builds from the DS in Claude Code, designer routes and polishes only what's client-facing.

Designer time goes up per screen, not down.

---

**Standalone K — don't need / do need** *(§5)*

Shipping AI-built UI that doesn't look AI-built is simple.

Don't need: a designer touching every screen, a bigger design team, more prompt engineering.
Do need: a design system Claude Code can read, and one clear rule for what routes to a human.

---

**Standalone L — the stop-gap that isn't** *(§9)*

Stop treating "AI without context" as a prompting problem.

It's a context problem. The single biggest quality jump we got wasn't a better prompt, a different model, or a round-trip tool. It was loading the DS in before the first screen got built.

---

## LinkedIn post (~220 words)

Most AI products end up looking AI-shaped. Competent screens that don't quite hold together as a product.

We kept watching ourselves fall into the same failure mode. Engineer ships a Claude Code screen. Designer polishes in Figma. Frames hand off to engineers. Product ships. Six months later it's in production and something is off. The screens look right. They don't feel right.

What was missing was a routing decision, made once, at the moment of handoff. Does this screen need designer fine-tuning, or does it ship as-is from the engineer?

Our rule: anything client-facing routes to a designer by default. Team lead can override either direction. Quick experiments ship as-is. Client showcases get the full designer treatment. One rule, no re-litigating it per screen.

Two other things mattered, in order of surprise. Designers need a tool that actually emits code — Figma alone hands engineers a frame to interpret, and they interpret it wrong often enough that it shows up in production. We use Paper (paper.design) for the final pass instead.

And the single biggest quality jump we got wasn't from any tool. It was loading our design system into Claude Code before the first screen got built. AI without context makes generic UI. AI with context makes our UI consistent and on brand.

*Wrote up the full flow — six tools, ten steps, the routing rule, what we gave up: [link]*

### Notes

- **Case-study tie:** the routing decision, Figma→Paper handoff, and DS-grounding sections of the source draft (`drafts/process/ai-design-to-code-flow.md`).
- **Graphic concept (optional):** simple flowchart — screen ships from engineer → routing diamond (client-facing? Y/N) → designer polish or direct ship.
- **Skeletons used:** §10, §8, §14, §9, §17, §12, §6, §3, §5.
