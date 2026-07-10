---
name: voice-griner
description: Richard's writing voice for any portfolio copy — bento sublabels, case study intros, hero/subhead, blog posts. Activates whenever you're writing English or Spanish text that will appear on the portfolio in his name. Reads content/voice.md as the source of truth and adds case-study-specific structural patterns.
---

# Voice: Richard Griner (portfolio + case studies)

You are about to write copy that ships in Richard's name. Before writing a single word, read [content/voice.md](../../content/voice.md). It defines the speech-vs-writing register, banned phrases, conversion principle, and approved patterns. **This skill does not replace voice.md — it sharpens it for the specific shape of portfolio + case-study text.**

If voice.md is missing or unreadable, stop and tell Richard. Do not write in his voice without the rulebook.

## The brand layer (read with voice.md)

[content/brand-guide.md](../../content/brand-guide.md) is the layer above voice.md: what the brand *is*. What it means for anything you write:

- **The universal truth is the deep structure, never the slogan.** "Anything you don't decide gets decided for you" — each piece proves it with a new concrete (a state the devs invented, a breakpoint the framework picked). Don't quote the line itself.
- **The five personality tests apply to every surface.** Practitioner (written by someone who shipped it, not researched it), Dry (delete the funniest line and the argument stands), Specific (a competitor couldn't swap their nouns in), Honest about misses (at least one thing the author got wrong stays in), Quietly convinced (conviction from the evidence stack, never volume).
- **The is/is-not table settles register calls.** Builder thinking out loud, not guru announcing frameworks; shows the seams, not performed polish.
- **Design claims match the design principles.** When copy argues a design position (a case-study "Why it works", a DS opinion), it must be consistent with the `design-principles` skill (`~/.claude/skills/design-principles/`) — never praise in copy what the principles name as an anti-pattern. Load it when the piece makes design judgments.

---

## What this skill adds on top of voice.md

Voice.md is calibrated for long-form posts (`process/`, `breakdown/`, etc.). The portfolio has a different unit of work: **short, dense surfaces** — a 1-line label, a 2-line sublabel under a bento card, a 25-word subhead, a 6-bullet contributions list. The patterns below are the conversion of voice.md for that smaller canvas.

## The case-study sentence pattern

The default shape for any bento sublabel, contribution bullet, or "what we did" sentence on the portfolio:

> **[What we did], so [the team / users / clients] can [the benefit].**

That's it. WHAT + SO + BENEFIT. Short, declarative, specific.

**Good:**
- "Built one repo with `AGENTS.md` at the root, so every AI tool opens the same brief."
- "Pinned tokens to the brand color names, so the agent pastes the right blue without asking."
- "Wrote `design.md` once, so every rebuild starts where the last one stopped."

**Bad (drift toward abstraction):**
- "Established a unified source of truth that enables cross-functional alignment." (no specifics, no benefit, corporate)
- "Files, agents, and people — converging in one repo." (poetic, but doesn't say what changes for whom)
- "The decision is encoded once and the system enforces it, not a person." (smart sentence; reader has to do the work to find the benefit)

**Conversion drill:**
- Bad: "A token doc that names the palette, not the role."
- Better: "Named tokens after the brand colors (`AzulProfundo`, `azulafi`), so the agent picks the right blue from the source of truth instead of guessing."

If you can't fill in the benefit half of the pattern, **the sentence isn't ready** — go ask Richard what he actually wanted that change to enable.

## When to break the pattern

You don't apply WHAT-SO-BENEFIT to every sentence. Use it for:

- Bento sublabels (the 1–2 lines under each card).
- Contribution bullets (5–8 word fragments are fine — pattern is implicit, just name the action concretely).
- Case study intro paragraphs that describe what got built.
- Subhead-level claims when there's a "for whom" angle.

Don't force it onto:

- The tagline itself (taglines are stance, not mechanism — e.g. "Design that holds up").
- The h1 (titles are nouns, not sentences).
- Eyebrow status pills ("Currently — Designing fintech products at Afi" — these are role/context, not what/so/benefit).
- The "Detail" sections inside bento modals (those have their own 4-beat structure: problem / what we did / solution / why it works).

## Length budget for portfolio surfaces

These are the actual character/word budgets the design uses. If you're over budget, you're not writing — you're explaining. Cut.

| Surface | Budget | Notes |
|---|---|---|
| H1 tagline | ≤ 4 words ideally, ≤ 6 max | "Design that holds up" — stance, not summary |
| Hero subhead | 25–40 words | Two sentences. Stance, then how you work. |
| Bento card label | 1–4 words | Noun-phrase headline ("Token Architecture") |
| Bento card sublabel | 1 sentence, ≤ 20 words | The WHAT-SO-BENEFIT pattern |
| Contribution bullet | 1–3 words | "Token architecture", not "Designed the token architecture from the ground up" |
| Detail section body | 60–120 words per beat | Inside the modal — same voice but room to breathe |

If a sublabel runs to 30+ words, it's not a sublabel — it's a paragraph in disguise. Move the explanation to the detail section.

## Anti-patterns to watch for on portfolio copy

These are the voice-drift patterns most likely to creep into short-form portfolio text. They're the same as voice.md's banned list but the ones you'll specifically hit on the portfolio:

- **Aphorisms in place of specifics.** "Design earns its keep." Cute, but if it isn't grounded in a concrete change ("the system earned its keep on the fifth client"), it reads as a poster.
- **Three-item lists of similar abstractions.** "Files, agents, and people." Three things, same shape — LLM tell. Two of them or three with different shapes (a thing, a person, a number).
- **"In production" without saying what's in production.** Real → "Coherence ships the button component to two banks." Fake → "Coherence is in production."
- **Modals dropped into sublabels.** "We treated AI joining the team as the deadline for putting the rules in writing." Smart sentence — but it's a detail-section sentence, not a sublabel.
- **Adjective stacks instead of nouns.** "A scalable, maintainable, AI-friendly token system." Cut every adjective; if the noun (`token system`) doesn't carry the meaning, the noun is wrong.

## Speech → writing conversion (case-study examples)

The conversion principle from voice.md, applied to the actual transcripts/voice notes Richard gives you for portfolio work:

| Speech (Granola / voice memo) | Writing (portfolio sublabel) |
|---|---|
| "Yo, the design docs were just like, on Teams, lost in shit, nobody could find anything." | "Design docs lived in Teams threads. Nobody could find what was current." |
| "We literally had to write the rulebook because the AI was making shit up." | "AI joining the team made the rulebook the deadline, not the wishlist." |
| "Like, the agent reads the same file the designer reads, that's the whole fucking point." | "Designer and agent open the same file. That's the spine of the system." |
| "We did this token thing where it's like three layers and it actually works for once." | "Three-tier tokens — primitive → semantic → component. Drift surfaces at the seams." |

**The conversion principle:** take the heat from the speech and turn it into precision. Don't paraphrase — name the specific thing.

## Output format expectations

Whatever you write:

- **No emoji.** Anywhere on the portfolio.
- **No exclamation points.** Unless quoting someone (rare).
- **No "✨ AI-powered ✨" framing.** Even when it's actually AI-powered. Name the work, not the buzzword.
- **No "We are excited to share…"** Ever.
- **No "transformative", "revolutionary", "groundbreaking"** etc. Use the specific verb that did the transforming.
- **One idea per sentence.** If you wrote two ideas joined by "and", split it.

When in doubt, the test is **voice.md's test**: would this sentence appear in [content/published/process/design-md-primeng-wealth-manager.md](../../content/published/process/design-md-primeng-wealth-manager.md)? If no, rewrite.

---

## Spanish

When the surface has both EN and ES strings, both must follow these rules. ES gets the additional Peninsular-Spanish constraint from the project memory — run [afi-redaccion](../../docs/skills/afi-redaccion.md) after drafting if it exists, or mark the ES with `// TODO(afi-redaccion)` so the next pass catches it.

The conversion goes one way (EN → ES) but the structural pattern is shared. Don't add filler in Spanish that the English didn't have. "Para que" / "para" maps cleanly to "so [benefit]" — keep the same compression.
