"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { EASE_SOFT } from "@/components/motion/constants";
import { DotToggle } from "@/components/motion/crab-dots";
import { t, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The board's navigation, using the site header's own open/close move.
 *
 * The rail used to be a plain pill of buttons — the one piece of the canvas that was
 * just UI, while everything around it earned its place in the metaphor. This is the
 * header's animation reused: it grows sideways into a toolbar, with the same mark,
 * the same easing, and the same three-step dissolve on the icon.
 *
 * It is fixed to the VIEWPORT, never to the board. That's the guarantee that the
 * site is navigable without anyone discovering that the canvas pans, and on touch —
 * where the board can't be dragged at all — it's the only way through.
 *
 * Only the WIDTH beat is borrowed. The header's panel also grows downward because it
 * stacks links; this is a single row, so a height beat would animate nothing.
 */

/**
 * The group of destinations is what animates, not the bar around it.
 *
 * An earlier pass put an animated `maxWidth` on the container instead. That works
 * only if the closed value happens to equal the collapsed content's exact width —
 * anything larger and the first destination button peeks out, anything smaller and
 * the mark gets clipped. Animating the group and letting the bar size to its content
 * means the closed state is measured by the browser rather than guessed at, and the
 * bar can't disagree with what's inside it.
 */
const GROUP = {
  closed: {
    maxWidth: 0,
    opacity: 0,
    transition: {
      maxWidth: { duration: 0.3, ease: EASE_SOFT },
      opacity: { duration: 0.12 },
    },
  },
  open: {
    // A ceiling above the natural width, not the width itself.
    maxWidth: 640,
    opacity: 1,
    transition: {
      maxWidth: { duration: 0.34, ease: EASE_SOFT },
      opacity: { duration: 0.16, delay: 0.08 },
    },
  },
} as const;

/** The "Menu" label, which trades places with the destinations. */
const LABEL = {
  closed: {
    maxWidth: 64,
    opacity: 1,
    marginLeft: 8,
    transition: { duration: 0.28, ease: EASE_SOFT, delay: 0.06 },
  },
  open: {
    maxWidth: 0,
    opacity: 0,
    marginLeft: 0,
    transition: { duration: 0.2, ease: EASE_SOFT },
  },
} as const;

export type RailStop = { id: string; label: string };

export function CanvasRail({
  stops,
  active,
  onSelect,
}: {
  stops: RailStop[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const { lang } = useLang();
  /**
   * Closed on arrival.
   *
   * It opened itself at first, on the theory that a visitor with two minutes
   * shouldn't have to find the navigation. Richard's call is the other way, and it's
   * the better one for this page: the board's whole job in those two minutes is the
   * claim and the work, and a toolbar sitting open over it is the one thing
   * competing for that attention. A labelled mark says "navigation is here" without
   * taking the frame.
   */
  const [open, setOpen] = useState(false);
  /**
   * Whether hover is a thing this device does. Set from the same media query the
   * board uses to decide it can be panned.
   */
  const [hoverable, setHoverable] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setHoverable(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /**
   * Hover opens it; the click stays.
   *
   * Asking for a click to see three destinations is a toll on the one control that
   * exists to make the board easy — you pay it before you know whether you wanted
   * the menu. Hovering costs nothing and is undone by moving away, so the rail can
   * answer "what's on this board" for the price of passing over it.
   *
   * The listeners sit on the BAR, not on the mark. Opening grows the bar sideways
   * and slides the mark out from under the pointer, so a mark-scoped `pointerleave`
   * would fire the instant it opened and chatter open/closed. The bar only ever
   * grows, so the pointer that triggered it is still inside afterwards.
   *
   * The click toggle is untouched. Touch has no hover and the rail is the ONLY way
   * through there, so the tap has to keep working; it's also what a keyboard user
   * activates. `hoverable` gates the hover half rather than the tap, which means a
   * tap never has to compete with a synthesised mouse event.
   */
  const hover = hoverable
    ? {
        onPointerEnter: () => setOpen(true),
        onPointerLeave: () => {
          /**
           * Not while a tool's dropdown is up.
           *
           * Theme and language are menus, and an open menu covers the page with its
           * own dismiss layer — so the pointer moving into it registers as leaving
           * the bar. Collapsing on that would shrink the bar out from under the
           * popup it is anchored to, and the menu would slide sideways while the
           * visitor was reading it. `aria-expanded` on the trigger is the state
           * both toggles already publish, so nothing new has to be tracked.
           */
          if (bar.current?.querySelector('[data-tools] [aria-expanded="true"]'))
            return;
          setOpen(false);
        },
      }
    : {};

  return (
    // `fixed`, not `absolute`. The rail now sits outside the board — it's shared by
    // the board and the stacked mobile layout — so there's no positioned ancestor to
    // hang off. Absolute would pin it to the bottom of the DOCUMENT, which on a
    // scrolling phone page means it disappears after the first screen.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center p-4">
      {/* One object, not a box inside a box. The toggle is a plain content row with
          no surface of its own — the bar is the only thing drawing a border, a
          radius and a shadow. Nesting a second rounded box inside it for the mark is
          what made the collapsed state read as a frame around an icon. */}
      <div
        ref={bar}
        {...hover}
        data-rail
        // `max-w-[calc(100vw-2rem)]` bounds the bar to the viewport minus the p-4
        // gutter. Open, the destinations come to ~432px, which runs 93px off the
        // edge of a 390px phone — the responsive gate caught "Blog" at 358→408 and
        // "Contact" at 412→483. The group scrolls inside the bar instead.
        className="border-border pointer-events-auto relative flex w-fit max-w-[calc(100vw-2rem)] items-center gap-1 overflow-hidden rounded-2xl border p-2 shadow-lg"
      >
        {/* The glass, as a separate layer rather than `backdrop-blur` on the bar
            itself — the same call site-header.tsx makes, and for the same reason it
            documents: `backdrop-filter` turns an element into the containing block
            for fixed descendants, so putting it on the bar would trap any `fixed`
            child inside these few hundred pixels. Values match the header
            (`bg-background/70`, `backdrop-blur-md`) so the two read as one material. */}
        <div
          aria-hidden
          className="bg-background/70 absolute inset-0 -z-10 backdrop-blur-md"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t(open ? "nav.menu_close" : "nav.menu_open", lang)}
          className="text-foreground flex shrink-0 items-center rounded-xl px-2 py-1.5"
        >
          <DotToggle open={open} className="w-5 shrink-0" />
          <motion.span
            initial={false}
            animate={open ? "open" : "closed"}
            variants={LABEL}
            className="overflow-hidden font-mono text-[11px] whitespace-nowrap"
          >
            {t("nav.menu", lang)}
          </motion.span>
        </button>

        {/* Mounted while closed so the width animation has something to reveal, but
            out of the tab order and the accessibility tree — otherwise the board's
            navigation is reachable by keyboard at a moment when it's invisible. */}
        <motion.div
          initial={false}
          animate={open ? "open" : "closed"}
          variants={GROUP}
          aria-hidden={!open}
          className={cn(
            // `overflow-x-auto` rather than `overflow-hidden`: the bar is capped to
            // the viewport, so on a narrow screen the destinations have to be
            // reachable by scrolling rather than simply cut off. Collapsing still
            // works — a maxWidth of 0 is 0 whatever the overflow rule.
            "flex items-center gap-1 overflow-x-auto",
            !open && "pointer-events-none"
          )}
        >
          {stops.map((s) => (
            <button
              key={s.id}
              type="button"
              // The board's equivalent of a home link: it returns to the origin,
              // where the claim is. There's no `a[href="/"]` on this page because
              // you're already on `/` — the responsive check looks for this marker
              // instead of assuming navigation always lives in an anchor.
              data-nav-home={s.id === "home" ? "" : undefined}
              tabIndex={open ? 0 : -1}
              onClick={() => onSelect(s.id)}
              className={cn(
                "rounded-xl px-3 py-2 font-mono text-[11px] whitespace-nowrap transition-colors",
                active === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Tools, outside the collapse.
         *
         * Theme and language used to be a section ON the board, which put chrome you
         * operate in the same place as content you look at — changing a toggle meant
         * panning across a canvas to reach it. A toolbar is where controls belong,
         * and it's the split Figma itself makes: canvas holds content, toolbar holds
         * tools.
         *
         * They stay visible while the destinations are collapsed, because they're
         * utilities somebody might want without opening navigation — the same reason
         * the site header keeps them in its bar rather than behind its menu. The
         * components are the header's, unchanged: both are already dropdowns. */}
        <div
          aria-hidden
          className="bg-border mx-1 h-6 w-px shrink-0 self-center"
        />
        {/* `data-tools` is what the hover close reads to tell "the pointer moved
            into a menu I opened" from "the pointer left". */}
        <div data-tools className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <LangToggle />
        </div>
      </div>
    </div>
  );
}
