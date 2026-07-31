import type { ComponentType } from "react";

import { BoundedLoopFigure } from "./bounded-loop";
import { LoopVsSkillFigure } from "./loop-vs-skill";
import { OrchestratorFigure } from "./orchestrator";
import { TokenCostFigure } from "./token-cost";
import { UseAnywhereFigure } from "./use-anywhere";

export type FigureKey =
  | "token-cost"
  | "use-anywhere"
  | "loop-vs-skill"
  | "orchestrator"
  | "bounded-loop";

// `frameless` drops a figure's own card frame so it can sit on a surface
// that already provides one (e.g. a WorkCard tile). Figures that don't
// implement it simply ignore the prop.
export const FIGURES: Record<
  FigureKey,
  ComponentType<{ frameless?: boolean }>
> = {
  "token-cost": TokenCostFigure,
  "use-anywhere": UseAnywhereFigure,
  "loop-vs-skill": LoopVsSkillFigure,
  orchestrator: OrchestratorFigure,
  "bounded-loop": BoundedLoopFigure,
};

export {
  TokenCostFigure,
  UseAnywhereFigure,
  LoopVsSkillFigure,
  OrchestratorFigure,
  BoundedLoopFigure,
};
