---
title: "AFI design system — case-study syndication batch"
source: published/process/fintech-layout-grammar.md
pillar: process
stance: practitioner
status: draft
created: 2026-07-01
platforms: [twitter, linkedin]
posted_at:
typefully_ids:
  linkedin:
  twitter:
---

# AFI design system — case-study syndication batch

Standalone-only pass on the layout-grammar case study (two AFI products — Wealth Manager, Wealth Planner — given one shared spine: global → page → section → content).

**Matt Gray, standalone-only.** No threads. Matt Gray's own 2026 feed is single sharp posts, not thread-bait — the structures below are borrowed shape only, never his guru voice. Every post here opens from a real detail in the case study, never a maxim.

Skeleton legend: §3 old→new · §5 don't-need/do-need · §6 N-things+kicker · §7 equation · §8 comparison · §9 stop-X-do-Y · §10 contrarian lever · §11 setup→payoff→kicker · §14 breakdown · §16 99%-skip · §17 one-sentence opener.

Real scheduling lives in [`content/social/backlog.md`](../backlog.md).

---

## Standalone tweets (10)

**Standalone A — the real cause of density** *(§17)*

Dense fintech screens don't feel dense because of the table.

They feel dense because every page around the table has its own header, its own action placement, its own way of breaking up the body. Fifteen versions of the same chrome, one product.

---

**Standalone B — the breakdown** *(§14)*

Wealth Planner's screens were 10% different content, 90% different chrome around identical content.

Some pages had tabs. Some stacked a second title under the first. Some put filters above the table, some below. Nothing was wrong with any single page — the drift was between them.

---

**Standalone C — old way → new way** *(§3)*

How we handle page actions now:

Old way: stack them under the title, like a second header.
New way: inline with the title, same line.

Manu opened the reworked page and asked which line was the page. That question is what killed the stack.

---

**Standalone D — placement is scope** *(§10 contrarian lever)*

Put a page action below the tab row and it reads like it belongs to the tab. Same button, wrong scope — nobody can tell what it actually controls.

What fixed it wasn't a better component. It was moving the actions up inline with the page title, so the scope was obvious: this acts on the whole page.

---

**Standalone E — stop / do** *(§9)*

Stop adding a second title to disambiguate a page.

If two routes would share a title with a word tacked onto the end — "Resumen" and "Situación actual" — they're not two pages. They're one page with two tabs.

---

**Standalone F — the duplicate nobody caught** *(§17)*

Two nearly identical pages sat in the product for a month before anyone noticed they were the same page twice.

Same chrome, different content underneath. We'd built three pages because the routing was page-shaped instead of tab-shaped. The fix was one route, three tabs, one filter row that swaps with the tab.

---

**Standalone G — don't need / do need** *(§5)*

A section header is simple.

Don't need: an H2 on every page "for consistency."
Do need: an H2 only when a page actually has more than one section.

A floating "Resumen" heading on a single-section page isn't consistency. It's a label for a split that never happened — the rule is headers only where content actually divides.

---

**Standalone H — the comparison** *(§8)*

A rule a dev can quote > a principle they have to interpret.

"One H1 per page, always the page header" gets wired correctly at 4pm on a Thursday. "Headers should be hierarchical" gets guessed at.

---

**Standalone I — the equation** *(§7)*

Coherence across two fintech products = one spine (global, page, section, content) + names that match between Figma and the codebase + rules short enough to fit in a dev's head while they're wiring a screen.

---

**Standalone J — what actually changes the platform** *(§17)*

ICP and Nivel de Riesgo aren't page actions and they aren't settings.

They're the two values that sit in the side rail because they change how the whole platform reads, not just one screen. That's the actual test for whether something belongs in the global rail: would three different pages all need to consult it?

---

## LinkedIn post (~215 words)

I'm the only designer at AFI, a fintech consultancy. Two of our products — Wealth Manager and Wealth Planner — serve the same kind of user: a financial advisor staring at dense tables, graphs, and configurators all day.

The dense screens weren't the problem. Every page having its own header, its own action placement, its own way of splitting up the body was. Fifteen versions of the same chrome inside one product.

So I wrote a grammar. Every piece of the UI sits at exactly one of four levels:

Global. The shell that wraps every screen — logo, breadcrumb, search, and a side rail holding the values that change how the whole platform reads (ICP for Wealth Manager, Nivel de Riesgo for Wealth Planner). Not page actions. Not settings.

Page. Title and actions inline, never stacked — a reviewer once asked which line was the page when we stacked them.

Section. An H2 only earns its slot when a page actually has more than one section. Otherwise it's invented consistency.

Content. Tables, charts, filters — scoped to the level above them, never reaching up.

Naming the levels turned "this looks wrong" from a vibe into a lookup. The spine has held across both products — same skeleton, different content. That's the only kind of coherence worth defending.

*Full write-up, with the screens that broke each rule: [link]*

## Notes

- **Case-study tie:** "The four levels" section (global/page/section/content), "What broke that taught me each rule," and the closing line "Same skeleton, different content. That's the only kind of coherence worth defending."
- **Graphic concept (optional):** the four-level diagram from the case study (global rail → page header → section → content) reused as a static graphic, annotated with ICP / Nivel de Riesgo in the rail.
- **Skeletons used:** §17, §14, §3, §10, §9, §17, §5, §8, §7, §17.
