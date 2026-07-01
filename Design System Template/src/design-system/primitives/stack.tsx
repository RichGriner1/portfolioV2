import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/lib/utils";
import { Slot } from "./slot";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    // Gap drawn from the spacing scale (1 unit = 1px). A curated subset keeps
    // the classes static so Tailwind's scanner always emits them.
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
      20: "gap-20",
      24: "gap-24",
      32: "gap-32",
      48: "gap-48",
      64: "gap-64",
    },
  },
  defaultVariants: {
    direction: "column",
    gap: 4,
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof stackVariants> {
  as?: React.ElementType;
  asChild?: boolean;
}

/** Gap-based flex container. The layout workhorse. */
export const Stack = React.forwardRef<HTMLElement, StackProps>(function Stack(
  { as: Tag = "div", asChild, className, direction, align, justify, wrap, gap, ...props },
  ref,
) {
  const Comp = asChild ? Slot : Tag;
  return (
    <Comp
      ref={ref}
      data-slot="stack"
      className={cn(stackVariants({ direction, align, justify, wrap, gap }), className)}
      {...props}
    />
  );
});

/** Vertical stack — `Stack` preset to `direction="column"`. */
export const VStack = React.forwardRef<HTMLElement, Omit<StackProps, "direction">>(
  function VStack(props, ref) {
    return <Stack ref={ref} direction="column" {...props} />;
  },
);

/** Horizontal stack — `Stack` preset to `direction="row"`, items vertically centered. */
export const HStack = React.forwardRef<HTMLElement, Omit<StackProps, "direction">>(
  function HStack({ align = "center", ...props }, ref) {
    return <Stack ref={ref} direction="row" align={align} {...props} />;
  },
);
