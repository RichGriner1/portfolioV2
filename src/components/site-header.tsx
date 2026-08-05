"use client";

import Link from "next/link";

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

/**
 * One header for every page. It used to take a `brand` prop so only the home got
 * the crab — which meant every case study and post still showed the old wordmark
 * and the site looked like two different sites. There is no variant now.
 *
 * Hover behaviour is guarded with `[@media(hover:hover)]` throughout. On touch a
 * tap fires the hover state and iOS holds it until the user taps elsewhere, which
 * left the logo stuck mid-tilt with a half-revealed wordmark on every page.
 */
export function SiteHeader() {
  const { lang } = useLang();

  return (
    <header className="w-full">
      {/* Three columns so the nav is centred on the viewport, not on whatever is
          left over between the logo and the controls. `1fr auto 1fr` keeps it put
          however wide the sides get. */}
      <div className="font-geist mx-auto grid h-14 max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-6">
        <Link
          href="/"
          aria-label={WORDMARK}
          className="group flex w-fit items-center justify-self-start transition-opacity hover:opacity-70"
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

        <nav
          aria-label="Site"
          className="text-muted-foreground flex items-center gap-6 justify-self-center text-sm"
        >
          <Link
            href="/projects"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            {t("nav.projects", lang)}
          </Link>
          <Link
            href="/writing"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            {t("nav.writing", lang)}
          </Link>
        </nav>

        <div className="flex items-center gap-4 justify-self-end">
          <div className="text-muted-foreground text-sm">
            <CvModal />
          </div>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
