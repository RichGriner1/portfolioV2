# Content runbook

How to actually use the content engine, end-to-end. Pin this somewhere you'll find it. If a step here is wrong, fix it — this file is the directions.

For the *what* (stages, pillars, structure), see [README.md](README.md). For the *voice* (tone, banned phrases), see [voice.md](voice.md). This file is the *how*.

---

## The full pipeline at a glance

```
idea          → /journal               → content/journal/YYYY-MM-DD-slug.md   (gitignored)
meeting/chat  → /harvest               → content/journal/YYYY-MM-DD-slug.md   (same format, + source:)
journal       → /polish <file>         → content/drafts/<pillar>/<slug>.md    (voice-keeper lints the draft)
draft         → manual revise + move   → content/published/<pillar>/<slug>.md
published     → /syndicate <file>      → content/social/<pillar>/<slug>.md
social        → manual copy/paste      → LinkedIn + Twitter live posts
```

Five stages. Four slash commands (`/journal`, `/harvest`, `/polish`, `/syndicate`). Two manual moves (draft → published, social → live posts). Case studies have their own loop: `/case-study <slug> --source <harvested-journal>` (see [AGENTS.md](../AGENTS.md)).

---

## Stage 1 — Capture: `/journal`

**When:** end of day, end of a session, or any time something's worth keeping.

**Run:**
```
/journal
```

**What happens:**
- Scribe asks *"What did you work on today?"*
- Then probes each of the four pillars one at a time:
  - Process — workflow, tool, method
  - Breakdown — product/system worth dissecting
  - Authority — strong opinions
  - Experiment — ideas worth building
- If your answer rambles or has multiple threads, scribe asks **one** focused follow-up to identify the main thread (the loop-catcher).
- Saves to `content/journal/YYYY-MM-DD-<slug>.md`.

**Tips:**
- Skip pillars you have nothing for. Don't force content.
- It's fine to talk in fragments — scribe shapes lightly.
- If a topic spans multiple sessions in one day, scribe appends to the same dated file.
- The journal is **gitignored**. Nothing leaves your machine until you polish it.

**Output:** a markdown file at `content/journal/YYYY-MM-DD-<slug>.md`. Frontmatter is `pillar: mixed | <pillar>`, `status: idea`.

---

## Stage 1b — Harvest: `/harvest` (meetings + sessions)

**When:** a Granola meeting or a Claude Code session had content worth mining — a retro, a rant, a working session where you figured something out.

**Run:**
```
/harvest                          # lists last 7 days of meetings, you pick
/harvest "kickoff with X"         # resolves a meeting by title/query
/harvest --source sessions --last 1   # most recent Claude Code session
```

**What happens:**
1. The harvester agent fetches the transcript (never in the main conversation — it stays cheap).
2. Runs the Transcript Processor pass from `content-os/04-interview/`: story in order, **Keep verbatim** (your exact words — the firewall against AI rewrites), opinions kept sharp, 3–5 **Gold** lines, **Still thin** flags.
3. Sorts the seeds into pillar sections and writes the same journal format as `/journal`, with `source: granola:<id>` (or `session:<id>`) in the frontmatter.

**Tips:**
- The journal stays raw speech register — profanity and all. The speech→writing conversion happens at `/polish`, not here.
- Sessions: only *your* typed messages count as verbatim; Claude's replies are context.
- "Still thin" flags are your cue for another quick Granola pass before polishing.

**Output:** a markdown file at `content/journal/<source-date>-<slug>.md` — polish it exactly like a typed journal.

---

## Stage 2 — Polish: `/polish <journal-file>`

**When:** revisiting a journal entry that has a real post in it. Could be the same day; usually weeks later.

**Run:**
```
/polish content/journal/2026-04-15-tokens-rant.md
```

If you don't supply a file, the editor will list recent journals and ask which to polish.

**What happens:**
1. Editor reads `content/voice.md` (mandatory — fails loudly if missing).
2. Editor reads the journal file.
3. Editor picks the **strongest single section** across the four pillars. If two are equally strong, asks which to draft first.
4. **Clarifier step.** Editor asks 1–2 questions before drafting:
   - *"What's the one thing you want a reader to walk away thinking? Here are candidate framings: A, B, C — pick or redirect."*
   - *"Who is this for — designers, design-system folks, fintech, general tech?"* (only if unclear)
5. You answer.
6. Editor shapes the draft (lede → body → kicker), preserving your voice, tightening rambling. Harvested journals get the speech→writing conversion (Gold lines become lede/kicker candidates).
7. Saves to `content/drafts/<pillar>/<slug>.md` with `status: draft`.
8. **Voice gate:** voice-keeper lints the draft against `voice.md` (banned phrases, AI-tells, em-dashes). One correction pass max, then anything left is flagged to you.

**Tips:**
- The clarifier is your friend — answer crisp, even if your journal was loopy.
- If the editor's draft misses your angle, that's signal: tell it, and tell `voice.md` what to remember.
- Editor never writes to `content/published/`. That move is yours.

**Output:** a markdown file at `content/drafts/<pillar>/<slug>.md`.

---

## Stage 3 — Revise + publish (manual)

**When:** the draft is close enough to be worth shipping.

**What you do:**
1. Open `content/drafts/<pillar>/<slug>.md`.
2. Edit by hand. Tighten, cut, sharpen. Add what the editor missed.
3. When ready, **move** the file to `content/published/<pillar>/<slug>.md`. Update frontmatter:
   - `status: published`
   - `created:` — keep the original date; it's when you started the piece, not today.
4. Optional: keep versioned copies under `content/drafts/<pillar>/<slug>/v1.md`, `v2.md`, `v3.md` if you want a paper trail. Not required.

**Why manual:** publishing is a deliberate act. No agent decides for you.

---

## Stage 4 — Syndicate: `/syndicate <published-file>`

**When:** you've published a long-form post and want LinkedIn + Twitter copy.

**Run:**
```
/syndicate content/published/process/design-md-primeng-wealth-manager.md
```

If you don't supply a file, syndicator lists published posts and asks which.

**What happens (three agents chain automatically):**

### 4a. Syndicator
1. Reads `content/voice.md` (mandatory).
2. Reads the published file.
3. **Clarifier step.** Asks 2–3 questions:
   - *"For LinkedIn, what's the one takeaway? Candidate framings: A, B, C."*
   - *"For Twitter, what's the hook? Options pulled from the post: A, B, C."*
   - *"CTA shape — soft pointer, builder-in-public, or no CTA?"*
4. You answer.
5. Picks per-pillar stance:
   - `breakdown` → technical educator
   - `experiment` → builder in public
   - `process` / `authority` → designer who notices
6. Drafts LinkedIn (~150–250 words) + Twitter thread (5–9 tweets) in one file at `content/social/<pillar>/<slug>.md`.

### 4b. Voice-keeper
- Read-only lint pass against `content/voice.md`.
- Flags banned phrases, AI-tells, construction patterns, hashtag stacks, engagement bait.
- Returns `pass` or `revise`. If `revise` → orchestrator re-runs syndicator with the failures.

### 4c. Post-reviewer
- Read-only review for hook quality, stance fit, CTA placement, platform conventions.
- **Hard blocker on LinkedIn:** any "DM me", "Available for…", "The Collective" phrasing. Full-time job — these can't appear.
- Returns `ship | revise | rewrite`.
- `revise` → re-run syndicator with blockers.
- `rewrite` → re-run the clarifier first, then syndicator.

**Output:** `content/social/<pillar>/<slug>.md` with `status: draft`. LinkedIn body and Twitter thread side-by-side. Frontmatter has `pillar`, `stance`, `source`, `status`, plus empty `posted_at` and `typefully_ids` slots.

---

## Stage 5 — Post (manual for now)

**When:** the social file is reviewed and you're ready to ship.

**What you do:**
1. Open `content/social/<pillar>/<slug>.md`.
2. Read both bodies one more time. Trust the agents but verify.
3. Flip `status: ready` in frontmatter.
4. **LinkedIn:**
   - Open LinkedIn composer.
   - Copy the entire LinkedIn body from the file.
   - Paste. Check that the first 2 sentences land in the truncation window (the *"see more"* cutoff is around 200 chars / 3 lines).
   - Post or schedule.
5. **Twitter:**
   - Open Twitter composer.
   - Paste tweet 1. Add the next tweet. Repeat through the thread.
   - Check each tweet is ≤ 280 chars.
   - Post or schedule.
6. After posting, update the file:
   - `status: posted`
   - `posted_at: 2026-04-27T14:30Z` (or whatever)
   - Optional: paste the LinkedIn URL and Twitter URL into a comment block at the end of the file.
7. Commit the file change.

**Why manual:** Typefully API access requires their paid plan. LinkedIn's posting API requires partner approval. Manual paste forces one more voice review and costs $0. When manual annoys you ~10 cycles in, revisit Phase 2 in [the plan](../../.claude/plans/i-have-a-content-swift-ember.md).

---

## Side commands

### `/voice-check <file>`

Ad-hoc voice lint on any markdown file. Useful for:
- Auditing an existing published post.
- Sanity-checking a draft you wrote without `/polish`.
- Linting a social post before posting.

**Run:**
```
/voice-check content/social/process/design-md-primeng-wealth-manager.md
```

Voice-keeper reports findings; doesn't modify the file.

---

## Voice rulebook maintenance

The rulebook at [voice.md](voice.md) is the source of truth. Every writing agent reads it. **It's only as good as you keep it.**

**Update it when:**
- You catch yourself rewriting the same kind of phrase across multiple drafts ("the agent keeps writing 'leverage' even though it's banned" → add to the list, or check the case-insensitivity).
- You discover a phrase that *is* your voice that the agents aren't preserving (e.g., *"earns its keep"*, *"got the same treatment"*) — add to **Approved patterns**.
- A platform changes (LinkedIn algorithm shifts, Twitter character limits change) — update **Per-platform notes**.
- Your stance for a pillar shifts.

**Don't update it for:**
- One-off corrections in a single post. If it only matters once, fix that post and move on.

---

## Common situations

### "The editor missed my angle."

That's the clarifier's failure mode. Three things to do:
1. Tell the editor explicitly what the angle should have been.
2. Look at what you said when answering the clarifier — was the answer crisp, or itself loopy?
3. If the journal section was multi-thread and you didn't pick a clear one, the loop-catcher in scribe should have caught it earlier — update scribe's instructions if it's missing the pattern.

### "Voice-keeper flagged something I actually want to use."

`voice.md` is canonical. Either:
- Edit `voice.md` to remove the rule (if your voice is shifting), OR
- Override locally and add a comment in the file explaining why.

The agents enforce `voice.md`. If they're wrong, fix the rulebook.

### "The post is great but post-reviewer says rewrite."

Read the rewrite reason. If it's about stance fit (e.g., LinkedIn body sounds like a freelance pitch), it's correct — fix the stance and re-run. If it's about hook quality, weigh it against your gut. If you disagree, override and post anyway, then update post-reviewer's checks if the disagreement is structural.

### "I want to syndicate to a platform that isn't here."

Add a section to `content/voice.md` under "Per-platform notes" with the rules for that platform (length, hook style, hashtag policy, CTA shape). Update `syndicator.md` to write that platform's body to the social file. The voice-keeper and post-reviewer pick it up automatically.

### "I want to skip a step."

Don't. The pipeline is structured because each agent has a specific check. If you want to ship faster, start with shorter pieces — not fewer steps.

---

## Daily / weekly rhythm (suggested, not mandatory)

- **End of working session** — `/journal`. Even if it's two sentences.
- **Sunday or Saturday morning** — open `content/journal/`, pick one entry that has a post in it, run `/polish`. Revise by hand over the week.
- **Sunday evening** — move the revised draft to `content/published/`. If it's good enough.
- **Monday morning** — `/syndicate` the published post. Review LinkedIn + Twitter copy. Flip `status: ready`.
- **During the week** — post when the timing makes sense. LinkedIn early-week mornings tend to do better; Twitter late afternoon. Adjust as you learn.

This is a suggestion. Adjust the cadence to fit your week, not the other way around.

---

## When you're stuck

1. **Idea but no journal entry?** Just `/journal` it raw. Don't pre-shape.
2. **Journal but can't see the post in it?** Skip it. Don't force every journal into a draft.
3. **Draft that won't publish?** Move it to `content/drafts/<pillar>/<slug>/v1.md` and start `v2.md` from scratch. The bones are usually wrong, not the polish.
4. **Published post that won't syndicate cleanly?** The post is probably too abstract. Pull one specific detail (number, decision, anti-pattern) and rebuild the short-form around it. If there's no specific detail to pull, that's a signal the post needed more concreteness in the first place.
5. **Voice agents producing slop?** `voice.md` is stale. Stop, read it, update it, then re-run.
