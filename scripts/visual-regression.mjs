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
 * Stories whose subject is only visible after an interaction.
 *
 * A resting-state screenshot is blind to anything behind hover, focus or a
 * click: a tooltip, an open menu, a modal. This was not theoretical. Changing
 * --plate-caret-height from 8px to 12px produced ZERO diffs across the tooltip
 * stories, because none of them render a tooltip until something hovers.
 *
 * Each entry produces an extra screenshot, suffixed with the state name. The
 * general-purpose alternative is a Storybook `play` function, which runs
 * automatically in the iframe; prefer that for new stories. This map covers the
 * existing ones without rewriting them.
 */
const INTERACTIONS = {
  "components-display-tooltip--positions": [
    { state: "top", hoverText: "Top" },
    { state: "left", hoverText: "Left" },
  ],
  "components-display-tooltip--on-button": [{ state: "open", hoverText: "Hover or focus me" }],
  "components-overlays-modal--with-footer": [{ state: "open", clickFirst: "button" }],
  "components-overlays-modal--docked": [{ state: "open", clickFirst: "button" }],
  "components-overlays-bottom-sheet--default": [{ state: "open", clickFirst: "button" }],
  "components-inputs-select--default": [{ state: "open", clickFirst: "button" }],
  "components-actions-dropdown--default": [{ state: "open", clickFirst: "button" }],
};

/** Per-pixel colour tolerance, and the share of pixels allowed to differ. */
const PIXEL_THRESHOLD = 0.1;
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
      await page.waitForTimeout(250);
      shots.push([`${story.id}-${theme}.png`, await page.screenshot({ animations: "disabled" })]);

      for (const step of INTERACTIONS[story.id] || []) {
        if (step.hoverText) await page.getByRole("button", { name: step.hoverText }).hover();
        if (step.hoverFirst) await page.locator(step.hoverFirst).first().hover();
        if (step.clickFirst) await page.locator(step.clickFirst).first().click();
        await page.waitForTimeout(500);
        shots.push([`${story.id}-${step.state}-${theme}.png`,
                    await page.screenshot({ animations: "disabled" })]);
      }
    } catch (err) {
      failed++; failures.push(`${story.id}-${theme} (${err.message.split("\n")[0]})`);
      console.log(`  ERROR     ${story.id}-${theme}: ${err.message.split("\n")[0]}`);
      await page.close();
      continue;
    }

    for (const [name, shot] of shots) {
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
  console.log(`Wrote ${written} baseline(s) to packages/storybook/visual-baselines/.`);
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
