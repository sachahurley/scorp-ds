#!/usr/bin/env node
/**
 * generate-token-docs.mjs: regenerate the token tables in design-tokens.md.
 *
 * design-tokens.md is mostly hand-written guidance, and that stays hand-written.
 * Only the tables between a pair of markers are generated:
 *
 *   <!-- AUTO-START:tokens-<group> -->
 *   ...table written by this script...
 *   <!-- AUTO-END:tokens-<group> -->
 *
 * Each `<group>` names an entry in GROUPS below, which says which part of
 * packages/tokens/src/tokens.json the table lists. A row is the token's JSON path,
 * its CSS custom property, its value (light and dark for a semantic group, since
 * those are the values that can differ) and its `$description` as the "Use for"
 * text. So the place to change what a row says is the token's `$description` in
 * tokens.json, never the table: the next run overwrites the table.
 *
 * The CSS variable name follows the rule in packages/tokens/src/lib/token-parser.ts
 * (path segments hyphen-joined, camelCase segments kebab-cased, the documented
 * `font-line-height` -> `line-height` alias). Every name it produces is also
 * looked up in packages/tokens/src/styles/tokens.css, and the script fails if one
 * is missing, so a table can never document a variable that does not exist.
 *
 * Usage: node scripts/generate-token-docs.mjs [--check]
 *   --check  exit 1 if any generated table in design-tokens.md is out of date (for CI)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOC = join(ROOT, "design-tokens.md");
const TOKENS = JSON.parse(readFileSync(join(ROOT, "packages/tokens/src/tokens.json"), "utf8"));
const CSS = readFileSync(join(ROOT, "packages/tokens/src/styles/tokens.css"), "utf8");
const CHECK = process.argv.includes("--check");

/**
 * The generated tables. `layer` is `global` (one value column) or `theme` (the
 * `light` and `dark` sets side by side). `paths` are dot paths into that layer;
 * a path may name a group or a single token. `sort: "value"` orders rows by their
 * numeric value instead of their JSON order, which matters where JSON key order
 * is not the reading order: `spacing.0-5` is a string key, so JavaScript lists it
 * after every integer key, and `font.size.pageTitle` (36px) was added last.
 */
const GROUPS = {
  spacing: { layer: "global", paths: ["spacing"], sort: "value" },
  "font-size": { layer: "global", paths: ["font.size"], sort: "value" },
  "line-height": { layer: "global", paths: ["font.lineHeight"] },
  "font-weight": { layer: "global", paths: ["font.weight"] },
  duration: { layer: "global", paths: ["duration"] },
  easing: { layer: "global", paths: ["easing"] },
  "z-index": { layer: "global", paths: ["zIndex"] },
  opacity: { layer: "global", paths: ["opacity"], sort: "value" },
  breakpoint: { layer: "global", paths: ["breakpoint"], sort: "value" },
  "control-size": { layer: "global", paths: ["control", "touch"] },
  "focus-geometry": { layer: "global", paths: ["focus"] },
  border: { layer: "theme", paths: ["border"] },
  focus: { layer: "theme", paths: ["focus"] },
};

// ─── Naming: the same rule as token-parser.ts ────────────────────────────────

const KEY_PREFIX_ALIASES = [["font-line-height", "line-height"]];
const toCssSegment = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
function cssVar(path) {
  let key = path.split(".").map(toCssSegment).join("-");
  for (const [from, to] of KEY_PREFIX_ALIASES) {
    if (key === from || key.startsWith(`${from}-`)) key = `${to}${key.slice(from.length)}`;
  }
  return `--${key}`;
}

// ─── Reading tokens.json ─────────────────────────────────────────────────────

const isToken = (node) => node && typeof node === "object" && "$value" in node;

function at(obj, path) {
  return path.split(".").reduce((node, part) => (node && typeof node === "object" ? node[part] : undefined), obj);
}

/** Every token under `node`, as [dot path, token], depth first in key order. */
function walk(node, path) {
  if (isToken(node)) return [[path, node]];
  if (!node || typeof node !== "object") return [];
  return Object.keys(node)
    .filter((k) => !k.startsWith("$"))
    .flatMap((k) => walk(node[k], `${path}.${k}`));
}

/** Resolves `{a.b.c}` against the theme set first, then global, like token-parser.ts. */
function resolveValue(value, theme) {
  const seen = new Set();
  let v = value;
  while (typeof v === "string" && /^\{[^}]+\}$/.test(v) && !seen.has(v)) {
    seen.add(v);
    const ref = v.slice(1, -1);
    const target = (theme && at(TOKENS[theme], ref)) || at(TOKENS.global, ref);
    if (!isToken(target)) break;
    v = target.$value;
  }
  return v;
}

const escapeCell = (s) => String(s).replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
const code = (s) => `\`${escapeCell(s)}\``;

/** A value cell: a reference shows where it points and what it resolves to. */
function valueCell(token, theme) {
  const raw = token.$value;
  const resolved = resolveValue(raw, theme);
  if (typeof raw === "string" && /^\{[^}]+\}$/.test(raw)) {
    const ref = raw.slice(1, -1).replace(/^color\./, "");
    return `${code(ref)} (${escapeCell(resolved)})`;
  }
  return code(resolved);
}

function rowsFor(group) {
  const sets = group.layer === "theme" ? ["light", "dark"] : ["global"];
  const base = TOKENS[sets[0]];
  const rows = group.paths.flatMap((p) => walk(at(base, p), p));
  if (rows.length === 0) throw new Error(`no tokens under ${group.paths.join(", ")} in ${sets[0]}`);
  if (group.sort === "value") {
    rows.sort(([, a], [, b]) => parseFloat(resolveValue(a.$value)) - parseFloat(resolveValue(b.$value)));
  }
  return rows;
}

function table(name, group) {
  const rows = rowsFor(group);
  const missing = [];
  const lines = [];

  if (group.layer === "global") {
    const withUse = rows.some(([, t]) => t.$description);
    lines.push(withUse ? "| Token | CSS variable | Value | Use for |" : "| Token | CSS variable | Value |");
    lines.push(withUse ? "|-------|--------------|-------|---------|" : "|-------|--------------|-------|");
    for (const [path, token] of rows) {
      const v = cssVar(path);
      if (!new RegExp(`${v}\\s*:`).test(CSS)) missing.push(v);
      const cells = [code(path), code(v), valueCell(token)];
      if (withUse) cells.push(escapeCell(token.$description ?? ""));
      lines.push(`| ${cells.join(" | ")} |`);
    }
  } else {
    lines.push("| Token | CSS variable | Light | Dark | Use for |");
    lines.push("|-------|--------------|-------|------|---------|");
    for (const [path, light] of rows) {
      const dark = at(TOKENS.dark, path);
      if (!isToken(dark)) throw new Error(`${path} is in light but not in dark`);
      const v = cssVar(path);
      if (!new RegExp(`${v}\\s*:`).test(CSS)) missing.push(v);
      const lightCell = valueCell(light, "light");
      const darkCell = valueCell(dark, "dark");
      // The light set's description wins; a token documented only in dark still gets one.
      const use = light.$description ?? dark.$description ?? "";
      lines.push(`| ${[code(path), code(v), lightCell, darkCell === lightCell ? "same" : darkCell, escapeCell(use)].join(" | ")} |`);
    }
  }

  if (missing.length) {
    throw new Error(`tokens-${name}: not declared in tokens.css: ${missing.join(", ")}`);
  }
  return lines.join("\n");
}

// ─── Splicing into design-tokens.md ──────────────────────────────────────────

const doc = readFileSync(DOC, "utf8");
const MARKER = /(<!-- AUTO-START:tokens-([a-z0-9-]+) -->\n)([\s\S]*?)(<!-- AUTO-END:tokens-\2 -->)/g;

const found = new Set();
const stale = [];
let failed = false;
const next = doc.replace(MARKER, (whole, start, name, body, end) => {
  if (found.has(name)) {
    console.error(`  tokens-${name}: marker appears twice`);
    failed = true;
    return whole;
  }
  found.add(name);
  const group = GROUPS[name];
  if (!group) {
    console.error(`  tokens-${name}: no such group in scripts/generate-token-docs.mjs GROUPS`);
    failed = true;
    return whole;
  }
  let generated;
  try {
    generated = `${table(name, group)}\n`;
  } catch (err) {
    console.error(`  ${err.message}`);
    failed = true;
    return whole;
  }
  if (generated !== body) stale.push(name);
  return `${start}${generated}${end}`;
});

for (const name of Object.keys(GROUPS)) {
  if (!found.has(name)) {
    console.error(`  tokens-${name}: configured but design-tokens.md has no AUTO-START:tokens-${name} marker`);
    failed = true;
  }
}
if (failed) process.exit(1);

if (CHECK) {
  if (stale.length) {
    console.error(`design-tokens.md is out of date: ${stale.map((n) => `tokens-${n}`).join(", ")}.`);
    console.error("Run `npm run tokens-doc` and commit the result. Change a row's text through the token's $description in tokens.json.");
    process.exit(1);
  }
  console.log(`design-tokens.md token tables are current (${found.size} generated).`);
} else {
  if (next !== doc) writeFileSync(DOC, next);
  console.log(`design-tokens.md: ${found.size} generated table(s), ${stale.length} rewritten${stale.length ? `: ${stale.join(", ")}` : ""}.`);
}
