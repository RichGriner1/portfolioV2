"use client";

import { pick, useLang } from "@/lib/i18n";
import type { Bilingual } from "@/lib/i18n";

/**
 * A case study's live prototype, full screen, with one way back.
 *
 * The prototype is a static export under /public that knows nothing about the site, so
 * it runs in an iframe and the site draws the back link over it. Dropping a new export
 * into the same folder keeps the back link.
 */
export function DemoFrame({
  src,
  back,
  title,
}: {
  src: string;
  back: string;
  title: Bilingual<string>;
}) {
  const { lang } = useLang();
  const name = pick(title, lang);
  return (
    <div className="bg-background fixed inset-0 z-50">
      <iframe
        src={src}
        title={lang === "es" ? `Demo de ${name}` : `${name} demo`}
        className="h-full w-full border-0"
      />
      <a
        href={back}
        className="bg-foreground text-background focus-visible:ring-ring fixed bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium shadow-lg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
      >
        <span aria-hidden="true">←</span>
        {lang === "es" ? `Volver a ${name}` : `Back to ${name}`}
      </a>
    </div>
  );
}
