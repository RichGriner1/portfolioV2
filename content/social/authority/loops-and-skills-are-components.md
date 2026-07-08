---
title: "Loops and skills are components, not folders"
source: published/authority/loops-and-skills-are-components.md
pillar: authority
stance: builder
status: draft
created: 2026-07-08
posted_at:
typefully_ids:
  linkedin:
  twitter:
---

## Standalone tweets (8)

Each one stands on its own. Mix into the schedule across the two weeks after this drops. Order isn't fixed. No thread for this post, standalones only, per the single-list-over-thread preference in voice.md.

---

**Standalone A — the folder instinct**

Asked an AI how to organize a pile of reusable prompts. It said: put them in folders, one file per loop.

Wrong shape. A loop isn't a file, it's a process. It opens what it needs, runs the steps, stops.

---

**Standalone B — the cap instinct**

Ever hit a token spike and think, I'll just cap it?

Tried that. A self-stopping budget belongs to a heavier system that tracks its own spend. A loop just runs start to finish. No meter to check.

---

**Standalone C — two meters**

102,000 tokens. One table. One fix run.

Turns out there are two meters, not one: money a subagent spends once, and the main conversation, which gets re-read in full on every turn after.

---

**Standalone D — the log dump**

I've pasted a full build log into an AI chat before, just to "let it see the output." Hundreds of identical Sass warnings, 8,000 to 12,000 tokens of pure noise.

Filtering to errors before they hit the thread was the cheapest fix I've made.

---

**Standalone E — the redundant re-read**

One step in my loop summarized a file. The next step, same run, re-read the whole thing from scratch: about 1,500 lines, one file alone accounting for 536 of them.

Only caught it by counting where the tokens went.

---

**Standalone F — the symptom prompt**

A 200-line prompt is a symptom, not a problem.

Mine got that long because the step before it had re-read the entire source file and handed all of it down. Fix the re-reading upstream and the prompt shrinks on its own.

---

**Standalone G — the hard-coded name**

My cleanup tool assumed every project names its "fix it" agent the same thing. First project that wasn't mine, it broke.

Mine calls it code-writer. Theirs calls it builder. Detecting the name instead of assuming it is what let the tool travel.

---

**Standalone H — cheap model, done right**

Does a cheaper model actually save you money? Depends on the job.

For open-ended work, retries from a weaker model can cost more than a stronger one done right. For a narrow rulebook check, the cheap model got it right every time I tested it.

## LinkedIn post (~195 words)

If you use AI tools day to day, you've probably rebuilt the same prompt from memory more than once, typing "audit this against my design system" fresh, every time, with no way to fix it once and reuse it.

I started building a small library for that: reusable, documented pieces I could point Claude Code at instead of retyping instructions. The first real test didn't go the way I expected. A cleanup tool I'd built ran a single fix on one table and quietly burned about 102,000 tokens. My first instinct, add a spending cap, turned out not to be an option at all.

The real issue was something I hadn't separated clearly. Tokens spent on a task I delegate get paid once and forgotten. Anything left sitting in the main conversation gets re-read, and re-billed, on every turn after. Once I fixed that, the same kind of run on a different table came in around 70,000 tokens and stopped on its own.

Still early. If the distinction holds up on the next few runs, it's probably the most useful thing I've learned about running these tools so far.

*Wrote the whole thing up if you want the detail: [link]*

## Notes

- **Stance:** Build-in-public throughout. Each standalone opens on a problem a reader building with AI tools has likely also hit (the folder instinct, the cap instinct, the log dump, the hard-coded name...), then moves through what Richard actually figured out. A hedged close ("if it holds," "so far") appears only where it earns its place (B, C, H, LinkedIn). The other standalones are tight 2-beat problem-to-insight units per the character ceiling: forcing a third beat onto all eight would have blown the 280-char limit.
- **Character counts (verified via script, not eyeballed):** A 202, B 195, C 186, D 240, E 214, F 218, G 244, H 243. All under 280. Lengths deliberately vary (186–244) rather than clustering at one size.
- **Format variety:** Openers differ across the set: statement (A, D, E, G), question (B, H), number-first (C), reframe-line (F, "a symptom, not a problem"). No two standalones share the same hook shape or paragraph rhythm.
- **Em-dashes:** Zero used across all 9 units. Recast every place a dash would have landed into a period, comma, or colon (e.g. Standalone F: "step before it had re-read... and handed all of it down" instead of a dash-linked clause).
- **Known-issue fixes from prior draft:** Standalone E now reads "one file alone accounting for 536 of them" (parses correctly). All references to the 102k-token incident use "table" (Standalone B/C, LinkedIn), never "page." The prior LinkedIn draft had drifted to "page," which contradicted the source post.
- **CTA:** Blog is live, so one soft link on the LinkedIn kicker only. No links on any standalone, no "DM me" or freelance language anywhere.
- **Case-study tie:** The 102,000-token fix run on one table, dropping to ~70,000 bounded on a rerun, is the concrete anchor threaded through Standalones B, C, and the LinkedIn post.
- **Graphic concept (optional):** A simple before/after token count, "102,000 tokens, one unbounded pass" vs. "~70k, second run, same rules, stops on its own," would pair well with Standalone C if a screenshot ever gets made.
