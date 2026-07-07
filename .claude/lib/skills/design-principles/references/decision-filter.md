# The decision filter (10 questions)

From the AFI-FOUNDATIONS-MODERN frame (`node-id=2035-65`). **Before introducing any UI element, ask these.** In a review loop, use them as the lens — surface at least the ones a change fails or dodges.

1. **Does it reduce cognitive effort?**
2. **Does it improve scan speed?**
3. **Can an existing component solve this?** (→ principle 10 Build Systems, Not Screens)
4. **Is color communicating information?** (→ principle 08)
5. **Can this become a reusable component?** (→ principle 10)
6. **Would Cursor, Granola, or Shopify make this decision?** (the benchmark gut-check)
7. **Does this increase confidence?**
8. **Does this remove unnecessary clicks?**
9. **Will this still feel modern in five years?** (→ principle 09; neutral, restrained choices age better)
10. **Does this support enterprise-scale workflows?**

## Using it in a review
- A change that can't answer **3** or **5** affirmatively is a systems smell — a one-off where a component belongs.
- A change that fails **4** (color for interest, not information) is the single most common violation — flag it against principle 08.
- **6** and **9** are the "taste" questions: if the honest answer is "a flashy consumer app would do this, Linear/Vercel wouldn't," cut it.
- You don't need all ten to pass — but a change that fails several is a rewrite, not a tweak.
