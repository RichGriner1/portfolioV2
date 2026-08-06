---
title: "Modern UI in 2026: the research pass before I touched Figma"
pillar: process
status: published
created: 2026-06-24
published_at: 2026-06-24
related:
  - content/drafts/process/modern-ui-2026-brief.md
  - .claude/plans/sorry-to-interupt-but-crystalline-starfish.md
source_pdf: /Users/richardgriner/Desktop/Code/Coherence/Research modern UI notes.pdf
source_meeting: granola://52efaf4c-9068-49e4-9bbf-de449c1dc6f7
tags: [ui-design, fintech, ai-tools, design-research, visual-identity, 2026-trends]
---

# Modern UI in 2026

My boss handed me a vague task. *"Build a visual identity for our demos. Something more modern."* No persona, no buyer profile, no constraints.

Instead of jumping straight into design, I wanted to answer a different question first: what does modern UI actually mean in 2026?

Because designs without a definition end up preference-based instead of evidence-based. Everyone likes something different, and when the team finally agrees, a team lead vetoes it. Not because of an insight — because they don't like it. The decisions ride on individual taste instead of shared principles.

So the first thing I did was desk research. Six learnings, and a checklist to review the work against.

## Learning 1: Design maturity is a team property

The research called this *design maturity*, and the definition surprised me: it measures how widely design language is shared across a team, not how skilled the designers are.

That reframed the whole brief. Colors and fonts matter, but vocabulary the whole team can use is what keeps momentum after launch. You can ship beautiful screens and still lose them, because when someone rejects a screen on preference there's no shared reasoning to fall back on. That's the failure mode.

The research puts a scale under it — five stages:

- **Ad hoc.** Design happens screen by screen; every decision is personal.
- **Managed.** Reusable pieces exist, but the rules live in designers' heads.
- **Defined.** Tokens and patterns are written down and become the source of truth.
- **Optimized.** The rest of the organization decides with them: product consults tokens before requesting exceptions, engineering implements by semantic name.
- **Adaptive.** The system is machine-readable, and an AI can build on it without breaking identity.

```figure
maturity-stages
```

The useful part is where the ladder stops being about the design team. Getting to *Defined* is design's job — write the tokens down. *Optimized* isn't. That one is won by everyone else adopting the vocabulary, which means the jump can't be closed by hiring better designers.

The Velvetum study (*UX/UI Design Tools 2026*) puts a number on it: a fourteen-designer team's productivity rose 38% when the rest of the organization adopted the same stack and the same protocols. Not when the designers got better — when the boundary around them came down.

## Learning 2: Build around user intent

Most products are built on static layouts. The page is decided at design time and served identically to everyone. It works, but it carries a constraint: the same screen goes to every user regardless of why they came. Reviewing your wealth, planning to buy a house, selling property to reinvest — same screen. That's what makes a product feel generic.

UI in 2026 starts from intent: the interface recognizes what the user is trying to accomplish, then shows what's relevant. The four classic intents — informational, navigational, commercial, transactional — aren't new. What's new is treating them as the *starting point* of the flow rather than a downstream analytics framing.

```figure
static-vs-intent
```

Google PAIR distinguishes explicit intent (what the user names) from implicit intent (what the system infers from behavior). Both feed the decision about what gets shown first. For a product with no conversational layer, this doesn't mean bolting on a chat. It means designing forms and screens so the system infers intent before the user has to state it.

The detail that makes this safe to ship: don't rearrange the whole dashboard. That breaks spatial memory and reads as surveillance. Keep a fixed set of slots — page actions, section actions, filter rows, modal previews — and change which module occupies the lead slot. The structure stays; the emphasis moves. That's how a shared identity survives a partly generative interface: **the patterns carry the brand.**

```figure
tree-vs-intent
```

Navigation stops asking the user to walk a tree and starts offering short routes from each intent. The tree doesn't go away. It becomes secondary.

## Learning 3: Friction as a feature

The most counter-intuitive finding is also the most actionable. For a decade engineers chased instant response on every interaction. Designers in 2026 are deliberately adding delays back in.

Emil Kowalski compared two identical buttons for a high-impact action: one confirms the millisecond it's clicked, the other inserts a short processing animation before the same confirmation. Users overwhelmingly trusted the delayed version.

The mechanism is **perceived reliability**. For a high-stakes action — authorizing a payment, moving funds, rebalancing a portfolio — the brain doesn't believe a system that responded too fast had time to do the work. Optimistic UI, where you show success instantly and do the work in the background, actively damages trust in this context.

```figure
pause-confidence
```

The window is narrow: 150–250 milliseconds. Long enough to register that something happened, short enough that the app doesn't feel sluggish. Below 150ms triggers anxiety; above 250ms feels broken.

## Learning 4: Trust is a formula

Stan Vision (*Fintech UX in 2026*) defines trust in financial products as **transparency + consistency + responsiveness**. In practice:

- **Predict, but always announce.** Pre-filling a transfer is welcome; executing it without confirmation crosses the line. And when the app pre-fills, it says why: *"based on your last three transfers to this payee…"*. Silent prefill reads as surveillance. Announced prefill reads as competence.
- **Friction where it earns it.** The 150–250ms beat from Learning 3.
- **Biometrics as handshake.** Face ID, fingerprint and voice aren't only security any more — they're an emotional cue. *We know it's you, your environment is secure, let's proceed.*

Don Norman's three levels frame the rest: **visceral** (the first-impression reaction), **behavioral** (pleasure and effectiveness during use), **reflective** (how it sits with the user afterwards). An interface that only wins the visceral level doesn't last. In a product people open daily, the reflective level is where the relationship lives — by day 30, the user stops re-checking the numbers because the product has been right for a month.

## Learning 5: Stylish but minimalist

**The *Liquid Glass* trend.** Apple-style depth and translucency have matured. Professional tools now adopt *Anti-Liquid Glass*: keep blur and depth as a spatial cue, so a panel visibly floats above the content, but remove the refractive distortion that hurts legibility in dense interfaces. Linear is the reference. The rule that falls out of it: **glass on chrome, solid backgrounds on data.**

**Dark mode.** It stops being a nice-to-have; in a lot of products it's the default state, with 60–80% of users preferring it (Tubik, Merveilleux). You don't need an all-dark product, but you do need to build with it in mind. One critical detail: never pure black. Absolute black under white text produces *halation* — the white glows and bleeds at the edges, so the text reads as blurry.

**Color that communicates.** In 2026 color stops decorating and starts communicating. Surfaces stay neutral, which gives accents meaning. When one color is reserved for communication, users learn to recognize it without thinking. When everything is colorful, nothing stands out.

States work the same way: green positive, red risk. But color is never alone — a colorblind user can't tell a red −2% from a green +2%, so indicators pair color with a direction arrow. And the meaning has to be consistent to be learnable, which is the semantic layer again: `color-action`, `color-positive`, `color-critical`. The name carries the intent, and the intent holds across every brand on the system.

**The *bento* grid.** Asymmetric cards of different sizes are the default dashboard pattern for 2026: visual hierarchy without rigid columns. A large card for a chart, a small one for recent transactions.

```figure
list-vs-bento
```

Expressive minimalism works for high-cognitive-load B2B because it treats content by importance instead of giving everything equal weight. Cresco went further, with interfaces that look like technical blueprints: visible grids, monospaced numerals, no ornament. For people moving serious numbers, trust comes from the *absence* of decoration — a high signal-to-noise ratio reads as competence.

## Learning 6: Draw a map machines can read

AI has moved from generative (producing content) to *agentic* (executing work).

For an agent to build on a system without breaking its identity, it needs the difference between `blue-500` (descriptive) and `button-primary` (functional). Figma calls this *TokenOps*: maintaining machine-readable token rules so an AI produces consistent output. Ask an agent for a confirmation dialog and it reads the system's dialog, spacing and color tokens, then ships a component that matches the rest of the product without inventing a single hex value.

```figure
token-cascade
```

That's the difference between a system only humans can understand and one an AI can consume too.

## The checklist

So that when the redesign gets reviewed, the conversation is about research instead of preference.

1. **A shared design language.** Decisions get made with vocabulary the whole team shares — tokens, patterns, intent — not personal taste.
2. **Intent-based design.** Screens serve the intent the user arrived with: the explicit one they name and the implicit one inferred from behavior.
3. **Functional motion, not decorative.** Every animation is justified by the trust it adds or the attention it directs.
4. **Trust as a formula.** Transparency, consistency and responsiveness in every interaction, working on all three of Norman's levels — visceral, behavioral, reflective.
5. **Stylish but minimalist.** Neutral tones, functional depth, glass on chrome and solid backgrounds on data. Color reserved for meaning, never decoration.
6. **TokenOps ready.** Semantic tokens as the single source of truth, named functionally (`button-primary`) not descriptively (`blue-500`). This is the precondition for an AI building on the system without breaking it.

---

## Sources

The original articles, grouped by what each one is useful for.

**Trend roundups** — where the field agrees it's moving:

- [Tubik Studio — *UI Design Trends 2026*](https://tubikstudio.com/blog/ui-design-trends-2026/)
- [UX Collective — *The most popular experience design trends of 2026*](https://uxdesign.cc/the-most-popular-experience-design-trends-of-2026-3ca85c8a3e3d)
- [Envato Elements — *Web Design Trends*](https://elements.envato.com/learn/web-design-trends)
- [Merveilleux — *UI/UX Trends 2026*](https://www.merveilleux.design/en/blog/article/ui-ux-trends-2026)
- [Find a SaaS — *SaaS UX Trends 2026*](https://findasaas.com/blog/saas-ux-trends-2026)
- [Blushush — *Top 5 User Interface Design Trends for Modern Websites*](https://www.blushush.co.uk/blogs/top-5-user-interface-design-trends-for-modern-websites)
- [Spunk — *UI Design Trends 2026*](https://spunk.pics/blog/ui-design-trends-2026)

**Fintech-specific** — what users expect from financial products:

- [Stan Vision — *Fintech UX in 2026*](https://www.stan.vision/journal/fintech-ux-in-2026-what-users-expect-from-modern-financial-products) — source for the trust formula
- [Veza Digital — *Fintech Web Design Trends*](https://www.vezadigital.com/post/fintech-web-design-trends)

**Design systems + maturity** — the token-layer story:

- [Figma — *The future of design systems is semantic*](https://www.figma.com/blog/the-future-of-design-systems-is-semantic/) — TokenOps
- [dsruptr — *The Ultimate Design Maturity Guide for Tech Leaders*](https://dsruptr.com/2026/01/19/the-ultimate-design-maturity-guide-for-tech-leaders/) — the five-stage model
- [Velvetum — *UX/UI Design Tools 2026*](https://velvetum.com/en/journal/ux-ui-design-tools-2026) — the stack-consolidation study

**AI as teammate** — intent and visible reasoning:

- [Google PAIR — *People + AI Guidebook*](https://pair.withgoogle.com/guidebook/)

**Classics and specific references:**

- [Don Norman — *Emotional Design*](https://www.nngroup.com/books/emotional-design/)
- [Emil Kowalski](https://emilkowal.ski/) — the intentional pause in high-impact interactions
