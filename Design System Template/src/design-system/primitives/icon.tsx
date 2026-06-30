import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/lib/utils";

const iconVariants = cva("inline-block shrink-0", {
  variants: {
    // Sizes drawn from the spacing scale (1 unit = 1px) so `size-20` = 20px.
    size: {
      xs: "size-12",
      sm: "size-16",
      md: "size-20",
      lg: "size-24",
      xl: "size-32",
    },
    tone: {
      current: "text-current",
      muted: "text-muted-foreground",
      primary: "text-primary",
      error: "text-error",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "current",
  },
});

export interface IconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "color">,
    VariantProps<typeof iconVariants> {
  /** The icon component to render — e.g. a lucide-react icon. */
  as: React.ElementType;
  /**
   * Accessible label. When omitted the icon is `aria-hidden` (decorative);
   * when provided it becomes an `img` role with that label.
   */
  "aria-label"?: string;
}

/**
 * currentColor-driven SVG wrapper. Adopts the surrounding text color by
 * default (lucide icons stroke with `currentColor`) and sizes off the scale.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
  { as: Comp, size, tone, className, "aria-label": ariaLabel, ...props },
  ref,
) {
  return (
    <Comp
      ref={ref}
      data-slot="icon"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      focusable="false"
      className={cn(iconVariants({ size, tone }), className)}
      {...props}
    />
  );
});
