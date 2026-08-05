# Lexicon — the words the brand owns

Third canonical file. [brand-guide.md](brand-guide.md) is what the brand *is*. [voice.md](voice.md) is how it *sounds*: sentence mechanics, banned phrases, platform rules. This file is the vocabulary the brand reaches for: the words that do the work, each with its precise meaning, each traceable to a shipped line. Nothing here was invented; every term below appears in the published work.

Every writer and agent drafting in Richard's voice reads this alongside `voice.md`. The banned lists stay in `voice.md`; this is the positive side. Use these words where they fit the idea. Don't force them: three owned words used precisely beat ten sprinkled for flavor.

---

## The spine, in one breath

The whole strategy compresses to one chain. Every word below serves a link in it:

> Anything you don't decide gets decided for you. Writing it down is the act of deciding. Design that holds up is design whose decisions are written where every collaborator, human or machine, can read them.

Never repeat the chain as a slogan. Each piece proves it with a new concrete; the owned words are how the proof gets said.

---

## System words

The mechanics of the work. These are the nouns and verbs of the rulebook itself.

**decide / decision** — the root word of the brand. Design is the set of decisions, not the set of screens. Everything undesigned is a decision someone or something else will make.
*"The canvas shows what you made; the variables show what you decided."*

**write it down** — the act that turns taste into a system. The unwritten rule doesn't exist. Writing is not documentation after the fact; it is the deciding.
*"Nobody had written down the rules."*

**rulebook** — the written system humans and AI agents both follow: tokens, rules, anti-patterns, in a form a machine can read as instructions. Not a component library; the thing next to one.
*"It's not a component library. It's the rulebook next to one."*

**drift** — what grows in the gap between two sources of truth when the decision was never written. Figma and code quietly disagreeing. The named enemy.
*"This is where drift hides even when it's not obvious."*

**audit** — checking every claim against the source of truth instead of memory. Writing the doc and auditing the system are the same act.
*"Writing the doc was the audit."*

**hypothesis** — what any AI claim about your system is until verified. Plausible is not the same as true.
*"Every claim it makes about your system is a hypothesis — verify against the variable panel, not your memory of what the system does."*

**route / routed** — how a token travels through the tiers. A value that routes cleanly is a decision that holds; one that doesn't is drift waiting.
*"Almost every one routed cleanly back to a semantic number."*

**tier** — one of the three layers a token system needs: primitive, semantic, component. The spine of any system doc.
*"Three tiers, always. Primitive → Semantic → Component."*

**slot** — a named place where a thing belongs. Slots make coherence enforceable: when the names match between Figma and code, "this looks wrong" stops being a vibe and starts being a lookup.
*"That action shouldn't be in `page-actions` — it belongs in `global-rail`."*

**grammar** — the layout rules that give every new thing a place without a debate. A grammar answers a programmer's question in one sentence.
*"The names give you a vocabulary. The rules give you a place to put each new thing without thinking about it twice."*

**chrome** — everything around the content: headers, tab rows, action clusters. The chrome never moves; the content slot holds whatever the work needs. Dense products die by creeping chrome, not bad tables.
*"The outer chrome never moves. The slot accommodates anything; the chrome doesn't bend to fit."*

**the variable panel** — where the decisions live, as opposed to the canvas, where the results live. Also the brand's visual concept.
*"Start with the variable panel, not the canvas."*

---

## Stance words

How the brand judges. These carry the point of view.

**holds up** — the flag. Design holds up when its decisions survive contact with code, clients, and AI, because they were written where everyone could read them.
*"Design that holds up."*

**density / dense** — the audience's reality and a value, not a problem to whitespace away. The user is a financial advisor at a laptop who cares about parity with their data more than delight.
*"Information density beats whitespace when that's who you serve."*

**earns its keep / earns its slot** — nothing exists by default. Every element, color, and breakpoint justifies itself or goes.
*"An H2 only earns its slot when there's more than one section on the page."*

**invented consistency** — sameness added for its own sake: the floating H2, the decorative pattern repeated to look systematic. It reads as consistency and works as noise. The precise insult for a precise failure.
*"Floating H2s on single-section pages are invented consistency, and invented consistency is noise."*

**the working / the seams** — the process shown in public, including the wrong first attempt. Trust is built by the visible audit, not the finished screenshot.
*"The reader is allowed to see the seams."*

**judgment** — what remains of the design job when AI does the production work. Taste, reasoning, review. Speed is the baseline; judgment is the differentiator.
*"Judgment is the job."*

**detect, don't assume** — the portability rule, for tools and for advice. Look at what's in front of you before applying the pattern you brought.
*"Every time it runs, it has to look at the project in front of it: which framework, which styling system, which components, and adapt to what it finds."*

**storage** — everything a document is when it isn't the system. The dismissive twin of "rulebook."
*"The rulebook is the system. Everything else is storage."*

**budgeted for** — the honesty verb. Expectations were held, stated, and corrected in the open.
*"Less drift than I'd budgeted for."*

---

## Proper nouns

Kept proper, never paraphrased. *AzulProfundo*, *azulafi*, *grisafi*, *Slate*, *PrimeNG*, *Wealth Manager*, *Wealth Planner*, *AFI*. Never "the dark blue" or "our gray palette." Naming the palette instead of the role is itself a brand argument: generic names are where humans pause and AI agents guess wrong.

Counts stay exact for the same reason: *87 variables*, *22 custom semantics*, *three breakpoints*, *102,000 tokens*. A rounded number is a small drift.

---

## Signature constructions

The reusable shapes, from shipped work. Recognize them; don't stamp them.

- **The binary setup.** *"Teams using an off-the-shelf library usually do one of two things. Either they adopt the defaults wholesale... Or they theme it heavily... We were doing the second thing."* Frame the two failure modes, then place yourself.
- **The kicker.** Last line lands the rule in under ten words. *"Same role, two palettes, mode picks the right one."* / *"Same skeleton, different content."*
- **Quote the team, dry.** *"The team had told me early on 'don't worry about it,' and then started worrying about it."* Real dialogue in quotes; no "was like" framing.
- **The rule a dev can quote.** *"One H1 per page"* beats *"headers should be hierarchical."* Write rules short enough to fit in a programmer's head at 4pm on a Thursday.
- **The earned reframe.** One per piece, maximum, and only when it falls out of the concrete thing just said. The full earned-vs-hollow test lives in `voice.md`.

---

## The ten tells (compressed ban list)

The full lists live in [voice.md](voice.md) and win on any disagreement. The ten that catch most misses:

1. Em-dashes (zero is the target, one the ceiling)
2. *leverage / unlock / seamless / robust* and the marketing-verb family
3. *delve / journey / landscape / navigate* and the LLM-register family
4. "Not just X, but Y" when the turn is hollow (one earned reframe max)
5. Three-item lists where two would do
6. Stock openers ("Let's dive in", "In today's...")
7. *actually* as filler emphasis (Richard's own crutch; keep only real contrasts)
8. Profanity and spoken filler (speech voice, not writing voice)
9. Emoji, in copy or as bullets
10. Listicle headers ("5 Things I Learned...")

---

## Maintenance

Same rule as the other two files. When a word keeps showing up in shipped work doing real work, add it here. When an entry stops matching what ships, edit it. The test for admission: could a competitor swap their nouns into the sentence and keep it? If yes, it's not owned vocabulary, it's just vocabulary.
