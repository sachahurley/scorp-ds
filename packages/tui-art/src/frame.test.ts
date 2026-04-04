import { describe, expect, it } from 'vitest';
import { frameBox, frameBoxLines } from './frame.js';

describe('frameBoxLines', () => {
  it('builds a light box with auto width', () => {
    const lines = frameBoxLines({
      lines: ['hello', 'world'],
      style: 'light',
    });
    expect(lines).toEqual([
      '\u250c\u2500\u2500\u2500\u2500\u2500\u2510',
      '\u2502hello\u2502',
      '\u2502world\u2502',
      '\u2514\u2500\u2500\u2500\u2500\u2500\u2518',
    ]);
  });

  it('inserts title and separator', () => {
    const lines = frameBoxLines({
      title: 'Title',
      lines: ['a'],
      width: 12,
    });
    expect(lines[0]).toMatch(/^\u250c/);
    expect(lines[1]).toContain('Title');
    expect(lines[2]).toMatch(/^\u251c/); // tee
    expect(lines.at(-1)).toMatch(/\u2518$/);
  });

  it('supports ascii style', () => {
    const text = frameBox({ lines: ['x'], style: 'ascii' });
    expect(text).toContain('+');
    expect(text).toContain('|');
    expect(text).toContain('-');
  });

  it('honors fixed width and truncates long lines', () => {
    const lines = frameBoxLines({
      lines: ['abcdefghijklmnop'],
      width: 10,
      truncateMarker: '\u2026',
    });
    const body = lines[1];
    expect(body.length).toBe(10);
    expect(body).toContain('\u2026');
  });
});
