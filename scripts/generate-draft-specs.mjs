#!/usr/bin/env node
/**
 * Generates draft docs/specs/*.md files from component + foundation sources.
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

const COMPONENTS_DIR = path.join(ROOT, "packages/components/src/components");
const SPECS_DIR = path.join(ROOT, "docs/specs");
const WIDGET_TEMPLATE = path.join(ROOT, ".claude/shared/spec-template.md");
const FOUNDATION_TEMPLATE = path.join(ROOT, ".claude/shared/spec-template-foundation.md");

/** Story path hints for drift /update-spec workflows (only Button has a story today). */
const STORY_BY_COMPONENT = {
  Button: "Components/Actions/Button",
  Input: "Components/Inputs/Input",
  Textarea: "Components/Inputs/Textarea",
  Select: "Components/Inputs/Select",
  Checkbox: "Components/Inputs/Checkbox",
  Radio: "Components/Inputs/Radio",
  Switch: "Components/Inputs/Switch",
  Badge: "Components/Feedback/Badge",
  Alert: "Components/Feedback/Alert",
  Card: "Components/Display/Card",
  Avatar: "Components/Display/Avatar",
  Divider: "Components/Display/Divider",
  Tooltip: "Components/Display/Tooltip",
  TuiIcon: "Components/Display/TuiIcon",
  Modal: "Components/Overlays/Modal",
  Dropdown: "Components/Overlays/Dropdown",
  ThemeToggle: "Components/Theme/ThemeToggle",
};

const CATEGORY_BY_COMPONENT = {
  Button: "Actions",
  Input: "Inputs",
  Textarea: "Inputs",
  Select: "Inputs",
  Checkbox: "Inputs",
  Radio: "Inputs",
  Switch: "Inputs",
  Badge: "Feedback",
  Alert: "Feedback",
  Card: "Display",
  Avatar: "Display",
  Divider: "Display",
  Tooltip: "Display",
  TuiIcon: "Display",
  Modal: "Overlays",
  Dropdown: "Overlays",
  ThemeToggle: "Theme",
};

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
    .replaceAll("{ClassName}", vars.className)
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

  // Foundation: token parser
  const parserPath = path.join(ROOT, "packages/tokens/src/lib/token-parser.ts");
  const parserSrc = fs.readFileSync(parserPath, "utf8");
  const parserSpec = fillFoundationTemplate(foundationTpl, {
    name: "token-parser",
    className: "TokenParser",
    layer: "foundation",
    category: "tokens",
    filePath: "packages/tokens/src/lib/token-parser.ts",
    storyPath: "Foundation/Colors (indirect — CSS vars from tokens)",
    intent: extractIntent(parserSrc),
  });
  fs.writeFileSync(path.join(SPECS_DIR, "token-parser.md"), parserSpec, "utf8");
  written.push("token-parser.md");

  const files = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((f) => f.endsWith(".tsx"))
    .sort();

  for (const file of files) {
    const name = path.basename(file, ".tsx");
    const full = path.join(COMPONENTS_DIR, file);
    const src = fs.readFileSync(full, "utf8");
    const story = STORY_BY_COMPONENT[name] || `Components/${CATEGORY_BY_COMPONENT[name] || "General"}/${name}`;
    const category = CATEGORY_BY_COMPONENT[name] || "General";
    const md = fillWidgetTemplate(widgetTpl, {
      name,
      category,
      filePath: `packages/components/src/components/${file}`,
      storyPath: story,
      intent: extractIntent(src),
    });
    const out = path.join(SPECS_DIR, `${name}.md`);
    fs.writeFileSync(out, md, "utf8");
    written.push(`${name}.md`);
  }

  console.log(`Wrote ${written.length} draft spec(s) to docs/specs/`);
  written.forEach((f) => console.log(`  - ${f}`));
}

main();
