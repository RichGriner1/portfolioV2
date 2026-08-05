"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BlurFade } from "@/components/motion/blur-fade";
import { CrabMark } from "@/components/motion/crab-mark";
import { CvModal } from "@/components/cv-modal";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { t, useLang } from "@/lib/i18n";

/**
 * The crab carries no information on its own, so the reveal says what the site
 * IS rather than only whose it is. Also the link's accessible name, so the
 * visible and announced names match.
 */
const WORDMARK = "Richard Griner Design Portfolio";

const NAV = [
  { href: "/projects", key: "nav.projects" as const },
  { href: "/writing", key: "nav.writing" as const },
];

/**
 * One header for every page. It used to take a `brand` prop so only the home got
 * the crab — which meant every case study and post still showed the old wordmark
 * and the site looked like two different sites. There is no variant now.
 *
 * Hover behaviour is guarded with `[@media(hover:hover)]` throughout. On touch a
 * tap fires the hover state and iOS holds it until the user taps elsewhere, which
 * left the logo stuck mid-tilt with a half-revealed wordmark on every page.
 *
 * Two layouts, split at `sm`:
 *
 * - `sm` and up: crab-as-home-link on the left, nav centred on the viewport,
 *   CV / language / theme on the right.
 * - below `sm`: the crab IS the menu button, and it holds Home, Projects,
 *   Writing and CV. Language and theme stay out in the bar — they're one tap
 *   each and burying a theme switch behind a menu makes it feel broken.
 *
 * The mobile split exists because all six items in one row came to 361px of
 * intrinsic content at a 320px viewport. The earlier fix squeezed them into a
 * flex row with ~11px of slack, which held but left no room for another item
 * ever. A menu is the version that doesn't need re-solving next time.
 */
export function SiteHeader() {
  const { lang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    // `relative` so the mobile panel can hang off the bar rather than push the
    // page down — an expanding menu that reflows the content under it reads as
    // the layout breaking.
    <header className="relative w-full">
      {/* Three columns so the nav is centred on the viewport, not on whatever is
          left over between the logo and the controls. `1fr auto 1fr` keeps it put
          however wide the sides get. That grid only holds from `sm` up; below it
          the row is plain flex with `justify-between`, since three intrinsic
          widths plus two 24px gaps and 48px of padding overflowed 320px. */}
      <div className="font-geist mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:px-6">
        {/* Below `sm` the crab is a menu toggle, not a link. Two separate
            elements rather than one that changes behaviour: a control that is
            sometimes a link and sometimes a button can't be described honestly to
            a screen reader, and the desktop version carries a hover reveal the
            button has no use for. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={t(menuOpen ? "nav.menu_close" : "nav.menu_open", lang)}
          className="group flex w-fit items-center transition-opacity hover:opacity-70 sm:hidden"
        >
          <CrabMark
            className={`text-foreground ease-spring size-8 shrink-0 transition-transform duration-[var(--duration-base)] ${
              menuOpen ? "scale-[1.06] rotate-[8deg]" : ""
            }`}
          />
        </button>

        <Link
          href="/"
          aria-label={WORDMARK}
          className="group hidden w-fit items-center justify-self-start transition-opacity hover:opacity-70 sm:flex"
        >
          <CrabMark className="text-foreground ease-spring size-8 shrink-0 transition-transform duration-[var(--duration-base)] [@media(hover:hover)]:group-hover:scale-[1.06] [@media(hover:hover)]:group-hover:rotate-[8deg]" />
          {/* In flow, not absolute. It reserves its own width so the link's hover
              box covers the space the name appears in — positioned outside the
              box, moving the cursor toward the name you just revealed left the
              link and collapsed it. `hidden` on touch: a hover-only reveal has no
              job there and can only get stuck. */}
          <span
            aria-hidden
            className="text-foreground group-hover:animate-wordmark-in ml-2 hidden -translate-x-[var(--reveal-rise)] text-base font-medium whitespace-nowrap opacity-0 blur-[4px] transition-[opacity,translate,filter] duration-[var(--duration-enter)] ease-[var(--ease-enter)] [@media(hover:hover)]:block"
          >
            {WORDMARK}
          </span>
        </Link>

        {/* Desktop nav. Below `sm` these live in the menu instead. */}
        <nav
          aria-label="Site"
          className="text-muted-foreground hidden items-center gap-4 justify-self-center text-sm sm:flex sm:gap-6"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground py-1.5 underline-offset-4 transition-colors hover:underline"
            >
              {t(item.key, lang)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-self-end sm:gap-4">
          {/* CV lives in the menu on mobile, so this instance is desktop-only.
              Two instances rather than one lifted into shared state: CvModal owns
              its own open state and body-scroll lock, and rewiring that from here
              would mean changing its API for a layout concern. The hidden one's
              trigger is `display: none`, so it can't be reached or opened. */}
          <div className="text-muted-foreground hidden text-sm sm:block">
            <CvModal />
          </div>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile panel. Mounted on open rather than hidden with CSS, because the
          BlurFade entrance runs on mount — that's what gives each row its stagger.
          `z-30` keeps it under the CV modal's z-40 backdrop, so tapping CV covers
          the menu instead of fighting it, and the menu is still there underneath
          when the modal closes.

          No click-outside backdrop on purpose: one would have to sit over the page
          at a z-index between the panel and the header, and it would swallow taps
          meant for the language and theme buttons still in the bar. Escape, a
          second tap on the crab, and tapping any row all close it. */}
      {menuOpen && (
        <div
          id="site-menu"
          className="border-border bg-background/95 absolute inset-x-0 top-14 z-30 flex flex-col border-b px-2 pt-1 pb-3 backdrop-blur-md sm:hidden"
        >
          {[
            { href: "/", key: "nav.home" as const },
            ...NAV,
            { href: null, key: "nav.cv" as const },
          ].map((item, i) => (
            // 40ms apart, and `offset` a touch smaller than BlurFade's default:
            // the rows are 40px tall and 20px apart, so the stock 6px rise reads
            // as a jolt at this density.
            <BlurFade key={item.key} delay={i * 0.04} offset={4}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-foreground hover:bg-muted/60 block rounded-md px-3 py-3 text-base transition-colors"
                >
                  {t(item.key, lang)}
                </Link>
              ) : (
                // The menu stays open behind the modal — closing it here would
                // unmount this CvModal instance and take the modal with it.
                <div className="text-foreground [&_button]:hover:bg-muted/60 [&_button]:block [&_button]:w-full [&_button]:rounded-md [&_button]:px-3 [&_button]:py-3 [&_button]:text-left [&_button]:text-base [&_button]:no-underline">
                  <CvModal />
                </div>
              )}
            </BlurFade>
          ))}
        </div>
      )}
    </header>
  );
}
