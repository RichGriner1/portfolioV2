# Social content system — map & how it works

> **Where am I?** `content/` = home · `social/` = the work (you are here) · `content-os/` = the factory.

This folder is the **social publishing pipeline**: where post copy lives, how it's scheduled, and how it gets programmed into Typefully. If you're ever unsure where something is, start here.

## The three layers

1. **Batches = the copy (source of truth).**
   Every post's text lives in a batch file: `content/social/<pillar>/YYYY-MM-DD-<topic>-batch.md`.
   Each batch holds numbered `**Standalone X — label**` blocks (tweets) and, where written, `### LinkedIn post` sections. **Never keep post copy anywhere else** — the schedule and review sheets only *point* at these.

2. **[backlog.md](backlog.md) = the schedule.**
   Two tables: `## Daily posting schedule` (tweets, 2/weekday) and `## LinkedIn schedule` (Mon shorts + Wed blogs). Each row links to a batch anchor + Standalone letter. It schedules; it never duplicates copy.

3. **Scripts = the automation** (`../../scripts/`):
   - [`typefully-push.mjs`](../../scripts/typefully-push.mjs) — thin Typefully **API v2** client (one draft in, optionally scheduled, per platform).
   - [`typefully-schedule-backlog.mjs`](../../scripts/typefully-schedule-backlog.mjs) — reads backlog → pulls copy from batches → schedules drafts. Modes: default (tweets), `--linkedin`. Flags: `--print` (preview copy), `--send` (post; else dry-run), `--from/--to`, `--limit`.

## Review sheets (generated, gitignored — never edit)

- `SCHEDULE-REVIEW.md` — every tweet with full copy, in date order. Regenerate: `node scripts/typefully-schedule-backlog.mjs --print > content/social/SCHEDULE-REVIEW.md`
- `LINKEDIN-REVIEW.md` — same for LinkedIn Mondays (`--linkedin --print`).

## Directory

```
content/social/
  README.md            ← this file
  backlog.md           ← the schedule (tweets + LinkedIn) + workflow rules
  process/             ← batches (pillar: practitioner "here's what I did")
  authority/           ← batches (pillar: quiet-conviction POV)
  breakdown/           ← batches (pillar: critic-not-cynic)
  SCHEDULE-REVIEW.md   ← generated, gitignored
  LINKEDIN-REVIEW.md   ← generated, gitignored
```

Related: **`../content-os/`** (the factory) holds the upstream *system* — story bank, voice guide + examples, frameworks, templates. **`content/voice.md`** is the voice rulebook every draft must pass.

## The loop (how a post gets out)

1. **Draft** into a batch file (voice from `content/voice.md` + `content-os` examples).
2. **Voice-check** with the `voice-keeper` agent.
3. **Schedule** — add a row to `backlog.md` pointing at the anchor + letter.
4. **Program** — `node scripts/typefully-schedule-backlog.mjs --send` (tweets) / `--linkedin --send`.
5. **Weekly edit** — one day/week, review the coming week, edit, and log corrections back into `content/voice.md` so mistakes don't repeat.

## Key facts

- **Secret:** `TYPEFULLY_API_KEY` lives in `~/.zshrc` only (public repo — never commit it).
- **Typefully social set:** `317077` (Richdesigns4u). Auto-discovered by the scheduler.
- **Cadence:** tweets 2/weekday (09:00 + 14:00 Madrid); LinkedIn Mon short (auto) + Wed blog (manual, with a visual).
- **Editing model:** once a draft is pushed, edit it *in Typefully* (batch edits don't reach pushed drafts). Lock copy before pushing. See [`../../CLAUDE.md`](../../CLAUDE.md) and memory `feedback-content-creation-loop`.
- **Currently programmed:** tweets → 2026-09-22, LinkedIn Mondays → 2027-01-25.
