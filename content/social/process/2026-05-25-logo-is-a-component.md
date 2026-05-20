---
title: "The logo is a component now, not a folder"
slug: logo-is-a-component
brainstorm: content/social/process/2026-05-20-micro-content-batch.md
source_meetings:
  - granola://28d1b893-9c6d-434d-b822-f80a3bd78469
pillar: process
stance: builder
status: draft
created: 2026-05-20
scheduled_for: 2026-05-25  # Mon
posted_at:
typefully_ids:
  linkedin:
  twitter:
---

# The logo is a component now, not a folder

> Schedule: **Mon 2026-05-25** · Pillar: process · Stance: builder · Status: draft

## LinkedIn

> We stopped shipping SVG logo files. The logo is a coded component.
>
> Old way: designer exports the bank's logo in six sizes, light and dark, color and monochrome. Developer imports the right file per surface. Brand updates, repeat for every size.
>
> New way: one SVG component, two semantic tokens. The color variant stays on brand. The monochrome variant switches white or black with the mode. Sizes are a CSS variable, not a separate file.
>
> This stripped a folder of 20+ exports down to one component. For a white-label fintech consultancy this matters double — every client's brand goes through the same swap mechanism. New bank, same component, different tokens.
>
> The cleanup wasn't the point. The point is the next client. The system earns its keep when remakes compound instead of starting from scratch.
>
> Wrote up the wider token system on the Afi case study → [link]

## Twitter

> 1/ We stopped shipping SVG logo files. The logo is a coded component now.
>
> 2/ Old way: export six sizes, light + dark, color + monochrome. Engineer imports the right file per surface. Brand updates, repeat for every size.
>
> 3/ New way: one SVG component, two semantic tokens. Color variant stays on brand. Monochrome variant switches white/black with the mode. Size is a CSS variable, not a separate file.
>
> 4/ Stripped a 20-file folder down to one component. For a white-label fintech it matters double — every client's brand swaps through the same mechanism.
>
> 5/ Cleanup wasn't the point. The next bank is. Full case study: [link]

## Notes

- **Case-study tie**: Afi → Token Architecture (tier-3 custom semantics: same role, two palettes, the mode picks the right one) and White-label at Scale (every client swaps through the same mechanism).
- **LinkedIn graphic concept**: 2×2 grid of the Afi mark — color/light (AzulProfundo), color/dark (azulafi), mono/light (black), mono/dark (white). Below each tile, the semantic token name driving it. Around the grid, the playground UI — toggle for *icon* vs *icon+wordmark*, toggle for *brand* vs *monochrome*, size dropdown. Background blocks of `base.white` and `base.black` so contrast is obvious. Caption: *"One file, four variants. The token picks the right one."*
- This is the strongest **visual** post of the six — the 2×2 grid survives the LinkedIn crop.
- **CTA link target**: `https://richgriner.com/work/afi-design-system`

See the [brainstorm batch](2026-05-20-micro-content-batch.md) for full reasoning.
