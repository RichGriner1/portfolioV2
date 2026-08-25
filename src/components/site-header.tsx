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

/**
 * The socials used to be duplicated in the footer too; they live only in this
 * panel now (see the note in site-footer.tsx).
 *
 * GitHub added 2026-08-25, when portfolioV2 went public. It sits first because
 * it's the link a design-engineering reviewer looks for and the site had no path
 * to any code at all — which, for a portfolio whose strongest artifact IS the
 * repo, was the gap.
 */
const RESOURCES = [
  { href: "https://github.com/RichGriner1/portfolioV2", label: "GitHub" },
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
  /** The header row and the panel — the two boxes that count as "inside". */
  const row = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

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

  /**
   * Click-outside close. A document listener rather than a backdrop element: a
   * backdrop would have to sit between the panel and the header row, where it
   * swallows the taps meant for the language and theme buttons. Listening at the
   * document leaves every real target clickable and only adds the close.
   *
   * `pointerdown`, not `click`, so the panel starts retreating on press rather
   * than on release.
   *
   * Three things count as inside:
   * - the panel itself;
   * - the whole header row, including the mark and both toggles. The row sits ON
   *   the black panel while open, so it reads as part of the menu — closing on a
   *   theme change there would feel like a misfire. The mark also has to be
   *   excluded or its own onClick would toggle a menu this listener just closed;
   * - anything in a portalled overlay (`[role="menu"]`, `[role="dialog"]`) — the
   *   theme dropdown and the CV modal both render outside the panel's DOM, and
   *   are open BECAUSE of the menu.
   */
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (panel.current?.contains(target)) return;
      if (row.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest('[role="menu"], [role="dialog"]')
      )
        return;
      close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menuOpen, close]);

  useEffect(
    () => () => {
      if (phase.current) clearTimeout(phase.current);
    },
    []
  );

  /**
   * The bar's bottom rule only exists once the page has moved. Parked at the top
   * there is nothing behind the nav for a line to separate it from, so the rule reads
   * as a seam across the page; the moment content starts passing underneath, the same
   * line is what stops the bar dissolving into it.
   *
   * The 4px threshold rather than `> 0` keeps iOS rubber-band scroll and a restored
   * scroll position from flickering the rule on and off around zero.
   *
   * The updater returns the previous value unchanged when the threshold hasn't been
   * crossed, which React bails out of — so this listener runs on every scroll frame
   * but only ever re-renders twice: once entering the page, once leaving the top.
   */
  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > 4;
      setScrolled((prev) => (prev === past ? prev : past));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wordmark = t("nav.wordmark", lang);

  return (
    // `sticky top-0` so the nav is reachable at any scroll depth, at every width.
    //
    // The 8px `mt-2` that used to lower the header is gone with it. A sticky bar has
    // to be flush: an 8px gap above a pinned bar shows a strip of the page scrolling
    // past ABOVE the nav, which reads as a rendering fault rather than as a float.
    // The row keeps its own h-14, so only the outer offset changed.
    //
    // `z-40` makes this a stacking context, which is the point — it settles the order
    // that used to be global. Inside it the row (z-40) still rides over the panel
    // (z-30), and the CV modal (backdrop z-40, dialog z-50) still covers both.
    // Anything on the page that genuinely should cover the nav — the case-study
    // lightbox at z-50 — still does, because it lives outside this header.
    <header className="sticky top-0 z-40 w-full">
      {/* The glass. A separate layer, NOT a `backdrop-blur` on the <header>, and that
          is load-bearing: `backdrop-filter` makes an element the containing block for
          any `position: fixed` descendant, so blurring the header itself would size
          the CV modal's `fixed inset-0` backdrop to this 56px bar. Exactly the trap
          the panel's `overflow`/`filter` note below describes. As a sibling behind
          the row it blurs the page without capturing anything.

          `-z-10` keeps it behind the row inside the header's context. `bg-background`
          at 70% is the same glass recipe the work cards and modals already use.

          The border is always declared and only its COLOR animates — swapping
          `border-b` on and off would change the element's box by 1px and nudge the
          bar as the rule appeared. `border-transparent` holds the space. */}
      <div
        aria-hidden
        className={cn(
          "bg-background/70 absolute inset-0 -z-10 border-b backdrop-blur-md transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-soft)]",
          scrolled ? "border-border/60" : "border-transparent"
        )}
      />

      {/* `relative z-40` so the row rides ON TOP of the panel, which grows out from
          under it. While open the row's ink flips to `--primary-foreground`, because
          by then it's sitting on the panel's inverted surface. */}
      <div
        ref={row}
        className={cn(
          "font-geist relative z-40 mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 transition-colors duration-[var(--duration-base)] sm:px-6",
          menuOpen ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {/* `order` flips the sides: mark right on mobile, left from `sm`. */}
        <button
          type="button"
          onClick={toggle}
          // Only the MARK inverts with the panel, not the whole row: the row runs
          // the full 976px content width while the panel is 304px, so the language
          // and theme buttons at the far end sit over the white page even while
          // open. The mark is the only part of the row the bar actually grows under.
          data-cursor-invert={menuOpen ? "" : undefined}
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
          {/* 14px at normal weight, matching the intro copy's step on the ramp.
              It was 16px/medium, which read as the boldest text on the page while
              sitting beside 14px prose.

              The size is also load-bearing for a second reason: the wordmark turns
              light while the menu is open, so any part of it that reaches past the
              panel's right edge is white on the white page and reads as the name
              being cut off. At 16px/medium the ES string ("Portfolio de diseño de
              Richard Griner", the long one) measured 274px and ended 12px past the
              304px panel; at 14px/normal it lands ~29px inside it. Anything longer
              than the current ES string needs the panel widened to match. */}
          <span
            aria-hidden
            className={cn(
              "ml-2 hidden text-sm whitespace-nowrap transition-[opacity,translate,filter] duration-[var(--duration-enter)] ease-[var(--ease-enter)] sm:block",
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

          Escape, a second tap on the mark, tapping any row, and a press anywhere
          outside all close it — the last one via a document listener rather than a
          backdrop element, for the reason in the effect above. */}
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
            {/* `data-cursor-invert` flips the dot cursor to the inverted ink over
                this surface — see dot-cursor.tsx. The panel is `bg-primary`, so a
                `--foreground` dot would be black on black here. */}
            <motion.div
              ref={panel}
              id="site-menu"
              data-cursor-invert
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
                    {/* Sentence case, not the mono-uppercase label idiom the rest
                        of the site uses. 10px + `tracking-widest` + all caps is
                        the least readable combination available, and it showed:
                        "REDES SOCIALES" is 14 letters of spaced-out capitals in a
                        304px panel. Mono stays — it's still a label, and the
                        string itself is already sentence case in i18n. Size steps
                        to `text-xs` (a scale step, not another arbitrary px) and
                        the ink comes up from /45 to /55. */}
                    <div className="text-primary-foreground/55 mb-2 font-mono text-xs tracking-wide">
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
                    20px at all, so this is where the artwork actually lands. The
                    redraw kept the column count and grew the rows (29×28, near
                    square), so the mark is ~116px tall here rather than the old 79.

                    `tint` mixes a Maryland red→gold ramp into the dots (see
                    crab-dots.tsx). Presence is `opacity-55` on the BOX rather than
                    `/55` on the ink, because the tint is a `color-mix` against
                    `currentColor`: mixing an opaque flag color into a part-alpha
                    white lifts the result's alpha and the crab would brighten as a
                    side effect of the hue. Full-alpha ink + box opacity keeps the
                    mix purely about hue and leaves the weight controllable here.
                    55%, not the original 40: the ramp is what carries the Maryland
                    reference and at 40 it flattened back into a warm cast. */}
                <BlurFade delay={0.52} offset={4}>
                  <CrabDots
                    tint
                    className="text-primary-foreground mt-5 ml-auto w-[120px] opacity-55"
                  />
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
