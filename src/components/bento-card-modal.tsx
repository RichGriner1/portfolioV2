"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import type { BentoCard } from "@/lib/content/case-studies";
import { pick, t, useLang } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  card: BentoCard;
};

export function BentoCardModal({ open, onClose, card }: Props) {
  const { lang } = useLang();
  const hasDetails = !!card.details;

  useEffect(() => {
    if (!hasDetails) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, hasDetails]);

  useEffect(() => {
    if (!hasDetails) return;
    if (open) {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        const storedTop = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(storedTop || "0") * -1);
      };
    }

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  }, [open, hasDetails]);

  if (!card.details) return null;

  const heading = pick(card.details.heading, lang);
  const sections = card.details.sections;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={heading}
            className="bg-card border-border fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-3xl border p-8 pb-10 shadow-xl"
            style={{ maxHeight: "85vh" }}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 className="text-foreground text-lg font-semibold">
                {heading}
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground shrink-0 text-xl leading-none transition-colors"
                aria-label={t("cv.close", lang)}
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {sections.map((section, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                    {pick(section.label, lang)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pick(section.body, lang)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
