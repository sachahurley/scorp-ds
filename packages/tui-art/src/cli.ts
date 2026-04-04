#!/usr/bin/env node
/**
 * CLI for `@scorp-ds/tui-art` — run via `npm run tui-art` from repo root.
 *
 * Examples:
 *   npm run tui-art -- frame --title "Deploy" line-one line-two
 *   printf '%s\n' "a" "b" | npm run tui-art -- frame --style ascii
 */

import { readFile } from 'node:fs/promises';
import { frameBox } from './frame.js';
import type { BoxStyle } from './box.js';

function printHelp(): void {
  console.log(`tui-art — Scorp DS TUI string frames

Usage:
  npm run tui-art -- frame [options] [line ...]
  npm run tui-art -- frame [options] < file.txt

Options:
  --title <text>     Title row (optional)
  --width <n>        Outer width in columns (optional; auto from content)
  --style <name>     light | heavy | ascii (default: light)

Body lines:
  • Pass as extra arguments after options, or
  • Pipe stdin (one line per row).

Examples:
  npm run tui-art -- frame --title "Logs" "ok build" "warn: cache"
  printf '%s\\n' "row a" "row b" | npm run tui-art -- frame --style ascii
`);
}

function parseFrameArgs(argv: string[]): {
  title?: string;
  width?: number;
  style: BoxStyle;
  rest: string[];
} {
  let title: string | undefined;
  let width: number | undefined;
  let style: BoxStyle = 'light';
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--title') {
      title = argv[++i] ?? '';
      continue;
    }
    if (a === '--width') {
      const n = Number(argv[++i]);
      if (!Number.isFinite(n) || n < 4) {
        console.error('tui-art: --width must be a number ≥ 4');
        process.exit(1);
      }
      width = Math.floor(n);
      continue;
    }
    if (a === '--style') {
      const s = argv[++i];
      if (s !== 'light' && s !== 'heavy' && s !== 'ascii') {
        console.error('tui-art: --style must be light | heavy | ascii');
        process.exit(1);
      }
      style = s;
      continue;
    }
    if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
    if (a.startsWith('--')) {
      console.error(`tui-art: unknown flag ${a}`);
      process.exit(1);
    }
    rest.push(a);
  }
  return { title, width, style, rest };
}

async function readStdinLines(): Promise<string[]> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  if (!text.trim()) return [];
  return text.split(/\r?\n/).filter((l, idx, arr) => l.length > 0 || idx < arr.length - 1);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    printHelp();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const cmd = argv[0];
  if (cmd !== 'frame') {
    console.error(`tui-art: unknown command "${cmd}"`);
    printHelp();
    process.exit(1);
  }

  const { title, width, style, rest } = parseFrameArgs(argv.slice(1));

  let lines = rest;
  if (lines.length === 0 && !process.stdin.isTTY) {
    lines = await readStdinLines();
  }

  /** Support `npm run tui-art -- frame @path` style file input */
  if (lines.length === 1 && lines[0].startsWith('@')) {
    const path = lines[0].slice(1);
    const raw = await readFile(path, 'utf8');
    lines = raw.split(/\r?\n/);
  }

  const out = frameBox({
    lines,
    title,
    width,
    style,
  });
  console.log(out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
