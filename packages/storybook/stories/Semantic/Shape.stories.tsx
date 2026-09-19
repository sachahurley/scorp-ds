import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { TokenDocTable, type TokenDocRow } from '../doc-blocks/TokenDocTable';

/**
 * Semantic / Shape
 *
 * The plate silhouettes — stepped one-bit corners applied as `clip-path`.
 * This is the system's shape language; the radius tokens are retired.
 * Components link here for the ring recipe instead of re-explaining it.
 */

const POLY_NOTE = 'polygon(…) — see tokens.css';

/** Ring-recipe plate: outer layer = ring color clipped, inner = fill clipped 1px inset. */
function RingPlate({
  clip,
  className = '',
  innerClassName = '',
  children,
}: {
  clip: string;
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`p-px bg-line-strong ${className}`} style={{ clipPath: `var(${clip})` }}>
      <div
        className={`bg-surface-card h-full w-full flex items-center justify-center font-mono text-xs text-secondary-800 dark:text-secondary-300 ${innerClassName}`}
        style={{ clipPath: `var(${clip})` }}
      >
        {children}
      </div>
    </div>
  );
}

const ROWS: TokenDocRow[] = [
  {
    swatch: <RingPlate clip="--plate-round" className="h-8 w-14" />,
    tokenLabel: 'plate.round',
    cssVar: '--plate-round',
    rawValue: POLY_NOTE,
    lightValue: '6px steps',
    darkValue: '6px steps',
    usage: 'Controls, list rows, tooltips, toasts',
  },
  {
    swatch: <RingPlate clip="--plate-round-lg" className="h-8 w-14" />,
    tokenLabel: 'plate.round-lg',
    cssVar: '--plate-round-lg',
    rawValue: POLY_NOTE,
    lightValue: '12px steps',
    darkValue: '12px steps',
    usage: 'Cards, tables, modals',
  },
  {
    swatch: <RingPlate clip="--plate-round-lg-top" className="h-8 w-14" />,
    tokenLabel: 'plate.round-lg-top',
    cssVar: '--plate-round-lg-top',
    rawValue: POLY_NOTE,
    lightValue: 'top only',
    darkValue: 'top only',
    usage: 'Bottom sheets (bottom edge squares off)',
  },
];

function ShapePage() {
  return (
    <div className="max-w-3xl space-y-8 p-6 font-mono text-foreground-primary">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl">Shape</h1>
        <p className="text-sm text-secondary-800 dark:text-secondary-300">
          Corners step like one-bit pixel art instead of curving. Two silhouettes cover every
          component: the small plate for controls, the large plate for containers. Radius tokens are
          retired.
        </p>
      </header>

      {/* Specimens */}
      <section className="flex flex-wrap items-end gap-8">
        <div className="space-y-2">
          <RingPlate clip="--plate-round" className="h-10 w-36">
            plate-round
          </RingPlate>
          <div className="text-xs text-secondary-700 dark:text-secondary-500">controls · rows · tooltips</div>
        </div>
        <div className="space-y-2">
          <RingPlate clip="--plate-round-lg" className="h-24 w-48">
            plate-round-lg
          </RingPlate>
          <div className="text-xs text-secondary-700 dark:text-secondary-500">cards · tables · modals</div>
        </div>
        <div className="space-y-2">
          <RingPlate clip="--plate-round-lg-top" className="h-24 w-48">
            plate-round-lg-top
          </RingPlate>
          <div className="text-xs text-secondary-700 dark:text-secondary-500">bottom sheets</div>
        </div>
      </section>

      {/* Token table */}
      <TokenDocTable rows={ROWS} caption="Plate silhouettes (clip-path polygons; theme-invariant)" />

      {/* The ring recipe — the one snippet components refer back to */}
      <section className="space-y-2">
        <h2 className="text-base">The ring recipe</h2>
        <p className="text-sm text-secondary-800 dark:text-secondary-300">
          `clip-path` slices real borders, so a bordered plate is two layers: the element is the
          ring color clipped to the plate, and an inner layer is the fill clipped 1px inset. Outside
          focus outlines get swallowed by the clip — use an inset ring.
        </p>
        <pre className="overflow-x-auto border border-line-default bg-surface-subtle p-4 text-xs leading-relaxed">
          {`<div className="plate-round p-px bg-line-hairline">          {/* ring */}
  <div className="plate-round bg-surface-card px-3 py-2">     {/* fill */}
    Label
  </div>
</div>

/* focus on a plate-clipped control */
.focus-visible { box-shadow: inset 0 0 0 var(--focus-ring-width) var(--focus-ring-primary); }`}
        </pre>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Semantic/Shape',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Shape: Story = { render: () => <ShapePage /> };
