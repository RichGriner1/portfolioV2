"use client";

import { useRef } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Still } from "@/components/tpc/clips";
import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type Shot = { label: Bilingual<string>; still: Still };

/**
 * The full-screen viewer on its own, so anything that shows a before and an
 * after (the side-by-side pair, the diagnostic player) can open it.
 */
export function GalleryViewer({
  shots,
  title,
  open,
  onOpenChange,
  index,
  onIndexChange,
}: {
  shots: Shot[];
  title: Bilingual<string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: number;
  onIndexChange: (i: number) => void;
}) {
  const { lang } = useLang();
  const swipeX = useRef<number | null>(null);
  const go = (dir: 1 | -1) =>
    onIndexChange((index + dir + shots.length) % shots.length);
  const setIndex = onIndexChange;
  const setOpen = onOpenChange;
  const current = shots[index];
  return (
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
                      "ease-out-soft relative isolate cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs transition-colors duration-[var(--duration-base)]",
                      i === index
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {i === index && (
                      // The pill slides to the chosen version.
                      <motion.span
                        layoutId="ba-version-pill"
                        aria-hidden
                        className="bg-foreground absolute inset-0 -z-10 rounded-lg"
                        transition={{ duration: DURATION.base, ease: EASE }}
                      />
                    )}
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
  );
}
