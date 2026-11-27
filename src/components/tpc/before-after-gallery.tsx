"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { Maximize2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StillFrame } from "@/components/tpc/clip-slot";
import type { Still } from "@/components/tpc/clips";
import { Reveal } from "@/components/tpc/reveal";
import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Shot = { label: Bilingual<string>; still: Still };

/**
 * Before and after side by side; either one opens a full-screen viewer where the
 * two can be flipped in place (buttons, arrow keys or a swipe), so the change
 * reads at the size the screen was designed for.
 */
export function BeforeAfterGallery({
  shots,
  title,
}: {
  shots: Shot[];
  title: Bilingual<string>;
}) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const swipeX = useRef<number | null>(null);

  const show = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + shots.length) % shots.length);

  const expand = lang === "es" ? "Ampliar" : "Expand";
  const current = shots[index];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {shots.map((s, i) => (
          <Reveal key={s.still.src} index={i}>
            <figure className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => show(i)}
                aria-label={`${expand}: ${pick(s.label, lang)}`}
                className="group focus-visible:ring-ring/50 relative block cursor-zoom-in rounded-xl text-left outline-none focus-visible:ring-3"
              >
                <StillFrame
                  still={s.still}
                  sizes="(min-width: 768px) 480px, 100vw"
                />
                <span
                  aria-hidden
                  className="bg-background/90 text-foreground border-border ease-out-soft absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium opacity-0 shadow-sm transition-opacity duration-[var(--duration-base)] group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                >
                  <Maximize2 className="size-3.5" />
                  {expand}
                </span>
              </button>
              <figcaption className="text-muted-foreground font-mono text-xs">
                {pick(s.label, lang)}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="bg-background ease-out-soft fixed inset-0 z-50 transition-opacity duration-[var(--duration-enter)] data-[ending-style]:opacity-0 data-[ending-style]:duration-[var(--duration-close)] data-[starting-style]:opacity-0" />
          <Dialog.Popup
            className="ease-out-soft fixed inset-0 z-50 flex flex-col gap-4 p-4 transition-[opacity,scale] duration-[var(--duration-enter)] outline-none data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:duration-[var(--duration-close)] data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 sm:p-8"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Dialog.Title className="text-base font-semibold">
                {pick(title, lang)}
              </Dialog.Title>
              <div className="flex items-center gap-2">
                <div
                  role="group"
                  aria-label={lang === "es" ? "Versión" : "Version"}
                  className="bg-card border-border flex gap-1 rounded-xl border p-1"
                >
                  {shots.map((s, i) => (
                    <button
                      key={s.still.src}
                      type="button"
                      aria-pressed={i === index}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "ease-out-soft cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs transition-colors duration-[var(--duration-base)]",
                        i === index
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {pick(s.label, lang)}
                    </button>
                  ))}
                </div>
                <Dialog.Close
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={lang === "es" ? "Cerrar" : "Close"}
                    />
                  }
                >
                  <X />
                </Dialog.Close>
              </div>
            </div>
            <div
              className="relative min-h-0 flex-1 touch-manipulation"
              onPointerDown={(e) => {
                swipeX.current = e.clientX;
              }}
              onPointerUp={(e) => {
                if (swipeX.current === null) return;
                const dx = e.clientX - swipeX.current;
                swipeX.current = null;
                if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
              }}
            >
              <Image
                key={current.still.src}
                src={current.still.src}
                alt={pick(current.still.alt, lang)}
                fill
                sizes="100vw"
                className="animate-in fade-in object-contain duration-[var(--duration-base)]"
              />
            </div>
            <p className="text-muted-foreground text-center text-xs">
              {lang === "es"
                ? "Flechas o deslizar para cambiar · Esc para cerrar"
                : "Arrow keys or swipe to switch · Esc to close"}
            </p>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
