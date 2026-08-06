---
title: "The design system no one uses"
slug: the-design-system-no-one-uses
pillar: process
status: draft
client: multi-client
related_clients: [afi, renta4, mutualidad, santander, sabadell, kutxabank, caixabank, unicaja]
related_work: [afi, kt360]
created: 2026-05-09
source_meetings:
  - id: 2f9210ae-52e3-4855-9161-ace0d6a2d61e
    title: "Design system coherence and UI component library development (Miguel)"
    date: 2025-09-02
  - id: df4d7550-e4f0-4085-8a4d-6bec43478e80
    title: "Preparing for Renta4 Handoff 4"
    date: 2025-10-09
  - id: 7689e7bb-ab61-4c1a-8518-8a77abaa4a49
    title: "Renta 4 — Borja, Jaime, Pablo design review"
    date: 2025-10-15
  - id: c26b8d51-e5fe-4f49-a8c7-d4ef37b62d01
    title: "Renta 4 management coherence review (Borja)"
    date: 2025-10-15
  - id: 739b11f6-f3a0-4c5a-93a0-0f7d83104d20
    title: "Borja, Pablo, Rich — Renta 4 handoff 5 and revisions"
    date: 2025-10-27
  - id: 410a7d47-7dab-4df9-8b04-c6b4b19d3871
    title: "Miguel and Rich — post-iteration 1"
    date: 2025-12-04
  - id: 4e92e8a0-a688-41a7-906d-922326afa217
    title: "Design system tokens and semantic components handover for Wealth Manager (Miguel, Nico)"
    date: 2025-12-11
  - id: bb7ebdb4-a676-464b-be4d-dc3e572d3a5d
    title: "Mutualidad — gráficos y presentación de productos para revisión de diseño"
    date: 2026-03-09
  - id: 7371a232-546f-4a1d-9141-c864f042fef9
    title: "Mutualidad — revisión de gráfico de ahorro para jubilación"
    date: 2026-03-09
  - id: 42ff928e-b33f-431b-8902-7f6c40637720
    title: "Mutualidad — Wolf Planner: datos personales y gráficos de ingresos"
    date: 2026-03-10
  - id: f30e975a-71f1-4fc7-814d-518fa8b60ffa
    title: "Mutualidad / Santander — Modificación de Parámetros de Jubilación"
    date: 2026-03-11
  - id: 437fd78c-61fa-44d0-ae0c-65af7bfb0dd5
    title: "Variables and tokens walkthrough — Wealth Manager (Miguel)"
    date: 2026-04-15
  - id: 50efbc33-1437-4bab-80c0-a0965018679e
    title: "Design system update for Afi simulators team"
    date: 2026-04-28
  - id: d6e21d2f-1490-4781-97cb-4ed36195b303
    title: "Tokens and component documentation for simulators (Alberto)"
    date: 2026-05-07
  - id: 0c7de618-a2a9-4ae1-9d0b-97a7cfc6e63e
    title: "Variables and responsive breakpoints (Andres)"
    date: 2026-05-08
tags: [design-systems, white-label, fintech, material-ui, primeng, tokens, ai-tools, figma-mcp]
reading_time_min: 11
---

# The design system no one uses

I joined AFI in mid-2025 as the only designer on Wealth Manager and the simulators. There were no components. There were screens — a lot of them — and a Figma file that read like an archive of every decision anyone had made for a year, none of them written down. Miguel was on the other side of the building working on Coherence, his own design system for the Wealth Manager product. We started orbiting each other almost immediately because the only way to make sense of any of it was to compare notes.

The story I want to tell isn't about Wealth Manager. That's its own case study, and Miguel's name is on most of it. This one is about the simulators — the white-label, sell-it-to-five-banks side of the business — and how, in the seven months from October 2025 to today, the system underneath it went from Material UI screens nobody was happy with, to a PrimeNG file you could mode-swap between brands, to a bespoke token architecture I now hand to AI agents to generate the actual components. And how, after all that, the line from a dev on May 8 was still: *"It is wrong. The way we do it is wrong."*

## Renta 4, Material, and the boss who hated the pace

The first real simulator project was Renta 4, in October 2025. I was building it in Material UI — not just dropping in components but trying to grow a small design system on top of Material that the next bank could inherit from. Material has a Figma library that ships out of the box and a code preset that matches it, which sounds great until you try to make it look like a traditional Spanish bank. The defaults are loud, modern, slightly Google. Renta 4 is muted, conservative, financial.

So I spent the first stretch of the project bending Material into something it didn't want to be. Corner radius from 4px to 0px to match the brand. Field sizes shrunk below Material's defaults because Wealth Manager is so data-dense that standard components would have caused endless scroll. Tabs documented with active states, chip accessibility tightened, typography rewired in dropdowns, the whole Material aesthetic getting walked back one token at a time. *"Sí, estamos siguiendo material design totalmente, solo he cambiado por ejemplo, corner radius, puedo cambiarlo como token, para encajar más con la marca de Renta 4,"* I told the team in one of the handoff calls. Someone on the call described what was coming out the other end as *"material, pero un poco reinventada"* — Material, but somewhat reinvented. That phrase was the polite version of the actual problem.

It was slow. On October 15, Borja sat me down. The client had been promised wording fixes — *"cuatro mierdas de wording"* — a week earlier. I'd prioritized rebuilding the system instead of shipping the small fixes first, and he wasn't subtle about it: *"Si pudiéramos echar marcha atrás, y yo hubiera sido consciente de que íbamos a tardar… yo se habría dicho, primero, cambiemos las cuatro mierdas sobre la marcha, y luego ya hacemos lo de ir despacio para ir rápido."* He kept going. *"Lo que no se puede hacer es hacer un compromiso con el cliente y saltárnoslo. Sin que hayamos consensuado."* And then, with the kind of honesty that lands: *"Ahora me da mucho miedo entregar tarde y mal."* [meeting: Renta 4 — management coherence review with Borja — 2025-10-15](granola://c26b8d51-e5fe-4f49-a8c7-d4ef37b62d01)

I'd made a real architectural decision. I just hadn't aligned with him on the timeline. Later in the same call, after I explained that once the system was built, adapting it for the next client would take *"dos, tres horas,"* he flipped: *"Poder, macho, vaya inversión buena que has hecho, Richard. Que has hecho una muy buena inversión, de tiempo. Yo por lo que he visto sí va rápido."* The investment was right. The communication wasn't. That lesson is in the spine of everything that came after this — every system call I've made since then has come with the timeline next to it.

The deeper signal underneath the pace argument was Material itself. The reason any of this was slow was that Material was a closed system that didn't want to bend, and we were going to need it to bend a lot. So I started going around. I sat down with the senior devs from the simulator teams — what do you actually need, what's missing, what can't you do today, what would make this faster. The pattern was the same in every conversation: Material's flexibility ceiling was below the line we needed to ship at. People were copy-pasting CSS to fake what the system should have given them.

Miguel was hitting the same wall on the Wealth Manager side. He'd been pushing PrimeNG over there because PrimeNG let you reach further into the components — closer to the metal, less framework opinion in the way. We talked. The decision became the move.

## PrimeNG, the white-label Figma, and the wall

The boss wanted everyone on PrimeNG. I built the AFI design system on top of it: primitives, brand tokens, a Figma file with mode switching so you could flip between AFI, Santander, Sabadell, Kutxa, Caixa, Mutualidad and watch the same screens reskin themselves. One file, six brands, theoretically clean.

Then the clients hit it.

The general pattern with bank clients is one of the realer things I've learned in this work: every bank has a giant design system. None of them are finished. The teams inside the bank are big, often distributed across squads with different priorities, and the system reflects that — components missing, tokens inconsistent, three different shades of "primary blue" depending on who shipped which product. So when we engage, we're not theming our system *into* their system. We're theming our system *across the gaps in* their system, while also navigating whatever conservative-stakeholder rejection comes back from their review side.

Sabadell was the cleanest example of why PrimeNG itself wasn't going to be enough. The brand needed independent border edges on inputs — top and bottom treated differently — and the PrimeNG Aura API doesn't expose that. You can theme a border. You can't theme *one side* of a border. So the answer became manual CSS overrides written outside the design system, which is exactly the kind of work that drift is made of: the fix lives somewhere the tokens don't reach, the next dev to touch it can't find the rule, and a year later you're holding a system that no longer knows what it is.

That's when I called the pivot. We weren't going to ride PrimeNG forever. PrimeNG was a library; we needed a system. So I started building the components from scratch on top of our own token architecture, with PrimeNG as a reference point and an off-ramp rather than the foundation.

## Tokens — primitives, semantics, components

Miguel had been hammering on tokens for months on the Wealth Manager side. Three tiers: primitives (raw values, no meaning), semantic numbers (`spacing/md`, `border/thin` — values with intent), and component-level tokens (`p-datatable/padding/normal` — the slot-specific overrides). The structure isn't novel. What was new for me was watching the discipline of it operate end-to-end on a real product, with all the moments where the system bent and didn't break.

I lifted the structure for the simulators. Primitives in Figma. Semantic numbers in a layer above. Component-level tokens for the slots that PrimeNG either didn't expose or that we'd diverged from. Everything routed back to four AFI brand colors at the 500 step of a 50–950 ramp, with primary mapped to `AzulProfundo` in light mode and `azulafi` in dark mode for accessibility — same role, two palettes, mode picks the right one. The whole thing is documented in a separate write-up: [Writing the rulebook PrimeNG doesn't ship with](../design-md-primeng-wealth-manager/published.md). That piece is the design.md story; this one is what built it.

The first place this token architecture made it from Figma into production was Mutualidad. We started designing it in early March 2026 — a 3-step retirement simulator, two products (Plan Ahorro Suma Plus and Plan Ahorro Multiplica), one of them highlighted, no carrusel after the team killed it in the March 20 review. Compared to the Renta 4 fight, the Mutualidad work felt different from the start. On March 9, halfway through a review, I caught myself saying *"los variables son muy organizados, este es"* almost in passing. That wasn't a design comment — it was the system actually carrying its weight on the canvas. [meeting: Mutualidad — revisión de gráfico de ahorro para jubilación — 2026-03-09](granola://7371a232-546f-4a1d-9141-c864f042fef9)

The real proof, though, didn't show up until two months later, when a dev finally walked me through what had landed in code (more on that below).

The reason the token architecture mattered for the simulators specifically is that it gave us a layer the white-label promise could actually live in. Brand swap doesn't mean editing 300 components. It means editing the primitive layer and watching the semantic and component layers route the change through. *In Figma it works.* The friction is everywhere else.

## The two meetings in May

This past Thursday and Friday — May 7 and May 8 — were the moment all of it landed.

May 7 was Alberto. We started on documentation: replacing the Figma-based handoff with interactive demos where the component renders for real, with hover, focus, animation, and inspect-element pulled apart so devs can grab the actual CSS. The whole point is that a Figma screen can't show behavior, and devs program off the screen, not the component file. He was on board.

But the conversation that mattered more was the one in the middle of that call, where I walked him through the full token architecture — primitives, semantic numbers, component-level tokens, the whole stack. Alberto's sharpest engagement wasn't on the architecture itself. He accepted the three tiers without much friction. His real probe was on portability: *"¿en plan, esto no va ser, por ejemplo, si tiene un cliente que tiene Santander y tiene un simulador, claro, no van a ser estas dimensiones, estas cosas, sean las suyas?"* Translation: are these dimensions and tokens going to flex per client, or is this an AFI-only system? That's the white-label question, asked from the dev side, and it's the right question. The whole token architecture only earns its weight if the answer is yes. [meeting: Tokens and component documentation for simulators with Alberto — 2026-05-07](granola://d6e21d2f-1490-4781-97cb-4ed36195b303)

May 8 was Andres, the dev on Mutualidad. He pulled up the codebase live on screen and walked me through it. Primitives in one global file. Semantic variables connecting to those primitives — `action-primary-default` mapped to a primitive color, `border-radius-LG` mapped to a primitive number, all of it living under `:root` so every page had access. *"With Mutualidad, I follow you your your primitives. You know? We we use, like, a like a JSON,"* he said. He showed me the structure I'd been building in Figma for months, finally rendered in code. It was the first time I'd seen the system come back to me from the dev side intact.

Then he looked at the code Alberto had sent the day before and said, plainly: *"It is wrong. The way we do it is wrong. We don't follow any rules. We don't follow what you do. Each one of us does whatever they want. It's just chaotic. Random names, random."* [meeting: Variables and responsive breakpoints with Andres — 2026-05-08](granola://0c7de618-a2a9-4ae1-9d0b-97a7cfc6e63e)

Two devs, back to back, looking at the same problem from opposite ends. Alberto accepted the architecture and asked the right white-label question. Andres had the cleanest version of it actually shipping in production and was telling me the rest of the team was pulling away from it.

The other thing that came out of the May 8 call was technical and immediately useful. We got onto responsive design — how do you handle breakpoint-aware tokens in CSS. I showed Andres how I do it in Figma: a `size/md` token that switches values per breakpoint via Figma's mode system. He stopped, looked at it, and said *"this is dope. I mean, if this is how you do it, if this is like a standard — dude, I'm gonna be doing this for all my projects. Like, I'm gonna tell my AI to do it for me."* The pattern existed. It just hadn't reached him because there was no shared layer between my Figma and his code. We only got there because we were on a call, screen-sharing, and I happened to have it open.

## Static screens to AI

The deeper realization that was sitting under all of this: a design system documented in Figma is documenting itself for an audience that isn't in Figma. Designers work on the canvas. Devs work in the IDE. Stakeholders look at flat exports. Borja, one of our Renta 4 stakeholders, had been rejecting ghost buttons for months because every time he saw one he saw it static — *"what's this? That doesn't look like a button."* And on a static screen, he was right. A ghost button only earns its weight when you hover it. The Figma file flattens behavior into a snapshot, so the snapshot lies about how the design behaves. [meeting: Miguel and Rich post-iteration 1 — 2025-12-04](granola://410a7d47-7dab-4df9-8b04-c6b4b19d3871)

The same shape of problem hits the dev side from a different angle. Devs program off the screen, not the component file, because the component file lives in a place they don't go. So the micro-interactions I'd be spending hours on quietly disappear in the build, and the result is a product that's slightly worse in a hundred small ways.

The fix isn't more documentation. It's putting the system somewhere people actually look. That's why design.md exists — a Markdown file in the repo that encodes tokens, rules, and anti-patterns in a form humans *and* AI agents can read. And it's why Miguel and I have been building toward an internal platform that renders every component for real, animated, with the actual CSS values inspectable, and a JSON export of every token layer so AI tools (Cursor, Claude Code, OpenCode) can consume the system as structured data instead of trying to read a Figma file.

The white-label upside of all this is the part I'm most excited about. Once the tokens are JSON, once the components are generated by AI from the spec, brand-swapping stops being "open Figma and reskin." It becomes "swap the primitive JSON, run the agent, get the variant." The structural differences between banks — the Sabadell-style border quirks, the Caixa contrast constraints — are still there, but they become small, named overrides at the component level instead of hand-fixes that escape the system entirely.

I'm already working at that pace on the simulators with Miguel. *"Instead of spending five hours in Figma pixel pushing, we build in code in two or three, send it to you, get feedback, and only put it back in Figma if we need to."* Figma stops being where the system *lives*. It becomes where the client *reviews*. [meeting: Diseño de sistema de variables y tokens para Wealth Manager — 2026-04-15](granola://437fd78c-61fa-44d0-ae0c-65af7bfb0dd5)

## What's still in motion

This is not finished and I'm not going to pretend it is.

The dev team is currently shipping consistent-looking screens that aren't using the same components. Visually it's coherent. Underneath it isn't reusable. Closing that loop — getting the team off screen-by-screen building and onto the shared component layer — is the next stretch of work. Andres's Mutualidad codebase is the reference; the rest of the team is somewhere between adopting it and ignoring it.

Figma MCP color variables still don't connect cleanly. Fonts and number tokens come through; colors sometimes invent their own styles instead of using the ones in the file. Until that's fixed, the AI loop has a manual step in the middle that shouldn't be there.

PrimeNG/Aura keeps fighting back on the components we still depend on it for. We can route intent through tokens. We can't always get implementation through the API.

And the deepest unresolved piece is buy-in. Andres and I agreed on the responsive-token approach in one call. Getting it adopted across the team means writing it down, presenting it, and probably running a session as a pair — design and engineering walking in together — because right now too much of the friction reads as design-vs-engineering and it doesn't have to.

The end state — an internal "shop" where the tokens, the components, the AI tooling, and the white-label pipeline are one thing — isn't ready to be called that yet. It's still just the frontend. But the path from Renta 4 in October to where Andres's Mutualidad codebase sits today is real, and it's the first time the system has actually come back to me from the dev side intact.

## Notes & sources

- [Sep 2 2025 — Coherence design system intro with Miguel](granola://2f9210ae-52e3-4855-9161-ace0d6a2d61e) — atomic naming, origin of our collaboration.
- [Oct 9, 15, 27 2025 — Renta 4 handoffs](granola://c26b8d51-e5fe-4f49-a8c7-d4ef37b62d01) — the Material UI period. *"Cuatro mierdas de wording"* / *"vaya inversión buena que has hecho, Richard."*
- [Dec 4 2025 — Miguel and Rich post-iteration 1](granola://410a7d47-7dab-4df9-8b04-c6b4b19d3871) — Borja and the ghost button.
- [Dec 11 2025 — Tokens and semantic components handover with Miguel and Nico](granola://4e92e8a0-a688-41a7-906d-922326afa217) — atoms/molecules/organisms.
- [Mar 9–11 2026 — Mutualidad design reviews](granola://7371a232-546f-4a1d-9141-c864f042fef9) — 3-step simulator, two-product layout, "los variables son muy organizados" moment.
- [Apr 15 2026 — Variables and tokens walkthrough with Miguel](granola://437fd78c-61fa-44d0-ae0c-65af7bfb0dd5) — three-tier tokens explained end to end. *"Then I make it, but then you guys don't use the components. Again, fine."*
- [Apr 28 2026 — Design system update for the simulators team](granola://50efbc33-1437-4bab-80c0-a0965018679e) — sidebar redesign, icons in dense UIs, layout versioning.
- [May 7 2026 — Tokens, documentation, and the multi-tenancy probe with Alberto](granola://d6e21d2f-1490-4781-97cb-4ed36195b303) — *"¿no van a ser estas dimensiones, las suyas?"*
- [May 8 2026 — Variables and responsive breakpoints with Andres](granola://0c7de618-a2a9-4ae1-9d0b-97a7cfc6e63e) — *"It is wrong"* / *"with Mutualidad I follow your primitives"* / responsive tokens via Figma modes.

## Open questions for Richard

- **AFI start date**: I wrote *"mid-2025"* in the opening because you said April or June and weren't sure. Pin a month and I'll swap it in.
- **The "internal shop" framing**: I left it out of the body and just hinted at it in the closing (*"the end state isn't ready to be called that yet"*). Tell me when you want to introduce that framing publicly — could become a follow-up piece on its own.
- **Sabadell**: kept the example tight (independent border edges, Aura API ceiling). If you want the per-building/per-dwelling cost-breakdown detail or any other Sabadell specifics, I can add a beat.
- **OpenCode demo + Memorisely outside-context**: still left out (the *"Figma made for us"* / *"vibe coding cringe"* / 12-month prediction quotes). They felt like they'd dilute the AFI-specific story but I can fold one in if you want a wider industry beat.
- **Slug**: `the-design-system-no-one-uses` is the central tension. Alternates: `from-material-to-ai`, `one-base-many-banks`, `figma-cant-show-this`. Title can decouple from slug if you want a different headline.
