import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import type { StackGap } from "./Stack";

/**
 * Padding steps Box accepts. Same keys as `StackGap`, so a Box padding and a
 * Stack gap are always drawn from one scale.
 */
export type BoxSpace = StackGap;

const paddingClass: Record<BoxSpace, string> = {
  none: "p-0",
  "1": "p-1",
  "2": "p-2",
  "3": "p-3",
  "4": "p-4",
  "5": "p-5",
  "6": "p-6",
  "8": "p-8",
};

const paddingXClass: Record<BoxSpace, string> = {
  none: "px-0",
  "1": "px-1",
  "2": "px-2",
  "3": "px-3",
  "4": "px-4",
  "5": "px-5",
  "6": "px-6",
  "8": "px-8",
};

const paddingYClass: Record<BoxSpace, string> = {
  none: "py-0",
  "1": "py-1",
  "2": "py-2",
  "3": "py-3",
  "4": "py-4",
  "5": "py-5",
  "6": "py-6",
  "8": "py-8",
};

/** Semantic surface roles a Box can paint. Raw color scales are deliberately absent. */
export type BoxBackground =
  | "none"
  | "page"
  | "container"
  | "card"
  | "subtle"
  | "muted"
  | "raised"
  | "inverse";

const backgroundClass: Record<BoxBackground, string> = {
  none: "",
  page: "bg-[var(--surface-page)]",
  container: "bg-[var(--surface-container)]",
  card: "bg-[var(--surface-card)]",
  subtle: "bg-[var(--surface-subtle)]",
  muted: "bg-[var(--surface-muted)]",
  raised: "bg-[var(--surface-raised)]",
  inverse: "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]",
};

/** Border treatment. `hairline` draws the plate ring; there is no width or color choice. */
export type BoxBorder = "none" | "hairline";

/** Elements a Box may render as. Interactive tags are excluded on purpose. */
export type BoxElement =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "figure"
  | "li"
  | "span";

export interface BoxProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Content to sit inside the padding and on top of the background. */
  children?: ReactNode;
  /**
   * Padding on all four sides, from the spacing scale: `none` 0, `1` 4px,
   * `2` 8px, `3` 12px, `4` 16px, `5` 20px, `6` 24px, `8` 32px. Omit it for a
   * flush Box.
   */
  padding?: BoxSpace;
  /** Left/right inset when it differs from the vertical one; replaces `padding` on that axis. */
  paddingX?: BoxSpace;
  /** Top/bottom inset when it differs from the horizontal one; replaces `padding` on that axis. */
  paddingY?: BoxSpace;
  /**
   * Semantic surface to paint behind the content. `card` sits on top of
   * `container`, `container` sits on `page`; `inverse` also flips the text
   * color so content stays readable. Omit it to stay transparent.
   */
  background?: BoxBackground;
  /**
   * `hairline` wraps the content in the plate ring (outer stroke layer plus a
   * 1px-inset fill layer) because `clip-path` would slice a real CSS border.
   * A ringed Box with no `background` falls back to the `card` surface, so the
   * ring reads as a stroke and not as a solid plate.
   */
  border?: BoxBorder;
  /**
   * Element to render when the Box is a landmark or a list item rather than a
   * generic grouping (`section`, `nav`, `li`, ...). Defaults to `div`.
   */
  as?: BoxElement;
  /** Extra classes (width, height, position), merged with `cn()` so they beat the generated ones. */
  className?: string;
}

/**
 * Box is the base surface primitive: token-backed padding, a semantic
 * background, and an optional hairline plate ring, on the element of your
 * choice.
 *
 * Reach for Box when a wrapper needs a surface, an inset, or a ring. Keep
 * writing a plain `div` when the wrapper only needs layout classes: Box has no
 * width, display, flex, margin, radius or style API, and never takes arbitrary
 * values. Use Stack, Inline or Grid to arrange children, and Container or
 * Center for page width.
 *
 * Forwards its ref to the outer element and spreads native attributes
 * (`id`, `role`, `aria-*`, `data-*`, handlers).
 */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    children,
    padding,
    paddingX,
    paddingY,
    background = "none",
    border = "none",
    as = "div",
    className,
    ...rest
  },
  ref
) {
  const Tag = as as ElementType;
  // An axis prop replaces `padding` on that axis outright, rather than relying
  // on `p-4 px-6` resolving by stylesheet order.
  const perAxis = paddingX !== undefined || paddingY !== undefined;
  const resolvedX = paddingX ?? padding;
  const resolvedY = paddingY ?? padding;
  const spacing = perAxis
    ? cn(
        resolvedX !== undefined && paddingXClass[resolvedX],
        resolvedY !== undefined && paddingYClass[resolvedY]
      )
    : cn(padding !== undefined && paddingClass[padding]);

  if (border === "none") {
    return (
      <Tag ref={ref} className={cn(backgroundClass[background], spacing, className)} {...rest}>
        {children}
      </Tag>
    );
  }

  // PLATE RING RECIPE: the outer layer is the stroke clipped to the plate, the
  // inner layer is the fill clipped 1px inset (as in Card). Padding belongs
  // to the inner layer so content clears the stroke.
  const fill = background === "none" ? backgroundClass.card : backgroundClass[background];

  return (
    <Tag
      ref={ref}
      className={cn("plate-round bg-[var(--surface-container-stroke)] p-px", className)}
      {...rest}
    >
      <div className={cn("plate-round h-full w-full", fill, spacing)}>{children}</div>
    </Tag>
  );
});

Box.displayName = "Box";
