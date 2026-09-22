/**
 * DESCRIPTION LIST COMPONENT (key / value)
 *
 * Term and definition pairs on a real `<dl>`: metadata panels, config
 * readouts, `neofetch`-style summaries. Each pair is a `<div>` holding one
 * `<dt>` and one `<dd>` (valid HTML grouping inside a `<dl>`).
 *
 * LAYOUTS:
 * - inline (default): term and value on one row, value right-aligned.
 *   `leader` draws a dotted rule between them (the TUI table-of-contents
 *   look). The leader is a pseudo-element on the term, so it adds no nodes
 *   to the list.
 * - stacked: small term above its value, for long values or narrow panes.
 *
 * TOKENS USED:
 * - text.secondary (terms), text.primary (values)
 * - surface.container-stroke (dotted leader, the plate ring color)
 */

import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** One term / value pair. */
export interface DescriptionListItem {
  /** The key ("Kernel", "Region"). */
  term: ReactNode;
  /** The value. Any inline content: text, a Badge, a Link. */
  description: ReactNode;
  /** Stable React key. Defaults to the index. */
  key?: string;
}

export interface DescriptionListProps {
  /** Pairs to render, in order. */
  items: DescriptionListItem[];
  /** `inline` puts term and value on one row (default); `stacked` puts the term above. */
  layout?: "inline" | "stacked";
  /** Dotted leader between term and value (inline layout only). */
  leader?: boolean;
  /** Extra classes for the `<dl>`. */
  className?: string;
}

/**
 * DescriptionList
 *
 * ```tsx
 * <DescriptionList
 *   leader
 *   items={[
 *     { term: "OS", description: "scorp-os 1.2" },
 *     { term: "Uptime", description: "4 days" },
 *   ]}
 * />
 * ```
 */
export function DescriptionList({ items, layout = "inline", leader = false, className }: DescriptionListProps) {
  const inline = layout === "inline";
  return (
    <dl
      data-layout={layout}
      className={cn("font-mono text-sm", inline ? "space-y-1" : "space-y-3", className)}
    >
      {items.map((item, i) => (
        <div
          key={item.key ?? i}
          className={inline ? "flex items-baseline justify-between gap-2" : "flex flex-col gap-0.5"}
        >
          <dt
            className={cn(
              "text-[var(--text-secondary)]",
              !inline && "text-xs uppercase tracking-wider",
              inline && !leader && "shrink-0",
              inline &&
                leader &&
                "flex flex-1 items-baseline after:mx-2 after:min-w-4 after:flex-1 after:border-b after:border-dotted after:border-[var(--surface-container-stroke)] after:content-['']"
            )}
          >
            {item.term}
          </dt>
          <dd className={cn("min-w-0 text-[var(--text-primary)]", inline && "text-right")}>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

DescriptionList.displayName = "DescriptionList";
