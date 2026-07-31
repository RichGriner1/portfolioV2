"use client";

// active prop accepted for ComponentType compatibility but ignored — video always loops
export function TypoTrailGlyph(_props?: { active?: boolean }) {
  return (
    <div className="border-border/60 flex h-full w-full items-center justify-center overflow-hidden rounded-sm border">
      <video
        src="/video/typo-trail.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
