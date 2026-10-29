#!/usr/bin/env node
/**
 * generate-catalog.mjs: emit docs/component-references/catalog.md
 *
 * The one page an agent or a consumer reads first: every component, what it is
 * for, what to use instead, how to import it, and every prop with the values it
 * accepts and the ones on their way out. Nothing in it is written by hand.
 *
 *   - API (props, values, deprecations, inherited attributes, exports):
 *     docs/contracts/api-surface.json, itself generated from the source.
 *   - Purpose, "use instead", status, category, story: each component's spec
 *     in docs/specs/, the only hand-written source.
 *
 * It replaces the hand-maintained per-component references that used to live in
 * this folder, which had drifted (they taught the deprecated size="medium").
 *
 * Usage: node scripts/generate-catalog.mjs [--check]
 *   --check  exit 1 if the committed file is out of date (for CI)
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs/component-references/catalog.md");
const manifest = JSON.parse(readFileSync(join(ROOT, "docs/contracts/api-surface.json"), "utf8"));

/** A `| Field | value |` row from a spec's Status table, backticks stripped. */
const statusRow = (md, field) =>
  (md.match(new RegExp(`^\\| ${field} \\| (.+?) \\|\\s*$`, "m")) || [])[1]?.replace(/`/g, "").trim();

/** The human-written intent, as paragraphs. */
function intentParagraphs(md) {
  const m = md.match(/<!-- HUMAN-SECTION:intent[^>]*-->([\s\S]*?)<!-- \/HUMAN-SECTION:intent -->/);
  if (!m) return [];
  return m[1]
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** First sentence of the first paragraph: what the component is for. */
function purpose(paragraphs) {
  const first = paragraphs[0] ?? "";
  const sentence = first.match(/^(.+?[.!?])(?=\s+[A-Z]|$)/);
  return (sentence ? sentence[1] : first).trim();
}

/**
 * The "Don't use this for: …" line, or else the first sentence that sends the
 * reader to another component of the system ("to navigate, use the `Link` component").
 */
function useInstead(paragraphs, self) {
  const explicit = paragraphs.find((p) => /^Don.t use this for:/i.test(p));
  if (explicit) return explicit.replace(/^Don.t use this for:\s*/i, "");
  for (const p of paragraphs) {
    for (const s of p.split(/(?<=[.!?])\s+(?=[A-Z`(])/)) {
      for (const m of s.matchAll(/\b(?:use|prefer|reach for)\s+(?:the\s+|a\s+|an\s+)?`?([A-Z][A-Za-z]+)/gi)) {
        if (m[1] !== self && manifest.components[m[1]]) return s;
      }
    }
  }
  return "";
}

const esc = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");

/** Accepted values, with deprecated ones struck through; falls back to the type. */
function valuesCell(prop) {
  if (!prop.values) return `\`${esc(prop.type)}\``;
  const deprecated = new Set(prop.deprecatedValues ?? []);
  return prop.values
    .map((v) => (deprecated.has(v) ? `~~\`${esc(v)}\`~~` : `\`${esc(v)}\``))
    .join(" ");
}

/** Up to the first sentence of a JSDoc description, so tables stay readable. */
function shortDoc(text) {
  if (!text) return "";
  // A sentence ends at . ! ? followed by a capital or the end, so "e.g. `_blank`" stays whole.
  const s = text.match(/^(.+?[.!?])(?=\s+[A-Z]|$)/);
  return esc((s ? s[1] : text).trim());
}

function propsTable(set) {
  const rows = set.props.map((p) => {
    const name = p.deprecated !== undefined ? `~~\`${p.name}\`~~` : `\`${p.name}\``;
    return `| ${name}${p.required ? " (required)" : ""} | ${valuesCell(p)} | ${p.default ? `\`${esc(p.default)}\`` : ""} | ${shortDoc(p.description)} |`;
  });
  const lines = ["| Prop | Accepts | Default | Use |", "|---|---|---|---|", ...rows];
  if (set.inherits?.length) lines.push("", `Also accepts the native attributes of ${set.inherits.map((i) => `\`${i}\``).join(", ")}.`);
  return lines.join("\n");
}

// ─── Assemble ───────────────────────────────────────────────────────────────

const entries = Object.entries(manifest.components).map(([name, c]) => {
  const specPath = join(ROOT, c.spec);
  const md = existsSync(specPath) ? readFileSync(specPath, "utf8") : "";
  const paragraphs = intentParagraphs(md);
  return {
    name,
    c,
    category: statusRow(md, "Category") ?? (c.layer === "primitive" ? "Layout" : "Uncategorised"),
    status: statusRow(md, "Status") ?? "unknown",
    story: statusRow(md, "Story"),
    purpose: purpose(paragraphs),
    instead: useInstead(paragraphs, name),
  };
});

const byCategory = new Map();
for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
  if (!byCategory.has(e.category)) byCategory.set(e.category, []);
  byCategory.get(e.category).push(e);
}
const categories = [...byCategory.keys()].sort();

const out = [];
out.push("# Scorp DS component catalog");
out.push("");
out.push("> Generated by `scripts/generate-catalog.mjs` from `docs/contracts/api-surface.json` and `docs/specs/`. Do not edit by hand: change the component or its spec and rerun it. CI fails when this file is stale.");
out.push("");
out.push("Read this first. Each entry says what the component is for, what to use instead, how to import it, and every prop with the values it accepts. ~~Struck-through~~ values and props still work but are deprecated: do not use them in new code. Full reasoning per component is in its spec; rules are in `CLAUDE.md`; decisions are in `docs/decisions/`.");
out.push("");
out.push("```tsx");
out.push("import '@scorp-ds/tokens/styles/tokens.css';");
out.push("import { ThemeProvider, Button } from '@scorp-ds/components';");
out.push("```");
out.push("");
out.push("## Index");
out.push("");
out.push("| Component | Category | Status | For |");
out.push("|---|---|---|---|");
for (const cat of categories) {
  for (const e of byCategory.get(cat)) {
    out.push(`| [${e.name}](#${e.name.toLowerCase()}) | ${cat} | ${e.status} | ${esc(e.purpose)} |`);
  }
}
out.push("");

const otherExports = (manifest.exports ?? []).filter(
  (x) => !Object.values(manifest.components).some((c) => c.exports.some((ce) => ce.name === x.name))
);
if (otherExports.length) {
  out.push("## Other exports");
  out.push("");
  out.push("Exported from `@scorp-ds/components` but not a component file of their own.");
  out.push("");
  out.push("| Export | Kind | From |");
  out.push("|---|---|---|");
  for (const x of otherExports) out.push(`| \`${x.name}\` | ${x.kind} | \`${x.from}\` |`);
  out.push("");
}

for (const cat of categories) {
  out.push(`## ${cat}`);
  out.push("");
  for (const e of byCategory.get(cat)) {
    const runtime = e.c.exports.filter((x) => x.kind === "component").map((x) => x.name);
    out.push(`### ${e.name}`);
    out.push("");
    if (e.purpose) out.push(e.purpose, "");
    if (e.instead) out.push(`**Use instead:** ${e.instead}`, "");
    out.push(`\`import { ${(runtime.length ? runtime : [e.name]).join(", ")} } from '${e.c.import}';\``);
    out.push("");
    const meta = [`Status: ${e.status}`, `Spec: [\`${e.c.spec}\`](../../${e.c.spec})`];
    if (e.story) meta.push(`Story: \`${e.story}\``);
    out.push(meta.join(" · "));
    out.push("");
    for (const [setName, set] of Object.entries(e.c.props)) {
      if (!set.props || set.props.length === 0) continue;
      out.push(`**\`${setName}\`**`);
      out.push("");
      out.push(propsTable(set));
      out.push("");
    }
  }
}

const text = out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";

if (process.argv.includes("--check")) {
  if (!existsSync(OUT) || readFileSync(OUT, "utf8") !== text) {
    console.error("docs/component-references/catalog.md is out of date.");
    console.error("Run: node scripts/generate-catalog.mjs");
    process.exit(1);
  }
  console.log(`catalog.md is up to date (${entries.length} components).`);
} else {
  writeFileSync(OUT, text);
  console.log(`Wrote ${OUT} (${entries.length} components).`);
}
