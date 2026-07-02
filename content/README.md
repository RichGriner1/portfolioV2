# Content — the live home

**`content/` (this folder) is where content actually lives and ships.** There's a sibling folder, `content-os/`, at the repo root — here's the mental model so you never mix them up:

- **`content/` = the product + the pipeline.** The real writing, and the live social system we schedule from. **This is where the action is.**
- **`content-os/` = the factory.** Templates, frameworks, story bank, voice *examples*, prompts — *how* content gets made. It holds no live posts.

> **Rule of thumb:** making or scheduling a post → work in **`content/`**. Need a template or framework → grab it from `content-os/`.

## Where things live (mental model: a pipeline, capture → ship)

| Folder | What it is | Stage |
|---|---|---|
| **`social/`** ⭐ | **The live area.** Scheduled LinkedIn + X posts (the batches), `backlog.md` (the schedule), the Typefully automation, and outreach. **Start here** → [social/README.md](social/README.md). | **ship** |
| `journal/` | Raw end-of-day brain-dumps. **Gitignored** (private, local-only). | capture |
| `drafts/` | Long-form entries being shaped, by pillar. Committed. | shape |
| `published/` | Long-form that's ready / rendered on the site, by pillar. | publish |

## Voice — one canonical file

[**`voice.md`**](voice.md) is **THE canonical voice rulebook** — the one every agent (`voice-keeper`, `syndicator`, etc.) actually reads. It opens with the **substance bar** (is it worth posting?) before tone. The expanded version with example screenshots + provenance tags lives at [content-os/02-voice-guide/](../content-os/02-voice-guide/) — that's **reference only**; if the two ever disagree, `voice.md` wins.

For the step-by-step how-to (what to type, what each agent asks), see [runbook.md](runbook.md).

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
