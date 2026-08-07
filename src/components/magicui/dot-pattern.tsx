"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Magic UI's DotPattern (magicui.design/docs/components/dot-pattern), ported.
 *
 * One deliberate change from the published source: the default fill is the
 * `--border` token rather than `fill-neutral-400/80`. A hard-coded Tailwind colour
 * would be a token violation here and, more practically, would sit at the same
 * value in both themes — the dots need to invert with the surface like every other
 * hairline on the site does.
 *
 * `useId` for the pattern id, so two of these on one page don't collide: SVG
 * `<defs>` ids are document-global, and a fixed id makes the second instance
 * silently reference the first one's pattern.
 */
type DotPatternProps = React.SVGProps<SVGSVGElement> & {
  /** Cell size of the repeating tile. */
  width?: number;
  height?: number;
  /** Tile origin offset. */
  x?: number;
  y?: number;
  /** Dot centre within the tile, and its radius. */
  cx?: number;
  cy?: number;
  cr?: number;
};

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden
      className={cn(
        "fill-border pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
