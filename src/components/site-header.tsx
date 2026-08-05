"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { BlurFade } from "@/components/motion/blur-fade";
import { CrabDots, DotToggle } from "@/components/motion/crab-dots";
import { CvModal } from "@/components/cv-modal";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { t, useLang } from "@/lib/i18n";

const NAV = [
  { href: "/", key: "nav.home" as const },
  { href: "/projects", key: "nav.projects" as const },
  { href: "/writing", key: "nav.writing" as const },
];

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
    <header className="relative w-full">
      <div className="font-geist mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:px-6">
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
          <DotToggle
            open={dotsCross}
            className="text-foreground w-5 shrink-0"
          />

          {/* Hover-only, and hover-capable devices only — on touch a tap sticks the
              state and the name would sit half-revealed. Translated, and in Spanish
              sentence case, which differs from the English title case. */}
          <span
            aria-hidden
            className="text-foreground group-hover:animate-wordmark-in ml-2 hidden -translate-x-[var(--reveal-rise)] text-base font-medium whitespace-nowrap opacity-0 blur-[4px] transition-[opacity,translate,filter] duration-[var(--duration-enter)] ease-[var(--ease-enter)] sm:[@media(hover:hover)]:block"
          >
            {wordmark}
          </span>
        </button>

        <div className="order-1 flex items-center gap-3 sm:order-2 sm:gap-4">
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* The panel. `bg-primary` is the inverted surface, so it reads as the dark
          card in light mode and a light one in dark mode — the reference's site is
          light-only, and a permanently dark panel would fight our dark theme.

          Mounted on open rather than hidden with CSS: BlurFade animates on mount,
          which is what staggers the rows. `z-30` keeps it under the CV modal's
          z-40 backdrop, so tapping CV covers the panel rather than fighting it, and
          the panel is still there when the modal closes — closing it would unmount
          the CvModal instance and take the modal with it.

          No click-outside backdrop: it would have to sit between the panel and the
          bar, and would swallow taps meant for the language and theme buttons.
          Escape, a second tap on the mark, and tapping any row all close it. */}
      {menuOpen && (
        // The wrapper repeats the bar's own box — `mx-auto max-w-5xl` with the same
        // padding — so the panel lines up under the mark instead of against the
        // viewport edge. `ml-auto` puts it on the right below `sm`, where the mark
        // is; `sm:ml-0` moves it left with the mark from `sm` up. The wrapper is
        // pointer-events-none so its empty half doesn't cover the page.
        <div className="pointer-events-none absolute inset-x-0 top-14 z-30 mx-auto max-w-5xl px-4 sm:px-6">
          <div
            id="site-menu"
            className="bg-primary text-primary-foreground pointer-events-auto ml-auto w-[min(19rem,100%)] rounded-2xl p-5 shadow-xl sm:ml-0"
          >
            <nav aria-label="Site" className="flex flex-col">
              {[...NAV, { href: null, key: "nav.cv" as const }].map(
                (item, i) => (
                  <BlurFade key={item.key} delay={i * 0.04} offset={4}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={close}
                        className="text-primary-foreground/55 hover:text-primary-foreground block py-1 text-2xl font-semibold tracking-tight transition-colors"
                      >
                        {t(item.key, lang)}
                      </Link>
                    ) : (
                      // Left open behind the modal on purpose — see the note above.
                      <div className="[&_button]:text-primary-foreground/55 [&_button]:hover:text-primary-foreground [&_button]:!m-0 [&_button]:block [&_button]:!px-0 [&_button]:py-1 [&_button]:text-2xl [&_button]:font-semibold [&_button]:tracking-tight [&_button]:no-underline">
                        <CvModal />
                      </div>
                    )}
                  </BlurFade>
                )
              )}
            </nav>

            <BlurFade delay={0.2} offset={4}>
              <div className="border-primary-foreground/20 mt-4 border-t pt-4">
                <div className="text-primary-foreground/45 mb-2 font-mono text-[10px] tracking-widest uppercase">
                  {t("nav.resources", lang)}
                </div>
                <div className="flex flex-col gap-1">
                  {RESOURCES.map((r) => (
                    <a
                      key={r.href}
                      href={r.href}
                      // mailto stays in this tab: a blank tab that hands off to a
                      // mail client just leaves an empty one behind.
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

            {/* The detailed crab, at the size it needs. 88px was on the floor — 29
              columns into 88 is 3px a dot with nothing spare — so it gets 120 here,
              which the 304px panel has room for. The bar can't show it at 32px at
              all, so the panel is where the artwork actually lands. */}
            <BlurFade delay={0.26} offset={4}>
              <CrabDots className="text-primary-foreground/40 mt-5 ml-auto w-[120px]" />
            </BlurFade>
          </div>
        </div>
      )}
    </header>
  );
}
