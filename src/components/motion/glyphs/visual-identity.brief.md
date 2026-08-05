---
slug: visual-identity
project: Afi Visual Identity
concept: compile
created: 2026-08-04
status: brief
---

# Afi Visual Identity — motion brief

## Concept
**Verb:** compile
**Metaphor:** A set of screens with no shared system resolves — once, cleanly, in one instrument's pass — into one aligned, running grid, then is quietly rebuilt for the next viewer. Not "loading." Not "animating." The specific feeling of discrete things becoming one governed whole, because that's what actually happened: static Figma screens with no shared definition of "modern" became a token vocabulary and a bento layout running live in code.

## Visual vocabulary
- **A 6-cell bento grid** — `--foreground` / `--muted` rectangles, mixed sizes (one large "hero" cell + five smaller ones), the same asymmetric bento language as the real product's dashboard. This is the *system*.
- **One diagonal straightedge line** — a hairline rule with a short perpendicular tick at each end, like a drafting tool's dimension-line terminator. This is the *instrument*. It is the only thing that moves independently; everything else only changes because it passed. No glow, no gradient trail, no blur, no particles — it must read as a ruler being drawn across a drawing, not a sci-fi scan.
- **Ground:** `--background` (#ffffff), full-bleed, opaque, otherwise empty. Nothing else enters the frame.
- **Ink:** `--foreground` (#242424) for the line and for resolved-state strokes; `--muted-foreground` (#8e8e8e) for static-state strokes; `--muted` (#f7f7f7) for resolved-state fill. Static state has no fill at all — outline only.
- **Count:** exactly 6 cells, 1 line. Nothing else. No text, no cursor, no code brackets, no literal Figma iconography.

## Grid geometry
1080×1080 canvas, content box 720×720 centered (180px margin all sides). Bento layout, 3 cols × 3 rows within the box:

| Cell | Position | Span |
|---|---|---|
| A (hero) | col 1–2, row 1–2 | 2×2, top-left, largest |
| B | col 3, row 1 | 1×1, top-right |
| C | col 3, row 2 | 1×1, mid-right (stacks under B) |
| D | col 1, row 3 | 1×1, bottom-left |
| E | col 2, row 3 | 1×1, bottom-middle |
| F | col 3, row 3 | 1×1, bottom-right |

**Resolved / "running" state — identical rule for all 6 cells:** true grid position (0,0 offset), uniform 20px gutter, 1.5px `--foreground` stroke, `--muted` fill, 4px corner radius (radius never animates — keep it constant so the story stays about alignment, weight, and fill only).

**Static / "before" state — per cell, hand-set, never random, small enough to read as deliberate misalignment rather than a rendering glitch:**

| Cell | Translate offset | Stroke weight | Fill |
|---|---|---|---|
| A | 0, 0 (anchor) | 1.5px `--muted-foreground` | none |
| B | +6, −4 | 1px `--muted-foreground` | none |
| C | −4, +6 | 2px `--muted-foreground` | none |
| D | +5, +3 | 1px `--muted-foreground` | none |
| E | −6, −3 | 2.5px `--muted-foreground` | none |
| F | +3, +5 | 1px `--muted-foreground` | none |

These offsets tell the whole "no system" story through pure alignment discipline: gutters don't share a rhythm, edges over/undershoot their neighbour's line, hairlines vary in weight. Nothing rotates, nothing skews — every edge stays axis-true. Rotation reads as a bug at 350px; inconsistent alignment reads as "nobody agreed on a grid," which is the actual thesis.

## Choreography
This is one gesture told in two passes of the same instrument, not a sequence of separate events. Everything that happens, happens because the line crossed it.

1. **At rest (loop bookends).** Grid sits in the Static table above, completely still — nothing tweens, nothing breathes. Line is fully off-canvas, invisible. This exact frame opens and closes the loop.
2. **Build pass.** The line enters off-canvas at the content box's top-left corner and travels the box diagonal to its bottom-right corner, extending slightly past each corner so it visibly enters and exits. As it crosses each cell's position, that cell resolves from Static to Resolved (position snaps, stroke unifies and darkens, fill fades in) in a single local tween — no bounce, no overshoot. Cells resolve in the order the line reaches them: **A → B → D → C → E → F**, each local resolve ~0.35s with slight overlap into the next, so it reads as one continuous wave rather than six clicks.
3. **Hold — the peak.** Line has exited off-canvas bottom-right, invisible. Grid sits fully resolved: aligned, unified stroke, filled. This is the longest beat and the one most likely to be the frame someone actually sees — nothing moves, let it be seen.
4. **Settle pass.** The line re-enters at the same top-left corner and travels the same diagonal, same direction — never reversed. As it crosses each cell, that cell reverts from Resolved back to Static, in the **same order it resolved** (A → B → D → C → E → F), not the reverse order. This is what makes it read as the system being rebuilt for the next pass rather than a rewind.
5. **Return to rest.** Line exits off-canvas bottom-right, invisible. Grid is back in the exact Static table state — pixel-identical to step 1. Hold briefly, then loop.

## Timing
Total 6.0s, exact split:

| Beat | Window | Duration |
|---|---|---|
| Static hold (head, seam) | 0.0–0.4s | 0.4s |
| Build pass | 0.4–2.4s | 2.0s |
| Running hold (peak) | 2.4–3.8s | 1.4s |
| Settle pass | 3.8–5.6s | 1.8s |
| Static hold (tail, seam) | 5.6–6.0s | 0.4s |

Per-cell resolve windows within the build pass (approximate, overlapping ~0.1–0.15s into the next so the wave reads as continuous):

| Order | Cell | Local window (abs.) |
|---|---|---|
| 1 | A | 0.50–0.85s |
| 2 | B | 0.75–1.10s |
| 3 | D | 0.95–1.30s |
| 4 | C | 1.25–1.60s |
| 5 | E | 1.55–1.90s |
| 6 | F | 1.95–2.30s |

Settle pass mirrors this order (A first, F last) scaled proportionally into its 1.8s window, each local revert ~0.30s.

- **Easing:** `--ease-in-out-soft` (`cubic-bezier(0.45, 0.05, 0.15, 1)`) for every tween — the line's travel and every per-cell local resolve/revert. Zero spring, zero bounce, zero overshoot anywhere in the piece. This is architecture settling, not a UI micro-interaction.
- **Rhythm:** one-shot cycle, seamless loop. `t=6.000` must be pixel-identical to `t=0.000` — same transforms, same stroke weights, same fill, line fully off-canvas and invisible at both ends. Verify by diffing snapshots at `0.000` and `5.999`.

## Hand-off note — this is a HyperFrames composition, not a React component
- **This is a rebuild, not an edit.** `videos/visual-identity-motion/` already exists with a prior attempt (`shot-plan.json`, kinetic-type "MODERN" word treatment, 5 scenes / 8+ discrete beats) — that is the version Richard flagged as reading like a video, not a thumbnail. This brief **supersedes it entirely**. Do not layer onto the existing scenes; start the shot-plan/composition fresh from this brief's grid + line concept. No text anywhere in the new version.
- Route through the HyperFrames `/motion-graphics` workflow (short, design-led, motion-is-the-message, no narration — this fits exactly).
- Canvas 1080×1080, `fps: 30`, `duration_s: 6`, full-bleed opaque `#ffffff`, square corners baked into the root (the site rounds the tile in CSS; mp4 has no alpha, so any baked rounding renders as black wedges — same rule as the prior attempt's `meta.json` correctly noted).
- Palette is the same six neutrals used before: `#ffffff` ground, `#242424` ink/`--foreground`, `#343434` `--primary` (unused in this version unless needed), `#8e8e8e` `--muted-foreground`, `#e5e5e5` `--border` (unused in this version unless needed), `#f7f7f7` `--muted`/fill. No hue.
- Single paused GSAP timeline registered on `window.__timelines`, `tl.seek(0)` after build. Only fromTo tweens on interpolable properties (x, y, opacity, scale, stroke-width or border-width, background-color/fill, clip-path). No bare `tl.set()` for the loop reset — build the tail state as real fromTo tweens (or a duplicated/never-animated layer trick, as the prior attempt did for its own loop) so backward seeks render correctly.
- Deterministic only — no `Date.now()`, no `Math.random()`, no physics. All six per-cell static offsets and stroke weights are hard-coded values from the table above, not generated.
- After building, run `npm run check` inside `videos/visual-identity-motion/` (lint + runtime + layout + motion + contrast) before rendering.

Brief at `src/components/motion/glyphs/visual-identity.brief.md`. Hand off to `code-writer` with: "build the glyph at src/components/motion/glyphs/visual-identity.tsx from the brief" — except note above: given the HyperFrames implementation target, the actual build likely routes through the HyperFrames `/motion-graphics` workflow inside `videos/visual-identity-motion/` rather than `code-writer`. Confirm which path before handing off.
