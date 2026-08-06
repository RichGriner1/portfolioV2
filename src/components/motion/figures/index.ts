import type { ComponentType } from "react";

import { BoundedLoopFigure } from "./bounded-loop";
import { ListVsBentoFigure } from "./list-vs-bento";
import { LoopVsSkillFigure } from "./loop-vs-skill";
import { MaturityStagesFigure } from "./maturity-stages";
import { OrchestratorFigure } from "./orchestrator";
import { PauseConfidenceFigure } from "./pause-confidence";
import { StaticVsIntentFigure } from "./static-vs-intent";
import { TokenCascadeFigure } from "./token-cascade";
import { TokenCostFigure } from "./token-cost";
import { TokenLevelsFigure } from "./token-levels";
import { TreeVsIntentFigure } from "./tree-vs-intent";
import { UseAnywhereFigure } from "./use-anywhere";
import { VisualIdentityProcessFigure } from "./visual-identity-process";

export type FigureKey =
  | "token-cost"
  | "use-anywhere"
  | "loop-vs-skill"
  | "orchestrator"
  | "bounded-loop"
  | "visual-identity-process"
  // Modern UI in 2026 — one per learning in the post, in reading order.
  | "maturity-stages"
  | "static-vs-intent"
  | "tree-vs-intent"
  | "pause-confidence"
  | "list-vs-bento"
  | "token-cascade"
  | "token-levels";

export const FIGURES: Record<FigureKey, ComponentType> = {
  "token-cost": TokenCostFigure,
  "use-anywhere": UseAnywhereFigure,
  "loop-vs-skill": LoopVsSkillFigure,
  orchestrator: OrchestratorFigure,
  "bounded-loop": BoundedLoopFigure,
  "visual-identity-process": VisualIdentityProcessFigure,
  "maturity-stages": MaturityStagesFigure,
  "static-vs-intent": StaticVsIntentFigure,
  "tree-vs-intent": TreeVsIntentFigure,
  "pause-confidence": PauseConfidenceFigure,
  "list-vs-bento": ListVsBentoFigure,
  "token-cascade": TokenCascadeFigure,
  "token-levels": TokenLevelsFigure,
};

export {
  TokenCostFigure,
  UseAnywhereFigure,
  LoopVsSkillFigure,
  OrchestratorFigure,
  BoundedLoopFigure,
  VisualIdentityProcessFigure,
  MaturityStagesFigure,
  StaticVsIntentFigure,
  TreeVsIntentFigure,
  PauseConfidenceFigure,
  ListVsBentoFigure,
  TokenCascadeFigure,
  TokenLevelsFigure,
};
