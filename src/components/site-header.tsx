"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { BlurFade } from "@/components/motion/blur-fade";
import { EASE_SOFT } from "@/components/motion/constants";
import { CrabDots, DotToggle } from "@/components/motion/crab-dots";
import { CvModal } from "@/components/cv-modal";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { t, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", key: "nav.home" as const },
  { href: "/projects", key: "nav.projects" as const },
  { href: "/writing", key: "nav.writing" as const },
];

/**
 * The bar the panel grows from: the header row's height, and just wide enough to sit
 * around the mark's 32px hit area. Growing from a square rather than from zero is
 * what makes the first beat read as a bar expanding rather than a box scaling.
 */
const BAR = 56;

/**
 * Two beats, in both directions. Opening: the bar grows sideways, then down 240ms
 * later. Closing: height collapses first and the bar follows 180ms behind, so the
 * panel retreats the way it arrived instead of shrinking diagonally. Opacity only
 * fades at the very end of the close, while the bar is still visibly shrinking.
 *
 * `maxWidth` is animated, not `width`. The panel's real width has to stay
 * CSS-driven — `min(19rem, 100%)`, so it never exceeds a 320px viewport — and
 * `width: "auto"` on a block just stretches to the parent, which grew the bar to the
 * full 976px content width instead of the panel's 304px. Capping with maxWidth
 * animates the same visual and leaves the responsive width alone. The open value is
 * only a ceiling above the natural width, not the width itself.
 */
const PANEL = {
  closed: {
    maxWidth: BAR,
    height: BAR,
    opacity: 0,
    transition: {
      height: { duration: 0.24, ease: EASE_SOFT },
      maxWidth: { duration: 0.26, delay: 0.18, ease: EASE_SOFT },
      opacity: { duration: 0.12, delay: 0.36 },
    },
  },
  open: {
    maxWidth: 480,
    height: "auto",
    opacity: 1,
    transition: {
      opacity: { duration: 0.1 },
      maxWidth: { duration: 0.3, ease: EASE_SOFT },
      height: { duration: 0.36, delay: 0.24, ease: EASE_SOFT },
    },
  },
} as const;

/** Same set the footer carries — Richard wants them in both places. */
const RESOURCES = [
  { href: "https://www.linkedin.com/in/richardgriner", label: "LinkedIn" },
  { href: "https://x.com/poppa_richhh", label: "X" },
  { href: "mailto:richardgrinerdesigns@gmail.com", key: "nav.email" as const },
];

/**
 * One header for every page, and one menu for every breakpoint.
 *
 * The nav used to live in the bar on desktop and behind a menu on mobile. It's the
 * menu everywhere now: the bar carries only the mark and the two toggles, and
 * Home / Projects / Writing / CV plus a Resources group live in a panel.
 *
 * Sides are deliberately mirrored. The mark sits top-RIGHT below `sm` — a phone is
 * held one-handed and the reachable corner is the thumb's side — and top-LEFT from
 * `sm` up, where it also carries the hover wordmark, so the left is not empty. The
 * panel hangs off whichever corner the mark is in.
 *
 * The mark's open/close state is a three-step dissolve rather than a rotation: the
 * solid crab fades out, a dot lattice fades in, and the lattice collapses into an X.
 * `DotToggle` is only 9×9 because a dot needs ~3px to read and the bar gives it 32
 * — the detailed 29-column dotted crab needs ~88px, so it appears in the panel
 * instead, where there's room. See `crab-dots.tsx`.
 */
export function SiteHeader() {
  const { lang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dotsCross, setDotsCross] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const phase = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * The middle beat of the dissolve, scheduled from the interaction rather than an
   * effect — the state change is caused by a click, not by a render, and an effect
   * that sets state on every open trips react-hooks/set-state-in-effect.
   *
   * Opening: the grid holds for 150ms and only then collapses into the X, so the
   * change reads as the grid rearranging rather than a single blur. Closing runs the
   * same beat in reverse.
   */
  const close = useCallback(() => {
    if (phase.current) clearTimeout(phase.current);
    phase.current = null;
    setDotsCross(false);
    setMenuOpen(false);
  }, []);

  const toggle = useCallback(() => {
    if (menuOpen) {
      close();
      return;
    }
    setMenuOpen(true);
    phase.current = setTimeout(() => setDotsCross(true), 150);
  }, [menuOpen, close]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, close]);

  useEffect(
    () => () => {
      if (phase.current) clearTimeout(phase.current);
    },
    []
  );

  const wordmark = t("nav.wordmark", lang);

  return (
    // `relative` so the panel hangs off the bar instead of pushing the page down.
    // `mt-2` rather than padding: an absolutely positioned child is placed against
    // the padding box, so `pt-2` here would drop the bar 8px and leave the panel
    // behind at the old top edge, misaligning the bar phase that grows over the row.
    // A margin moves the header and the panel's origin together.
    <header className="relative mt-2 w-full">
      {/* `relative z-40` so the row rides ON TOP of the panel, which grows out from
          under it. While open the row's ink flips to `--primary-foreground`, because
          by then it's sitting on the panel's inverted surface. */}
      <div
        className={cn(
          "font-geist relative z-40 mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 transition-colors duration-[var(--duration-base)] sm:px-6",
          menuOpen ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {/* `order` flips the sides: mark right on mobile, left from `sm`. */}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={`${wordmark} — ${t(menuOpen ? "nav.menu_close" : "nav.menu_open", lang)}`}
          // `p-1.5 -m-1.5`: the mark is the reference's 20px, and the padding lifts the
          // button's own box to 32px for WCAG 2.5.8 while the negative margin keeps
          // the row's metrics unchanged. On the button, not an inner span — an inner
          // `w-5 p-1.5` collapses to an 8px content box under border-box, which left
          // the real target 8×20 and the button's rect lying about it.
          className="group order-2 -m-1.5 flex w-fit items-center p-1.5 transition-opacity hover:opacity-70 sm:order-1"
        >
          <DotToggle open={dotsCross} className="w-5 shrink-0" />

          {/* Hover-only, and hover-capable devices only — on touch a tap sticks the
              state and the name would sit half-revealed. Translated, and in Spanish
              sentence case, which differs from the English title case. */}
          {/* Hover reveals it; opening the menu also reveals it, because the black
              bar grows across exactly this space and a bar sliding over blank
              header would read as a glitch. `animate-wordmark-in` is the hover
              path; while open it's simply held visible, and it inherits the row's
              inverted ink so it reads light on the panel. */}
          <span
            aria-hidden
            className={cn(
              "ml-2 hidden text-base font-medium whitespace-nowrap transition-[opacity,translate,filter] duration-[var(--duration-enter)] ease-[var(--ease-enter)] sm:block",
              menuOpen
                ? "blur-0 translate-x-0 opacity-100 delay-[120ms]"
                : "group-hover:animate-wordmark-in -translate-x-[var(--reveal-rise)] opacity-0 blur-[4px]"
            )}
          >
            {wordmark}
          </span>
        </button>

        <div className="order-1 flex items-center gap-3 sm:order-2 sm:gap-4">
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* The panel grows out from under the bar in two beats, matching the
          reference: a black bar first grows HORIZONTALLY across the header row, then
          grows DOWN into the menu. Sequenced by delaying `height` behind `width` on
          open and reversing that on close, so the two reads never overlap.

          It starts at the top of the header, not below it, which is what lets the bar
          pass over the mark and the name — those sit at `z-40` above it and flip to
          the inverted ink, so the name ends up light on black. `pt-14` keeps the menu
          rows clear of that row.

          `height: "auto"` is animated by Motion measuring the content, so nothing
          here needs a hard-coded panel height that would drift as rows change.

          `bg-primary` is the inverted surface token rather than a literal black: it
          reads as the reference's dark card in light mode and a light one in dark
          mode. A permanently dark panel would fight our dark theme.

          `z-30` keeps it under the CV modal's z-40 backdrop, so tapping CV covers the
          panel rather than fighting it, and the panel is still mounted when the modal
          closes — closing it would unmount that CvModal instance and take the modal
          with it.

          No click-outside backdrop: it would have to sit between the panel and the
          bar, and would swallow taps meant for the language and theme buttons.
          Escape, a second tap on the mark, and tapping any row all close it. */}
      <AnimatePresence>
        {menuOpen && (
          // The wrapper repeats the bar's own box — `mx-auto max-w-5xl`, same padding
          // — so the panel tracks the mark rather than the viewport edge. `ml-auto`
          // puts it on the right below `sm` where the mark is; `sm:-ml-3.5` moves it
          // left with the mark from `sm` up.
          //
          // The negative margin on the mark's side is the padding: aligned exactly to
          // the content box, the panel's edge landed 6px from the mark's dots and the
          // bar looked like it was crushing them. Pulling it 8px (mobile) / 14px
          // (desktop) further out gives the mark ~20px of breathing room inside the
          // bar, which is what the reference does — its panel reaches closer to the
          // viewport edge than its toggle does.
          //
          // pointer-events-none so the empty half of the wrapper doesn't cover the
          // page.
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div
              id="site-menu"
              variants={PANEL}
              initial="closed"
              animate="open"
              exit="closed"
              className="bg-primary text-primary-foreground pointer-events-auto -mr-2 ml-auto w-[min(19rem,100%)] overflow-hidden rounded-2xl shadow-xl sm:mr-0 sm:-ml-3.5"
            >
              <div className="px-5 pt-14 pb-5">
                <nav aria-label="Site" className="flex flex-col">
                  {[...NAV, { href: null, key: "nav.cv" as const }].map(
                    (item, i) => (
                      <BlurFade
                        key={item.key}
                        delay={0.3 + i * 0.04}
                        offset={4}
                      >
                        {item.href ? (
                          <Link
                            href={item.href}
                            onClick={close}
                            className="text-primary-foreground/55 hover:text-primary-foreground block py-1 text-2xl font-semibold tracking-tight transition-colors"
                          >
                            {t(item.key, lang)}
                          </Link>
                        ) : (
                          // Trigger only. The dialog itself renders OUTSIDE this
                          // panel — see the CvModal note below.
                          <button
                            type="button"
                            onClick={() => setCvOpen(true)}
                            className="text-primary-foreground/55 hover:text-primary-foreground block py-1 text-2xl font-semibold tracking-tight transition-colors"
                          >
                            {t("nav.cv", lang)}
                          </button>
                        )}
                      </BlurFade>
                    )
                  )}
                </nav>

                <BlurFade delay={0.46} offset={4}>
                  <div className="border-primary-foreground/20 mt-4 border-t pt-4">
                    <div className="text-primary-foreground/45 mb-2 font-mono text-[10px] tracking-widest uppercase">
                      {t("nav.socials", lang)}
                    </div>
                    <div className="flex flex-col gap-1">
                      {RESOURCES.map((r) => (
                        <a
                          key={r.href}
                          href={r.href}
                          // mailto stays in this tab: a blank tab that hands off to
                          // a mail client just leaves an empty one behind.
                          target={
                            r.href.startsWith("mailto:") ? undefined : "_blank"
                          }
                          rel={
                            r.href.startsWith("mailto:")
                              ? undefined
                              : "noopener noreferrer"
                          }
                          onClick={close}
                          className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                        >
                          {r.key ? t(r.key, lang) : r.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </BlurFade>

                {/* The detailed crab, at the size it needs. 88px was on the floor —
                    29 columns into 88 is 3px a dot with nothing spare — so it gets
                    120 here, which the panel has room for. The bar can't show it at
                    20px at all, so this is where the artwork actually lands. */}
                <BlurFade delay={0.52} offset={4}>
                  <CrabDots className="text-primary-foreground/40 mt-5 ml-auto w-[120px]" />
                </BlurFade>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Outside the panel, deliberately. The panel animates max-width/height under
          `overflow: hidden` and its rows animate `filter`; either makes an ancestor
          the containing block for `position: fixed`, so a modal rendered inside it
          stopped escaping and got clipped to the panel's width — measured as 488px of
          dialog inside a 304px box. The menu holds the trigger; the dialog lives
          here. */}
      <CvModal open={cvOpen} onOpenChange={setCvOpen} triggerless />
    </header>
  );
}
