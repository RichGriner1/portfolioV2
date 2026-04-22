# growth-audit

A Claude Code skill that audits product designs against ~40 behavioral-psychology principles and returns a scored report with prioritized fixes.

Inspired by [Growth Design's psychology cheat sheet](https://growth.design/psychology/cheatsheet) — principles drawn from public behavioral-psychology research (Kahneman, Cialdini, Thaler, Fogg, Nir Eyal, Ariely, Tversky).

---

## What it does

Give it a screenshot, URL, or description of a design. It returns:

1. **Overall score (0–100)** with a category breakdown
2. **Top 3 prioritized fixes** weighted by impact and effort
3. **Full principle-by-principle checklist** with verdicts (`✓ ◐ ✗ —`) and one-line notes

### Categories covered

| # | Category | Principles |
|---|----------|-----------:|
| 1 | Perception & Attention | 6 |
| 2 | Cognitive Load | 5 |
| 3 | Decision-Making | 7 |
| 4 | Social Influence | 6 |
| 5 | Motivation & Habit | 6 |
| 6 | Memory & Experience | 5 |
| 7 | Emotion & Trust | 6 |
| | **Total** | **41** |

Examples of principles included: Von Restorff Effect, Hick's Law, Fitts's Law, Anchoring, Loss Aversion, Social Proof, Peak-End Rule, Fogg Behavior Model, Jakob's Law, IKEA Effect, Halo Effect — and many more.

---

## Install

```
/plugin install github:RichGriner1/growth-audit
```

Once installed, the skill triggers automatically on natural phrases. Examples:

- *"Audit this design"* + paste a screenshot
- *"Growth audit on https://example.com"*
- *"Psych audit this"* + description
- *"Score this landing page against psychology principles"*
- *"Review this UX for a recruiter audience"*

You can also be explicit: *"run growth-audit on X"*.

---

## What's in the box

```
growth-audit/
├── .claude-plugin/plugin.json
├── skills/growth-audit/
│   ├── SKILL.md         # workflow, report template, trigger config
│   └── principles.md    # catalog of 41 principles across 7 categories
├── README.md
└── LICENSE
```

---

## Guardrails baked in

- **Context-aware scoring.** B2B dashboards don't get dinged for lacking Scarcity. Principles that don't apply are marked `—` (N/A), not `✗`.
- **No dark patterns.** Fake scarcity, confirmshaming, manipulative defaults, hidden opt-outs — flagged in the report, never recommended as "fixes."
- **Honesty about visibility.** Static screenshots don't show hover / loading / error states. The report says what couldn't be audited.
- **Less can be more.** Sometimes the best fix is removing noise, not adding social proof.

---

## Customize it

- **Retarget the triggers:** edit the `description` field in the frontmatter of `skills/growth-audit/SKILL.md`. That's what Claude uses to decide when to invoke.
- **Add or refine principles:** edit `skills/growth-audit/principles.md`. Each entry follows the same three-line shape:
  ```
  ### <Principle name>
  **What it is:** ...
  **Design signal (strong):** ...
  **Audit flags (weak / missing):** ...
  ```

---

## Attribution

The principles in the catalog are public behavioral-psychology concepts. The curation and framing here is the author's own. Inspiration for the skill came from [Growth Design's psychology cheat sheet](https://growth.design/psychology/cheatsheet), which packages a similar taxonomy in their own distinctive visual style. This plugin does not reproduce their prose, illustrations, or case-study copy.

---

## License

MIT — see [LICENSE](./LICENSE).
