import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * Content-column widths. These are measure widths for a block of content, not
 * page widths: use Container when the wrapper is the page itself.
 */
export type CenterMaxWidth = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "none";

const maxWidthClass: Record<CenterMaxWidth, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  none: "max-w-none",
};

/** Elements a Center may render as. Interactive tags are excluded on purpose. */
export type CenterElement = "div" | "section" | "article" | "main" | "figure";

export interface CenterProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Content to center; it keeps its own layout inside the column. */
  children: ReactNode;
  /**
   * Width of the centered column: `xs` 320px, `sm` 384px, `md` 448px
   * (default, about the width of a sign-in card), `lg` 512px, `xl` 576px,
   * `2xl` 672px, `none` to center a block that sizes itself.
   */
  maxWidth?: CenterMaxWidth;
  /**
   * Whether to center the text as well as the box. On for empty states and
   * splash copy; off (default) when the column holds form fields or prose,
   * where ragged-right text is easier to read.
   */
  andText?: boolean;
  /**
   * Whether to also center vertically in the viewport, for a splash, sign-in
   * or error screen that owns the whole page. Off (default) keeps the block at
   * the top of the flow.
   */
  fullHeight?: boolean;
  /**
   * Element to render, so a centered block can be a `section` or the page
   * `main` instead of a `div`.
   */
  as?: CenterElement;
  /** Extra classes (padding, background), merged with `cn()` so they win. */
  className?: string;
}

/**
 * Center places a block of content horizontally inside a measured column,
 * with optional centered text and optional viewport-height centering.
 *
 * Use it for sign-in cards, empty states, 404 screens and any single column
 * that should sit in the middle of its parent. Center is about a block of
 * content: for the page-level wrapper with gutters use Container, and for the
 * rhythm inside the column use Stack.
 *
 * Forwards its ref to the underlying element and spreads native attributes
 * (`id`, `role`, `aria-*`, `data-*`).
 */
export const Center = forwardRef<HTMLElement, CenterProps>(function Center(
  { children, maxWidth = "md", andText = false, fullHeight = false, as = "div", className, ...rest },
  ref
) {
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "mx-auto w-full",
        maxWidthClass[maxWidth],
        andText && "text-center",
        fullHeight && "flex min-h-screen flex-col justify-center",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});

Center.displayName = "Center";
