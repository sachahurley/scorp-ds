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
 *   node scripts/visual-regression.mjs --update   refresh baselines that changed
 *   node scripts/visual-regression.mjs --update --force   refresh every baseline
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
const FORCE = process.argv.includes("--force");
if (FORCE && !UPDATE) {
  console.error("--force only means something with --update; it is what makes an update run rewrite unchanged frames.");
  process.exit(2);
}
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
 * At 0.1 that change still failed, but only by 2.6x over the size gate; a smaller
 * element appearing would have slipped under. Not 0, which invites anti-aliasing
 * noise for a signal 0.01 already captures.
 */
const PIXEL_THRESHOLD = 0.01;

/**
 * How many differing pixels count as a real change.
 *
 * This was a ratio (0.1% of the frame, 540 px at 900x600), which is the wrong
 * model. The things most worth catching are a fixed absolute size, not a share
 * of the viewport: a focus ring is a 2px inset outline around one control, so
 * expressing the gate as a percentage of the frame guarantees that rings on
 * small controls fall under it. Measured at PIXEL_THRESHOLD 0.01:
 *
 *     Tabs focus ring                    456 px   missed by the old ratio
 *     Destructive text colour fix        191 px   missed by the old ratio
 *     Button focus ring                  544 px   cleared it by 4 px
 *     Input focus ring                   944 px   cleared it
 *
 * The floor is set from the measured noise rather than guessed. Two `--update`
 * runs at the same commit, 520 frames each, differed by exactly 0 px as measured
 * here.
 *
 * "Exactly 0 px" is true of this measurement and false of the raw bytes, and the
 * difference matters. Six frames have rewritten themselves across runs while
 * reporting 0 px: four Accordion frames, one Combobox frame, and
 * `accordion--not-collapsible-dark`. Each differs by one to three pixels in a
 * single one-pixel column, with a maximum channel delta of 29/255, and pixelmatch
 * classifies them as anti-aliasing and excludes them at ANY threshold, including
 * 0. That exclusion is correct and is what makes the 10 px gate meaningful. It is
 * also why `--update` compares before it writes; see WRITE_GATE.
 *
 * Lowered from 20 to 10 once the focus stories were measured. A focus ring on a
 * small control is the smallest real signal the suite carries, and it is small:
 *
 *     Radio focus ring     25 px
 *     Checkbox focus ring  33 px
 *     Switch focus ring   232 px
 *     Tabs focus ring     456 px
 *
 * At 20 the radio ring cleared the gate by 5 px, which is the same uncomfortable
 * margin the old ratio gate gave the button ring before it was replaced. 10
 * keeps a 2.5x margin under the smallest real signal while still sitting
 * infinitely above a measured noise floor of zero.
 *
 * If this ever starts failing everywhere at once, suspect a runner or browser
 * update rather than the components, and re-measure the noise floor before
 * raising the number.
 */
const MAX_DIFF_PIXELS = 10;

/**
 * How different a frame must be for `--update` to rewrite its baseline.
 *
 * `--update` used to write every frame unconditionally, so a refresh run committed
 * whatever happened to rasterise differently that day. #71 landed six modified
 * baselines of which two were real; telling them apart meant decoding and
 * measuring each one by hand. A refresh diff that routinely contains noise is a
 * refresh diff that gets skimmed, and skimming is how a real regression gets
 * waved through.
 *
 * So the write gate is 0: any difference the comparison can see gets written.
 * That is deliberately STRICTER than MAX_DIFF_PIXELS, so every frame the suite
 * could ever fail on is rebaselined, with margin. The only frames skipped are the
 * ones pixelmatch classifies as anti-aliasing, which it can never fail on.
 *
 * The cost, stated plainly: an INTENDED change that is both under MAX_DIFF_PIXELS
 * and anti-aliasing-classified will not be written. `--update --force` restores
 * the old unconditional behaviour and is the right tool after a Chromium or
 * runner upgrade, where a wholesale refresh is what you actually want.
 */
const WRITE_GATE = 0;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".map": "application/json" };

if (!existsSync(join(STATIC, "index.json"))) {
  console.error("storybook-static is missing or incomplete.");
  console.error("Run: npm run build-storybook --workspace=@scorp-ds/storybook");
  process.exit(1);
}

/**
 * Reads the viewport a story declares for itself, if any.
 *
 * Stories already have a way to say they need a particular width
 * (`parameters.viewport.defaultViewport`, the addon-viewport API the Storybook
 * toolbar respects), and one already used it while this harness ignored it.
 * `AppHeader/MobileMenuOpen` asks for `mobile1`, was captured at 900px, and its
 * baseline contained the desktop nav with no menu in it: a frame documenting the
 * opposite of the story's name, passing every run.
 *
 * This reads the story's OWN parameters, from the CSF file, rather than the
 * merged ones. `preview.tsx` sets a project-wide `desktopSm` that every story
 * inherits, so merged parameters cannot tell "this story asked for a width"
 * apart from "this story asked for nothing". An earlier version compared against
 * the project default instead, which worked until a story genuinely wanted the
 * same value the project declares: it would have been read as no request at all
 * and silently ignored.
 *
 * `index.json` (v5) does not carry parameters, so this asks the running preview.
 */
async function declaredViewport(page, storyId) {
  const info = await page.evaluate(async (id) => {
    const store = window.__STORYBOOK_PREVIEW__?.storyStore;
    if (!store?.loadCSFFileByStoryId) return null;
    try {
      const csf = await store.loadCSFFileByStoryId(id);
      // Story first, then the file's meta: both are author intent, unlike the
      // project default which everything inherits.
      const own =
        csf?.stories?.[id]?.parameters?.viewport ?? csf?.meta?.parameters?.viewport ?? null;
      if (!own?.defaultViewport) return null;

      // The viewport set itself only exists on the merged parameters.
      const merged = await store.loadStory({ storyId: id });
      const styles = merged?.parameters?.viewport?.viewports?.[own.defaultViewport]?.styles;
      return { name: own.defaultViewport, styles: styles ?? null };
    } catch {
      return null;
    }
  }, storyId);

  if (!info?.styles) return null;
  const width = Number.parseInt(info.styles.width, 10);
  const height = Number.parseInt(info.styles.height, 10);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  return { name: info.name, width, height };
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
  // `skip-visual` is for stories that cannot produce a stable frame: anything
  // driven by a timer or randomness renders differently on every run. They stay
  // in the a11y pass, which does not care what value a progress bar is showing.
  .filter((e) => !(e.tags || []).includes("skip-visual"))
  .filter((e) => !FILTER || e.id.includes(FILTER))
  .sort((a, b) => a.id.localeCompare(b.id));

mkdirSync(BASELINE, { recursive: true });
if (!UPDATE) { rmSync(DIFFS, { recursive: true, force: true }); mkdirSync(DIFFS, { recursive: true }); }

const browser = await chromium.launch();
let written = 0, matched = 0, failed = 0, created = 0, settled = 0;
const captured = [];
const announced = new Set();
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

      // A story that declares its own width gets it. Resizing after the first
      // render is deliberate: it is what makes matchMedia fire, which is how
      // Modal decides whether it is docked and how AppHeader decides whether to
      // fold its nav behind a toggle.
      const vp = await declaredViewport(page, story.id);
      if (vp) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(300);
        if (!announced.has(story.id)) {
          console.log(`  VIEWPORT  ${story.id} -> ${vp.name} (${vp.width}x${vp.height})`);
          announced.add(story.id);
        }
      }
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

      // A frame with no baseline is written in either mode: there is nothing to
      // compare it against. `--force` additionally rewrites every frame, which is
      // what `--update` used to do unconditionally; see WRITE_GATE below.
      if (!existsSync(baselinePath) || (UPDATE && FORCE)) {
        const isNew = !existsSync(baselinePath);
        writeFileSync(baselinePath, shot);
        UPDATE ? written++ : created++;
        // Every written frame gets a line, in both modes: an update run's output
        // should account for each file in the commit that follows it.
        console.log(`  ${isNew ? "NEW      " : "FORCED   "} ${name}`);
        continue;
      }

      const baselineBytes = readFileSync(baselinePath);
      const expected = PNG.sync.read(baselineBytes);
      const actual = PNG.sync.read(shot);

      if (expected.width !== actual.width || expected.height !== actual.height) {
        if (UPDATE) {
          writeFileSync(baselinePath, shot);
          written++;
          console.log(`  RESIZED   ${name}  ${expected.width}x${expected.height} -> ${actual.width}x${actual.height}`);
          continue;
        }
        failed++; failures.push(`${name} (size ${expected.width}x${expected.height} -> ${actual.width}x${actual.height})`);
        writeFileSync(join(DIFFS, name), shot);
        console.log(`  RESIZED   ${name}`);
        continue;
      }

      const diff = new PNG({ width: expected.width, height: expected.height });
      const changed = pixelmatch(expected.data, actual.data, diff.data,
                                 expected.width, expected.height, { threshold: PIXEL_THRESHOLD });
      const ratio = changed / (expected.width * expected.height);

      if (UPDATE) {
        if (changed > WRITE_GATE) {
          writeFileSync(baselinePath, shot);
          written++;
          console.log(`  UPDATED   ${name}  ${changed} px (${(ratio * 100).toFixed(3)}%)`);
        } else {
          settled++;
          // Only worth a line when the bytes moved: that is the case that shows up
          // as an unexplained modified file in git. `includeAA` recovers the raw
          // pixel count the gate above deliberately excludes, so the log says how
          // big the invisible difference was rather than leaving it a mystery.
          if (!shot.equals(baselineBytes)) {
            const raw = pixelmatch(expected.data, actual.data, null,
                                   expected.width, expected.height, { threshold: 0, includeAA: true });
            const why = raw ? `${raw} px, all anti-aliasing` : "identical pixels, different encoding";
            console.log(`  SETTLED   ${name}  ${why}: baseline kept`);
          }
        }
        continue;
      }

      if (changed > MAX_DIFF_PIXELS) {
        failed++; failures.push(`${name} (${changed} px, ${(ratio * 100).toFixed(3)}%)`);
        writeFileSync(join(DIFFS, name), PNG.sync.write(diff));
        writeFileSync(join(DIFFS, name.replace(/\.png$/, ".actual.png")), shot);
        console.log(`  CHANGED   ${name}  ${changed} px (${(ratio * 100).toFixed(3)}%)`);
      } else {
        matched++;
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
  //
  // Never prune a filtered run: it only captured a subset, so everything outside
  // the filter looks retired. `--update --filter x` used to delete every other
  // baseline in the directory, which is a quiet way to destroy the suite.
  if (FILTER) {
    console.log(`Wrote ${written} baseline(s), left ${settled} unchanged. Pruning skipped: --filter only captured a subset.`);
    process.exit(0);
  }
  const expected = new Set(captured);
  let pruned = 0;
  for (const f of readdirSync(BASELINE)) {
    if (f.endsWith(".png") && !expected.has(f)) {
      rmSync(join(BASELINE, f));
      console.log(`  PRUNED    ${f}`);
      pruned++;
    }
  }
  console.log(`Wrote ${written} baseline(s), left ${settled} unchanged, pruned ${pruned}.`);
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
