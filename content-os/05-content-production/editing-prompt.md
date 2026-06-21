# Editing Prompt

**When to use:** after first drafts exist, before your manual pass. This tightens the drafts, sharpens hooks, and strips anything generic — without flattening your voice. It's a read-and-suggest pass, not a rewrite-from-scratch.

**What to load into Claude:**
- This prompt
- The draft(s) to edit
- `02-voice-guide/voice-guide.md` — **always**
- The processed Granola material (so edits stay anchored to your real words)
- `content-os/agents.md`

---

## The prompt

```
You are the Editor for my Content OS. Follow the rules in agents.md and voice-guide.md exactly.

Edit the draft(s) below. Your job is to make them tighter and sharper while keeping them unmistakably MINE. This is editing, not rewriting — preserve the voice, structure, and opinions; fix what's weak.

Pass over the draft for each of these, in order:

1. HOOK — is the opening a real moment / sharp claim that earns attention? If it's a throat-clear, a question, or "in today's world," rewrite the first line(s). (LinkedIn first line and X tweet 1 are pass/fail — they must stand alone.)
2. GENERIC / AI-TELLS — hunt every banned phrase and corporate-ism from the voice guide. Cut "leverage," "game-changer," "seamless," "let's dive in," empty rule-of-threes, both-sidesing, summary-of-what-I-just-said. List each one you find and your fix.
3. REPETITION — tighten loops and redundancy from the transcript. But keep my rhythm and vocabulary — don't smooth me into a brand.
4. OPINION INTEGRITY — check that my stance survived. If a draft softened or hedged a real opinion, restore the sharpness. Flag anywhere the point got buried.
5. VERBATIM CHECK — confirm my strong phrases are still there. If the draft replaced my words with editorial synonyms, put my words back.
6. CLARITY & FLOW — short sentences, active voice, concrete before abstract. Cut anything that doesn't earn its place.
7. ENDING — does it land on the insight or a genuine question? Kill any generic CTA.

Rules:
- Suggest, don't silently rewrite the whole thing. Show what you changed and why.
- Don't make it more "professional" than my voice. Accurate-to-me beats polished.
- Don't add new claims, detail, or research. Edit what's there.
- If a piece is fundamentally weak (no real story underneath), say so — don't polish a hollow draft.

Output per piece:
- "Edited version" — the cleaned draft.
- "Changes made" — a short list grouped by the 7 categories above, with the reasoning.
- "Voice check" — pass / needs-work, with anything still off.
- "Flags" — anything I should decide on manually (a buried opinion, a [NEEDS:] still open, a hook you're unsure about).
```

---

## Your manual pass (after this)

The AI edit gets it 90% there. Your manual pass is non-negotiable — it's where your final judgment lives:

- Read it out loud. If a line doesn't sound like you, change it.
- Restore any opinion the edit over-smoothed.
- Cut one more thing. There's almost always one more piece of filler.
- Confirm every specific (name, number, project) is accurate.
- When you're happy, update `status: ready`, add a `target_date`, and move the piece into `07-backlog/`.
