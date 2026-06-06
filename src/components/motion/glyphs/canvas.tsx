"use client";

import { CanvasAnimation } from "@/components/case-study-bento";

// active prop accepted for ComponentType compatibility but ignored — animation always loops
export function CanvasGlyph(_props?: { active?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl [&>div]:flex [&>div]:flex-1">
      <CanvasAnimation active tall />
    </div>
  );
}
