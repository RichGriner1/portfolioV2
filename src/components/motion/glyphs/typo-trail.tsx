"use client";

// active prop accepted for ComponentType compatibility but ignored — video always loops
export function TypoTrailGlyph(_props?: { active?: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
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
