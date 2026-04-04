# Scorp DS — component references (consumer / agent)

Portable summaries for **AI agents and humans** in other repos (e.g. portfolio). They mirror the real `@scorp-ds/components` API without opening the monorepo.

## What’s here

| File | Description |
|------|-------------|
| `Scorp-stack.md` | `Stack` primitive |
| `Scorp-button.md` | `Button` component |

**Full catalog:** run Storybook in Scorp DS (`npm run storybook`) or import types from `@scorp-ds/components`.

> The `/generate-component-refs` skill normally skips specs in **`draft`** status. These files are **hand-maintained** starters so your portfolio can enforce imports before all specs are promoted.

## Sync into a consumer project

From the **portfolio** root (after pulling latest Scorp DS):

```bash
mkdir -p docs/scorp-ds-refs
rsync -a --delete /path/to/scorp-ds/docs/component-references/ docs/scorp-ds-refs/
```

Or copy manually in Finder: `scorp-ds/docs/component-references` → `portfolio/docs/scorp-ds-refs/`.

Point Cursor rules at `docs/scorp-ds-refs/*.md` (see portfolio `docs/START_SCORP_DS.md`).
