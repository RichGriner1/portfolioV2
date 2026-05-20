---
description: Turn a published post into LinkedIn + Twitter short-form. Spawns syndicator → voice-keeper → post-reviewer.
argument-hint: <path-to-published-file>
---

Invoke the `syndicator` subagent now with the published file path: `$ARGUMENTS`.

If `$ARGUMENTS` is empty, stop and ask Richard which published post to syndicate — glob `content/published/**/*.md` and list the options sorted by `created` date (most recent first) so he can pick.

## Pipeline (orchestrator runs these in order)

1. **`syndicator`** ([.claude/agents/syndicator.md](../../.claude/agents/syndicator.md))
   - Reads `content/voice.md` (mandatory).
   - Reads the published file.
   - Asks Richard 2–3 clarifying questions (one-takeaway for LinkedIn, Twitter hook, CTA shape).
   - Drafts both platforms to `content/social/<pillar>/<slug>.md` with `status: draft`.
2. **`voice-keeper`** ([.claude/agents/voice-keeper.md](../../.claude/agents/voice-keeper.md))
   - Lints the social file against `content/voice.md`.
   - Returns `pass` or `revise`.
   - On `revise`: route back to syndicator with the blocker list.
3. **`post-reviewer`** ([.claude/agents/post-reviewer.md](../../.claude/agents/post-reviewer.md))
   - Reviews hook quality, stance fit, CTA placement, platform conventions.
   - Returns `ship`, `revise`, or `rewrite`.
   - On `revise`: route back to syndicator with the blocker list.
   - On `rewrite`: re-run the clarifier step before drafting again.

If voice-keeper or post-reviewer return non-`ship` verdicts, do not skip the loop — re-run the prior agent with the feedback. Mirrors the dev loop (`code-writer → test-runner → code-reviewer`).

## Output

A single file at `content/social/<pillar>/<slug>.md` containing both the LinkedIn body and the Twitter thread, with `status: draft`. Richard reviews, flips `status: ready`, then posts (manually for now — `/push` is deferred).

## Hard rules (orchestrator enforces)

- **Do not auto-post.** This pipeline ends with a file on disk, not a published post.
- **Do not skip the clarifier.** The syndicator must ask Richard the one-takeaway question at minimum, even if questions 2 and 3 are obvious.
- **Do not skip voice-keeper.** Even if you think the syndicator nailed it, run the lint pass.
- **Do not write to LinkedIn or Twitter APIs.** Out of scope for `/syndicate`. That's `/push`, which doesn't exist yet.

Full rules live in `.claude/agents/syndicator.md`, `.claude/agents/voice-keeper.md`, and `.claude/agents/post-reviewer.md`.
