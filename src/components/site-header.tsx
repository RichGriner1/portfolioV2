import Link from "next/link";

import { CrabMark } from "@/components/motion/crab-mark";
import { CvModal } from "@/components/cv-modal";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * The crab carries no information on its own, so the reveal says what the site
 * IS rather than only whose it is. Also the link's accessible name in both
 * variants, so the visible and announced names match.
 */
const WORDMARK = "Richard Griner Design Portfolio";

/**
 * `brand` picks the home-link treatment:
 * - `wordmark` (default) — "Richard Griner", every page, unchanged.
 * - `adaptive` — RG monogram under `sm:`, wordmark above it. The name is the
 *   brand here (unlike an alias-based mark), so it only gives way where
 *   horizontal space is genuinely scarce.
 *
 * The monogram is TEXT as a placeholder — swap the inner span for Richard's
 * outlined SVG when it lands, then the face stops depending on a loaded font.
 * Both variants keep the accessible name on the link itself, so "RG" never
 * reaches a screen reader on its own.
 */
export function SiteHeader({
  brand = "wordmark",
}: {
  brand?: "wordmark" | "adaptive";
}) {
  return (
    <header className="w-full">
      {/* Geist across the header, on every page — same move as the footer. The
          home link dropped `font-display` so it inherits this rather than
          overriding it back to Roboto Flex. */}
      <div className="font-geist mx-auto flex h-14 max-w-5xl items-center gap-6 px-6">
        <Link
          href="/"
          // Matches whatever text the variant actually shows, so the announced
          // name never diverges from the visible one.
          aria-label={brand === "adaptive" ? WORDMARK : "Richard Griner"}
          className="group flex items-center text-base tracking-tight transition-opacity hover:opacity-70"
        >
          {brand === "adaptive" ? (
            <span className="relative flex items-center">
              {/* No chip: the crab sits straight on the page surface at the size
                  the chip used to be. currentColor means it inverts with the
                  theme, and the eyes are knocked out in --background so they
                  read against whatever is behind. */}
              <CrabMark className="text-foreground size-8" />
              {/* Name on hover/focus only. Absolutely positioned so it reserves
                  no space and nothing shifts when it appears. */}
              {/* Slide + blur on the same curve as the dropdown panels:
                  --duration-enter / --ease-enter, the values ported from
                  Coherence. The 6px offset is --reveal-rise, borrowed sideways
                  since this travels horizontally. Resting blur is blur-[0px],
                  not blur-none — `none` isn't a length, so filter wouldn't
                  animate and you'd get a hard blur-to-sharp cut. */}
              <span
                aria-hidden
                className="text-foreground pointer-events-none absolute left-full ml-2 -translate-x-[var(--reveal-rise)] font-medium whitespace-nowrap opacity-0 blur-[4px] transition-[opacity,translate,filter] duration-[var(--duration-enter)] ease-[var(--ease-enter)] group-hover:translate-x-0 group-hover:opacity-100 group-hover:blur-[0px] group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:blur-[0px]"
              >
                {WORDMARK}
              </span>
            </span>
          ) : (
            "Richard Griner"
          )}
        </Link>
        <div className="ml-auto flex items-center gap-4">
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
