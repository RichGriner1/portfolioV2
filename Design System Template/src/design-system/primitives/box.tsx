import * as React from "react";
import { cn } from "@/design-system/lib/utils";
import { Slot } from "./slot";

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Defaults to `div`. Ignored when `asChild` is set. */
  as?: React.ElementType;
  /** Merge props onto the single child element instead of rendering a wrapper. */
  asChild?: boolean;
}

/**
 * The atomic, brand-agnostic building block. A polymorphic element that
 * forwards className and props — the base every other primitive composes from.
 */
export const Box = React.forwardRef<HTMLElement, BoxProps>(function Box(
  { as: Tag = "div", asChild, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : Tag;
  return <Comp ref={ref} data-slot="box" className={cn(className)} {...props} />;
});
