# Process Stages — motion spec

A reference-matched piece: an auto-scrolling vertical rail of "chapter" cards, one per design-process stage, where the card at frame-centre is enlarged, wears Figma-style selection handles, is flanked by its two-word name split left|right, carries a large stage number, and plays a small animation inside it that fits that stage.

Modelled on a reference screen recording the client supplied. Deviations from it are listed at the bottom and are deliberate.

## Envelope

| Field | Value |
|---|---|
| Canvas | 1080×1080 square, full-bleed, opaque |
| Duration | 12.0s |
| FPS | 30 (360 frames) |
| Export | mp4 |
| Text | Yes — stage names + numbers (see legibility note) |
| Loop | Seamless. t=12.000 pixel-identical to t=0.000 |

## Palette — monochrome only, zero hue

`#ffffff` ground · `#f7f7f7` subtle fill · `#e5e5e5` border · `#8e8e8e` mid-grey · `#343434` primary · `#242424` ink

The reference uses saturated colour gradients per chapter. **We do not.** The portfolio's token system is strictly achromatic; introducing hue would break it. Reproduce the reference's atmospheric rhythm with **luminance** instead: each stage gets its own soft radial/linear grey wash (varying between near-white and mid-grey), so the background still visibly "changes mood" as the rail advances, without a single degree of saturation.

## Layout

- **Ground:** full-bleed ambient grey wash. Soft, large-radius, low-contrast — it should feel like light falling, never like a visible gradient band. Crossfades between stage washes.
- **Rail:** a vertical column centred horizontally, ~360px wide, holding all six stage cards stacked with a consistent gap. The rail translates upward continuously so each card passes through frame-centre in turn.
- **Focused card:** the card currently at frame-centre scales up to ~560×560 and gains:
  - a thin selection rectangle with four small square corner handles (Figma selection language — deliberate, since this case study is about a design system)
  - an inner panel carrying the stage's mini-animation
  - the stage number, large, bottom-right of the inner panel
- **Unfocused cards:** smaller (~300×220), lower contrast, no handles, no inner animation running.
- **Flanking labels:** the focused stage's two-word name, split — first word at frame-left, second word at frame-right, both vertically centred on the focused card, `#242424`, generous size.
- **No app chrome.** The reference has a back arrow, a refresh button and pagination dots — those are UI, not content. Omit all three.

## The six stages

| # | Left label | Right label | Mini-animation inside the focused card |
|---|---|---|---|
| 01 | Brand | Strategy | Five small rounded rects fan out from one point into a row — the five personas emerging from one brief |
| 02 | Mood | Boards | A 3×3 grid of tiles fades in scattered, then two tiles brighten and gain a border — sampling references |
| 03 | Design | Principles | Six horizontal rule-lines stack in one by one, top to bottom, each with a short leading tick — a list being written |
| 04 | Design | Tokens | A column of 4 swatch rows; each row's fill sweeps left→right at a different grey value — values resolving |
| 05 | Components | in Code | Three separate bars converge and assemble into one button shape, which then pulses once |
| 06 | Layout | & Charts | A bento layout of 4 cells forms, then a simple bar series draws upward inside the largest cell |

Each mini-animation runs only while its card is focused, plays once, and rests. Keep every one schematic — 3–6 elements maximum, no fine detail. They must read as *gesture*, not illustration, at small size.

## Timing

12.0s ÷ 6 stages = **2.0s per stage**, evenly. Within each 2.0s window:

| Phase | Window (relative) | What |
|---|---|---|
| Arrive | 0.00–0.45s | Rail translates; incoming card scales up to focused size, handles fade in; outgoing card scales down. Labels crossfade. Background wash crossfades. |
| Play | 0.45–1.55s | Mini-animation runs. Rail is still. This is the beat that must feel calm. |
| Rest | 1.55–2.00s | Everything holds. Nothing moves. |

The rail advance therefore happens in a short burst at the start of each window, not continuously — the reference does the same (scroll, settle, read, scroll).

## Motion rules

- **Easing:** `cubic-bezier(0.45, 0.05, 0.15, 1)` for every tween. Zero spring, zero bounce, zero overshoot anywhere.
- **No blur, no glow, no particles, no gradient trails** on any element. The background wash is the only soft thing in the piece.
- Nothing rotates. Every edge stays axis-true.
- Corner radius is constant per element — it never animates.

## Loop

Six stages, then the rail wraps to stage 01. The wrap must be invisible: either duplicate the first card at the end of the rail so the translate is continuous and reset at an identical visual state, or compose the rail as a true cycle. `t=12.000` must be pixel-identical to `t=0.000`. Verify by diffing snapshots at `0.000` and `11.999` — do not assume.

## Implementation constraints

- Single paused GSAP timeline on `window.__timelines`, `class="clip"` + stable ids, `tl.seek(0)` after build.
- `fromTo` tweens only. No bare `tl.set()` used as a loop reset.
- Deterministic — no `Math.random()`, no `Date.now()`. Every offset and value hard-coded.
- Square corners on the canvas root, no inset. The site rounds the tile in CSS; mp4 has no alpha, so baked rounding renders as black wedges.
- Run `npx hyperframes lint .` and `npx hyperframes check .` — both must pass with a live layout/contrast audit. Scope any opt-out narrowly.

## Legibility note — flagged, not solved

At a 350px card thumbnail the stage labels and numbers will not be readable. This piece is designed at the reference's fidelity, which suits a **larger placement** — a hero/feature video on the case study page, or a standalone social asset. If it is used as the small home-grid card, treat the type as texture rather than information, or commission a reduced variant with 2–3 stages and much larger type.
