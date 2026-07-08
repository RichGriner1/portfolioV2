---
description: Content clarity checker — audit a piece for substance, clarity, length, and forced angles (default: report only, you decide), layering the right language lens (EN → voice-griner, ES → afi-redaccion). Add --fix for one bounded fix pass; --deep to iterate. It's the gate behind "clean tone ≠ good writing."
argument-hint: <path-to-file> [--fix] [--deep]
---

Run the **content clarity checker** on: `$ARGUMENTS`.

If no path is given, ask Richard which file to review.

This references skills, it doesn't contain the rules — the rubric is the `writing-substance` skill (voice- and language-neutral) plus a language lens on top. It's the gate behind *"voice-keeper pass + post-reviewer ship ≠ good writing"*: it catches copy that's clean on tone but unclear, too short, or forced. The command only orchestrates, and it is built to stay **cheap and bounded by default**.

**Default is audit (report only).** It reads critically and hands you findings; *you* decide what to change — your voice, your call. `--fix` does **one bounded revision pass** (no re-critique loop) unless you ask for more with `--deep`.

## Parse arguments
- **(no flag)** → **audit only**: critique, present findings + verdict, **stop**. No edits.
- `--fix` → apply the critic's named fixes in **one pass**, then report and stop. No re-critique loop.
- `--deep` → allow the fix → re-critique loop to repeat (max 2 rounds), stopping as soon as the critic returns `ship` (no blockers) — **not** once every polish note is gone. The expensive path, and rarely the right one: the loop's sweet spot is *audit → you direct the fix*, because a skeptical critic can always find one more nitpick. Reach for `--deep` only when you know just mechanical fixes remain and want them driven to done — don't default to it.

**Keep it scoped.** One file per run. This is a per-piece gate, not a batch sweep.

## Cost guardrail — keep the MAIN thread thin
The cost that matters is what lands in the **orchestrator (main) context** — it persists for the whole session. Work inside a subagent (the critic, the editor) is **discarded** once it returns its report, so a subagent spending tokens reading the piece + the voice/house-style docs is *fine* — it doesn't compound. The trap is the orchestrator re-doing that reading itself.

**Rules for the orchestrator (these prevent the real bloat):**
- **Act on the critic's report — do NOT re-read the file it already summarized.** The report quotes the takeaway back, gives you the blockers with quoted lines, and names specific fixes. Trust it; don't re-open the piece to re-derive what you were just handed.
- **Delegate the rewrite to the editor subagent.** Hand it the critic's named fixes + pointers (the voice/house-style skill to load) and let *it* read the source in its own (discarded) context. Give it the fix list, not a long spec you wrote by reading the whole piece first.
- **Don't paste the full piece into main context** to "think about it." The critic already read it. Read line-ranges only if you genuinely need to adjudicate a specific quoted line.

**Shape checks (surface, don't silently grind):**
- If *you (the orchestrator)* are about to read the whole piece to decide the fixes — stop, that's the critic's job; it already did it.
- If a `--fix` pass is turning into a full rewrite / invented new angle, **stop and report** — that's Richard's call, not the loop's.
- Iteration is the sink — that's why the loop is opt-in (`--deep`) and capped at 2 rounds.

## Audit (always runs first)
Spawn the **`content-critic`** subagent on the file. It loads `writing-substance` + the detected language lens (EN → `voice-griner`; ES → `afi-redaccion` + Peninsular/calque checks), reads critically, and returns: the takeaway quoted back (or "NOT STATED"), blockers/suggestions with quoted lines, and a verdict (`ship | revise`). **Present the report.** If there's no `--fix`, stop here — done. Richard revises from the findings.

## Fix (only with `--fix`)

0. **Pick this repo's editor** (portability — don't assume portfolioV2's agents exist here): use the project's content-writing subagent if it has one (`code-writer`/`editor` in portfolioV2, or similar; check `.claude/agents/`). If none exists, **the orchestrator applies the edits directly** — but only the specific fixes the critic named. State which you chose.

1. **One revision pass.** Pass the editor the critic's named fixes + a pointer to the language lens to load, and let *it* read the source in its own context — **do not re-read the file yourself to write a long spec** (see the Cost guardrail). Apply *only* the named fixes: sharpen the takeaway, develop a thin point, cut a forced angle, fix an unclear line. **Never invent a new angle or rewrite Richard's voice.** Then **report what changed and what remains, and stop.** Richard re-runs `/content-review <same file> --fix` for another pass — this keeps every run bounded.

2. **Iterate — only if `--deep`.** Re-run `content-critic` and repeat the fix pass, **max 2 rounds**. **Stop the instant the critic returns `ship`** — i.e. the moment no *blockers* remain, even if polish Suggestions are still listed. Do **not** keep looping to clear nitpicks; hand the remaining Suggestions back to Richard and stop. Without `--deep`, do not loop at all.

**Stop conditions (the bar for `ship` — blockers only):** one takeaway stated on the page; a real so-what; developed enough (not a headline pretending to be a post); every sentence parses on first read; no forced/hollow angle. Voice-budget and phrasing polish are Suggestions, **not** part of this bar — they never hold up `ship`.

## Hard rules
- **Audit is the default; only `--fix` edits.** Without `--fix` this never touches the file — it reports and Richard revises.
- **Bounded by default.** `--fix` = one pass, no re-critique. Looping is `--deep`, capped at 2 rounds. Never silently escalate to the expensive path.
- **Substance outranks tone.** A perfectly-voiced piece with no stated takeaway still fails. The critic quotes the takeaway back; if it can't, that's a blocker.
- **"Too short" is a real blocker.** If the takeaway is asserted but not developed, flag it — don't ship a headline pretending to be a post.
- **Don't rewrite Richard's voice.** Even with `--fix`, the editor applies *only the critic's named fixes*, never a new angle. This complements the content pipeline (`syndicator → voice-keeper → post-reviewer`), it doesn't replace it.
- **Spanish gets the Spanish lens.** Confirm `afi-redaccion` (not the English lens) is applied to ES text.
- **`content-critic` is read-only and always does the critiquing.** Editing is done only by the repo's chosen editor (or the orchestrator applying named fixes) — never by the critic.

Full rules: `$HOME/.claude/skills/writing-substance/SKILL.md` and the `content-critic` agent.
