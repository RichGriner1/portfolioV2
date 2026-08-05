---
description: Ship the current work — commit the task's changes, merge to the default branch, push, bring local up to date, delete the work branch. One command instead of "commit, push, merge, update, delete".
argument-hint: "[files... | commit message hint] [--dry-run]"
---

Run the **ship sequence**. Arguments: `$ARGUMENTS`.

Ship = get the current task's work onto the default branch, pushed, with local in sync and the work branch gone. It is a deterministic git sequence, not a review loop — the heavy gates (tests, reviews, voice passes) are assumed already done. If they haven't run and the project mandates them, say so and stop.

The one exception is the project's own **ship gates** (step 2): cheap, mechanical checks the project declares for itself. Those run here, every time, because the whole reason they exist is that someone keeps forgetting them.

## Parse arguments
- **(none)** → ship the current task's changes with an auto-written commit message.
- File paths → commit exactly those files, nothing else.
- Free text → use as a hint for the commit message subject.
- `--dry-run` → print the full plan (files, message, branch flow, remotes) and stop. No git writes.

## Hard rules
1. **Commit only the task's files.** The working tree may hold unrelated dirty files (drafts, local notes, other work-in-progress). Commit what this session's task actually touched — nothing else. When unsure whether a dirty file belongs to the task, leave it out and mention it in the report. Never `git add -A` / `git add .`.
2. **Remote policy comes from the repo you are standing in — never from another project.** Read THIS project's CLAUDE.md/AGENTS.md for push rules before pushing: work repos may push to multiple remotes or forbid one; personal repos usually just use `origin`. If the project documents nothing, default to the branch's upstream, else `origin`. Never carry one repo's remote rules into another (personal vs company repos especially).
3. **Fetch before deciding anything.** A stale local default branch produces work built on a deleted design. `git fetch --all --prune` first, always.
4. **Never force-push. Never delete a branch that isn't fully merged.** If `-d` refuses, stop and report — don't escalate to `-D`.
5. **Report the true end state.** If a step was already done (nothing to commit, branch already gone, already in sync), say exactly that instead of inventing work.

## Sequence

### 1. Survey
`git fetch --all --prune`, then `git status -sb`, current branch, and the default branch (`origin/HEAD`). Classify dirty files: task files vs unrelated. With `--dry-run`, print the plan here and stop.

### 2. Run the project's ship gates
Discover them, don't assume them. A **ship gate** is any npm script named `check:*` in this project's `package.json` (`check:responsive`, `check:links`, `check:a11y`, …), plus anything the project's CLAUDE.md/AGENTS.md explicitly names as required before ship. The `check:*` prefix is the convention: a project opts a check into ship by naming it that way, and this command needs no per-project knowledge.

- Run each gate. Most need a dev server; the scripts are expected to start their own or reuse one.
- **A failing gate stops the ship.** Report its output and fix the cause — a gate exists because that class of bug has shipped before. Never skip one to get the commit through, and never edit a gate to make it pass.
- Skip a gate only when nothing in the commit set could affect it (a docs-only or content-only commit does not need a layout check). Say which gates you skipped and why.
- No `check:*` scripts and nothing named in the project docs → say "no ship gates declared" and move on. Don't invent gates.

With `--dry-run`, list the gates that would run instead of running them.

### 3. Sync the default branch
If the local default branch is behind its remote, fast-forward it (`merge --ff-only`) before merging anything into it. If it has diverged (non-ff), stop and report — that needs a human call.

### 4. Commit
If there are task files to commit: stage exactly them, commit with a conventional-commits message (`feat(scope): …` / `fix(scope): …`) matching the repo's log style, ending with the project's standard co-author trailer. If nothing to commit, skip and say so.

### 5. Merge + push
- **On a work branch:** switch to the default branch, `merge --ff-only <branch>` (fall back to a normal merge commit if ff is impossible), push to the remote(s) per rule 2.
- **Already on the default branch:** just push.
- If pushing triggers a deploy (Vercel etc.), mention it.

### 6. Clean up
Delete the merged work branch locally (`git branch -d`); if it exists on a remote, delete it there too (`git push <remote> --delete <branch>`). Skip silently if there is no work branch. Do not touch other branches — list stale-looking ones in the report instead.

### 7. Report
One short block: which ship gates ran and passed (or were skipped, and why), commit hash + subject, branch flow (e.g. `feature → main → origin`), what was skipped because it was already done, unrelated dirty files left alone, and any stale branches worth a look. If every step was a no-op, the report is one line: already shipped.
