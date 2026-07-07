---
description: Content clarity loop — read a piece critically for substance, clarity, length, and forced angles (the "unclear / too short / forced" failures), layering the right language lens (EN → voice-griner, ES → afi-redaccion). Reports fixes; iterate until it reads clear and complete.
argument-hint: <path-to-file> [--fix]
---

Run the **content review loop** on the file: `$ARGUMENTS`.

If `$ARGUMENTS` is empty, ask Richard which file to review.

This loop references skills, it doesn't contain the rules. The rubric is the `writing-substance` skill (voice- and language-neutral) plus a language lens on top. It's the gate behind *"voice-keeper pass + post-reviewer ship ≠ good writing"* — it catches copy that's clean on tone but unclear, too short, or forced.

## The loop

1. **Critique** — spawn the **`content-critic`** subagent on the file. It loads `writing-substance` + the detected language lens (EN → `voice-griner`; ES → `afi-redaccion` + Peninsular/calque checks), reads critically, and returns: the takeaway quoted back (or "NOT STATED"), blockers/suggestions with quoted lines, and a verdict (`ship | revise`).

2. **If `ship`** → present the report and stop.

3. **If `revise`**:
   - **Default (no `--fix`)** → present the critic's blockers to Richard so *he* revises (his voice, his call). Do not rewrite his content silently.
   - **With `--fix`** → spawn `code-writer` (or the appropriate content editor) to apply the specific fixes the critic named — never to invent a new angle. Then re-run `content-critic`.

4. **Repeat** 1–3 (with `--fix`) until verdict is `ship` — meaning it clears substance, clarity/length, *and* reads clean in its language lens.

## Hard rules
- **Substance outranks tone.** A perfectly-voiced piece with no stated takeaway still fails. The critic quotes the takeaway back; if it can't, that's a blocker.
- **"Too short" is a real blocker.** If the takeaway is asserted but not developed, flag it — don't ship a headline pretending to be a post.
- **Don't rewrite Richard's voice without asking.** Without `--fix`, this loop *reports*; Richard revises. It complements the existing content pipeline (`syndicator → voice-keeper → post-reviewer`), it doesn't replace it.
- **Spanish gets the Spanish lens.** Confirm `afi-redaccion` (not the English lens) is applied to ES text.

Full rules: `$HOME/.claude/skills/writing-substance/SKILL.md` and the `content-critic` agent.
