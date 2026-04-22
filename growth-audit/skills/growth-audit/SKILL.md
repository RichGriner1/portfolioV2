---
name: growth-audit
description: Audit a design, flow, page, or screenshot against ~40 behavioral-psychology principles (cognitive biases, social influence, motivation, perception, memory, trust) and produce a scored report with prioritized fixes. Use when the user says "audit this", "growth audit", "psych audit", "review this against psychology", pastes a screenshot/URL and asks what's working or broken, asks for UX/design-review feedback grounded in behavioral science, or wants a conversion/retention lens on a design. Inspired by Growth Design's cheat sheet (growth.design/psychology/cheatsheet).
tools: Read, Glob, Grep, WebFetch, Bash
---

# Growth Audit

Behavioral-psychology audit for a design, flow, page, or screenshot. Scores against a catalog of ~40 principles across 7 categories and produces a three-part report: overall score → top fixes → full checklist.

## What this skill does NOT do

- Does **not** judge aesthetics (pretty vs ugly). Different skill.
- Does **not** critique code quality. Reference Fitts's Law, not CSS specificity.
- Does **not** recommend dark patterns. If you spot confirmshaming, fake scarcity, manipulative defaults, or hidden opt-outs — flag them, never endorse.

## When to invoke

Trigger phrases (not exhaustive):

- "Audit this [design / page / flow / screenshot]"
- "Growth audit on X"
- "Psych audit"
- "Review against psychology principles"
- "What's working / broken about this UX?"
- "Score this design"
- User pastes a screenshot + asks for design feedback

## Inputs

Accept any of these. If multiple are provided, use all. If input is unclear, ask one clarifying question before starting.

| Input type | Handling |
|------------|----------|
| Screenshot (attached image) | Analyze directly via vision |
| URL | Try `WebFetch` first; if blocked (403/429) ask for a screenshot |
| Local file path | `Read` the file |
| Plain description | Treat as ground truth; ask only if critical details are missing |

## Workflow

### Step 1 — Load principles

Read the sibling file `principles.md`. All of it. Don't skim — you need the full catalog to audit thoroughly and score fairly.

### Step 2 — Establish context

Before scoring, determine:

- **Surface type**: landing page, onboarding, pricing, checkout, dashboard, email, settings, etc.
- **Primary user goal**: convert, complete a task, retain, discover, learn, pay
- **Audience**: consumer vs enterprise, first-time vs returning, technical vs non-technical

Some principles are context-specific. A B2B dashboard shouldn't be scored low for lacking Scarcity — that principle doesn't apply. Mark those `—` (N/A), not `✗`.

### Step 3 — Run the audit

For each principle in `principles.md`, evaluate:

- `✓` strong — clearly applied and well-executed
- `◐` partial — present but weak or inconsistent
- `✗` missing — absent where it would help
- `—` N/A — doesn't apply to this surface/context

Add a brief one-line note with each verdict ("CTAs use Von Restorff — single bright button against neutral UI").

Be honest. If you can't see hover states from a static screenshot, or animations weren't captured, mark those principles `—` and flag in Notes.

### Step 4 — Score

Per-category:
- `✓` = 1 point
- `◐` = 0.5 points
- `✗` = 0 points
- `—` = excluded from denominator

Category score = (sum of points) / (count of non-N/A principles) × 100. Round to nearest integer.

Overall score = average of category scores (equal weights unless context justifies weighting — e.g., a checkout page weights Decision-Making + Trust heavier).

### Step 5 — Prioritize top fixes

Pick 3 items from `✗` and `◐`. Weight by:

1. **Impact on primary user goal** — does fixing it move the needle?
2. **Implementation effort** — prefer high-impact, low-effort first
3. **Compounding effects** — fixing X also improves Y

If fewer than 3 real issues exist, give fewer. Honesty over padding.

### Step 6 — Output the report

Use the template below exactly.

## Report template

```markdown
# Audit: <subject name or URL>

**Surface type:** <landing / onboarding / pricing / checkout / dashboard / email / other>
**Primary goal:** <convert / retain / complete / discover / learn / pay>
**Audited from:** <screenshot / URL / file / description>

## Overall Score: XX/100

| Category | Score |
|----------|------:|
| Perception & Attention | XX |
| Cognitive Load | XX |
| Decision-Making | XX |
| Social Influence | XX |
| Motivation & Habit | XX |
| Memory & Experience | XX |
| Emotion & Trust | XX |

## Top Fixes (Prioritized)

### 1. <Short title> — Impact: High | Effort: Low
**What's broken:** <one sentence>
**Fix:** <specific, implementable change>
**Principle(s):** <name(s) from catalog>

### 2. <Short title> — Impact: High | Effort: Medium
...

### 3. <Short title> — Impact: Medium | Effort: Low
...

## Full Checklist

### Perception & Attention
- ✓ <Principle name> — <one-line note>
- ◐ <Principle name> — <one-line note>
- ✗ <Principle name> — <one-line note>
- — <Principle name> — N/A, <one-line reason>

### Cognitive Load
- ...

### Decision-Making
- ...

### Social Influence
- ...

### Motivation & Habit
- ...

### Memory & Experience
- ...

### Emotion & Trust
- ...

## Notes

- <Assumptions made during analysis>
- <What couldn't be audited — hidden states, animations, interactions>
- <Dark pattern flags, if any>
- <Anything the user should reconsider at a higher level>

---

*Audit framework inspired by [Growth Design's psychology cheat sheet](https://growth.design/psychology/cheatsheet). Principles drawn from behavioral-psychology research (Kahneman, Cialdini, Thaler, Fogg, Nir Eyal, Ariely, et al.).*
```

## Guardrails

- **Context-aware scoring.** Don't ding a B2B dashboard for missing Scarcity. Mark N/A.
- **No dark patterns.** If you spot confirmshaming, fake urgency, manipulative defaults, hidden opt-outs, drip-pricing tactics — flag in Notes. Never recommend them as "fixes."
- **Honesty about visibility.** Static screenshots miss hover / loading / error / animation states. Say what you didn't see.
- **Design-first, not code-first.** Reference principles, not implementation details.
- **Less can be more.** "Add more social proof" isn't always right. Sometimes the fix is removing noise, collapsing choices, or deleting a module.
- **One principle can be missing for good reasons.** A minimalist brand might deliberately skip Social Proof on the landing page. Ask why before recommending a change.

## Attribution

Always end reports with the Growth Design credit and link. The audit *framework* is ours; the *inspiration* is theirs.
