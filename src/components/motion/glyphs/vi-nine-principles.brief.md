---
slug: vi-nine-principles
project: Afi Visual Identity — "Nine principles" card
concept: scan
created: 2026-08-09
status: brief
---

# Afi Visual Identity — "Nine principles" — motion brief

This is one card inside the `visual-identity` bento (`src/lib/content/case-studies.tsx`),
not the whole case study — the hero grid/instrument piece already has its own brief at
`visual-identity.brief.md`. This is a single-card animation for
`src/components/case-study-bento.tsx`.

## Direction change

Richard saw the first draft of this brief (a tile-hardening concept — nine marks settling
into a grid) and replaced it with his own image: **research papers going through a
scanner, and the principles come out.** The research is real — the Modern UI benchmarks,
competitor notes and reference PDFs that preceded the principles are the same research the
"Defining modern" card (`animation: "guideline"`) already references. This brief is a full
rewrite around that image. The concept and the rest/active rhythm are his; the visual
vocabulary and choreography below are my craft calls, flagged where I made a judgment call
rather than a fact.

## Craft calls (flag to override)

- **Three papers, not one, not nine.** The task names three real research inputs —
  benchmarks, competitor notes, reference PDFs. I mapped that literally: three paper
  elements, one pass each, rather than one generic "paper" standing in for all research, or
  nine individual sheets (one per principle, which would make the scanner a 1:1 photocopier
  rather than a synthesis — the real story is a handful of dense documents distilling into
  more, sharper findings than went in).
- **Each pass yields exactly three chips (3 papers × 3 = nine).** This is where "nine"
  comes from, visibly: each research document is read once and produces a row of three
  findings in the final grid. **Flag:** this 3-per-paper mapping is my invented structure,
  not a transcription of which specific finding came from which document.
- **The avoid-list survived, reshaped to fit.** Per pass, 2 of the 3 findings are
  affirmative ("do") and land filled; 1 is a boundary ("avoid") and lands hollow — always
  the third/last chip of that pass, so it consistently occupies the grid's right column
  (slots 3, 6, 9). I kept it because it's true to how research actually reads: competitor
  notes and benchmarks alike tend to surface both "adopt this" and "don't do that" in the
  same sitting, not one document that's all warnings. I did not force an even split or a
  scattered position the way the previous draft did — a dedicated column reads as an
  intentional part of the table's grammar (findings, then their own caveat) rather than a
  quarantined corner. **Flag:** if this pattern reads more like "the third result is always
  the reject" than "every source has its own boundary," override the column rule for a
  scattered placement instead.
- **The three papers are visually near-identical** (same rect, same treatment, only a small
  hand-set variance in tilt and internal line pattern — see below). I didn't attempt to
  visually distinguish "a benchmark" from "a competitor note" from "a PDF" — that pushes
  toward literal iconography (folders, badges, a PDF logo) at a scale where it can't read
  cleanly, and the instruction is abstraction over illustration. Their distinctness is
  carried by sequence (first pass, second pass, third pass; first row, second row, third
  row), not appearance.

## Concept

**Verb:** scan
**Metaphor:** Three real research documents — the Modern UI benchmarks, the competitor
notes, the reference PDFs — feed one at a time through a fixed scan line and dissolve
exactly where they cross it; what comes out the other side isn't a copy of the page, it's
the findings pulled from it — mostly things to do, and, from every single pass, one thing
not to.

One aside, not a fourth shape: the first principle this card actually names — *show the
essential first, reveal detail when asked; keep the user where they are* — is also how the
card behaves. The glyph is the essential (nine findings, resolved); the popup this card
opens on click is the "ask." No separate motif needed for that one — the card face already
performs its own first principle.

## Visual vocabulary

- **Paper** — a small rounded rect (`rounded-[2px]`, crisp corners — a raw cut sheet, not a
  soft finished token), portrait-ish proportions, holding 3–4 short internal strokes at
  uneven lengths (dense, unstructured notes). `border-muted-foreground` + matching
  `bg-muted-foreground` strokes, ~0.45–0.5 opacity throughout its life — it never resolves,
  it dissolves. No folded corner, no drop shadow, no page-curl, no literal "PDF" badge —
  abstraction over illustration, same rule the rest of this case study's glyphs follow.
- **The beam** — a stationary vertical hairline, full height of the animation's action
  zone, fixed at roughly 35–40% across the frame. Papers travel through it; it does not
  travel. Resting: `bg-muted-foreground`, ~0.3 opacity — a dim, constant architectural
  presence, there whether or not anything is scanning right now. Active: brightens to
  `bg-foreground` (or `bg-primary` — pick whichever reads better against `bg-card` at this
  scale), opacity 1, for the brief window each paper is crossing it, then relaxes back. No
  glow, no gradient, no blur — a bright rule, not a sci-fi scan effect (same constraint the
  hero piece's instrument line already holds itself to).
- **Chip** — a small rounded square (`rounded-[4px]`, softer than the paper's corner — a
  finished token, not a raw sheet), pure geometry, no internal marks. Filled
  (`bg-primary`, full opacity) = a principle to follow. Hollow (`border-foreground`, no
  fill) = a principle to avoid — the same shape's own negative space standing for the thing
  that didn't get built. Nine total, fixed count, accumulating into a 3×3 grid, one row per
  paper. No `--destructive` anywhere in this piece: an "avoid" is a boundary the team chose
  on purpose, not an error being caught — that's `RulesAnimation`'s job on a different card,
  not this one's.
- **Density:** 3 papers → 3 passes → 9 chips, 6 filled / 3 hollow (2:1 per pass). No new
  tokens required — `bg-primary`, `bg-foreground`/`border-foreground`,
  `bg-muted-foreground`/`border-muted-foreground` are all already in use elsewhere in
  `case-study-bento.tsx`.

### Layout zones (relative proportions — this is a responsive card face, not a fixed canvas)

Single shared horizontal lane, vertically centered, left to right:

| Zone | Width | Contents |
|---|---|---|
| Input lane | ~30–35% | One paper at a time travels this lane, left to right |
| Beam | a hairline, ~35–40% across | Stationary; papers dissolve exactly here |
| Output grid | remaining ~55–60% | 3×3 grid of chips, fills in one row per pass |

All three passes share this one lane and one crossing point — only the destination row in
the grid changes between passes (row 1 fans slightly up-right, row 2 goes straight across,
row 3 fans slightly down-right from the same crossing point). One lane, one beam, three
rows — not three separate lanes stacked, which would cost three times the vertical space
this card doesn't have.

### Grid slot table (final resolved frame, reading order 1–9, row-major)

| Slot | From pass | Role |
|---|---|---|
| 1 | paper 1 (benchmarks) | do |
| 2 | paper 1 | do |
| 3 | paper 1 | **avoid** |
| 4 | paper 2 (competitor notes) | do |
| 5 | paper 2 | do |
| 6 | paper 2 | **avoid** |
| 7 | paper 3 (reference PDFs) | do |
| 8 | paper 3 | do |
| 9 | paper 3 | **avoid** |

### Per-paper hand-set variance (deterministic, small — texture, not noise)

| Paper | Tilt at rest/travel | Internal strokes (relative widths) |
|---|---|---|
| 1 — benchmarks | −6° | 85%, 60%, 90%, 40% |
| 2 — competitor notes | +5° | 70%, 95%, 50% |
| 3 — reference PDFs | −4° | 55%, 80%, 35%, 75% |

A paper keeps its tilt for its entire trip — it never straightens. That contrast (tilted,
uneven paper vs. perfectly upright, axis-true chips) carries the "structure gets pulled out
of the mess" idea on its own; nothing needs to animate rotation back to zero.

**Containment:** the paper's travel path and the chip grid must both stay inside the card
face at every breakpoint — verify at 320/375/390px with `npm run check:responsive`, not
just desktop. This repo has shipped card-overflow bugs that only showed up below 768px
before (see `AGENTS.md`).

## Choreography

1. **At rest (idle, `active=false`).** The finished frame: 9 chips sit in the 3×3 grid, 6
   filled (`bg-primary`, slots 1/2/4/5/7/8) and 3 hollow (`border-foreground`, slots
   3/6/9). No papers on screen. The beam sits at its dim resting state — present, inactive.
   Zero motion. This is "the nine principles, already formed" — what a visitor sees without
   touching anything, matching the idle contract of every sibling animation in this file
   (`RulesAnimation`, `LayersAnimation`, `GuidelineAnimation`).

2. **On trigger (hover, `active=true`; mobile auto-cycles the same prop).** Loops, replaying
   all three passes from an empty grid each time:
   1. **Paper 1 enters.** Fades/slides in near the input lane's left edge (small travel,
      not a long off-canvas slide), at its −6° tilt, `--duration-base`, `--ease-out-soft`.
   2. **Paper 1 travels to the beam.** `--duration-slow`, `--ease-in-out-soft`, tilt
      unchanged.
   3. **Crossing.** The paper dissolves right at the beam (opacity 1→0, scale ~1→0.85,
      `--duration-base`, `--ease-out-soft`) while the beam briefly brightens
      (`--duration-fast` up, hold, `--duration-fast` back down). Concurrently, 3 chips
      originate from the crossing point and travel out to slots 1, 2, 3, staggered ~80ms
      apart, `--duration-slow` each, `--ease-in-out-soft`. Slots 1 and 2 crossfade in their
      `bg-primary` fill as they land; slot 3 arrives as a firm outline, no fill, same
      timing, no fill ever appearing.
   4. **Beat.** ~200ms, nothing moves.
   5. **Paper 2, then paper 3** repeat steps 2.1–2.4 in the same lane, filling grid rows 2
      and 3 the same way. On the very last chip of the very last pass (slot 9), add one
      small confirm-pulse (scale 1 → 1.03 → 1, `--duration-fast`, `--ease-spring`) — the
      single moment of overshoot in the whole piece, placed on purpose at the true
      completion point: the grid isn't done when the list is filled, it's done when the
      list's own boundary lands too.
   6. **Hold.** Full grid, 6 filled + 3 hollow, ~1.0–1.1s. Let it be seen.
   7. **Loop.** All 9 chips fade out together (quick, ~`--duration-base`, `--ease-out-soft`,
      slight optional stagger), beam returns to resting dim, and the sequence repeats from
      2.1, for as long as `active` stays true.

3. **Return to rest.** The instant `active` goes false — hover-out, or mobile's window
   flipping back to idle — skip whatever mid-loop phase is showing and cut directly to the
   resolved frame in step 1. No animated reverse; matches the immediate-reset pattern
   already used by `RulesAnimation` / `LayersAnimation` / `GuidelineAnimation` in the same
   file.

## Timing

- **Duration:** paper entrance `--duration-base` (200ms); paper travel-to-beam
  `--duration-slow` (320ms); paper dissolve `--duration-base` (200ms); chip travel
  `--duration-slow` (320ms) each; beam brighten/relax `--duration-fast` (120ms) each way;
  confirm-pulse `--duration-fast` (120ms).
- **Easing:** `--ease-in-out-soft` for all travel (paper and chips) — this is documents
  being read and findings being drawn out, a methodical process, not a flashy trick.
  `--ease-out-soft` for fades/dissolves. `--ease-spring` reserved for exactly one moment:
  slot 9's confirm-pulse, closing out the whole grid. Never spring on the main travel.
- **Stagger:** ~80ms across each pass's 3 chips; ~200ms pause between passes.
- **Rhythm:** hover-triggered loop (desktop hover, mobile auto-cycle via the existing
  `mobileVariant` mechanism in `BentoCardItem`) — not scroll-linked, not an idle loop at
  rest, matching this file's card-animation contract. Total single pass ≈ 5.5s (three
  ~1.4s passes + a ~1s hold + a short reset). `LayersAnimation` in this same file already
  runs a ~4.75s cycle against the mobile auto-cycle's ~2.2s "hover" window, so a loop this
  length is already normal here — not flagging it as something to compress.
- **Reduced motion:** render the step-1 resolved frame (9 chips, no papers) permanently;
  skip the hover loop entirely. `case-study-bento.tsx` doesn't check
  `prefers-reduced-motion` anywhere today — this is the first animation in that file that
  needs to. See hand-off note.

## Hand-off note to code-writer

This brief lives at `src/components/motion/glyphs/vi-nine-principles.brief.md` by
instruction, but **the implementation does not belong in `motion/glyphs/`** — that
directory's `.tsx` convention (standalone SVG, `viewBox 0 0 64 64`, `{ isHovered? }`) is for
the homepage `GlyphKey` system (`src/lib/content/work.ts` → `motion/glyphs/index.ts`), which
this card does not use. The real target is `src/components/case-study-bento.tsx`:

- Add `function VINinePrinciplesAnimation({ active }: AnimationProps)` directly in
  `case-study-bento.tsx`, near `RulesAnimation` (the function this card currently borrows
  and is being detached from) — plain `motion.div` + Tailwind classes, matching
  `RulesAnimation` / `LayersAnimation` / `GuidelineAnimation`'s own style in that file. Not
  an SVG viewBox composition; not a new file — every animation in that file except the four
  figure-wrapping `vi-*` adapters lives inline, and this one isn't wrapping a pre-built
  figure.
- Props are `{ active: boolean }` (the `AnimationProps` type already declared at the top of
  `case-study-bento.tsx`), not `{ isHovered? }`.
- Register it in the `ANIMATIONS` map (same file) under the key `"vi-nine-principles"`.
- Add `"vi-nine-principles"` to the `animation?:` union in `BentoCard`
  (`src/lib/content/case-studies.tsx`), in the "visual-identity only" block alongside
  `vi-moodboard` / `vi-type-test` / `vi-components` / `vi-micro`.
- Change the "Nine principles" card's `animation: "rules"` (currently ~line 567 in
  `case-studies.tsx`) to `animation: "vi-nine-principles"`. Leave kt360's own
  `animation: "rules"` card (its "Brand rules" card, ~line 734) and `RulesAnimation` itself
  untouched — this brief only detaches "Nine principles" from it.
- Layout: the single shared lane + beam + 3×3 grid described above, capped at a small fixed
  max-width (roughly 130–150px) and centered (`mx-auto`) so it reads as a compact,
  roughly-4:3 block inside the existing `min-h-[120px]` card face rather than stretching to
  fill it. Confirm at 320/375/390px with `npm run check:responsive` before calling it done —
  see the containment note above.
- Colors: `bg-primary`, `bg-foreground`/`border-foreground`,
  `bg-muted-foreground`/`border-muted-foreground` only — all already in use elsewhere in
  this same file (`RulesAnimation`, `LayersAnimation`, `PulseAnimation`). No new tokens, no
  hex, no `--destructive`.
- Motion primitives only: `x` / `y` / `opacity` / `scale` / `backgroundColor` via
  `motion/react`'s `animate` + `transition` props. No filters, no blur, no glow — the
  beam's "brighten" is an opacity/color change, not a drop-shadow or box-shadow bloom.
- `prefers-reduced-motion`: this file has no existing check to lean on for this. Either
  gate with `motion/react`'s own `useReducedMotion()` (pattern already used in
  `hyper-text.tsx`) or a local `matchMedia("(prefers-reduced-motion: reduce)")` listener
  (pattern used in `dot-cursor.tsx` / `canvas-cursor.tsx`). There's also a scoped
  `useReducedMotion` at `motion/figures/visual-identity/use-reduced-motion.ts` if this
  component ends up living there instead — but given the `RulesAnimation` placement above,
  it shouldn't need to.

Brief at `src/components/motion/glyphs/vi-nine-principles.brief.md`. Hand off to
`code-writer` with: "build the 'Nine principles' card animation in
src/components/case-study-bento.tsx from the brief at
src/components/motion/glyphs/vi-nine-principles.brief.md" — note the hand-off section
above: this is a `case-study-bento.tsx` addition, not a new `motion/glyphs/*.tsx` file.
