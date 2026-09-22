import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

const gapClass = {
  none: "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
} as const;

export type StackGap = keyof typeof gapClass;

export interface StackProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Stack contents; laid out along `axis` with `gap` between them. */
  children: ReactNode;
  /**
   * Maps to the spacing scale (`gap-*` utilities): `none` 0, `1` 4px, `2` 8px,
   * `3` 12px, `4` 16px (default), `5` 20px, `6` 24px, `8` 32px.
   */
  gap?: StackGap;
  /** Additional CSS classes (width, padding, alignment overrides). */
  className?: string;
  /** Default vertical stack; horizontal for toolbars / button groups. */
  axis?: "vertical" | "horizontal";
}

/**
 * Stack — vertical or horizontal layout with token-backed gap spacing.
 * Use inside screens and compound components instead of ad-hoc `flex` + raw gap values.
 *
 * Forwards its ref to the underlying `<div>` and spreads any extra native
 * attributes (`id`, `role`, `aria-*`, `data-*`), so a stack can be a labelled
 * region or a scroll anchor without a wrapper element.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { children, gap = "4", className, axis = "vertical", ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        axis === "vertical" ? "flex-col" : "flex-row flex-wrap items-center",
        gapClass[gap],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

Stack.displayName = "Stack";
