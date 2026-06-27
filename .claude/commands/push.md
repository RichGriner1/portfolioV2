---
description: Draft/schedule a social post to Typefully via its API. Reads a content/social file, previews the request, then sends on confirmation.
argument-hint: <path-to-social-file> [twitter|linkedin] [schedule: ISO-8601 | next]
---

Push a finished social post to Typefully as a scheduled (or queued) draft.

`$ARGUMENTS` = the social file path, optionally followed by a platform (`twitter` or `linkedin`) and a schedule hint (`next`, or an ISO-8601 datetime).

If `$ARGUMENTS` is empty, stop and ask Richard which post to push — glob `content/social/**/*.md` and list candidates with `status: ready` first (most recent `scheduled_for` first).

> ⚠️ **Not yet verified end-to-end.** The Typefully API details in `scripts/typefully-push.mjs` were written without access to typefully.com (egress was blocked at build time). The first real send for each account must be done with eyes open — see step 4. All assumptions are flagged `TODO-VERIFY` in that script's header and centralized in its `CONFIG` block.

## Preconditions (orchestrator checks, in order)

1. **`TYPEFULLY_API_KEY` is set.** If not, stop and tell Richard to add it to the environment (Typefully → Settings → Integrations/API; paid plan). Never read, print, or commit the key. A `--dry-run` preview still works without it.
2. **The file's `status` is `ready`.** If it's still `draft`, stop and suggest running `/voice-check` (and `/syndicate`'s review loop) first. Pushing unreviewed copy is off-policy.

## Steps

1. **Read the social file.** Parse its frontmatter (`pillar`, `status`, `scheduled_for`, `typefully_ids`) and locate the platform sections (`## Twitter` / `## Twitter thread` and `## LinkedIn` / `## LinkedIn post` — formats vary across files, so read, don't assume).
2. **Extract clean post text** for the requested platform (default: Twitter if the file has a thread, else LinkedIn):
   - Strip markdown ornamentation — blockquote `>` markers, bold, the `1/ 2/ 3/` tweet numbers, section headers, and any editorial `## Notes` / iteration logs.
   - For a **thread**, separate each tweet with **four newlines** (`\n\n\n\n`) so Typefully treats the breaks as explicit tweet boundaries. Do **not** also pass `--threadify` in that case. (TODO-VERIFY this delimiter against Typefully's docs.)
   - For a single post, pass the body as-is.
   - Restore real values stripped earlier for copy-cleanliness if needed (e.g. `--dt-primary`), but leave `[link]` placeholders only if Richard has filled them — if a CTA still says `[link]`, stop and ask for the URL before sending.
3. **Resolve the schedule.** Use the schedule hint from `$ARGUMENTS` if given; else the file's `scheduled_for` (convert a bare date to a sensible local send time and confirm it); else ask. `next` maps to Typefully's next free queue slot.
4. **Dry-run first, always.** Write the extracted text to a temp file under the scratchpad and run:
   ```bash
   node scripts/typefully-push.mjs --content-file <tmp> --dry-run --json [--schedule <when>] [--share]
   ```
   Show Richard the previewed request (URL, body, redacted auth). Confirm the content, thread breaks, and schedule look right. **Get an explicit go-ahead before a real send.**
5. **Send for real** (drop `--dry-run`). Capture the JSON response and the returned draft `id`.
6. **Record it back in the file.** Set `typefully_ids.<platform>` to the returned id, set `status: scheduled` (or `posted` if sent immediately), and align `scheduled_for` with the actual scheduled time. Update the row in `content/social/backlog.md` if one exists.

## Hard rules

- **Dry-run before every first send to a new account**, and any time the `TODO-VERIFY` items haven't been confirmed yet. The script defaults to refusing a real send without a key, but you are the second guardrail.
- **One platform = one draft.** Twitter thread and LinkedIn post are separate Typefully drafts; push them as separate calls and store both ids.
- **Never** print or commit `TYPEFULLY_API_KEY`. It lives in the environment only.
- **Do not** push a file with `status: draft` or with unresolved `[link]` placeholders.
- **Do not** invent Typefully fields. If something isn't in `scripts/typefully-push.mjs`'s CONFIG/body, it's not supported yet — extend the script (and update the TODO-VERIFY notes) rather than guessing inline.

The deterministic API call lives in [scripts/typefully-push.mjs](../../scripts/typefully-push.mjs). This command does the reading, extraction, and bookkeeping around it.
