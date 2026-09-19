/**
 * Border character sets for {@link frameBoxLines} and {@link formatTableRow}.
 *
 * @see docs/specs/patterns-tui-unicode-art.md for approved Unicode ranges in Scorp DS.
 */

export type BoxStyle = 'light' | 'heavy' | 'ascii';

/** Named box-drawing pieces per style (Wikipedia “Box Drawing” / heavy variants). */
export interface BoxChars {
  tl: string;
  tr: string;
  bl: string;
  br: string;
  h: string;
  v: string;
  /** Left T when drawing a horizontal rule (e.g. under a title row). */
  teeL: string;
  /** Right T for the same rule. */
  teeR: string;
}

export const BOX_CHARS: Record<BoxStyle, BoxChars> = {
  light: {
    tl: '\u250c',
    tr: '\u2510',
    bl: '\u2514',
    br: '\u2518',
    h: '\u2500',
    v: '\u2502',
    teeL: '\u251c',
    teeR: '\u2524',
  },
  heavy: {
    tl: '\u2554',
    tr: '\u2557',
    bl: '\u255a',
    br: '\u255d',
    h: '\u2550',
    v: '\u2551',
    teeL: '\u2560',
    teeR: '\u2563',
  },
  ascii: {
    tl: '+',
    tr: '+',
    bl: '+',
    br: '+',
    h: '-',
    v: '|',
    teeL: '+',
    teeR: '+',
  },
};
