# Spec Changelog

| Date | Name | Version | Type | Summary |
|------|------|---------|------|---------|
| 2026-04-03 | Tabs | v1 | spec-created | Component spec `docs/specs/Tabs.md` (`Components/Navigation/Tabs`). |
| 2026-04-03 | Table | v1 | spec-created | Component spec `docs/specs/Table.md` (`Components/Display/Table`). |
| 2026-04-03 | Patterns | v1 | spec-created | Pattern specs: `patterns-settings-panel.md`, `patterns-dense-list-row.md`, `patterns-workbench-split.md`. |
| 2026-04-03 | Patterns (stories) | — | a11y | Pattern stories run under axe again; `test-storybook:ci` serves `storybook-static` then runs the test-runner. Storybook **Theme** toolbar syncs light/dark. |
| 2026-04-04 | Stack | v1 | spec-created | Primitive `Stack` spec added (`docs/specs/Stack.md`). |
| 2026-04-03 | *(batch)* | v1 | spec-created | Draft specs generated for `token-parser` + 17 components via `scripts/generate-draft-specs.mjs` (local only; Notion not synced). |
| 2026-09-22 | *(all specs)* | v1 | docs | All 31 existing specs rewritten from source (real props, tokens, states, stories, accessibility, Do / Don't); Notion integration removed, the repo copy is now the only copy. Status table uses Component and Last updated rows; section markers no longer use double dashes. |
| 2026-09-22 | Slider | v1 | spec-created | Component spec `docs/specs/Slider.md` (`Components/Inputs/Slider`). |
| 2026-09-22 | Button | v1 | fix | Light secondary hover text contrast: sepia-950 on the sepia-600 fill (5.3:1, was 3.3:1). |
