---
title: "Same but different: a layout grammar for dense fin-tech"
pillar: process
status: published
created: 2026-06-08
tags: [design-systems, fintech, layout-patterns, wealth-manager, wealth-planner, coherence]
---

# Same but different: a layout grammar for dense fin-tech

I'm the sole designer at AFI, a fintech consultancy. Two of our products — **Wealth Manager** and **Wealth Planner** — serve the same kind of user: a financial advisor at a laptop, working through dense screens of tables, graphs, and configurators. The content is dense. But it isn't the content that makes the screens feel dense. It's everything around it.

Every page in **Wealth Planner** had its own header. Its own action placement. Its own way of breaking the body into sections. Some pages had tabs; others stacked a second title under the first. Some had filters above the table; some below. Same product, fifteen versions of the same chrome.

That's the trap with dense products. The body of every screen looks roughly the same — header, then *something*. So you assume the chrome is fine and pour your attention into the table or the chart. Iteration #14 lands. A new action needs to live somewhere. You're not sure where. You add it next to the last one you added. A month later nobody can guess where to look for it.

Nothing was defined. We had outlines — the *Cambios de Wealth Planner en 2026* doc, weekly working sessions with Oscar and Manu, the running thread on the *Coherence Wealth Planner* Figma — but no grammar. So I wrote one.

## The four levels

The spine is one rule: every piece of the UI sits at exactly one of four levels. Naming the levels is half the work. The other half is enforcing where things belong.

### Global

![Global level: logo and breadcrumb on the left, action cluster swapping on the right, side rail holding ICP and Nivel de Riesgo](/fintech-layout-grammar/01-global.svg)

The top of the platform. Logo and breadcrumb on the left, search in the middle, global actions on the far right. The side rail holds the configuration that binds *every* screen — for **Wealth Manager**, things like *ICP*; for **Wealth Planner**, *Nivel de Riesgo*. These aren't page actions. They aren't "settings." They're inputs that change how the whole platform reads.

Global lives in the rail because it isn't about any one page. If three different pages would all consult the same value, it's global. The action cluster on the right is the same slot for every screen, but its contents can vary by product context — that's the only thing about the global level that flexes.

### Page

![Page level: full-page mockup with the global shell faint at top, page header with inline actions, tab row below, and a content slot that morphs through a wide table, a narrow table, a line chart, and a 2-point graph](/fintech-layout-grammar/02-page-header.svg)

Below the global shell sits the page header. Page title on the left, page actions inline with it on the right. **Inline, not stacked.** Stacking the actions under the title was the first version. It read like there were two headers, and every reviewer asked "which one is the page?"

The lesson learned with Oscar and Manu: if you'd reach for a second title to disambiguate, reach for tabs instead. Two pages whose titles would be "Wealth Planner: Resumen" and "Wealth Planner: *Situación actual*" aren't two pages. They're one page with two tabs.

Below the page header sits the tab row. Tabs carry their own actions in the same way pages do — tab actions sit inline with the active tab label, scoped to that tab. The corollary is that a tab is just a smaller page. The rules at the tab level are the rules at the page level, one rung down.

Below the tab row sits the body, and the body holds whatever shape the work needs — a wide table with ten columns, a narrow table with four, a single line chart, a two-point graph, a form. The outer chrome never moves. The slot accommodates anything; the chrome doesn't bend to fit.

### Section

![Section level: two stacked variants. Left, a page with H2 plus three H3 subsections like Situacion actual. Right, a page with just H1 and a single table, no H2](/fintech-layout-grammar/03-section.svg)

This is where it gets interesting. A section is a chunk of the page body. Sometimes a page has one. Sometimes it has five. The grammar has to handle both without inventing a new pattern for each.

*Situación actual* in **Wealth Planner** has subsections — an overview block, then a breakdown by category, then a comparison. Each one earns an H3 under a single H2 ("*Situación actual*"). A graph page is the opposite: one section, one chart, no H2 at all because there's nothing to disambiguate. The page header is already the section.

The rule: an H2 only earns its slot when there's more than one section on the page. Otherwise the page header is the section header. The first time I wrote this rule out it felt like I was being permissive. It's the opposite — it's the strict version. Floating H2s on single-section pages are invented consistency, and invented consistency is noise.

### Content

![Content level: tab row with the active tab outlined, a filter pill row beneath it, then the table. A second tab shows a different filter row](/fintech-layout-grammar/04-content-filters.svg)

The lowest level. Tables, charts, forms — the thing the page is actually for. Filters live here, scoped to the tab they sit under. When you switch tabs, the filter row swaps. The page header doesn't filter. Tabs filter the content; content filters itself.

The columns of a table belong to the content level too — and they vary wildly. **Wealth Planner**'s *Situación actual* has a ten-column breakdown; a comparison view has four; a positions table has six. Same shape of work, different widths. The chrome above all of them is identical, which is how the user knows they're still in the same product.

## The rules I'm enforcing

The names give you a vocabulary. The rules give you a place to put each new thing without thinking about it twice.

- **One H1 per page, always the page header.** Page actions inline with it. If you want a second title, you want tabs.
- **Tabs replace title repetition.** If two routes would share a title with a noun appended, they're tabs. They're not two pages.
- **Sections only earn an H2 when there's more than one.** A single-section page is just H1 + content. No floating H2 to keep the layout "consistent" with multi-section pages — that's invented consistency, not real coherence.
- **Filters scope down, never up.** Tab filters can't reach the page chrome. Page actions can't reach the global rail. The arrows only point inward.
- **Global config never appears in page actions.** *ICP* and *Nivel de Riesgo* belong to the platform, not the screen. If they're in the page header, you've changed what they mean.

The reason these are short rules and not paragraphs: they need to fit in a programmer's head when they're wiring a new screen at 4pm on a Thursday. *Where does this action go?* gets a one-sentence answer.

## What broke that taught me each rule

I didn't sit down and design the grammar in one pass. Each rule came from a screen that wasn't working, usually pointed out by a principal dev wiring it up.

The page-header rule came from the **Wealth Planner** *Situación actual* rework. The page had a title, then a sub-header, then a tab row, then a section title — four pieces of chrome stacked on top of each other before any real content appeared. Manu opened the page on a Tuesday and asked which line was the page. He couldn't guess. That's the moment "stacked actions" became "inline actions" and the sub-header collapsed into a tab.

The action-placement rule has its own history. Page actions used to live *below* the tab row, sitting between the tabs and the body. It looked tidy in mockups. In practice, it made the actions read as tab-scoped when they were page-scoped — devs kept wiring them to the wrong handler. Moving them up into the page header, inline with the title, made the scope obvious without anyone having to think about it. The rule fell out of fixing a bug we kept introducing.

The tabs-replace-titles rule came from a duplicated screen pair that lived for a month before anyone noticed. Two pages, near-identical chrome, only the content slot underneath was different. We almost added a third one. Oscar pointed out it had been tabs the whole time — we'd built three pages because the routing scaffold was page-shaped, not tab-shaped. The fix was structural: one route, three tabs, one filter row that changes with the tab.

The sections-only-when-plural rule came from a chart page where I'd added an H2 that read "Resumen" because the multi-section pages had H2s. The H2 wasn't telling the reader anything the page header didn't already say. The page header *was* "Resumen." Once I cut the H2, the page felt taller, the chart had more room, and nothing was missing — because nothing had ever been there.

I'm not done finding rules. There's still a question about where annotations live — when an analyst leaves a comment on a section, is the comment part of the section or part of the page? I'm watching to see which way it breaks.

## How a programmer consumes this

The grammar's job is to answer questions in a sentence. A dev wiring a screen shouldn't read this article — they should read the rules.

- *Where does this action go?* If it changes a single screen, page actions. If it changes a single tab, tab row. If it changes the whole platform, global rail.
- *Should this page have tabs?* If two pages would share a title with a noun appended, yes.
- *Should this section have an H2?* If the page has more than one section, yes. Otherwise no.
- *Where do the filters go?* Under the tab they belong to. Never the page.

Each slot is named — `page-header`, `page-actions`, `tab-row`, `section-h2`, `tab-filters`, `global-rail`. The names match between Figma and the codebase. When the names match, "this looks wrong" stops being a vibe and starts being a lookup. *That action shouldn't be in `page-actions` — it belongs in `global-rail`.* Coherence is enforceable when you can point at the right slot.

## What I'd tell the next designer walking into a dense product

- **Name the levels before you name the components.** A button is a button. *Where* the button goes is the system. The level it sits at decides what it means.
- **Resist invented consistency.** A floating H2 on a single-section page looks like consistency on the surface. It's noise. The real consistency is that single-section pages have one shape, multi-section pages have another, and both are predictable.
- **Write the rules so a programmer can quote them.** "One H1 per page" beats "headers should be hierarchical." A rule a dev can ship is worth ten principles they have to interpret.
- **Watch for the chrome creeping in.** Dense products don't fail because the table is bad. They fail because every page bolts an extra row of chrome on top, and nobody's keeping score.

The grammar isn't done. Tabs and sections are stable; annotations, modals, and inline configuration are still up for grabs. The spine — global, page, section, content — has held across both **Wealth Manager** and **Wealth Planner**. Same skeleton, different content. That's the only kind of coherence worth defending.

---

*Working on a dense product that's drifted? [Say hi](mailto:richardgrinerdesigns@gmail.com) — always up for a chat about layout patterns and design-system grammar.*
