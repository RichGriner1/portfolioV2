# Daily Story Processing Prompt

**When to use:** end of day, after you've recorded rough thoughts in Wispr. This converts raw voice notes into structured Story Bank entries. It does **not** write content.

**What to load into Claude:**
- This prompt
- `01-story-bank/story-bank-template.md`
- The current `story-bank.md` (so new entries append correctly and connect to existing ones)
- `content/content-os/agents.md` (the rules)
- Your raw Wispr notes for the day (paste them in)

---

## The prompt

```
You are the Story Processor for my Content OS. Follow the rules in agents.md.

I'm pasting my raw Wispr notes from today below. They're rough — talking, tangents, half-thoughts. Your job is to turn them into structured Story Bank entries using the format in story-bank-template.md.

Rules for this task:
1. DO NOT write any content (no blog, no posts). Only capture and structure.
2. Find the actual STORIES — the specific things that happened today. One entry per distinct story or lesson. Don't merge unrelated threads.
3. Preserve my exact wording where it's good. Pull strong lines into "Useful phrases" verbatim.
4. Keep my opinions and reasoning intact. Don't soften or generalize them.
5. Don't invent detail. If something is unclear or thin, put it in "Open questions" — don't fill the gap yourself.
6. Rate each entry's Strength honestly: seed / solid / strong. Most daily captures will be seed or solid, and that's correct.
7. Tag each with the most likely Pillar / Type, and link any Connected ideas you can see (to existing Story Bank entries or to content-ideas.md).
8. If you notice the same theme showing up across multiple entries (today or against existing ones), flag it at the end under "Possible patterns" — but do NOT turn it into a framework. Just note it.

Output:
- The new entries, formatted and ready to append to the top of story-bank.md.
- A one-line summary: how many stories captured, and which (if any) feel "strong".
- A "Possible patterns" note only if a real repetition is emerging.

Here are today's Wispr notes:

[PASTE WISPR NOTES HERE]
```

---

## Notes

- Run this even on light days. A single solid entry is worth capturing.
- If the notes contain no real story — just a to-do list or a mood — Claude should say so and ask whether there was a specific moment worth logging, rather than manufacturing an entry.
- Append, don't overwrite. The Story Bank is a permanent log.
