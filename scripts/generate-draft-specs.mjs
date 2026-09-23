#!/usr/bin/env node
/**
 * Generates draft docs/specs/*.md files from component + foundation sources.
 *
 * SAFETY: this writes DRAFT SKELETONS. An existing spec is never overwritten
 * unless --force is passed, because docs/specs/ is the only copy of the
 * hand-written intent, anatomy prose and token maps, and regenerating over one
 * destroys content no template can reproduce. Use it to scaffold specs for NEW
 * components; use /update-spec to refresh an existing one.
 * The skeleton comes from .claude/shared/spec-template*.md (Component row, "Last updated",
 * `<!-- HUMAN-SECTION:* (preserved across auto-updates) -->` markers, 44x44 touch target), so
 * keep those templates as the single source for spec layout. The markdown in docs/specs/ is the
 * only documentation copy. Re-run after large API changes; refine via /update-spec.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATE = new Date().toISOString().slice(0, 10);
/** Overwriting an existing spec destroys hand-written prose, so it must be explicit. */
const FORCE = process.argv.includes("--force");

const COMPONENTS_DIR = path.join(ROOT, "packages/components/src/components");
const SPECS_DIR = path.join(ROOT, "docs/specs");
const WIDGET_TEMPLATE = path.join(ROOT, ".claude/shared/spec-template.md");
const FOUNDATION_TEMPLATE = path.join(ROOT, ".claude/shared/spec-template-foundation.md");

/**
 * Story titles and categories are DERIVED from the story files, not hand-listed.
 *
 * They used to be two hardcoded lookup tables holding 17 entries against 50
 * components, so everything added after they were written silently fell through
 * to "Components/General/{name}". Reading the real `title:` out of each
 * `*.stories.tsx` means the mapping cannot go stale, and a component with no
 * story is reported rather than mislabelled.
 */
function buildStoryMap(storiesDir) {
  const byComponent = {};
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!entry.name.endsWith(".stories.tsx")) continue;
      const src = fs.readFileSync(full, "utf8");
      const title = src.match(/title:\s*['"`]([^'"`]+)['"`]/)?.[1];
      if (!title) continue;
      // `Components/Display/Tooltip` -> category Display.
      const parts = title.split("/");
      const record = {
        story: title,
        category: parts.length >= 3 ? parts[parts.length - 2] : parts[0],
      };
      // Key by BOTH the file name and the `component:` the meta points at. A
      // component's stories are not always in a file named after its source:
      // CaseStudy.tsx exports CaseStudyBlocks, whose stories live in
      // CaseStudyBlocks.stories.tsx and CaseStudyTemplate.stories.tsx. Keying on
      // the file name alone reported it as having no story at all.
      byComponent[entry.name.replace(/\.stories\.tsx$/, "")] ??= record;
      const component = src.match(/\bcomponent:\s*([A-Za-z0-9_]+)/)?.[1];
      if (component) byComponent[component] ??= record;
    }
  };
  if (fs.existsSync(storiesDir)) walk(storiesDir);
  return byComponent;
}

const STORY_MAP = buildStoryMap(path.join(ROOT, "packages/storybook/stories"));

function extractIntent(source) {
  const m = source.match(/^\s*\/\*\*([\s\S]*?)\*\//);
  if (!m) return "[TODO: describe intent, preserved on /update-spec runs]";
  return m[1]
    .replace(/^\s*\* ?/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function fillWidgetTemplate(template, vars) {
  return template
    .replaceAll("{ComponentName}", vars.name)
    .replaceAll("{layer}", "component")
    .replaceAll("{category}", vars.category)
    .replaceAll("{file_path}", vars.filePath)
    .replaceAll("{story_path}", vars.storyPath)
    .replaceAll("{date}", DATE)
    .replaceAll("{extracted_intent_or_todo}", vars.intent);
}

function fillFoundationTemplate(template, vars) {
  return template
    .replaceAll("{Name}", vars.name)
    .replaceAll("{source}", vars.source)
    .replaceAll("{layer}", vars.layer)
    .replaceAll("{category}", vars.category)
    .replaceAll("{file_path}", vars.filePath)
    .replaceAll("{story_path}", vars.storyPath)
    .replaceAll("{date}", DATE)
    .replaceAll("{extracted_intent_or_todo}", vars.intent);
}

function main() {
  fs.mkdirSync(SPECS_DIR, { recursive: true });
  const widgetTpl = fs.readFileSync(WIDGET_TEMPLATE, "utf8");
  const foundationTpl = fs.readFileSync(FOUNDATION_TEMPLATE, "utf8");

  const written = [];
  const skipped = [];

  // Foundation: token parser
  const parserPath = path.join(ROOT, "packages/tokens/src/lib/token-parser.ts");
  const parserSrc = fs.readFileSync(parserPath, "utf8");
  const parserSpec = fillFoundationTemplate(foundationTpl, {
    name: "token-parser",
    source: "packages/tokens/src/tokens.json + styles/tokens.css",
    layer: "foundation",
    category: "tokens",
    filePath: "packages/tokens/src/lib/token-parser.ts",
    storyPath: "Foundation/Colors (indirect — CSS vars from tokens)",
    intent: extractIntent(parserSrc),
  });
  const parserOut = path.join(SPECS_DIR, "token-parser.md");
  if (fs.existsSync(parserOut) && !FORCE) {
    skipped.push("token-parser.md");
  } else {
    fs.writeFileSync(parserOut, parserSpec, "utf8");
    written.push("token-parser.md");
  }

  const files = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((f) => f.endsWith(".tsx"))
    .sort();

  for (const file of files) {
    const name = path.basename(file, ".tsx");
    const full = path.join(COMPONENTS_DIR, file);
    const src = fs.readFileSync(full, "utf8");
    // Try the source file name, then each name the file exports: a component
    // whose export differs from its file name still has to resolve.
    const exported = [...src.matchAll(/export\s+(?:const|function|class)\s+([A-Z][A-Za-z0-9_]*)/g)]
      .map((m) => m[1]);
    const mapped = STORY_MAP[name] ?? exported.map((e) => STORY_MAP[e]).find(Boolean);
    if (!mapped) console.error(`  no story found for ${name} (spec will say General)`);
    const story = mapped?.story ?? `Components/General/${name}`;
    const category = mapped?.category ?? "General";
    const md = fillWidgetTemplate(widgetTpl, {
      name,
      category,
      filePath: `packages/components/src/components/${file}`,
      storyPath: story,
      intent: extractIntent(src),
    });
    const out = path.join(SPECS_DIR, `${name}.md`);
    if (fs.existsSync(out) && !FORCE) {
      skipped.push(`${name}.md`);
      continue;
    }
    fs.writeFileSync(out, md, "utf8");
    written.push(`${name}.md`);
  }

  console.log(`Wrote ${written.length} draft spec(s) to docs/specs/`);
  written.forEach((f) => console.log(`  - ${f}`));
  if (skipped.length) {
    console.log(`Skipped ${skipped.length} existing spec(s). Use /update-spec to refresh them,`);
    console.log("or --force to overwrite (this destroys hand-written sections).");
  }
}

main();
