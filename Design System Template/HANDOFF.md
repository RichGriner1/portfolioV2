# Design System Template — Handoff

> **Read this first if you're a Claude session picking up where another one left off.**
> Everything you need to continue the build is in this file.

## What we're building

A portable, black-and-white design system that can be **copied into other repos as a starting point**. The "Design System Knowledge Graph" image (in the project root) defines six sources — `design`, `foundations`, `components`, `states`, `usage-rules`, `accessibility` — that we're upgrading into **Claude Skill folders** so the AI conventions travel with the kit.

The kit lives at `src/design-system/` and is the thing you actually copy when extracting. The Next.js scaffold around it (`src/app/`, `package.json`, etc.) is the "test car body" — it exists so you can `pnpm dev` and see the kit render. Don't copy the scaffold when extracting.

## Where we are right now

**Step 2 (Foundations) complete, with Round 2 polish on tooltips + chip metadata.**

What's shipped:
- W3C Design Tokens JSON as source of truth, zero-dep build script compiles to CSS
- 7 primitive color ramps: `primary`, `surface`, `control`, `red`, `green`, `amber`, `blue` — all 50→950 (77 hex values total)
- Dimensions scale: 1 unit = 1px (`--spacing: 0.0625rem`), values `0, 1, 2, …, 10, 12, 14, …, 20, 24, …, 256`
- Breakpoints: `xs:480, sm:640, md:768, lg:1024, xl:1280, 2xl:1536`
- Radius, shadow, motion (durations + easings), font primitives
- Semantic layer: 40 tokens × 2 themes (light + dark), all referencing primitives
- Validator page at `src/app/page.tsx` (localhost:3000) — shows every token with primitive ref + hex code + usage tooltips

Tasks completed (from `TaskList`):
1. ✅ Create branch `design-system-template` off `main`
2. ✅ Scaffold empty shell (package.json, tsconfig, next.config, folder tree)
3. ✅ Foundations — pick OKLCH ramp + map semantic slots (light + dark)

Tasks still pending:
4. `cn()` + lib utilities
5. Primitives — Box, Stack, Text, Icon, Slot
6. First component: Button (sets the pattern)
7. Remaining components — Input, Card, Badge, Dialog, Tabs, Switch
8. Skills layer — 6 SKILL.md + reference files
9. Scaffold UI — showcase page
10. Extraction dry-run + README + AGENTS.md

## File map

```
Design System Template/
├── HANDOFF.md                         ← you are here
├── package.json                       ← Next 16, React 19.2, Tailwind v4, @base-ui/react, motion
├── tsconfig.json                      ← @/* → src/*
├── next.config.ts                     ← turbopack root pin
├── postcss.config.mjs                 ← @tailwindcss/postcss
├── eslint.config.mjs
├── components.json                    ← shadcn config (base-nova preset)
├── .npmrc                             ← verify-deps-before-run=false (pnpm 11 fix)
├── .claude/
│   ├── launch.json                    ← preview server config (pnpm dev on :3000)
│   └── skills/                        ← Step 7: 6 skill folders (design/foundations/components/states/usage-rules/accessibility)
├── scripts/
│   └── build-tokens.mjs               ← zero-dep Node script, compiles JSON → CSS
└── src/
    ├── app/
    │   ├── layout.tsx                 ← minimal Next root
    │   ├── page.tsx                   ← VALIDATOR — every token visualized with primitive + hex
    │   └── globals.css                ← @imports tokens.css
    └── design-system/
        ├── tokens/
        │   ├── primitives.json        ← SOURCE — primitives (color ramps + dimensions + radii + motion + shadow + breakpoints + fonts)
        │   ├── semantic-light.json    ← SOURCE — light-theme semantic mapping
        │   ├── semantic-dark.json     ← SOURCE — dark-theme semantic mapping
        │   └── tokens.css             ← GENERATED — do not edit
        ├── primitives/                ← Step 4: empty
        ├── components/                ← Step 5+6: empty
        └── lib/                       ← Step 3: empty
```

## Decisions locked in (don't relitigate)

**Architecture:**
- Three-layer token model: primitives → semantic → component-scoped
- W3C Design Tokens JSON as source. Custom Node build script (no Style Dictionary). Figma sync via Tokens Studio plugin reads the same JSON.
- Tailwind v4 with `@theme` block; semantic colors use `var()` refs (for dark-mode override), breakpoints/radii/etc. emit literal values (because `@media` queries can't resolve `var()`).
- `@custom-variant dark (&:is(.dark *))` — class-based dark mode via `.dark` on `<html>`

**Color palettes (4 sets):**
- **`primary`** = brand ramp (white-label hook). Today: pure grayscale `#fafafa → #242424`.
- **`surface`** = warm grays (Tailwind v4 stone palette OKLCH). For backgrounds, cards, popovers, muted surfaces, and text on those surfaces.
- **`control`** = pure neutral grays (Tailwind v4 neutral palette OKLCH). For input borders, disabled states, focus ring, dividers.
- **`red`/`green`/`amber`/`blue`** = status hues, all 50–950, all Tailwind v4 default values.

**Semantic naming:**
- `--primary` (not `--accent`) for the default brand action. Matches shadcn/Material/Polaris convention.
- `--error` and `--destructive` are SEPARATE semantic tokens pointing at the same red ramp default. Error = state, Destructive = action.
- Full status hovers: `success-hover`, `warning-hover`, `info-hover`, `destructive-hover`, `destructive-active`.
- Skipped: `--secondary` (deferred until brands need it).

**Workflow:**
1. Edit JSON → `pnpm tokens:build` → CSS regenerates → page hot-reloads
2. Figma stays in sync via Tokens Studio plugin (when user wires it up)
3. Light + dark themes are both in JSON; build script emits `:root` (light) + `.dark` (override) + `@theme` (Tailwind bridge)

**User preferences (from this build's conversation):**
- Step-by-step pace with checkpoints — don't race ahead autonomously, even in auto-mode
- Build-in-public posts noted at each step. To draft when we reach Step 7 (skills layer): "JSON vs CSS vs SCSS for design tokens", "Why Control and Surface are different palettes", "Error vs Destructive: state vs action", "OKLCH for design tokens"
- Tooltips should be "overview sentence + bulleted examples" format (already implemented)
- Spanish must read as Peninsular (see memory: `feedback-spanish-peninsular.md`)
- Push remotes: this repo uses `origin` (github.com/RichGriner1/portfolioV2). Memory note about avoiding `origin` applies to Afi work repos, not this one.

## How to pick up

```bash
# 1. Verify state
cd "/Users/richardgriner/Desktop/Code/Portfolio/portfolioV2/Design System Template"
git branch --show-current     # should be: design-system-template
git status                    # check for uncommitted changes

# 2. Boot the dev server
pnpm dev                      # → http://localhost:3000

# 3. Visit the validator. You should see:
#    - Header with toggle dark/light button
#    - 22 semantic chips (each showing primitive ref + hex)
#    - Border + ring tokens (5)
#    - 7 primitive ramps (each step shows step number + hex)
#    - 9 radius shapes, 6 shadow boxes, 12 motion chips, spacing scale, breakpoint reader

# 4. When you change tokens:
#    edit src/design-system/tokens/{primitives,semantic-light,semantic-dark}.json
#    pnpm tokens:build
#    (CSS hot-reloads in the running dev server)
```

## Where the plan lives

The original plan file is at `~/.claude/plans/read-this-photo-design-quiet-pudding.md` on this machine. It contains the full step-by-step build sequence (steps 3–9), critical files, verification steps, and the collaborative-build checkpoint guidance.

If a new Claude session can't see it (different machine, different OS user), the build sequence is summarized above in "Tasks still pending."

User auto-memory is at `~/.claude/projects/-Users-richardgriner-Desktop-Code-Portfolio-portfolioV2/memory/`. Same caveat.

## Conventions the next agent should keep

- **No bare CSS values in components** (no hardcoded colors, radii, shadows, motion). Components only consume semantic tokens via Tailwind utilities (`bg-primary`, `text-foreground`, `rounded-lg`, etc.) or via `var(--token)` in inline styles.
- **No new primitive added without a sibling semantic update.** Every new primitive should be intentional; if it's not referenced semantically, it doesn't belong.
- **Variant systems use CVA** (`class-variance-authority`). Already a dep.
- **Class merging uses `cn()`** — to be written in Step 3 at `src/design-system/lib/utils.ts` as `twMerge(clsx(args))`. (`tailwind-merge` and `clsx` are already deps.)
- **Interactive components** use `@base-ui/react` (already a dep), not Radix.
- **Component DOM uses `data-slot` attributes** for semantic structure (Button has `data-slot="button"`, Card has `data-slot="card"`, etc. — same pattern as shadcn).
- **State models** for components: `default`, `hover`, `active`, `focus-visible`, `disabled`, `error` — semantic tokens already exist for all of these.

## Next step (Step 3)

1. Write `src/design-system/lib/utils.ts` with `cn()` — `twMerge(clsx(...))`. About 5 lines.
2. Add `next-themes` provider so the dark-mode toggle survives page reload. Currently the validator uses local `useState` which resets on every reload.
   - Create `src/design-system/theme/theme-provider.tsx` wrapping `next-themes`
   - Use it in `src/app/layout.tsx`
   - Update `src/app/page.tsx` to read theme via `useTheme()` instead of local state

Total: small, low-risk. ~15 minutes. Checkpoint: confirm with the user that the toggle persists across reloads, then proceed to Step 4 (primitives: Box, Stack, Text, Icon, Slot).
