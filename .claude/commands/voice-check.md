---
description: Lint a markdown file against content/voice.md. Spawns the voice-keeper agent. Read-only — does not modify files.
argument-hint: <path-to-markdown-file>
---

Invoke the `voice-keeper` subagent now with the file path: `$ARGUMENTS`.

If `$ARGUMENTS` is empty, stop and ask Richard which file to check. Suggest globbing the most likely candidates:
- `content/social/**/*.md` (syndication output)
- `content/drafts/**/*.md` (long-form drafts)
- `content/published/**/*.md` (already-shipped posts, audit mode)

Voice-keeper's job, in short:
1. Read `content/voice.md`. If missing, stop and report.
2. Read the target file.
3. Run lint passes for banned phrases, construction patterns, engagement bait, hashtag stacks, and platform-specific smells.
4. Report findings as `<file:line> — <category> — "<quote>"` with a `pass` or `revise` verdict.
5. Do not modify the file.

Full rules live in `.claude/agents/voice-keeper.md`. Use this command outside the syndication pipeline — it's an ad-hoc check for any file that's supposed to sound like Richard.
