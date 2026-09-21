/**
 * Glyph audit: fails when any character the design system renders as text
 * would be painted by a system fallback font instead of the mono stack's
 * own faces (Fragment Mono, then Scorp Symbols).
 *
 * A fallback glyph differs per OS and breaks monospace alignment, so it is a
 * bug even when it "looks fine" on the machine that added it. Checked set:
 * TuiIcon text forms, tui-art escapes, full Box Drawing + Block Elements,
 * and every non-ASCII literal in packages/{components,tui-art,site}/src.
 *
 * Asks Chrome which physical font painted each character
 * (CSS.getPlatformFontsForNode), against the real tokens.css and the Google
 * Fonts Fragment Mono stylesheet consumers load. Needs network.
 *
 * Fix a failure by rebuilding Scorp Symbols:
 *   packages/tokens/scripts/build-scorp-symbols.py
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function sourceFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(rel));
    else if (/\.(tsx?|css)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

const chars = new Set();
const escapes = (src) => [...src.matchAll(/\\u([0-9A-Fa-f]{4})/g)].map((m) => String.fromCodePoint(parseInt(m[1], 16)));
escapes(read('packages/components/src/components/TuiIcon.tsx')).forEach((c) => chars.add(c));
sourceFiles('packages/tui-art/src').forEach((f) => escapes(read(f)).forEach((c) => chars.add(c)));
const comments = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/g;
for (const pkg of ['components', 'tui-art', 'site']) {
  for (const f of sourceFiles(`packages/${pkg}/src`)) {
    for (const c of read(f).replace(comments, '')) chars.add(c);
  }
}
for (let cp = 0x2500; cp < 0x25a0; cp++) chars.add(String.fromCodePoint(cp));
const checked = [...chars].filter((c) => c.codePointAt(0) > 0x7e).sort();

const tokensCss = read('packages/tokens/src/styles/tokens.css');
const html = `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fragment+Mono&display=block" rel="stylesheet">
<style>${tokensCss}
span{font-family:var(--font-family-mono);font-size:20px}</style>
${checked.map((c, i) => `<span id="g${i}">${c.replace('&', '&amp;').replace('<', '&lt;')}</span>`).join('')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const cdp = await page.context().newCDPSession(page);
await cdp.send('DOM.enable');
await cdp.send('CSS.enable');
const { root: doc } = await cdp.send('DOM.getDocument');

const fallbacks = [];
for (let i = 0; i < checked.length; i++) {
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: doc.nodeId, selector: `#g${i}` });
  const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
  const system = fonts.filter((f) => !f.isCustomFont).map((f) => f.familyName);
  if (system.length) {
    const cp = checked[i].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    fallbacks.push(`  ${checked[i]}  U+${cp}  -> ${system.join(', ')}`);
  }
}
await browser.close();

if (fallbacks.length) {
  console.error(`Glyph audit FAILED: ${fallbacks.length} of ${checked.length} characters render in a system fallback font:`);
  console.error(fallbacks.join('\n'));
  console.error('Rebuild the symbol face: packages/tokens/scripts/build-scorp-symbols.py');
  process.exit(1);
}
console.log(`Glyph audit passed: all ${checked.length} characters render in Fragment Mono or Scorp Symbols.`);
