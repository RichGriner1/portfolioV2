# Gap Analysis: Design MD as a modular system

- **Story:** `design-md-modular-2026-04-30` (Story Bank)
- **Pillar:** Blog — "Design MD" / "Project planning with AI" / "AI unlocks documentation"
- **Rank:** #1 (strongest unpublished take)
- **Run:** 2026-06-21
- **Already-published guard:** A LinkedIn post name-drops design.md as one of three tips but does NOT make this entry's core argument. The blog must go deeper than "use a design.md or a skill."

---

## Gap list (by category)

### 1. Missing detail
- `[ASK]` The concrete with/without result — Granola flagged "header background tokens, table lines, and tags needed refinement" without the Design MD. What *specifically* came out worse? Name 2–3 real differences.
- `[ASK]` What's actually in the "Caveman" repo, and how much did it cut token cost? (You said "significant" — give the number or a before/after.)
- `[ASK]` Did the **skills + router** model actually ship, or is it still a plan?
- `[ASK]` Timings beyond the 3–4 hours for the showcase — any other concrete numbers?

### 2. Missing reasoning
- `[ASK]` *Why* does AI copying an existing codebase's patterns make the Design MD redundant there? Spell out the mechanism in plain terms (a non-technical reader needs the "because").
- `[ASK]` *Why* did you move from one big document to skills + router — what actually broke or got worse with the single doc?

### 3. Missing evidence
- `[RESEARCH — optional, 1 line max]` Is there an established idea you can *nod* to so your take has a peg — e.g. docs-as-context / "context engineering," or how AGENTS.md / CLAUDE.md conventions work? Use it as a single contrast line, not a crutch. **Skip if it dilutes the story.**

### 4. Missing counterpoint
- `[ASK]` When does a Design MD *still* help on an existing project? (Keeps the take from being an absolute — "docs are pointless on old code" is too strong.)
- `[ASK]` "AI reads the codebase" — is that only true for *clean* codebases? What happens on a messy one?

### 5. Missing stakes
- `[ASK]` What did the Design MD actually save or cost — time, AI spend, rework? Why should the reader care enough to change what they document?

---

## Interview seed (→ `04-interview/interview-prompt.md`)

Answer out loud in Granola. Talk naturally; your exact phrases are the gold.

1. Walk me through the with/without test. Pick the clearest example — what did the AI produce *without* the Design MD that was wrong, and what changed *with* it?
2. In your own words, why does the AI barely need the Design MD on an existing project? What's it actually doing instead?
3. You moved from one big doc to "skills + router." What pushed you there — what was annoying about the single document?
4. When would you still bother writing a Design MD for an old codebase? Is there a case where it *does* earn its keep?
5. What did this whole thing save you — in hours, in AI cost, in back-and-forth? Give me the realest number you have.
6. The "Caveman" repo — what is it, and what did it change?

## Research seed (→ `03-research/research-brief-template.md`)

**No outside research needed — this is a lived experiment.** At most, one optional contrast line placing your take against docs-as-context conventions. Do not build a research brief unless that single line feels essential.

## Readiness

**Ready to produce after the interview.** Default to **standalone X tweets first** (framework #4 "you don't need X" or #1 "biggest mistake" fit well), then the LinkedIn polish, then the blog. The story is strong and almost entirely lived — the only thing between it and a draft is recording the concrete with/without detail.
