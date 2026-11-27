# Graphics

Which graphic goes where, and what to ask Richard when a slot is empty. Every example below comes from one of the six teardowns.

## The one rule

**A graphic answers the sentence next to it.** If the text says "multiple platforms", the graphic shows the platforms. If the text says "omnichannel", the graphic shows more than one device. If the text says "fear of the ATM", the graphic shows the ATM.

Two directions are allowed:

- **Proof of what was just said.** Text claims, graphic shows. Most graphics are this.
- **Preview of what comes next.** A graphic opens a section and the text then explains it. Garaje does this at the start of every section: Adeslas's public-website screenshot sits right before "Phase 1: launch of the first public website".

A graphic that does neither is decoration. Cut it or move it.

## The graphic types

| Type | What it is | Use it when the text is about… | Seen in |
|---|---|---|---|
| **Mood photo** | A person in the client's world, emotional, full-bleed. | The audience; who this is for. | Solar360 hero, Banco Azteca hero, Iberdrola hero |
| **Hero artifact** | The finished product, big, in a clean setting. | Nothing yet: it opens the page with the result. | Solar360 laptop, Banco Azteca ATM |
| **Brand moment** | Logo or wordmark alone, on a brand colour or black. | A turn in the story: the brand, the relaunch, the new identity. | CaixaBank black logo slide, IKEA blue wordmark, NOW hero |
| **Context photo** | The real world before or around the product. | The problem, the market, the user's situation. | Solar360 woman holding a solar panel |
| **Research evidence** | Workshop walls, prototypes pinned up, interview portraits. | Method: interviews, testing, co-design. Shows effort. | Banco Azteca prototype wall and user portraits |
| **Concept diagram** | Bubbles, boxes, arrows: the shape of a problem or system. | Scope, stack, ecosystem, information architecture, journeys. | Adeslas tech-stack bubbles |
| **System sheet** | Icon grid, principle cards, components, colour, type. | The design system, the visual code, the rules. | CaixaBank icon grid, Iberdrola principle cards |
| **Screen** | One UI screen, cropped or on a device. | A specific feature. | Iberdrola invoice and charts, Adeslas web |
| **Screen row** | Three phone screens side by side. | A flow, or several features at once. | Solar360 three phones, Iberdrola phone strip |
| **Device spread** | The same product on watch, phone, TV, ATM. | Omnichannel, consistency across surfaces. | CaixaBank watch + TV, ATM + phone |
| **In-situ product** | The product where it lives: ATM in a wall, phone in a hand. | Real use; the solution landing in the world. | Banco Azteca ATM in the street, CaixaBank ATM |
| **Statement card** | Big type on a brand-colour block. | A summary claim the reader should remember. | Adeslas "From a specific request to a long-term partnership", IKEA "B2B adaptable sector" |
| **Value words** | A stack or marquee of 3–5 words. | Brand values, principles, the tone of the experience. | Iberdrola "human, honest, sustainable", Cocktail "Empathy" marquee |
| **Timeline** | Dates in sequence, or giant years. | Duration, phases, how the work evolved. | Banco Azteca 2018 → Jun 2019, IKEA 21 → 202x, Iberdrola "2022, laying the foundations" |
| **Metric strip** | 3 big numbers, each with one caption line. | Results. | Solar360 and Banco Azteca conclusions |
| **Metric chips on photo** | Results as tags laid over an outcome photo. | Results when there are many small ones. | Adeslas "7 → 27 professionals", "5 platforms" |
| **Quote** | One line, centred, name and title below. | A human verdict on the work. | Solar360 marketing manager, Banco Azteca CEO |

## Which graphic for which section

| Section | First choice | Second choice | Avoid |
|---|---|---|---|
| Hero | Hero artifact | Mood photo | A screen too small to read |
| Context / starting point | **Before** screen or old-state diagram | Context photo | The finished product (it spoils the turn) |
| Challenge | Concept diagram of the problem | Context photo | Stock imagery |
| Approach / process | Research evidence, wireframes, IA diagram, flow | Timeline | Finished screens (they belong to the solution) |
| Decisions | Side-by-side options, before/after | Diagram of the chosen rule | — |
| System / principles | System sheet | Value words, principle cards | — |
| Solution | Screens, screen row, device spread | In-situ product | Mood photo with no product in it |
| Results | Metric strip | Metric chips on photo, statement card | A paragraph with numbers buried in it |

### Pairing

Both studios pair images: one wide and one square, or one photo and one diagram. The pair carries two halves of one idea:

- **Emotion + mechanism.** Adeslas: a mother and baby (who the insurance is for) next to the tech-stack diagram (what we had to run).
- **Real + rendered.** Banco Azteca: the team at a wall of prototypes next to the clean ATM render.
- **Product + brand.** CaixaBank: the illustration next to the NOW logo.

When planning a pair, name both halves: "this side shows who, that side shows how".

### Mobile

Garaje ships a separate mobile crop for every image pair (`touchpoint_digital.avif` / `touchpoint_digital_mobile.avif`). Plan for it: a wide diagram will not read at 375px. Either crop it, redraw it vertical, or replace it with the single most important part.

## The questions to ask Richard

When a slot is empty, ask the question for that slot. One at a time, with the text the graphic sits beside quoted first.

| Slot | Ask |
|---|---|
| Hero | "What's the one screen or object that *is* this project? Or should the hero be the people it's for?" |
| Context / before | "Do you have a screenshot of what existed before? If not, should we draw the old mess as a diagram (where things lived, who did what)?" |
| Challenge | "This section says [X]. Is that best shown as a diagram (how the pieces connect), or as one real example of the problem?" |
| Approach / process | "What did the working stage look like: FigJam boards, wireframes, a spreadsheet, a meeting? Any photo or capture of it?" |
| Information architecture | "Should this be a sitemap, a flow (step to step), or a system map (parts and who uses them)? Which one did you actually work from?" |
| Decision | "What were the options on the table? Do we have a capture of the one we dropped?" |
| System | "Which part of the system do you want seen: tokens, components, icons, the docs site? One sheet or a short clip?" |
| Solution | "Which 1–3 screens show the feature best? Desktop, mobile, or both side by side?" |
| Omnichannel / many products | "Should this be a device spread (same thing on several surfaces) or a screen row (several features)?" |
| Results | "Which numbers can we say publicly? If none, what can we count: screens, components, products using it, people onboarded?" |
| Quote | "Did anyone say something about this work we can quote, with their role?" |

## When the client is confidential

Most of our client work can't show real screens. In order of preference:

1. **A diagram** of the structure (IA, token layers, flow). It shows the thinking, which is what the reader is hiring.
2. **A glyph animation** from `src/components/motion/glyphs/`. Abstract, on-brand, says the idea without the client.
3. **A redacted screen**: real layout, client names and data swapped for placeholders.
4. **A system sheet** of the DS parts that are ours to show.

Never use a client screen with only the logo blurred. The layout identifies the client.
