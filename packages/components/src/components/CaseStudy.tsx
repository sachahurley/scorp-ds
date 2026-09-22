/**
 * CASE STUDY BLOCKS
 *
 * The long-form section library upstreamed from the portfolio's case-study
 * pages: a typed, data-driven set of eleven blocks (meta grid, headlines,
 * prose, figures with wide/full breakouts, box-drawing diagrams, live
 * slots, callout grids, numbered insights, pull quotes, definition lists).
 * Author content as a `CaseStudyBlock[]` array; one renderer draws them all.
 *
 * Figures degrade in one direction: every figure block renders the hatch
 * placeholder until it is given real content (an `src`, or a filled slot),
 * so a page can be laid out before its art exists and swapped a figure at
 * a time.
 *
 * Don't use this for: app UI or dashboards — these are editorial layout
 * blocks for narrative pages. Compose app screens from components instead.
 * The `slot` block is the escape hatch when a page needs a live component
 * inside the narrative: the page owns that markup, not this library.
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
  | {
      type: "image";
      aspect?: string;
      caption?: string;
      width?: "wide" | "full";
      /** Real artwork. Omit for the hatch placeholder. */
      src?: string;
      /** Alt text. Empty string marks the image decorative (the default when
       *  a caption already describes it). */
      alt?: string;
    }
  | {
      type: "imagePair";
      captions?: [string, string];
      width?: "wide" | "full";
      /** Real artwork per side; either entry may be omitted for the placeholder. */
      srcs?: [string | undefined, string | undefined];
      alts?: [string | undefined, string | undefined];
    }
  | {
      /** A box-drawing / monospace diagram, rendered as preformatted text
       *  rather than an image so it stays selectable and retints with the
       *  theme. Pair with @scorp-ds/tui-art to generate the string. */
      type: "ascii";
      text: string;
      caption?: string;
      width?: "wide" | "full";
      /** What the diagram says, for screen readers, which cannot read box
       *  characters. Falls back to the caption. */
      label?: string;
    }
  | {
      /** A live region the page fills via the `slots` prop — a component
       *  specimen, a chart, an embed. Renders the hatch placeholder when the
       *  named slot is empty. */
      type: "slot";
      name: string;
      caption?: string;
      width?: "wide" | "full";
      /** Reserve space at the placeholder stage; omit once the slot is filled
       *  and should size to its content. */
      aspect?: string;
    }
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

/** The shared figure shell: hairline plate ring, optional breakout, caption. */
function Figure({
  caption,
  width,
  className = "",
  children,
}: {
  caption?: string;
  width?: BreakWidth;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className={`my-11${breakClass(width)} ${className}`}>
      <div className="plate-round p-px bg-[var(--border-hairline)]">{children}</div>
      {caption && <figcaption className={`mt-2 text-xs ${LABEL_TEXT}`}>{caption}</figcaption>}
    </figure>
  );
}

/** A figure that shows real artwork when given an `src` and the hatch
 *  placeholder until then. */
function Media({
  src,
  alt,
  aspect,
  caption,
  width,
}: {
  src?: string;
  alt?: string;
  aspect?: string;
  caption?: string;
  width?: BreakWidth;
}) {
  return (
    <Figure caption={caption} width={width}>
      {src ? (
        <img
          src={src}
          // A captioned figure already names itself; alt would repeat it.
          alt={alt ?? ""}
          className="plate-round block w-full"
          style={{ aspectRatio: aspect ?? "16 / 9", objectFit: "cover" }}
        />
      ) : (
        <div
          className="plate-round w-full"
          style={{ aspectRatio: aspect ?? "16 / 9", ...HATCH }}
        />
      )}
    </Figure>
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

function Block({ b, slots }: { b: CaseStudyBlock; slots?: CaseStudySlots }) {
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
      return (
        <Media
          src={b.src}
          alt={b.alt}
          aspect={b.aspect}
          caption={b.caption}
          width={b.width}
        />
      );
    case "imagePair":
      return (
        <div className={`my-11 grid grid-cols-1 gap-3.5 sm:grid-cols-2${breakClass(b.width)}`}>
          {([0, 1] as const).map((i) => (
            <Media
              key={i}
              aspect="4 / 3"
              src={b.srcs?.[i]}
              alt={b.alts?.[i]}
              caption={b.captions?.[i]}
            />
          ))}
        </div>
      );
    case "ascii":
      // role="img" because box-drawing characters are noise read aloud; the
      // label carries the meaning instead.
      return (
        <Figure caption={b.caption} width={b.width}>
          <pre
            role="img"
            aria-label={b.label ?? b.caption ?? "diagram"}
            className={`plate-round m-0 overflow-x-auto p-5 text-xs leading-snug ${BODY_TEXT}`}
          >
            {b.text}
          </pre>
        </Figure>
      );
    case "slot": {
      const filled = slots?.[b.name];
      return filled ? (
        <Figure caption={b.caption} width={b.width}>
          <div className="plate-round overflow-hidden">{filled}</div>
        </Figure>
      ) : (
        <Media aspect={b.aspect} caption={b.caption} width={b.width} />
      );
    }
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

/** Live content for `slot` blocks, keyed by the block's `name`. */
export type CaseStudySlots = Record<string, ReactNode>;

/**
 * CaseStudyBlocks Component
 *
 * @param blocks - The page's sections in order (see {@link CaseStudyBlock})
 * @param slots - Live content for `slot` blocks; a name with no entry falls
 *   back to the hatch placeholder
 * @param className - Additional classes on the wrapper (e.g. a column width)
 */
export function CaseStudyBlocks({
  blocks,
  slots,
  className = "",
}: {
  blocks: CaseStudyBlock[];
  slots?: CaseStudySlots;
  className?: string;
}) {
  return (
    <div className={`font-mono ${className}`}>
      {blocks.map((b, i) => (
        <Block key={i} b={b} slots={slots} />
      ))}
    </div>
  );
}
