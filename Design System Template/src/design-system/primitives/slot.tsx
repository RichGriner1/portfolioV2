import * as React from "react";
import { cn } from "@/design-system/lib/utils";

type AnyProps = Record<string, unknown>;

export interface SlotProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Renders its props onto its single child element instead of emitting a
 * wrapper node. Powers the `asChild` pattern across every primitive:
 * className is merged with `cn()`, style objects are shallow-merged, event
 * handlers are composed (child first, then slot), and refs are forwarded to
 * the child. Dependency-free — no Radix.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  if (!React.isValidElement(children)) {
    if (React.Children.count(children) > 1) {
      throw new Error("Slot expects a single React element child.");
    }
    return null;
  }

  const childProps = children.props as AnyProps;
  const merged = mergeProps(slotProps, childProps);
  merged.ref = forwardedRef
    ? composeRefs(forwardedRef, childProps.ref as React.Ref<HTMLElement>)
    : (childProps.ref as React.Ref<HTMLElement>);

  return React.cloneElement(children, merged);
});

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps };

  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (/^on[A-Z]/.test(key)) {
      // Compose event handlers: child's runs first, then the slot's.
      if (typeof slotValue === "function" && typeof childValue === "function") {
        merged[key] = (...args: unknown[]) => {
          (childValue as (...a: unknown[]) => void)(...args);
          (slotValue as (...a: unknown[]) => void)(...args);
        };
      } else {
        merged[key] = childValue ?? slotValue;
      }
    } else if (key === "style") {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    } else if (key === "className") {
      merged[key] = cn(slotValue as string, childValue as string);
    } else {
      merged[key] = childValue;
    }
  }

  return merged;
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref != null) (ref as React.RefObject<T | null>).current = node;
    }
  };
}
