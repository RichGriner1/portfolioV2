# What to avoid (checkable anti-patterns)

These are the directly-flaggable failures from the AFI-FOUNDATIONS-MODERN "Benchmarks & What to Avoid" frame (`node-id=2035-65`). A review loop can hunt for each. When you flag one, name it and point to the principle it violates.

| Anti-pattern | What it looks like | Why it's wrong | Violates |
|---|---|---|---|
| **Material Design bloat** | Oversized controls, maximum elevation/heavy shadows, generous spacing, generic Android look | Undersizes the precision enterprise users expect | 02 Compact · 04 Functional Minimalism |
| **Heavy glassmorphism** | Blurred / translucent / glowing surfaces | Financial software should never look blurred or glowing | 03 Calm · 09 Enterprise-not-outdated |
| **Excessive gradients** | Gradients on structural UI (buttons, cards, chrome) | Gradients belong to onboarding / empty states / marketing only — never structural UI | 03 Calm · 08 Color communicates meaning |
| **Colorful enterprise dashboards** | Every KPI gets its own color | Use hierarchy before color; color must carry information | 08 Color communicates meaning |
| **Excessive rounded corners** | Playful consumer-grade radii | Radius stays restrained and systematic, not toy-like | 06 Consistency · 09 Enterprise-not-outdated |
| **Decorative icons** | Icons added for visual interest | Icons support navigation; they don't decorate — every icon earns its presence | 04 Functional Minimalism |
| **Large empty spaces** | Whitespace used to signal "luxury" | Whitespace should improve comprehension, not signal premium; enterprise users benefit from density | 01 Density without visual density · 02 Compact |
| **Hidden navigation** | Primary actions tucked behind menus/hover for cleanliness | Primary workflows must stay immediately discoverable; don't trade efficiency for visual minimalism | 11 Context over pages |

## Notes for a reviewer
- **Context matters (same as the principles).** Most of these hold anywhere (glassmorphism, gradients on structural UI, colorful-KPI, decorative icons, hidden nav). But **"Large empty spaces"** is the *enterprise-lean* one — it assumes a dense productivity UI. On a consumer / marketing / brand-led surface, generous whitespace is often the point; don't flag it there. "Excessive rounded corners" also softens off-context (a playful consumer product may want them). Check the declared context before flagging these two.
- These are **taste/judgment** flags, not deterministic token checks — describe the specific instance ("the modal uses `shadow-2xl` + 24px padding — Material bloat, violates 02 Compact") rather than asserting a blanket rule.
- Some overlap with token rules (excessive radius/shadow). When a token exists that encodes the restraint (e.g. a capped radius scale), cite the token; when it's a composition choice (too much elevation *and* spacing *and* color together), cite the anti-pattern.
- "Complex workflows are acceptable; complex visuals are not" (principle 04) is the tiebreaker when someone defends visual richness as necessary.
