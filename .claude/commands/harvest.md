---
description: Pull content from a Granola meeting or Claude Code session into content/journal/. Spawns the harvester agent — processes the transcript (keep-verbatim, gold lines, still-thin) into a journal capture that /polish consumes.
argument-hint: "[meeting query | date | session-id] [--source granola|sessions|both] [--last N]"
---

Invoke the `harvester` subagent with the source pointer from: `$ARGUMENTS`.

Parse the arguments:
- `--source` — `granola` (default), `sessions`, or `both`.
- `--last N` — take the N most recent (default 1) instead of a named pointer.
- Everything else is the pointer: a meeting title/query, a date, or a session id.

## Selection (only when there's no pointer)

If no pointer and no `--last` was given, list candidates cheaply and ask Richard to pick — **titles and dates only, never transcripts**:

- **granola:** `list_meetings` for the last 7 days → show title + date.
- **sessions:** `ls -t ~/.claude/projects/-Users-richardgriner-Desktop-Code-Portfolio-portfolioV2/*.jsonl | head` → show id + modified time.

Then spawn `harvester` with the chosen pointer. `--source both` → spawn harvester once per source, sequentially.

## Cost guardrail — keep the MAIN thread thin

The orchestrator **never fetches or reads a transcript itself** — not the Granola transcript, not the session JSONL, not a spilled `tool-results/*.txt` file. All of that happens inside harvester's discarded context. Harvester's report comes back as: file path + seed titles + still-thin flags. Act on that; don't re-open anything.

## What harvester does, in short

1. Fetches the transcript (Granola MCP, or the session JSONL filtered to human-origin messages only).
2. Runs the Transcript Processor pass (`content-os/04-interview/granola-processing-prompt.md`): story in order, **Keep verbatim** list, opinions kept sharp, 3–5 **Gold** lines, **Still thin** flags. Raw speech register — no writing-voice conversion; that's `/polish`'s job.
3. Sorts seeds into pillar sections and writes `content/journal/<source-date>-<slug>.md` (appends if the day's file exists) with `source: granola:<id> | session:<id>` frontmatter.
4. Closes with the file path + seed list + `/polish` pointer.

## Hard rules

- **Journal only.** This command never produces drafts, published posts, or social copy.
- **No gate here by design** — the journal is raw private capture; the voice gates fire downstream at `/polish` and beyond.
- If harvester reports the transcript had no pillar-shaped seeds, accept that. Don't re-spawn it to try harder.

Full rules live in `.claude/agents/harvester.md`.
