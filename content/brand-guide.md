# Brand guide — Richard Griner

This file is the source of truth for what the brand *is*. It sits one layer above the other two canonical files:

- **This file** — what the brand stands for (positioning, value, truth, personality, values, visual concept).
- [`voice.md`](voice.md) — how the brand *sounds*. Nothing here overrides it.
- [`lexicon.md`](lexicon.md) — the words the brand owns: the positive vocabulary, extracted from shipped work.
- [`src/app/globals.css`](../src/app/globals.css) — how the brand *looks*, as tokens. The visual concept below is the brief those tokens should serve.

It was derived from the published work (`published/`), the story bank (`content-os/01-story-bank/story-bank.md`), the social batches, and the site itself. Nothing here was invented; everything traces back to something Richard already shipped or said. Treat it like `voice.md`: a living doc. When the work outgrows a line here, edit the line.

---

## The one-page version

| Piece | The line |
|---|---|
| **Who** | Sole designer at a fintech consultancy who builds the systems, tools, and AI workflows that ship the work |
| **Flag** | *Design that holds up* |
| **Positioning** | The design systems designer who writes the rulebook that humans and AI both follow |
| **Value prop** | I turn taste into written systems that survive contact with code, clients, and AI |
| **Universal truth** | Anything you don't decide gets decided for you |
| **Personality** | Practitioner. Dry. Specific. Honest about misses. Quietly convinced. |
| **Visual concept** | The variable panel, not the canvas: restraint and density on the same page |

---

## Positioning

**Category:** design systems and AI-assisted design workflows, applied to dense B2B fintech.

**Statement:**

> Richard Griner is the design systems designer who writes the rulebook that humans and AI coding agents both follow. Sole designer at AFI, shipping wealth-management platforms where information density beats whitespace, he turns implicit taste into written, enforceable systems: tokens, layout grammars, design.md rulebooks, agent pipelines. The work is public and the working is shown, including the parts that broke.

**What makes the position defensible** (each claim has shipped evidence behind it):

- **He is the designer *and* the systems builder.** Not a DS theorist at a platform team of forty. One designer, real developers, real clients, PrimeNG and Bootstrap constraints, and the drift that comes with them. The advice comes from the messy version of the job.
- **He designs for machines as a first-class audience.** The design.md work, the skills-and-loops library, the agent pipelines in this repo: the insight that an AI reads your token names literally ("name palettes, not roles") is his home turf. Most designers write systems for teammates. Richard writes them for teammates *and* the agents generating half the UI.
- **He owns density.** Most layout and DS content is written for marketing pages and breathing room. Financial advisors at laptops need tables that scan, numbers with parity, chrome that never moves. Almost nobody publishes a playbook for that. He does.

**Who it's against** (the contrast, not enemies): trend-chasing AI-prompt content that ages in a month; design-system theory with no shipped product behind it; portfolio-brochure designers who show outcomes but never decisions.

**One-liner for a bio:** *Design systems for fintech, written so that humans and AI both follow them.*

---

## Value proposition

Three audiences, one engine.

**For readers** (designers and design-system folks, especially those in dense B2B products):
Transferable rules extracted from real shipped work. Not "here's my workflow" but the principle underneath it, the trade-off, the thing that broke and what it taught. Every post clears the bar: one takeaway, stated, that a competent peer didn't already know.

**For employers and collaborators:**
A designer whose output is a *system*, not a pile of screens. The taste gets written down: tokens routed cleanly through three tiers, layout grammar enforced, anti-patterns named. The result is less drift, faster onboarding, and AI output that looks like *your* product instead of the framework defaults.

**For the industry conversation:**
A grounded answer to "what do designers do now that AI builds the UI?" His answer, backed by the with/without experiments he actually ran: the job moves from pixels to judgment. Speed is the baseline; identity is the part the AI can't make up for you.

**The compressed version:**

> I turn taste into written systems that survive contact with code, clients, and AI.

---

## Universal truth

> **Anything you don't decide gets decided for you.**

This is the one truth every piece of the work demonstrates, and it holds far beyond design:

- Don't define component states, and the developers invent them.
- Don't write the theming rules down, and Figma and code quietly disagree.
- Don't give the AI a brief, and it fills the gaps with trained-in defaults. Same Tailwind, same rounded cards, same shadcn finish as everyone else.
- Don't name the layout grammar, and iteration #14 puts the new action wherever the last one went.
- Don't pick your breakpoints, and the framework picks them, along with support expectations you didn't sign up for.

The corollary that makes it *his*: **writing it down is the act of deciding.** The rulebook isn't documentation of the system. The rulebook *is* the system. Everything else is storage.

This truth is the thesis under the flag. "Design that holds up" is design whose decisions are written where every collaborator, human or machine, can read them. That's what holding up means: the defaults never got a vote.

Use it as the deep structure of content, not a slogan to repeat. Each post proves it with a new concrete; the audience should arrive at the truth themselves, more than once, from different directions.

---

## Personality

The brand personality is the writing voice from `voice.md`, named as traits. Five, with the test for each:

**1. Practitioner.**
Talks shop from inside the work. Opens with the situation ("I'm the sole designer at AFI"), not the hook claim. Test: could a reader tell this was written by someone who shipped it, not someone who researched it?

**2. Dry.**
The intensity of the speech voice converted into precision on the page. No exclamation points doing the work of evidence. The humor is deadpan and earned: *"the team had told me early on 'don't worry about it,' and then started worrying about it."* Test: delete the funniest line and the argument still stands.

**3. Specific.**
Counts everything. 87 variables, 22 custom semantics, three breakpoints, 3.5 hours instead of a full day. Proper nouns kept proper: AzulProfundo, Slate, PrimeNG. Test: could a competitor swap their nouns into the sentence? If yes, it's not specific enough.

**4. Honest about misses.**
Self-correction in the open: *"less drift than I'd budgeted for."* The first attempt that was wrong stays in the story. Critic, not cynic: the takedown grants the trade-off, because the people who built it weren't stupid. Test: does the piece admit at least one thing the author got wrong or would hedge on?

**5. Quietly convinced.**
Strong POV, no shouting. "Here's the thing I think is true," never "the definitive guide to X." Hard claims on what's broken, soft hedges on what's uncertain. Test: conviction should come from the evidence stack, never from volume.

**Is / is not:**

| Is | Is not |
|---|---|
| Builder thinking out loud | Guru announcing frameworks |
| Opinionated and calm | Contrarian for the algorithm |
| Warm in person, precise on the page | Casual-profane in print (that's the speech voice; see `voice.md`) |
| Shows the seams | Performs polish |
| Bilingual, Madrid-based, fintech-fluent | Placeless tech-influencer generic |

---

## Values

Six, each earned by the work rather than aspirational:

**1. Write it down.**
The unwritten rule doesn't exist. Systems, decisions, anti-patterns, even this brand: all of it goes on the page where the next collaborator (or agent) can read it. Evidence: design.md, the layout grammar, `voice.md`, this repo's entire agent setup.

**2. Specificity over abstraction.**
A real observation beats a hollow aphorism every time. Name the palette, count the variables, quote the actual line. Evidence: the voice rulebook makes this the substance bar for everything that ships.

**3. Show the working.**
Including the part where the first attempt was wrong. Trust is built by the visible audit, not the finished screenshot. Evidence: every published post keeps the correction in ("Claude's first pass routed surfaces to grisafi. Plausible, but wrong.").

**4. Serve the density.**
The user is a financial advisor at a laptop who cares about parity with their data more than delight. Information density beats whitespace when that's who you serve. Respect for the reader's actual job over the portfolio's aesthetics. Evidence: the fintech layout grammar, the Slate-over-grisafi surface call.

**5. Grant the trade-off.**
Critique assumes the people who built it had reasons. The takedown lands harder when it names what the other side got right. Evidence: the breakdown pillar's stance; the PrimeNG posts that credit what the library does hand you.

**6. Judgment is the job.**
AI removes production work; what's left is taste, reasoning, and review. Lean into that instead of racing the machine at its own game. Evidence: the with/without design.md experiments, the "speed is the baseline" cluster.

---

## Visual concept (idea de marca)

### The idea

> **The variable panel, not the canvas.**

The canvas shows what you made; the variables show what you decided. The brand's visual identity takes the side of the decisions. It should look like a well-kept spec that happens to be beautiful: the rulebook made visible.

In one sentence for a mood board: **restraint and density coexisting on the same page.** (The Bloomberg Businessweek observation from the reference work; it's also exactly what a wealth platform needs and exactly what this portfolio already does.)

### Where it steals from (deliberately outside fintech)

Per the "steal from outside the room" method, each reference contributes one sentence:

- **Editorial** (Bloomberg Businessweek, Wallpaper): restraint and density coexist; typographic scale does the hierarchy, not decoration.
- **Architecture studios** (OMA, Snøhetta): one confident typeface at several weights carries a whole identity. No mascot, no illustration system. Type, material, proportion.
- **Fashion editorial** (Acne Studios, The Row): color discipline, and the courage to leave negative space empty when the grammar allows it.

Fintech supplies the constraints (tables scan, numbers align, dark mode is real). The vocabulary comes from outside.

### The five moves

**1. Monochrome field, one opinion.**
Near-monochrome neutral surfaces (the OKLCH ramp already in `globals.css`), so the content and the single accent carry all the meaning. One blue as the only opinionated color, following the AzulProfundo pattern from the AFI work: a deep version in light mode, a bright version in dark mode, same role, mode picks the right one. Never two accents. If everything is an accent, nothing is.

**2. Typographic confidence.**
One family working hard across weights, in the architecture-studio sense. Roboto holds the sans and mono slots today; the `--font-display` slot is deliberately reserved. When it gets filled, fill it with the *editorial* move: a display face with genuine scale contrast for the big statements ("Design that holds up"), not a novelty font. Mono is not decoration: it marks the system layer. Token names, counts, code, anything the machine also reads gets set in mono.

**3. Editorial density.**
Dense is the brand, handled with grammar instead of whitespace. Structure comes from the four-level layout grammar and consistent chrome, so data can change without the page feeling like a different product. Tabular figures for numbers, always. The negative-value convention is a stated decision, not a default. When space is empty, it's empty on purpose.

**4. Motion as evidence.**
Motion exists to show the system working: soft, brief, staggered reveals (the `ease-out-soft` / `EASE [0.2, 0.8, 0.2, 1]` language already on the site). Nothing bounces for personality. If an animation can't explain what it's demonstrating, it's decoration; cut it.

**5. Show the seams.**
The artifacts of process *are* the art direction. Token tables, before/after pairs, annotated screenshots, figure diagrams, the variable panel itself. Photography and stock illustration are off-brand; a real diagram of a real decision is the hero image. This is also the content-graphic rule: six near-identical AI thumbnails in a grid says more than any metaphor illustration could.

### Anti-patterns (the "what we're not" wall)

- Gradient-mesh AI-startup shimmer. The brand is the antidote to that sameness; it can't wear the uniform.
- Emoji as interface or as bullet points. (Already banned in `voice.md`; it holds visually too.)
- Two accent colors, or accent-colored body text.
- Whitespace as a substitute for hierarchy. Breathing room is earned by the grammar, not sprinkled.
- A mascot, a personal logo mark that needs explaining, or any identity element the type could have carried. (The "316" logo was dropped for a reason.)
- Rounded-everything softness. The radius scale exists; the personality lives in proportion and type, not in pillowy corners.

### State of implementation

`globals.css` is already the neutral monochrome field with the token architecture in place. The **display font** slot is filled: Roboto Flex at the wide display cut (`wdth 125`, routed through `--font-display-width`), loaded in `layout.tsx` — the "one family working hard" move made literal. Two slots remain open, and this concept is the brief for filling them: the **chart palette** (currently placeholder grays; needs the disciplined data-viz ramp, one hue family plus semantic states) and the **accent blue** (primary is currently neutral; the one-opinion blue is defined here but not yet routed). Fill them through the token system, never inline.

---

## Maintenance

Same rule as `voice.md`: when something ships that contradicts this file and the shipped thing is right, edit this file. The brand is what the work keeps proving, not what this document asserts. If the two disagree for long, the document is the one that's wrong.
