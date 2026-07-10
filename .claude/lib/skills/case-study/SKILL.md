---
name: case-study
description: Structure and quality rules for portfolio case studies — anatomy (tagline/intro/role/contributions/bento), the problem → what-we-did → solution → why-it-works detail pattern, the WHAT-SO-BENEFIT sentence shape, the specificity bar, and bilingual rules. Knowledge only — the /case-study loop orchestrates. Use when drafting, updating, or reviewing a case study in any repo; discovery step finds the repo's case-study source.
---

# Case studies (structure + quality bar)

A case study is the highest-visibility surface a portfolio has. This skill holds **what a good one is made of** — the anatomy, the sentence shape, and the checklist a reviewer applies. It contains no workflow: the `/case-study` loop (portfolioV2) or whatever process the repo uses does the orchestrating.

## 1. Discovery (portability)

Find the repo's case-study source before writing anything:

- **portfolioV2:** structured TypeScript — `CASE_STUDIES: Record<string, CaseStudy>` in `src/lib/content/case-studies.tsx`, with page metadata in the `WORK` array in `src/lib/content/work.ts` (`kind: "case-study"`). Rendered at `/work/[slug]`.
- **Other repos:** look for an equivalent structured content source (a data file, CMS collection, MDX folder). If none exists, produce a standalone markdown case-study document instead — same anatomy, headings instead of fields.

## 2. Anatomy — what each field is FOR

(Field names are portfolioV2's `CaseStudy` type; the roles are universal.)

| Field | Role | Bar |
|---|---|---|
| `tagline` | The project's job title, not a slogan. | One line. Stance allowed; mechanism not required. |
| `intro` | The brief + what got built + why it matters. | ~4–6 sentences. Counts things (clients, tiers, tools). Names the "only designer / two banks"-level context. |
| `role` | What Richard was on this project. | 2–4 words. |
| `contributions` | The capability list. | 5–8 short noun fragments ("Token architecture", not "Designed the token architecture from the ground up"). |
| `bento[]` | One card = one capability or artifact. | `label` = the thing (1–4 word noun phrase). `sublabel` = 1–2 lines in the WHAT-SO-BENEFIT shape. |
| `details.sections` | The story behind a card. | Fixed order, four beats: **The problem → What we did → The solution → Why it works** (ES: **El problema → Lo que hicimos → La solución → Por qué funciona**). 60–120 words per beat. A card may consciously omit `details` — but never ship a partial section set. |
| `confidential` | NDA note. | Present when the client can't be shown; identifying screenshots and iframes omitted. |
| `gallery` | Opt-in image gallery. | Only when real assets exist. |

## 3. Sentence rules

Load the voice layer — **don't duplicate it here**: `voice-griner` (user scope `~/.claude/skills/voice-griner/`, else project `.claude/skills/voice-griner.md`, else fall back to reading `content/voice.md` directly). It defines the WHAT-SO-BENEFIT pattern, when to break it, length budgets per surface, and the speech→writing conversion table.

What's case-study-specific on top:

- **A card that can't fill the benefit half isn't ready.** If the sublabel has a WHAT but no SO-BENEFIT, the material is thin — go back to the source (or Richard), don't pad.
- **"The problem" names the before-state concretely.** Real artifacts, real friction ("design docs lived in Teams threads"), never a strawman ("teams often struggle with alignment").
- **Details quote real numbers.** "87 primitives, 39 semantic aliases, 22 custom overrides" is the register. If the source material has no numbers, that's a "Still thin" flag, not license to invent.
- **"Why it works" is a mechanism, not a moral.** It explains why the change holds without a person policing it — not "this improved collaboration."
- **Brand + principles alignment.** In portfolioV2, `content/brand-guide.md` is the layer above voice: the universal truth ("anything you don't decide gets decided for you") is the deep structure a case study should prove with its own concretes, and the five personality tests (practitioner / dry / specific / honest-about-misses / quietly-convinced) apply to every section — a case study with no admitted miss or trade-off fails the "honest about misses" test. Design claims (especially "Why it works") must be consistent with the `design-principles` skill — load it when the copy argues a design position. In other repos, discover the equivalent brand/principles doc or skip this layer.

## 4. Quality bar (the reviewer checklist)

A case study ships only if:

- [ ] Every card has `label` + `sublabel` in **both languages**; every `details` block has all four beats in both languages.
- [ ] Concrete numbers or proper nouns appear in the intro and in at least half the cards.
- [ ] Sublabels fit the budget (≤ 20 words); anything longer moves into `details`.
- [ ] No banned phrases / AI-tells (voice-griner's output-format list: no emoji, no "transformative", no adjective stacks, no three-abstractions lists, one idea per sentence).
- [ ] **No invented facts.** Every claim traces to the source material (journal, transcript, brief). If the material doesn't support it, flag it — don't fill it.
- [ ] At least one admitted miss, correction, or granted trade-off is in the story (brand: "honest about misses" / "grant the trade-off").
- [ ] Design claims don't contradict the `design-principles` skill.
- [ ] Confidential projects set `confidential` and omit identifying assets.
- [ ] Nothing existing was deleted or renamed without being asked.

## 5. Bilingual rules

- **EN first, ES in the same pass.** ES is Peninsular Spanish, same compression as the EN ("para que" maps to "so [benefit]"), no filler the English didn't have.
- **Every new or edited ES string gets `// TODO(afi-redaccion)`** on the line above (existing codebase convention — see `case-studies.tsx`). The `afi-redaccion` skill is the ES lens and runs as a follow-up pass; the marker is how that pass finds its work.

## 6. Interview questions (when there's no source material)

Five questions, mirroring what the transcript processor extracts. Ask at most two at a time:

1. What was broken before — concretely? (artifacts, friction, who felt it)
2. What did you actually build? (names, numbers, tools)
3. What was the turning point — the moment it started working?
4. What does it enable now? (the benefit half — for whom, what changed)
5. Is anything confidential — client names, screenshots, numbers you can't show?

## 7. Out of scope

- **Animations.** `animation` values must already exist in the repo's figure/glyph components — never invent an enum value. New motion is a separate job (`/choreograph` in portfolioV2).
- **Images / iframes / video.** Richard supplies asset paths; leave `TODO` placeholders otherwise.
- **Publishing.** This skill and its loop end at a reviewed diff. Deploying is Richard's call.
