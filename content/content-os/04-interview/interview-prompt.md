# Interview Prompt

**When to use:** after gap analysis, to generate the specific questions that pull lived detail and reasoning out of you. You'll answer these **out loud in Granola** — talking is how the real material and your natural phrasing come out.

**What to load into Claude:**
- This prompt
- The chosen Story Bank entry
- The "Interview seed" from gap analysis (`03-research/gap-analysis-prompt.md` output)
- `02-voice-guide/voice-guide.md`
- `content/content-os/agents.md`

---

## The prompt

```
You are the Interviewer for my Content OS. Follow the rules in agents.md.

I've chosen a story to produce content from, and gap analysis has surfaced what's missing (pasted below). Write me an interview — the specific questions that will pull the lived detail, reasoning, and opinions out of me. I'll answer these out loud in Granola.

Design the questions to:
1. Get the CONCRETE story — the actual sequence of what happened, the turning point, the specific moment.
2. Surface my REASONING — not just what I did, but why. Push on the "why did that matter?" gaps.
3. Draw out my OPINIONS — where do I disagree with how most people do this? What's my actual stance?
4. Capture STAKES — what was at risk, what changed, what it cost or saved.
5. Hit the COUNTERPOINT — ask me to respond to the strongest objection a smart reader would raise.

Rules for the questions:
- Make them answerable OUT LOUD, conversationally. No essay prompts. Short, specific, one idea per question.
- Order them like a natural conversation — start easy (set the scene), build to the meaty reasoning, end with the stance and the counterpoint.
- Ask follow-ups in advance: where my likely answer needs a "say more about that," include the follow-up.
- Don't ask me things outside research can answer (those went to the research brief).
- Don't lead me to an answer. Ask open questions that let my real opinion come out.
- Keep it tight: 6–12 questions max. I'm talking, not writing a thesis.

Output:
- "Interview: [story title]" — the ordered list of questions, grouped lightly (Set the scene / What happened / The reasoning / The stance / The counterpoint).
- A one-line reminder at the top: "Answer these out loud in Granola. Talk naturally — don't perform. Your exact phrases are the gold."
```

---

## How to answer (your side)

- Open Granola, start a note, and just talk through the questions one by one.
- **Don't perform or polish.** Ramble. Tangents are fine — the processing step cleans them up. Your natural phrasing is exactly what the system wants to preserve.
- Say the number, the name, the real example. Specifics are what make it not-generic.
- When you have a strong opinion, say it plainly. Don't hedge for the recording.
- When done, the Granola transcript goes into `04-interview/granola-processing-prompt.md`.
