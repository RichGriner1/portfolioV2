# Portable Claude library (`.claude/lib/`)

Richard's cross-project skills + loops. **Authored here** (portfolioV2 is home base, git-tracked), **published into user scope** (`~/.claude/`) so they're available in *every* project — portfolioV2, Coherence/Afi (Angular), kt360, etc.

## The model: loops vs skills

- **Skills = knowledge** (standards, rules, decisions, examples). No workflow. → `skills/<name>/SKILL.md`.
- **Loops = process** (small, one objective, clear stopping condition; *reference* skills instead of duplicating them). → `commands/<loop>.md`, orchestrating agents in `agents/`.

There is no `loops/` folder in Claude Code — a loop is a slash command that loads skills and iterates.

## Why `.claude/lib/` and not `.claude/skills/`

`.claude/skills/` would auto-register as *project* skills; combined with the user-scope symlink that would double-register in this repo. `lib/` is inert locally — the single symlink into `~/.claude/` is the only registration, so everything (including portfolioV2, via user scope) loads each item exactly once.

## Publishing (sync)

```bash
npm run claude:sync         # dry-run — print the plan
npm run claude:sync:apply   # create/repair the symlinks in ~/.claude
node scripts/claude-lib-sync.mjs --check   # CI-style drift check (exit 1 if out of sync)
```

Per-entry symlinks, additive (won't touch other user-scope items), idempotent, never clobbers real files. Re-run on a new machine to reinstall the whole library in one command. Edit a file here → it's live everywhere immediately (symlinks point back to this repo).

## What's here (phase 1)

**Skills**
- `design-principles` — the 11 Afi Next principles + what-to-avoid + the 10-question decision filter (sourced from Figma: AFI-FOUNDATIONS-MODERN `2035-2` / `2035-65`). The judgment layer.
- `design-tokens` — universal "never hard-code, never skip layers" rule + discovery (framework / token source / component library) + framework tell-sheets (React-Tailwind, Angular).
- `components` — prefer the project's DS components over bespoke (shadcn / PrimeNG / custom / none).
- `design-system` — thin umbrella that loads the three above + the exceptions policy.
- `writing-substance` — voice- and language-neutral substance + clarity + length gate (the "unclear / too short / forced" catcher).

**Loops (commands)**
- `/ds-cleanup [paths|--diff] [--fix] [--verify] [--deep] [--framework …]` — **audit by default** (report only). `--fix` = one bounded fix pass (no build, no loop); `--verify` builds once; `--deep` allows up to 2 fix→verify rounds. Bounded by default to control cost. Uses `ds-reviewer` + the repo's own fixer/verifier. Scope to one component.
- `/content-review <file> [--fix]` — critical read against `writing-substance` + the language lens (EN → `voice-griner`, ES → `afi-redaccion`). Uses `content-critic`.

**Agents**
- `ds-reviewer` — read-only DS inspector.
- `content-critic` — read-only skeptical editor.

## Adding a skill or loop

1. **Skill:** `mkdir skills/<name>`, add `SKILL.md` (frontmatter: `name`, `description`) + optional `references/`. Keep it focused — one responsibility.
2. **Loop:** add `commands/<loop>.md` (frontmatter: `description`, `argument-hint`; body uses `$ARGUMENTS`). It should *load skills and iterate*, not embed rules. Add a reviewer/agent in `agents/` if the loop needs a read-only inspector.
3. Run `npm run claude:sync:apply`.

## Roadmap (Richard's design-process taxonomy)

Phase 1 above is a vertical slice. Next, following the Discover → Define → Design → Validate → Deliver → Improve taxonomy:

- **Design phase (next):** Component Audit, UX Heuristic Review, UX Copy Review — skills `accessibility`, `ux-heuristics`, `ux-writing`, `writing-style`, `case-study`.
- **Method loops** (need an input artifact — Figma frame, research doc, analytics export): Research Synthesis, Journey / User-Flow Review, Persona, Service Blueprint, Usability, Analytics. Buildable, but they *critique/produce a document* rather than auto-fix code — add each when its input is available.
- **Figma design-side checking** via the Figma MCP (code-side first).
