---
slug: wordpress-shell
project: AI-built sites without leaving WordPress
concept: unlock
created: 2026-04-26
status: brief
---

# AI-built sites without leaving WordPress — motion brief

## Concept
**Verb:** unlock
**Metaphor:** A second layer slides cleanly into position over the first — not replacing it, not merging with it — and the system opens up. Two tracks that never touch, suddenly making something possible that wasn't before.

## Visual vocabulary
- **Base layer (rect, bottom)** — WordPress: stable, immovable, always present. Slightly dimmed at rest.
- **Shell layer (rect, top)** — the Astro front-end: initially offset above its resting position, slides down into alignment on hover.
- **Gap line (stroke)** — a thin horizontal rule between the two rects, appearing after the shell lands. Represents the clean separation: two systems, one interface. Signals "these don't touch — that's the point."
- **Color:** `currentColor` for both layers. Shell layer at full opacity; base layer at ~0.35 opacity to read as "underneath."

## Choreography

1. **At rest (idle).** Shell rect sits ~6px above its locked position. Opacity at 0.6. Base rect is present at 0.35 opacity. Gap line is invisible. Nothing moves.

2. **On hover.** Shell rect eases down into alignment with the base rect (translate Y from –6 to 0). As it lands, opacity rises to 1. Immediately after the shell settles (~80ms after land), the gap line strokes in left-to-right via `stroke-dashoffset`. The base rect brightens slightly (0.35 → 0.6) — it woke up.

3. **Return to rest.** Gap line fades out first (opacity to 0, fast). Shell rect eases back up to its offset position and dims. Base rect returns to 0.35. Smooth, unhurried — like it's waiting to be unlocked again.

## Timing
- **Duration:** `--duration-base` (shell slide) / `--duration-fast` (gap line stroke-in, ~120ms)
- **Easing:** `--ease-out-soft` for the shell landing; linear for the gap line draw
- **Rhythm:** hover-triggered

## Hand-off note to code-writer
- Implement as `src/components/motion/glyphs/wordpress-shell.tsx`
- Size: 64×64 (SVG viewBox 0 0 64 64)
- Two rects, stacked vertically, centered in the viewBox. Suggested dimensions: each rect ~40w × 14h, base centered at y=38, shell at y=18 (with –6px offset at rest becoming y=18 on hover).
- Gap line: a horizontal stroke at the boundary between the two rects (~y=34), drawn via `stroke-dasharray` / `stroke-dashoffset` animation.
- Client component, `motion/react` primitives only
- Use semantic color tokens (`currentColor`) — never hard-coded
- Props: `{ isHovered?: boolean }` — respond to parent hover state via variants
- Stagger: shell lands first, gap line draws after ~80ms delay
