/**
 * generate-api-surface.mjs — emit docs/contracts/api-surface.json
 *
 * One machine-readable record of every component's PUBLIC API: exported symbols,
 * props (name, type, union members, optionality, default), and an `apiHash`.
 *
 * Why a hash of the API and not of the file: spec drift used to be detected by
 * comparing modified times, which a fresh clone defeats (every file gets the same
 * checkout timestamp) and which a formatter run falsely trips. Hashing the whole
 * source has the same false-positive problem for comments and formatting. Hashing
 * only the public surface means the hash changes when, and only when, a consumer
 * of the component would notice.
 *
 * Deliberately NOT included: prose. `useWhen` / `avoidWhen` / `composesWith` and
 * anatomy all live in docs/specs/*.md, which is hand-written and better at them.
 * This file is for tooling; the specs are for people. See docs/decisions/0008.
 *
 * Usage: node scripts/generate-api-surface.mjs [--check]
 *   --check  exit 1 if the committed file is out of date (for CI)
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = JSON.parse(readFileSync(join(ROOT, ".claude/ds-config.json"), "utf8"));
const OUT = join(ROOT, "docs/contracts/api-surface.json");

const LAYERS = [
  ["component", CONFIG.paths.components],
  ["primitive", CONFIG.paths.primitives],
];

/** Collapses whitespace so formatting changes never move the hash. */
const norm = (s) => s.replace(/\s+/g, " ").trim();

/** Splits a union type into its members; returns null when it is not a union. */
function unionMembers(typeNode) {
  if (!typeNode || !ts.isUnionTypeNode(typeNode)) return null;
  return typeNode.types.map((t) => norm(t.getText()));
}

/** Reads the first JSDoc line, used as the prop description. */
function jsdocOf(node) {
  const docs = ts.getJSDocCommentsAndTags(node);
  for (const d of docs) {
    const c = typeof d.comment === "string" ? d.comment : Array.isArray(d.comment)
      ? d.comment.map((p) => p.text ?? "").join("")
      : "";
    if (c) return norm(c);
  }
  return undefined;
}

/**
 * Finds `@default x` in a prop's JSDoc, or the default in a destructured
 * parameter. Components in this repo mostly use the latter.
 */
function defaultsFromComponent(sourceFile) {
  const defaults = {};
  const visit = (node) => {
    if (ts.isParameter(node) && node.name && ts.isObjectBindingPattern(node.name)) {
      for (const el of node.name.elements) {
        if (el.initializer && ts.isIdentifier(el.name)) {
          defaults[el.name.text] = norm(el.initializer.getText());
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return defaults;
}

function analyse(file) {
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const exports = [];
  const propsByInterface = {};
  const defaults = defaultsFromComponent(sf);

  const isExported = (node) =>
    node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);

  ts.forEachChild(sf, (node) => {
    if (!isExported(node)) return;

    if (ts.isFunctionDeclaration(node) && node.name) {
      exports.push({ name: node.name.text, kind: "function" });
    } else if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) exports.push({ name: d.name.text, kind: "const" });
      }
    } else if (ts.isInterfaceDeclaration(node)) {
      exports.push({ name: node.name.text, kind: "interface" });
      propsByInterface[node.name.text] = node.members
        .filter((m) => ts.isPropertySignature(m) && m.name)
        .map((m) => {
          const name = m.name.getText().replace(/^["']|["']$/g, "");
          const typeNode = m.type;
          const entry = {
            name,
            type: typeNode ? norm(typeNode.getText()) : "unknown",
            required: !m.questionToken,
          };
          const union = unionMembers(typeNode);
          if (union) entry.values = union;
          if (defaults[name] !== undefined) entry.default = defaults[name];
          const doc = jsdocOf(m);
          if (doc) entry.description = doc;
          return entry;
        });
    } else if (ts.isTypeAliasDeclaration(node)) {
      exports.push({ name: node.name.text, kind: "type" });
      const union = unionMembers(node.type);
      if (union) propsByInterface[node.name.text] = { union };
    }
  });

  return { exports, propsByInterface };
}

/**
 * The hash covers structure only: exported names and kinds, prop names, types,
 * optionality, union members and defaults. Descriptions are excluded on purpose,
 * so improving a JSDoc line does not read as an API change.
 */
function apiHash({ exports, propsByInterface }) {
  const structural = {
    exports: exports.map((e) => `${e.kind}:${e.name}`).sort(),
    props: Object.fromEntries(
      Object.entries(propsByInterface).map(([k, v]) => [
        k,
        Array.isArray(v)
          ? v.map((p) => `${p.name}:${p.type}:${p.required ? "req" : "opt"}:${p.default ?? ""}`).sort()
          : v,
      ])
    ),
  };
  return createHash("sha256").update(JSON.stringify(structural)).digest("hex").slice(0, 16);
}

const components = {};
for (const [layer, dir] of LAYERS) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) {
    console.error(`  SKIPPED ${layer}: no such directory (${dir})`);
    continue;
  }
  for (const f of readdirSync(abs).filter((f) => f.endsWith(".tsx")).sort()) {
    const name = f.replace(/\.tsx$/, "");
    const analysed = analyse(join(abs, f));
    components[name] = {
      layer,
      file: `${dir}/${f}`,
      spec: `docs/specs/${name}.md`,
      import: CONFIG.packages.components,
      exports: analysed.exports,
      props: analysed.propsByInterface,
      apiHash: apiHash(analysed),
    };
  }
}

const payload = {
  $schema: "./schema.json",
  generatedBy: "scripts/generate-api-surface.mjs",
  note: "Generated. Do not edit by hand. Prose lives in docs/specs/.",
  components,
};
const json = JSON.stringify(payload, null, 2) + "\n";

if (process.argv.includes("--check")) {
  if (!existsSync(OUT)) {
    console.error("api-surface.json is missing. Run: node scripts/generate-api-surface.mjs");
    process.exit(1);
  }
  if (readFileSync(OUT, "utf8") !== json) {
    console.error("api-surface.json is out of date with the component sources.");
    console.error("Run: node scripts/generate-api-surface.mjs");
    process.exit(1);
  }
  console.log(`api-surface.json is up to date (${Object.keys(components).length} components).`);
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, json);
  console.log(`Wrote ${OUT} (${Object.keys(components).length} components).`);
}
