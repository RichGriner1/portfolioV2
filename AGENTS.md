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
2. **`test-runner`** ([.claude/agents/test-runner.md](.claude/agents/test-runner.md)) — runs `npm run lint` → `npm run build` → `npm test` (if present) → `npm run format:check`. Read-only. Reports `file:line` failures.
3. **`code-reviewer`** ([.claude/agents/code-reviewer.md](.claude/agents/code-reviewer.md)) — reviews the uncommitted diff for correctness, security, token/DS violations, Next.js 16 convention violations, and over-engineering. Read-only. Returns `ship | revise | rewrite`.

The orchestrator invokes them in order. If `test-runner` fails, it routes back to `code-writer` with the failure. If `code-reviewer` returns `revise` or `rewrite`, same. Do not skip steps.

## Content workflow (writing)

Two subagents + two slash commands. See [content/README.md](content/README.md) for the stage model (journal → drafts → published) and the four pillars (process / breakdown / authority / experiment).

- **`/journal`** → spawns **`scribe`** ([.claude/agents/scribe.md](.claude/agents/scribe.md)). End-of-day capture: 2–4 structured questions, writes to `content/journal/YYYY-MM-DD-<slug>.md`. **`content/journal/` is gitignored** — raw notes are private.
- **`/polish <journal-file>`** → spawns **`editor`** ([.claude/agents/editor.md](.claude/agents/editor.md)). Shapes the strongest section of a journal entry into a draft at `content/drafts/<pillar>/<slug>.md`. Preserves voice. Never writes to `content/published/` — that move is manual.

`experiment/` pillar entries are seeds for side projects. When one is ready to build, spin up a dedicated repo — the experiment doesn't live inside portfolioV2.

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
  agents/             # subagent definitions (code-writer, test-runner, code-reviewer, scribe, editor)
  commands/           # slash commands (/journal, /polish)
```

## When in doubt

- Next.js question → read `node_modules/next/dist/docs/` first.
- Token / styling question → read [src/app/globals.css](src/app/globals.css) first.
- Content flow question → read [content/README.md](content/README.md) first.
- Don't invent a new convention. If the existing code doesn't cover your case, ask.

