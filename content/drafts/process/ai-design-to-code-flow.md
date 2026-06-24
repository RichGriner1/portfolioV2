---
title: "The flow we use so AI products don't end up looking AI"
pillar: process
status: draft
created: 2026-06-22
tags: [design-systems, ai, claude-code, paper, figma, process, coherence]
---

# The flow we use so AI products don't end up looking AI

I'm the only designer on my team at AFI. The engineers outnumber me by a comfortable margin. We ship AI products — demos, prototypes, sometimes production — for fintech clients.

Here's how it falls apart.

An engineer ships a Claude Code screen. It's competent, generic. I polish it in Figma. Now it looks great. Branded, on system. I hand frames to engineers. They ship what's in the frames. Client signs the deck.

Six months later the product is in production and something is off. The screens look right. They don't feel right. The animations are wrong. The empty states don't breathe. The micro-interactions are inconsistent because every screen got its interaction language from a different Claude session. The product is AI-shaped. Competent, polished, lifeless.

We've been building a flow that stops this. It's what we run every week on real client demos. Here's the shape of it, what we use, and what we had to give up.

## The two failure modes

**One. AI makes generic UI when it isn't grounded.** Ask Claude for a dashboard with no context and you get a dashboard. It's a dashboard. It doesn't know the brand, the density, the motion language, the radii, the shadow vocabulary. It picks defaults. Defaults are how products end up looking like every other product.

The fix in concept is simple: ground the AI in your design system before it starts. The execution is harder. Your DS has to exist as something the AI can read.

**Two. Designs in Figma don't carry interaction.** Figma is the right tool for client review. Visual, familiar, iterable. Its output is frames. When designers hand frames to engineers, the engineers have to imagine the motion, the transitions, the loading states. They imagine wrong, often. The final product loses a chunk of its design quality in translation.

The fix here is mechanical. Stop handing engineers static frames. Hand them code. Which means designers have to design in something that emits code.

## The six tools

- **Claude Code** is the engineering surface. The engineer runs the project through it. It loads our DS URL so Claude is grounded before writing anything.
- **Claude Design** (Claude.ai with HTML artifacts) is the design-production surface. The DS lives here, synced from our Coherence repo whenever the DS changes.
- **HTML to Figma** is the bridge. It takes Claude's HTML output and imports it into Figma as an editable file. Clients can review.
- **Figma** is the client review surface. Visual, familiar, iterable.
- **Paper** ([paper.design](https://paper.design)) is what makes the round-trip work. It's Figma-like, but it builds on HTML/CSS. When I tweak a final design, the code updates as a side effect.
- **Coherence** is our demo codebase. Everything lands here eventually.

Each tool exists because each audience needs a different surface. Engineers want a CLI. Clients want a visual editor. Programmers want code. Designers want a tool that doesn't end at frames.

## The flow, end to end

1. The engineer starts a project. They load the brand URL into Claude Code so the DS comes with them.
2. If the DS changed recently, I sync the latest from Coherence to Claude Design before they start. Manual for now, soon to be automated.
3. The engineer runs the project. Claude Code produces a first version of the screen.
4. **The moment of truth.** The team lead, a rotating role on our team (often Borja), looks at the screen and makes the routing call. Send to designer for fine-tuning, or ship to client as-is?
5. **If as-is:** team lead reviews the engineer's output, catches anything obviously off, ships to the client. Used for quick experiments and internal tools. Most things don't go this way.
6. **If fine-tune:** the engineer packages the Claude output as a prompt and shares it with me. I take over.
7. I decide if this is an AFI version (our default) or a different client brand. If it's a different brand and we don't have that brand's DS, brand creation runs as its own parallel project. We use AFI defaults as a stand-in so the demo doesn't block.
8. I design with components. The round-trip starts.
9. I tweak the final design in Paper. Code updates as a side effect. Lands in Coherence.
10. Client gets the design. Not as static frames. As a working interaction.

I wrote this down because we kept losing the flow when people switched between projects. Now everyone can see the whole shape on one screen.

## The routing decision matters most

The single decision that determines product quality is step 4. Not the tools, not the code, not the prompts. The decision of whether something needs designer involvement at all.

Our rule: anything client-facing routes to designer by default. The team lead can override either direction. A quick demo for a friendly client can ship as-is if the team lead approves. An internal showcase can get full designer treatment if the team lead thinks it matters.

This is more conservative than what most teams do. Most teams treat AI as a way to ship more screens with less designer involvement. We treat AI as a way to ship more *thinking* with the same designer involvement. I don't get smaller. I get more time per project because the engineer did the first 80%.

## Paper closes the design-to-code gap

The reason this works at all is Paper.

If you've used Figma, you know the gap. Figma makes designs but emits visual frames. The translation step from frames to code is where products lose their feel. I say "the empty state should fade in." The engineer reads the frames, doesn't see fade-in, ships static.

Paper closes that gap. I work in Paper. The code updates in the background. When the design is right, the code is also right. They're the same artifact. Then it flows into Coherence directly. Engineers see real interactions in the codebase. Nothing gets lost.

Claude Code is the fallback for changes that are structural rather than visual. Moving a component, restructuring a layout, changing data flow. Paper handles visual; Claude Code handles structural. Both end up in Coherence.

## What we gave up

We accept that "ship as-is" sometimes makes things that aren't perfect. That's the price of speed. The team lead is the safety net.

We accept that Paper has a learning curve. Designers who only know Figma need a week. After that, the round-trip pays for itself on the first project.

We accept that the DS sync from Coherence to Claude Design is manual right now. It will be automated, eventually. For now, I do it.

We accept that brand creation can't run inline. If a new client needs a custom brand, that's a parallel project. Sometimes weeks of work. We don't block the demo; we use AFI defaults as a stand-in.

## What surprised us

**The decision matters more than the tools.** I expected the tool stack to be the differentiator. It isn't. It's the routing decision at step 4. Teams without the routing rule make the same decisions ad hoc, and the decisions don't pile up into a coherent product.

**Figma alone isn't enough.** It's still in the flow. It's where clients review. For the final design, designers need a tool that emits code. Paper is one option. There will be others.

**AI grounds itself when given a DS.** The single biggest quality improvement we got wasn't the round-trip or the routing. It was loading the DS into Claude Code from the start. AI without context makes generic UI. AI with context makes our UI. The difference is night and day.

## Where this is going

The DS sync from Coherence to Claude Design will get automated. There's no good reason for it to stay manual.

We'll formalize the brand creation flow as its own SOP. Right now it's "a parallel project" — useful as a placeholder, not actually defined. Once it's defined, the demo flow will reference it cleanly.

Past that, this flow is what we use. If your screens are coming out AI-shaped, the routing decision is the first place I'd look.

---

*Working on something similar? [Say hi](mailto:richardgrinerdesigns@gmail.com) — always up for a chat about AI design tooling or design systems.*
