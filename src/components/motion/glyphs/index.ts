import type { ComponentType } from "react";

import { BrandRulesGlyph } from "./brand-rules";
import { DesignSystemGlyph } from "./design-system";
import { MigrationGlyph } from "./migration";
import { VisualStrategyGlyph } from "./visual-strategy";
import { WordpressShellGlyph } from "./wordpress-shell";

import type { GlyphKey } from "@/lib/content/work";

export const GLYPHS: Record<GlyphKey, ComponentType> = {
  "design-system": DesignSystemGlyph,
  "visual-strategy": VisualStrategyGlyph,
  "brand-rules": BrandRulesGlyph,
  migration: MigrationGlyph,
  "wordpress-shell": WordpressShellGlyph,
};

export {
  BrandRulesGlyph,
  DesignSystemGlyph,
  MigrationGlyph,
  VisualStrategyGlyph,
  WordpressShellGlyph,
};
