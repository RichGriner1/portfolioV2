"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { eventMatches } from "@/lib/content/demo-guides";
import type { GuideHint, GuideStep } from "@/lib/content/demo-guides";
import { pick, useLang } from "@/lib/i18n";
import type { Bilingual } from "@/lib/i18n";

/**
 * A case study's live prototype, full screen, with one way back and, when the study
 * has one, a task list. A product with no phone layout says so on a phone before it
 * loads, and lets the visitor carry on anyway.
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
  steps?: GuideStep[];
  desktopOnly?: boolean;
}) {
  const { lang } = useLang();
  const name = pick(title, lang);
  const frame = useRef<HTMLIFrameElement>(null);
  return (
    <div className="bg-background fixed inset-0 z-50">
      <iframe
        ref={frame}
        src={src}
        title={lang === "es" ? `Demo de ${name}` : `${name} demo`}
        className="h-full w-full border-0"
      />
      {/* Left on a phone, so the task pill has the bottom-right corner to itself. */}
      <a
        href={back}
        className="bg-foreground text-background focus-visible:ring-ring fixed bottom-5 left-3 inline-flex min-h-10 max-w-[calc(100vw-160px)] items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium shadow-lg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none md:left-1/2 md:max-w-none md:-translate-x-1/2"
      >
        <span aria-hidden="true">←</span>
        {lang === "es" ? `Volver a ${name}` : `Back to ${name}`}
      </a>
      {steps?.length ? (
        <DemoGuide slug={slug} steps={steps} frame={frame} />
      ) : null}
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
      className="bg-background/60 fixed inset-0 z-20 flex items-end backdrop-blur-sm"
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
 * What a visitor's list remembers between visits: ticks, open or collapsed, and where
 * they dragged it. It lives in their browser only. Storage can be missing (private
 * windows, blocked site data), so every read and write is guarded and the list works
 * without it.
 */
type Saved = { done: boolean[]; open: boolean; x: number; y: number };

function load(key: string, count: number): Partial<Saved> | null {
  try {
    const s = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!s || typeof s !== "object") return null;
    return {
      done:
        Array.isArray(s.done) && s.done.length === count
          ? s.done.map(Boolean)
          : undefined,
      open: typeof s.open === "boolean" ? s.open : undefined,
      x: Number.isFinite(s.x) ? s.x : undefined,
      y: Number.isFinite(s.y) ? s.y : undefined,
    };
  } catch {
    return null;
  }
}

/** The gap between the list and the screen edge it rests on, in px. */
const EDGE = 12;

/**
 * The task list. It rests in the bottom-right corner, collapses to a "Tasks n/m" pill,
 * and can be dragged anywhere by its header or by the pill. A step ticks itself when
 * the demo reports the action (see `when` in demo-guides.ts), and the next open step
 * pulses so the eye knows where to go.
 */
function DemoGuide({
  slug,
  steps,
  frame,
}: {
  slug: string;
  steps: GuideStep[];
  frame: React.RefObject<HTMLIFrameElement | null>;
}) {
  const { lang } = useLang();
  const es = lang === "es";
  const key = `demo-guide:${slug}`;
  const box = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));
  const [open, setOpen] = useState(false);
  // Offset from the bottom-right corner, in px. 0, 0 is the resting place.
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [flash, setFlash] = useState(false);
  // Dimmed while the visitor works in the product, so the list stays out of the way.
  // It comes back on hover, when a step ticks, or after a few quiet seconds.
  const [idle, setIdle] = useState(false);
  const [hover, setHover] = useState(false);
  // Nothing is saved until the saved state has been read, or the first save would
  // overwrite it with the defaults.
  const [hydrated, setHydrated] = useState(false);
  const ready = useRef(false);

  useEffect(() => {
    if (ready.current) return;
    ready.current = true;
    const s = load(key, steps.length);
    /* eslint-disable react-hooks/set-state-in-effect -- storage and the viewport only exist on the client */
    if (s?.done) setDone(s.done);
    if (s?.x !== undefined && s?.y !== undefined) setPos({ x: s.x, y: s.y });
    // Open the first time on a wide screen, where it sits beside the product. On a
    // phone it would cover the screen it describes, so it waits as a pill.
    setOpen(s?.open ?? window.matchMedia("(min-width: 768px)").matches);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [key, steps.length]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ done, open, x: pos.x, y: pos.y })
      );
    } catch {}
  }, [hydrated, key, done, open, pos]);

  // The demo posts `{ demoEvent }` for what the visitor just did.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const ev = (e.data as { demoEvent?: unknown } | null)?.demoEvent;
      if (typeof ev !== "string") return;
      setDone((prev) => {
        const next = prev.map(
          (d, i) => d || steps[i].when.some((w) => eventMatches(ev, w))
        );
        if (next.some((d, i) => d !== prev[i])) {
          setFlash(true);
          return next;
        }
        return prev;
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [steps]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 1600);
    return () => clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    let doc: Document | null = null;
    let quiet: ReturnType<typeof setTimeout> | undefined;
    const busy = () => {
      setIdle(true);
      clearTimeout(quiet);
      quiet = setTimeout(() => setIdle(false), 4000);
    };
    const EVENTS = ["pointerdown", "keydown", "wheel"] as const;
    // The demo can swap its document (a reload, a new screen), so re-attach to
    // whichever one is showing.
    const attach = () => {
      let d: Document | null = null;
      try {
        d = frame.current?.contentDocument ?? null;
      } catch {}
      if (d === doc) return;
      EVENTS.forEach((e) => doc?.removeEventListener(e, busy));
      doc = d;
      EVENTS.forEach((e) => doc?.addEventListener(e, busy, { passive: true }));
    };
    attach();
    const id = setInterval(attach, 1000);
    return () => {
      clearInterval(id);
      clearTimeout(quiet);
      EVENTS.forEach((e) => doc?.removeEventListener(e, busy));
    };
  }, [frame]);

  // Keep the list on screen: after a drag, a resize, or opening near an edge.
  const clamp = useCallback((p: { x: number; y: number }) => {
    const el = box.current;
    if (!el) return p;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    return {
      x: Math.max(0, Math.min(p.x, window.innerWidth - w - 2 * EDGE)),
      y: Math.max(0, Math.min(p.y, window.innerHeight - h - 2 * EDGE)),
    };
  }, []);
  useEffect(() => {
    const fit = () => setPos((p) => clamp(p));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [clamp, open]);

  // Dragging. A press that barely moves is a click, so the pill still opens.
  const drag = useRef<{
    sx: number;
    sy: number;
    px: number;
    py: number;
    moved: boolean;
  } | null>(null);
  const onDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      px: pos.x,
      py: pos.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    d.moved = true;
    setPos(clamp({ x: d.px - dx, y: d.py - dy }));
  };
  const onUp = () => {
    const moved = drag.current?.moved;
    drag.current = null;
    return moved;
  };

  const n = done.filter(Boolean).length;
  const next = done.indexOf(false);
  const label = es ? "Tareas" : "Tasks";
  const count = (
    <span className="text-muted-foreground tabular-nums">
      {n}/{steps.length}
    </span>
  );

  const glass =
    "bg-popover/75 text-popover-foreground border-border border shadow-lg backdrop-blur-xl";
  const morph =
    "origin-bottom-right transition-[opacity,transform] duration-base ease-spring motion-reduce:transition-none";
  const hiddenPiece =
    "pointer-events-none absolute right-0 bottom-0 scale-75 opacity-0";

  return (
    <>
      {next >= 0 && <Spotlight frame={frame} hints={steps[next].hints} />}
      <div
        ref={box}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className={`ease-out-soft duration-base fixed z-10 transition-opacity ${idle && !hover && !flash ? "opacity-50" : ""}`}
        style={{ right: EDGE + pos.x, bottom: EDGE + 8 + pos.y }}
      >
        <div
          id="demo-guide"
          role="region"
          aria-label={label}
          inert={!open}
          className={`${glass} ${morph} w-[min(320px,calc(100vw-24px))] rounded-xl ${open ? "" : hiddenPiece}`}
        >
          <div
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            className="flex cursor-grab touch-none items-center gap-2 px-4 pt-3 pb-2 select-none active:cursor-grabbing"
          >
            <span
              aria-hidden="true"
              className="text-muted-foreground -ml-1 text-xs leading-none"
            >
              ⠿
            </span>
            <p className="text-sm font-medium">{label}</p>
            {count}
            <span className="flex-1" />
            {n > 0 && (
              <button
                type="button"
                data-no-drag
                onClick={() => setDone(steps.map(() => false))}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring min-h-6 rounded-sm px-1 text-xs focus-visible:ring-2 focus-visible:outline-none"
              >
                {es ? "Empezar de nuevo" : "Start over"}
              </button>
            )}
            <button
              type="button"
              data-no-drag
              aria-expanded
              aria-controls="demo-guide"
              aria-label={es ? "Plegar las tareas" : "Collapse tasks"}
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
            >
              <span aria-hidden="true" className="text-base leading-none">
                −
              </span>
            </button>
          </div>
          <ol className="flex max-h-[45vh] flex-col gap-0.5 overflow-y-auto px-2 pb-2">
            {steps.map((s, i) => (
              <li key={i}>
                <label
                  className={`hover:bg-muted flex cursor-pointer gap-3 rounded-md p-2 text-[13px] leading-snug ${i === next ? "bg-muted" : ""}`}
                >
                  <span className="relative mt-0.5 flex size-4 shrink-0">
                    {i === next && (
                      <span
                        aria-hidden="true"
                        className="bg-primary/40 absolute inset-0 rounded-full motion-safe:animate-ping"
                      />
                    )}
                    <input
                      type="checkbox"
                      checked={done[i]}
                      onChange={() =>
                        setDone(done.map((d, j) => (j === i ? !d : d)))
                      }
                      className="accent-primary relative size-4"
                    />
                  </span>
                  <span
                    className={`duration-base transition-colors ${done[i] ? "text-muted-foreground line-through" : ""}`}
                  >
                    {pick(s, lang)}
                  </span>
                </label>
              </li>
            ))}
          </ol>
          {next === -1 && (
            <p className="text-muted-foreground border-border border-t px-4 py-2.5 text-xs">
              {es
                ? "Todo hecho. Gracias por probarlo."
                : "All done. Thanks for trying it."}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-expanded={false}
          inert={open}
          tabIndex={open ? -1 : 0}
          aria-controls="demo-guide"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={(e) => {
            if (!onUp()) setOpen(true);
            e.preventDefault();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className={`${glass} ${morph} focus-visible:ring-ring inline-flex min-h-10 cursor-grab touch-none items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium whitespace-nowrap select-none focus-visible:ring-2 focus-visible:outline-none ${flash ? "ring-primary ring-2" : ""} ${open ? hiddenPiece : ""}`}
        >
          {label}
          {count}
        </button>
      </div>
    </>
  );
}

/**
 * Find the control a hint points at inside the demo. `inView` keeps to what is on
 * screen; the spotlight asks for that first and only then for anything scrolled away.
 */
function findHint(
  doc: Document,
  hints: GuideHint[],
  inView: boolean
): Element | null {
  const vh = doc.defaultView?.innerHeight ?? 0;
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    if (inView && (r.bottom < 0 || r.top > vh)) return false;
    if ((el as HTMLButtonElement).disabled) return false;
    if (el.getAttribute("aria-disabled") === "true") return false;
    return doc.defaultView?.getComputedStyle(el).visibility !== "hidden";
  };
  const text = (el: Element) =>
    ((el as HTMLElement).innerText || el.getAttribute("aria-label") || "")
      .trim()
      .split("\n")[0]
      .trim();
  const CLICKABLE =
    "button, a, [role=button], [role=tab], [role=menuitem], [role=option], [role=radio], label";
  const headings = [...doc.querySelectorAll("h1, h2")].map((h) =>
    (h as HTMLElement).innerText.trim()
  );
  for (const { on, click } of hints) {
    if (on && !headings.some((h) => h.startsWith(on))) continue;
    const [kind, rest] =
      click.includes(":") && /^(css|row|tab|dialog):/.test(click)
        ? [
            click.slice(0, click.indexOf(":")),
            click.slice(click.indexOf(":") + 1),
          ]
        : ["text", click];
    let found: Element | undefined;
    if (kind === "css") {
      found = [...doc.querySelectorAll(rest)]
        .map((el) => (visible(el) ? el : el.closest("label")))
        .find((el): el is Element => !!el && visible(el));
    } else if (kind === "row") {
      const [inRow, btn] = rest.split(">");
      const row = [...doc.querySelectorAll("tr, [role=row], li")].find(
        (el) => visible(el) && (el as HTMLElement).innerText.includes(inRow)
      );
      found =
        row && btn
          ? [...row.querySelectorAll(CLICKABLE)].find(
              (el) => visible(el) && text(el).startsWith(btn)
            )
          : row;
    } else if (kind === "tab") {
      found = [...doc.querySelectorAll("[role=tab]")].find(
        (el) => visible(el) && text(el).startsWith(rest)
      );
    } else if (kind === "dialog") {
      found = [
        ...doc.querySelectorAll("dialog[open] button, [role=dialog] button"),
      ].find((el) => visible(el) && text(el).startsWith(rest));
    } else {
      const exact = rest.startsWith("=");
      const want = exact ? rest.slice(1) : rest;
      found = [...doc.querySelectorAll(CLICKABLE)].find(
        (el) =>
          visible(el) && (exact ? text(el) === want : text(el).startsWith(want))
      );
    }
    if (found) return found;
  }
  return null;
}

/**
 * A pulsing ring over the control the next task needs, drawn over the demo (the
 * product is another document, so the ring lives here and follows the control as the
 * demo scrolls and changes screens). The ring never takes a click. When the control
 * is scrolled out of view, an arrow on that edge pulses instead and scrolls to it.
 */
function Spotlight({
  frame,
  hints,
}: {
  frame: React.RefObject<HTMLIFrameElement | null>;
  hints: GuideHint[];
}) {
  const { lang } = useLang();
  const [box, setBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    off: "up" | "down" | null;
  } | null>(null);
  const target = useRef<Element | null>(null);
  useEffect(() => {
    const tick = () => {
      const f = frame.current;
      let doc: Document | null = null;
      try {
        doc = f?.contentDocument ?? null;
      } catch {}
      const el = doc
        ? (findHint(doc, hints, true) ?? findHint(doc, hints, false))
        : null;
      target.current = el;
      if (!f || !el) return setBox(null);
      const fr = f.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const off: "up" | "down" | null =
        r.bottom < 0 ? "up" : r.top > fr.height ? "down" : null;
      setBox((b) => {
        const n = {
          x: fr.left + r.left,
          y: fr.top + r.top,
          w: r.width,
          h: r.height,
          off,
        };
        return b &&
          b.x === n.x &&
          b.y === n.y &&
          b.w === n.w &&
          b.h === n.h &&
          b.off === n.off
          ? b
          : n;
      });
    };
    tick();
    const id = setInterval(tick, 300);
    return () => clearInterval(id);
  }, [frame, hints]);
  if (!box) return null;
  if (box.off) {
    const es = lang === "es";
    return (
      <button
        type="button"
        onClick={() =>
          target.current?.scrollIntoView({
            block: "center",
            behavior: "smooth",
          })
        }
        aria-label={es ? "Ir al siguiente paso" : "Go to the next step"}
        className={`bg-spotlight text-primary-foreground focus-visible:ring-ring fixed left-1/2 z-[5] inline-flex size-10 -translate-x-1/2 items-center justify-center rounded-full shadow-lg focus-visible:ring-2 focus-visible:outline-none motion-safe:animate-bounce ${box.off === "down" ? "bottom-20" : "top-4"}`}
      >
        <span aria-hidden="true">{box.off === "down" ? "↓" : "↑"}</span>
      </button>
    );
  }
  const pad = 4;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[5] rounded-lg"
      style={{
        left: box.x - pad,
        top: box.y - pad,
        width: box.w + 2 * pad,
        height: box.h + 2 * pad,
      }}
    >
      <span className="bg-spotlight/15 absolute inset-0 rounded-lg motion-safe:animate-pulse" />
      <span className="ring-spotlight absolute inset-0 rounded-lg ring-2 motion-safe:animate-pulse" />
    </div>
  );
}
