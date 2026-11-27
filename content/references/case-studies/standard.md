# The case-study standard (beats)

The house format for portfolioV2 case studies, set on the Wealth Planner study, 2026-11-27. It mixes the pace of [rows.gg](teardowns/rows-gg.md) with the substance of the studio teardowns (VML The Cocktail, Garaje de Ideas, see [anatomy.md](anatomy.md)), and shows work the way [visuals.md](visuals.md) describes. Reference implementation: `wealth-planner` in `src/lib/content/case-studies.tsx`.

## One sentence

A hero with two ways in (the demo, the story), then 6 to 8 beats, each one claim, one composed visual and two short paragraphs, ending on numbers.

## Page

| Part | What it holds | Rules |
|---|---|---|
| Title + tagline | Project name + one plain sentence on what changed | The tagline is the takeaway, not a slogan. |
| Meta | Role and contribution, small, right under the title | Role is one line ("Systems and UX/UI designer"). |
| Intro | What the product is, and what we did, in two sentences | Don't repeat it in the first beat. |
| Actions | **Enjoy the demo** and **Read the story ↓** | The demo is a first-class action. See "Demo" below. |
| Beats | 6 to 8, in the spine order below | One claim per beat. |
| Close | One sentence, then the demo action again | The last beat ends on a stats strip. |

## The spine (order of beats)

1. **Context** — what had just happened, who uses it, and how. No product description (the intro did it).
2. **The problem** — concrete and countable ("the results lived in five places"), with a numbered composition. Merge problems that share a cause.
3. **The question** — the design question the problem raised ("what if you never left the page?"). Separate from the problem: one is a fact, the other is a bet.
4. **Chapters** — 2 or 3, each a switch beat (`switch`) of related decisions: architecture, UI, AI, and so on. The chapter heading is the rule; each item is one decision with its before and after.
5. **Feedback** — a review or critique and what it changed. Name the collaboration.
6. **Result** — what shipped or is next, the misses, then a stats strip (`stats`).

## A beat

- **Label** (kicker): 10 px mono uppercase. "The problem", "Chapter 1 · Architecture".
- **Headline**: a full claim, about 8 words or fewer, sentence case, with a period. Read alone, the headlines tell the story.
- **Body**: two paragraphs, about 40 words each. First what was wrong, then what we did and why. Gloss product terms in another language once, in brackets.
- **Visual**: on the left, a composition on a quiet stage (`composition`). Never a crop of a screen.
- **Selector** (switch beats only): one row of tabs on top; it swaps the visual and the text. Never nest controls.

## Visuals

Follow [visuals.md](visuals.md). In code:

| Need | Media kind | Notes |
|---|---|---|
| Whole real components on a stage | `composition` | Items are live elements (`src` + the element's exact `rect` and the board's `viewport`) or element screenshots (`image`). The stage scales as one. |
| Where things were | `composition` + `marks` + `legend` | Numbered markers beside, not on, the text they point at. |
| A motion | `composition` + `play` | `"lab"`, `"case"` or `"reload"`. Plays once on screen, then ↺ Replay. |
| Before and after | two items labelled "The live product" and "Iteration N" | The before is always the shipped version. |
| Numbers | `stats` | 4 figures with short labels. |

**How to get the pieces:**
- **Live elements**: copy the Claude Design export into `public/work/<slug>/demo/` (the boards, `ds/`, `_runtime/` and the page scripts). Render each board at its canvas frame size (from `canvas.json`), measure the element with Playwright, and use its exact rect. The frame size usually already isolates one element.
- **Element screenshots** of a shipped version: Playwright at `deviceScaleFactor: 2`, `locator.screenshot()` or a clip of the element's exact box, so the component's own corners and edges are kept. Never cut a rectangle from a full screenshot.
- **Check every state headless** at 1440 px and 390 px, 2x, before calling it done. Nothing cut, nothing overlapping, no sideways scroll.

## Type and space (beats layout)

| Element | Size |
|---|---|
| Title | 28 / 32 px, medium, −0.03em |
| Meta, captions | 12 to 13 px, muted |
| Intro | 14 px, 1.6 |
| Switch-beat headline | 22 px |
| Beat headline | 17 px, medium, −0.025em |
| Beat body | 13 px, 1.55 |
| Text column | 260 px; visual takes the rest |
| Page column | 980 px, one left edge for the header and the beats |
| Between beats | 150 / 210 px |

## Demo

The demo opens at `/work/<slug>/demo`, full screen, with a "← Back to <project>" pill. Demos are open, with no password (Richard's call, 2026-11-27).

## Copy

- Voice: `voice-griner`. Substance check: `writing-substance`. Spanish: `afi-redaccion`, and mark new Spanish strings with `// TODO(afi-redaccion)`.
- "The live product", not an internal version number, in prose.
- Credit the team where the idea came from ("the team asked for…", "a teammate said…"). Leave blame out.
- Every number traces to the source (canvas notes, logs, the product). If it can't, it's a question for Richard, not a guess.

## Checklist before showing Richard

- [ ] Headlines alone tell the story.
- [ ] 6 to 8 beats; no repeat between the intro and the first beat.
- [ ] Every visual is a composition of whole components; the before is the shipped version.
- [ ] Every animation plays once on view and has Replay.
- [ ] Checked headless at 1440 and 390 px, 2x, every selector state.
- [ ] The page ends on numbers, then the demo action.
