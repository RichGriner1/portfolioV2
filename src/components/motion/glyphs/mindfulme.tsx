"use client";

// active prop accepted for ComponentType compatibility but ignored — video always loops
export function MindfulmeGlyph(_props?: { active?: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <video
        src="/video/mindfulme-card-flip.mp4"
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
