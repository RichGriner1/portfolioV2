import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BoundedLoopFigure } from "@/components/motion/figures/bounded-loop";
import { LoopVsSkillFigure } from "@/components/motion/figures/loop-vs-skill";
import { OrchestratorFigure } from "@/components/motion/figures/orchestrator";
import { TokenCostFigure } from "@/components/motion/figures/token-cost";
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
      </main>
      <SiteFooter />
    </>
  );
}
