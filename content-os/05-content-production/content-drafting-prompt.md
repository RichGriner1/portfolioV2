# Content Drafting Prompt

**When to use:** the big one. After the story is chosen, gaps filled, interview answered and processed, and research (if any) done. This combines everything into first drafts across all four formats.

**What to load into Claude:**
- This prompt
- The processed Granola material (`04-interview/granola-processing-prompt.md` output) — especially "Keep verbatim" and "Gold"
- The Story Bank entry
- The research brief (if any) from `03-research/`
- `02-voice-guide/voice-guide.md` — **always**
- The four templates in this folder
- `content-os/agents.md`

---

## The prompt

```
You are the Drafter for my Content OS. Follow the rules in agents.md and the voice-guide.md exactly.

You have everything needed to draft (pasted below): the chosen story, the processed Granola material (with my verbatim phrases and opinions), the research brief if any, and the voice guide. Produce first drafts in all four formats.

Build the drafts from these layers, in this priority:
1. STORY is the spine. The lived experience drives every piece.
2. MY WORDS come next. Use the "Keep verbatim" phrases. Build sentences around my actual language and vocabulary. Do NOT translate me into polished generic prose.
3. MY OPINIONS & REASONING stay intact and sharp. Keep the why. Keep the stance.
4. RESEARCH supports — at most a line or two, only where it strengthens the story. Never the spine.
5. VOICE GUIDE governs all of it.

Produce, each following its template in this folder:
- BLOG (blog-template.md)
- LINKEDIN POST (linkedin-post-template.md) — no DM-me / no pitch
- X THREAD (x-thread-template.md) — tweet 1 stands alone
- STANDALONE TWEETS (standalone-tweets-template.md) — 5–10 candidates

Hard rules:
- NO generic AI content. If you catch yourself writing filler, cut it.
- Don't invent detail, numbers, or opinions I didn't give you. If something's missing, leave a [NEEDS: …] marker rather than fabricating.
- Clean repetition from the transcript, but stay human — do not corporatize my voice.
- Only name a framework if the SAME pattern showed up across multiple stories. Otherwise don't force one.
- If the story is too thin to carry good content, STOP and tell me what's missing before drafting. Don't paper over a weak story with polish.

Output, in order:
- A one-line "Story spine" — the single sentence this all hangs on.
- BLOG draft
- LINKEDIN draft
- X THREAD draft
- STANDALONE TWEETS
- "[NEEDS: …]" list — anything you flagged as missing that I should fill before editing.

Each format is a FIRST draft. I'll edit manually with editing-prompt.md and then move finished pieces to 07-backlog/.
```

---

## Notes

- **Always load the voice guide.** Drafting without it is how generic content sneaks in.
- The `[NEEDS: …]` markers are intentional friction — better an honest gap than a fabricated detail.
- If Claude flags the story as too thin, listen. That's rule #8 working. Go back to capture or do another Granola pass.
- These are first drafts. The next step is `editing-prompt.md`, then your own manual edit, then `07-backlog/`.
