---
name: review-component
description: Audit a component file for CLAUDE.md compliance (hardcoding, naming, docs, accessibility, tests, exports)
argument-hint: <component-file-path>
allowed-tools: Read, Grep, Glob
---

# Review Component for CLAUDE.md Compliance

> Before running: read `.claude/ds-config.json` to get the prefix, package name, forbidden packages, and directory paths for this project.

Audit the component file at `$ARGUMENTS` against every rule in CLAUDE.md and design-tokens.md.

## Reference Files

- **Audit workflow** → Follow the pattern in `.claude/shared/audit-workflow.md`
- **Token taxonomy** → Read `.claude/shared/token-taxonomy.md` for naming conventions and file paths

## Steps

1. **Read the component file** at `$ARGUMENTS`
2. **Read CLAUDE.md** and **design-tokens.md** for the current rules
3. **Run each check below** and report pass/fail with specific line numbers

## Checks

### 1. No Hardcoding

Scan for violations. These are NEVER allowed in component code:

- Raw colors: hex literals, `rgb()`, `rgba()`, `hsl()` in classes or style props
- Raw color scales: `amber-*`, `sepia-*`, `green-*`, `blue-*`, `purple-*`, `red-*`.
  Use the semantic aliases (`primary-*`, `secondary-*`, `success-*`, `info-*`,
  `warning-*`, `error-*`) so the system stays re-themeable
- Border radius: any `rounded-{sm,md,lg,xl,2xl,3xl,full}`. Scorp DS is sharp-cornered;
  use `rounded-none`, or the `plate-round` / `plate-round-lg` silhouettes for a
  softened corner. There are no radius tokens
- Sans-serif or serif font classes. Monospace (`Fragment Mono`) only
- Arbitrary Tailwind values with bare numbers (`w-[18px]`, `max-h-[300px]`).
  `-[var(--token)]`, `content-['']`, and intrinsic units (`70vh`, `1lh`, `0fr`) are
  fine; a bare pixel or rem literal is not
- Raw values inside inline `style={{ }}` objects, which class-based checks miss
- Hardcoded geometry in JS string constants (clip-path polygons, transforms). These
  are invisible to class-based linting and are a common hiding place

Only `packages/tokens/src/tokens.json` and `packages/tokens/src/styles/tokens.css` may
contain raw values.

### 2. Naming Conventions

- Component names: PascalCase and **unprefixed** (`Button`, not `ScorpButton`). The
  `@scorp-ds/components` import provides the namespace
- File names: PascalCase for components (`Button.tsx`), kebab-case for utilities
  (`token-parser.ts`)
- Props: camelCase
- CSS variables: `--color-{scale}-{step}`. Never a `--scorp-*` prefix

### 3. Documentation

- Every public component has a JSDoc comment
- Every public prop has a JSDoc comment
- Doc comments explain USAGE, not just restate the name

### 4. Accessibility

- Interactive components have an accessible label or ARIA attribute
- Color is not the sole indicator of meaning (check for icon/text pairing)
- Minimum touch target 44x44px

### 5. Architecture

Read `.claude/ds-config.json: forbiddenPackages` and verify:
- No imports from any forbidden package
- No imports going UP the dependency stack (foundation cannot import primitives/components)
- Dependency layering: `foundation ← primitives ← components ← lab`

### 6. Barrel File Export

Check that the component is exported from the appropriate barrel file.

### 7. Test Coverage

Check that a corresponding test file exists.
Flag if no test file found.

### 8. Token Usage

Cross-reference any color/spacing/typography usage against design-tokens.md.
Ensure semantic tokens are used (not base tokens directly).

## Output Format

```
## Component Review: [filename]

### Summary
- Total checks: 8
- Passed: X
- Failed: Y

### Results

#### 1. No Hardcoding — PASS/FAIL
[Details with line numbers if failed]

#### 2. Naming — PASS/FAIL
...

[Continue for all 8 checks]

### Recommended Fixes
[Numbered list of specific fixes needed, if any]
```

## Related Skills

- `/figma-import` — Generates components that this skill audits
- `/storybook-check` — Audit the component's story file for documentation compliance
- `/component-pipeline` — Runs figma-import → review-component → storybook-check → figma-build in sequence
