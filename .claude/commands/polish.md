---
description: Shape a journal entry into a draft. Spawns the editor agent with the given journal file path.
argument-hint: <path-to-journal-file>
---

Invoke the `editor` subagent now with the journal file path: `$ARGUMENTS`.

If `$ARGUMENTS` is empty, stop and ask the user which journal file to polish — glob `content/journal/*.md` and list the options sorted by date (most recent first) so they can pick.

Editor's job, in short:
1. Read the journal file fully.
2. Identify the strongest single section (Process, Breakdown, Authority, or Experiment). If two are equally strong and independent, ask which to draft first — don't silently pick.
3. Shape it into a draft. Preserve Richard's voice; tighten rambling; add a lede and a kicker.
4. Save to `content/drafts/<pillar>/<slug>.md` with the full frontmatter schema (title, pillar, status: draft, created, tags, seed pointing back to the journal file).
5. Do not write to `content/published/`. Do not modify the source journal.
6. Close with: *"Draft at `content/drafts/<pillar>/<slug>.md`. Revise by hand, then move to `content/published/<pillar>/` when ready."*

Full rules live in `.claude/agents/editor.md`.
