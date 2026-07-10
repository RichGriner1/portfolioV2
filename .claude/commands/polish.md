---
description: Shape a journal entry into a draft. Spawns the editor agent with the given journal file path.
argument-hint: <path-to-journal-file>
---

Invoke the `editor` subagent now with the journal file path: `$ARGUMENTS`.

If `$ARGUMENTS` is empty, stop and ask the user which journal file to polish — glob `content/journal/*.md` and list the options sorted by date (most recent first) so they can pick.

Editor's job, in short:
1. Read the journal file fully.
2. Identify the strongest single section (Process, Breakdown, Authority, or Experiment). If two are equally strong and independent, ask which to draft first — don't silently pick.
3. Shape it into a draft. Preserve Richard's voice; tighten rambling; add a lede and a kicker. Harvested journals (`source: granola:*` / `source: session:*`) get the speech→writing conversion — see the "Harvested journals" section in `editor.md`.
4. Save to `content/drafts/<pillar>/<slug>.md` with the full frontmatter schema (title, pillar, status: draft, created, tags, seed pointing back to the journal file).
5. Do not write to `content/published/`. Do not modify the source journal.

## Voice gate (orchestrator runs after the editor finishes — do not skip)

Spawn **`voice-keeper`** on the new draft. It lints against `content/voice.md`: banned phrases, AI-tells, em-dashes, construction patterns.

- `pass` → done.
- `revise` → route the flagged lines back to `editor` for **one** correction pass, then stop and report whatever remains. Don't loop further — Richard revises by hand from there.

This exists because drafts used to skip voice linting entirely (only `/syndicate` output was gated) and inconsistencies slipped through to publish.

## Close

*"Draft at `content/drafts/<pillar>/<slug>.md` (voice-keeper: <pass | remaining flags>). Revise by hand, then move to `content/published/<pillar>/` when ready — `/content-review <draft>` is worth running before promoting."*

Full rules live in `.claude/agents/editor.md` and `.claude/agents/voice-keeper.md`.
