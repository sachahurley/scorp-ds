import { describe, expect, it } from 'vitest';
import { formatTableRow } from './row.js';

describe('formatTableRow', () => {
  it('pads cells between verticals', () => {
    const row = formatTableRow(['a', 'bb'], [3, 3], { style: 'light' });
    expect(row.startsWith('\u2502')).toBe(true);
    expect(row.endsWith('\u2502')).toBe(true);
    expect(row).toContain('a  ');
    expect(row).toContain('bb ');
  });

  it('supports dense ascii-friendly layout', () => {
    const row = formatTableRow(['1', '2'], [1, 1], { style: 'ascii', dense: true });
    expect(row).toBe('|1|2|');
  });
});
