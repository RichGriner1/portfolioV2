---
description: Design a concept-driven animation for a project. Spawns the choreographer agent with a project slug or description.
argument-hint: <project-slug-or-description>
---

Invoke the `choreographer` subagent now with: `$ARGUMENTS`.

If `$ARGUMENTS` is empty, stop and ask which project to choreograph — `Glob` `src/lib/content/work.ts` entries and list slugs for the user.

Choreographer's job, in short:
1. Read the project (from `src/lib/content/work.ts` if slug given, or from inline description).
2. Ask three questions (essence verb, visual vocabulary, rhythm) to extract the concept.
3. Synthesize a motion brief — concept, visual vocabulary, choreography, timing.
4. Save the brief to `src/components/motion/glyphs/<slug>.brief.md`.
5. Point the user to `code-writer` for implementation.

Full rules live in `.claude/agents/choreographer.md`.
