/**
 * CASE STUDY BLOCKS
 *
 * The long-form section library upstreamed from the portfolio's case-study
 * pages: a typed, data-driven set of nine blocks (meta grid, headlines,
 * prose, placeholder figures with wide/full breakouts, callout grids,
 * numbered insights, pull quotes, definition lists). Author content as a
 * `CaseStudyBlock[]` array; one renderer draws them all.
 *
 * Don't use this for: app UI or dashboards — these are editorial layout
 * blocks for narrative pages. Compose app screens from components instead.
 *
 * TOKENS USED:
 * - plate.round + border.hairline (figure/placeholder ring recipe)
 * - surface.subtle / surface.muted (theme-aware hatch placeholder stripes)
 * - accent (insight numerals, quote glyph), text.primary, secondary scale
 *   in AA theme pairs (700/600 labels+captions, 800/500 body)
 * - Avatar component (quote attribution)
 *
 * Breakout figures (`width: "wide" | "full"`) size against the nearest
 * inline-size container (100cqw); give an ancestor `container-type:
 * inline-size` (or rely on the viewport fallback).
 */

import type { CSSProperties, ReactNode } from "react";
import { Avatar } from "./Avatar";

/** One section of a case-study page. The union is the authoring format. */
export type CaseStudyBlock =
  | { type: "meta"; items: { label: string; value: string }[] }
  | { type: "headline"; kicker?: string; title: string; text?: string }
  | { type: "prose"; text: string }
  | { type: "image"; aspect?: string; caption?: string; width?: "wide" | "full" }
  | { type: "imagePair"; captions?: [string, string]; width?: "wide" | "full" }
  | { type: "callouts"; items: { title: string; text: string }[] }
  | { type: "insights"; items: { title: string; text: string }[] }
  | { type: "quote"; text: string; name?: string; role?: string; image?: string }
  | { type: "list"; items: { title: string; text: string }[] };

// AA-passing theme pairs shared across blocks
const LABEL_TEXT = "text-secondary-700 dark:text-secondary-600";
const BODY_TEXT = "text-secondary-800 dark:text-secondary-500";

// Theme-aware hatch placeholder (the portfolio's stripe texture, on surface
// tokens instead of hardcoded greys)
const HATCH: CSSProperties = {
  background:
    "repeating-linear-gradient(45deg, var(--surface-subtle), var(--surface-subtle) 8px, var(--surface-muted) 8px, var(--surface-muted) 16px)",
};

type BreakWidth = "wide" | "full" | undefined;

/** Column breakouts: wide pushes ~120px past the column each side, full runs
 *  to the container margins; both stay centred and never exceed the container. */
const breakClass = (w: BreakWidth) =>
  w === "wide"
    ? " [--csb-bw:min(calc(100%+240px),calc(100cqw-48px))] w-[var(--csb-bw)] ml-[calc((100%-var(--csb-bw))/2)]"
    : w === "full"
      ? " [--csb-bw:calc(100cqw-48px)] w-[var(--csb-bw)] ml-[calc((100%-var(--csb-bw))/2)]"
      : "";

/** Hatched media placeholder on the plate ring recipe. */
function Placeholder({
  aspect,
  caption,
  width,
}: {
  aspect?: string;
  caption?: string;
  width?: BreakWidth;
}) {
  return (
    <figure className={`my-11${breakClass(width)}`}>
      <div className="plate-round p-px bg-[var(--border-hairline)]">
        <div
          className="plate-round w-full"
          style={{ aspectRatio: aspect ?? "16 / 9", ...HATCH }}
        />
      </div>
      {caption && <figcaption className={`mt-2 text-xs ${LABEL_TEXT}`}>{caption}</figcaption>}
    </figure>
  );
}

/** Shared title + blurb item used by callouts and lists. */
function TitledItem({ title, text }: { title: ReactNode; text: ReactNode }) {
  return (
    <>
      <div className="text-[var(--text-primary)]">{title}</div>
      <p className={`m-0 text-sm leading-relaxed ${BODY_TEXT}`}>{text}</p>
    </>
  );
}

function Block({ b }: { b: CaseStudyBlock }) {
  switch (b.type) {
    case "meta":
      return (
        <dl className="mb-11 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(130px,1fr))]">
          {b.items.map((it) => (
            <div key={it.label}>
              <dt className={`text-xs uppercase tracking-[0.08em] ${LABEL_TEXT}`}>{it.label}</dt>
              <dd className={`m-0 mt-1 text-sm leading-normal ${BODY_TEXT}`}>{it.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "headline":
      return (
        <header className="mb-7 mt-16 first:mt-0 sm:mt-24 sm:first:mt-0">
          {b.kicker && (
            <div className={`text-xs first-letter:uppercase ${LABEL_TEXT}`}>{b.kicker}</div>
          )}
          <h2 className="mt-2 text-xl text-[var(--text-primary)]">{b.title}</h2>
          {b.text && <p className={`mt-3 text-base leading-relaxed ${BODY_TEXT}`}>{b.text}</p>}
        </header>
      );
    case "prose":
      return <p className={`my-7 text-base leading-relaxed ${BODY_TEXT}`}>{b.text}</p>;
    case "image":
      return <Placeholder aspect={b.aspect} caption={b.caption} width={b.width} />;
    case "imagePair":
      return (
        <div className={`my-11 grid grid-cols-1 gap-3.5 sm:grid-cols-2${breakClass(b.width)}`}>
          <Placeholder aspect="4 / 3" caption={b.captions?.[0]} />
          <Placeholder aspect="4 / 3" caption={b.captions?.[1]} />
        </div>
      );
    case "callouts":
      // Subgrid rows keep every body starting on the same line however the
      // titles wrap; browsers without subgrid stack per column.
      return (
        <div className="my-11 grid gap-x-8 gap-y-7 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
          {b.items.map((it) => (
            <div key={it.title} className="grid row-span-2 gap-y-1.5 [grid-template-rows:subgrid]">
              <TitledItem title={it.title} text={it.text} />
            </div>
          ))}
        </div>
      );
    case "insights":
      return (
        <ol className="my-11 flex list-none flex-col gap-7 p-0">
          {b.items.map((it, i) => (
            <li key={it.title} className="flex gap-3.5">
              <span className="flex-none text-sm leading-6 text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <TitledItem title={it.title} text={it.text} />
              </div>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <figure className="my-11 m-0 text-lg leading-relaxed text-[var(--text-primary)]">
          <span aria-hidden="true" className="mb-2 block text-3xl leading-none text-[var(--accent)]">
            &ldquo;
          </span>
          <blockquote className="m-0 p-0">{b.text}</blockquote>
          {b.name && (
            <figcaption className="mt-4 flex items-center gap-3 text-sm">
              <Avatar size="md" src={b.image} alt="" />
              <span>
                <span className="block text-[var(--text-primary)]">{b.name}</span>
                {b.role && <span className={`block text-xs ${LABEL_TEXT}`}>{b.role}</span>}
              </span>
            </figcaption>
          )}
        </figure>
      );
    case "list":
      return (
        <ul className="my-11 flex list-none flex-col gap-7 p-0">
          {b.items.map((it) => (
            <li key={it.title}>
              <TitledItem title={it.title} text={it.text} />
            </li>
          ))}
        </ul>
      );
  }
}

/**
 * CaseStudyBlocks Component
 *
 * @param blocks - The page's sections in order (see {@link CaseStudyBlock})
 * @param className - Additional classes on the wrapper (e.g. a column width)
 */
export function CaseStudyBlocks({
  blocks,
  className = "",
}: {
  blocks: CaseStudyBlock[];
  className?: string;
}) {
  return (
    <div className={`font-mono ${className}`}>
      {blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}
    </div>
  );
}
