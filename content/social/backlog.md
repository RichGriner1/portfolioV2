# Social posting backlog

Cadence: **Mon / Wed / Fri**. Each entry has its own file with frontmatter (`status`, `scheduled_for`, `posted_at`).

| Date | Day | Title | File | Status |
|---|---|---|---|---|
| 2026-05-20 | Wed | Build the design system before AI builds with it | [link](process/2026-05-20-build-system-before-ai.md) | draft |
| 2026-05-22 | Fri | AI is fast. The system makes it compound. | [link](process/2026-05-22-ai-fast-system-compounds.md) | draft |
| 2026-05-25 | Mon | The logo is a component now, not a folder | [link](process/2026-05-25-logo-is-a-component.md) | draft |
| 2026-05-27 | Wed | AI can't visit a website. It can read code. | [link](process/2026-05-27-ai-cant-visit-website.md) | draft |
| 2026-05-29 | Fri | Record yourself making decisions | [link](process/2026-05-29-record-decisions.md) | draft |
| 2026-06-01 | Mon | Hide, don't delete. Audit as you go. | [link](process/2026-06-01-hide-dont-delete.md) | draft |

## Status meanings

- **draft** → still being shaped. Voice may still be wrong, copy may still get edits.
- **ready** → reviewed, voice-checked, copy is final. Ready to paste into LinkedIn + Twitter composers.
- **posted** → live. Fill in `posted_at` in the file's frontmatter; update the table here.

## Sources

All six entries grew from the brainstorm batch on [2026-05-20](process/2026-05-20-micro-content-batch.md), which pulled ideas from the Granola **Processes** folder for that day's two recorded working sessions (component architecture / logo system, top nav bar / pattern library).

## Adding new posts

When you record a new working session and want to seed more posts:

1. Run `/journal` for the day if you haven't.
2. Use `/syndicate <published-file>` to spawn the syndicator → voice-keeper → post-reviewer chain on a published case study, **or** drop a new brainstorm batch file into `content/social/<pillar>/YYYY-MM-DD-<topic>-batch.md` and split each idea into its own dated post file like the ones above.
3. Add the row to the table here with the next open Mon/Wed/Fri slot.

## Conventions

- Filename: `YYYY-MM-DD-<slug>.md` where the date is the **scheduled** post date (so the calendar reads chronologically in the file tree).
- One post per file. Don't bundle.
- Schedule changes update **both** the table and the file's frontmatter.
