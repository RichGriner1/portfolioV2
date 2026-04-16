# Content

This is where writing lives. Three stages, four pillars.

## Stages (directories)

- **`journal/`** — raw end-of-day brain-dumps. **Gitignored** (private, local-only).
  Created by the `scribe` agent via `/journal`.
- **`drafts/`** — entries with structure, not yet polished. Committed to the repo.
- **`published/`** — ready to ship. Rendered on the portfolio site (when the reader is wired up).

## Pillars (subdirectories of `drafts/` and `published/`)

| Pillar | What belongs here |
|---|---|
| **`process/`** | How you work — workflows, methods, tooling, "how I did X" |
| **`breakdown/`** | Deconstructions — design reviews, teardowns, analysis of things you admire or dislike |
| **`authority/`** | Points of view — design-systems philosophy, opinions, long-form takes that establish signal |
| **`experiment/`** | Seeds for prototypes — ideas you want to build. These get promoted to standalone repos |

## Frontmatter

Every markdown file starts with YAML frontmatter:

```yaml
---
title: "Why semantic tokens beat primitives for Fin-tech theming"
pillar: authority          # process | breakdown | authority | experiment
status: draft              # idea | draft | ready | published
created: 2026-04-15
tags: [design-systems, tokens, fintech]
seed: journal/2026-04-15-tokens-rant.md   # optional — link back to the source note
---
```

## Flow

1. Thought strikes → run `/journal` → scribe captures it in `journal/YYYY-MM-DD-slug.md`
2. Weeks later, revisit the journal → run `/polish journal/<file>.md` → editor agent drafts a version into `drafts/<pillar>/<slug>.md`
3. You revise by hand → move to `published/<pillar>/<slug>.md` when ready
4. For `experiment/` entries — when you're ready to actually build, spin up a dedicated repo (or ask Claude to `/spawn-experiment`, later)

See [`AGENTS.md`](../AGENTS.md) at the repo root for agent details.
