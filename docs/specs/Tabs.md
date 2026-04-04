# Tabs

> Spec created for `Tabs` compound component on 2026-04-03. Aligns with `packages/components/src/components/Tabs.tsx` and Storybook `Components/Navigation/Tabs`.

## Status

| Field | Value |
|-------|-------|
| Widget | `ScorpTabs` |
| Layer | `component` |
| Category | `Navigation` |
| File | `packages/components/src/components/Tabs.tsx` |
| Story | `Components/Navigation/Tabs` |
| Version | `v1` |
| Status | `draft` |
| Last synced | 2026-04-03 |
| Notion Page | `` |

---

## Intent

<!-- HUMAN-SECTION:intent -- This section is preserved across auto-updates -->

TABS — WAI-ARIA tablist / tab / tabpanel pattern for switching related views.

TUI-friendly: sharp corners (`rounded-none`), monospace (`font-mono`), underline-style selection on the active tab (`border-b-2` + primary button token).

Supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) usage. When uncontrolled and the current value is empty or not in the tab list, the first tab is selected automatically (`useLayoutEffect` in `TabsList`).

Use `TabsContent` `forceMount` when panels contain form fields or other state that must stay mounted while hidden.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Parts

| Part | Role | Description |
|------|------|-------------|
| `Tabs` | wrapper | Context provider; optional `className` on outer `div`. |
| `TabsList` | `tablist` | Row of `TabsTrigger` children; set `aria-label` or `aria-labelledby`. |
| `TabsTrigger` | `tab` | Button per tab; `value` matches a `TabsContent` `value`. |
| `TabsContent` | `tabpanel` | Panel body; hidden via `null` or `hidden` + `forceMount`. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| *(none)* | Typography uses `text-sm` on triggers and panels. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

### TabsProps

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| value | `string` | — | No | Controlled selected id. |
| defaultValue | `string` | — | No | Uncontrolled initial id; omit to auto-pick first tab. |
| onValueChange | `(value: string) => void` | — | No | Fires when selection changes. |
| children | `ReactNode` | — | Yes | `TabsList` + `TabsContent` nodes. |
| className | `string` | `""` | No | Root wrapper classes. |

### TabsListProps

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| children | `ReactNode` | — | Yes | Should be `TabsTrigger` only (order = keyboard order). |
| className | `string` | — | No | |
| aria-label | `string` | — | No | Name for the tab strip (preferred). |
| aria-labelledby | `string` | — | No | Alternative to `aria-label`. |

### TabsTriggerProps

Extends `ButtonHTMLAttributes<HTMLButtonElement>` plus:

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| value | `string` | — | Yes | Id for this tab; must match a `TabsContent` `value`. |
| children | `ReactNode` | — | Yes | Visible label. |

`type` defaults to `"button"`. Icon-only triggers must set `aria-label`.

### TabsContentProps

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| value | `string` | — | Yes | Matches active `TabsTrigger` `value`. |
| children | `ReactNode` | — | Yes | Panel content. |
| className | `string` | — | No | |
| forceMount | `boolean` | `false` | No | Keep DOM mounted when inactive (`hidden`). |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token / utility | Category | Usage |
|-----------------|----------|--------|
| `--surface-container-stroke` | semantic border | `TabsList` bottom border. |
| `--button-primary-background` | semantic | Active tab bottom border color. |
| `--text-primary` | semantic | Selected tab text. |
| `secondary-700` / `secondary-300` (Tailwind semantic) | semantic | Unselected tab text + hover to primary. |
| `--focus-ring-primary` | semantic | Focus-visible ring on active panel. |
| `--focus-offset-color` | semantic | Focus ring offset. |
| `--duration-normal` | motion | Trigger transition duration. |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Notes |
|----------------|--------------|-------|
| Selected tab | `value` / internal state | `aria-selected`, `tabIndex` 0 vs -1. |
| Disabled tab | `disabled` on `TabsTrigger` | Not in arrow navigation focus moves still — native `disabled` behavior. |
| Hidden panel | inactive `TabsContent` | Unmounted unless `forceMount`. |
| Controlled vs uncontrolled | `value` prop presence | `isControlled` in context. |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| Example | In Storybook | Notes |
|---------|--------------|-------|
| Three tabs + panels | `Default` | `aria-label` on list. |
| Form fields + `forceMount` | `WithFormFields` | Two tabs, inputs in both panels. |

Interactive controls: story uses inline `render`; use Storybook interactions as needed.

**Coverage:** High — default + `forceMount` composition demonstrated.

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No forbidden hardcoded colors, radii, or raw spacing — layout uses semantic tokens and scale utilities (`px-4`, `py-2`, `text-sm`).

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None (primitive composition only).

### Internal

- `cn` from `packages/components/src/lib/utils.ts`

### Foundation Files Referenced

Runtime styling via CSS variables from `@scorp-ds/tokens` / Tailwind preset.

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- **Roles:** `tablist`, `tab`, `tabpanel` with matching `id` / `aria-controls` / `aria-labelledby`.
- **Keyboard:** ArrowLeft/ArrowRight/ArrowUp/ArrowDown move selection + focus; Home / End jump to first/last tab.
- **Required labels:** `TabsList` should have `aria-label` or `aria-labelledby`.
- **Focus:** Active panel is focusable (`tabIndex={0}`) when visible for keyboard users.
- **Touch target:** Triggers use `py-2` + `px-4`; verify 44×44 minimum in dense layouts if required by product audit.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont -->

**Do** give the tablist an accessible name (`aria-label`). **Do** use `forceMount` for forms inside tabs. **Don't** nest interactive controls that steal arrow keys without handling — keep tab content simple or trap focus in widgets that need it.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition -->

`TabsTrigger` values must be unique and must each pair with a `TabsContent` of the same `value`. `TabsList` should only contain `TabsTrigger` elements so keyboard order matches DOM order.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-04-03 | Manual activation pattern | Uses automatic activation on arrow (common for settings UIs). | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-04-03 | spec-created | Initial spec for compound `Tabs`. |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Tabs.tsx`
