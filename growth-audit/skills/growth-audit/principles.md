# Behavioral Psychology Principles — Audit Catalog

Referenced by the `growth-audit` skill. ~40 principles across 7 categories. Each entry has **what it is**, **design signal (strong)**, and **audit flags (weak / missing)**.

---

## 1. Perception & Attention

How users see, notice, and prioritize visual information.

### Von Restorff Effect (Isolation Effect)
**What it is:** Items that stand out from their surroundings are more likely to be noticed and remembered.
**Design signal:** Primary CTAs use distinct color/shape from neighbors. Key info visually separated. Single clear focal point per screen.
**Audit flags:** Multiple competing "primary" buttons. Crucial content buried in uniform styling. Everything styled equally → nothing stands out.

### Serial Position Effect (Primacy & Recency)
**What it is:** People best remember items at the start and end of a sequence; middle gets lost.
**Design signal:** Most important nav items at ends. Key benefits at top and bottom of a list. CTAs at both start and end of long pages.
**Audit flags:** Critical info buried mid-list. Long menus without hierarchy. No closing CTA after a long scroll.

### Hick's Law
**What it is:** Decision time grows logarithmically with the number of choices.
**Design signal:** ≤ 7 visible options. Sensible defaults pre-selected. Progressive disclosure for advanced paths.
**Audit flags:** More than 7 options at once. No default selected. Equal-weighted options presented flat.

### Fitts's Law
**What it is:** Time to reach a target depends on its distance and size — bigger/closer = faster.
**Design signal:** Primary CTAs are large, bottom of viewport on mobile, easy reach. Mobile tap targets ≥ 44px. Frequently-used controls in easy-reach zones.
**Audit flags:** Tiny tap targets. Primary action in a hard-to-reach corner. Close buttons too small to hit. Dense controls spaced too tightly.

### Miller's Law (7 ± 2)
**What it is:** Working memory holds roughly 4–7 items at once.
**Design signal:** Nav limited to ~7 items. Forms chunked into groups. Phone numbers / IDs formatted with separators.
**Audit flags:** 15-item top nav. Long digit strings unformatted. Forms with 20 fields on one screen. Too many filters visible at once.

### Gestalt Principles (Proximity, Similarity, Closure)
**What it is:** The eye groups related items based on spatial and visual relationships.
**Design signal:** Related content visually grouped. Consistent styling implies sameness. White space separates unrelated sections clearly.
**Audit flags:** Related fields with inconsistent spacing. Unrelated items styled identically. Labels not clearly tied to their inputs. Arbitrary dividers that break natural groups.

---

## 2. Cognitive Load

How much mental effort the design demands.

### Cognitive Load Theory
**What it is:** Every decision, read, and click consumes mental energy; users quit when it gets expensive.
**Design signal:** Clear hierarchy. One primary task per screen. Plain language. Defaults reduce decisions.
**Audit flags:** Walls of text. Multiple equal-weight tasks. Jargon without explanation. Every option requires thought.

### Progressive Disclosure
**What it is:** Show only what's needed now; reveal complexity when (and only when) the user needs it.
**Design signal:** Simple default state. "Advanced options" collapsed. Form fields appear as relevant. Tooltips for rare cases.
**Audit flags:** All fields visible at once. Rarely-used controls prominent. Settings pages dumped without hierarchy.

### Chunking
**What it is:** Grouping information into meaningful units makes it easier to process and remember.
**Design signal:** Phone numbers formatted `(555) 123-4567`. Forms split into logical sections. Dashboards grouped by theme, not dumped.
**Audit flags:** Long unbroken strings. No visual grouping in forms. All metrics crammed into a single panel.

### Cognitive Ease / Fluency
**What it is:** Easy-to-process info feels more true, more likable, and more trustworthy.
**Design signal:** Simple fonts, generous spacing, short sentences, conventional layouts.
**Audit flags:** Decorative fonts for body text. Tight line-height. Unconventional layouts that fight expectations. Marketing copy in legalese.

### Jakob's Law
**What it is:** Users spend most time on other sites; they expect your site to behave like the ones they already know.
**Design signal:** Standard icons (hamburger = menu, gear = settings). Navigation where expected. Familiar patterns for login, search, cart.
**Audit flags:** Custom novel patterns where conventions exist. Icons that mean something different than their standard. Hidden navigation. Reinventing a wheel users already know.

---

## 3. Decision-Making

How users choose between options, compare, and commit.

### Anchoring
**What it is:** The first value a person sees disproportionately influences subsequent judgments.
**Design signal:** Pricing shows the premium tier first (or a struck-through "original" price). Size comparisons reference a familiar benchmark.
**Audit flags:** No anchor on pricing pages. Cheapest option shown first (makes others feel expensive). No reference point for "how much is this really worth?"

### Framing Effect
**What it is:** The same information affects decisions differently depending on how it's framed (gain vs. loss, % vs. count, etc.).
**Design signal:** Benefits framed in terms the user values ("save 6 hours/week" vs "30% faster"). Loss framing used where appropriate ("don't miss out" vs "sign up").
**Audit flags:** Generic feature-dump copy. Framing that doesn't match the user's stated goal. Inconsistent framing across the same flow.

### Loss Aversion
**What it is:** Losses feel roughly 2× more painful than equivalent gains feel good.
**Design signal:** Free trials (user gets the "thing," then doesn't want to lose it). "You'll lose progress" confirmations. Emphasize what they'd leave behind.
**Audit flags:** All-gain framing with no ownership hook. Easy to abandon without friction. No reminder of accrued value.

### Default Effect
**What it is:** People stick with whatever's pre-selected; defaults are the single most powerful UX lever.
**Design signal:** Sensible defaults selected for most common path. Pre-checked "save my info" where helpful. Pre-filled forms where possible.
**Audit flags:** No default selected → forces decision. Default is the vendor's preference, not the user's. Opt-in defaults used manipulatively (pre-checked marketing consent = dark pattern — flag it).

### Decoy Effect
**What it is:** Introducing a third "inferior" option makes a target option look more attractive by contrast.
**Design signal:** Pricing plans with a clearly "recommended" middle tier. Product comparison tables where one option dominates on key attributes.
**Audit flags:** Only two options (no anchor for comparison). All options too similar to differentiate. Decoy too obviously manipulative (flag as dark pattern if egregious).

### Paradox of Choice
**What it is:** Too many options paralyze rather than empower; users abandon rather than choose.
**Design signal:** 3–5 primary options max. Smart defaults. "Recommended for you" guidance. Categorized browsing instead of flat lists.
**Audit flags:** 20+ plans on a pricing page. Mega-menu with 40 links. No filtering on long catalogs. No "most popular" indicator.

### Hyperbolic Discounting (Present Bias)
**What it is:** People heavily overweight immediate rewards vs. future ones; a dollar today beats two tomorrow.
**Design signal:** Immediate small wins during onboarding. "Try it free for 60 seconds" flows. Visible progress in the first interaction.
**Audit flags:** All the value is "eventual." Long setup before any payoff. Benefits stated abstractly ("become more productive") with no immediate taste.

---

## 4. Social Influence

How others' behavior, presence, and credibility shape decisions.

### Social Proof
**What it is:** People copy the behavior of similar others, especially under uncertainty.
**Design signal:** Testimonials from *similar* users (not celebrities). Usage counts ("join 2M users"). Real reviews with names/faces. Embedded recent activity ("Sarah just booked a session").
**Audit flags:** No social proof at all. Generic/fake testimonials. Counts with no source. Social proof that doesn't match the target audience (enterprise page showing consumer tweets).

### Authority
**What it is:** People defer to credible experts, recognized logos, and institutional signals.
**Design signal:** Logos of credible customers / partners / press. Expert endorsements with credentials. Certifications (SOC 2, HIPAA, ISO). Founder credentials where relevant.
**Audit flags:** Unknown or unvalidated claims. "Experts agree" without named experts. Missing trust badges on B2B/fintech where buyers expect them.

### Reciprocity
**What it is:** People feel compelled to return favors; giving first creates obligation.
**Design signal:** Free tools, calculators, templates. Valuable content before asking for email. Free tier with real utility. Generous returns/refund policies.
**Audit flags:** Immediately asks for something before giving anything. Gated content with nothing to preview. Paywalls before demonstrating value.

### Scarcity
**What it is:** Limited availability (time, quantity, access) increases perceived value and urgency.
**Design signal:** Genuine limits surfaced ("3 seats left in this cohort," "offer ends Friday"). Exclusive tiers/beta access. Waitlists.
**Audit flags:** Fake countdown timers that reset. "Only 2 left" that's always "only 2 left." Scarcity claims without proof. Manipulative fake urgency (flag as dark pattern).

### Commitment & Consistency
**What it is:** People want to be consistent with past actions and stated beliefs; small commitments lead to bigger ones.
**Design signal:** Progressive signup flows (email first, then profile, then payment). "Save your preferences" early. Small low-friction first asks before big asks.
**Audit flags:** Huge upfront form (too much commitment too fast). No small wins before the big ask. Inconsistent tone between what user said they wanted and what they're shown.

### Liking
**What it is:** People say yes more often to people/brands they find likable — similar to them, attractive, familiar.
**Design signal:** Real photos of real people. Brand voice that matches the audience. Founder/team visible. Warmth in copy.
**Audit flags:** Stock photos that feel generic. Corporate stiff voice misaligned with audience. Faceless/impersonal experience where warmth matters.

---

## 5. Motivation & Habit

What drives users to start, persist, and return.

### Fogg Behavior Model (B = MAT)
**What it is:** Behavior happens when Motivation, Ability, and a Trigger all converge at the same moment.
**Design signal:** Clear trigger (notification, CTA). Task made as easy as possible (Ability ↑). Motivation reinforced in context (why now?).
**Audit flags:** Strong trigger but hard task ("sign up" requires 10 fields). Easy task but no trigger (nothing prompts action). Motivation missing — user doesn't know *why* right now.

### Self-Determination Theory (Autonomy / Mastery / Purpose)
**What it is:** Intrinsic motivation comes from feeling in control, growing in skill, and connecting to meaning.
**Design signal:** Users can customize. Skill-building is visible. Purpose communicated (why this product matters). Personalization options.
**Audit flags:** One-size-fits-all with no personalization. No sense of growth or improvement over time. Brand says nothing about *why* it exists.

### Goal Gradient Effect
**What it is:** People accelerate effort as they get closer to a goal.
**Design signal:** Progress bars that show nearness to completion. Head-start loyalty programs ("2 of 10 punches already filled"). Clear "almost there" states.
**Audit flags:** No progress indication on multi-step flows. Flat loyalty systems (no acceleration). Unclear endpoint.

### Progress Principle / Endowed Progress
**What it is:** Seeing daily progress is the single biggest driver of sustained motivation; small wins compound.
**Design signal:** Streaks, daily stats, completion animations. Visible progress on long tasks. Session-over-session improvement metrics.
**Audit flags:** No feedback on effort. Big goals without visible intermediate steps. Users can't tell if they're improving.

### Variable Rewards
**What it is:** Unpredictable rewards (variable ratio reinforcement) are more engaging than predictable ones — the Skinner-box effect.
**Design signal:** Feed-based products surface varying content. Gamified elements with chance-based outcomes. Surprise delight in unexpected moments.
**Audit flags:** Predictable-to-the-point-of-boring experiences. Same reward every time. No element of discovery. (Caveat: variable rewards easily become addictive manipulation — use with ethics.)

### Hook Model (Trigger → Action → Variable Reward → Investment)
**What it is:** Habit-forming products cycle users through triggers, easy actions, variable rewards, and investments that increase switching cost.
**Design signal:** External triggers move to internal ones (user thinks of the product). Investments (profile, content, data) make leaving costly in a positive way.
**Audit flags:** No re-engagement mechanism. Nothing accrues value the longer users stay. Leaving costs nothing. (Apply ethically — Hook can be predatory; flag if used to manipulate vulnerable users.)

---

## 6. Memory & Experience

How experiences are encoded, remembered, and re-lived.

### Peak-End Rule
**What it is:** People judge an experience by its emotional peak and its end, not the average of all moments.
**Design signal:** Intentional high points (delightful confirmations, celebratory moments after a win). Strong finishes (thank-you screens, completion animations, follow-up emails that close loops).
**Audit flags:** Flat emotional curve. Mediocre endings (abrupt redirect, bland "thanks"). Peak moments exist but aren't leveraged.

### Zeigarnik Effect
**What it is:** Unfinished tasks occupy mental space more than finished ones; people are driven to complete open loops.
**Design signal:** Progress bars. "Your profile is 60% complete." Saved drafts. Clear resume-where-you-left-off.
**Audit flags:** No indication of what's incomplete. No nudges to return. Tasks silently abandoned.

### Availability Heuristic
**What it is:** People judge likelihood / importance by how easily examples come to mind.
**Design signal:** Vivid concrete examples over abstract claims. Recent user stories. Stats expressed in memorable terms ("3 hours saved per week" > "15% improvement").
**Audit flags:** Abstract benefit claims without examples. Stats without context. Nothing for the mind to grab onto.

### Mere Exposure Effect
**What it is:** Repeated exposure to something increases preference for it; familiar feels safer.
**Design signal:** Consistent branding across surfaces. Recurring touchpoints (email, retargeting) that build familiarity without fatigue. Familiar UI patterns.
**Audit flags:** Wildly inconsistent branding site-to-email-to-app. No re-engagement. Over-exposure leading to fatigue (the inverse of the effect).

### IKEA Effect
**What it is:** People disproportionately value things they built themselves.
**Design signal:** Customization steps during setup. User-generated content/profiles. "Your" library/workspace/dashboard. Investment moments that feel earned.
**Audit flags:** Zero customization. Fully prefab experience with no user contribution. Nothing the user can call "theirs."

---

## 7. Emotion & Trust

Credibility, feelings, and the "does this feel safe" gut check.

### Halo Effect
**What it is:** Positive impressions in one area (e.g., visual polish) bleed into perceptions of unrelated qualities (e.g., trustworthiness).
**Design signal:** Strong visual design → product feels more credible. Good error messages → product feels smarter. Quality signals compound.
**Audit flags:** One obvious weak point (broken animation, typo, misaligned layout) undermines the whole. Polish inconsistent across surfaces.

### Aesthetic-Usability Effect
**What it is:** Beautiful designs are perceived as more usable, regardless of their actual usability.
**Design signal:** Care shown in typography, spacing, motion. Consistent visual system. Deliberate polish in micro-interactions.
**Audit flags:** Ugly-but-functional designs rated worse than pretty-but-broken ones by users. Inconsistent polish signals inattention.

### Endowment Effect
**What it is:** People value things they own more than identical things they don't own.
**Design signal:** Free trials ("here, it's yours — don't lose it"). Saved preferences. Workspaces that feel like the user's. Pre-populated wishlists/carts.
**Audit flags:** No ownership before the ask. Nothing saved between sessions for free users. Cart/list clears when not upgraded.

### Trust Signals
**What it is:** Visible cues (badges, reviews, guarantees, social proof, security marks) reduce perceived risk at decision points.
**Design signal:** Security badges near payment. Money-back guarantees visible. Reviews at decision moments. Company credentials on B2B pages.
**Audit flags:** Trust signals missing right before commitment. Generic "secure" badges without issuer. No guarantees. No reviews near the buy button.

### Sunk Cost Fallacy
**What it is:** People continue investing in a path because of cumulative past investment, even when switching would be rational.
**Design signal:** Used ethically: saved progress makes completion feel natural. Used manipulatively: "You've come this far, don't abandon your cart" (flag).
**Audit flags:** Leveraging sunk-cost to trap users (hard cancellation, buried opt-outs). Users can't sense the cost of continuing because it's hidden.

### Confirmation Bias
**What it is:** People seek info that confirms what they already believe; they discount info that contradicts it.
**Design signal:** Messaging aligns with the user's current mental model. Helps them feel validated before introducing new ideas.
**Audit flags:** Tries to change minds before meeting users where they are. Ignores the user's stated context/preferences.

---

## Category quick-reference

| # | Category | Principles (count) |
|---|----------|-------------------:|
| 1 | Perception & Attention | 6 |
| 2 | Cognitive Load | 5 |
| 3 | Decision-Making | 7 |
| 4 | Social Influence | 6 |
| 5 | Motivation & Habit | 6 |
| 6 | Memory & Experience | 5 |
| 7 | Emotion & Trust | 6 |
| | **Total** | **41** |

---

*This catalog is a curated synthesis of behavioral-psychology research in the context of product design. Inspiration drawn from [Growth Design's psychology cheat sheet](https://growth.design/psychology/cheatsheet). Underlying research: Kahneman, Cialdini, Thaler, Fogg, Nir Eyal, Ariely, Tversky, and others in the behavioral-economics and UX literature.*
