---
parent: the-design-system-no-one-uses
created: 2026-05-09
status: draft
---

# Social extracts — The design system no one uses

Drawn from `index.md`. Each post points back to the moment in the case study it came from. Not generic takeaways.

## LinkedIn (3 posts)

### 1. The first time the system came back to me intact

This week I had two calls back to back with two of our Angular devs. Same product, same design system, two opposite results.

On Thursday, dev one walked me through tokens and component documentation. We agreed the Figma handoff wasn't working and that interactive demos were the move. He sent me his code afterward as a reference.

On Friday, dev two opened his Mutualidad codebase on screen. Primitives in one global file, semantic variables connecting to those primitives, all of it under `:root` so every page had access. *"With Mutualidad, I follow your primitives,"* he said. The exact architecture I'd been building in Figma for months, finally rendered in code. First time the system had come back to me from the dev side intact.

Then he looked at the code from the day before and said, plainly: *"It is wrong. The way we do it is wrong. We don't follow any rules. We don't follow what you do. Each one of us does whatever they want. It's just chaotic."*

A design system isn't proven by how thoroughly it's documented in Figma. It's proven by whether the dev sitting next to you can rebuild it from memory in code. Mutualidad passed the test. Most of the rest of the team is still pulling away from it.

*(From: *The two meetings in May*.)*

---

### 2. Why "one base, many banks" is a 30% answer

We sell white-label simulators to Spanish banks. The pitch: one AFI base, swap the brand tokens, ship the variant. One-click rebrand.

In practice, every bank breaks it.

Santander's internal component library is missing half the components I need. Their bonificaciones module came back with a €200k vs €5k cost split between two implementations of the same idea — the conversation wasn't even about visual hierarchy at that point.

Sabadell needs independent border edges on inputs. The PrimeNG Aura API can't express that — it requires manual CSS overrides the token layer doesn't carry.

CaixaBank's brand yellow tested at a 1.69 contrast ratio against white. WCAG AA wants 4.5. So we couldn't use it as an action color. We ended up keeping AFI's blue inside a CaixaBank-skinned product — technically off-brand, but the alternative was failing accessibility on legal text.

Kutxabank is black, white, and *redondita* typography. The "swap" is a typographic reset that breaks the visual rhythm we tuned for AFI's Roboto.

Token swapping handles color, spacing, radius, type. It doesn't handle structural difference — different navigation, different data shapes, different legal constraints, different component coverage in the client's own libraries. We kept selling the 30% answer as the whole answer. The next version of this work is admitting that out loud, and pricing for it.

*(From: *Where it started cracking — the clients*.)*

---

### 3. Static screens lie about behavior

A stakeholder I work with hates ghost buttons. Every time he sees one in a review, he reacts the same way: "what's this? That doesn't look like a button."

He's right, in a way. On a static Figma screen, a ghost button doesn't look like a button. It only earns its visual weight when you hover it.

That single recurring rejection — over a year, across multiple projects — is the cleanest example I have of why the medium matters. The Figma screen flattens behavior into a snapshot. Hover, focus, animation, the whole interaction layer doesn't exist on the artifact people are reviewing. So the artifact lies about how the design behaves.

The same shape of problem hits the dev side. Devs program off the screen, not the component file, because the component file lives in a place they don't go. So the micro-interactions I'm spending hours on in Figma quietly disappear in the build, and the result is a product that's slightly worse in a hundred small ways. Each one looks too small to fight about. They add up to a bad experience.

The answer we're building isn't another Figma file. It's a platform where every component renders for real, animated, with the actual CSS values inspectable. So the ghost button looks like what it is, and the dev can grab the value without translating between mediums.

*(From: *Where it started cracking — the team*, *The deeper problem*, *What we tried*.)*

---

## X / Twitter (6 posts)

1. The single most useful sentence from any meeting this year, said by my own dev about my own system: "It is wrong. The way we do it is wrong."
   *(From: Opening.)*

2. We sold a "one-click rebrand" white-label promise to five banks. Token swap handles color, spacing, radius, type. It does not handle: structural IA, missing components in the client's library, brand colors that fail WCAG. That's a 30% answer pretending to be 100%.
   *(From: *Where it started cracking — the clients*.)*

3. CaixaBank's brand yellow has a 1.69 contrast ratio against white. WCAG AA wants 4.5. So the brand color can't be an action color. The whole white-label conversation breaks down at that one number.
   *(From: *Where it started cracking — the clients*.)*

4. Bonificaciones module: granular checkbox implementation €200k. Single editable field to the same effect €5k. The job at that point isn't designing — it's pricing the difference between two interaction models so the client can choose.
   *(From: *Where it started cracking — the clients*.)*

5. Stakeholder hates ghost buttons. He hates them because he sees them static, where they don't look like buttons. Hover state earns the weight. The static Figma screen lies about behavior — that's the actual problem, not the ghost button.
   *(From: *Where it started cracking — the team*.)*

6. A design system documented in Figma is documenting itself for an audience that isn't in Figma. Designers work on the canvas. Devs work in the IDE. Stakeholders look at flat exports. The library is a museum that the people whose work it should govern walk past.
   *(From: *Static screens to AI*.)*

7. October 2025: my client lead sat me down for going slow on Renta 4 — *"ahora me da mucho miedo entregar tarde y mal."* Same call, after I explained the system would cut the next bank to 2-3 hours: *"vaya inversión buena que has hecho, Richard."* The investment was right. The communication wasn't. Both lessons matter.
   *(From: *Renta 4, Material, and the boss who hated the pace*.)*

---

## Blog seeds (3)

- **The 30% answer: what white-label design systems can and can't carry** — A deeper post on token swap as a business model. Walk through five concrete bank engagements (Santander, Sabadell, Kutxa, Caixa, Mutualidad), each one as a vignette of a different way the "one base, many brands" promise breaks. End on the framework: tokens cover surface, components cover patterns, neither covers IA — and IA is where the real client-specific work lives. Source: white-label cross-client synthesis from the [Granola query on white-labeling, 2026-05-09].

- **Documenting Figma is documenting the wrong room** — Standalone authority piece on the medium problem. Argues that the Figma library is a museum for an audience that doesn't visit it, and that the next generation of design systems will live in the codebase as machine-readable JSON + interactive component pages, not in component-library Figma files. Tie to the Memorisely instructor's "12 months from now" prediction if it lands; cut it if it dilutes the AFI-specific story. Source: design system tokens for simulators, May 7 + OpenCode demo + Memorisely bootcamp Feb 16.

- **The pair-presentation pattern** — Short process piece on Alberto's suggestion that we present the responsive-token approach to the team together — design and engineering as a unit — to break the "design vs. engineering" framing that creeps into every adoption conversation. Keep it tight: 400 words. Source: May 8 Alberto meeting.
