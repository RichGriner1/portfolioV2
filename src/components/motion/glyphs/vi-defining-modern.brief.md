---
slug: vi-defining-modern
project: Afi Visual Identity — "Defining modern" card
concept: settle
created: 2026-08-09
status: brief
---

# "Defining modern" card — motion brief (v2)

**Revision note.** v1 of this brief (marks converging to one point on a track) was
stopped before any code was written — Richard's steer: ground this in the blog post
the card itself links to, *Modern UI in 2026* (`content/published/process/modern-ui-2026.md`,
slug `modern-ui-2026`), and its purpose-built figures
(`src/components/motion/figures/*.tsx`), rather than an invented abstract metaphor.
This version replaces v1 entirely — same file, same structural contract (props,
sizing, reduced motion, wiring), new concept. I read the published post in full and
all six of its figures before choosing.

## The three questions (answered in absentia — flag to override)

**Q1. Essence — "If this project were a single verb, what would it be?"**
My answer: **settle**, unchanged from v1, but now earned by the post's own language
rather than an invented one. Not "converge" (`design-system-audit.brief.md` already
owns that verb for a near-identical spatial move) and not "align" (the *parent*
`visual-identity.brief.md` hero already owns misalignment-resolving-to-alignment for
this same case study — using the same verb for a card on the same page would blur the
two). "Settle" still does the double duty v1 wanted: a debate settles, and here,
literally, bars settle at a shared height.

**Q2. Visual vocabulary — "What shapes or objects come to mind? 2–3, max."**
My answer: bars at a shared height, plus a line marking that height once it's agreed.
See below. **What changed from v1 and why:** the post's own diagram for this exact
argument — `maturity-stages.tsx`, the five-stage Chaos→Adaptive ladder illustrating
Learning 1 ("Design maturity... measures how widely design language is shared across
a team") — draws its argument as **bars at heights**, not marks on a track. That's a
closer fit to the card's own copy than v1's dots-on-a-track ever was: the post's
own opening paragraph, before Learning 1 even starts, says almost verbatim what the
card says — *"Everyone likes something different... the decisions ride on individual
taste instead of shared principles."* Bars that don't share a height **are** taste
arguing with taste; the maturity model's own name for the stage where that stops is
literally **Defined**. I also dropped v1's one literal touch (the word "modern"
appearing at resolve) — this version is fully wordless, on purpose (see Choreography).
Borrowing the bar-chart *vocabulary* from `maturity-stages.tsx` is intentional (see
Hand-off note for exactly what's shared vs. rebuilt); it is not a re-skin of that
figure's actual argument (a *team's* process maturing through five named,
chronological stages with an organizational ceiling past Defined). That nuance
belongs to the post, not to this card — this card only claims reaching **Defined**,
deliberately, before Figma, so the glyph stops there and only there.

**Q3. Rhythm — "Sharp or soft? Quick or patient? One-shot, idle loop, or
scroll-linked?"**
My answer: unchanged from v1 — **hover-triggered idle loop**, matching every existing
`{ active }` animation in `case-study-bento.tsx`. Rest shows the outcome (bars
already level, the line already drawn); hover replays how they got there, on loop,
for as long as the pointer stays. Mostly soft, patient movement for the
disagreement/re-settle, with exactly one crisp `--ease-spring` moment — now carried by
the guideline snapping into place, not a dot's scale-pop.

## Concept

**Verb:** settle
**Metaphor:** *Modern UI in 2026* opens on the actual problem this card solves:
"everyone likes something different," so a review is taste arguing with taste and
"the decisions ride on individual taste instead of shared principles." The post's own
figure for the fix — its Learning 1 maturity ladder — draws that fix as bars at
different heights, with **Defined** the point where "tokens and patterns are written
down and become the source of truth." This card doesn't need the whole five-stage
ladder, only the part it actually did: a few unshared readings of "modern," each
sitting at its own height, settle at one shared height — and only once they agree is
there a line to draw.

## Visual vocabulary

- **Three bars** — thin vertical rects, unlabeled. Not a literal headcount of the
  team; a small, legible "more than one, not many" cluster, matching the density
  the rest of this file's card glyphs use (2–4 elements). Debating = uneven heights,
  no two alike, `bg-muted-foreground`. Settled = identical height, aligned tops,
  `bg-foreground`.
- **One guideline** — a thin horizontal rule, `bg-primary`, appearing only once the
  three bars are level, drawn exactly at their shared height. This is the one
  primary-colored element in the piece — "the definition, in writing," the moment a
  height stops being a coincidence and becomes a standard. Absent entirely while the
  bars are uneven; there's nothing to write down yet.
- **A floor** — a hairline the bars stand on, `bg-border`, present throughout,
  never animating. The floor was never the disagreement; where each bar's top landed
  was.
- **Color:** `bg-border` (floor, constant) → `bg-muted-foreground` (bars, debating) →
  `bg-foreground` (bars, agreed) → `bg-primary` (guideline, appears once). No other
  colors.
- **Density:** 3 bars + 1 floor + 1 guideline. Nothing else — no labels, no caption,
  no icons. Fully wordless, unlike v1's single-word reveal — the height-and-line
  language carries "defined" on its own, and it sidesteps the localization v1 needed
  (`useLang()` for "modern"/"moderno") for no real gain here.

## Choreography

1. **At rest (idle, `active=false`).** The settled frame, fully still: three bars at
   one shared, aligned height (`bg-foreground`), the guideline drawn at that height
   (`bg-primary`), floor beneath. No debate shown at rest — matches every sibling
   `{ active }` animation in this file (`LayersAnimation`, `NodesAnimation`,
   `CanvasAnimation` all rest on their *resolved* frame). A card that greeted a
   visitor with unresolved bars would read as broken, not as "before."
2. **On trigger (hover, `active=true`) — loops while hovered.**
   a. Brief hold on the resolved frame (~350ms) before replaying.
   b. **The line goes away.** Guideline fades out quickly (~150ms) — the definition
      isn't written yet.
   c. **Diverge.** Each bar's height tweens from the shared height to its own
      uneven, hand-set height (some taller, some shorter than at rest — not a clean
      ascending staircase, genuinely uneven), color shifting `bg-foreground` →
      `bg-muted-foreground` as it moves. Staggered ~80ms apart.
   d. **Hold, uneven** (~550–600ms). Let the disagreement be seen — the "before" the
      card's own copy describes, and the one beat that needs to read as "these don't
      agree," not as a glitch.
   e. **Settle.** Each bar's height tweens back to the shared resolved height, color
      shifting `bg-muted-foreground` → `bg-foreground` as it lands. Staggered ~90ms
      apart, so they visibly arrive in a short sequence rather than snapping together.
   f. **Confirm.** The instant the last bar lands, the guideline snaps into place at
      that height (`scaleX` 0→1 from center, or opacity + tiny `y` settle) —
      the one crisp "click" in the piece, the moment a shared height becomes a
      written one.
   g. **Hold, resolved** (~1500ms) — the longest beat, and the one most likely to be
      the frame someone actually sees. Nothing moves.
   h. Loop back to (b).
3. **Return to rest.** On hover-out, snap immediately to the resolved frame — no
   animated reverse, matching every sibling `{ active }` animation in
   `case-study-bento.tsx` (a mid-diverge freeze on mouse-out would read as broken).

## Timing

| Beat | What | Duration / stagger | Token |
|---|---|---|---|
| Pre-replay hold | resolved frame, still | ~350ms | — (plain pause) |
| Line fades out | guideline opacity → 0 | ~150ms | `--duration-fast`-ish, `--ease-out-soft` |
| Diverge | 3 bars move to uneven heights | 200ms each, ~80ms stagger | `--duration-base`, `--ease-in-out-soft` |
| Uneven hold | disagreement visible | ~550–600ms | — (plain pause) |
| Settle | 3 bars move to shared height | 320ms each, ~90ms stagger | `--duration-slow`, `--ease-in-out-soft` |
| Confirm | guideline snaps in | 120ms | `--duration-fast`, `--ease-spring` |
| Resolved hold | peak, still | ~1500ms | — (plain pause) |

Total cycle ≈ 3.2–3.5s — in line with the other looping card animations in this file
(`NodesAnimation` ≈ 3.3s, `LayersAnimation` ≈ 4.7s).

- **Easing:** `--ease-out-soft` (`cubic-bezier(0.2, 0.8, 0.2, 1)`) for the guideline's
  fade out. `--ease-in-out-soft` (`cubic-bezier(0.45, 0.05, 0.15, 1)`) for every bar
  height tween, diverge and settle alike — patient, not clinical-sharp; this is
  people coming around, not a UI snapping. `--ease-spring`
  (`cubic-bezier(0.34, 1.56, 0.64, 1)`) reserved for the guideline's snap-in only —
  the single earned moment of overshoot in the piece.
- **Rhythm:** hover-triggered idle loop, `{ active }`-gated. Resting state never
  animates. No scroll trigger, no one-shot — matches the `case-study-bento.tsx`
  house convention, not the scroll-into-view convention used elsewhere in this
  glyphs/ folder (e.g. `design-system-audit-hero.tsx`, a different page type).

## Hand-off note to code-writer

- **This is a `case-study-bento.tsx` card animation, not a standalone SVG glyph, and
  not a reuse of `maturity-stages.tsx`.** That figure is built for article width
  (`bg-card border-border/60 ... rounded-2xl border p-5`, its own panel chrome,
  autoplays forever from mount, five labelled stages, a caption sentence) — wrong
  shape and wrong trigger for a card face that already sits inside `BentoCardItem`'s
  own card chrome. Build a new, smaller component that borrows only the idea (bars at
  heights, `bg-foreground`-weight-carries-meaning) and the easing family
  (`EASE_SOFT`-style curves), not the code.
  - `type AnimationProps = { active: boolean }` (defined locally in
    `case-study-bento.tsx`; either duplicate that one-line type in the new file or
    export it from `case-study-bento.tsx` and import it — small call, doesn't change
    behavior).
  - Root renders `w-full`, sized by the card's own flex layout
    (`bg-card flex min-h-[120px] flex-1 items-center justify-center overflow-hidden
    rounded-xl` in `BentoCardItem`) — no fixed viewBox. Clamp the composition's own
    width (e.g. `max-w-[160px]`, centered) so three bars don't spread thin in a
    `wide`/`full` card, the same way `NodesAnimation` caps itself at `max-w-[280px]`
    for the same reason. Budget roughly 70–90px of height so it sits comfortably
    inside `min-h-[120px]`.
  - `active=false` renders the settled frame instantly (no reset animation — it's
    just the default state), `active=true` starts the async `setTimeout`-loop
    pattern every sibling in this file uses (`while (!cancelled) { … }` inside a
    `useEffect`, cancelled on cleanup/unhover) — copy the shape from
    `LayersAnimation` or `NodesAnimation` rather than inventing a new loop mechanism.
- **Reduced motion:** use `useStaticResolve()` from `./use-static-resolve` (already
  in this same `glyphs/` folder — "reduced-motion gate for hover-driven glyphs").
  When it returns `true`, ignore the `active` prop entirely and always render the
  resolved frame — bars never diverge. None of the existing `{ active }` animations
  in `case-study-bento.tsx` currently check `prefers-reduced-motion` (confirmed by
  reading them), so this glyph sets the pattern rather than following one already
  there — worth a short code comment noting that.
- **No localization needed** — this version is fully wordless (see Q2), so unlike
  v1 there's no `useLang()` dependency to wire up.
- **Colors:** `bg-border`, `bg-muted-foreground`, `bg-foreground`, `bg-primary` only.
  No hex, no inline `hsl(var(--x))` style props needed unless Motion needs to tween
  `backgroundColor` directly rather than swapping Tailwind classes (several siblings
  do this for exactly that reason — if so, mirror `PulseAnimation`'s approach, still
  pointed at the same semantic tokens, never a hex literal).
- **Wiring (do all of these, they're the same change):**
  1. Add `"vi-defining-modern"` to the `BentoCard["animation"]` union in
     `src/lib/content/case-studies.tsx`, inside the existing "visual-identity only"
     comment block alongside `vi-moodboard` / `vi-type-test` / `vi-components` /
     `vi-micro`.
  2. Change the "Defining modern" card's `animation: "guideline"` to
     `animation: "vi-defining-modern"` (same file, the `visual-identity` bento
     array, ~line 486).
  3. Build the component at
     `src/components/motion/glyphs/vi-defining-modern.tsx`, exporting e.g.
     `VIDefiningModernAnimation({ active }: AnimationProps)`.
  4. Import it into `case-study-bento.tsx` and add it to the `ANIMATIONS` registry
     under the `"vi-defining-modern"` key (next to the other `vi-*` entries).
  5. **Leave `GuidelineAnimation`/the `guideline` key untouched.** It's not just this
     case study's placeholder — `kt360`'s "Design System Foundation" card
     (`src/lib/content/case-studies.tsx`, the `kt360` bento array) also uses
     `animation: "guideline"`. This brief only removes visual-identity's *borrow* of
     it, not the animation itself.
- **Client component, `motion/react` primitives only** — transform (height via
  layout-safe properties, or a wrapping `motion.div`'s `height`/`scaleY`), opacity,
  `backgroundColor`, `scaleX` for the guideline. No filters, no blur, no rotation.

Brief at `src/components/motion/glyphs/vi-defining-modern.brief.md`. Hand off to
`code-writer` with: "build the glyph at
src/components/motion/glyphs/vi-defining-modern.tsx from the brief, and wire it into
case-studies.tsx + case-study-bento.tsx per the Hand-off note."
