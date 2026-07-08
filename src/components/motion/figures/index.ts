import type { ComponentType } from "react";

import { TokenCostFigure } from "./token-cost";
import { UseAnywhereFigure } from "./use-anywhere";

export type FigureKey = "token-cost" | "use-anywhere";

export const FIGURES: Record<FigureKey, ComponentType> = {
  "token-cost": TokenCostFigure,
  "use-anywhere": UseAnywhereFigure,
};

export { TokenCostFigure, UseAnywhereFigure };
