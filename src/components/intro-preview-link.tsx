"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PreviewCard } from "@base-ui/react/preview-card";

import { CardMedia } from "@/components/work-card";
import { KIND_LABELS, WORK } from "@/lib/content/work";
import { pick, useLang } from "@/lib/i18n";

/**
 * An inline link in the intro prose that shows the linked project's thumbnail
 * on hover — the Figma tab-preview pattern.
 *
 * Takes a slug rather than an href so the link target and the preview media
 * come from the same WORK entry and can't disagree. The thumbnail is the real
 * `CardMedia`, so the preview is literally the tile you'd land on.
 *
 * Base UI's PreviewCard portals the popup, which matters here: the bento's
 * intro tile is `overflow-hidden`, so an in-flow popover would be clipped by
 * its own parent. Hover and keyboard focus both open it; on touch there's no
 * hover, so the link just navigates, same as Figma.
 */
export function IntroPreviewLink({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const { lang } = useLang();
  const item = WORK.find((w) => w.slug === slug);
  if (!item) throw new Error(`IntroPreviewLink: unknown slug ${slug}`);

  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        render={
          <Link
            href={item.href}
            className="text-foreground decoration-muted-foreground/70 hover:decoration-foreground underline decoration-dotted underline-offset-4 transition-colors"
          />
        }
      >
        {children}
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner side="top" sideOffset={8} collisionPadding={12}>
          {/* 380px is not arbitrary: the loop-vs-skill figure is authored on a
              300×190 canvas and brings its own p-5 frame, so the scene needs
              380 − 24 (this popup's inset) − 40 (the figure's) = 316px to avoid
              clipping its nodes. At 264px it was cut off, same failure as the
              1×1 bento tile. */}
          {/* popup-extrude is the shared panel-enter (see globals.css) — the
              Coherence menu animation, direction driven by data-side. */}
          {/* font-geist is set here explicitly, not inherited. The Portal mounts
              to document.body, so this popup renders OUTSIDE `main.bento-frame`
              and never sees that scope's font override — the labels below came
              out in Roboto. Same reason the radii are spelled as literals: the
              scope's --radius tweak doesn't reach here either. */}
          <PreviewCard.Popup className="popup-extrude border-border bg-card font-geist w-[380px] overflow-hidden rounded-[16px] border p-3 shadow-lg">
            {/* No border here on purpose. CardMedia already frames its own
                content (video and figure panels, the glyph's bordered box), so
                a border on this wrapper made three concentric frames. Rounding
                stays, so an item's bgColor fills a rounded rect behind it. */}
            {/* Square, not landscape. The card media is square-authored (1080²
                videos, and the Mindfulme glyph is a video on object-cover), so
                a landscape frame made object-cover crop the top and bottom. A
                square frame matches the source, so there is nothing to crop —
                and it still leaves the loop figure its 316px of width. */}
            <div
              className="relative aspect-square overflow-hidden rounded-[12px]"
              style={
                item.bgColor ? { backgroundColor: item.bgColor } : undefined
              }
            >
              <CardMedia item={item} lang={lang} />
            </div>
            <div className="flex flex-col gap-0.5 px-1 pt-3 pb-1">
              <span className="text-muted-foreground text-[10px] font-medium">
                {pick(KIND_LABELS[item.kind], lang)}
              </span>
              <span className="text-foreground text-sm font-bold tracking-tight">
                {pick(item.title, lang)}
              </span>
            </div>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}
