/**
 * visual-regression.mjs — screenshot every story in both themes and diff against
 * committed baselines.
 *
 * Scorp DS's whole value proposition is visual consistency: sharp corners, one
 * type family, exact token values. A token change can alter every component at
 * once, and until now nothing would notice. The axe pass asserts accessibility,
 * not appearance.
 *
 * This reuses the harness that already exists for the a11y runner: build
 * storybook-static, serve it locally, drive Chromium, once per theme.
 *
 * There is no interaction handling here on purpose. A story whose subject only
 * exists after a hover or a click carries a Storybook `play` function, which the
 * preview runs automatically before this script screenshots it. That keeps the
 * interaction next to the story it belongs to, where it cannot drift from it.
 * This file previously held a hardcoded map of story id to interaction, and it
 * went wrong exactly as you would expect: two ids in it were wrong and captured
 * nothing at all, in silence.
 *
 * IMPORTANT: baselines are platform-specific. Font rasterisation differs between
 * macOS and Linux, so a baseline captured on a laptop will never match CI.
 * Baselines are therefore generated and compared ONLY inside the Linux CI
 * container. Run with --update there to (re)create them.
 *
 * Usage:
 *   node scripts/visual-regression.mjs            compare against baselines
 *   node scripts/visual-regression.mjs --update   write/refresh baselines
 *   node scripts/visual-regression.mjs --filter button   only matching story ids
 */

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = join(ROOT, "packages/storybook/storybook-static");
const BASELINE = join(ROOT, "packages/storybook/visual-baselines");
const DIFFS = join(ROOT, "packages/storybook/visual-diffs");

const UPDATE = process.argv.includes("--update");
const filterIdx = process.argv.indexOf("--filter");
const FILTER = filterIdx > -1 ? process.argv[filterIdx + 1] : null;

/**
 * Per-pixel colour tolerance, and the share of pixels allowed to differ.
 *
 * PIXEL_THRESHOLD is 0.01 rather than pixelmatch's usual 0.1 because this palette
 * is dark-on-dark and the generic default assumes more contrast than it has. The
 * dark menu fill (--surface-card, #120D09) sits so close to the page background
 * that at 0.1 an entire dropdown menu appearing registers as only its border and
 * text: 1,394 px, where the true difference is 19,315. Measured across the range,
 * the cliff is between 0.01 and 0.02:
 *
 *     threshold 0     19,315 px   3.577%
 *     threshold 0.01  19,310 px   3.576%
 *     threshold 0.02   1,581 px   0.293%
 *     threshold 0.1    1,394 px   0.258%   <- previous setting
 *
 * At 0.1 that change still failed, but only by 2.6x over MAX_DIFF_RATIO; a smaller
 * element appearing would have slipped under. Not 0, which invites anti-aliasing
 * noise for a signal 0.01 already captures.
 */
const PIXEL_THRESHOLD = 0.01;
const MAX_DIFF_RATIO = 0.001;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".map": "application/json" };

if (!existsSync(join(STATIC, "index.json"))) {
  console.error("storybook-static is missing or incomplete.");
  console.error("Run: npm run build-storybook --workspace=@scorp-ds/storybook");
  process.exit(1);
}

const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = join(STATIC, p);
  if (!file.startsWith(STATIC) || !existsSync(file)) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const index = JSON.parse(readFileSync(join(STATIC, "index.json"), "utf8"));
const stories = Object.values(index.entries)
  .filter((e) => e.type === "story")
  // Docs pages are compositions of the same stories; skipping them halves the
  // run without losing coverage. Stories the a11y runner skips are skipped here
  // too, since they exist to display tokens that break the usual rules.
  .filter((e) => !(e.tags || []).includes("skip-test"))
  .filter((e) => !FILTER || e.id.includes(FILTER))
  .sort((a, b) => a.id.localeCompare(b.id));

mkdirSync(BASELINE, { recursive: true });
if (!UPDATE) { rmSync(DIFFS, { recursive: true, force: true }); mkdirSync(DIFFS, { recursive: true }); }

const browser = await chromium.launch();
let written = 0, matched = 0, failed = 0, created = 0;
const captured = [];
const failures = [];

for (const theme of ["dark", "light"]) {
  const context = await browser.newContext({
    viewport: { width: 900, height: 600 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  for (const story of stories) {
    const page = await context.newPage();
    const shots = [];
    try {
      await page.goto(`${base}/iframe.html?id=${story.id}&globals=theme:${theme}&viewMode=story`,
                      { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForSelector("#storybook-root", { timeout: 10000 });
      // Let fonts settle: a half-loaded Fragment Mono is the main flake source.
      await page.evaluate(() => document.fonts.ready);
      // Storybook runs a story's `play` function after render, so the settle wait
      // has to outlast it. 600ms covers the click-and-open interactions in this
      // repo with room to spare; a story that needs longer should say so in its
      // own play function rather than everything paying for it here.
      await page.waitForTimeout(600);
      shots.push([`${story.id}-${theme}.png`, await page.screenshot({ animations: "disabled" })]);

    } catch (err) {
      failed++;
      const why = err.message.split("\n")[0];
      // Most likely a `play` function that threw or could not find its target.
      failures.push(`${story.id}-${theme} [RENDER] ${why}`);
      console.log(`  RENDER    ${story.id}-${theme}: ${why}`);
      await page.close();
      continue;
    }

    for (const [name, shot] of shots) {
      captured.push(name);
      try {
      const baselinePath = join(BASELINE, name);
      if (UPDATE || !existsSync(baselinePath)) {
        writeFileSync(baselinePath, shot);
        UPDATE ? written++ : created++;
        if (!UPDATE) console.log(`  NEW       ${name}`);
      } else {
        const expected = PNG.sync.read(readFileSync(baselinePath));
        const actual = PNG.sync.read(shot);
        if (expected.width !== actual.width || expected.height !== actual.height) {
          failed++; failures.push(`${name} (size ${expected.width}x${expected.height} -> ${actual.width}x${actual.height})`);
          writeFileSync(join(DIFFS, name), shot);
          console.log(`  RESIZED   ${name}`);
        } else {
          const diff = new PNG({ width: expected.width, height: expected.height });
          const changed = pixelmatch(expected.data, actual.data, diff.data,
                                     expected.width, expected.height, { threshold: PIXEL_THRESHOLD });
          const ratio = changed / (expected.width * expected.height);
          if (ratio > MAX_DIFF_RATIO) {
            failed++; failures.push(`${name} (${changed} px, ${(ratio * 100).toFixed(3)}%)`);
            writeFileSync(join(DIFFS, name), PNG.sync.write(diff));
            writeFileSync(join(DIFFS, name.replace(/\.png$/, ".actual.png")), shot);
            console.log(`  CHANGED   ${name}  ${changed} px (${(ratio * 100).toFixed(3)}%)`);
          } else {
            matched++;
          }
        }
      }
      } catch (err) {
        failed++; failures.push(`${name} (${err.message.split("\n")[0]})`);
        console.log(`  ERROR     ${name}: ${err.message.split("\n")[0]}`);
      }
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
server.close();

console.log("");
if (UPDATE) {
  // Prune baselines no story produces any more. Without this, a renamed story or
  // a retired frame leaves a file behind that nothing compares against, and the
  // directory slowly fills with images that look like coverage and are not.
  const expected = new Set(captured);
  let pruned = 0;
  for (const f of readdirSync(BASELINE)) {
    if (f.endsWith(".png") && !expected.has(f)) {
      rmSync(join(BASELINE, f));
      console.log(`  PRUNED    ${f}`);
      pruned++;
    }
  }
  console.log(`Wrote ${written} baseline(s), pruned ${pruned}.`);
  process.exit(0);
}
console.log(`matched ${matched}   new ${created}   changed ${failed}`);
if (failed) {
  console.log("");
  console.log("Visual differences detected:");
  for (const f of failures) console.log(`  - ${f}`);
  console.log("");
  console.log("Diffs written to packages/storybook/visual-diffs/ (uploaded as a CI artifact).");
  console.log("If the change is intended, re-run the workflow with the update input and commit the baselines.");
  process.exit(1);
}
console.log("No visual changes.");
