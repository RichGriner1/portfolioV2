---
description: Design-system checker — audit code for DS violations (default: report only, you decide). Add --fix to let it remediate → verify → repeat until clean. Framework-aware (React/Tailwind or Angular). Scope it to a component/folder to keep it cheap.
argument-hint: [paths | --diff] [--fix] [--framework react|angular]
---

Run the **design-system checker**. Arguments: `$ARGUMENTS`.

This references skills, it doesn't contain the rules — the knowledge lives in the DS skills (`design-principles` + `design-tokens` + `components`). The command only orchestrates.

**Default is audit (report only).** It inspects and hands you findings; *you* decide what to change. Add `--fix` to opt into the automated fix loop (`inspect → fix → verify → repeat`). This keeps the cheap, safe path the default and the expensive path explicit.

## Parse arguments
- **(no flag)** → **audit only**: inspect, present findings + verdict, **stop**. No edits.
- `--fix` → run the full fix loop after the audit (see below).
- `--diff` or no paths → target the uncommitted diff. Otherwise target the given paths.
- `--framework react|angular` → force the lens (otherwise the reviewer auto-detects).

**Keep it scoped.** Prefer a single component / file / folder (e.g. the nav bar, a table) over `--diff` of a big change or a whole app — smaller scope is cheaper, faster, and sharper. If a broad target is given, say so and suggest narrowing.

## Audit (always runs first)
Spawn the **`ds-reviewer`** subagent on the target. It discovers framework/token-source/component-library/context, checks values against the matching framework tell-sheet + `components`, pulls in principles only for judgment calls, and returns findings with `file:line` + a verdict. **Present the report.** If there's no `--fix`, stop here — done.

## Fix loop (only with `--fix`)

0. **Pick this repo's fixer and verifier** (portability — don't assume portfolioV2's agents exist here):
   - **Fixer:** use the project's code-writing subagent if it has one — look for an agent whose job is implementing code changes (`code-writer` in portfolioV2, `builder` in Coherence, or similar; check `.claude/agents/`). If none exists, **the orchestrator applies the edits directly** (they're small and mechanical).
   - **Verifier:** use the project's test/verify subagent if it has one (`test-runner`, `tester`, …). If none, **run the project's own checks directly** — detect them (`package.json` scripts like `lint`/`build`; Angular `ng lint`/`ng build`; etc.). If there's genuinely nothing to run, skip verify and say so.
   - State which fixer/verifier you chose before starting.

1. **Fix** — for each blocker/suggestion, have the chosen fixer remediate: swap hard-coded values for tokens, replace bespoke elements with the project's DS components, remove flagged anti-patterns. Small diffs, no re-hard-coding on the replacement, honor documented escape hatches.

2. **Verify** — run the chosen verifier (lint + build; tests/format if present). On failure, route the failure back to the fixer and re-verify.

3. **Re-inspect** — run `ds-reviewer` again on the changed files.

4. **Repeat** 1–3 until the **stop conditions** all hold:
   - No raw/hard-coded colors remain.
   - No hard-coded spacing / radius / shadow / motion remain.
   - No bespoke component remains where a DS component exists.
   - No flagged anti-patterns (Material bloat, glassmorphism, gradients on structural UI, colorful-KPI, decorative icons, hidden nav) remain.
   - The app **builds** (and passes tests, if any).
   - Any remaining exceptions are **documented** at their site.

Then report what changed and confirm each stop condition.

## Hard rules
- **Audit is the default; only `--fix` edits.** Without `--fix` this never touches a file.
- **Never invent a token.** If a needed value isn't in the token system, stop and ask (or extend + document) — do not inline it. This is the whole point.
- **Don't loop forever.** If the reviewer keeps flagging the same thing after 2 fix passes, stop and surface it — it's a judgment call or a missing token, not a mechanical fix.
- **`ds-reviewer` is read-only and always does the inspecting.** Editing is done only by the repo's chosen fixer, verification only by the repo's chosen verifier — never by the reviewer. Mirror of the dev loop (writer → tester → reviewer), but the writer/tester are whatever this repo provides.

Full rules: the DS skills (`design-principles` / `design-tokens` / `components`) and the `ds-reviewer` agent (plus this repo's own fixer/verifier agents).
