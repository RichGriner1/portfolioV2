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

export const FIGURES: Record<FigureKey, ComponentType> = {
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
