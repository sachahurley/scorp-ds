---
name: storybook-audit
description: Audit storybook stories, samples, and presets for token compliance — flags hardcoded values, incorrect token usage, and missing preset references.
argument-hint: <file-path-or-directory>
allowed-tools: Read, Grep, Glob
---

# Storybook Token-Usage Audit

> Before running: read `.claude/ds-config.json` to get the prefix, token class names, forbidden packages, and storybook directory paths for this project.

Scan storybook code (stories, samples, presets) for hardcoded values and incorrect token usage. This is a **read-only** audit — no files are modified.

## Reference Files

- **Audit workflow** → Follow the pattern in `.claude/shared/audit-workflow.md`
- **Token taxonomy** → Read `.claude/shared/token-taxonomy.md` for token classes and naming
- **Design tokens** → Read `design-tokens.md` for the prescriptive token-to-context mapping
- **CLAUDE.md** → Project rules

## Scope

Read `.claude/ds-config.json: paths` to get storybook directory paths.

When `$ARGUMENTS` is provided:
- If it's a **file path**, audit that single file.
- If it's a **directory**, audit all source files in that directory recursively.

When `$ARGUMENTS` is empty, audit **all** storybook code:
- `{paths.stories}/`
- `{paths.samples}/`
- `{paths.presets}/`

**Exclusions** — Do NOT flag violations in shared infrastructure files (page-structure widgets are permitted to use raw layout values for the doc shell itself).

## Checks

These checks apply to story files, samples, presets and shared widgets.

### 1. No Hardcoded Colors

Scan for:
- Hex literals (`#fff`, `#000000`) in class names or style props
- `rgb(`, `rgba(`, `hsl(`, `hsla(` values
- Raw color scales used directly (`bg-amber-400`, `text-sepia-700`). Stories must use
  the semantic aliases (`primary-*`, `secondary-*`) like components do

**Allowed exceptions:**
- Color values inside token swatch and documentation parameters (the Foundation and
  Semantic colour stories exist precisely to render raw values)
- Comments and string literals used as displayed code snippets

### 2. No Hardcoded Spacing

Scan for:
- Numeric padding/margin values in inline style props
- Arbitrary Tailwind values with bare numbers (`p-[18px]`, `gap-[7px]`)

**Allowed exceptions:**
- `0`, which is unambiguous
- Page-level document padding in story layout wrappers
- `-[var(--token)]` references and intrinsic units (`70vh`, `1lh`, `0fr`)

### 3. No Hardcoded Typography

Scan for:
- Inline `fontSize`, `fontWeight`, `fontFamily`, `letterSpacing`, `lineHeight` style props
- `font-sans` or `font-serif` classes. Scorp DS is monospace only

**Allowed exceptions:**
- Values inside code snippet content strings
- Values inside token documentation `rawValue` fields

### 4. No Border Radius

Scan for any `rounded-{sm,md,lg,xl,2xl,3xl,full}`. Scorp DS is sharp-cornered: use
`rounded-none`, or `plate-round` / `plate-round-lg` for a softened corner. There are no
radius tokens in this system.

### 5. No Hardcoded Durations

Scan for raw `ms` values in `transition`, `animationDuration` or `style` props. Use
`--duration-*` tokens.

**Allowed exceptions:**
- Durations used for demo or preview purposes (countdown timers, simulated loading)

### 6. Foundation Token Misuse

Scan for direct use of **base/foundation tokens** where **semantic tokens** should be used:
- Base color scales used directly (e.g., `{prefix}Colors.emerald500` where `{prefix}Colors.surfaceDefault` is appropriate)
- Pattern: `{prefix}Colors.{scaleName}{number}` — check context to determine if semantic token should be used instead

**Allowed exceptions:**
- Foundation token stories documenting the color scales themselves
- Token documentation rows displaying the raw token value

### 7. Missing Preset Usage

For **sample files**, check that components are instantiated via preset builder functions rather than inline:
- If a sample file directly constructs a `{prefix}*` component with full configuration, flag it as a candidate for extraction to a preset
- Small, one-off usages with just a label and callback are acceptable inline

### 8. Deprecated Package Imports

Read `.claude/ds-config.json: forbiddenPackages` and scan for any forbidden package imports.

## Running the Audit

### Step 1: Read references
Read `CLAUDE.md`, `design-tokens.md`, and `.claude/shared/token-taxonomy.md`.

### Step 2: Determine scope
Based on `$ARGUMENTS`, resolve the list of files to audit.

### Step 3: Scan each file
Run checks 1–8. Use `Grep` with the violation patterns, then `Read` to verify context.

### Step 4: Cross-reference tokens
For any `{prefix}Colors.*`, `{prefix}Spacing.*`, or `{prefix}TextStyles.*` usage, cross-reference against `design-tokens.md` to verify the token is being used in an appropriate context.

### Step 5: Report

## Output Format

```
## Storybook Token Audit: [scope description]

### Summary
- Files scanned: N
- Total violations: X
- Hardcoded colors: A
- Hardcoded spacing: B
- Hardcoded typography: C
- Hardcoded border radius: D
- Hardcoded durations: E
- Foundation token misuse: F
- Missing preset usage: G
- Deprecated imports: H

### Results by File

#### [file_path]

| # | Check | Line | Code | Issue | Suggested Fix |
|---|-------|------|------|-------|---------------|

[Repeat for each file with violations]

### Clean Files
- [file_path] — No violations found

### Recommended Fixes
1. [Specific fix: file, line, what to change]

### Token Context Warnings
[Cases where a token is used but may not match the intended context per design-tokens.md]
```

## Important

- **Do NOT modify any files.** This is a read-only audit.
- **Always verify context** before flagging — string literals, comments, and documentation content are NOT violations.
- **Use `design-tokens.md`** as the authority for which token maps to which UI context.
- **If `$ARGUMENTS` is empty**, scan all three storybook directories and produce a combined report.
- **Group results by file** for easy navigation.

## Related Skills

- `/review-component` — Audit component source files (not storybook code)
- `/storybook-check` — Audit story page structure (not token usage)
- `/token-audit` — Audit design-tokens.md sync with foundation files
- `/component-pipeline` — Full component lifecycle including storybook checks
