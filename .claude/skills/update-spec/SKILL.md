---
name: update-spec
description: Generate or update a spec for any DS layer (foundation, semantic, primitive, component, lab, screen) and write it to docs/specs/
argument-hint: <name e.g. "badge", "colors", "semantic-color", "box">
---

# Generate / Update Spec

> Before running: read `.claude/ds-config.json` to get the prefix, stack, and paths for this project.

Generate or update a structured spec for `$ARGUMENTS` at `docs/specs/{Name}.md`. The markdown file in the repo is the only documentation copy. Supports all layers: foundation tokens, semantic tokens, primitives, components, lab prototypes, and screen templates.

The **code is the single source of truth**. Never validate code values against Figma.

## Reference Files

- **Component spec template** -> `.claude/shared/spec-template.md`
- **Foundation spec template** → `.claude/shared/spec-template-foundation.md` (if it exists)
- **Token taxonomy** → `.claude/shared/token-taxonomy.md` for foundation file paths and token class names
- **Design tokens guide** → `design-tokens.md` for token-to-context mapping
- **CLAUDE.md** → Project rules

## Steps

### 1. Resolve layer and source file

Read `.claude/ds-config.json: paths` to get all source directories.

**1a. Semantic token groups** — If `$ARGUMENTS` starts with `semantic-`, extract the domain and map to its source file:

| Argument | Source File | Layer |
|----------|-----------|-------|
| `semantic-color` | `{paths.foundation}/colors.{ext}` | semantic |
| `semantic-spacing` | `{paths.foundation}/spacing.{ext}` | semantic |
| `semantic-typography` | `{paths.foundation}/typography.{ext}` | semantic |

Set layer = `semantic`. Only extract tokens within `// SEMANTIC TOKENS - *` section headers.

**1b. All other names** — Search in this order (first match wins):

| Priority | Path Pattern | Layer |
|----------|-------------|-------|
| 1 | `{paths.components}/$ARGUMENTS.{ext}` | component |
| 2 | `{paths.primitives}/$ARGUMENTS.{ext}` | primitive |
| 3 | `{paths.foundation}/$ARGUMENTS.{ext}` | foundation |
| 4 | `{paths.lab}/$ARGUMENTS.{ext}` | lab |
| 5 | `{paths.samples}/${ARGUMENTS}_sample.{ext}` | screen |

**If no file is found**, abort with an error listing all available names across all layers.

**Foundation exclusions** — These files are infrastructure, not token definitions. Never generate specs for barrel files, theme files, or color_scheme infrastructure files.

**1c. Select template:**
- foundation / semantic → `.claude/shared/spec-template-foundation.md` (if exists, else use main template)
- primitive / component / lab / screen → `.claude/shared/spec-template.md`

### 2. Extract data from source

#### For foundation layer

The token source of truth is `packages/tokens/src/tokens.json` (W3C Design Token
format), not a set of per-domain source files. Parse it and, for each token, extract:
- Token name and its full JSON path
- `$type` (color, fontSize, duration, clipPath, borderWidth, etc.)
- `$value`, resolving any `{group.token}` reference to its final value
- `$description`

`global` holds foundation tokens. `light` and `dark` hold semantic tokens with
identical key sets.

For a foundation-layer TypeScript utility (such as `token-parser.ts`), parse its
exported functions and types instead.

#### For semantic layer

Extract from the `light` and `dark` objects. For each token, resolve the **base
reference**: the `global` token its `$value` points at. Record both the reference and
the resolved value per theme, since light and dark differ.

#### For component layers (primitive, component, screen)

Extract from the source code:

**Variants, sizes and states** - These are union-typed props in TypeScript, not enums.
Read the prop type union members and the JSDoc on each. Sizes are `sm | md | lg`
(legacy `small | medium | large` aliases still resolve with a dev warning).

**Public props** - Parse the props interface or type. For each prop record: name, type
(including full union members), default value, whether required, and its JSDoc.
Remember to cover `className`, `ref`, and any spread of native element attributes.

**Token references** - Grep the component for:
- Tailwind classes backed by tokens (`bg-primary-400`, `text-secondary-700`,
  `h-control-md`, `plate-round`)
- Direct `var(--token-name)` references, including inside `-[var(...)]` arbitrary values
- Token names used in inline `style={{ }}` objects

For each, record the custom property name, its category, its resolved light and dark
values, and where it is used.

**Hardcoded values** - Scan for violations per the CLAUDE.md rules: hex/rgb/hsl,
`rounded-*` other than `rounded-none`, raw colour scales instead of semantic aliases,
sans-serif fonts, and arbitrary Tailwind values with bare numbers. Also check inline
`style` objects and JS string constants (clip-path polygons, transforms), which
class-based scanning misses. Flag each with file path, line number and raw value.

**Child dependencies** - Find any other design-system components rendered inside this
one.

**Intent extraction** - Find the JSDoc block preceding the component declaration.
Strip comment markers and join with newlines. Store as `extracted_intent`.

### 3. Check Storybook coverage

Read `.claude/ds-config.json: paths.stories` and search for a story matching the expected path pattern:

| Layer | Story path pattern |
|-------|--------------------|
| foundation | `Foundation/{Name}` |
| semantic | `Semantic/{Name}` |
| primitive | `Primitives/{Name}` |
| component | `Components/{Category}/{Name}` |
| lab | `Lab/{Name}` |
| screen | `Screens/{Name}` |

If no story file is found, flag "Storybook entry: MISSING".

For **foundation/semantic**, coverage = what percentage of token definitions appear as visual examples in the story.

For **component layers**, extract which variants/sizes/states are demonstrated and calculate coverage percentage.

### 4. Resolve Storybook live preview URL

Read `.claude/ds-config.json: project.storybookUrl`. Build the live preview URL by appending the story path hash.

If no story file exists, leave the live preview URL empty.

### 5. Check for existing spec

Check if `docs/specs/$ARGUMENTS.md` already exists.

**If it exists:**
- Read the file
- Preserve ALL content between `<!-- HUMAN-SECTION:* ... -->` and `<!-- /HUMAN-SECTION:* -->` markers exactly as written, **except**: if intent content is still the unmodified TODO placeholder, replace it with `extracted_intent` (if available)
- Preserve `Status`, `Version`, and existing Changelog/Known Gaps rows
- Regenerate all content between `<!-- AUTO-START:* -->` and `<!-- AUTO-END:* -->` markers (except `changelog` — that is append-only)
- If the Status table still uses the old layout (an external page ID row or a `Last synced` row), migrate it to the template layout: drop the page ID row, rename `Last synced` to `Last updated`, and make sure the first row is `| Component | \`{Name}\` (import from \`@scorp-ds/components\`) |`
- Match markers by prefix (`HUMAN-SECTION:*`, `AUTO-START:*`, `AUTO-END:*`) so older marker wording is still recognized. When writing, use the template format: `<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->`

**If it does not exist:**
- Use the appropriate template as the starting point
- Set status to `draft`
- Set version to `v1`
- Set the Component row to `| Component | \`{Name}\` (import from \`@scorp-ds/components\`) |`
- Substitute `extracted_intent` if available, else keep the TODO placeholder

### 6. Derive status proposal

After collecting all data, evaluate whether the spec qualifies for a status transition. Status flows in one direction: `draft` → `design-complete` → `production-complete`. Never propose a downgrade.

**Skip this step if:**
- The spec is brand new (starts at `draft`)
- The spec is already `production-complete`

**Criteria for `draft` → `design-complete`:**
- Intent section contains real content (not the TODO placeholder)
- At least one of: Figma link present, or Live Preview URL resolved

**Criteria for `design-complete` → `production-complete`:**
- Storybook coverage ≥ 80%
- Zero hardcoded values (component) OR zero coverage gaps (foundation/semantic)
- Test file exists
- Static analysis passes for the source file

If criteria are met, present the proposal and wait for user confirmation.

### 7. Write the spec

Write to `docs/specs/$ARGUMENTS.md`. Update the "Last updated" date to today.

Fill all auto-generated sections based on data extracted in Steps 2-3. See `.claude/shared/spec-template.md` for section structure. In the Accessibility section, the touch target minimum is 44x44.

### 8. Propose version bump (existing specs only)

Skip for brand-new specs (they start at `v1`).

For existing specs, compare newly generated sections against the previous file to detect breaking or structural changes only:

**Changes that trigger a bump proposal:**
- Component: props added/removed/renamed/type changed, tokens added/removed, union members added/removed
- Foundation/semantic: tokens added, removed, or raw values changed

**Changes that do NOT trigger a bump:** storybook coverage changes, gap entries, wording changes, date updates.

If triggered, present the proposal and wait for user confirmation.

### 9. Append changelog entries

After the version decision, append changelog entries.

**Determine change type:** `spec-created`, `tokens-changed`, or `spec-updated`.

**Skip** if the only change was the "Last updated" date.

**Per-spec changelog:** Prepend a new row to the `<!-- AUTO-START:changelog -->` section (newest first).

**Global changelog:** Prepend a new row to `docs/specs/CHANGELOG.md` (newest first).

### 10. Output summary

```
## Spec Update: [name]

### Layer
{layer} ({file_path})

### Changes
- Spec file: Created / Updated at docs/specs/[name].md
- Sections regenerated: [list]
- Human sections preserved: [list, or "N/A - new spec"]

### Token Map / Token Definitions ([count] tokens)

### Properties ([count] props)  <- component specs only

### Storybook Coverage
- Coverage: [percent]%
- Gaps: [list, or "None"]

### Hardcoded Values  <- component specs only
[List with line numbers, or "None found"]

### Version
- Current: v[N]
- Bump proposed: Yes / No
- User confirmed: Yes / No / N/A

### Status
- Current: [draft / design-complete / production-complete]
- Transition proposed: Yes / No
- User confirmed: Yes / No / N/A
```

## Important

- **Code is the source of truth.** Never validate code values against Figma.
- **Never overwrite human-written sections** (content between `HUMAN-SECTION` markers).
- **Never mark a Known Gap as resolved** — only the user does that.
- **Never change the status field** without user confirmation.
- **Never bump the version** without user confirmation.
- **Changelog is append-only.** Never remove or edit existing changelog rows.
- **If a token reference is ambiguous**, flag it as "Review needed" rather than guessing.
- **If the source file does not exist**, abort immediately and list available names across all layers.

## Related Skills

- `/sync-specs` — Batch-detect changes and run this skill for each
- `/review-component` — Audit the component for CLAUDE.md compliance
- `/audit-cascade` — Trace token change impact across components
- `/storybook-check` — Verify the story follows page structure rules
- `/storybook-audit` — Audit storybook code for hardcoded values
