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

- **No eyebrow.** No all-caps or mono label above the headline, and no "Chapter 1" numbering: it reads as AI-made (Richard, 2026-11-27). `kicker` may stay in the data for the side nav; it is not shown. Labels inside visuals are sentence case too ("Before the review").
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
| A motion | `composition` + `play` | `"lab"`, `"case"`, `"reload"` or `"click"`. Plays once on screen, then ↺ Replay. |
| Before and after | two items labelled "The live product" and "Iteration N" | The before is always the shipped version. |
| Numbers | `stats` | 4 figures with short labels. In a beat the cells are opaque and the dividers are borders, so dark mode shows no light lines or corners. |
| Something to use | `embed` of a portfolio board (`PF-*.html`) | Rebuild the controls from the product's own design-system bundle (React components, not a screenshot) on a page with a transparent background and `color-scheme: light`. In a beat the embed is drawn frameless with no link, so the pieces sit on the stage like any component. Size the frame to its content; a dropdown leads, so its list opens over the parts below and nothing is cut. |
| Try the product | `embed` of the real screen, cut down | Copy the prototype board and hide (CSS, `display: none`) everything but the one or two components the beat is about. They stay live, so the calculation still runs. Never a full screen shrunk into the column. |

**Corners and padding (one standard for every visual):**

| Part | Rule |
|---|---|
| The card | One light surface, `#eef1f4`, the same in both themes. Nothing frames it again inside. The dot cursor is navy on it (`data-cursor-ink`). |
| Stage padding | 28 px on every side (`STAGE_PAD`). The stage fits its pieces, so the air is the same on all four sides. The legend and caption use the same 28 px. |
| A piece | Either a whole component with its own edge (a card, a drawer, a toast), or a **panel piece**: the component plus 16 px of its own panel on every side, white, corner 12 px. Never a component on a cut rectangle of its page. |
| Corners | The component's own radius. When pieces in one visual are drawn at different scales, set `radiusFrom` so they share one radius on screen. |
| Gaps | The same gap between every piece in a visual, about 3% of the stage width. A label above a piece takes 22 px of it. |
| Edges | No board background, scrollbar or neighbouring element shows at a piece's edge. The stage hides the boards' scrollbars; check with classic scrollbars on (Playwright `ignoreDefaultArgs: ['--hide-scrollbars']`). |
| Replay | In its own band under the pieces, never over them. |
| Motion a person starts | `play: "click"` with `playClick` presses the real control (opening a row). Replay reloads the board and presses it again. |
| Tabs | A switch beat's stage eases to each tab's own height. It never keeps the tallest tab's height, which leaves a small component floating in an empty box. |
| Dark artboards | A self-framed dark player (a flow, an audit) takes the stage padding only, not a second light box inside the stage. |

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

## Card thumbnail

The home and Projects card for a case study is a looping clip of one component on a flat stage (`card_<lang>_<theme>_thumb.mp4`, 720 or 1080 px square).

- **Record, don't recolour.** Record the real board straight onto each theme's stage: light `#eef0f2` (or the board's own light stage) and dark `#10181d`. Recolouring a finished light clip leaves a light edge.
- **One component, whole.** The part of the product the study is about (the Resumen hero, the plan card, the Panel with its side panel). Never a crop that cuts a page.
- **Open clean.** If the product's first frames are a grey blur or a blank page, start on the first drawn frame and add a short blur-in on the stage colour.
- **Fit any tile.** Set `stage: { light, dark }` on the work item to the clip's stage colours. The card then fits the clip whole and paints the rest of a tall or wide tile in that colour.

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
- [ ] No full-screen recordings or screenshots in a beat: components, a cut-down live screen, or a rebuilt board.
- [ ] The card thumbnail is recorded per theme and has `stage` set, so it fits tall and wide tiles.
- [ ] Every animation plays once on view and has Replay.
- [ ] Checked headless at 1440 and 390 px, 2x, every selector state.
- [ ] The page ends on numbers, then the demo action.
