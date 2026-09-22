# Spec Changelog

| Date | Name | Version | Type | Summary |
|------|------|---------|------|---------|
| 2026-09-21 | Spinner | v1 | spec-created | New component spec `docs/specs/Spinner.md` (`Components/Feedback/Spinner`). |
| 2026-09-21 | Toast | v1 | feat | Variants, action, duration with pause, imperative `toast()` / `useToast()`. |
| 2026-09-21 | Button | v1 | feat | `loading` prop. |
| 2026-09-21 | Checkbox | v1 | feat | `indeterminate` prop. |
| 2026-09-21 | Tooltip | v1 | feat | Viewport flip and horizontal clamp. |
| 2026-09-21 | TuiIcon | v3 | feat | `Minus` icon; Scorp Symbols rebuilt. |
| 2026-04-03 | Tabs | v1 | spec-created | Component spec `docs/specs/Tabs.md` (`Components/Navigation/Tabs`). |
| 2026-04-03 | Table | v1 | spec-created | Component spec `docs/specs/Table.md` (`Components/Display/Table`). |
| 2026-04-03 | Patterns | v1 | spec-created | Pattern specs: `patterns-settings-panel.md`, `patterns-dense-list-row.md`, `patterns-workbench-split.md`. |
| 2026-04-03 | Patterns (stories) | — | a11y | Pattern stories run under axe again; `test-storybook:ci` serves `storybook-static` then runs the test-runner. Storybook **Theme** toolbar syncs light/dark. |
| 2026-04-04 | Stack | v1 | spec-created | Primitive `Stack` spec added (`docs/specs/Stack.md`). |
| 2026-04-03 | *(batch)* | v1 | spec-created | Draft specs generated for `token-parser` + 17 components via `scripts/generate-draft-specs.mjs` (local only; Notion not synced). |
| 2026-09-22 | *(all specs)* | v1 | docs | All 31 existing specs rewritten from source (real props, tokens, states, stories, accessibility, Do / Don't); Notion integration removed, the repo copy is now the only copy. Status table uses Component and Last updated rows; section markers no longer use double dashes. |
| 2026-09-22 | Slider | v1 | spec-created | Component spec `docs/specs/Slider.md` (`Components/Inputs/Slider`). |
| 2026-09-22 | Button | v1 | fix | Light secondary hover text contrast: sepia-950 on the sepia-600 fill (5.3:1, was 3.3:1). |
| 2026-09-22 | Dropdown, Select, Alert, Radio | v1 | fix | Menus and form controls: `type="button"` everywhere, one raw-index keyboard model that skips disabled rows, Tab closes menus, Dropdown clones a custom trigger instead of double-wrapping it, Select gains `aria-activedescendant` and `<optgroup>` / fragment parsing, highlights moved to `--surface-muted` + `--accent`, `--z-index-dropdown` replaces `z-[1051]`, Alert's close button gains a 44px hit area and the token focus ring, Radio gains `helperText` / `errorMessage`. |
