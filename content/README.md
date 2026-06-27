# Content

This is where writing lives. Four stages, four pillars.

## Stages (directories)

- **`journal/`** — raw end-of-day brain-dumps. **Gitignored** (private, local-only).
  Created by the `scribe` agent via `/journal`.
- **`drafts/`** — entries with structure, not yet polished. Committed to the repo.
- **`published/`** — ready to ship. Rendered on the portfolio site.
- **`social/`** — short-form copy for LinkedIn + Twitter, derived from a published post.
  Created by the `syndicator` agent via `/syndicate`.

The voice rulebook at [voice.md](voice.md) is the source of truth for tone — every agent that writes in Richard's voice reads it before drafting. It opens with the **substance bar**: whether a post is worth posting, checked before tone. Reusable post **formats** live in the content-os system at [content-os/05-content-production/](../content-os/05-content-production/).

For the step-by-step "how to actually use this" — what to type, what each agent will ask, what to do when something goes wrong — see [runbook.md](runbook.md).

## Pillars (subdirectories of `drafts/` and `published/`)

| Pillar | What belongs here |
|---|---|
| **`process/`** | How you work — workflows, methods, tooling, "how I did X" |
| **`breakdown/`** | Deconstructions — design reviews, teardowns, analysis of things you admire or dislike |
| **`authority/`** | Points of view — design-systems philosophy, opinions, long-form takes that establish signal |
| **`experiment/`** | Seeds for prototypes — ideas you want to build. These get promoted to standalone repos |

## Frontmatter

### Long-form (journal, drafts, published)

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

### Short-form (social)

```yaml
---
title: "<source post title>"
source: published/<pillar>/<slug>.md
pillar: <pillar>
stance: educator | builder | noticer
status: draft              # draft | ready | scheduled | posted
created: 2026-04-27
posted_at:                 # filled when posted
typefully_ids:             # filled by /push when drafted/scheduled to Typefully
  linkedin:
  twitter:
---
```

## Flow

1. Thought strikes → run `/journal` → scribe captures it in `journal/YYYY-MM-DD-slug.md`
2. Weeks later, revisit the journal → run `/polish journal/<file>.md` → editor agent drafts a version into `drafts/<pillar>/<slug>.md`
3. You revise by hand → move to `published/<pillar>/<slug>.md` when ready
4. Once published, run `/syndicate published/<pillar>/<slug>.md` → syndicator drafts LinkedIn + Twitter copy to `social/<pillar>/<slug>.md`. Voice-keeper lints; post-reviewer checks hook + stance. You revise, flip `status: ready`, post manually.
5. For `experiment/` entries — when you're ready to actually build, spin up a dedicated repo (or ask Claude to `/spawn-experiment`, later)

For ad-hoc voice checks on any markdown file, run `/voice-check <file>` — spawns the voice-keeper without the rest of the syndication chain.

See [`AGENTS.md`](../AGENTS.md) at the repo root for agent details.
