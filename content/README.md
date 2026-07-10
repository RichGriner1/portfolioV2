# Content

**Everything content-related lives under this one folder.** Two mental buckets, both subfolders here:

- **The work → [`social/`](social/README.md) ⭐** — scheduled X + LinkedIn posts (the batches), `backlog.md` (the schedule), the Typefully automation, and outreach. **Start here.**
- **The factory → `content-os/`** — the operating system: templates, frameworks, story bank, voice *examples*, prompts. *How* content gets made. It holds no live posts.

> **Rule of thumb:** making or scheduling a post → work in **`social/`**. Need a template or framework → grab it from **`content-os/`**.

## The folders (mental model: capture → ship, + the factory)

| Folder | What it is | Role |
|---|---|---|
| **`social/`** ⭐ | Scheduled LinkedIn + X posts (batches), `backlog.md` (schedule), Typefully automation, outreach. → [social/README.md](social/README.md) | **the work** |
| **`content-os/`** | Templates, frameworks, story bank, voice examples, prompts. → [content-os/README.md](content-os/README.md) | **the factory** |
| `journal/` | Raw end-of-day brain-dumps. **Gitignored** (private, local-only). | capture |
| `drafts/` | Long-form entries being shaped, by pillar. Committed. | shape |
| `published/` | Long-form that's ready / rendered on the site, by pillar. | publish |
| `brand-guide.md` | What the brand *is* — positioning, universal truth, personality, values, visual concept. | rules |
| `voice.md` | THE canonical voice rulebook — how the brand *sounds*. | rules |

## Brand + voice — two canonical files

[**`brand-guide.md`**](brand-guide.md) is what the brand *is* — positioning, the universal truth, five personality traits (each with a test), six values, the visual concept. [**`voice.md`**](voice.md) is **THE canonical voice rulebook** — how the brand *sounds*; the one every agent (`voice-keeper`, `syndicator`, etc.) actually reads. It opens with the **substance bar** (is it worth posting?) before tone. Writers read both; brand-guide never overrides voice.md on tone. The expanded, example-backed voice version (screenshots, provenance tags) lives at [content-os/02-voice-guide/](content-os/02-voice-guide/) — **reference only**; if the two ever disagree, `voice.md` wins.

For the step-by-step how-to (what to type, what each agent asks), see [runbook.md](runbook.md).

## Pillars (subdirectories of `drafts/`, `published/`, and `social/`)

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
source: granola:<meeting-id>              # optional — set by /harvest (or session:<session-id>)
captured: 2026-04-16                      # optional — set by /harvest; the date the harvest ran (date = source date)
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

**Long-form pipeline:**
1. Thought strikes → `/journal` → scribe captures it in `journal/YYYY-MM-DD-slug.md`
1b. Meeting or session worth mining → `/harvest` → harvester pulls the Granola transcript (or Claude Code session) and writes the same journal format, plus `source:` frontmatter and the Transcript Processor structure (Keep verbatim / Gold / Still thin)
2. Revisit → `/polish journal/<file>.md` → editor drafts into `drafts/<pillar>/<slug>.md`, then voice-keeper lints the draft automatically
3. Revise by hand (run `/content-review <draft>` before promoting) → move to `published/<pillar>/<slug>.md` when ready
4. `experiment/` entries → when ready to build, spin up a dedicated repo

**Social (the live system):** batches in `social/<pillar>/` hold the copy, `social/backlog.md` schedules it, and the scripts push it to Typefully. Full detail in [social/README.md](social/README.md). For ad-hoc voice checks, `/voice-check <file>`.

See [`AGENTS.md`](../AGENTS.md) at the repo root for agent details.