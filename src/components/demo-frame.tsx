"use client";

import { useEffect, useState } from "react";

import { pick, useLang } from "@/lib/i18n";
import type { Bilingual } from "@/lib/i18n";

/**
 * A case study's live prototype, full screen, with one way back and, when the study
 * has one, a "Things to try" checklist. A product with no phone layout says so on a
 * phone before it loads, and lets the visitor carry on anyway.
 *
 * The prototype is a static export under /public that knows nothing about the site, so
 * it runs in an iframe and the site draws the controls over it. Dropping a new export
 * into the same folder keeps them.
 */
export function DemoFrame({
  slug,
  src,
  back,
  title,
  steps,
  desktopOnly,
}: {
  slug: string;
  src: string;
  back: string;
  title: Bilingual<string>;
  steps?: Bilingual<string>[];
  desktopOnly?: boolean;
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
      <div className="pointer-events-none fixed inset-x-3 bottom-5 flex items-end justify-center gap-2">
        <a
          href={back}
          className="bg-foreground text-background focus-visible:ring-ring pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium shadow-lg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
        >
          <span aria-hidden="true">←</span>
          {lang === "es" ? `Volver a ${name}` : `Back to ${name}`}
        </a>
        {steps?.length ? <DemoGuide slug={slug} steps={steps} /> : null}
      </div>
      {desktopOnly && <DesktopOnlySheet slug={slug} name={name} back={back} />}
    </div>
  );
}

/**
 * On a phone, a sheet over the demo: the product is built for a wide screen. The
 * visitor can still look; once they choose to, the sheet stays away for the visit.
 */
function DesktopOnlySheet({
  slug,
  name,
  back,
}: {
  slug: string;
  name: string;
  back: string;
}) {
  const { lang } = useLang();
  const es = lang === "es";
  const key = `demo-desktop-ok:${slug}`;
  const [show, setShow] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the viewport is only known on the client
    setShow(!seen && !window.matchMedia("(min-width: 768px)").matches);
  }, [key]);
  if (!show) return null;
  const go = () => {
    setShow(false);
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
  };
  return (
    <div
      className="bg-background/60 fixed inset-0 z-10 flex items-end backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="desktop-only-title"
    >
      <div className="bg-popover text-popover-foreground border-border w-full rounded-t-2xl border-t px-5 pt-6 pb-8 shadow-lg">
        <p id="desktop-only-title" className="text-base font-medium">
          {es ? "Pensado para escritorio" : "Built for desktop"}
        </p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {es
            ? `${name} es una herramienta de escritorio y no tiene versión para móvil. Puedes echar un vistazo, pero se ve y se usa mejor en una pantalla ancha.`
            : `${name} is a desktop tool with no phone layout. You can look around, but it reads and works best on a wide screen.`}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            autoFocus
            onClick={go}
            className="bg-foreground text-background focus-visible:ring-ring min-h-11 rounded-full px-4 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
          >
            {es ? "Continuar igualmente" : "Continue anyway"}
          </button>
          <a
            href={back}
            className="border-border focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
          >
            {es ? `Volver a ${name}` : `Back to ${name}`}
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Ticks live in this visitor's browser only, so a returning visitor picks up where
 * they left off. Storage can be missing (private windows, blocked site data), so
 * every read and write is guarded and the list works without it.
 */
function useTicks(slug: string, count: number) {
  const key = `demo-guide:${slug}`;
  const [done, setDone] = useState<boolean[]>(() => Array(count).fill(false));
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      if (Array.isArray(saved) && saved.length === count)
        // eslint-disable-next-line react-hooks/set-state-in-effect -- storage only exists on the client, after hydration
        setDone(saved.map(Boolean));
    } catch {}
  }, [key, count]);
  const save = (next: boolean[]) => {
    setDone(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };
  return [done, save] as const;
}

function DemoGuide({
  slug,
  steps,
}: {
  slug: string;
  steps: Bilingual<string>[];
}) {
  const { lang } = useLang();
  const es = lang === "es";
  const [done, setDone] = useTicks(slug, steps.length);
  // Open on wide screens, where the list sits beside the product; on a phone it
  // would cover the screen it describes, so it waits to be asked for.
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the viewport is only known on the client
    setOpen(window.matchMedia("(min-width: 768px)").matches);
  }, []);
  const n = done.filter(Boolean).length;
  const label = es ? "Qué probar" : "Things to try";

  return (
    <div className="pointer-events-auto">
      {open && (
        <div
          id="demo-guide"
          className="bg-popover text-popover-foreground border-border fixed inset-x-3 bottom-20 rounded-xl border p-4 shadow-lg md:inset-x-auto md:right-5 md:w-[340px]"
        >
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">{label}</p>
            {n > 0 && (
              <button
                type="button"
                onClick={() => setDone(steps.map(() => false))}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring min-h-6 rounded-sm text-xs focus-visible:ring-2 focus-visible:outline-none"
              >
                {es ? "Empezar de nuevo" : "Start over"}
              </button>
            )}
          </div>
          <ol className="flex max-h-[50vh] flex-col gap-1 overflow-y-auto">
            {steps.map((s, i) => (
              <li key={i}>
                <label className="hover:bg-muted flex cursor-pointer gap-3 rounded-md p-2 text-[13px] leading-snug">
                  <input
                    type="checkbox"
                    checked={done[i]}
                    onChange={() =>
                      setDone(done.map((d, j) => (j === i ? !d : d)))
                    }
                    className="accent-primary mt-0.5 size-4 shrink-0"
                  />
                  <span
                    className={
                      done[i] ? "text-muted-foreground line-through" : undefined
                    }
                  >
                    {pick(s, lang)}
                  </span>
                </label>
              </li>
            ))}
          </ol>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="demo-guide"
        onClick={() => setOpen(!open)}
        className="bg-popover text-popover-foreground border-border focus-visible:ring-ring inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium whitespace-nowrap shadow-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        {label}
        <span className="text-muted-foreground tabular-nums">
          {n}/{steps.length}
        </span>
      </button>
    </div>
  );
}
