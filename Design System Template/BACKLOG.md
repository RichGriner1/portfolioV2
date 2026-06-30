# Backlog

Ideas captured for later — not scheduled yet.

## Richer color swatch cards (Quantus / Tek palette reference)
Reference screenshots showed Pantone-style swatch cards:
- Big base color block per swatch with a named title (e.g. "Electric Violet", "Tek Blue").
- Full color data: **CMYK · RGB · HEX · Pantone**.
- **Gradient variants** for some swatches (e.g. "Tek Blue Gradient").
- Tonal step strip beneath the base.

Our primitive bento (on `/color`) takes the layout cue from these. Future enhancement:
- Add CMYK / RGB / Pantone alongside HEX (compute or store in tokens).
- Support gradient tokens + gradient swatch cards.
- Consider these as ready-made **white-label palette examples** to demo swapping `primary`.
