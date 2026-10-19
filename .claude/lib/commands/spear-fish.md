---
description: Research a target company, find a real friction point in its product, brief (or build) a proof artifact, and draft a one-word-yes outreach pitch. Get hired by building, not applying. Stops for Richard's pick at each gate; never sends anything.
argument-hint: "<company name or URL> [--job <posting-url>] [--person <name>] [--build]"
---

Run a **spear-fishing** pass on: `$ARGUMENTS`.

This loop references the `spear-fishing` skill (`$HOME/.claude/skills/spear-fishing/SKILL.md`); it doesn't contain the rules. Load it first. If no company is given, ask which one.

## Parse arguments
- `<company>` → name or product URL (required).
- `--job <url>` → a specific posting. Its requirements feed the friction scoring (criterion 4) and the pitch.
- `--person <name>` → the target human, if Richard already knows who.
- `--build` → after the brief is approved, scaffold and build the artifact (step 5). Without it, the run ends at the brief + pitch.

## Where things go
Everything lives outside any repo, because it is private job-search material: `~/Documents/spear-fish/<company-slug>/`.
- `dossier.md`: research, every fact with a source link.
- `brief.md`: the chosen friction, artifact type, conviction statement, references.
- `pitch.md`: outreach drafts.
- `~/Documents/spear-fish/tracker.md`: one row per company (date, company, person, friction, artifact, status). Create it if missing.

The artifact itself gets its own repo (default `~/Code/RichGriner1/spear-<slug>/`), never inside portfolioV2.

## 1. Intake
If a `dossier.md` already exists for this company, read it and resume from the first incomplete step instead of starting over.

Ask at most two questions, only what the arguments don't answer: why this company (what pulls Richard to it), and whether there's a known person or warm path in. Skip if already given.

## 2. Research
Spawn a `general-purpose` subagent (it has web search) to fill skill §2. Give it the company, the job URL if any, and the §2 table. It returns the dossier content; write it to `dossier.md`. Keep the main thread thin: don't re-fetch pages the subagent already summarized.

Rules for the research:
- Every fact carries a source link. Unsourced → listed under **Still thin**, not stated.
- Public sources only. No sign-ups, no logins, no scraping behind auth. If a free tier would help, say so and let Richard do it.
- Find one named person (skill §2 "The person"). Note where they are reachable publicly; don't guess email addresses.

## 3. Friction shortlist (gate)
From the dossier, write 3 candidate friction points, each scored against skill §3 with the evidence linked. Present them as a short table with a recommendation. **Stop and let Richard pick** (or reject all and redirect).

## 4. Brief (gate)
For the picked friction, write `brief.md`:
- The artifact type (skill §4) and why that type.
- The slice in scope, and what is explicitly out.
- **A draft conviction statement** (skill §5) for Richard to rewrite in his own words. Mark it DRAFT; it doesn't count until he's rewritten it.
- References to build from: their live page, 2–3 inspiration links, at least one from outside product UI (skill §5 "curiosity input").
- The "steaming hot pie" landing: what the first screen shows.
- The Loom outline: 60–90s, three beats (problem, fix, why it's better) + the rejected first draft.

**Stop for Richard's approval** of the brief. If `--build` wasn't passed, go to step 6.

## 5. Build (only with `--build`)
Ask before creating the repo. Then build the slice in the project's normal dev loop: read the brief's references, keep the diff small, token-layered, shadcn components. Show Richard the agent's first pass and ask what to reject (skill §5 "rejected a first draft"); the rejection and its reason go in `brief.md`.

Before calling it done, check against skill §5: honest framing label, phone width + desktop in the browser preview, no console errors. Deploying to Vercel is Richard's call; ask.

## 6. Pitch
Write `pitch.md` with two variants (DM and email) following skill §6: under 90 words, leads with the thing, one ask answerable with "Sure". Run the voice layer (`voice-griner` or `content/voice.md`) and fix before presenting. Also list the best channel for this person, from the dossier.

**Never send.** Drafting in Gmail or LinkedIn is also Richard's call; ask first. Check skill §7 discretion before presenting (no current-employer targets, nothing public).

## 7. Log
Add or update the company's row in `tracker.md`. Report: the dossier's top three facts, the picked friction, the artifact status, the pitch file path, and anything still thin.

## Hard rules
- **Gates are real.** Stop at step 3 and step 4. Don't pick the friction or approve the brief on Richard's behalf.
- **No invented facts** in the dossier, brief or pitch. A friction with no evidence doesn't make the shortlist.
- **Nothing outward-facing without a yes**: no messages, no public deploys, no posts, no account sign-ups.
- **Honest artifacts.** Unofficial-concept label, no logo-as-official, no real user data, no auth pages that imitate theirs.
- **One company per run.**
