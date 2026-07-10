---
description: Draft or update a bilingual case study in src/lib/content/case-studies.tsx, chained through the dev loop (code-writer → test-runner → code-reviewer) plus the copy gates (voice-keeper → content-critic). Loads the case-study skill. --new also adds the work.ts entry.
argument-hint: <slug> [--new] [--source <file ...>]
---

Run the **case-study loop** on: `$ARGUMENTS`.

This references skills, it doesn't contain the rules — structure and quality bar live in the `case-study` skill (`~/.claude/skills/case-study/SKILL.md`, fallback `.claude/lib/skills/case-study/SKILL.md`); voice lives in `voice-griner`. The command only orchestrates: gather material → code-writer drafts → test-runner verifies → code-reviewer checks the TS → voice-keeper + content-critic check the copy.

## Parse arguments

- `<slug>` — required. Grep `src/lib/content/case-studies.tsx` for the `CASE_STUDIES` keys (grep only — do not read the file):
  - Slug exists, no `--new` → **update mode**.
  - Slug missing, `--new` → **create mode** (also adds a `WORK` entry in `src/lib/content/work.ts`).
  - Slug missing, no `--new` → stop, list the existing slugs, ask Richard.
- `--source <file ...>` — raw material (harvested journal from `/harvest`, a draft, a content-os story-bank entry). Note the paths; **do not read them in the main thread** — they're passed to code-writer.
- No `--source` → interview mode: ask the `case-study` skill's five interview questions yourself (two at a time), assemble the answers into a ~20-line brief. **Never invent facts the material doesn't contain.**

## Cost guardrail — keep the MAIN thread thin

`case-studies.tsx` is ~850 lines and every subagent that needs it reads it in its own (discarded) context. The orchestrator's only contact with it is the slug grep. Act on each agent's report — do not re-read the diff or the source files to second-guess it. If you're about to open `case-studies.tsx` in the main thread, stop: that's code-writer's or the reviewers' job.

## Pipeline (orchestrator runs these in order)

1. **Draft — spawn `code-writer`** with: the slug + mode (update/create), the `--source` paths or the interview brief, and instructions to load the `case-study` skill + `voice-griner` before writing. Its contract:
   - Read `case-studies.tsx` (and `work.ts` in create mode) in its own context; edit only the target object.
   - EN strings first, ES in the same pass — Peninsular, same compression, every new/edited ES string marked `// TODO(afi-redaccion)`.
   - `animation` only from the existing enum; image/iframe/video fields as `TODO` placeholders unless paths were provided.
   - Create mode: fill `WORK` entry (`slug/title/description/year/type/kind: "case-study"/href`), propose `glyph`/`bento` with a `TODO` comment.
2. **Verify — spawn `test-runner`** (lint → build). On failure, route back to code-writer with the `file:line` list. Max 2 round-trips, then stop and report.
3. **Review (code) — spawn `code-reviewer`** on the uncommitted diff, instructing it to also load the `case-study` skill and apply its quality bar (section 4) to the copy. On `revise`/`rewrite`, route back to code-writer once with the blockers, then stop and hand findings to Richard.
4. **Review (copy — mandatory, do not skip):**
   - **`voice-keeper`** — lint the new/changed **EN strings only** (give it the diff, not the whole file) against `content/voice.md`: banned phrases, AI-tells, em-dashes, construction patterns. On `revise`, route back to code-writer with the exact flagged phrases, once.
   - **`content-critic`** — the `/content-review` gate on the same changed EN copy: loads `writing-substance` + `voice-griner`, checks each card/intro has a real so-what, parses on first read, no forced angles. On `revise`, route back to code-writer once with the named fixes.
   - ES strings are exempt from both gates here — they get the `afi-redaccion` follow-up pass instead.
   - Each copy gate routes back **at most once** without an explicit go-ahead from Richard.

## Close

Report: the diff summary (cards touched, sections added), remaining `TODO`s (assets, glyph, afi-redaccion markers), and the verdicts from all four gates. Then:

*"ES strings are marked `TODO(afi-redaccion)` — run the afi-redaccion pass on the new strings. Preview at `/work/<slug>`."*

## Hard rules

- **Never delete or rename an existing case study or its cards** without being asked. Update mode touches only what the material supports.
- **Never invent facts.** Every claim in the copy traces to the source material or Richard's interview answers. Thin material → flag it, don't fill it.
- **Never invent `animation` enum values** — new motion is `/choreograph`'s job.
- **Bounded routing.** Each gate (test-runner ×2, code-reviewer ×1, voice-keeper ×1, content-critic ×1) routes back a fixed number of times, then stops and reports. Never silently grind.
- **This loop ends at a reviewed diff.** No commit, no deploy — Richard's call.
- Takes files, not transcripts: to build from a Granola meeting, run `/harvest` first and pass the journal file via `--source` — the capture stays a durable artifact.

Full rules: the `case-study` skill and `.claude/agents/{code-writer,test-runner,code-reviewer,voice-keeper}.md` + the `content-critic` lib agent.
