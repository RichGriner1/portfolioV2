# Content OS

A local, markdown-based system for turning raw thinking into published content — without sounding like generic AI.

The whole point: **stories come first.** You live the work, capture rough thoughts, and the system helps you shape those into a story bank, research briefs, interview questions, and finished drafts. Research and frameworks support your lived experience. They never replace it.

This folder is designed to be opened in Claude (or any capable AI) alongside your raw inputs — Wispr voice notes, Granola transcripts, project lessons, and a running list of content ideas.

---

## Core principles (the non-negotiables)

These rules govern every prompt and template in this system. If a draft violates one, it's wrong.

1. **Stories come before research.** Capture what happened first. Research only enters to support a story that already exists.
2. **Research supports lived experience.** It adds evidence, context, or contrast — it never becomes the spine of the piece.
3. **Do not create generic AI content.** No filler, no "in today's fast-paced world," no listicle padding.
4. **Preserve opinions and reasoning.** Keep the stance. Keep the *why*. Don't sand down a strong take into something safe.
5. **Preserve useful phrases from Granola.** When you said something well out loud, keep your words.
6. **Clean up repetition, don't make it corporate.** Tighten loops and tangents. Keep the human voice.
7. **Use my vocabulary where possible.** Match the words I actually use, not synonyms an editor would reach for.
8. **If there's no strong story, ask for more context before drafting.** A weak story is a signal to gather, not to generate.
9. **Frameworks are discovered, not forced.** When the same pattern shows up across several stories, name it. Don't invent frameworks to look smart.
10. **Sound practical, clear, direct, and story-first.**

---

## What each folder is for

| Folder | Purpose |
|---|---|
| `01-story-bank/` | The heart of the system. Every lived experience, lesson, or moment becomes a structured Story Bank entry. Wispr notes get processed into here daily. |
| `02-voice-guide/` | The source of truth for how I sound. Drafting and editing prompts read this so output matches my voice. Updated as the voice clarifies. |
| `03-research/` | Research briefs and the workflow for gathering supporting evidence — only *after* a story is chosen. Includes gap analysis to find what's missing. |
| `04-interview/` | Interview question generators and the prompt for processing Granola transcripts of me answering them. This is how lived detail gets pulled out. |
| `05-content-production/` | Templates (blog, LinkedIn, X thread, standalone tweets) plus the drafting and editing prompts that combine everything into finished content. |
| `06-content-ideas/` | The running master list of every content idea, organized by type. The weekly review cross-references this. |
| `07-backlog/` | Where finished, manually-edited content lands, scheduled and ready to ship. |

---

## How to use the system — daily

Low effort. The daily loop exists to *capture*, not to publish.

1. Throughout the day, record rough thoughts in **Wispr** — what you worked on, what worked, what broke, what you figured out, what annoyed you.
2. At end of day, open Claude with `01-story-bank/daily-story-processing-prompt.md` and paste in your Wispr notes.
3. Claude converts them into **Story Bank entries** using `story-bank-template.md` and appends them to the story bank.
4. **No content is written daily** unless you explicitly ask for it. The daily job is done when the stories are captured.

> The discipline here is restraint. Capturing stories without immediately turning them into posts is what keeps the writing honest and prevents thin content.

---

## How to use the system — weekly

This is where content actually gets produced. Block ~60–90 minutes.

1. Open Claude with `01-story-bank/weekly-prioritization-prompt.md`. Claude reviews recent Story Bank entries and **prioritizes the top 1–3 stories**.
2. Claude **cross-references** those stories against your **Granola transcripts** and `06-content-ideas/content-ideas.md` to see what connects.
3. Claude runs **gap analysis** (`03-research/gap-analysis-prompt.md`) to identify what's missing — what you'd need to make the story land.
4. Claude writes a **research brief** (`03-research/research-brief-template.md`) for any gaps that need outside evidence.
5. Claude generates **interview questions** (`04-interview/interview-prompt.md`) — the specific questions that will pull the lived detail out of you.
6. **You answer those questions in Granola** (talk through them out loud; Granola transcribes).
7. Claude processes the Granola transcript (`04-interview/granola-processing-prompt.md`), then **combines** story + research + interview transcript + voice guide.
8. Claude drafts, using the content-production prompts and templates:
   - **blog** (`blog-template.md`)
   - **LinkedIn post** (`linkedin-post-template.md`)
   - **X thread** (`x-thread-template.md`)
   - **standalone tweets** (`standalone-tweets-template.md`)
9. **You manually edit** the drafts (`05-content-production/editing-prompt.md` helps), then move finished pieces into `07-backlog/`.

---

## What to upload into Claude

Depending on the loop, give Claude:

- **Daily:** the relevant prompt from `01-story-bank/` + your raw Wispr notes for the day.
- **Weekly:** the relevant prompts/templates + the current `story-bank.md` + recent **Granola transcripts** + `content-ideas.md` + `02-voice-guide/voice-guide.md`.
- **Always include the voice guide** when anything is being drafted or edited. It's the guardrail against generic output.

> Tip: keep the active Story Bank, voice guide, and content ideas as the three "always loaded" files. Everything else is loaded per-task.

---

## How to produce the first 2-week content backlog

A one-time kickstart to fill `07-backlog/` with ~2 weeks of content so the engine has runway.

1. **Seed the story bank.** Spend 30–45 minutes talking through your last few projects in Wispr (KT360, AFI, Story Architect, The Collective, etc.). Process all of it with the daily prompt so the Story Bank has 10–20 real entries.
2. **Bulk-prioritize.** Run the weekly prioritization prompt, but ask for the **top 6–8 stories** instead of 1–3. These become your two weeks of anchor content.
3. **Cross-reference once, broadly.** Have Claude map those 6–8 stories against `content-ideas.md` and your Granola transcripts in a single pass, grouping ideas that share a story.
4. **Batch the interviews.** Generate interview questions for all chosen stories at once. Answer them across 2–3 Granola sessions.
5. **Draft in a batch.** For each story, produce the blog + LinkedIn + X thread + standalone tweets. Don't perfect — get full first drafts.
6. **Edit and schedule.** Manually edit each piece using the editing prompt, then move finished content into `07-backlog/` with target dates. Aim for a cadence (e.g. 2–3 posts/week) that the two weeks comfortably covers.
7. **Resume the normal loop.** Once the backlog is seeded, drop back to the light daily capture + single weekly production session.

---

## File map

```
content-os/
  README.md                  ← you are here
  agents.md                  ← roles + rules the AI plays in this system
  01-story-bank/
    story-bank-template.md
    daily-story-processing-prompt.md
    weekly-prioritization-prompt.md
  02-voice-guide/
    voice-guide.md
    voice-update-prompt.md
  03-research/
    research-brief-template.md
    research-workflow.md
    gap-analysis-prompt.md
  04-interview/
    interview-prompt.md
    granola-processing-prompt.md
  05-content-production/
    blog-template.md
    linkedin-post-template.md
    x-thread-template.md
    standalone-tweets-template.md
    content-drafting-prompt.md
    editing-prompt.md
  06-content-ideas/
    content-ideas.md
  07-backlog/
    backlog-template.md
```
