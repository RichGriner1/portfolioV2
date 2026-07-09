---
slug: homepage-intro
project: Homepage (hero intro)
concept: resolve
created: 2026-07-09
status: brief
---

# Homepage intro — motion brief

> **Note on process:** this brief was originally authored without a live interview — Richard wasn't available in
> that session, so the three usual questions (essence, visual vocabulary, rhythm) were answered as assumptions
> derived from `content/brand-guide.md`. **Richard has since confirmed all three, with one change (2026-07-09):**
>
> 1. **Concept — confirmed, bolder variant.** "Resolve" stands, but he wants a fourth system seam added to the
>    sequence: the tagline itself visibly resolves — its letter-spacing settles from a slightly-loose state into
>    its final tracking-tight cut, like a variable resolving to its value. Choreographed below; must read as
>    resolving, never as a bounce or a typewriter reveal.
> 2. **Replay — confirmed, once per session.** Gated on `sessionStorage`. First landing on `/` in a session plays
>    the full sequence; internal navigation back to `/` afterward skips straight to the final resolved state,
>    with no flash of the pre-animation (unresolved) state.
> 3. **Timing/rhythm — confirmed.** Soft, brief, one-shot. No idle loop, no scroll-link, no hover trigger.

## Concept
**Verb:** resolve
**Metaphor:** The page doesn't animate for delight — it *resolves*, the way a variable resolves to a value.
The grid is there first (the rulebook), then the one opinionated decision declares itself (the blue dot), then
the statements commit in order of hierarchy (eyebrow → tagline → subhead) — and the loudest statement, the
tagline, resolves twice: once into position, and once into its final typographic cut, its tracking visibly
tightening from a slightly-loose draft state into the exact `tracking-tight` it will sit at forever after. By
the time it's still, nothing reads as "animated" — it reads as a page that has already decided what it is,
down to the letterforms. This is the brand's own metaphor ("the variable panel, not the canvas") staged as the
first three-quarters of a second on the site.

## Visual vocabulary
- **Baseline rule (stroke, horizontal)** — a thin line beneath where the headline will land. Represents the
  grammar/grid existing before content is placed on it ("show the seams"). Drawn via `scaleX` from a left
  `transform-origin`, not `stroke-dashoffset` (it's a CSS border, not SVG, since this lives in the DOM hero, not
  an icon). Color: `border-border` at low opacity (~0.4), never full contrast — it's scaffolding, not content.
- **Accent dot (circle, already present)** — the existing `bg-primary size-1.5` dot in the eyebrow pill. This
  *is* the "one blue opinion" from the visual concept's move #1 — reuse it rather than inventing a new shape.
  It gets a single, brief scale emphasis (1 → ~1.15 → 1) as it settles, marking the one moment of color
  authority in an otherwise monochrome sequence.
- **Text blocks (existing)** — eyebrow pill, `<h1>` tagline, `<p>` subhead. Vocabulary is typographic, not
  illustrative, per move #2 (typographic confidence) and move #3 (editorial density). No new shapes for these;
  reuse the existing `opacity 0→1, y 8→0` pattern already in `hero.tsx`.
- **Tagline letter-spacing (typographic, new beat)** — the fourth seam. The `<h1>` carries its existing
  `opacity 0→1, y 8→0` resolve *and*, layered on top, a `letter-spacing` settle from a slightly-loose starting
  value into the final `tracking-tight` cut already applied via className. This is the most literal expression
  of "resolve" in the whole sequence — a value visibly converging on itself. **Primary implementation (today):**
  `letter-spacing` settle, since the site currently loads static Roboto via `next/font` (no variable axes
  available). **Upgrade path (future):** if the display font slot is ever filled with a variable face,
  `font-variation-settings` (weight and/or width axis) can resolve in parallel with the letter-spacing settle for
  a richer "system deciding its own type" read — flag this as a follow-up, don't build it now.
- **Color:** `border-border` (rule), `bg-primary` (dot, already token-routed), `text-foreground` /
  `text-muted-foreground` (existing text colors). No new tokens required.

## Choreography

1. **At rest (initial, pre-mount).** Baseline rule is at `scaleX: 0` (invisible, zero width, left-anchored).
   Eyebrow, tagline, and subhead are at their existing rest state (`opacity: 0, y: 8`). The tagline additionally
   starts at its loose letter-spacing value (see timing below). Nothing bounces, nothing loops — there is no
   idle state here because this is a one-shot, first-paint sequence, not a hover glyph. **Skip path (see
   Timing → Rhythm):** if the intro has already played this session, or reduced motion is requested, none of
   this initial state is ever visible — the hero mounts directly into the final resolved state.

2. **On trigger (mount / first paint — not hover, not scroll — and only if not already played this session).**
   - **t=0ms:** Baseline rule draws in left-to-right (`scaleX 0 → 1`), fast and quiet — the grid asserting itself
     before anything sits on it. Duration `--duration-fast` (120ms).
   - **t≈40ms (existing `STAGGER * 0.5`):** Eyebrow pill resolves in (existing `y: 8 → 0, opacity 0 → 1`). As it
     lands, the accent dot inside it takes the single scale pulse (1 → 1.15 → 1) — the one opinion declaring
     itself, once, without becoming a loop or a "notification" tell.
   - **t≈80ms (existing `STAGGER`):** Tagline (`h1`) begins its resolve — two things happen concurrently, same
     start time, different durations:
     - **Position/opacity** — unchanged from current `hero.tsx` timing (`y: 8 → 0, opacity 0 → 1`, 500ms). This
       is the loudest statement in the sequence; it gets no extra ornament to its arc, because move #4 ("motion
       as evidence") means the biggest type doesn't need the most motion.
     - **Letter-spacing (new beat)** — settles from a slightly-loose starting value into the final
       `tracking-tight` cut over `--duration-slow` (320ms), so it visibly completes at **t≈400ms**, well before
       the position/opacity arc has mathematically finished (which is fine — eased curves are front-loaded, so
       the block already reads as "in place" by then; the tracking settle is what's still visibly resolving).
       Monotonic decrease only — no overshoot, no oscillation, `--ease-out-soft`. This must read as convergence,
       not a spring or a typewriter reveal.
   - **t≈160ms (existing `STAGGER * 2`):** Subhead resolves in — unchanged from current `hero.tsx` timing.
   - **t≈400–450ms (the moment the tagline's letter-spacing settle completes):** Baseline rule fades out
     (`opacity 1 → 0`, rule stays at `scaleX: 1` so it recedes rather than retracts), duration `--duration-fast`
     (120ms). The scaffolding is removed the instant the structure it was proving — down to the headline's own
     final type cut — is self-evident. This is the literal "show the seams, then let them disappear into the
     finished page" move, now paying off precisely against the tagline's own resolution rather than an
     arbitrary delay.

3. **Return to rest.** There is no return — this is one-shot. The last visible motion is the subhead's
   position/opacity arc completing at ~660ms (`STAGGER * 2` + 500ms); everything else (rule, dot, tagline
   tracking) has already settled by ~570ms. Total sequence: well under the ~800ms budget. Once complete, the
   hero sits exactly as it does today: static, no residual motion, no loop. If the animation can't explain what
   it demonstrated (the grid, then the one decision, then the statements — including the headline's own type
   settling into itself — in that order), it doesn't belong here.

## Timing
- **Duration:** rule draw-in `--duration-fast` (120ms); dot pulse `--duration-fast` (120ms); text blocks keep
  the existing `duration: 0.5` (500ms) from `hero.tsx`, unchanged; **tagline letter-spacing settle
  `--duration-slow` (320ms)**, starting at the same delay as the tagline's position/opacity arc (`STAGGER`,
  80ms) so it completes at ~400ms; rule fade-out `--duration-fast` (120ms), starting once the letter-spacing
  settle completes (~400–450ms).
- **Easing:** `--ease-out-soft` (`cubic-bezier(0.2, 0.8, 0.2, 1)`) for the rule draw, dot pulse, and the tagline
  letter-spacing settle; keep the existing custom `EASE = [0.2, 0.8, 0.2, 1]` for the text position/opacity
  arcs — this is the *same curve* as `--ease-out-soft`, so consolidate to the token per the "never hard-code
  motion" rule rather than running two literal copies of one bezier. **Do not use `--ease-spring`** for the
  letter-spacing settle — it overshoots (`cubic-bezier(0.34, 1.56, 0.64, 1)`), and an overshooting tracking
  value reads as a bounce, which breaks "resolve."
- **Rhythm:** one-shot, page-load only. No idle loop, no scroll-link, no hover state. **Confirmed: replay once
  per session**, gated on `sessionStorage`:
  - On first landing on `/` in a session (key not yet set), run the full sequence, then set the key.
  - On any subsequent mount of `Hero` in the same session (internal nav back to `/`, since Next.js client-side
    routing keeps the tab's `sessionStorage` alive), skip the sequence entirely — render every element in its
    **final resolved state** (rule invisible/faded, dot at rest scale, text at `opacity: 1, y: 0`, tagline at
    its final `tracking-tight` value) with **no flash of the pre-animation (unresolved) state** on mount. This
    is an implementation-order concern, not just a value swap — flagged explicitly for `code-writer` below.
- **Accessibility:** must respect `prefers-reduced-motion` — reduced-motion users get the final state
  immediately, same as the session-skip path (no rule draw, no dot pulse, no letter-spacing settle, text blocks
  at `opacity: 1` with no transform, tagline already at `tracking-tight`), consistent with move #4's own test
  ("if it can't explain what it's demonstrating, cut it" — for a reduced-motion user, none of this demonstrates
  anything, so don't run it).

## Hand-off note to code-writer
- **This is not a 64×64 glyph.** Unlike other files in `src/components/motion/glyphs/`, this brief describes
  the actual homepage hero sequence, not a project icon. Implement by editing `src/components/hero.tsx`
  directly (add the baseline-rule element, the dot-pulse variant, and the tagline letter-spacing settle to the
  existing `motion.div`/`motion.h1`/`motion.p` structure already there) — do not create a new
  `homepage-intro.tsx` glyph file unless Richard explicitly wants the intro extracted into its own component.
- Reuse the existing `EASE` and `STAGGER` constants in `hero.tsx`; do not fork a parallel timing system.
- Baseline rule: a plain `motion.div` (or `<motion.span>`) styled as a 1px `border-border` line, animated via
  `scaleX` + `transformOrigin: "left"`, positioned absolutely just above/below the tagline. Confirm exact
  placement against the actual rendered baseline grid before hard-coding a `top`/`bottom` offset.
- Dot pulse: apply the scale variant to the existing `<span aria-hidden="true" className="bg-primary size-1.5 ...">`
  element already in the eyebrow — don't duplicate it.
- **Tagline letter-spacing settle:** animate the `<motion.h1>`'s `letterSpacing` style value from a slightly-
  loose starting value to the final value the `tracking-tight` utility already produces. Two viable approaches
  — pick whichever keeps the class-driven final state authoritative:
  1. Read/confirm the computed `letter-spacing` for `tracking-tight` in this Tailwind build (no override in
     `globals.css`, so it's Tailwind's default — verify the actual computed value in devtools rather than
     assuming a number) and animate `letterSpacing` from a looser value (e.g. `"0.01em"` or `"normal"`) to that
     exact computed value, keeping the `tracking-tight` class on the element throughout so the two never
     diverge once the animation completes.
  2. Or drop `tracking-tight` from the className and let `initial`/`animate` fully own the property, with the
     `animate` end value hardcoded to match what `tracking-tight` would have produced.
  Prefer (1) — it keeps the design-token/utility as the single source of truth for the resting value, and the
  animation is just how it gets there. Do not invent a new spacing token for the "loose" starting value; a
  small literal em offset for a one-shot transient state is acceptable here (it's not a persisted design token,
  it's an animation-only intermediate value) — but keep it subtle, this is a settle, not a reveal.
- **Font upgrade path:** if/when the display font slot loads a variable face, a follow-up could pair this with
  a `font-variation-settings` resolve (weight/width axis) — originally out of scope while the site ran static
  Roboto. **Status: landed.** Richard approved Roboto Flex for `--font-display` in the same branch, so the
  upgrade shipped alongside the wiring: the tagline settles `fontStretch` `100% → 125%` on the same
  timing/ease as the tracking settle, and the skip path rests on the CSS `--font-display-width` cut exactly.
- **Session gating:** gate the whole sequence on `sessionStorage` (pick a key, e.g. `hero-intro-played`). On
  mount, if the key is already set, render every element in its final state with **no animation start
  visible** — this likely means deciding "already played?" before the first paint rather than in a
  post-mount `useEffect` (a `useEffect`-only check risks one frame of the unresolved initial state, which is
  exactly the flash Richard asked to avoid). Watch for the SSR/hydration nuance: `sessionStorage` doesn't exist
  on the server, so the server-rendered markup can't know the session state — flag this explicitly to Richard
  if a clean zero-flash solution isn't achievable without a client-only gate (e.g. a brief invisible/skeleton
  frame), rather than shipping a visible flash silently.
- Gate with `prefers-reduced-motion` the same way — final state immediately, no flash (there may already be a
  repo convention for this — check `src/lib/` and other motion components before inventing one).
- Client component, `motion/react` primitives only (transform, opacity, letter-spacing — no filters).
- Use semantic color tokens only (`border-border`, `bg-primary`) — never hard-coded.
- No `isHovered` prop — this sequence is triggered by mount, not hover, and only once per session per the
  gating above.
