# Whitelabel DS → portfolioV2: audit

Date: 2026-11-27. Report only. No code changed.

**What this covers:** how portfolioV2 compares with the Whitelabel DS on motion, tokens and components, and what to bring in without changing how the site looks.

**Sources read:**
- Portfolio: `src/app/globals.css`, `src/components/**`, `src/lib/**`, on branch `case-study/third-party-compliance`. That branch has 6 uncommitted files, and this audit read them as they are on disk.
- DS: `~/Desktop/Code/WhitelabelDesignsystem/src/styles/tokens/*.css` and `src/components/**`.
- Not counted: the preview and lab routes (`playground`, `_playground`, `design-system-audit`, `hero-preview`, `figures-preview`).

---

## Summary

1. **The portfolio already has most of the DS structure.** Its tokens use three layers: primitives, roles and components. Its motion tokens already include the reveal tiers (light, normal, heavy), the enter curve and the popup extrude. These came from Coherence and the Afi apps DS, the same source the Whitelabel DS came from. Step 2 is about filling gaps, not rebuilding.
2. **The biggest problem is a second motion system in JavaScript.** CSS animations read the tokens. The Motion library (`motion/react`) animations don't: they use their own constants and about **350 hard-coded durations, delays and curves**. 128 of those are in one file, `case-study-bento.tsx`, which has 4,673 lines.
3. **The DS values must not be copied.** The DS runs slower than the portfolio. Its basic duration is 400 ms, and the portfolio's is 200 ms. If we take the DS values, every hover and menu on the site will feel different. We take the DS's names and roles, and fill them with the portfolio's own values.
4. **Colours are mostly clean.** Hard-coded colours sit in 6 files, and two of them are intentional: the `.ds-scope` methodology page and the token figures that show colour values. The one real problem is `case-study-bento.tsx`, with 33 raw colours and 11 Tailwind palette classes.

---

## 1. Motion tokens

### What the portfolio has

| Role | Portfolio token | Value |
|---|---|---|
| Fast / base / slow | `--duration-fast` / `-base` / `-slow` | 120 / 200 / 320 ms |
| Colour crossfade | `--duration-slower` | 500 ms |
| Full-screen wipe | `--duration-sweep` | 700 ms |
| Popup enter | `--duration-enter` + `--ease-enter` | 150 ms, `(0.16, 1, 0.3, 1)` |
| Default curve | `--ease-out-soft` | `(0.2, 0.8, 0.2, 1)` |
| Move | `--ease-in-out-soft` | `(0.45, 0.05, 0.15, 1)` |
| Spring | `--ease-spring` | `(0.34, 1.56, 0.64, 1)` |
| Reveal tiers | `--duration-reveal-*`, `--reveal-rise-*`, `--reveal-stagger-*`, `--reveal-blur-*` | Same values as the DS |

### What the DS has that the portfolio lacks

| DS role | DS token | What it's for | Portfolio today |
|---|---|---|---|
| **Close / exit** | `--motion-easing-close`, `--motion-duration-close` (300 ms) | Anything that closes or leaves: menus, popovers, dialogs, toasts. A faster curve that accelerates away. | Missing. Exits reuse the enter curve, so closing feels like opening played backwards. |
| **Press** | `--mo-dur-press` (80 ms) | Instant feedback when a button or card is pressed | Missing |
| **Fold** | `--motion-duration-fold` (450 ms) | Accordions and expanding rows | Missing |
| **Real spring** | `--mo-ease-out-spring` as `linear(...)` | A real damped spring in CSS, with a cubic fallback | The portfolio's spring is a cubic curve with one overshoot. Springs in JS use Motion's own physics. |
| **Ambient loop** | `--motion-duration-ambient-loop` (10 s), `--motion-easing-ambient` | Slow background loops | Missing. The shimmer button sets its own 3 s. |
| **Decode** | `--motion-decode-duration`, `--motion-decode-blur` | Text that scrambles into place | Missing. `magicui/hyper-text.tsx` has 4 raw values. |
| **Spinner** | `--mo-dur-spin` (800 ms) | One turn of a loader | Not needed yet |

### Naming
The DS uses `--motion-duration-*` and `--motion-easing-*`. The portfolio uses `--duration-*` and `--ease-*`. **Keep the portfolio names.** They are what Tailwind turns into classes (`ease-out-soft`), and renaming would touch every component. Record the matching DS name next to each token in a comment.

### The JavaScript gap (the main job)
- `src/components/motion/constants.ts` holds `EASE`, `EASE_SOFT`, `SPRING_SOFT` and `SPRING_SNAP`. `EASE` equals `--ease-out-soft`. `EASE_SOFT` `(0.32, 0.72, 0.18, 1)` has **no CSS token**.
- `case-study-bento.tsx` keeps its own copy of those constants. Its file comment says so.
- Durations in JS are typed by hand everywhere (`duration: 0.35`, `delay: n.id * 0.07`), so they drift from the CSS scale. 0.25, 0.3, 0.35, 0.4, 0.5, 0.6 and 0.7 all appear.
- `src/lib/motion/` exists but is empty.

**Fix in step 2:** create one JS motion module in `src/lib/motion/` with the same durations, curves, springs and reveal tiers as `globals.css`. Then point `constants.ts` and the bento's copy at it. Snap the hand-typed numbers to the nearest token only where the change can't be felt. Leave the rest with a comment for a later pass.

### Raw motion values by file (top 12 of ~350)

| Count | File |
|---|---|
| 128 | `components/case-study-bento.tsx` |
| 24 | `components/motion/glyphs/design-system.tsx` |
| 15 | `components/site-header.tsx` |
| 15 | `app/canvas/canvas-site.tsx` |
| 13 | `components/motion/figures/pause-confidence.tsx` |
| 13 | `components/breathing/exercises.ts`. Breathing timings are content, so leave them. |
| 10 | `components/motion/figures/token-cost.tsx` |
| 9 | `components/motion/figures/token-cascade.tsx` |
| 8 | `components/motion/glyphs/whitelabel.tsx` |
| 8 | `components/motion/figures/use-anywhere.tsx` |
| 8 | `components/canvas/canvas-rail.tsx` |
| 7 each | `glyphs/siblings`, `glyphs/layout-grammar`, `glyphs/breathing` |

Some of these are choreography inside one illustration, such as "dot 3 arrives at 1.2 s". Those are timings for a piece of content, not system values. They can stay, as long as the curve comes from a token.

---

## 2. Token structure

| Area | Portfolio | DS | Gap |
|---|---|---|---|
| Colour roles | shadcn set plus hover/active for primary and secondary | Full state set: hover, active, subtle, ghost, disabled, control, success, warning, info, error | The full set exists only inside `.ds-scope`, which is the methodology page. The main site has no success, warning or info roles. That's fine today, but the new case study may need them. Add them **only if** it does. |
| Radius | One base (`--radius` 10px) with every step calculated from it | Fixed steps, 2 to 12px, plus `full` | Keep the portfolio's way. It's what makes `.bento-frame` work. |
| Shadows | `--shadow-xs` to `-xl`, tuned per theme | `--elevation-1` to `-6` plus **roles**: `card`, `tooltip`, `menu`, `drawer`, `dialog`, `sticky` | Add the role names as aliases of the existing shadows, for example `--shadow-menu: var(--shadow-md)`. Same look, and components say what they are. |
| Spacing | Tailwind's default 4px scale (1px inside `.ds-scope`) | Own dimension scale | No change |
| Type | Geist via next/font, `--font-display` | Inter | No change. The portfolio keeps Geist. |

### `.ds-scope`: two copies of the DS idea
`globals.css` lines 619 to 844 hold a full copy of the older "Design System Template" palette, scoped to the methodology Color page. The repo also has a `Design System Template/` folder. Neither one is the Whitelabel DS. **Decision for later:** should the methodology page move to the Whitelabel DS tokens? Not part of step 2.

### Hard-coded colours

| Count | File | Verdict |
|---|---|---|
| 33 + 11 Tailwind palette | `components/case-study-bento.tsx` | Fix: map to roles |
| 9 | `components/motion/figures/token-levels.tsx` | Probably intentional, since the figure shows colour values. Check. |
| 3 + 2 | `app/methodology/color/*` | Intentional (DS page) |
| 2 | `lib/content/work.ts` | Check: card accent data? |
| 1 | `components/magicui/shimmer-button.tsx` | Check |
| 1 Tailwind palette | `components/magicui/dot-pattern.tsx` | Fix |

### Hard-coded radius and shadows
`case-study-bento.tsx` (6), `magicui/shimmer-button.tsx` (5), `ui/button.tsx` (4), `canvas/canvas-site.tsx` (4), `motion/crab-dots.tsx` (2), `intro-preview-link.tsx` (2), `canvas/canvas-help.tsx` and `canvas-cursor.tsx` (1 each). These are small and get fixed in the same pass.

---

## 3. Components

The portfolio has 6 shadcn components in `ui/` (badge, button, card, dropdown-menu, separator, sonner) plus its own pieces. The DS has about 120.

### The portfolio already has these. Keep them, and align their motion with the DS.

| Portfolio | DS equivalent | Note |
|---|---|---|
| `tpc/reveal.tsx` | `display/Reveal` | Already reads the reveal-tier tokens. **Best candidate to become the one reveal.** |
| `motion/blur-fade.tsx` (5 uses) | `display/Reveal` | Second reveal with its own timing. Merge into the one above. |
| `ui/dropdown-menu.tsx` + `.popup-extrude` | `navigation/Menu`, `MenuDropdown` | Same extrude idea. Add the close curve. |
| `ui/sonner.tsx` | `overlays/Toast` | Keep sonner. Use the close curve on exit. |
| `ui/badge.tsx`, `ui/card.tsx`, `ui/button.tsx`, `ui/separator.tsx` | `Badge`, `Card`, `Button`, `Separator` | Keep the shadcn versions. Add press timing to button and card. |
| `magicui/hyper-text.tsx` | decode tokens | Use the decode tokens |
| `cv-modal.tsx` | `overlays/Dialog` | Check its enter and exit against dialog motion |

### The DS has these, the portfolio doesn't, and a case study may want them
Bring one in only when a case study needs it, restyled with portfolio tokens. Nothing is copied ahead of time.
- **Display:** `AnimatedNumber`, `MetricCard`, `KpiTrendCard`, `MediaCard`, `Accordion`, `SummaryList`
- **Charts:** `BarChart`, `LineChart`, `DonutChart`, `StackedBarChart`, `Sparkline`, `ComparisonMeter`, `Legend*`
- **Patterns:** `ComparisonCard`, `PreviewPanel`, `RowList`
- **Overlays:** `Tooltip`, `Popover`, `Drawer`

### Stays as it is (part of the portfolio's look)
Crab mark and crab dots, the dot cursor, the theme sweep, the shimmer button, the canvas board and its violet and green chrome, the breathing exercises, the `motion/figures` and `motion/glyphs` illustrations (only their curves move to tokens), and the Maryland accents.

### How a DS component gets in
The DS is a React package with its own CSS and `ds-` class names. Installing it as a dependency would bring its look with it. **Recommendation:** for each component a case study needs, rebuild it in `src/components/ui/` the shadcn way, using the DS component as the reference for behaviour and motion. The DS stays the reference. The portfolio stays the product.

---

## 4. Proposed step 2 (needs your OK, not started)

Goal: **no visible change**, except closes getting their own curve. That one change can be felt, so I'd show it to you first.

1. In `globals.css`: add the close, press, fold, ambient and decode tokens, a CSS spring using `linear()`, the shadow role aliases, and a token for `EASE_SOFT`. Note the DS name next to each.
2. In `src/lib/motion/`: create one JS module that matches the CSS tokens. Point `motion/constants.ts` and the bento's constants at it.
3. Merge `blur-fade` into `tpc/reveal`, as one Reveal component.
4. Replace hard-coded colours in `case-study-bento.tsx` and `dot-pattern.tsx` with roles. Replace raw radius and shadow values everywhere.
5. Checks: `lint`, `build`, `check:responsive`, plus before and after screenshots of the home page, one case study and the canvas, in headless Chrome.

About 15 to 20 files. Roughly 2 to 3 hours of work in sessions.

**Left out of step 2:** snapping every illustration's choreography to tokens, the `.ds-scope` methodology page, the success/warning/info roles, and any new DS component. Those wait until the new case study needs them.

## Follow-ups (listed now, not later)
- Decide where the methodology page's tokens should come from: the old template or the Whitelabel DS.
- Commit or park the 6 uncommitted files on `case-study/third-party-compliance` before step 2 starts.
- `portfolioV2-ship2` is a second checkout on `sarevi-resumen`. Step 2 should land in one place only.

---

## Step 2 result (2026-11-27, uncommitted)

Richard chose the DS timing over the portfolio's own, so the values changed as well as the names.

**Done**
- `globals.css`: motion tokens now use the DS timing. Base, fast and slow are 400 ms on `(0.16, 1, 0.3, 1)`. Moves are 800 ms on `(0.7, 0, 0.15, 1)`. Popups enter in 160 ms. New tokens: close (300 ms, its own curve), press, fold, move-spring, ambient, decode, spin and menu stagger. A real `linear()` spring replaces the cubic one where the browser supports it. Popups now close on the close curve. Added shadow role names (`--shadow-card` … `--shadow-dialog`) as aliases.
- `src/lib/motion/index.ts`: the same timing for Motion-library animations. `motion/constants.ts` and the bento now read from it, as do 7 files that typed curves inline. `EASE_SOFT` and the two springs collapse onto the DS's single curve and single spring.
- `blur-fade.tsx`: moved to the DS light reveal tier. The blur goes from 6px to 4px.
- Bento: the terminal and mock-window colours are now named tokens (`--mock-*`) with the same values.

**Checked**
- lint, format and build all pass. `check:responsive` passes: 11 routes × 6 widths, 0 errors.
- 44 full-page screenshots before and after: 11 pages × 1440/390 × light/dark, with reduced motion on. The only differences are in places that also change between two "before" runs: videos and looping animations. Nothing static moved.
- In the browser, the hero button now transitions in 0.4 s on the DS curve.

**Corrections to the audit**
- Most of the bento's raw colours are content, not UI: client brand colours, another product's palette, and white frames behind embeds. They stay.
- The raw radius values are deliberate: shape morphs, circles, shadcn's button clamps and 1–3px chips. Swapping them for tokens would change the look, so they stay.

**Left**
- The individual durations inside illustrations, 300+ of them, still sit in each figure. Their curves now come from the DS.
- `tpc/reveal` was not moved to a shared folder, because it's part of the Compliance work in progress.
- Two bugs found and not fixed, because fixing them changes the look: `case-study-bento.tsx` wraps `--muted-foreground` and `--border` in `hsl()`, but they are OKLCH values. So one pager label (line ~1980) and one 1px ring (line ~3340) don't render as intended.
- The project's `code-reviewer` agent was not run; it isn't available in this session.
- Nothing is committed. `package-lock.json` changed from `npm install` after merging `main`.
