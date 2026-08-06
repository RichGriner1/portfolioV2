import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BoundedLoopFigure } from "@/components/motion/figures/bounded-loop";
import { ListVsBentoFigure } from "@/components/motion/figures/list-vs-bento";
import { LoopVsSkillFigure } from "@/components/motion/figures/loop-vs-skill";
import { MaturityStagesFigure } from "@/components/motion/figures/maturity-stages";
import { OrchestratorFigure } from "@/components/motion/figures/orchestrator";
import { PauseConfidenceFigure } from "@/components/motion/figures/pause-confidence";
import { StaticVsIntentFigure } from "@/components/motion/figures/static-vs-intent";
import { TokenCascadeFigure } from "@/components/motion/figures/token-cascade";
import { TokenCostFigure } from "@/components/motion/figures/token-cost";
import { TreeVsIntentFigure } from "@/components/motion/figures/tree-vs-intent";
import { UseAnywhereFigure } from "@/components/motion/figures/use-anywhere";

export const metadata: Metadata = {
  title: "Figures Preview",
  description: "Preview surface for animated blog-post diagrams.",
};

export default function FiguresPreviewPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-16">
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — same fix, far fewer tokens
          </span>
          <TokenCostFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — one home base, live in every project
          </span>
          <UseAnywhereFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — the loop is the worker, the skills are the manuals
          </span>
          <LoopVsSkillFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — the loop orchestrates two helpers
          </span>
          <OrchestratorFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — from runaway spin to a bounded stop
          </span>
          <BoundedLoopFigure />
        </div>

        {/* Modern UI in 2026 — the six diagrams, in the post's reading order. */}
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — the five stages of design maturity
          </span>
          <MaturityStagesFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — same modules, the intent decides which leads
          </span>
          <StaticVsIntentFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — walking the tree against a short route
          </span>
          <TreeVsIntentFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — the pause that makes a payment feel real
          </span>
          <PauseConfidenceFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — a flat list becoming a bento grid
          </span>
          <ListVsBentoFigure />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            Figure — one decision, three layers
          </span>
          <TokenCascadeFigure />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
