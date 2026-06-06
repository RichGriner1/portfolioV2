import type { ComponentType } from "react";

import { BrandRulesGlyph } from "./brand-rules";
import { BreathingGlyph } from "./breathing";
import { CanvasGlyph } from "./canvas";
import { DesignSystemGlyph } from "./design-system";
import { MigrationGlyph } from "./migration";
import { MindfulmeGlyph } from "./mindfulme";
import { PaletteGlyph } from "./palette";
import { TypoTrailGlyph } from "./typo-trail";
import { VisualStrategyGlyph } from "./visual-strategy";
import { WordpressShellGlyph } from "./wordpress-shell";

import type { GlyphKey } from "@/lib/content/work";

export const GLYPHS: Record<GlyphKey, ComponentType<{ active?: boolean }>> = {
  "design-system": DesignSystemGlyph,
  "visual-strategy": VisualStrategyGlyph,
  "brand-rules": BrandRulesGlyph,
  migration: MigrationGlyph,
  "wordpress-shell": WordpressShellGlyph,
  breathing: BreathingGlyph,
  palette: PaletteGlyph,
  canvas: CanvasGlyph,
  mindfulme: MindfulmeGlyph,
  "typo-trail": TypoTrailGlyph,
};

export {
  BrandRulesGlyph,
  BreathingGlyph,
  CanvasGlyph,
  DesignSystemGlyph,
  MigrationGlyph,
  MindfulmeGlyph,
  PaletteGlyph,
  TypoTrailGlyph,
  VisualStrategyGlyph,
  WordpressShellGlyph,
};
