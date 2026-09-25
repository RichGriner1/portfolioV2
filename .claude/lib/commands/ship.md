---
description: Ship the current work (commit, merge to the default branch, push, sync, delete the work branch), then either stop for the day or open the next branch. One command instead of "commit, push, merge, update, delete, new branch".
argument-hint: "[files... | commit message hint] [--done | --new <branch>] [--dry-run]"
---

Run the **ship sequence**. Arguments: `$ARGUMENTS`.

Ship = get the current task's work onto the default branch, pushed, with local in sync and the work branch gone. It is a deterministic git sequence, not a review loop — the heavy gates (tests, reviews, voice passes) are assumed already done. If they haven't run and the project mandates them, say so and stop.

The one exception is the project's own **ship gates** (step 2): cheap, mechanical checks the project declares for itself. Those run here, every time, because the whole reason they exist is that someone keeps forgetting them.

After the report, it explains what was built and why the decisions went the way they did (step 7b), so the work can be explained and learned from. Every ship ends at a fork (step 8): stop for the day with nothing left open, or start the next branch from the base that was just pushed.

## Parse arguments
- **(none)** → ship the current task's changes with an auto-written commit message, then ask what's next.
- File paths → commit exactly those files, nothing else.
- Free text → use as a hint for the commit message subject.
- `--done` → after shipping, stop for the day (step 8).
- `--new [branch]` → after shipping, open a new branch off the fresh default branch. No name given → ask what the work is.
- `--dry-run` → print the full plan (files, message, branch flow, remotes, what step 8 would do) and stop. No git writes.

## Hard rules
1. **Commit only the task's files.** The working tree may hold unrelated dirty files (drafts, local notes, other work-in-progress). Commit what this session's task actually touched — nothing else. When unsure whether a dirty file belongs to the task, leave it out and mention it in the report. Never `git add -A` / `git add .`.
2. **Remote policy comes from the repo you are standing in — never from another project.** Read THIS project's CLAUDE.md/AGENTS.md for push rules before pushing: work repos may push to multiple remotes or forbid one; personal repos usually just use `origin`. If the project documents nothing, default to the branch's upstream, else `origin`. Never carry one repo's remote rules into another (personal vs company repos especially).
3. **Fetch before deciding anything.** A stale local default branch produces work built on a deleted design. `git fetch --all --prune` first, always.
4. **Never force-push. Never delete a branch that isn't fully merged.** If `-d` refuses, stop and report — don't escalate to `-D`.
5. **Report the true end state.** If a step was already done (nothing to commit, branch already gone, already in sync), say exactly that instead of inventing work.
6. **The next branch starts from what was just shipped.** Branch only after step 5's push landed and the local default branch matches the remote. Never branch from the old work branch or a stale default.
7. **Stopping for the day never loses work.** No stash, reset, clean or checkout that discards changes. Anything still dirty is listed and left exactly where it is.

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
- **On a work branch:** switch to the default branch and merge the way this repo already does. Read the default branch's recent first-parent log: if work branches land as `Merge branch '…'` commits, use `merge --no-ff --no-edit <branch>`; otherwise `merge --ff-only <branch>`, falling back to a merge commit if ff is impossible. Then push to the remote(s) per rule 2.
- **Already on the default branch:** just push.
- If pushing triggers a deploy (Vercel etc.), mention it.

### 6. Clean up
Delete the merged work branch locally (`git branch -d`); if it exists on a remote, delete it there too (`git push <remote> --delete <branch>`). Skip silently if there is no work branch. Do not touch other branches — list stale-looking ones in the report instead.

### 7. Report
One short block: which ship gates ran and passed (or were skipped, and why), commit hash + subject, branch flow (e.g. `feature → main → origin`), what was skipped because it was already done, unrelated dirty files left alone, and any stale branches worth a look. If every step was a no-op, the report is one line: already shipped. Step 8 runs either way.

### 7b. Explain what we built
Richard uses this to explain the work to others and to keep learning how software gets made. Write it for a designer who codes, not for an engineer: plain words, and define each technical term the first time it appears.

Base it on this session's conversation and the diff you just shipped. Only give reasons that were actually discussed or are clear from the code. If you don't know why something is the way it is (it came from a template, or an earlier session), say that instead of making up a reason.

Use four short sections:
- **What we built.** Two or three sentences on what changed and what it does for the person using it.
- **Decisions and why.** Each real choice made in this session: what we picked, what the other option was, and why this one won. Skip choices nobody weighed.
- **Concepts worth knowing.** One to four ideas this work used that are worth learning (a pattern, an API, a browser behaviour, a git move). One or two sentences each, tied to where it shows up in this change.
- **Say it in one line.** How Richard could describe this work to a colleague or in a portfolio note.

Scale it to the ship. A copy edit or small fix gets a sentence or two with no sections. A feature gets all four. Skip this step on `--dry-run` and when nothing new shipped.

### 8. What next: stop for the day, or open a new branch
If `--done` or `--new` already answered this, act on it. Otherwise ask one question after the report, with two options: **Stop for the day** and **Open a new branch**. An answer that names a branch or describes a task counts as a new branch for that work.

**Stop for the day**
- Stay on the default branch, in sync with the remote. Anything still dirty stays put and gets listed (rule 7).
- Stop the dev servers, preview servers and watchers this session started. Leave anything the user started.
- List what shipped today: `git log <default> --no-merges --since=midnight --format='%h %s'`.
- List local branches already merged into the default branch (`git branch --merged <default>`) and offer to delete them, on the remote too if they're there. Delete only on a yes, and only with `-d`.
- If the project has an end-of-day capture command (portfolioV2 has `/journal`), mention it in one line. Don't run it.
- Close with one line: the default branch and its hash, and either "nothing open" or what still is.

**Open a new branch**
- Name: the one given, or ask what the work is and derive a short kebab-case name in the style of the repo's recent branches (read the `Merge branch '…'` subjects and `git branch -a`). Use a prefix like `feat/` only if the repo already does.
- The name must be free locally and on the remote. If it's taken, say so and ask. Never reuse or reset an existing branch.
- `git switch -c <name>` from the default branch just pushed (rule 6). Don't push it; it reaches the remote when it ships.
- Close with one line: `On <name>, from <default> @ <hash>.`
