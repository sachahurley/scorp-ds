#!/usr/bin/env node
/**
 * new-component.mjs: scaffold a component (or primitive) with everything the
 * checks require, so step one of "New Component" in CLAUDE.md is one command.
 *
 *   npm run new:component -- <Name> --group <Group> [--primitive] [--dry-run]
 *
 * <Group> is the Storybook group: one of Actions, Display, Feedback, Inputs,
 * Navigation, Overlays, Terminal, Theme for a component. A primitive goes under
 * Primitives/<Group>/ and its group defaults to Layout.
 *
 * It writes, from the patterns of the existing small components (Kbd, VisuallyHidden):
 *   - packages/components/src/{components|primitives}/<Name>.tsx: a forwardRef
 *     stub with a `<Name>Props` interface and token-only classes;
 *   - the export in packages/components/src/index.ts;
 *   - packages/storybook/stories/{Components|Primitives}/<Group>/<Name>.stories.tsx
 *     with a Playground story;
 *   - packages/components/src/__tests__/<Name>.test.tsx, which renders it;
 *   - docs/specs/<Name>.md from .claude/shared/spec-template.md (generate-draft-specs.mjs
 *     cannot target one component, and skips primitives);
 * then runs generate-api-surface, stamp-spec-api-hash <Name> and generate-catalog,
 * so the manifest, the spec hash and the catalog are current and CI passes.
 *
 * Passing CI is not the same as finished. Every piece of prose the author must
 * write (the component JSDoc, each prop's JSDoc, the spec's Intent, the story
 * description) is a `TODO(scaffold)` placeholder. The placeholders satisfy
 * `scorp/prop-jsdoc` so the scaffold builds, and `npm run spec-status` reports
 * any spec or source still holding one as short of the bar for `stable`.
 *
 * It refuses a name that is not PascalCase or that already exists anywhere it
 * would write (source file, barrel export, story, test, spec, API manifest).
 * `--dry-run` lists what it would create and change, and writes nothing.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = JSON.parse(readFileSync(join(ROOT, ".claude/ds-config.json"), "utf8"));
const COMPONENT_GROUPS = ["Actions", "Chat", "Display", "Feedback", "Inputs", "Navigation", "Overlays", "Terminal", "Theme"];
const TODO = "TODO(scaffold)";

function fail(message) {
  console.error(`new-component: ${message}`);
  console.error("Usage: npm run new:component -- <Name> --group <Group> [--primitive] [--dry-run]");
  process.exit(1);
}

// ─── Arguments ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const option = (f) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--group");

const name = positional[0];
const primitive = flag("--primitive");
const dryRun = flag("--dry-run");
const group = option("--group") ?? (primitive ? "Layout" : undefined);

if (!name) fail("give a component name.");
if (positional.length > 1) fail(`unexpected argument: ${positional.slice(1).join(" ")}`);
if (!/^[A-Z][a-z][A-Za-z0-9]*$/.test(name)) {
  fail(`"${name}" is not PascalCase (an upper-case letter, then a lower-case one, then letters and digits: Kbd, ProgressBar).`);
}
if (!group) fail(`--group is required: one of ${COMPONENT_GROUPS.join(", ")}.`);
if (!primitive && !COMPONENT_GROUPS.includes(group)) {
  fail(`--group must be one of ${COMPONENT_GROUPS.join(", ")} (CLAUDE.md, Storybook Story Structure). Got "${group}".`);
}
if (primitive && !/^[A-Z][A-Za-z]+$/.test(group)) fail(`a primitive group is PascalCase (default Layout). Got "${group}".`);

// ─── Paths ───────────────────────────────────────────────────────────────────

const layer = primitive ? "primitive" : "component";
const srcDir = primitive ? CONFIG.paths.primitives : CONFIG.paths.components;
const srcFolder = primitive ? "primitives" : "components";
const storyRoot = primitive ? "Primitives" : "Components";
const title = `${storyRoot}/${group}/${name}`;

const files = {
  source: join(srcDir, `${name}.tsx`),
  story: join(CONFIG.paths.stories, storyRoot, group, `${name}.stories.tsx`),
  test: join(CONFIG.paths.tests, `${name}.test.tsx`),
  spec: join(CONFIG.paths.specs, `${name}.md`),
};
const BARREL = "packages/components/src/index.ts";
const abs = (p) => join(ROOT, p);

// ─── Refuse anything that exists ─────────────────────────────────────────────

const clashes = [];
for (const p of Object.values(files)) if (existsSync(abs(p))) clashes.push(p);
for (const dir of [CONFIG.paths.components, CONFIG.paths.primitives]) {
  if (existsSync(abs(join(dir, `${name}.tsx`)))) clashes.push(join(dir, `${name}.tsx`));
}
const barrel = readFileSync(abs(BARREL), "utf8");
if (new RegExp(`^export[^;]*\\b${name}\\b[^;]*;`, "m").test(barrel)) clashes.push(`${BARREL} (already exports ${name})`);
const manifest = JSON.parse(readFileSync(abs("docs/contracts/api-surface.json"), "utf8")).components;
const exported = Object.values(manifest).flatMap((c) => c.exports.map((e) => e.name));
if (manifest[name] || exported.includes(name) || exported.includes(`${name}Props`)) {
  clashes.push(`docs/contracts/api-surface.json (${name} is already a public export)`);
}
if (clashes.length) fail(`${name} already exists:\n  ${[...new Set(clashes)].join("\n  ")}`);

// ─── Templates ───────────────────────────────────────────────────────────────

const sourceText = `/**
 * ${name.toUpperCase()} ${primitive ? "PRIMITIVE" : "COMPONENT"}
 *
 * ${TODO}: say what ${name} is for, what it renders, and which tokens it uses.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

export interface ${name}Props extends HTMLAttributes<HTMLDivElement> {
  /** ${TODO}: say what this content is and how much of it belongs here. */
  children?: ReactNode;
  /** ${TODO}: say which classes a caller may add (layout, margin) and which it should not. */
  className?: string;
}

/**
 * ${TODO}: one sentence on what ${name} is for, and which component to use instead when it is not.
 *
 * \`\`\`tsx
 * <${name}>Content</${name}>
 * \`\`\`
 */
export const ${name} = forwardRef<HTMLDivElement, ${name}Props>(function ${name}(
  { children, className, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("font-mono text-sm text-[var(--text-primary)]", className)} {...rest}>
      {children}
    </div>
  );
});

${name}.displayName = "${name}";
`;

const storyText = `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from '@scorp-ds/components';

const meta: Meta<typeof ${name}> = {
  title: '${title}',
  component: ${name},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${TODO}: say what ${name} is for and what to use instead.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ${name}>;

/** Every prop on the controls panel. */
export const Playground: Story = {
  args: { children: '${name}' },
};
`;

const testText = `import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ${name} } from "../${srcFolder}/${name}";

describe("${name}", () => {
  afterEach(cleanup);

  it("renders its children", () => {
    render(<${name}>Hello</${name}>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("forwards its ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<${name} ref={ref}>Hello</${name}>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
`;

const today = new Date().toISOString().slice(0, 10);
const specText = readFileSync(abs(".claude/shared/spec-template.md"), "utf8")
  .replaceAll("{ComponentName}", name)
  .replaceAll("{layer}", layer)
  .replaceAll("{category}", group)
  .replaceAll("{file_path}", files.source)
  .replaceAll("{story_path}", title)
  .replaceAll("{date}", today)
  .replaceAll(
    "{extracted_intent_or_todo}",
    `${TODO}: say what ${name} is for, and name the component to use instead when it is not the right fit. \`npm run spec-status\` reports this spec as short of the bar until this line is gone.`
  );

const exportBlock = `export { ${name} } from './${srcFolder}/${name}';\nexport type { ${name}Props } from './${srcFolder}/${name}';\n`;
// Components go above the primitives block, primitives above the Lab barrel; else append.
const anchor = primitive ? "// Lab barrel" : "// Primitives";
const at = barrel.indexOf(anchor);
const nextBarrel = at >= 0 ? `${barrel.slice(0, at)}${exportBlock}\n${barrel.slice(at)}` : `${barrel.trimEnd()}\n\n${exportBlock}`;

const commands = [
  ["scripts/generate-api-surface.mjs"],
  ["scripts/stamp-spec-api-hash.mjs", name],
  ["scripts/generate-catalog.mjs"],
];

// ─── Write ───────────────────────────────────────────────────────────────────

if (dryRun) {
  console.log(`new-component --dry-run: ${name} (${layer}, ${title}). Nothing written.\n`);
  console.log("Would create:");
  for (const p of Object.values(files)) console.log(`  ${p}`);
  console.log("Would change:");
  console.log(`  ${BARREL} (export ${name}, ${name}Props)`);
  console.log("  docs/contracts/api-surface.json, docs/component-references/catalog.md (regenerated)");
  console.log("Would run:");
  for (const c of commands) console.log(`  node ${c.join(" ")}`);
  process.exit(0);
}

const written = [];
function write(p, text) {
  mkdirSync(dirname(abs(p)), { recursive: true });
  writeFileSync(abs(p), text);
  written.push(p);
}

write(files.source, sourceText);
writeFileSync(abs(BARREL), nextBarrel);
write(files.story, storyText);
write(files.test, testText);
write(files.spec, specText);

for (const c of commands) {
  try {
    execFileSync(process.execPath, c, { cwd: ROOT, stdio: "inherit" });
  } catch {
    console.error(`\nnew-component: \`node ${c.join(" ")}\` failed. Created so far:`);
    for (const p of written) console.error(`  ${p}`);
    console.error(`  ${BARREL} (export added)`);
    process.exit(1);
  }
}

console.log(`\nScaffolded ${name} (${layer}, story ${title}):`);
for (const p of written) console.log(`  + ${relative(ROOT, abs(p))}`);
console.log(`  ~ ${BARREL}`);
console.log("  ~ docs/contracts/api-surface.json, docs/component-references/catalog.md\n");
console.log(`Next: replace every ${TODO} placeholder (source JSDoc, props, story description, spec Intent),`);
console.log("fill the spec with /update-spec, then run `npm run lint`, `npm run type-check`, `npm test` and `npm run spec-status`.");
