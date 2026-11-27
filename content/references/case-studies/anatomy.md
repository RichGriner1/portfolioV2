# Anatomy

The section order a strong case study follows, taken from the six teardowns. First the two studio templates as they are, then the merged skeleton we use, then how it maps onto our `CaseStudy` type in `src/lib/content/case-studies.tsx`.

## The two studio templates

**VML The Cocktail** runs the same template on every case. It reads like a short report.

| # | Section | Job |
|---|---|---|
| 1 | Hero photo | Mood. A person, usually smiling, in the client's world. |
| 2 | Tags + title + meta table | Sector and service tags; transformation title; Client / Where / What / When. |
| 3 | Results ticker | 4–5 outcomes in one line, separated by long dashes. |
| 4 | Hero artifact | The finished thing, big: the landing page on a laptop, the ATM in a studio. |
| 5 | **01 The challenge** | Heading + 2 short paragraphs on the market or user problem. |
| 6 | Challenge, part 2 | A second heading that turns the problem into a goal. |
| 7 | **02 The solution** | Heading + method (what we did, with a count: 100 interviews, 3,000 km). |
| 8 | Solution evidence | Research photos, prototypes, brand system, screens. |
| 9 | Client quote | One line from an executive, centred, with name and title. |
| 10 | Timeline | A carousel of dated steps, from trigger to launch. |
| 11 | Marquee word | One value word scrolling ("Empathy", "Differentiation") over people photos or screens. |
| 12 | **Conclusion** | Dark block: heading, two images, result paragraph, 3 metrics with captions. |
| 13 | More cases + contact | Three related cases, contact link. |

**Garaje de Ideas** runs a looser template that bends to the engagement. It reads like a relationship story.

| # | Section | Job |
|---|---|---|
| 1 | Client name (H1) + transformation line (H2) | Who, and what changed. |
| 2 | Hero visual | Brand photo with a product card on it, or a brand-mark moment. |
| 3 | Meta column + Problem context | Industry / Services / Timeline on the left; the starting point on the right. |
| 4 | Image row | Wide image + square image (separate mobile crops). |
| 5 | The challenge | One heading, then 2–3 numbered challenges (tabbed: Challenge 1, 2, 3). |
| 6 | Approach / Process | Phases (Phase 1, 2, 3) or product-by-product sections. |
| 7 | Principles | 3–4 named principles, each one line. Sometimes a card grid. |
| 8 | Results / Key takeaways | Bullet results or 3 short "what this partnership is" blocks. |
| 9 | Closing statement | Big-type card, or a sentence with small inline photos. |
| 10 | Contact | "Let's talk!" |

## The merged skeleton (use this)

Every section below is a slot. Most case studies use 8–10 of them. The ones marked **core** always appear.

| # | Section | Core? | Says | Typical graphic |
|---|---|---|---|---|
| 1 | **Title + transformation line** | core | From X to Y. One line. | — |
| 2 | **Hero** | core | Nothing; it sets the world. | Hero artifact or mood photo |
| 3 | **Meta** | core | Client, sector, when, role, team, services. | — |
| 4 | Proof strip | if numbers exist | 3–5 outcomes before the story starts. | Text only |
| 5 | **Context / starting point** | core | What existed before and why it was not enough. Concrete. | Before screen, context photo, or old-state diagram |
| 6 | **Challenge** | core | 1–3 named problems. Each one a heading + 1 paragraph. | Diagram of the problem (stack, journey, mess) |
| 7 | Goal / turn | optional | The problem restated as what we set out to do. | Brand or product mood |
| 8 | **Approach / process** | core | What we did, in order. Phases, research, method, with counts. | Research evidence, wireframes, IA, flow |
| 9 | Decisions | ours, not theirs | The 1–3 calls that mattered: options, what was chosen, what was dropped. | Option comparison, before/after |
| 10 | System / principles | if a system was built | The rules: principles, tokens, components, icon set. | System sheet, principle cards |
| 11 | **Solution / screens** | core | The finished product, one feature per beat. | Screens, device spread, in-situ product |
| 12 | Quote | if we have one | One line from a client, PM or developer. | Text only, or a portrait |
| 13 | Timeline | if the work ran long | Dated steps from trigger to today. | Timeline |
| 14 | **Results** | core | 3 numbers with captions, or 3–5 concrete outcomes. | Metric strip, outcome photo |
| 15 | Miss / what's next | ours, not theirs | What did not work or is still open. | Text only |
| 16 | Next case + contact | core | Keep them reading. | Case cards |

### Rules that come with the skeleton

- **Heading, graphic, body.** Garaje's rhythm: a short heading sets up the claim, the graphic shows it, the body explains it. The Cocktail runs heading, body, graphic. Either works; pick one per page and keep it.
- **Section headings are claims, not labels.** "A population that avoids banks", not "Research". The small kicker above carries the label ("01 The challenge").
- **Short paragraphs.** Both studios keep body text to 2–4 sentences per block. Long explanations break into numbered sub-items (Challenge 1, Phase 2).
- **Counts in the method.** "More than 100 users across 3,000 km." "From 7 people to 27." The number makes the effort real.
- **One quote, one timeline, one results block.** Never two of each.
- **The page ends on numbers or a single big sentence**, never on a paragraph.

## Mapping onto our `CaseStudy` type

| Skeleton slot | Our field | Notes |
|---|---|---|
| Title + transformation line | `tagline` | Write it as "From X to Y" when the project had a clear before. |
| Meta | `role`, `contributions` | `contributions` is Garaje's "Services" list. There is no client / when / team field yet. |
| Context + challenge | `intro`, first `story[]` sections | `intro` carries the starting point; the challenge gets its own `story` section. |
| Approach, decisions | `story[]` with `kicker` | Use `kicker` ("Decision 1") for the consequential calls and `options` for the alternatives. |
| System, solution | `bento[]` + `details` | One card per capability or feature. The four beats in `details` (problem, what we did, solution, why it works) are a mini case study per card. |
| Screens, diagrams | `story[].media`, `details.media`, `details` diagram | Clips today; diagrams from `src/lib/content/diagrams.ts`. |
| Proof strip, quote, timeline, results | **none yet** | Our type has no metrics, quote or timeline field. Adding them is a code change; plan it per case study, don't fake it in body text. |
| Confidential clients | `confidential` | Swap screens for diagrams, glyph animations or redacted screens. See [graphics.md](graphics.md#when-the-client-is-confidential). |
