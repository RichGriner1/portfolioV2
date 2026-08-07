"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Magic UI's ShimmerButton (magicui.design/docs/components/shimmer-button), ported.
 *
 * A conic-gradient spark orbits the button's edge, clipped to a hairline by a
 * slightly inset backdrop that covers everything but the rim. The published
 * source hard-codes the whole thing — `rgba(0,0,0,1)` fill, `#ffffff` spark,
 * `#ffffff1f` inner glow — which is three token violations and, worse, a button
 * that stays black-on-white in dark mode. Here the fill is `--primary` and both
 * the spark and the inner glow are derived from `--primary-foreground`, so the
 * pair inverts with the theme like every other button on the site.
 *
 * Three other changes:
 *
 * 1. **`--radius` is not overridden.** Upstream sets `--radius: 100px` inline for
 *    its pill shape. In this repo `--radius` is the base the entire radius scale
 *    is derived from (see globals.css), and an inline value would cascade into
 *    everything nested inside the button. Radius comes from `rounded-lg` and the
 *    inner layers inherit it.
 *
 * 2. **Nothing overflows.** Upstream spins a `-inset-full` box — three times the
 *    button in each direction — so the conic gradient's corners never gap as it
 *    rotates, and lets the button's `overflow: hidden` clip the rest. It looks
 *    right and measures wrong: `check:responsive` reads a control whose content
 *    is 68px wider than its own box with the excess cut off, which is its
 *    signature for a button clipping its own label. Rotating the GRADIENT
 *    instead of the box (`--shimmer-angle`, registered with `@property` in
 *    globals.css so an angle can animate at all) keeps every layer at exactly
 *    the button's size. Same effect, honest geometry, and the gate can still see
 *    a real overflow bug here later.
 *
 * 3. **The spark is dropped under `prefers-reduced-motion`.** It's an infinite
 *    loop, which is the exact thing that setting exists to stop.
 */
type ShimmerButtonProps = ComponentPropsWithoutRef<"button"> & {
  /**
   * Render as a Next `Link` instead of a `button`. Set it whenever the control
   * actually navigates — ⌘-click, middle-click and the crawler all depend on
   * route changes staying anchors. Leave it off and you get a real `button`,
   * which is what an in-page action (the canvas hero pair, say) needs.
   */
  href?: string;
  /** How much rim the spark is allowed to show through. */
  shimmerSize?: string;
  /** One lap of the rim. */
  shimmerDuration?: string;
};

export function ShimmerButton({
  href,
  className,
  children,
  shimmerSize = "1px",
  shimmerDuration = "3s",
  ...rest
}: ShimmerButtonProps) {
  const style = {
    "--shimmer-cut": shimmerSize,
    "--shimmer-speed": shimmerDuration,
    /** Arc of the conic sweep that actually carries light. */
    "--shimmer-spread": "90deg",
    "--shimmer-color": "var(--primary-foreground)",
    "--shimmer-glow":
      "color-mix(in oklab, var(--primary-foreground) 12%, transparent)",
  } as CSSProperties;

  const classes = cn(
    "group bg-primary text-primary-foreground relative z-0 inline-flex h-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-4 text-sm font-medium whitespace-nowrap",
    "focus-visible:ring-ring/50 outline-none focus-visible:ring-3",
    "ease-out-soft transform-gpu transition-transform duration-[var(--duration-base)] active:translate-y-px",
    className
  );

  const content = (
    <>
      {/* The spark: one square of light that slides the width of the button while
          the gradient inside it turns. `container-type: size` makes `100cqw`
          resolve against the button, so the slide distance is the button's own
          width and no size has to be known up front. */}
      <span
        aria-hidden
        className="[container-type:size] absolute inset-0 -z-30 blur-[2px] motion-reduce:hidden"
      >
        <span className="animate-shimmer-spark absolute inset-y-0 left-0 block aspect-square [background:conic-gradient(from_calc(var(--shimmer-angle)+270deg-(var(--shimmer-spread)*0.5)),transparent_0,var(--shimmer-color)_var(--shimmer-spread),transparent_var(--shimmer-spread))]" />
      </span>

      {children}

      {/* Inner glow — the thing that keeps a flat fill from reading as flat. */}
      <span
        aria-hidden
        className="ease-out-soft absolute inset-0 rounded-[inherit] shadow-[inset_0_-8px_10px_var(--shimmer-glow)] transition-shadow duration-[var(--duration-base)] group-hover:shadow-[inset_0_-6px_10px_var(--shimmer-glow)] group-active:shadow-[inset_0_-10px_10px_var(--shimmer-glow)]"
      />

      {/* Backdrop, inset by `--shimmer-cut`, so the orbiting spark is only ever
          visible as a rim. */}
      <span
        aria-hidden
        className="bg-primary absolute [inset:var(--shimmer-cut)] -z-20 rounded-[inherit]"
      />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        style={style}
        className={classes}
        // Anchor-only props (rel, target, …) reach the same element; the button
        // props this type carries are simply never passed in the link case.
        {...(rest as ComponentPropsWithoutRef<"a">)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" style={style} className={classes} {...rest}>
      {content}
    </button>
  );
}
