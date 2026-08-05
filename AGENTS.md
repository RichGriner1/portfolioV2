<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# portfolioV2 — agent brief

Open-source portfolio for Richard Griner (Design System Designer, AI + Fin-tech). Two parallel workflows live in this repo: a **dev loop** for shipping code and a **content loop** for shipping writing. Both are agent-driven.

## Stack

- **Next.js 16** (App Router, Turbopack) — see the Next.js rules block above. Bundled docs at `node_modules/next/dist/docs/` are the source of truth.
- **React 19**, **TypeScript strict**
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/app/globals.css`. No `tailwind.config.ts`.
- **shadcn/ui** (`base-nova` preset) on **Base UI** primitives — **not Radix**. Use the `render` prop (not `asChild`).
- **next-themes** for light/dark/system.
- **Vercel** for hosting (+ `@vercel/analytics`, `@vercel/speed-insights`).

## Design-token rules (non-negotiable)

The token system lives in [src/app/globals.css](src/app/globals.css) in three layers: **primitives** → **semantic** → **component**. Components only touch the semantic layer.

- **Never hard-code colors** in components. No hex, no `rgb(...)`, no Tailwind color utilities like `bg-zinc-50`. Use semantic utilities: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, etc.
- **Never hard-code radii / shadows / motion.** Use `rounded-md`, `shadow-md`, `duration-base`, `ease-out-soft`, etc. — all defined in `globals.css`.
- **If a value doesn't exist in the token system, pause.** Don't invent one inline — either extend the token system (and document it) or ask.

The `code-reviewer` agent blocks PRs that violate these rules.

## Dev workflow (code changes)

Three subagents hand off automatically when you ask the orchestrator (main Claude session) for a code change:

1. **`code-writer`** ([.claude/agents/code-writer.md](.claude/agents/code-writer.md)) — implements the change. Reads before writing. Small diffs. Respects token layering. Defers to shadcn components.
2. **`test-runner`** ([.claude/agents/test-runner.md](.claude/agents/test-runner.md)) — runs `npm run lint` → `npm run build` → `npm test` (if present) → `npm run format:check`. Read-only. Reports `file:line` failures. **If the change touches layout, add `npm run check:responsive`** (see below) — lint and build cannot see a broken breakpoint.
3. **`code-reviewer`** ([.claude/agents/code-reviewer.md](.claude/agents/code-reviewer.md)) — reviews the uncommitted diff for correctness, security, token/DS violations, Next.js 16 convention violations, and over-engineering. Read-only. Returns `ship | revise | rewrite`.

The orchestrator invokes them in order. If `test-runner` fails, it routes back to `code-writer` with the failure. If `code-reviewer` returns `revise` or `rewrite`, same. Do not skip steps.

### Ship gates — every UI change gets checked at every breakpoint

**`npm run check:responsive`** ([scripts/responsive-check.mjs](scripts/responsive-check.mjs)) loads each route shell at 320 / 375 / 390 / 768 / 1024 / 1440px and fails on horizontal page scroll, a box clipped by its own `overflow: hidden`, anything past a viewport edge, or a nav target that is missing, off-screen, or under the 24px tap minimum. It opens the CV modal too, since a closed overlay isn't in the DOM to measure.

This exists because three overflow bugs shipped on 2026-08-05 in one afternoon — the header pushing its controls 17px off the right edge at 320px, the CV modal's unconditional `grid-cols-3`, the contact tile's type overflowing its frame by 41px — and every one of them looked correct at 1280px. **Desktop-only verification does not count as verification.**

Any npm script named `check:*` is a ship gate: `/ship` discovers and runs them before it commits, and a failure stops the ship. Add checks under that prefix and they wire themselves in.

Notes for running it:
- Needs Chrome installed — it drives the system browser via Playwright's `channel: "chrome"` so there's no browser download. `CHROME_CHANNEL=chromium` overrides.
- It reuses a dev server on `:3000` if one is up, otherwise starts its own.
- `-- --widths 320 --routes /` narrows the sweep while chasing one bug; `-- --shots` writes screenshots to `responsive-check-shots/`.
- Findings are `error` (blocking) or `warn` (tap-target judgement calls, mobile widths only, non-blocking).
- Add a route to `ROUTES` when you add a page with a **new layout shell** — not for every case study, since they share one.

## Content workflow (writing)

Six subagents + six slash commands across two stages. See [content/README.md](content/README.md) for the stage model (journal → drafts → published → social) and the four pillars (process / breakdown / authority / experiment). Three canonical rulebooks: [content/brand-guide.md](content/brand-guide.md) is what the brand *is* (positioning, universal truth, personality tests, values — every writer and reviewer reads it), [content/voice.md](content/voice.md) is how it *sounds*, and [content/lexicon.md](content/lexicon.md) is the vocabulary it *owns* (the positive lexicon + signature constructions; voice.md bans, lexicon supplies). Design claims in copy must be consistent with the `design-principles` skill.

### Long-form (journal → drafts → published)

- **`/journal`** → spawns **`scribe`** ([.claude/agents/scribe.md](.claude/agents/scribe.md)). End-of-day capture: 2–4 structured questions, writes to `content/journal/YYYY-MM-DD-<slug>.md`. **`content/journal/` is gitignored** — raw notes are private.
- **`/harvest [pointer] [--source granola|sessions|both]`** → spawns **`harvester`** ([.claude/agents/harvester.md](.claude/agents/harvester.md)). Transcript capture: pulls a Granola meeting (MCP) or a Claude Code session (JSONL on disk, filtered to human-origin messages) and runs the content-os Transcript Processor pass (Keep verbatim / Gold / Still thin) into the same journal format, with `source: granola:<id> | session:<id>` frontmatter. Raw speech register — voice conversion happens at `/polish`. The orchestrator never reads a transcript itself.
- **`/polish <journal-file>`** → spawns **`editor`** ([.claude/agents/editor.md](.claude/agents/editor.md)). Shapes the strongest section of a journal entry into a draft at `content/drafts/<pillar>/<slug>.md`. Asks 1–2 clarifier questions before drafting (Richard speaks in loops sometimes). Preserves voice; harvested journals get the speech→writing conversion. Never writes to `content/published/` — that move is manual. The orchestrator then runs **`voice-keeper`** on the draft (one route-back max) — drafts no longer skip the voice lint.

### Short-form (published → social)

- **`/syndicate <published-file | journal-file | case-study-slug>`** → chains **`syndicator`** → **`voice-keeper`** → **`post-reviewer`**. Mirrors the dev loop (`code-writer → test-runner → code-reviewer`). Published post is the default source; a journal file (for tweet-sized insights with no blog planned — one seed per run, speech→writing conversion for harvested journals) and a case-study slug (post links to `/work/<slug>`) also work.
  1. **`syndicator`** ([.claude/agents/syndicator.md](.claude/agents/syndicator.md)) — reads the published post + `content/voice.md`, asks 2–3 clarifier questions (one-takeaway for LI, Twitter hook, CTA shape), drafts both platforms to `content/social/<pillar>/<slug>.md`. **Never writes "DM me" or freelance pitches on LinkedIn** — Richard has a full-time job.
  2. **`voice-keeper`** ([.claude/agents/voice-keeper.md](.claude/agents/voice-keeper.md)) — read-only lint pass against `content/voice.md`. Banned phrases, AI-tells, construction patterns. Returns `pass | revise`.
  3. **`post-reviewer`** ([.claude/agents/post-reviewer.md](.claude/agents/post-reviewer.md)) — read-only review for hook quality, stance fit, CTA placement, platform conventions. Returns `ship | revise | rewrite`.
- **`/voice-check <file>`** → spawns **`voice-keeper`** alone for ad-hoc checks on any markdown file in Richard's voice.

If `voice-keeper` or `post-reviewer` return non-`ship` verdicts, the orchestrator routes back to `syndicator` with the failures. Do not skip steps.

`/syndicate` ends at a file on disk with `status: draft`. To publish, flip `status: ready` and run **`/push`** ([.claude/commands/push.md](.claude/commands/push.md)) — it drafts/schedules the post to Typefully via its API ([scripts/typefully-push.mjs](scripts/typefully-push.mjs)). Needs `TYPEFULLY_API_KEY` in the environment. `/push` always dry-runs first and asks before a real send; its Typefully API assumptions are flagged `TODO-VERIFY` until confirmed against Typefully's live docs.

`experiment/` pillar entries are seeds for side projects. When one is ready to build, spin up a dedicated repo — the experiment doesn't live inside portfolioV2.

### Case studies (`/case-study`)

- **`/case-study <slug> [--new] [--source <file ...>]`** ([.claude/commands/case-study.md](.claude/commands/case-study.md)) — drafts or updates a bilingual case study in [src/lib/content/case-studies.tsx](src/lib/content/case-studies.tsx) (plus [work.ts](src/lib/content/work.ts) with `--new`). Chains the dev loop (**`code-writer` → `test-runner` → `code-reviewer`**) and then the copy gates (**`voice-keeper` → `content-critic`**) on the changed EN strings. Loads the portable `case-study` skill (structure, WHAT-SO-BENEFIT, quality bar) + `voice-griner`. New/edited ES strings get `// TODO(afi-redaccion)` for the follow-up Spanish pass. Preferred input: a harvested journal — `/harvest` the project retro, then `/case-study <slug> --source content/journal/<file>.md`. Ends at a reviewed diff; committing is manual.

## Directory layout

```
src/
  app/                # Next.js 16 App Router (layout.tsx, page.tsx, globals.css)
  components/
    ui/               # shadcn components — owned code, edit freely
    theme-provider.tsx, theme-toggle.tsx, site-header.tsx, site-footer.tsx
  lib/utils.ts        # cn() helper
content/
  journal/            # gitignored — scribe writes here
  drafts/<pillar>/    # committed — editor writes here
  published/<pillar>/ # committed — manual promotion from drafts
.claude/
  agents/             # subagent definitions (code-writer, test-runner, code-reviewer, scribe, harvester, editor, …)
  commands/           # slash commands (/journal, /harvest, /polish, /case-study, …)
  lib/                # PORTABLE library — published to ~/.claude, used in every project (see below)
```

## Portable skill + loop library (`.claude/lib/`)

Cross-project skills + loops authored here (home base) and **published into user scope** so they work in *any* project (portfolioV2, Coherence/Afi Angular, kt360, …). Model: **skills = knowledge** (`.claude/lib/skills/<name>/SKILL.md`), **loops = process** (`.claude/lib/commands/<loop>.md` — a slash command that loads skills and iterates; there is no `loops/` folder).

- **Publish:** `npm run claude:sync` (dry-run) → `npm run claude:sync:apply` (symlinks each entry of `.claude/lib/{skills,commands,agents}` into `~/.claude/`). Edit here → live everywhere.
- **Why `lib/`, not `.claude/skills/`:** `.claude/skills/` auto-registers as project skills; the symlink would then double-register in this repo. `lib/` is inert locally — user scope is the single registration.
- **Phase 1:** skills `design-principles`, `design-tokens`, `components`, `design-system` (umbrella), `writing-substance`, `case-study`; loops `/ds-cleanup` (DS checker — audit by default, `--fix` to remediate; framework-aware) and `/content-review` (clarity/substance gate). Full details + roadmap: [.claude/lib/README.md](.claude/lib/README.md).
- The project-scoped agents/commands above (dev + content pipelines, `voice-griner`) stay project-only — they're portfolio-specific. The `lib/` items are the portable ones.

## When in doubt

- Next.js question → read `node_modules/next/dist/docs/` first.
- Token / styling question → read [src/app/globals.css](src/app/globals.css) first.
- Content flow question → read [content/README.md](content/README.md) first.
- Don't invent a new convention. If the existing code doesn't cover your case, ask.

