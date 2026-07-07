---
description: Design-system fix loop — inspect the code for DS violations, fix them, verify the build, repeat until clean. Framework-aware (React/Tailwind or Angular). Use --audit for a report-only pass.
argument-hint: [paths | --diff] [--audit] [--framework react|angular]
---

Run the **design-system cleanup loop**. Arguments: `$ARGUMENTS`.

This loop *references skills, it doesn't contain the rules*. The knowledge lives in the `design-system` skill (which loads `design-principles` + `design-tokens` + `components`). The loop only orchestrates: **inspect → fix → verify → repeat until clean.**

## Parse arguments
- `--audit` → run **inspect only** (report + verdict), no fixes. Use when Richard wants a read, not auto-edits.
- `--diff` or no paths → target the uncommitted diff. Otherwise target the given paths.
- `--framework react|angular` → force the lens (otherwise the reviewer auto-detects).

## The loop (orchestrator runs these)

1. **Inspect** — spawn the **`ds-reviewer`** subagent on the target. It discovers framework/token-source/component-library, applies the token tell-sheet + `components` + the decision-filter/what-to-avoid, and returns findings with `file:line` and a verdict.

2. **If `--audit`** → present the ds-reviewer report and **stop**. Done.

3. **Fix** — for each blocker/suggestion the reviewer found, spawn **`code-writer`** to remediate: swap hard-coded values for tokens, replace bespoke elements with the project's DS components, remove flagged anti-patterns. Small diffs, no re-hard-coding on the replacement, honor documented escape hatches.

4. **Verify** — spawn **`test-runner`** (lint + build; tests/format if present). On failure, route the failure back to `code-writer` and re-verify.

5. **Re-inspect** — run `ds-reviewer` again on the changed files.

6. **Repeat** 3–5 until the **stop conditions** all hold:
   - No raw/hard-coded colors remain.
   - No hard-coded spacing / radius / shadow / motion remain.
   - No bespoke component remains where a DS component exists.
   - No flagged anti-patterns (Material bloat, glassmorphism, gradients on structural UI, colorful-KPI, decorative icons, hidden nav) remain.
   - The app **builds** (and passes tests, if any).
   - Any remaining exceptions are **documented** at their site.

Then report what changed and confirm each stop condition.

## Hard rules
- **Never invent a token.** If a needed value isn't in the token system, stop and ask (or extend + document) — do not inline it. This is the whole point of the loop.
- **Don't loop forever.** If the reviewer keeps flagging the same thing after 2 fix passes, stop and surface it to Richard — it's a judgment call or a missing token, not a mechanical fix.
- **`--audit` never edits.** Report only.
- The reviewer is read-only; only `code-writer` edits; only `test-runner` verifies. Mirror of the dev loop (`code-writer → test-runner → code-reviewer`).

Full rules: `$HOME/.claude/skills/design-system/SKILL.md` and the agents `ds-reviewer` / `code-writer` / `test-runner`.
