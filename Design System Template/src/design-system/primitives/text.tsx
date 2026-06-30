import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/lib/utils";
import { Slot } from "./slot";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    // Tones bind to semantic color tokens — never raw hex.
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      error: "text-error",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
      destructive: "text-destructive",
      inherit: "text-inherit",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
    },
    family: {
      sans: "font-sans",
      mono: "font-mono",
      display: "font-display",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    tone: "default",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  /** Element to render. Defaults to `p`. Ignored when `asChild` is set. */
  as?: React.ElementType;
  asChild?: boolean;
}

/** Typographic primitive. All styling flows through tokens via variants. */
export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  { as: Tag = "p", asChild, className, size, weight, tone, align, leading, family, truncate, ...props },
  ref,
) {
  const Comp = asChild ? Slot : Tag;
  return (
    <Comp
      ref={ref}
      data-slot="text"
      className={cn(
        textVariants({ size, weight, tone, align, leading, family, truncate }),
        className,
      )}
      {...props}
    />
  );
});
