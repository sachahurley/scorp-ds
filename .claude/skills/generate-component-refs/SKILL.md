---
name: generate-component-refs
description: Regenerate the component catalog consumer projects and agents read (docs/component-references/catalog.md) from the API manifest and the specs.
argument-hint: "[--check]"
---

# Generate Component References

The consumer reference is one generated file, `docs/component-references/catalog.md`.
Nothing in it is written by hand, so this skill runs the generator rather than writing
Markdown itself. The hand-maintained per-component files it replaced had drifted from
the code (they taught the deprecated `size="medium"`).

## Steps

1. Make sure the manifest is current, since the catalog reads it:
   ```bash
   node scripts/generate-api-surface.mjs
   ```
2. Regenerate the catalog (or check it with `--check`, which is what CI runs):
   ```bash
   node scripts/generate-catalog.mjs
   ```
3. If an entry is missing its purpose or its "use instead" line, the fix is in that
   component's spec (`docs/specs/{Name}.md`, the `intent` HUMAN-SECTION), not in the
   catalog. `npm run spec-status` lists specs that fall short (decision 0026).
4. Commit the regenerated `catalog.md` with the change that caused it.

## Where the content comes from

| Catalog content | Source |
|---|---|
| Props, accepted values, defaults, deprecations, inherited attributes, exports | `docs/contracts/api-surface.json`, generated from the TypeScript source |
| Purpose (first sentence of the intent), "use instead", status, category, story | The component's spec in `docs/specs/` |

Consumers sync the folder with `rsync`; see `docs/component-references/README.md`.
