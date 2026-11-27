"use client";

import Image from "next/image";

import { LoopVideo } from "@/components/case-study-story";
import { CLIPS, type ClipId, type Still } from "@/components/tpc/clips";
import { ScreenSlot } from "@/components/tpc/demos";
import { pick, useLang } from "@/lib/i18n";

/** A board captured from the canvas, in the same bordered frame as a recording. */
export function StillFrame({
  still,
  sizes = "(min-width: 1024px) 976px, 100vw",
}: {
  still: Still;
  /** Defaults to the page's full content width; a two-up pair passes its own. */
  sizes?: string;
}) {
  const { lang } = useLang();
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <Image
        src={still.src}
        alt={pick(still.alt, lang)}
        width={still.width}
        height={still.height}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}

/**
 * A screen recording of the prototype, a still from the canvas, or a dashed
 * placeholder until either exists. The recording is silent and loops only while it is
 * on screen (LoopVideo).
 */
export function ClipSlot({ id }: { id: ClipId }) {
  const { lang } = useLang();
  const spec = CLIPS[id];
  if (spec.still) {
    return <StillFrame still={spec.still} />;
  }
  if (!spec.clip) {
    return <ScreenSlot label={spec.label} className="aspect-[16/10]" />;
  }
  return (
    <div className="min-w-0">
      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <LoopVideo clip={spec.clip} label={pick(spec.clip.alt, lang)} />
      </div>
    </div>
  );
}
