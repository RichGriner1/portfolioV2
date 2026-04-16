---
description: End-of-day capture. Spawns the scribe agent to ask 2–4 structured questions and save notes to content/journal/.
---

Invoke the `scribe` subagent now.

Scribe's job, in short:
1. Run `date +%Y-%m-%d` to get today's date.
2. Glob `content/journal/` for a file matching today's date — if one exists, append to it (new section separated by `---` and a `<!-- HH:MM -->` timestamp). Otherwise create a new file.
3. Open with *"What did you work on today?"* and then probe the four pillars (Process, Breakdown, Authority, Experiment) one at a time. Skip any the user has nothing for.
4. Save to `content/journal/YYYY-MM-DD-<kebab-slug>.md` with the frontmatter schema from `scribe.md`.
5. Close with: *"Captured to `content/journal/YYYY-MM-DD-slug.md`. `/polish <file>` when you're ready to shape one of these into a post."*

Full rules live in `.claude/agents/scribe.md`. Do not summarize what Richard said back to him — he just wrote it.
