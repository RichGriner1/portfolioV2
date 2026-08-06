"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { SPRING_SOFT } from "@/components/motion/constants";

/**
 * Diagram 5 — a flat list becoming a bento grid.
 *
 * One CSS grid the whole time, and the tiles only change their `span`. That is the
 * argument made structurally: bento isn't a different layout system, it's the same
 * modules claiming different amounts of room. Rebuilding the markup between the two
 * states would have implied a rewrite, which is exactly the wrong takeaway.
 *
 * `layout` on each tile animates the span change, so tiles visibly grow and reflow
 * instead of cutting between arrangements.
 */
/**
 * `bento` spans are deliberately uneven — 2 / 2 / 2 / 1 / 1. A first pass gave the
 * lead tile the full 4 and split the rest into halves, which is just a hero above a
 * list: still a rigid grid, only with a bigger row on top. Asymmetry is the pattern's
 * whole content, so no two consecutive rows share a column split.
 */
const TILES = [
  { name: "Portfolio value", flat: 4, bento: 2, tall: true },
  { name: "Allocation", flat: 4, bento: 2, tall: false },
  { name: "Recent activity", flat: 4, bento: 2, tall: false },
  { name: "Risk", flat: 4, bento: 1, tall: false },
  { name: "Alerts", flat: 4, bento: 1, tall: false },
] as const;

export function ListVsBentoFigure() {
  const [bento, setBento] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setBento((b) => !b), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
          {bento ? "Bento grid" : "Flat list"}
        </span>
        <span className="text-muted-foreground font-mono text-[9px]">
          {bento ? "size carries importance" : "everything equal"}
        </span>
      </div>

      <div className="border-border/60 bg-muted/30 min-h-[180px] rounded-xl border p-3">
        <div className="grid grid-cols-4 gap-2">
          {TILES.map((tile, i) => {
            const span = bento ? tile.bento : tile.flat;
            const lead = bento && tile.tall;
            return (
              <motion.div
                key={tile.name}
                layout
                transition={SPRING_SOFT}
                style={{ gridColumn: `span ${span} / span ${span}` }}
                className={
                  lead
                    ? "bg-primary text-primary-foreground flex h-[68px] items-end rounded-lg p-2.5 text-[10px] font-medium"
                    : "bg-muted text-muted-foreground flex h-[34px] items-center rounded-lg px-2.5 text-[10px]"
                }
              >
                <motion.span layout="position">{tile.name}</motion.span>
                {lead ? (
                  <motion.span
                    layout="position"
                    className="text-primary-foreground/70 ml-auto font-mono text-[9px]"
                  >
                    {i === 0 ? "€1.24M" : ""}
                  </motion.span>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="text-muted-foreground border-border/60 border-t pt-3 text-[11px] leading-snug">
        Same modules, same grid. The flat list makes every row equal; spans let
        the important one say so.
      </p>
    </div>
  );
}
