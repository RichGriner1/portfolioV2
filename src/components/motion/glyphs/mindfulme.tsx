"use client";

import { useEffect, useRef } from "react";

// active prop accepted for ComponentType compatibility but ignored — video always loops
export function MindfulmeGlyph(_props?: { active?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Slow the flip slightly so it feels calmer
    video.playbackRate = 0.75;

    // Pause briefly between loops so the animation doesn't feel restless
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleEnded = () => {
      timer = setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          void video.play();
        }
      }, 2500);
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src="/video/mindfulme-card-flip.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
