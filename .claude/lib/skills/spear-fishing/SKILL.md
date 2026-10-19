---
name: spear-fishing
description: The playbook for getting hired by building, not applying. Covers researching a target company, finding a real friction point in its product, choosing and scoping a proof artifact (coded prototype, Rive/3D motion, spatial video walkthrough, design-system audit), the conviction and taste bar that separates it from AI slop, and writing an outreach pitch the recipient can answer with one word. Knowledge only; the /spear-fish loop orchestrates. Use when researching a company to work for, preparing a job application or cold outreach, or deciding what to build to show a hiring manager.
---

# Spear-fishing (get hired by building)

Source: the "Coded Prototypes Are Your New Resume" episode (AI-native designer synthesis, 2026). This skill holds **what a good spear-fishing run is made of**. It contains no workflow; the `/spear-fish` loop does the orchestrating.

## 1. The premise

- **Job boards are the wrong game.** ATS pipelines are flooded with AI-generated applications. A resume competes on volume; an artifact competes on evidence.
- **"Good enough" is the new zero.** AI raised the floor, so median-quality work is a commodity. The artifact has to reach the ceiling, and the ceiling is human conviction, taste and curiosity.
- **Static screenshots are dead.** Show a working thing. The new deliverables: coded prototypes, interactive Rive motion, 3D/Three.js explorations, and spatial video (a Loom where you talk and point).
- **T-shaped, not labelled.** Breadth (brand systems, storytelling, technology, building) plus one deep vertical of craft. The artifact should show both: range in what got built, depth in how well the one hard part is done.

## 2. Research: what to know before building anything

Collect facts, with a source link for every one. **No invented facts**: a claim with no source is a "still thin" flag.

| Area | What to find | Where to look |
|---|---|---|
| Product | What it does, who pays, the core flow, the pricing page | Site, docs, changelog, a free tier (Richard signs up himself) |
| Direction | What they are betting on next | Recent launches, funding news, founder posts/podcasts, job posts (roles hint at roadmap) |
| Design org | Who leads design, team size, what they publish | LinkedIn, X, design blog, Dribbble/Behance, conference talks |
| System maturity | Public design system? Tokens? Consistency across surfaces? | Storybook/docs sites, a component sweep of the live product |
| Pain | Where users actually struggle | App Store / G2 / Reddit / HN / community Discord complaints, support docs that explain workarounds |
| Taste | What they already think is good | Their own best pages, who they hire, what they share |
| The person | One named human who can say "sure" | Head of design, founder, design-eng lead. Not a recruiter inbox. |

## 3. Picking the friction point

Generate 3 candidates, then score each 1 to 3:

1. **Visible to the target.** The person you pitch feels this pain or owns this surface.
2. **Real.** Backed by evidence from §2 (a review, a workaround doc, an inconsistency you can screenshot), not a hunch.
3. **Buildable in a day or two.** A slice, not a redesign of the whole app.
4. **Plays to the vertical bar.** For Richard: design systems, tokens, fintech flows, AI-product UX. Pick the candidate where his depth shows.
5. **Demonstrable in 90 seconds.** If it needs a 5-minute explanation, it's too big.

Highest total wins; ties go to criterion 4.

## 4. Choosing the artifact

| Artifact | When it fits | Richard's default stack |
|---|---|---|
| **Coded prototype** | A flow or interaction is the friction | Next.js + Tailwind + shadcn on Vercel, own repo |
| **Design-system audit** | Their UI drifts: inconsistent tokens, components, states | Audit write-up + a rebuilt component with a token layer (see `design-system`, `design-tokens` skills) |
| **Rive / motion** | The product feels flat, or a state change is confusing | Rive file embedded in a page |
| **3D / Three.js** | Spatial or data-heavy products | Three.js page |
| **Spatial video (Loom)** | Always, as the wrapper | 60–90s: problem, the fix, why it's better. Richard records. |

Every artifact ships with a Loom. The prototype is the proof; the video carries the reasoning.

## 5. The quality bar (conviction over slop)

The artifact ships only if:

- [ ] **The conviction statement exists**: one or two sentences on why this direction beats the obvious answer (the one an agent would produce first). If Richard can't say it, the artifact is replaceable.
- [ ] **It rejected a first draft.** At least one "agent's first suggestion" was thrown out for a specific reason. Mention it in the Loom; hiring managers can tell accepted-first-output from directed work.
- [ ] **Curiosity input.** At least one reference from outside the obvious product-UI bubble (print, industrial design, an archive, a physical system) shaped a decision.
- [ ] **Built with links, not paragraphs.** The build brief points the agent at concrete references (their live page, 2–3 inspiration links, screenshots/video) instead of long text prompts.
- [ ] **Steaming hot pie first.** The link opens on the polished result. Process (the dough: audit notes, rejected drafts) comes after, one click away.
- [ ] **Honest framing.** Clearly labelled as an unofficial concept by Richard Griner. No use of their logo as if official, no fake data presented as theirs, no private or scraped user data, no login walls that mimic theirs. Hosted on Richard's own domain or Vercel account.
- [ ] **It runs.** Works at phone width and desktop, no console errors, loads in under 3s.

## 6. The pitch (the one-word-yes rule)

Write it so the recipient can answer with a single word: **"Sure."**

- **Lead with the thing, not the ask.** Not "can I pick your brain" or "coffee chat". Name what you noticed, what you built, and offer the link.
- **Under 90 words.** No résumé paragraph. One line of who Richard is, at most.
- **Specific.** Name their product surface and the friction. Generic praise ("love what you're building") earns nothing unless the next sentence proves it.
- **One ask, answerable in one word.** "Can I send you the link?" or "Want the 90-second walkthrough?"
- **Voice.** Load `voice-griner` if present (user scope, else project `.claude/skills/voice-griner.md`, else `content/voice.md`). Always: no em dashes, no emoji, sentence case, no AI-tells.

Shape (adapt, don't paste):

> Hi {name}. I've been using {product} for {context}, and {specific friction} kept tripping me up. I'm a design system designer, so I rebuilt that slice as a working prototype: {what changed, one line}. It's a 90-second walkthrough. Can I send you the link?

Channels, best first: a warm intro from a shared community (Slack/Discord where Richard is already helpful), a direct DM/email to the named person, a reply to something they posted. Never the careers inbox alone.

## 7. Discretion

Richard has a full-time job. Outreach is private and one-to-one:

- No public "open to work" signals, no public posts naming the target company as a job target.
- Building-in-public posts about the *method* are fine: post the machine (research, scoring, build loop), not the map (which company, which person). The artifact itself can become a public post only after the outreach resolves, and only if Richard chooses.
- Never draft outreach to anyone at Richard's current employer.

## 8. Even a "no" pays

A spear-fishing run that doesn't land still produces a portfolio-grade artifact. Log it; it becomes evidence in the next interview and a candidate case study (`case-study` skill).
