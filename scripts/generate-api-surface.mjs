/**
 * generate-api-surface.mjs: emit docs/contracts/api-surface.json
 *
 * One machine-readable record of every component's PUBLIC API: exported symbols,
 * props (name, type, the values it accepts, optionality, default, deprecation),
 * the native attribute sets it inherits, and an `apiHash`.
 *
 * Props are read through the TypeScript type checker, not by reading the source
 * text, so the manifest says what a caller can actually pass:
 *   - aliases are expanded: `size: ControlSizeProp` lists `sm | md | lg | small |
 *     medium | large`, and `name: TuiIconName` lists every icon;
 *   - props behind a type alias (`type LinkProps = A & (B | C)`) are listed, not `{}`;
 *   - props inherited from React's DOM types are summarised in `inherits` instead of
 *     being dropped, so `Slider` no longer looks like it takes only `label`;
 *   - a value that comes from an alias tagged `@deprecated` is listed in
 *     `deprecatedValues`, and a prop tagged `@deprecated` carries `deprecated`.
 *
 * Why a hash of the API and not of the file: spec drift used to be detected by
 * comparing modified times, which a fresh clone defeats (every file gets the same
 * checkout timestamp) and which a formatter run falsely trips. Hashing the whole
 * source has the same false-positive problem for comments and formatting. Hashing
 * only the public surface means the hash changes when, and only when, a consumer
 * of the component would notice. Descriptions are excluded for the same reason.
 *
 * Deliberately NOT included: prose. Intent, "use instead" and anatomy live in
 * docs/specs/*.md, which is hand-written and better at them. See docs/decisions/0008.
 *
 * Usage: node scripts/generate-api-surface.mjs [--check]
 *   --check  exit 1 if the committed file is out of date (for CI)
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = JSON.parse(readFileSync(join(ROOT, ".claude/ds-config.json"), "utf8"));
const OUT = join(ROOT, "docs/contracts/api-surface.json");
const COMPONENTS_SRC = join(ROOT, "packages/components/src");
const BARREL = join(COMPONENTS_SRC, "index.ts");

const LAYERS = [
  ["component", CONFIG.paths.components],
  ["primitive", CONFIG.paths.primitives],
];

/** Collapses whitespace so formatting changes never move the hash. */
const norm = (s) => s.replace(/\s+/g, " ").trim();

const printer = ts.createPrinter({ removeComments: true });
/**
 * A type node as text with comments removed, so a comment inside an inline type
 * (`| { /** note *\/ kind: "a" }`) is prose like any other JSDoc, not API.
 */
const typeText = (node) => norm(printer.printNode(ts.EmitHint.Unspecified, node, node.getSourceFile()));
const toPosix = (p) => p.split(sep).join("/");

// ─── Program ────────────────────────────────────────────────────────────────

const files = [];
for (const [, dir] of LAYERS) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) continue;
  for (const f of readdirSync(abs).filter((f) => f.endsWith(".tsx")).sort()) files.push(join(abs, f));
}

const program = ts.createProgram([BARREL, ...files], {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
});
const checker = program.getTypeChecker();

const isOwnDeclaration = (decl) => toPosix(decl.getSourceFile().fileName).startsWith(toPosix(COMPONENTS_SRC) + "/");

/** The JSDoc text of a node, whole, with whitespace collapsed. */
function jsdocOf(node) {
  for (const d of ts.getJSDocCommentsAndTags(node)) {
    const c =
      typeof d.comment === "string"
        ? d.comment
        : Array.isArray(d.comment)
          ? d.comment.map((p) => p.text ?? "").join("")
          : "";
    if (c) return norm(c);
  }
  return undefined;
}

/** `@deprecated` text on a declaration: "" when the tag has no message, undefined when absent. */
function deprecationOf(node) {
  const tag = ts.getJSDocDeprecatedTag(node);
  if (!tag) return undefined;
  const c = typeof tag.comment === "string" ? tag.comment : Array.isArray(tag.comment) ? tag.comment.map((p) => p.text ?? "").join("") : "";
  return norm(c);
}

// ─── Deprecated aliases ─────────────────────────────────────────────────────
//
// TypeScript cannot deprecate one member of a union, so a deprecated value is
// expressed as a deprecated alias (`/** @deprecated */ type LegacyControlSize =
// "small" | …`) referenced from the prop's type. A value is deprecated for a prop
// when it is a literal of such an alias and the prop's type reaches that alias,
// directly or through other aliases (`ControlSizeProp`, `Extract<ControlSizeProp, …>`).

/** alias name → { deprecated, literals, references } across the components package. */
const aliases = new Map();
for (const sf of program.getSourceFiles()) {
  if (!isOwnDeclaration(sf)) continue;
  ts.forEachChild(sf, (node) => {
    if (!ts.isTypeAliasDeclaration(node)) return;
    const refs = new Set();
    const walk = (n) => {
      if (ts.isTypeReferenceNode(n)) refs.add(n.typeName.getText());
      ts.forEachChild(n, walk);
    };
    walk(node.type);
    const type = checker.getTypeAtLocation(node.name);
    aliases.set(node.name.text, {
      deprecated: deprecationOf(node) !== undefined,
      literals: literalValues(type) ?? [],
      references: refs,
    });
  });
}

/** Every alias name reachable from a type node, following alias-to-alias references. */
function reachableAliases(typeNode) {
  const seen = new Set();
  const queue = [];
  const walk = (n) => {
    if (ts.isTypeReferenceNode(n)) queue.push(n.typeName.getText());
    ts.forEachChild(n, walk);
  };
  walk(typeNode);
  while (queue.length) {
    const name = queue.pop();
    if (seen.has(name) || !aliases.has(name)) continue;
    seen.add(name);
    queue.push(...aliases.get(name).references);
  }
  return seen;
}

// ─── Types to values ────────────────────────────────────────────────────────

/** Literal members of a type, as source text (`"sm"`, `3`), or null if any member is not a literal. */
function literalValues(type) {
  const members = type.isUnion() ? type.types : [type];
  const out = [];
  for (const t of members) {
    if (t.flags & ts.TypeFlags.Undefined) continue;
    if (t.isStringLiteral()) out.push(JSON.stringify(t.value));
    else if (t.isNumberLiteral()) out.push(String(t.value));
    else if (t.flags & ts.TypeFlags.BooleanLiteral) return null; // `boolean` reads better as a type
    else return null;
  }
  return out.length ? out : null;
}

/** Where a literal first appears in a type's source text; aliases expanded later sort after. */
function rank(text, literal) {
  const i = text.indexOf(literal);
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}

/** The interface or type alias a React DOM prop was declared on, e.g. `ButtonHTMLAttributes`. */
function inheritedFrom(decl) {
  let n = decl.parent;
  while (n && !ts.isInterfaceDeclaration(n) && !ts.isTypeAliasDeclaration(n)) n = n.parent;
  return n ? n.name.text : "native";
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
        if (!el.initializer) continue;
        // `{ size: sizeProp = "md" }` renames the binding; the prop is the property name.
        const prop = el.propertyName ?? el.name;
        if (ts.isIdentifier(prop)) defaults[prop.text] = norm(el.initializer.getText());
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return defaults;
}

/** Props of an exported interface or type alias, read through the checker. */
function propsOf(declNode, defaults) {
  const type = checker.getTypeAtLocation(declNode.name);
  const props = [];
  const inherits = new Set();

  for (const symbol of checker.getPropertiesOfType(type)) {
    const decl = symbol.valueDeclaration ?? symbol.declarations?.[0];
    if (!decl) continue;
    if (!isOwnDeclaration(decl)) {
      inherits.add(inheritedFrom(decl));
      continue;
    }
    const name = symbol.getName();
    const typeNode = ts.isPropertySignature(decl) ? decl.type : undefined;
    const propType = checker.getTypeOfSymbolAtLocation(symbol, declNode);
    const entry = {
      name,
      type: typeNode ? typeText(typeNode) : norm(checker.typeToString(propType)),
      required: !(symbol.flags & ts.SymbolFlags.Optional),
    };
    const values = literalValues(propType);
    if (values) {
      // The checker orders union members by type id; a reader expects the source
      // order (`"primary" | "secondary" | …`), so sort by where each first appears.
      const text = typeNode ? typeNode.getText() : "";
      values.sort((a, b) => rank(text, a) - rank(text, b));
      entry.values = values;
    }
    if (values && typeNode) {
      const deprecatedLiterals = new Set();
      for (const alias of reachableAliases(typeNode)) {
        const a = aliases.get(alias);
        if (a.deprecated) a.literals.forEach((l) => deprecatedLiterals.add(l));
      }
      const dv = values.filter((v) => deprecatedLiterals.has(v));
      if (dv.length) entry.deprecatedValues = dv;
    }
    if (defaults[name] !== undefined) entry.default = defaults[name];
    const deprecated = deprecationOf(decl);
    if (deprecated !== undefined) entry.deprecated = deprecated || true;
    const doc = jsdocOf(decl);
    if (doc) entry.description = doc;
    props.push(entry);
  }

  // Declaration order for own props, which is how a reader meets them in the source.
  props.sort((a, b) => order(declNode, a.name) - order(declNode, b.name));
  return { props, inherits: [...inherits].sort() };
}

/** Position of a prop name in the declaring source file, so the output follows the source. */
function order(declNode, name) {
  const text = declNode.getSourceFile().getFullText();
  const i = text.search(new RegExp(`\\n\\s*(?:readonly\\s+)?["']?${name.replace(/[$]/g, "\\$")}["']?\\??:`));
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}

/** A component is a PascalCase value export that can be called as one. */
function isComponent(node, name) {
  if (!/^[A-Z][a-z]/.test(name)) return false;
  const symbol = checker.getSymbolAtLocation(node);
  if (!symbol) return false;
  return checker.getTypeOfSymbolAtLocation(symbol, node).getCallSignatures().length > 0;
}

// ─── Per file ───────────────────────────────────────────────────────────────

function analyse(file) {
  const sf = program.getSourceFile(file);
  const exports = [];
  const propsByInterface = {};
  const defaults = defaultsFromComponent(sf);

  const isExported = (node) => node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);

  ts.forEachChild(sf, (node) => {
    if (!isExported(node)) return;

    if (ts.isFunctionDeclaration(node) && node.name) {
      exports.push({ name: node.name.text, kind: isComponent(node.name, node.name.text) ? "component" : "function" });
    } else if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) {
        if (!ts.isIdentifier(d.name)) continue;
        exports.push({ name: d.name.text, kind: isComponent(d.name, d.name.text) ? "component" : "const" });
      }
    } else if (ts.isInterfaceDeclaration(node)) {
      exports.push({ name: node.name.text, kind: "interface" });
      const { props, inherits } = propsOf(node, defaults);
      propsByInterface[node.name.text] = { props, ...(inherits.length ? { inherits } : {}) };
    } else if (ts.isTypeAliasDeclaration(node)) {
      exports.push({ name: node.name.text, kind: "type" });
      const values = literalValues(checker.getTypeAtLocation(node.name));
      if (values) {
        propsByInterface[node.name.text] = { union: values };
      } else if (/Props$/.test(node.name.text)) {
        const { props, inherits } = propsOf(node, defaults);
        propsByInterface[node.name.text] = { props, ...(inherits.length ? { inherits } : {}) };
      }
    }
  });

  return { exports, propsByInterface };
}

/**
 * The hash covers structure only: exported names and kinds, prop names, types,
 * accepted values, optionality, defaults, deprecations and inherited attribute
 * sets. Descriptions are excluded on purpose, so improving a JSDoc line does not
 * read as an API change.
 */
function apiHash({ exports, propsByInterface }) {
  const structural = {
    exports: exports.map((e) => `${e.kind}:${e.name}`).sort(),
    props: Object.fromEntries(
      Object.entries(propsByInterface).map(([k, v]) => [
        k,
        v.union
          ? v
          : {
              props: v.props
                .map((p) =>
                  [
                    p.name,
                    p.type,
                    p.required ? "req" : "opt",
                    p.default ?? "",
                    (p.values ?? []).join("|"),
                    (p.deprecatedValues ?? []).join("|"),
                    p.deprecated === undefined ? "" : "deprecated",
                  ].join(":")
                )
                .sort(),
              inherits: v.inherits ?? [],
            },
      ])
    ),
  };
  return createHash("sha256").update(JSON.stringify(structural)).digest("hex").slice(0, 16);
}

// ─── Barrel ─────────────────────────────────────────────────────────────────

/** Everything the package exports, with the file it comes from, so nothing is only findable by crawling. */
function barrelExports() {
  const sf = program.getSourceFile(BARREL);
  const moduleSymbol = checker.getSymbolAtLocation(sf);
  return checker
    .getExportsOfModule(moduleSymbol)
    .map((exp) => {
      const target = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
      const decl = target.declarations?.[0];
      const from = decl ? toPosix(relative(ROOT, decl.getSourceFile().fileName)) : "unknown";
      let kind = "const";
      if (target.flags & ts.SymbolFlags.Interface) kind = "interface";
      else if (target.flags & ts.SymbolFlags.TypeAlias) kind = "type";
      else if (decl) {
        const type = checker.getTypeOfSymbolAtLocation(target, decl);
        const callable = type.getCallSignatures().length > 0;
        kind = callable ? (/^[A-Z][a-z]/.test(exp.name) ? "component" : "function") : "const";
      }
      return { name: exp.name, kind, from };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ─── Output ─────────────────────────────────────────────────────────────────

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
  exports: barrelExports(),
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
