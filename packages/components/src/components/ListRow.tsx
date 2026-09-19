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
 * - plate.round (silhouette), surface.muted (hover fill)
 * - accent (interactive title), text.primary; meta/description use the
 *   secondary scale in AA-passing theme pairs (700/600 and 800/500)
 * - duration.fast (hover), focus inset ring (clip swallows outside outlines)
 */

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

type CommonProps = {
  /** Small line above the title (date, category). Rendered in text.tertiary. */
  meta?: ReactNode;
  /** Row title. Interactive rows (href/onClick) render it in the accent color. */
  title: ReactNode;
  /** Supporting line below the title. */
  description?: ReactNode;
  /** Trailing affordance next to the title (e.g. an external-link glyph). */
  titleSuffix?: ReactNode;
  className?: string;
};

export type ListRowProps = CommonProps &
  (
    | ({ href: string; onClick?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "title">)
    | ({ href?: never; onClick: () => void } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "title">)
    | { href?: never; onClick?: never }
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
  { meta, title, description, titleSuffix, className = "", ...rest },
  ref
) {
  const interactive = "href" in rest && rest.href != null ? "a" : "onClick" in rest && rest.onClick != null ? "button" : "div";

  const rowClasses = `
    block w-full text-left p-3 plate-round
    transition-colors [transition-duration:var(--duration-fast)]
    font-mono
    ${interactive !== "div" ? "cursor-pointer hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]" : ""}
    ${className}
  `;

  const body = (
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
