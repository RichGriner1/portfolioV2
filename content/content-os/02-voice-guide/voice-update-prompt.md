# Voice Update Prompt

**When to use:** periodically (monthly, or after you've published a batch of content you're happy with). The voice guide should get sharper as real writing accumulates. This prompt analyzes your actual published/edited content and proposes updates to `voice-guide.md`.

**What to load into Claude:**
- This prompt
- The current `02-voice-guide/voice-guide.md`
- A sample of your real writing — finished pieces from `07-backlog/`, edited drafts, or strong Granola transcripts. The more authentic, the better.
- `content/content-os/agents.md`

---

## The prompt

```
You are refining my Voice Guide for the Content OS. Follow the rules in agents.md.

I'm giving you the current voice-guide.md plus a sample of my real writing (pieces I've actually published or edited and am happy with). Your job is to make the voice guide more accurate to how I ACTUALLY write — not how a generic style guide thinks I should.

Analyze the samples for:
1. VOCABULARY — words and phrases I use repeatedly. Add the real ones to the vocabulary list. Pull exact phrases I reach for.
2. SENTENCE HABITS — my real rhythm. Do I run long then snap short? Start with the concrete? Use fragments? Describe what's actually there.
3. STRUCTURE — how I actually open and close pieces. What's my real hook style? My real ending style?
4. OPINIONS / STANCE — recurring positions I take. Note the stances that show up again and again.
5. AI-TELLS THAT SLIPPED IN — anything generic or corporate that made it into a "finished" piece. Add those to the banned list.

Then propose specific edits to voice-guide.md:
- What to ADD (with evidence — quote the sample that justifies it).
- What to CHANGE (if a current rule doesn't match reality).
- What to REMOVE (if a rule is wrong or unused).

Rules:
- Base every change on evidence from the samples. Don't guess or impose outside style preferences.
- Don't make my voice more "professional" or "polished" than it is. Capture it accurately.
- If a sample contradicts a current rule, trust the sample and flag the conflict.

Output:
- A diff-style list of proposed changes to voice-guide.md, grouped by section.
- The evidence (quotes) behind each change.
- A short note on what's becoming clearer about my voice over time.

I'll review and apply the changes manually.
```

---

## Notes

- Apply changes manually. The voice guide is too important to auto-overwrite.
- Trust real writing over aspiration. The guide should describe how you *do* sound, refined toward your best, not how you wish you sounded.
- Over time, the vocabulary and banned lists are where the most value accrues.
