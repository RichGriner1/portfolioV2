# Voice examples

Real posts that define or inspire Richard's voice. Two kinds live here:

1. **Richard's own published posts** — the source of truth for how he actually sounds. The voice guide is refined from these (via `../voice-update-prompt.md`).
2. **Liked posts** (external) — posts by other people whose voice/structure Richard wants to learn from. See `liked-posts.md`.

> **Why transcribe?** Screenshots are kept for reference, but the AI can't reliably read text inside an image during a voice lint. So every example is also **transcribed to markdown text below** — that's what makes it usable as a voice sample.

---

## Richard's published posts

### 1. Design ↔ dev consistency (LinkedIn, ~May 2026)

- **Image:** `richard-linkedin-design-dev-consistency-2026-05.png`
- **Platform:** LinkedIn
- **Maps to Story Bank:** `designing-against-the-build-2026-02-16` (arc) + touches `design-md-modular-2026-04-30` (tip 2) and `ds-naming-afi-azul` (tip 3)
- **Engagement (noted):** ~12 reactions at time of capture

**Full transcription:**

> After a lot of trial and error, I was excited to finally cut the inconsistencies between design and development.
>
> However, when I sat with the programmers and looked at the code. It was awful 😅
>
> We had improved the experience at lightning pace. But it wasn't scalable.
>
> So, I started learning component and variable architecture to reach more consistency in code.
>
> This has got me really excited about this new era of design and I'm able to see the impact in how we're working and talking about products.
>
> We feel more aligned in our goal make the handoff as easy as possible. If you're looking to do the same for your team, I'd start here:
>
> 1. Audit your token layers in Figma and make sure they match to code. Double check mappings and responsive design. Set yourself up for success in the future.
>
> 2. Put your learnings and proper structure in your design.md or a skill. Tokens, design notes, and component structure in one file.
>
> 3. Stay explicit, every time. When you're planning, name the files, the structure, the conventions — even when the agent already has a skill. Long conversations drift. (Side note: Wispr Flow helps with this)

**Voice signals extracted (fed into voice-guide.md):**
- Opens with a **first-person trial-and-error story**, not a thesis: "After a lot of trial and error…"
- **Vulnerable admission** as the turn: "It was awful 😅" — emoji used sparingly and genuinely.
- **Fragments for emphasis:** "But it wasn't scalable."
- **Zoom-out beat** before the takeaway: "this new era of design… how we're working and talking about products."
- **Generous teaching close:** "If you're looking to do the same… I'd start here:" → a **numbered, genuinely useful** list (not filler).
- **Tools named as part of the craft:** design.md, Wispr Flow.
- Short paragraphs, lots of white space, conversational.

---

## How to add a new example

1. Drop the screenshot in this folder with a descriptive name: `richard-<platform>-<topic>-<YYYY-MM>.png` (or `liked-<author>-<topic>.png`).
2. Add an entry above (for Richard's posts) or in `liked-posts.md` (for others').
3. **Transcribe the text** — this is the part that makes it usable.
4. When you've added a few, run `../voice-update-prompt.md` to fold the new signals into `voice-guide.md`.
