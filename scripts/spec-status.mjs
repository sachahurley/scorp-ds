#!/usr/bin/env node
/**
 * spec-status.mjs: report which specs meet the bar for `stable` (decision 0026).
 *
 * A spec may move from `draft` to `stable` when:
 *   1. the component exists and the spec's API hash matches api-surface.json;
 *   2. its Intent says what the component is for AND what to use instead;
 *   3. it has an Accessibility section with content;
 *   4. the component has a story and a unit test that renders it;
 *   5. its Known Gaps table has no open row marked `blocking`;
 *   6. neither the spec's Intent nor the component source still holds a
 *      `TODO(scaffold)` placeholder from scripts/new-component.mjs.
 *
 * This only REPORTS. Promotion is a human edit to the spec's Status row: the bar
 * is necessary, not sufficient, because no check can tell whether the intent is
 * right, only whether it is there.
 *
 * Usage: node scripts/spec-status.mjs [--json]
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "docs/contracts/api-surface.json"), "utf8")).components;

function listFiles(dir, suffix) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return listFiles(p, suffix);
    return p.endsWith(suffix) ? [p] : [];
  });
}

const stories = listFiles(join(ROOT, "packages/storybook/stories"), ".stories.tsx").map((f) => readFileSync(f, "utf8"));
const tests = listFiles(join(ROOT, "packages/components/src/__tests__"), ".tsx").map((f) => readFileSync(f, "utf8"));

/** Text of a `## Heading` section, up to the next `## `. */
function section(md, heading) {
  const start = md.search(new RegExp(`^## ${heading}\\b.*$`, "m"));
  if (start < 0) return null;
  const rest = md.slice(start).split("\n").slice(1).join("\n");
  const end = rest.search(/^## /m);
  return end < 0 ? rest : rest.slice(0, end);
}

/** Section text with markers, comments and blank lines removed. */
const content = (s) => (s ?? "").replace(/<!--[\s\S]*?-->/g, "").trim();

/** The placeholder scripts/new-component.mjs leaves for the author to replace. */
const SCAFFOLD_TODO = /TODO\(scaffold\)/;

const USE_INSTEAD =/use\s+[^.]*\binstead\b|don.t use|do not use|not for\b|reach for\b/i;

/**
 * "Use `Select` when …", "Use Modal for …", "For a column use Stack": the intent
 * names another component of the system as the alternative.
 */
function namesAlternative(intent, self) {
  for (const m of intent.matchAll(/\b(?:use|prefer|reach for|pick)\s+(?:the\s+|a\s+|an\s+)?`?([A-Za-z]+)/gi)) {
    if (m[1] !== self && manifest[m[1]]) return true;
  }
  return false;
}

function runtimeNames(entry) {
  return entry.exports.filter((e) => ["component", "function", "const"].includes(e.kind)).map((e) => e.name);
}

const rows = [];
for (const [name, entry] of Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))) {
  const specPath = join(ROOT, entry.spec);
  if (!existsSync(specPath)) {
    rows.push({ name, status: "missing", checks: { spec: false }, failing: ["no spec"] });
    continue;
  }
  const md = readFileSync(specPath, "utf8");
  const status = (md.match(/^\| Status \| `?([a-z-]+)`? \|/m) || [])[1] ?? "unknown";
  const hash = (md.match(/^\| API hash \| `([0-9a-f]+)` \|/m) || [])[1];
  const intent = content(section(md, "Intent"));
  const a11y = content(section(md, "Accessibility"));
  const gaps = section(md, "Known Gaps") ?? "";
  const names = runtimeNames(entry);

  const checks = {
    "API hash current": hash === entry.apiHash,
    "intent + use instead": intent.length > 0 && (USE_INSTEAD.test(intent) || namesAlternative(intent, name)),
    accessibility: a11y.length > 0,
    story: names.some((n) => stories.some((s) => new RegExp(`\\b${n}\\b`).test(s) && s.includes("@scorp-ds/components"))),
    "rendering test": names.some((n) => tests.some((t) => new RegExp(`<${n}[\\s/>.]|\\b${n}\\(`).test(t))),
    "no blocking gap": !gaps.split("\n").some((l) => /\|\s*open\s*\|/i.test(l) && /blocking/i.test(l)),
    // scripts/new-component.mjs writes TODO(scaffold) placeholders that satisfy
    // lint and the checks above ("say what it is for and what to use instead"
    // reads as an intent with a use-instead). A placeholder is not an intent.
    "intent written": !SCAFFOLD_TODO.test(intent),
    "source JSDoc written": !(existsSync(join(ROOT, entry.file)) && SCAFFOLD_TODO.test(readFileSync(join(ROOT, entry.file), "utf8"))),
  };
  rows.push({ name, status, checks, failing: Object.keys(checks).filter((k) => !checks[k]) });
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const eligible = rows.filter((r) => r.status === "draft" && r.failing.length === 0);
const stable = rows.filter((r) => r.status === "stable");
const short = rows.filter((r) => r.status !== "stable" && r.failing.length > 0);

console.log("\n── Spec status (decision 0026) ─────────────────────────────────────────\n");
console.log(`  ${rows.length} specs: ${stable.length} stable, ${eligible.length} draft and eligible, ${short.length} short of the bar.\n`);
if (eligible.length) {
  console.log("  Meet the bar (promote by hand after reading the intent):");
  for (const r of eligible) console.log(`    ✓ ${r.name}`);
  console.log("");
}
if (short.length) {
  console.log("  Short of the bar:");
  for (const r of short) console.log(`    · ${r.name.padEnd(18)} ${r.failing.join(", ")}`);
  console.log("");
}
const wrongStable = rows.filter((r) => r.status === "stable" && r.failing.length > 0);
if (wrongStable.length) {
  console.log("  Marked stable but no longer meet the bar:");
  for (const r of wrongStable) console.log(`    ✗ ${r.name.padEnd(18)} ${r.failing.join(", ")}`);
  console.log("");
}
