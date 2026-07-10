---
description: Turn a published post, journal entry, or case study into LinkedIn + Twitter short-form. Spawns syndicator → voice-keeper → post-reviewer.
argument-hint: <published-file | journal-file | case-study-slug>
---

Invoke the `syndicator` subagent now with the source from: `$ARGUMENTS`.

Resolve the source type first:
- Path under `content/published/` → published post (the default, unchanged).
- Path under `content/journal/` → journal entry — for insights that are tweet-sized with no blog planned. The syndicator picks (or asks for) one seed and applies the speech→writing conversion for harvested journals.
- Bare word matching a `CASE_STUDIES` slug (grep the keys in `src/lib/content/case-studies.tsx` — don't read the file) → case study; the post links to `/work/<slug>`.

If `$ARGUMENTS` is empty, stop and ask Richard which published post to syndicate — glob `content/published/**/*.md` and list the options sorted by `created` date (most recent first) so he can pick.

## Pipeline (orchestrator runs these in order)

1. **`syndicator`** ([.claude/agents/syndicator.md](../../.claude/agents/syndicator.md))
   - Reads `content/voice.md` + `content/brand-guide.md` (mandatory).
   - Reads the source (published post, journal seed, or case-study object — per its Inputs rules).
   - Asks Richard 2–3 clarifying questions (one-takeaway for LinkedIn, Twitter hook, CTA shape; for journals, which seed).
   - Drafts both platforms to `content/social/<pillar>/<slug>.md` with `status: draft`.
2. **`voice-keeper`** ([.claude/agents/voice-keeper.md](../../.claude/agents/voice-keeper.md))
   - Lints the social file against `content/voice.md`.
   - Returns `pass` or `revise`.
   - On `revise`: route back to syndicator with the blocker list.
3. **`post-reviewer`** ([.claude/agents/post-reviewer.md](../../.claude/agents/post-reviewer.md))
   - **First gate: clarity & sense** — does every sentence parse, is every claim credible, does the logic hold, are any angles forced? Then hook quality, stance fit, CTA placement, platform conventions.
   - Returns `ship`, `revise`, or `rewrite`.
   - On `revise`: route back to syndicator with the blocker list.
   - On `rewrite`: re-run the clarifier step before drafting again.

If voice-keeper or post-reviewer return non-`ship` verdicts, do not skip the loop — re-run the prior agent with the feedback. Mirrors the dev loop (`code-writer → test-runner → code-reviewer`).

## Output

A single file at `content/social/<pillar>/<slug>.md` containing both the LinkedIn body and the Twitter thread, with `status: draft`. Richard reviews, flips `status: ready`, then runs `/push` to draft/schedule it to Typefully (or posts manually by copy/paste).

## Hard rules (orchestrator enforces)

- **Do not auto-post.** This pipeline ends with a file on disk, not a published post.
- **Do not skip the clarifier.** The syndicator must ask Richard the one-takeaway question at minimum, even if questions 2 and 3 are obvious.
- **Do not skip voice-keeper.** Even if you think the syndicator nailed it, run the lint pass.
- **`voice-keeper` pass + `post-reviewer` ship are necessary, not sufficient.** Before you hand the draft to Richard, READ THE COPY YOURSELF as a skeptical editor: does every sentence parse, is every claim credible, does the argument hold, are any threads forced? Green lights from the agents mean "on-voice + hooks well" — they do not guarantee good writing. If a line doesn't make sense to you, route it back before presenting it. (Richard has had to heavily re-edit passed drafts — don't let that recur.)
- **Do not write to LinkedIn or Twitter APIs.** Out of scope for `/syndicate`. Publishing is `/push`'s job (Typefully), run separately after review.

Full rules live in `.claude/agents/syndicator.md`, `.claude/agents/voice-keeper.md`, and `.claude/agents/post-reviewer.md`.
