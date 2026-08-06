---
slug: design-system-audit
project: Design System Audit
concept: converge
created: 2026-07-16
status: brief
---

# Design System Audit — motion brief

This page is inline copy, not a `work.ts` entry, so the usual three-question
interview ran without Richard in the loop. Questions, my answers, and my
reasoning are below — override anything flagged.

## The three questions (answered in absentia — flag to override)

**Q1. Essence — "If this project were a single verb, what would it be?"**
My answer: **converge** (not "collapse," which is the word the hero copy
already uses — "5 drifted button styles collapsing into 1 component").
Reasoning: "collapse" as a literal motion verb reads as things falling or
shrinking downward (an accordion closing). What the copy actually describes
is 5 *laterally offset* variants sliding into shared alignment — that's
convergence, not collapse. I kept "collapse" in the copy's own language
untouched; I'm only choosing the motion verb.
**Flag:** if Richard wants the hero glyph to read as a literal downward
collapse (stacking/squashing) rather than a lateral snap-to-alignment,
override this — it changes the choreography's travel axis.

**Q2. Visual vocabulary — "What shapes or objects come to mind? 2–3, max."**
My answer:
1. **Rounded-rect "pills"** — an abstracted button shape (no label, no
   color, just geometry) standing in for the 5 drifted variants.
2. **A ghost target slot** — a dashed outline at the canonical position,
   the "system" waiting to be occupied.
3. **A reference line** — a thin horizontal rule the pills align to,
   directly reusing the baseline-rule motif from `hero.tsx` (§01 sits right
   below the real hero on the homepage's motion vocabulary — repeating the
   rule gives this page a visual rhyme with the house style instead of
   inventing a new primitive).
**Flag:** a pill/button shape sits at the edge of "abstract vs. literal."
I judged it acceptable because it's still unlabeled pure geometry (varying
size/rotation/opacity, not a screenshot), and it's the audit's actual
subject matter rather than a decorative metaphor. If it reads too literal
in practice, the fallback is plain rounded bars with no button affordance
(no bordered center rail) — a smaller change than it looks.

**Q3. Rhythm — "Sharp or soft? Quick or patient? One-shot, idle loop, or
scroll-linked?"**
My answer: **hover/scroll-triggered one-shot, not an idle loop.** This page
is reached from cold email — traffic is overwhelmingly first-and-only-visit,
low patience, and the entire job of the page is to get one click on "Book
the audit." An always-on idle loop next to that CTA competes with it for
the 2–3 seconds someone spends deciding. So: the hero resolves once on
scroll-into-view (mirroring `hero.tsx`'s intro), holds its resolved state,
and offers a small hover payoff for anyone who lingers. The three
deliverable-card glyphs are hover-only, no autoplay — three things
animating on scroll at once, next to three different pieces of card copy,
would be loud without adding conversion value.
**Flag — the one genuinely open call:** `hero.tsx` gates its intro with
`sessionStorage` so repeat visits (which are common on a homepage) don't
replay it. This page's traffic pattern is closer to "one visit, ever," so
the session gate barely matters here — a scroll-triggered one-shot and a
"play every time you land on this section" are nearly identical in
practice. I'm recommending the **scroll-into-view, once-per-mount**
version (simpler, no sessionStorage key needed) rather than reusing the
exact session-gate pattern. If Richard wants strict parity with
`hero.tsx`'s convention anyway (e.g. because someone bookmarks/revisits),
say so and code-writer should reuse `HERO_INTRO_KEY`-style storage instead.

## Concept

**Verb:** converge
**Metaphor:** Five things that used to be one thing, each having drifted a
little further from the last, slide back into shared alignment — not
destroyed, not merged into mush, just re-registered against a common line.
The audit is the act of noticing exactly how far each one wandered and
where the line actually is.

## Visual vocabulary (shared across all four pieces)

- **Pills (rounded rects)** — component instances. Scattered = drift.
  Aligned = system.
- **Ghost target / dashed outline** — the canonical slot a drifted thing
  is measured against. Present at rest as `text-muted-foreground`,
  solidifies to `text-foreground` on resolve.
- **Reference line (stroke)** — the system's baseline, drawn via
  `stroke-dashoffset`, echoing `hero.tsx`'s baseline rule.
- **Color** — `currentColor` throughout (palette is zero-chroma; weight and
  opacity carry all the signal). Drifted state ≈ 0.35–0.5 opacity, resolved
  state = full opacity. No new tokens needed.
- **Density** — hero glyph: 5 pills + 1 target + 1 line. Card glyphs: 3–4
  elements max, 64×64, matching the existing `wordpress-shell.tsx` /
  `migration.tsx` scale and restraint.

---

## Piece 1 — Hero centerpiece ("5 drifted button styles collapsing into 1 component")

### Choreography

1. **At rest (pre-trigger / reduced-motion state).** 5 pills scattered
   around the target position at varying x/y offset, rotation, and
   opacity (0.35–0.55) — visually "drifted." Ghost target outline visible
   as a dashed rounded-rect at the canonical center, faint
   (`text-muted-foreground`). Reference line not yet drawn. No motion.

2. **On trigger (scroll-into-view, fires once per mount).** The 5 pills
   travel toward the target position with a staggered start (~90ms between
   pills), each pill's rotation easing to 0 and opacity rising to 1 as it
   arrives. As the pills stack into the target, the dashed outline
   solidifies to a solid stroke, and the reference line strokes in
   left-to-right through the resolved pill (`stroke-dashoffset`, echoing
   the hero baseline rule). The last pill's landing and the line's draw
   should feel simultaneous — the "click" moment.

3. **Return to rest.** It doesn't reset or reloop — a completed
   convergence is the point, not a toy. The resolved state holds
   indefinitely. On **hover** (secondary, for anyone who lingers): the
   resolved pill does a small confirm-pulse (scale 1 → 1.03 → 1,
   `--ease-spring`) and the reference line briefly raises opacity — "this
   holds." No other change; nothing scatters back out on unhover.

### Timing

- **Duration:** pill travel `--duration-slow` (320ms) each, staggered
  ~90ms apart (5 pills ≈ 680ms total resolve time — lands in the same
  ~0.7–0.9s window `hero.tsx`'s own text intro resolves in, so the page
  reads as one coordinated moment, not two competing timelines).
  Reference-line draw: `--duration-fast`, starting as the last pill lands.
  Hover confirm-pulse: `--duration-fast`.
- **Easing:** `--ease-in-out-soft` for pill travel (precise, not
  clinical-sharp — this is an audit, not a magic trick). `--ease-spring`
  for the final settle and the hover pulse (the one moment of overshoot —
  earned, not decorative). `--ease-out-soft` for opacity/line fades.
- **Rhythm:** one-shot on scroll-into-view, plus hover-triggered
  micro-response after resolved. Not an idle loop (see Q3).

---

## Piece 2 — Deliverable card: UI drift map

Lighter treatment. A small grid (2×2 or 2×3) of squares standing in for
screenshotted screens; on hover, thin redline ticks stroke-draw onto 2–3
flagged cells in sequence, echoing the audit's actual act of finding and
marking inconsistencies.

1. **At rest.** Grid faint (`text-muted-foreground`, ~0.4 opacity), no
   ticks. Optional: one cell breathes very subtly (±0.1 opacity, slow) to
   read as "still scanning" — omit under reduced motion.
2. **On hover.** Redline ticks stroke-draw onto flagged cells, staggered
   ~60–80ms apart. Flagged cells' base opacity rises to full as their tick
   completes.
3. **Return to rest.** Ticks fade out in reverse order, quick.

**Timing:** `--duration-fast` per tick, `--ease-out-soft`, stagger ~70ms,
hover-triggered only.

---

## Piece 3 — Deliverable card: token & component gap table

3–4 horizontal bars (a miniature table row set). Some rows are short or
dashed at rest — the "gap." On hover, rows extend to a shared right edge —
the same convergence idea as the hero, at a smaller scale — except one row
(the "fake-systemized" one, per the copy: "hard-coded values wearing a
component's name") extends to full length but *stays* dashed/reduced
opacity instead of solidifying. That distinction is the whole point of the
card's copy — worth the extra state.

1. **At rest.** Rows at mixed lengths/opacities, one visibly dashed.
2. **On hover.** Rows stagger-extend (~70ms apart) to a common right edge.
   Real gaps solidify to full opacity as they land. The "fake" row extends
   but keeps its dash pattern and ~0.5 opacity — it *looks* aligned,
   isn't really.
3. **Return to rest.** Rows retract in reverse.

**Timing:** `--duration-base`, `--ease-out-soft`, stagger ~70ms,
hover-triggered only.

---

## Piece 4 — Deliverable card: 90-day roadmap

A horizontal path with 3 nodes (day markers). On hover, a line strokes in
left-to-right; each node brightens as the draw passes it. Patient, not
snappy — this is a plan, not a payoff.

1. **At rest.** Path drawn faint, 3 nodes dim (~0.35 opacity).
2. **On hover.** Line strokes in (`stroke-dashoffset`, left to right).
   Each node brightens to full opacity as the draw front passes it (~33% /
   66% / 100% of the path).
3. **Return to rest.** Reverse fade, quicker than the draw-in.

**Timing:** `--duration-slow` for the full path draw (deliberately the
slowest of the three card glyphs — sequencing over 90 days is a patient
idea), `--ease-in-out-soft`, hover-triggered only.

---

## Not a motion target

**§07 headshot slot** ("working, not posed") — static. A photo, not a
glyph. Leave as-is or swap for a real image; no motion brief needed.

## Cross-cutting rules

- All four respect `prefers-reduced-motion`: render the fully resolved /
  aligned state immediately, no animation, matching the pattern in
  `hero.tsx`.
- Grayscale palette — every color reference above is `currentColor` or a
  semantic opacity step on it. No new tokens required.
- The hero's scroll-trigger should feel like a continuation of the page's
  own intro, not a separate widget — same easing curve family
  (`--ease-in-out-soft` / `--ease-out-soft` / `--ease-spring`) as
  `hero.tsx` uses, not a new curve.

## Hand-off note to code-writer

- Implement four components:
  - `src/components/motion/glyphs/design-system-audit-hero.tsx` — hero
    centerpiece (Piece 1). Larger canvas than the standard 64×64 (this one
    fills a hero visual slot, not a card) — size to the existing
    `PlaceholderFrame` slot in `audit-landing.tsx` §01 (`min-h-56
    sm:min-h-64`), viewBox scaled proportionally (suggest `0 0 240 160` or
    similar, not the 64×64 card convention).
  - `src/components/motion/glyphs/design-system-audit-drift-map.tsx`
    (Piece 2), `-gap-table.tsx` (Piece 3), `-roadmap.tsx` (Piece 4) — all
    64×64, `viewBox 0 0 64 64`, matching `wordpress-shell.tsx` /
    `migration.tsx` conventions.
- All four: client components, `motion/react` primitives only (transform,
  opacity, `stroke-dashoffset` — no filters).
- Props: card glyphs take `{ isHovered?: boolean }` per house convention.
  The hero glyph additionally needs a scroll-into-view trigger — check
  whether the codebase already has a `useInView`-style hook elsewhere
  before adding a new dependency; `motion/react`'s own `whileInView` /
  `useInView` should cover it without extra libraries.
- Wire into `audit-landing.tsx` by replacing the `PlaceholderFrame` calls
  at §01 (`HERO_VISUAL`) and the three `DELIVERABLES` cards' `visual`
  slots — those are the four placeholder frames this brief targets. Leave
  the §07 `WHO_VISUAL` placeholder untouched (see "Not a motion target").
- Colors: `currentColor` / `text-foreground` / `text-muted-foreground`
  only — never hard-coded, per repo-wide token rules.
