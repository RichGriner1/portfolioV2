"use client";

import { PaletteAnimation } from "@/components/case-study-bento";

// active prop accepted for ComponentType compatibility but ignored — animation always loops
export function PaletteGlyph(_props?: { active?: boolean }) {
  return (
    <div className="border-border/60 flex h-full w-full flex-col overflow-hidden rounded-sm border [&>div]:h-full">
      <PaletteAnimation active />
    </div>
  );
}
