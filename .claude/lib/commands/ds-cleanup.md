---
description: Design-system checker — audit code for DS violations (default: report only, you decide). Add --fix for a single bounded fix pass; --verify to also build; --deep to iterate. Framework-aware (React/Tailwind or Angular). Scope it to one component to keep it cheap.
argument-hint: [paths | --diff] [--fix] [--verify] [--deep] [--framework react|angular]
---

Run the **design-system checker**. Arguments: `$ARGUMENTS`.

This references skills, it doesn't contain the rules — the knowledge lives in the DS skills (`design-principles` + `design-tokens` + `components`). The command only orchestrates, and it is built to stay **cheap and bounded by default**.

**Default is audit (report only).** It inspects and hands you findings; *you* decide what to change. `--fix` does **one bounded fix pass** (no build, no repeat) unless you ask for more.

## Parse arguments
- **(no flag)** → **audit only**: inspect, present findings + verdict, **stop**. No edits.
- `--fix` → apply the audit's fixes in **one pass**, then report and stop. No build, no re-inspect loop.
- `--verify` → after the fix pass, run the project's build/lint once (off by default — builds are the most expensive step).
- `--deep` → allow the fix→verify→re-inspect loop to repeat (max 2 rounds). Use only when you know it's worth it; this is the expensive path.
- `--diff` or no paths → target the uncommitted diff. Otherwise target the given paths.
- `--framework react|angular` → force the lens (otherwise the reviewer auto-detects).

**Keep it scoped.** Prefer a single component / file (e.g. the nav bar, one table) over `--diff` of a big change or a whole app. If a broad target is given, **say so and suggest narrowing before doing any `--fix` work.**

## Cost guardrail (self-check — surface, don't silently grind)
You can't meter tokens precisely, but you can watch the *shape* of the work. Treat these as stop-and-check points and **tell the user** when you hit one rather than pushing through:
- **Audit** should be small. If you find yourself reading far beyond the target (whole app, many files), stop — you're over-reading. Re-scope.
- **A `--fix` pass on one component** should be a handful of small edits. If it's turning into a large multi-file diff or a second/third round, **stop and report what's done + what remains** — don't keep going.
- Rough sizing to internalize: a scoped audit is light; a one-component fix is a small diff. If a single table is producing a sprawling change or repeated build cycles, that's the signal to halt and hand it back, not to finish at any cost.
- The build/verify step is the biggest token sink — that's why it's opt-in (`--verify`). Never build more than once per invocation unless `--deep`.

## Audit (always runs first)
Spawn the **`ds-reviewer`** subagent on the target. It discovers framework/token-source/component-library/context, checks values against the matching framework tell-sheet + `components`, pulls in principles only for judgment calls, and returns findings with `file:line` + a verdict. **Present the report.** If there's no `--fix`, stop here — done.

## Fix (only with `--fix`)

0. **Pick this repo's fixer** (portability — don't assume portfolioV2's agents exist here): use the project's code-writing subagent if it has one (`code-writer` in portfolioV2, `builder` in Coherence, or similar; check `.claude/agents/`). If none exists, **the orchestrator applies the edits directly** (they're small and mechanical). State which you chose.

1. **One fix pass.** Apply the audit's fixes: swap hard-coded values for tokens, replace bespoke elements with the project's DS components, remove flagged anti-patterns. Small diffs, no re-hard-coding on the replacement, honor documented escape hatches. Then **report what changed and what (if anything) remains, and stop.** The user re-runs `/ds-cleanup <same path> --fix` if they want another pass — this keeps every run bounded.

2. **Verify — only if `--verify`.** Pick the repo's verifier (`test-runner`/`tester`, else its own `lint`/`build`; skip if nothing to run) and run it **once**. On failure, report the failure — don't spiral into repeated build cycles. Without `--verify`, tell the user to build/verify themselves.

3. **Iterate — only if `--deep`.** Re-inspect and repeat the fix→verify pass, **max 2 rounds**, until the stop conditions below hold. Without `--deep`, do not loop.

**Stop conditions (for `--deep`, and the bar for "clean"):** no raw/hard-coded colors; no hard-coded spacing/radius/shadow/motion; no bespoke component where a DS component exists; no flagged anti-patterns; (if verified) the app builds; remaining exceptions documented.

## Hard rules
- **Audit is the default; only `--fix` edits.** Without `--fix` this never touches a file.
- **Bounded by default.** `--fix` = one pass, no build. Building is `--verify`; looping is `--deep`. Never silently escalate to the expensive path.
- **Never invent a token.** If a needed value isn't in the token system, stop and ask (or extend + document) — do not inline it.
- **Hit a guardrail → stop and report.** A sprawling diff or repeated builds on a small scope means halt and hand back, not finish at any cost.
- **`ds-reviewer` is read-only and always does the inspecting.** Editing is done only by the repo's chosen fixer, verification only by its verifier — never by the reviewer. Mirror of the dev loop (writer → tester → reviewer), but the writer/tester are whatever this repo provides.

Full rules: the DS skills (`design-principles` / `design-tokens` / `components`) and the `ds-reviewer` agent (plus this repo's own fixer/verifier agents).
