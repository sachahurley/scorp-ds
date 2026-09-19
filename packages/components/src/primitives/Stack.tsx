import { type ReactNode } from "react";
import { cn } from "../lib/utils";

const gapClass = {
  none: "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "6": "gap-6",
  "8": "gap-8",
} as const;

export type StackGap = keyof typeof gapClass;

export interface StackProps {
  children: ReactNode;
  /** Maps to the spacing scale (`gap-*` utilities). */
  gap?: StackGap;
  className?: string;
  /** Default vertical stack; horizontal for toolbars / button groups. */
  axis?: "vertical" | "horizontal";
}

/**
 * Stack — vertical or horizontal layout with token-backed gap spacing.
 * Use inside screens and compound components instead of ad-hoc `flex` + raw gap values.
 */
export function Stack({ children, gap = "4", className, axis = "vertical" }: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        axis === "vertical" ? "flex-col" : "flex-row flex-wrap items-center",
        gapClass[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
