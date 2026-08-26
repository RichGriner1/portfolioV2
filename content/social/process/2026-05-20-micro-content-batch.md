---
title: "Micro-content batch — May 20, 2026"
source: granola (local, 2026-05-20)
pillar: process
stance: builder
status: draft
created: 2026-05-20
posted_at:
typefully_ids:
  linkedin:
  twitter:
---

# Micro-content batch — May 20, 2026

Six angles drawn from today's two Granola sessions in the Processes folder. Each one ties to a case study so the LinkedIn post points to longer work on the portfolio.

Pick the strongest for tonight's 6pm slot. The other five queue for the next five days.

If you want to weave any of these into the Afi case study itself rather than (or as well as) post them: ideas **1, 2, and 4** are the strongest additions to the existing bento cards. **3, 5, 6** are pure process-pillar nuggets — they belong on the portfolio's process feed, not inside Afi.

---

## 1. The logo is a component now, not a folder

### One-line
We stopped shipping SVG logo files. The logo is a coded component.

### Graphic concept (15-min Figma)

2×2 grid of the same Afi mark:

|  | Light mode | Dark mode |
|---|---|---|
| **Color** | AzulProfundo (`brand/primary`) | azulafi (`brand/primary`) |
| **Monochrome** | black (`fg/default`) | white (`fg/default`) |

Below each tile, the semantic token name driving it. Around the grid, the playground UI from today's build — toggle for *icon* vs *icon + wordmark*, toggle for *brand* vs *monochrome*, size dropdown. Background blocks of `base.white` and `base.black` so contrast is obvious.

Caption strip at the bottom: *"One file, four variants. The token picks the right one."*

### Case-study tie
Afi → **Token Architecture** (tier-3 custom semantics: same role, two palettes, the mode picks the right one) and **White-label at Scale** (every client swaps through the same mechanism).

### LinkedIn
> We stopped shipping SVG logo files. The logo is a coded component.
>
> Old way: designer exports the bank's logo in six sizes, light and dark, color and monochrome. Developer imports the right file per surface. Brand updates, repeat for every size.
>
> New way: one SVG component, two semantic tokens. The color variant stays on brand. The monochrome variant switches white or black with the mode. Sizes are a CSS variable, not a separate file.
>
> This stripped a folder of 20+ exports down to one component. For a white-label fintech consultancy this matters double — every client's brand goes through the same swap mechanism. New bank, same component, different tokens.
>
> The cleanup wasn't the point. The point is the next client. The system earns its keep when remakes compound instead of starting from scratch.
>
> Wrote up the wider token system on the Afi case study → [link]

### Twitter
> 1/ We stopped shipping SVG logo files. The logo is a coded component now.
>
> 2/ Old way: export six sizes, light + dark, color + monochrome. Engineer imports the right file per surface. Brand updates, repeat for every size.
>
> 3/ New way: one SVG component, two semantic tokens. Color variant stays on brand. Monochrome variant switches white/black with the mode. Size is a CSS variable, not a separate file.
>
> 4/ Stripped a 20-file folder down to one component. For a white-label fintech it matters double — every client's brand swaps through the same mechanism.
>
> 5/ Cleanup wasn't the point. The next bank is. Full case study: [link]

---

## 2. AI is fast. The system is what makes it compound.

### One-line
AI lets you ship a screen in a morning. The system stops your eleventh screen from contradicting your fourth.

### Graphic concept (20-min Figma)

Two-line velocity chart.

- **Line A — "Solo + AI"**: steep climb, then flatlines around screen 10–15 as rework starts. Annotations at the inflection: *"reconciling tokens"*, *"renaming components"*, *"rewriting demos"*.
- **Line B — "System + AI"**: slower opening curve, no flatline, keeps climbing past screen 30.

X-axis: screens shipped. Y-axis: consistent surfaces.

Hand-drawn feel, not a Tufte chart — this is a vibe graphic, not a data point.

### Case-study tie
Afi → **Unified Design Platform** + **Token Architecture**. KT360 → **Rules as Files**. Both case studies are about exactly this trade-off.

### LinkedIn
> AI lets you ship a screen in a morning. The bottleneck I worry about now is the eleventh screen contradicting the fourth.
>
> That's where the system pays back. Tokens before screens. Components before patterns. A rulebook the AI reads before it writes a line.
>
> At Afi we have 87 primitive tokens, 39 semantic numbers, and 22 component-level overrides. They live in Figma and they live in design.md. A coding agent reading that file knows to put AzulProfundo on the action slot in light mode and azulafi in dark, because the rule names the palette, not the role.
>
> At KT360 the same idea, different shape — brand rules and animation patterns live as files an agent can check work against. The marketer writes a blog, the developer adds a page, the output looks like it came from the same hand.
>
> Slow opening. No flatline. Both write-ups on the portfolio → [link]

### Twitter
> 1/ AI lets you ship a screen in a morning. The system is what stops your eleventh screen from contradicting your fourth.
>
> 2/ Tokens before screens. Components before patterns. A rulebook the AI reads before it writes.
>
> 3/ At Afi: 87 primitives, 39 semantic numbers, 22 component-level overrides. Documented in design.md so the agent puts the right blue in the right slot.
>
> 4/ At KT360: brand rules and animation patterns as files an agent checks before shipping. Marketer writes a blog, developer adds a page, output reads the same.
>
> 5/ Slow opening. No flatline. Both case studies: [link]

---

## 3. Hide, don't delete. Audit as you go.

### One-line
When I refactored the component library this week, I didn't delete the old components. I hid them.

### Graphic concept (10-min Figma)

A mock of the component sidebar split in two:

- **Active**: Logo
- **Hidden** (greyed out, with a small "eye-off" icon): Button, Input, Select, Checkbox, Switch, Tabs

A "show hidden" toggle above. Caption underneath: *"The audit reveals itself when you reach for the next screen."*

If you want to make it move: a tiny animation where one of the hidden items slides back into "active" when the cursor reaches a screen that needs it.

### Case-study tie
Process-pillar nugget. Doesn't slot directly into Afi or KT360 — belongs in a "How I refactor" write-up on the process feed.

### LinkedIn
> When I refactored the component library this week, I didn't delete the old components. I hid them.
>
> Two reasons. First, the old work tells you what your team was actually doing — keep it long enough to learn from. Second, deleting before the replacement exists is how you find out your "unused" component was holding up a demo.
>
> The flow: hide it off the sidebar. Get to a screen that needs that pattern. Look at the existing code and decide — keep, edit, rewrite. Build forward from there.
>
> It's an audit you do while shipping, not a separate exercise. Saved me from rewriting three primitives I'd already gotten right.
>
> Process write-up coming on the portfolio.

### Twitter
> 1/ Refactoring the component library this week. Didn't delete the old components. Hid them.
>
> 2/ Two reasons. The old work tells you what your team was doing — keep it long enough to learn. And deleting before the replacement exists is how you find out the "unused" component was holding up a demo.
>
> 3/ Flow: hide it. Reach the next screen. Look at the code. Keep, edit, or rewrite. Build forward.
>
> 4/ Audit you do while shipping. Saved me from rewriting three primitives I'd already gotten right.

---

## 4. Build the design system before AI builds with it.

### One-line
I gave the AI a button, input, select, checkbox, switch. Then I asked it to build a screen and it ignored every one of them.

### Graphic concept (20-min Figma)

Flowchart in two strips, stacked.

- **Top strip (red X at the end)**: *Components built* → *AI asked to ship* → *AI writes from scratch*. Subhead: "Clean code, wrong components."
- **Bottom strip (green check at the end)**: *Components built* → *Rule written (AGENTS.md)* → *AI asked to ship* → *AI uses the library*. Subhead: "Same speed. System intact."

Or if you want a different angle: a tiny org chart with *AI* sitting under *Developers* with the caption *"It joined the team. Give it what you'd give a new hire."*

### Case-study tie
Afi → **AGENTS.md / CLAUDE.md / Unified Design Platform**. KT360 → **Rules as Files**. The strongest tie of the six — both case studies are this idea, shipped.

### LinkedIn
> I gave the AI a button, an input, a select, a checkbox, a switch. Then I asked it to build a screen and it ignored every one of them.
>
> I'd built the primitives. I hadn't written the rule that said "use them." So the agent wrote the screen fresh — clean code, wrong components.
>
> AI is another developer joining the team. It needs the same library a human dev would need and the same documentation pointing at it. Without that, it builds from scratch every time and the system you spent a week on goes uncited.
>
> Two things changed it.
>
> A rulebook the agent reads first. At Afi it's AGENTS.md at the repo root: current focus, where things live, anti-patterns. CLAUDE.md is a one-line redirect so every tool — Claude Code, OpenCode — starts from the same page. At KT360 the same idea, different files.
>
> And components actually fit for an agent to consume — built before the demo, not during it. If the playground exists and the doc names the slot, the AI uses what's there.
>
> The boring half is what earns the speed. Write the rule. Build the library. Then let the agent move fast.
>
> Full case study on how this looks at Afi → [link]

### Twitter
> 1/ I gave the AI a button, input, select, checkbox, switch. Asked it to build a screen. It ignored every one of them.
>
> 2/ I'd built the primitives. I hadn't written the rule that said "use them." Agent wrote the screen fresh — clean code, wrong components.
>
> 3/ AI is another developer joining the team. It needs the same library a human dev needs, and the same docs pointing at it.
>
> 4/ Without the rulebook, it builds from scratch every time. The system you spent a week on goes uncited.
>
> 5/ Two things changed it. AGENTS.md at the repo root — focus, where things live, anti-patterns. CLAUDE.md as a one-line redirect so every tool starts at the same page.
>
> 6/ And components built before the demo, not during it. If the playground exists and the rule names the slot, the AI uses what's there.
>
> 7/ The boring half is what earns the speed. Write the rule. Build the library. Then let the agent move fast. Full case study: [link]

---

## 5. AI can't visit a website. It can read code.

### One-line
AI can't visit a website and dissect its animation. It can read code.

### Graphic concept (15-min Figma)

Three-panel comic strip.

1. Browser window with a smooth tab-slide animation, speech bubble: *"look at this 🎨"* — AI face: blank.
2. Open-source repo open, code snippet visible (label it *animata.design* or similar) — AI face: lit up.
3. Same animation, now wearing Afi's color tokens. Caption: *"Translation, not invention."*

Cleaner alt if you don't want to draw: side-by-side code diff. **Left**: React snippet from Animata. **Right**: Angular component, same logic, Afi token names. Arrow between them labelled *"AI translates."*

### Case-study tie
KT360 → animation patterns as code-readable rules. Afi → motion tokens applied to ported components (the sliding-pill tab on the Patrimonio page came from exactly this flow).

### LinkedIn
> AI can't visit a website and dissect its animation. It can read code.
>
> The workaround: find an open-source library that already nailed the interaction — Animata, Aceternity, Magic UI — and hand the agent the actual source.
>
> The job stops being "build me a sliding-pill tab" and becomes "take this React snippet, port it to Angular, use these spacing tokens." That's a translation job. Translation is what AI is good at.
>
> This week: a sliding-pill tab pulled from an open-source React example, refactored into our Angular component, swapped to use Afi's motion tokens. Same animation everyone admires, and now it belongs to our system.
>
> Cross-stack borrowing is a thing again. Angular teams used to watch React-only libraries from the sidelines and wait for someone to rebuild it. The wall moved.
>
> Two upshots. Brand cohesion gets stronger because the borrowed animation is wearing our tokens. And the team gets to pick from a wider menu of references instead of inventing motion from a static Figma frame.
>
> Process post coming on the portfolio.

### Twitter
> 1/ AI can't visit a website and dissect its animation. It can read code.
>
> 2/ Workaround: find an open-source library that already nailed the interaction — Animata, Aceternity, Magic UI — and hand the agent the actual source.
>
> 3/ Job stops being "build me a sliding-pill tab." Becomes "take this React snippet, port it to Angular, use these spacing tokens." Translation job. AI is good at translation jobs.
>
> 4/ This week: sliding-pill tab from an open-source React example, ported to our Angular component, wearing Afi's motion tokens. Same animation, now ours.
>
> 5/ Cross-stack borrowing is a thing again. Angular teams used to watch React-only libraries from the sidelines. The wall moved.

---

## 6. Record yourself making decisions.

### One-line
A friend who got a job at Meta told me he wishes he'd written down every decision he made. Not the big ones. The tiny ones.

### Graphic concept (15-min Figma)

A vertical "decision stack" — three or four thought bubbles in a column, each linked to a small artifact below it.

- *"Why this animation curve?"* → tiny code block showing the easing token
- *"Why this token name?"* → a Figma variable panel snippet
- *"Why hide instead of delete?"* → a sidebar mock
- *"Why segmented control over tabs here?"* → a tab vs segmented-control comparison

Caption at the bottom: *"Micro-decisions are where the craft is. Most of them leak out of memory by Friday."*

### Case-study tie
The practice underneath every case study. Doesn't slot into a specific bento card — it's the meta-process that makes the case-study writeups possible at all.

### LinkedIn
> A friend who got a job at Meta told me he wishes he'd written down every decision he made. Not the big ones. The tiny ones.
>
> The big decisions are easy to retell — the pivot, the redesign, the kill. The small ones are where the craft is. Why this curve. Why this spacing. Why a segmented control instead of tabs in this one spot. They leak straight out of memory by Friday.
>
> I started recording every working session in Granola. Talk through what I'm doing while I do it. End of day, the transcript is a stack of micro-decisions with reasons attached.
>
> It's the source material for case studies, for the portfolio, for explaining process to a hiring panel, for posts like this one. The micro-decisions are also what compounds — the patterns I keep reaching for show up in the transcript before I've noticed I'm reaching for them.
>
> Designers struggle to articulate their value because most of the value is in choices nobody saw them make. The recording is how you make them visible.
>
> Long-form coming on how this feeds straight into the case-study writeups.

### Twitter
> 1/ A friend who got a job at Meta told me he wishes he'd written down every decision he made. Not the big ones. The tiny ones.
>
> 2/ Big decisions are easy to retell — the pivot, the redesign, the kill. The small ones are where the craft is. Why this curve. Why this token. Why segmented control over tabs here.
>
> 3/ They leak out of memory by Friday.
>
> 4/ Started recording every working session in Granola. End of day, the transcript is a stack of micro-decisions with reasons attached.
>
> 5/ Source material for case studies, portfolio, interviews, posts like this. The recording is how invisible choices become visible.

---

## Today's pick

For the 6pm slot tonight, **idea #4** ("Build the design system before AI builds with it.") is the sharpest of the six. Concrete failure (you ignored every component I built), concrete fix (rulebook + ready library), real case-study tie (AGENTS.md at Afi, Rules-as-Files at KT360), strong opinion that lands. If you ship one tonight, ship that one.

**#1** is the strongest *visual* candidate — the 2×2 logo grid is the kind of graphic that survives the LinkedIn crop. Save it for the day you have 20 spare minutes in Figma.
