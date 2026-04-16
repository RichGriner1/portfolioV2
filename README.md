# portfolioV2

Richard Griner's portfolio for 2026 — open source, built as a design-systems playground.

## Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19)
- **Language:** TypeScript (strict)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with a layered design-token system (primitives → semantic → component)
- **Components:** [shadcn/ui](https://ui.shadcn.com) on top of [Base UI](https://base-ui.com) primitives
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes) — light / dark / system, class-based
- **Typography:** Geist (sans), Geist Mono (mono), Instrument Serif (display), all self-hosted via `next/font`
- **Analytics:** Vercel Analytics + Speed Insights
- **Hosting:** [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with Turbopack on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier + Tailwind class sort (writes) |
| `npm run format:check` | Prettier check (no writes) |

## Project structure

```
portfolioV2/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Fonts, ThemeProvider, metadata, analytics
│   │   ├── page.tsx          # Landing (placeholder sections for now)
│   │   └── globals.css       # Design token architecture — the heart of the DS
│   ├── components/
│   │   ├── ui/               # shadcn components (owned code, edit freely)
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── site-header.tsx
│   │   └── site-footer.tsx
│   └── lib/
│       └── utils.ts          # cn() helper
├── content/                  # Content engine (see AGENTS.md)
│   ├── journal/              # Raw brain-dumps (gitignored)
│   ├── drafts/               # In-progress posts
│   └── published/            # Ready-to-ship posts, split by pillar
│       ├── process/
│       ├── breakdown/
│       ├── authority/
│       └── experiment/
├── .claude/
│   ├── agents/               # Multi-agent Claude Code workflow
│   └── commands/             # Slash commands (/journal, /polish)
├── AGENTS.md                 # Instructions for AI coding agents
└── CLAUDE.md                 # @AGENTS.md shim
```

## Design tokens

The design system lives in [`src/app/globals.css`](src/app/globals.css) with a three-layer architecture:

1. **Primitives** — raw OKLCH values, ms durations, rems
2. **Semantic tokens** — role-based aliases (`--background`, `--primary`, `--muted`, ...)
3. **Component tokens** — added by shadcn components as needed

Light theme lives in `:root`, dark theme in `.dark`. Theme-switching is class-based, toggled by `next-themes`. All tokens are exposed to Tailwind via `@theme` — so you can write `bg-background`, `rounded-md`, `shadow-lg` and they respond to the active theme.

## Workflows

This repo uses a multi-agent [Claude Code](https://claude.com/claude-code) setup — see [AGENTS.md](AGENTS.md) for the full explanation. Two loops are defined:

- **Dev loop** — `code-writer` → `test-runner` → `code-reviewer` auto-hands off on every feature/fix.
- **Content loop** — `/journal` invokes a scribe that captures end-of-day thoughts; `/polish <file>` hands a journal entry to an editor to shape it into a publishable post.

## License

MIT — see [LICENSE](LICENSE) (to be added).
