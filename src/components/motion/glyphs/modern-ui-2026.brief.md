---
slug: modern-ui-2026
project: Modern UI in 2026, the research pass before I touched Figma
concept: hold
created: 2026-09-29
status: brief
---

# Modern UI in 2026, motion brief

## Surface, and what this does not replace

**This glyph does not replace the video thumbnail.** In `CardMedia`, `video` wins over `figure`, and Richard's kinetic-type clip is the deliberate face of this post on the home page and /writing. The glyph is a 64x64 mark for a different, smaller surface: places where a full 1080 tile is too big and a still title is too flat. Candidates, in order of fit:

1. A compact writing row or related-post link (a 64px leading mark beside the title).
2. The post's own checklist item 3, "Functional motion, not decorative," as a margin mark.
3. A hover state on the post's tile, only if Richard later drops the video.

There is no 64px glyph slot for writing entries in the codebase today. Wiring one is a separate change, so the brief only defines the glyph and its `isHovered` contract. Flagged for Richard to pick the surface.

## The three questions (answered in absentia, flag each to override)

**Q1. Essence.** **Hold.** The post's own language is "friction as a feature," "the intentional pause," and a 150 to 250 millisecond window "long enough to register that something happened, short enough that the app doesn't feel sluggish." A hold is the one idea in the post that is about motion itself. Override candidates: "infer" (Learning 2, intent) or "announce" (Learning 4).

**Q2. Visual vocabulary.** A round key, a ring that fills around it, and a tick. Three things. The post never uses a chart for this idea; it uses a button and a beat, so the vocabulary stays a button and a beat.

**Q3. Rhythm.** Hover-triggered, replays while hovered, patient with one crisp landing. The beat is deliberately slowed so the pause is visible (see Timing).

## How this differs from vi-defining-modern

| | vi-defining-modern (settle) | modern-ui-2026 (hold) |
|---|---|---|
| Source | Opening argument and Learning 1 (shared definition, maturity) | Learning 3 and 4 (friction, perceived reliability, trust) |
| Axis | Space: heights converge | Time: a delay before a confirmation |
| Objects | Three bars, a guideline, a floor | One key, one ring, one tick |
| Story | People agree on a standard | A system earns belief by not answering instantly |
| Surface | Bento card inside the Visual Identity case study | Small mark for the blog post itself |

No shared shapes, no shared verb, no shared color roles beyond the general foreground and primary tokens. The two never appear on the same surface, and neither reads as a variant of the other.

## Concept

**Verb:** hold
**Metaphor:** A press does not resolve at once. It waits a beat, and the wait is what makes the answer believable.

## Visual vocabulary

- **Key** — a solid circle, centered, about 24px across in the 64 box. The high-stakes action. `currentColor` at rest via `text-foreground`.
- **Ring** — a circle stroke around the key, about 40px across, drawn with stroke-dashoffset. The pause, visible as a path filling. `text-muted-foreground` track, `text-primary` progress.
- **Tick** — a short two-segment check inside the key, drawn with stroke-dashoffset. The confirmation. `text-background` on the key fill, so it reads as a cutout.
- **Colors:** `text-foreground` (key), `text-muted-foreground` (ring track), `text-primary` (ring progress, the single accent), `text-background` (tick). No others. No new tokens needed.
- **Density:** 3 elements plus the ring track. No labels, no numbers. Wordless, so no localization.

## Choreography

1. **At rest (idle).** The resolved frame, fully still: key solid, tick drawn, ring track faint, progress ring complete in `text-primary`. Resting on the answer, not the wait, matches the sibling hover glyphs and avoids a card that looks mid-load.
2. **On trigger (hover), loops while hovered.**
   a. **Press.** Key scales to 0.92 and the tick disappears (opacity to 0). Ring progress resets to empty. The action has been taken and nothing is confirmed yet.
   b. **Hold.** Ring progress draws clockwise from the top over the beat. Key stays pressed. This is the visible pause, the only long movement in the piece.
   c. **Confirm.** The moment the ring closes, key springs back to 1 with a small overshoot and the tick draws in (stroke-dashoffset). This is the single crisp moment and the only use of `--ease-spring`.
   d. **Rest on the answer** for a longer still beat, then loop to (a).
3. **Return to rest.** On hover-out, snap to the resolved frame with no animated reverse, so a mid-hold freeze never reads as a stuck spinner.

## Timing

The real window is 150 to 250 milliseconds, which the post's own figure found is too short to watch. The glyph plays the beat slowed, and since it prints no numbers it makes no false claim about the recommended delay.

| Beat | Duration | Token |
|---|---|---|
| Press | 120ms | `--duration-fast`, `--ease-out-soft` |
| Hold (ring draws) | 800ms | raw, `--ease-in-out-soft` |
| Confirm (key spring + tick draw) | 200ms | `--duration-base`, `--ease-spring` |
| Rest on answer | about 1200ms | plain pause |

- **Cycle:** about 2.3s.
- **Rhythm:** hover-triggered loop. Rest never animates.
- **Flag:** the 800ms hold is a raw value with no token, chosen to be watchable. If code-writer or Richard wants it tokenized, ask before adding one.

## Hand-off note to code-writer

- Implement as `src/components/motion/glyphs/modern-ui-2026.tsx`.
- Size: 64x64, SVG viewBox 0 0 64 64.
- Client component, `motion/react` primitives only: scale, opacity, stroke-dashoffset (via `pathLength`). No filters.
- Props: `{ isHovered?: boolean }`, responding to parent hover via variants or a small effect loop, following the shape of an existing looping glyph in this folder.
- Colors via `currentColor` and semantic text tokens only, as listed above. No hex.
- **Reduced motion:** use `useStaticResolve()` from `./use-static-resolve`. When it returns true, ignore `isHovered` and always render the resolved frame.
- Do not reuse `figures/pause-confidence.tsx`. That figure is an article-width diagram with labels and a two-row comparison. This glyph borrows only the idea.
- Export from `glyphs/index.ts`. Do not wire it into `work.ts`; the surface is undecided and `video` must stay untouched.
