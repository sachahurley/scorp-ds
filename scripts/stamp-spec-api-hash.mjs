/**
 * stamp-spec-api-hash.mjs — write each component's current apiHash into its spec.
 *
 * The spec's Status table gains an `API hash` row. detect-spec-drift.sh compares
 * that recorded value against the live one in docs/contracts/api-surface.json, so
 * "this spec is stale" becomes a deterministic fact rather than a guess from file
 * modified times (which a fresh clone or a formatter run both defeat).
 *
 * Run this when a spec has been brought back in line with its source.
 * Usage: node scripts/stamp-spec-api-hash.mjs [Component ...]   (default: all)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const surface = JSON.parse(readFileSync(join(ROOT, "docs/contracts/api-surface.json"), "utf8"));

const only = process.argv.slice(2);
let stamped = 0, skipped = 0;

for (const [name, c] of Object.entries(surface.components)) {
  if (only.length && !only.includes(name)) continue;
  const specPath = join(ROOT, c.spec);
  if (!existsSync(specPath)) { console.error(`  no spec: ${name}`); skipped++; continue; }

  let text = readFileSync(specPath, "utf8");
  const row = `| API hash | \`${c.apiHash}\` |`;

  if (/^\| API hash \| `[0-9a-f]{16}` \|$/m.test(text)) {
    const updated = text.replace(/^\| API hash \| `[0-9a-f]{16}` \|$/m, row);
    if (updated === text) { skipped++; continue; }
    text = updated;
  } else {
    // Insert directly after the "Last updated" row of the Status table.
    const m = text.match(/^\| Last updated \|.*\|$/m);
    if (!m) { console.error(`  no "Last updated" row: ${name}`); skipped++; continue; }
    text = text.replace(m[0], `${m[0]}\n${row}`);
  }
  writeFileSync(specPath, text);
  stamped++;
}
console.log(`Stamped ${stamped} spec(s), skipped ${skipped}.`);
