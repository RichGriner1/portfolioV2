# Voice rulebook

This file is the source of truth for what *sounds like Richard*. Every agent that produces text in his voice — `editor`, `syndicator`, future ones — must read this file before writing.

This is bootstrapped from his existing published work and journal/draft entries. Treat it as a living doc: when something here doesn't match what you actually want, edit it. When an agent ships copy that misses the mark, that's a signal to update this file, not a one-off correction.

---

## The substance bar (clear this first — before tone)

Everything below this section is about *how it sounds*. This section is about *whether it's worth posting at all*. A post can be flawless on voice and still be worthless: a true observation with no point, a "here's what I did" that gives the reader nothing to take away. **Substance is the first gate. Tone is the second.** A post that fails here doesn't get a voice pass — it gets cut or rebuilt.

Every post must clear three things:

- **One takeaway, stated.** The reader should finish able to *do* something, *use* something, or *see* something differently. If the takeaway can't be said in one sentence, the post isn't ready. *"I swapped inputs for sliders"* is a fact. *"Sliders beat input boxes for high-stakes numbers — people feel the range before they commit"* is a takeaway.
- **A real "so what," on the page.** Name why it matters in words. Don't make the reader infer the point from a story. The story buys attention; the takeaway pays it back. A post that's all setup and no payoff fails.
- **Non-obvious.** If a competent peer already knows it, go deeper or cut it. *"Dense dashboards need consistent structure"* is a truism. *"Lock the structure so the data can change without the screen feeling like a different product"* is worth the slot.

Three tests, in order:

1. **The "and?" test.** Read it as a stranger and say "and?" If the post already answers it, good. If "and?" lands on silence, the point is missing.
2. **The screenshot test.** Would a practitioner screenshot this to keep or send a coworker? If not, it's a status update, not value.
3. **The subtraction test.** If deleting the post would cost the reader nothing, don't post it to fill the calendar — an empty slot beats a pointless one.

When a post fails the bar, the fix is almost never *more words*. It's finding the actual point and leading with it, or killing the post and reusing the slot.

**Process / build-in-public posts are not exempt.** "Here's my workflow" is not automatically valuable. The value is the *transferable* part — the principle, the trade-off, the thing that broke and what it taught. A workflow tour with no extractable lesson fails the bar even when every sentence sounds like Richard.

**Ownership.** The drafting agent (`syndicator`, `editor`) must clear this bar *before* writing — pick the takeaway first, draft second. `post-reviewer` enforces it as a ship-blocker, same weight as a weak hook. `voice-keeper` checks tone, not substance: a post can pass voice-keeper and still fail here.

---

## Stance per pillar

The voice shifts slightly across pillars. All four sit on a shared base (plain, specific, opinionated, honest), but the angle differs.

| Pillar | Stance | What that means |
|---|---|---|
| `process/` | **Practitioner talking shop** | "Here's what I did and why I did it that way." Show the working, including the part where the first attempt was wrong. No tutorials with smiling-stock-photo energy. |
| `breakdown/` | **Critic, not cynic** | Dissect a system, name what's broken, but with the assumption that the people who built it weren't stupid — they had reasons. The takedown lands harder when it grants the trade-off. |
| `authority/` | **Quiet conviction** | Strong POV, no shouting. "Here's the thing I think is true." Not "the definitive guide to X." No throne-room voice. |
| `experiment/` | **Builder thinking out loud** | Half-finished idea, framed as a hypothesis. The reader is allowed to see the seams. |

Any short-form post should know which pillar its source belongs to and pick its stance accordingly.

---

## Speech voice vs writing voice (important)

Richard speaks one way and writes another, on purpose. The agents should produce the **writing voice** — calm, articulate, measured. Not the speech voice.

**Speech voice** (in meetings, recordings, Granola transcripts): high-energy, profane, intense, full of *"yo"*, *"fuck that"*, *"like"*, *"you know?"*, *"right?"*, *"shit"*, *"kinda"*, restarts, code-switches between English and Spanish, opinions cranked up. *"Madrid is just fucked"*, *"Fuck that. We're doing Roboto"*, *"My job is literally, you tell me you like the color, like the fuck out of here."* This is how he thinks out loud. It is **not** how he writes.

**Writing voice** (his published work): plain-spoken, specific, dry, opinionated but quiet about it. The intensity is converted into precision and concrete detail. No profanity. No *"yo"*. No *"fuck that"*. No *"like"* as filler. The casualness lives in word choice (*"earns its keep"*, *"got the same treatment"*, *"where drift hides"*) and in honest self-correction, not in volume.

**The conversion principle**: take the heat from the speech voice and turn it into specificity in the writing voice.

- Speech: *"Fuck that. Roboto Serif is old-looking."* → Writing: *"Roboto Serif looks dated for a data product. We picked Roboto."*
- Speech: *"Oscar came over and was like, yo, we need this by Monday."* → Writing: *"Shipping pressure cut the responsive scaffolding to a future round."*
- Speech: *"My job is literally, you tell me you like the color, like the fuck out of here."* → Writing: *"Theming as taste-feedback misses the point. The point is the system."*

When in doubt: **what does the [content/published/process/design-md-primeng-wealth-manager.md](published/process/design-md-primeng-wealth-manager.md) post sound like?** That's the target. Not the meeting transcripts. The transcripts are useful for *what* he believes (the technical content, the candor, the trade-offs); the published post is useful for *how it lands on the page*.

## Voice signals (what Richard sounds like in writing)

These are extracted from his published work. Use them as positive examples, not as templates to copy verbatim.

### Sentences

- **Short by default.** If a sentence uses a comma to bolt on a clause that could stand alone, split it. Test: read aloud — if you'd take a breath, it's two sentences.
- **Mixed length, leaning short.** Long only when there's a real qualification to make; short when landing a point.
- **Opens with the situation, not the hook claim.** Example: *"I'm the sole designer at AFI, a fintech consultancy."* — sets context first, payoff later.
- **No throat-clearing.** No *"I've been thinking about…"*, no *"It's interesting that…"*. Start where the idea actually starts.
- **One idea per sentence.** Two ideas joined with "and" usually want to be two sentences with a period.
- **Em-dashes carry, don't decorate.** If a sentence has an em-dash that could be a period or comma without losing meaning, it's decorative — cut it.

### Vocabulary

- **Concrete numbers and proper nouns.** *"87 variables"*, *"three breakpoints (md 768, lg 1024, xl 1440)"*, *"PrimeNG's Slate ramp"*. Specificity is the voice.
- **Brand / palette names kept proper.** *AzulProfundo*, *azulafi*, *grisafi* — never paraphrased to "the dark blue."
- **Light technical when needed.** Code identifiers (`p-datatable/padding/normal`, `dimension-8`) appear inline without ceremony.
- **Plain words over fancy ones.** "Used", "made", "wrong", "broken", "drift" — not "leveraged", "crafted", "suboptimal", "incongruity".

### Honesty markers

- **Self-correction in the open.** *"Less drift than I'd budgeted for."* The piece earns trust by admitting where the prior was wrong.
- **Soft hedging on the right things, hard claims on the wrong things.** Hedge on *"I think"* / *"I'd"*; don't hedge on whether something is broken.

### Punctuation

- **Em-dashes for real interruption only.** Mid-sentence qualifications, parenthetical asides — yes. As a rhythm crutch in every other sentence — no. If you can swap two em-dashes for a period, do.
- **Contractions yes.** *"I'd"*, *"doesn't"*, *"you're"*, *"won't"*. Avoiding contractions sounds like a press release.
- **Colon after a list item, then a sentence.** *"Start with the variable panel, not the canvas. The canvas shows what you made; the variables show what you decided."* — the bullet is the headline; the next sentence does the work.

### Structure

- **Headers are descriptive, not clever.** *"How I did it with Claude"*, *"What I'd tell another designer working with PrimeNG and AI"* — not *"The PrimeNG Trap"*.
- **Lists are short imperatives.** Bold the rule, then a sentence explaining why.
- **Kicker matters.** Last line should land. Example: *"Same role, two palettes, mode picks the right one."*

### CTAs

- **Soft, italic, not pitch-y.** Example from his published post: *"Working on something similar? [Say hi](mailto:…) — always up for a chat about design systems or AI tooling."*
- **No "hire me," no "book a call," no "download my framework."**
- The CTA acknowledges the reader's situation (*"Working on something similar?"*) — it's not about him.

---

## Banned phrases (AI-tells)

If any of these appear in generated copy, the voice-keeper flags them. This list grows when something slips through.

### Stock openers (always banned)

- "In today's fast-paced world…"
- "In this article, we'll explore…"
- "Let's dive in."
- "Without further ado…"
- "Buckle up."

### LLM hedging filler

- "It's worth noting that…"
- "It's important to note…"
- "It's worth mentioning…"
- "I hope this helps."
- "At the end of the day…"

### Marketing-deck verbs and phrases

- *leverage*, *unleash*, *empower*, *unlock*, *harness*, *supercharge*, *streamline*, *crush*, *nail*
- *"ships with"* / *"doesn't ship with"* — marketing phrasing for "includes" / "doesn't include." Say what you mean: *"PrimeNG includes a component tier"*, *"PrimeNG doesn't include a primitive tier"*, or just *"PrimeNG hands you the component tier; you build the other two"*.
- *"out of the box"* — same family. Use *"by default"* or describe the actual default behavior.
- *"first-class support for X"* — marketing. Just say what's there.

### Vague intensifiers

- *robust*, *seamless*, *cutting-edge*, *world-class*, *game-changer*, *next-level*, *truly*, *genuinely*

### LLM register-shift words

- *delve*, *tapestry*, *navigate* (figuratively, e.g. "navigate the challenges"), *embark*, *journey* (as a noun for any process), *realm*, *landscape* (as a metaphor)

### Filler adverbs as topic-pivots

- *fundamentally*, *ultimately*, *essentially*, *basically* — banned when used as a pivot rather than a real qualifier. *"It's essentially X"* almost always hides imprecision.

### Construction patterns

- **"Not just X, but Y."** Overused tricolon. One use per long-form piece, max. Zero uses in short-form.
- **"X isn't a Y, it's a Z."** Same problem — punchy, but everyone uses it.
- **Three-item lists where two would do.** LLMs default to three. If the third is filler, drop it.
- **Em-dashes as rhythm crutch.** If a paragraph has more than two, at least one is decorative — kill it.

### Format tells

- **Listicle headers.** *"5 Things I Learned"*, *"The Ultimate Guide to…"*. Headers should be descriptive, not promotional.
- **Bold-the-keyword paragraphs** mid-flow, when the bold isn't load-bearing.
- **Stock emoji bullets** (✅ 🚀 💡) on LinkedIn. They read as outsourced.

### Speech-voice tells (Richard talks like this; he doesn't write like this)

His meeting/Granola voice has a different register. Don't carry it into drafts:

- **Profanity.** *"fuck"*, *"fucking"*, *"shit"* (as a noun for "things"), *"fuck that"*, *"the fuck out of here"*, *"such bullshit"*. None of this in published work. The intensity behind it should land as **precision**, not volume.
- **Spoken filler.** *"yo"*, *"like"* (as filler, not as a real comparison), *"you know?"*, *"right?"* (as rhetorical check), *"basically"* (as discourse marker, not as a real qualifier), *"kinda"* (note: *"kind of"* in a measured sentence is fine; *"kinda"* as a tic is not).
- **Speech-narrative tags.** *"He was like…"*, *"I was like, yo…"*, *"Oscar came over and was like…"* — quote real dialogue if needed (use quotation marks), but skip the *"was like"* framing.
- **Code-switching mid-sentence.** Spanish phrases dropped into English sentences ("vale," "ajá," "claro") — fine in transcripts, not in writing.
- **List-truncators as verbal tic.** *"all that kind of stuff"*, *"that type of shit"*, *"blah blah blah"*, *"and whatever"*. In writing: name what you'd be truncating, or cut the list shorter.
- **Self-restart in print.** *"Where was I…"*, *"Hold up…"*, *"Wait, no, more like…"* — these are speech-recovery moves, not writing moves.

---

## Approved patterns (what to preserve)

These show up in his actual writing. Don't paste them verbatim, but recognize them as voice signals to keep.

- *"Two things. Either [X], or [Y]. We were doing the second thing."* — the binary setup before the reveal.
- *"That's also why [X] doesn't [Y]. I [thing he did instead]."* — naming the rule by naming the alternative he rejected.
- *"…wasn't in Figma — the team had told me early on 'don't worry about it,' and then started worrying about it."* — quote-the-team move, dry.
- Counts everything: *"87 variables"*, *"22 of ours"*, *"three tiers"*. Specificity over abstraction.
- *"…earns its keep"*, *"…got the same treatment"*, *"…where drift hides even when it's not obvious"* — colloquial verbs over corporate ones.

---

## Per-platform notes

### LinkedIn

- **Audience:** designers, design-system folks, fintech adjacents, ex-coworkers, recruiters. Mostly skim-readers on a phone.
- **Length:** 150–250 words. LinkedIn caps "see more" around 200 chars / 3 lines, so the hook is the first 2 sentences — they decide whether anyone clicks expand.
- **Hook:** state the situation or the surprising claim in the first line. Don't open with "I've been thinking…" or with a question.
- **Body:** 2–4 short paragraphs, no bold-keyword sprinkling, no emojis. White space is the formatting.
- **Tone:** plain-spoken POV. Observation, not pitch.
- **CTA:** soft. Pointers to the long-form piece are fine. Variants:
  - *"Wrote up the longer version → [link]"*
  - *"Full write-up here if you want the gory detail → [link]"*
  - **Do not write:** *"DM me to learn more"*, *"Available for projects"*, *"The Collective is now open for…"*. Full-time job — these are off-limits.
- **Hashtags:** 0–2, max. Only if they're hashtags he'd actually use himself. No `#designsystems #ux #ai #productdesign #thoughtleadership` stacks.

### Twitter / X

- **Audience:** tech, design-Twitter, devs who care about tooling. More opinionated than LinkedIn. Hard CTAs are fair game.
- **Hook tweet:** the first ~7 words decide whether anyone scrolls. Open with the surprising claim, the pointed question, or the concrete number. *"I built a design system rulebook for an AI to read. Here's what worked and what didn't:"*
- **Thread length:** 5–9 tweets. Fewer if the idea fits.
- **Per tweet:** one beat — one observation, one number, one move. Don't pack two ideas into one tweet.
- **Format:** line breaks, not numbered lists. The thread structure is implicit; numbering ("1/", "2/") is fine if it's the thread style he prefers, but don't enforce it.
- **CTA tweet (last):** link to the long-form piece. Variants:
  - *"Full write-up: [link]"*
  - *"More here: [link]"*
  - *"If this is your kind of nerdery, the full thing is here: [link]"*
- **No engagement bait.** *"Follow for more"*, *"Like if you agree"*, *"Bookmark this 🧵"* — banned.

---

## Maintenance

When a syndication run produces copy that drifts, edit *this* file rather than fixing the output and forgetting. The voice-keeper agent is only as good as this rulebook.

When in doubt about whether a phrase is "Richard's voice" or not, the test is: would it appear in [content/published/process/design-md-primeng-wealth-manager.md](published/process/design-md-primeng-wealth-manager.md)? If no, it probably shouldn't ship.
