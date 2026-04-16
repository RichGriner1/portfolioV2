import type { ComponentType } from "react";

import { MigrationGlyph } from "./migration";
import { OscillationGlyph } from "./oscillation";
import { ScheduleGlyph } from "./schedule";
import { SiblingsGlyph } from "./siblings";
import { WhitelabelGlyph } from "./whitelabel";

import type { GlyphKey } from "@/lib/content/work";

export const GLYPHS: Record<GlyphKey, ComponentType> = {
  migration: MigrationGlyph,
  whitelabel: WhitelabelGlyph,
  siblings: SiblingsGlyph,
  schedule: ScheduleGlyph,
  oscillation: OscillationGlyph,
};

export {
  MigrationGlyph,
  OscillationGlyph,
  ScheduleGlyph,
  SiblingsGlyph,
  WhitelabelGlyph,
};
