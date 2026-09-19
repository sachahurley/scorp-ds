import type { ReactNode } from 'react';

/** Row for design-system-doc-requirements.md token tables (RULE 2). */
export type TokenDocRow = {
  /** Inline swatch or preview (e.g. 24×24). */
  swatch: ReactNode;
  /** Human-readable token id (e.g. elevation.1.shadow). */
  tokenLabel: string;
  /** CSS custom property as used in components (include leading --). */
  cssVar: string;
  /**
   * Primary resolved value for handoff (often matches light theme).
   * Use for global tokens or the default theme reference.
   */
  rawValue: string;
  lightValue: string;
  darkValue: string;
  usage: string;
};

/**
 * Standard token documentation table (RULE 2): Swatch, Token name, Raw value, Light, Dark, Usage.
 */
export function TokenDocTable({ rows, caption }: { rows: TokenDocRow[]; caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-none border border-secondary-300 dark:border-secondary-700">
      <table className="w-full min-w-[720px] border-collapse text-left font-mono text-xs">
        {caption ? <caption className="caption-bottom p-2 text-secondary-800 dark:text-secondary-300">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-secondary-300 bg-secondary-100 dark:border-secondary-700 dark:bg-secondary-950">
            <th scope="col" className="p-3 font-bold text-secondary-900 dark:text-secondary-100">
              Swatch
            </th>
            <th scope="col" className="p-3 font-bold text-secondary-900 dark:text-secondary-100">
              Token name
            </th>
            <th scope="col" className="p-3 font-bold text-secondary-900 dark:text-secondary-100">
              Raw value
            </th>
            <th scope="col" className="p-3 font-bold text-secondary-900 dark:text-secondary-100">
              Light mode
            </th>
            <th scope="col" className="p-3 font-bold text-secondary-900 dark:text-secondary-100">
              Dark mode
            </th>
            <th scope="col" className="p-3 font-bold text-secondary-900 dark:text-secondary-100">
              Usage
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.cssVar + row.tokenLabel}
              className="border-b border-secondary-200 dark:border-secondary-800"
            >
              <td className="align-middle p-3">{row.swatch}</td>
              <td className="align-top p-3 text-secondary-900 dark:text-secondary-100">
                <div className="font-bold">{row.tokenLabel}</div>
                <div className="mt-0.5 text-secondary-800 dark:text-secondary-300">{row.cssVar}</div>
              </td>
              <td className="align-top p-3 break-all text-secondary-800 dark:text-secondary-300">{row.rawValue}</td>
              <td className="align-top p-3 break-all text-secondary-800 dark:text-secondary-300">{row.lightValue}</td>
              <td className="align-top p-3 break-all text-secondary-800 dark:text-secondary-300">{row.darkValue}</td>
              <td className="align-top p-3 text-secondary-800 dark:text-secondary-300">{row.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
