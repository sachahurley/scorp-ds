import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * Page-width steps. Each one is a breakpoint width, so a container stops
 * growing exactly where the next layout breakpoint begins.
 */
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeClass: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  full: "max-w-full",
};

/** Elements a Container may render as. Interactive tags are excluded on purpose. */
export type ContainerElement =
  | "div"
  | "main"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "nav"
  | "aside";

export interface ContainerProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Page content; centered inside the max width and inset by the gutters. */
  children: ReactNode;
  /**
   * Where the content stops growing: `sm` 640px, `md` 768px, `lg` 1024px
   * (default, the reading width for most pages), `xl` 1280px, `full` no limit.
   * The values track the breakpoint scale, so a container never straddles one.
   */
  size?: ContainerSize;
  /**
   * Whether to inset the content from the viewport edges (20px, 40px from
   * `lg` up). Turn it off only when a child already owns the edge, such as a
   * full-bleed image or a nested Container.
   */
  gutter?: boolean;
  /**
   * Element to render, so the page wrapper can be the real landmark
   * (`main`, `header`, `footer`, `nav`) instead of a `div`.
   */
  as?: ContainerElement;
  /** Extra classes (vertical padding, background), merged with `cn()` so they win. */
  className?: string;
}

/**
 * Container is the page-width wrapper: one max width, one set of gutters, one
 * place to change either.
 *
 * Use it as the outermost element of a page or of a full-width band, in place
 * of hand-written `mx-auto max-w-* px-*` runs. Container sets width and
 * horizontal inset only: vertical rhythm belongs to Stack, and a background
 * band belongs to a Box around the Container so the color reaches the viewport
 * edges while the text stays within the measure.
 *
 * Forwards its ref to the underlying element and spreads native attributes
 * (`id`, `role`, `aria-*`, `data-*`).
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { children, size = "lg", gutter = true, as = "div", className, ...rest },
  ref
) {
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn("mx-auto w-full", sizeClass[size], gutter && "px-5 lg:px-10", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});

Container.displayName = "Container";
