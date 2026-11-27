# Case-study worksheet

Copy this into the journal or a draft when planning a case study. Fill one row per section before writing any copy. A row with an empty graphic column is a question for Richard (see [graphics.md](graphics.md#the-questions-to-ask-richard)).

```markdown
# <slug> — plan

Transformation line: From ___ to ___.
Client / sector / when / team / Richard's role:
Confidential? yes / no — if yes, what can be shown:
Numbers we can say publicly:
The miss or trade-off we admit:

| # | Section | Copy beat (one sentence) | Graphic type | Asset we have | Open question |
|---|---|---|---|---|---|
| 1 | Hero | — | | | |
| 2 | Meta | | — | — | |
| 3 | Proof strip | | text | — | |
| 4 | Context / before | | | | |
| 5 | Challenge | | | | |
| 6 | Approach | | | | |
| 7 | Decision 1 | | | | |
| 8 | System | | | | |
| 9 | Solution: feature A | | | | |
| 10 | Solution: feature B | | | | |
| 11 | Quote | | text | — | |
| 12 | Results | | metric strip | — | |
| 13 | Miss / next | | text | — | |
```

## How to fill it

1. **Transformation line first.** If we can't write "From X to Y", we don't know the story yet.
2. **Copy beat, one sentence per row.** This is the claim the section makes. The graphic will answer it.
3. **Graphic type from the table in graphics.md.** Pick by what the sentence says, not by what assets exist.
4. **Asset we have.** Path, Figma link, or "none". "None" moves the row to Open question.
5. **Delete rows that don't apply.** A case study with 8 strong rows beats 13 thin ones.

## Example: a design-system case study

Illustrative only. The counts come from the `afi-design-system` intro; the questions show the kind of gap to flag, not facts.

| # | Section | Copy beat | Graphic type | Open question |
|---|---|---|---|---|
| 4 | Context | Three products each had their own buttons, colours and spacing. | Before: three screens side by side, same control drawn three ways | Do we have captures of the old screens? |
| 5 | Challenge | 40 developers, no designer until 2021, no shared source. | Concept diagram: teams → products, no shared layer | — |
| 6 | Approach | We layered tokens: primitives, semantic, component. | IA diagram of the three layers | Draw it, or use the docs-site page? |
| 7 | Decision 1 | We chose semantic names over colour names. | Option comparison: `blue-500` vs `action-primary` | Which product broke when we tried the first? |
| 8 | System | 87 primitives, 39 semantic aliases. | System sheet: token table | Clip of the token docs or a static sheet? |
| 12 | Results | Every product now pulls from one package. | Metric strip: products, components, tokens | Which counts can we say publicly? |
