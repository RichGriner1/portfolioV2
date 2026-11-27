"use client";

import { LoopVideo } from "@/components/case-study-story";
import { CLIPS, type ClipId } from "@/components/tpc/clips";
import { ScreenSlot } from "@/components/tpc/demos";
import { pick, useLang } from "@/lib/i18n";

/**
 * A screen recording of the prototype, or a dashed placeholder until it exists.
 * The recording is silent and loops only while it is on screen (LoopVideo).
 */
export function ClipSlot({ id }: { id: ClipId }) {
  const { lang } = useLang();
  const spec = CLIPS[id];
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
