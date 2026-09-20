/**
 * LIST ROW COMPONENT
 *
 * The portfolio's plate row, promoted into the DS: the list/navigation tier
 * of the container system. A row is clipped to the small plate; the clip is
 * invisible until hover fills it (surface.muted), so resting lists stay
 * quiet. Interactive rows carry the accent on their title.
 *
 * Don't use this for: framed content panels (use Card) or tabular data
 * (use Table). Rows are for scannable lists and navigation.
 *
 * TOKENS USED:
 * - plate.round (silhouette), surface.muted (hover fill; `selected` holds it)
 * - accent (interactive title), text.primary; meta/description use the
 *   secondary scale in AA-passing theme pairs (700/600 and 800/500)
 * - duration.fast (hover), focus inset ring (clip swallows outside outlines)
 */

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ElementType, type ReactNode } from "react";

type CommonProps = {
  /** Small line above the title (date, category). Rendered in text.tertiary. */
  meta?: ReactNode;
  /** Row title. Interactive rows (href/onClick) render it in the accent color. */
  title: ReactNode;
  /** Supporting line below the title. */
  description?: ReactNode;
  /** Trailing affordance next to the title (e.g. an external-link glyph). */
  titleSuffix?: ReactNode;
  /**
   * Thumbnail slot beside the text (a sized <img> or framed node; the row
   * reserves the slot with flex-shrink: 0 and never scales it).
   */
  thumb?: ReactNode;
  /** Which side the thumbnail sits on (default "start"). */
  thumbPosition?: "start" | "end";
  /**
   * Marks the row as the current selection (the active nav route, the
   * chosen item): the row holds the hover state — surface.muted fill,
   * accent title — per the SideNavigation pattern (fill + color, never
   * color alone, never weight). Nav consumers should also pass
   * `aria-current="page"` so the state is announced.
   */
  selected?: boolean;
  className?: string;
};

export type ListRowProps = CommonProps &
  (
    | ({ href: string; onClick?: never; as?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "title">)
    | ({ href?: never; onClick: () => void; as?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "title">)
    /**
     * Custom link component (e.g. a router <Link>): the row renders it with
     * interactive styling and spreads `asProps` onto it (`to`, `state`,
     * ...), so client-side navigation works without a full page load.
     */
    | { as: ElementType; asProps?: Record<string, unknown>; href?: never; onClick?: never }
    | { href?: never; onClick?: never; as?: never }
  );

/**
 * ListRow Component
 *
 * Renders an `<a>` when `href` is set, a `<button>` when `onClick` is set,
 * and a plain `<div>` for display-only rows.
 *
 * @param meta - Small tertiary line above the title (date, category)
 * @param title - Row title; accent-colored when the row is interactive
 * @param description - Supporting copy under the title
 * @param titleSuffix - Trailing glyph beside the title (external-link arrows etc.)
 */
export const ListRow = forwardRef<HTMLElement, ListRowProps>(function ListRow(
  { meta, title, description, titleSuffix, thumb, thumbPosition = "start", selected = false, className = "", ...rest },
  ref
) {
  const asComponent = "as" in rest && rest.as ? (rest.as as ElementType) : null;
  const interactive =
    asComponent ? "as" : "href" in rest && rest.href != null ? "a" : "onClick" in rest && rest.onClick != null ? "button" : "div";

  const rowClasses = `
    block w-full text-left p-3 plate-round
    transition-colors [transition-duration:var(--duration-fast)]
    font-mono
    ${interactive !== "div" ? "cursor-pointer hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]" : ""}
    ${selected ? "bg-[var(--surface-muted)]" : ""}
    ${className}
  `;

  const text = (
    <>
      {meta && <span className="block text-sm text-secondary-700 dark:text-secondary-600">{meta}</span>}
      <span
        className={`block text-base leading-6 ${
          interactive !== "div" ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
        }`}
      >
        {title}
        {titleSuffix && <span className="ml-2 leading-none">{titleSuffix}</span>}
      </span>
      {description && (
        <span className="mt-1 block text-sm leading-6 text-secondary-800 dark:text-secondary-500">{description}</span>
      )}
    </>
  );

  // With a thumbnail the row becomes a flex pair: fixed slot + shrinking
  // text column, so long titles ellipsize instead of pushing the image.
  const body = thumb ? (
    <span className={`flex items-start gap-4 ${thumbPosition === "end" ? "flex-row-reverse" : ""}`}>
      <span className="flex-shrink-0">{thumb}</span>
      <span className="block min-w-0 flex-1">{text}</span>
    </span>
  ) : (
    text
  );

  if (asComponent) {
    const { asProps } = rest as { as: ElementType; asProps?: Record<string, unknown> };
    const As = asComponent;
    return (
      <As ref={ref} className={rowClasses} {...asProps}>
        {body}
      </As>
    );
  }
  if (interactive === "a") {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={rowClasses} {...anchorRest}>
        {body}
      </a>
    );
  }
  if (interactive === "button") {
    const { onClick, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { onClick: () => void };
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} type="button" onClick={onClick} className={rowClasses} {...(buttonRest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {body}
      </button>
    );
  }
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={rowClasses}>
      {body}
    </div>
  );
});

ListRow.displayName = "ListRow";
