# Story Bank

The running log of lived experiences that *could* become content. Newest at top. Most entries never ship — that's fine. Capture first, produce selectively.

Format follows `story-bank-template.md`. Status flow: `captured → prioritized → in-research → interviewed → drafted → shipped`.

> Seeded 2026-06-21 from a Granola cross-reference pass against `06-content-ideas/content-ideas.md`. These four were the strongest lived stories surfaced. Sources are cited per entry.

---

### [ID: fintech-pattern-hierarchy-2026-06-08]

- **Date:** 2026-06-08
- **Pillar / Type:** Blog (also a portfolio case study) — "Building page templates for fintech" / "Page templates" / "Layout patterns"
- **The story (what happened):** A friend pushed me to move my content away from AI and toward the actual craft. So I documented the pattern system I built for dense B2B financial dashboards (wealth manager + simulator platforms, across ICP / AFI / wolf planner). I defined a three-tier hierarchy: **Global** (top nav — logo, breadcrumb, search; side config), **Page** (page header with inline actions; a tab system that replaces redundant titles to save space; tab-specific actions treating each tab as its own page), and **Section** (variant-based content blocks, filters below tabs). I built it *with* the principal developers — and our initial examples broke the moment we hit complex design patterns. We refined through building: actions placement moved from below the tabs to its current structure.
- **The lesson / insight:** Consistency across dense, varied content (actions, graphs, tables with different column counts) doesn't come from spacing — it comes from a pattern hierarchy. For B2B financial advisors, **information density beats whitespace**. And patterns only hold up when you pressure-test them against the messiest real screens, not clean examples.
- **Why it matters:** Most layout advice is built for marketing pages and breathing room. People shipping dense B2B/fintech tools have almost no playbook. This gives them one.
- **Strength:** strong
- **Connected ideas:** "Building page templates for fintech", "Page templates", "Layout patterns", "Reading the Linear client article and making an example", "Data visualization checklist" · framework: components-before-pages
- **Useful phrases:**
  - "Tabs treated as separate pages."
  - "Information density over spacing for B2B financial advisors."
  - "The initial examples broke with complex design patterns."
- **Open questions:** What did inconsistency actually *cost* before the system (rework, dev confusion, review cycles)? Need one concrete before/after. What broke specifically in the dev examples? Planned interactive visuals — worth describing in the piece.
- **Source:** Granola `e398947f-1ed0-4b61-8158-5b1b58ed86be` ("Fintech UI pattern library — portfolio case study and blog post")
- **Status:** prioritized

---

### [ID: ds-naming-afi-azul-2026-05-22]

- **Date:** 2026-05-22
- **Pillar / Type:** Blog — "Naming" / "Mistakes I've made as a design system designer" / "Design MD"
- **The story (what happened):** Our token system had client-specific names baked in — variables like "AFI azul." The moment we tried to reuse the system for another client, the names fell apart. I pushed to rename primitives to something universal (`color-surface-secondary` instead of a brand color) and to keep three clean layers: **primitives** (base colors 0–900) → **semantics** (`surface-default`, `brand-primary-background`) → **component tokens** (`nav-item-background-default`, `button-primary-background`). Then a real disagreement with the team: I wanted to keep primitives + semantics as separate layers; they wanted a single flat file per client (consistent variable names, client-specific hex, fewer files to manage). We also drew a line on over-specification — e.g. does a download button need its own variable, or does it reuse `control-background-hover`? Consensus: don't create a variable for every unique element. Santander vs Unicaja became the worked example.
- **The lesson / insight:** Naming is where design systems quietly fail. Brand-specific names (`AFI azul`) feel natural and kill reuse. Name tokens by **function, not brand hierarchy** — and resist the urge to over-specify. The hardest part isn't the naming convention, it's holding the line on when *not* to make a new variable.
- **Why it matters:** Every design-system designer hits this wall, usually too late, after the names are everywhere. Naming and over-specification are the two most common, most expensive mistakes.
- **Strength:** strong
- **Connected ideas:** "Naming", "Overcomplication", "Mistakes I've made as a design system designer", "Primitive components then patterns then pages", "Design MD", "Nested components" · framework: components-before-pages
- **Useful phrases:**
  - "AFI azul doesn't scale."
  - "Name by function, not by brand hierarchy."
  - "Does the download button need its own variable, or does it reuse control-background-hover?"
- **Open questions:** How did the one-file vs two-layer debate actually resolve? Need a specific naming mistake that bit me later (the cost). Did the generic-naming switch break anything mid-flight?
- **Source:** Granola `25a1af0d-c674-46d4-a914-62cecbfc77a9` ("Design system variables and naming standards — primitives, semantics, and component tokens"). Supporting evidence: `c359a266-46b5-43c4-b4f6-fd98ce4bf687` ("Variable naming in wealth manager… overwrite PRIMENG values") — Figma vars need a `-p-` prefix to match PrimeNG, so copied dev-mode CSS needs manual edits; a concrete naming-mismatch cost.
- **Status:** prioritized

---

### [ID: design-md-modular-2026-04-30]

- **Date:** 2026-04-30
- **Pillar / Type:** Blog — "Design MD" / "Project planning process with AI" / "AI unlocks documentation, scale, and quality"
- **The story (what happened):** Built a "Design MD showcase" prototype in 3–4 hours with AI — migrating static screens into interactive prototypes so microanimations and flows could actually be felt. The system was structured as three markdown layers: **Content** (writing rules, Real Academia Española), **Design** (Figma primitives + component screenshots), and **Agents** (config for OpenCode, Codex, Claude). Then the experiment that mattered: I generated proposals *with* and *without* the Design MD, and ran it against existing vs new projects. The finding was counterintuitive — on **existing** projects the Design MD barely moved the needle (the AI just reads the codebase and copies the patterns already there); its real value showed up on **new** builds/prototypes from scratch (and even less with a library like PrimeNG, where only ~2 colors change). I also shifted from one giant document toward a modular **"skills + router"** model — a base Design MD plus attachable skills (buttons, drawers) — treating it like a changelog that's never finished. Used a "Caveman" repo to shrink token usage and cost.
- **The lesson / insight:** A Design MD isn't a spec you write once — it's an **organic, modular system that evolves like a changelog**. And its value is conditional: **AI already reads an existing codebase, so documentation pays off most on new, from-scratch work.** Knowing *when* it helps is the actual insight, not the document itself.
- **Why it matters:** Everyone's rushing to write "AI design rules" / design.md files. Almost nobody distinguishes where they actually help. This saves people from documenting into the void on mature codebases.
- **Strength:** strong
- **Connected ideas:** "Design MD", "Project planning process with AI", "AI unlocks documentation, scale, and quality", "AI allows designers to explain reasoning and document decisions", "Build components first with vibe coding" · framework: ai-shifts-designer-to-judgment, components-before-pages
- **Useful phrases:**
  - "It's never finished — it's a changelog, not a spec."
  - "On existing projects the AI just reads the codebase and copies the patterns."
  - "Skills and a router, not one giant document."
- **Open questions:** What were the actual quality differences in the with/without test (be concrete)? What's in the "Caveman" repo and how much did it cut cost? Did the skills+router model actually ship? This pairs naturally with the Claude-vs-Stitch interactivity story.
- **Source:** Granola `7677a8ea-7034-477f-b595-779044773d35` and `d2384f65-e8ca-4a4d-8173-f5ee78ff68ef` ("Design MD" strategy + showcase)
- **Status:** prioritized

---

### [ID: collective-0-to-1-2026-04-24]

- **Date:** 2026-04-24
- **Pillar / Type:** Blog — "0 to 1 in a month" / "Finding clients" / "Defining target audience" / "Elite case study" (Building The Collective)
- **The story (what happened):** Stood up The Collective and made the money structure real: **5% of all project revenue goes to a collective pot**, individual contributors track hours for future compensation, and you pull in help as needed. First concrete projects: KT360 as a collective client on a **$500/month retainer (25 hours)**, plus Elite's marketing campaign and an Orazio UX audit. The Elite numbers are the gut-punch: a recent webinar drove **500 signups → only 2 conversions**, with no nurturing process and manual steps all through the funnel. We built WhatsApp automation (template messaging across 5,000–6,000 contacts, reply tracking) and started converting 7–10 qualified leads regularly. Next steps were deliberately small: first KT360 invoice funds the domain/website; pick a name and secure the domain in ~1.5 weeks; target 4–5 recurring clients before expanding.
- **The lesson / insight:** Going 0→1 isn't a big launch — it's a revenue structure plus a few concrete retainers and one honest look at what's broken. **500 leads converting 2 isn't a traffic problem, it's a nurturing problem.** Manual funnels leak. The fix was systems (automation, tracking), not more signups.
- **Why it matters:** Designers/freelancers romanticize starting a studio. The real version is unglamorous numbers, a revenue-share model, and fixing a leaky funnel — which is exactly why honest specifics land.
- **Strength:** strong
- **Connected ideas:** "0 to 1 in a month", "Finding clients", "Defining target audience", "Workflows for busy people", "Elite case study", "Creating outreach for my personal business", "What it is" (The Collective) · also "Second brain for metrics and Slack updates as a freelancer"
- **Useful phrases:**
  - "500 signups, 2 conversions."
  - "5% of every project goes into the collective pot."
  - "Target 4–5 recurring clients before we expand."
- **Open questions:** What changed *after* the 500→2 realization — did conversions improve? How is the target audience actually defined? What's the collective named now, and did the domain happen? (This one could split into 2–3 posts.)
- **Source:** Granola `7b42cadd-a161-4aec-bc48-67d7a733e6a5` ("Collective business strategy and project planning session")
- **Status:** prioritized

---

### [ID: ai-design-interactivity-2026-05-27]

- **Date:** 2026-05-27
- **Pillar / Type:** Blog — "Lessons learned from poor AI outputs" / "Build components first with vibe coding" / "Using AI for feedback and launch"
- **The story (what happened):** Broke down a Claude Code vs Google Stitch comparison by actually working through both on a real test (a wealth-manager-style trading dashboard). The difference that mattered wasn't visual polish — it was **interactivity**. Claude's output was a clickable, tweakable prototype (density controls, live side-panel iteration, clean handoff to Claude Code with design mostly preserved). Stitch produced static images first, needed re-prompting for most changes, and the design "got lost" on handoff. The trap I named for myself: trying to do wireframe + high fidelity at once — "we get lost in the sauce doing both at once."
- **The lesson / insight:** **"Seeing interactiveness and iterating is how we get to good design"** — static AI mockups (like static Figma pages) make it harder to imagine the experience, so they lead to worse decisions. Visual iteration isn't a step in design; it's the whole thing. Also: don't chase wireframe and high-fidelity in the same breath.
- **Why it matters:** Everyone's comparing AI design tools on output looks. The real differentiator is whether you can *iterate live* — and most people pick wrong because they judge the screenshot, not the loop.
- **Strength:** solid *(reaction to a video + hands-on test, not a full lived project — best as a sharp LinkedIn post or short thread, not a case study)*
- **Connected ideas:** "Lessons learned from poor AI outputs", "Build components first with vibe coding", "Using AI for feedback and launch", "AI unlocks documentation, scale, and quality" · framework: ai-shifts-designer-to-judgment
- **Useful phrases:**
  - "Seeing interactiveness and iterating is how we get to good design."
  - "Visual iteration is literally the entire process of design."
  - "We get lost in the sauce doing both at once."
  - "They make the pages static, which makes it harder to imagine the experience."
- **Open questions:** Do I have a real project where a static mockup led me to a wrong decision that interactivity would've caught? That lived example would turn this from solid → strong.
- **Source:** Granola `53108e6d-c70d-4503-8adc-03ac5027902e` ("Claude code vs stitch")
- **Status:** captured

---

### [ID: designing-against-the-build-2026-02-16]

- **Date:** 2026-02-16 (also draws on 2025-11-14)
- **Pillar / Type:** Blog — "Challenges faced as a non-technical designer shipping products" / "Lessons learned" (AFI Simulators)
- **The story (what happened):** On the AFI simulators, my clean Figma designs kept colliding with the build. The code was written *before* the Figma design system existed, so tokens didn't match and every handoff needed manual translation. Component states (hover, pressed, disabled) weren't defined in the prototypes, so developers had to invent them — and lose time interpreting my intent. A custom stepper (the little dots between steps) didn't exist in the base components and meant overriding multiple CSS classes. The stack itself fought back: a Bootstrap 12-column grid meant exact widths like 288px were impossible (everything wanted to "fill container at 100%"), Bootstrap and Material were mixed (rem spacing vs Material states), and a 14px base clashed with Bootstrap's 16px. On the energy-efficiency simulator I cut modals entirely — "dialogs are annoying for programmers" — and simplified the onboarding into clear steps.
- **The lesson / insight:** As a non-technical designer shipping real products, **the design isn't done when it looks right — it's done when it survives the build system.** Designing without knowing the grid, the component states, and the framework constraints just moves the work downstream and creates invisible rework. Define states and respect the grid up front, or the developers design it for you (worse).
- **Why it matters:** Non-technical designers are told to "just design." This is the unglamorous reality of actually shipping — and naming it helps others stop fighting the same invisible battles.
- **Strength:** strong
- **Connected ideas:** "Challenges faced as a non-technical designer shipping products", "Lessons learned from poor AI outputs", "Auto-sync to Figma and code", "Primitive components then patterns then pages", "Mistakes I've made as a design system designer" · framework: components-before-pages
- **Useful phrases:**
  - "The code was written before the design system, so everything needs manual translation."
  - "If you don't define the states, the developers invent them."
  - "Dialogs are annoying for programmers."
  - "Everything just wants to fill the container at 100%."
- **Open questions:** A specific moment where undefined states shipped wrong, and what it cost? How did connecting Figma tokens to the build (the plugin idea) actually go? This is the counterweight to the AI-makes-it-easy stories — keep it honest.
- **Source:** Granola `69baec77-85c9-4a75-88ea-64af5aaa18f6` ("Simulador de eficiencia energética") and `f4499d28-61dd-4eb7-8f6f-7c93a18e29cd` ("Simulators design")
- **Status:** prioritized

---

### [ID: cafe-portfolio-storytelling-2026-04-17]

- **Date:** 2026-04-17 (also 2026-04-18)
- **Pillar / Type:** Blog — "Building my portfolio" / "Creating animations" (passion/portfolio)
- **The story (what happened):** Reimagined my portfolio away from a "tech business" feel toward something intimate — a café-shaped concept (inspiration from altportfolio): an animated "Hello," floating clouds that persist on scroll, the logo sliding to center as the portfolio moves up. Dropped the "316" logo to make it more personal. Built the site around a "what brings you here" story-selection interface, with **circles representing emotional states** (clashing/bouncing circles for disconnection) that move and transform with scroll to match each story line. Messaging leaned warm and human: "Take a sip, stay a while," "For the times you feel lost," products presented bar-style as "get a taste."
- **The lesson / insight:** A portfolio can be a *gathering*, not a brochure. Positioning yourself as a **guide rather than a tech business** — and using motion/metaphor (circles as emotional states) to carry meaning — changes who connects with it. The interaction *is* the storytelling.
- **Why it matters:** Most designer portfolios are sterile grids. Showing the thinking behind a story-first, animated, emotionally-framed portfolio is itself a portfolio piece — and rare.
- **Strength:** solid *(conceptual/aspirational — needs the built result + a clear takeaway to reach strong; risk of being self-indulgent without a lesson others can use)*
- **Connected ideas:** "Building my portfolio", "Creating animations for components", "Creating animations with AI", "Layout patterns"
- **Useful phrases:**
  - "Less of a tech business, more of a gathering."
  - "Take a sip, stay a while."
  - "What brings you here?"
  - "Circles that clash and bounce for the feeling of disconnection."
- **Open questions:** What's the takeaway for *readers* (vs. just documenting my own portfolio)? Did the scroll/circle interactions actually get built and work? Tie it to a principle — "interaction as storytelling" — or it stays a mood board.
- **Source:** Granola `a8552064-1427-44a6-8950-e8f855be712b` and `8191d17b-8131-4054-9b23-5ccc9667c0a7` (portfolio design exploration + visual storytelling)
- **Status:** captured

---

## Emerging patterns (frameworks discovered, not forced)

> Per rule #9 — these repeat across multiple stories above and elsewhere in Granola. Watch them; name them in content only once the evidence is undeniable.

### Pattern: components before pages (build order)
- **Evidence:** `fintech-pattern-hierarchy-2026-06-08` (global→page→section, built from parts up) · `ds-naming-afi-azul-2026-05-22` (primitives→semantics→components) · Granola `28d1b893` Component architecture ("need component library established before building demos") · Granola `3fe76be8` AI coding w/ Polo ("create components using MCP, bigger screens and patterns in code").
- **Why it's real:** shows up across at least 3 independent sessions, unprompted. This is an earned framework, not a forced one.
- **Connected ideas:** "Primitive components then patterns then pages", "Build components instead of pages", "Build components first with vibe coding", "Auto-sync to Figma and code".

### Pattern: AI shifts the designer's job from pixels to judgment
- **Evidence:** Granola `99c914a4` DS manifesto ("team reviews backend/accessibility, designer reviews taste, animations") · Granola `28d1b893` Component architecture ("recording design decisions valuable for articulating process") · `ai-design-interactivity-2026-05-27` (iteration > output looks).
- **Why it's real:** the same reframe — AI removes production work, leaving taste, reasoning, and review as the job — recurs across the manifesto, the architecture session, and the tooling comparison.
- **Connected ideas:** "AI allows designers to explain reasoning and document decisions", "AI changes the feedback dynamic for designers", "Revision is the most critical moment now", "AI unlocks documentation, scale, and quality".
