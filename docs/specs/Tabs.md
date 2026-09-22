# Tabs

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Tabs` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Navigation` |
| File | `packages/components/src/components/Tabs.tsx` |
| Story | `Components/Navigation/Tabs` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Tabs switch between related views that share one context, such as the sections of a settings screen, without leaving the page. It implements the WAI-ARIA tablist / tab / tabpanel pattern with a roving tabindex and automatic activation (arrow keys move focus and select), in the TUI style: square triggers, monospace labels, and an underline on the selected tab. Use it for two to about six peer views of the same object. For navigation between pages use `Link` or a nav list of `ListRow`s, and for a single show/hide choice use `Switch` or a disclosure.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`Tabs` (context provider, `div.w-full`) > `TabsList` (`role="tablist"`, flex-wrap, 0.5px bottom rule) > `TabsTrigger` (`role="tab"` button) ... followed by `TabsContent` (`role="tabpanel"`, `p-4`) per value.

- Triggers and panels are linked by generated ids: `{baseId}-tab-{value}` and `{baseId}-panel-{value}` (`aria-controls` / `aria-labelledby`).
- `TabsList` reads the `value` of its direct `TabsTrigger` children (matched by `displayName`) to define keyboard order.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (single) | Underline style: selected trigger has a 2px bottom border in `--button-primary-background`. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| (single) | Triggers `px-4 py-2 text-sm`; panels `p-4`. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

### Tabs

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `value` | `string` | none | No | Selected value (controlled). Pair with `onValueChange`. |
| `defaultValue` | `string` | none | No | Initial value when uncontrolled. Omit to auto-select the first trigger. |
| `onValueChange` | `(value: string) => void` | none | No | Fires on every selection change (click or keyboard). |
| `children` | `ReactNode` | none | Yes | `TabsList` and `TabsContent` elements. |
| `className` | `string` | none | No | Classes on the root `div`. |

### TabsList

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `aria-label` | `string` | none | One of the two | Accessible name for the tab strip. |
| `aria-labelledby` | `string` | none | One of the two | Id of a visible heading naming the strip. |
| `children` | `ReactNode` | none | Yes | `TabsTrigger` elements only, as direct children. |
| `className` | `string` | none | No | Classes on the tablist. |

### TabsTrigger

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `value` | `string` | none | Yes | Matches a `TabsContent` `value`. |
| `children` | `ReactNode` | none | Yes | Label. Icon-only triggers need `aria-label`. |
| `disabled` | `boolean` | `false` | No | Disables the trigger (`opacity-50`, `cursor-not-allowed`). |
| `type` | `string` | `"button"` | No | Native button type. |
| `onClick` / `onKeyDown` | handlers | none | No | Called first; call `preventDefault()` to cancel selection or key handling. |
| `ref` | `Ref<HTMLButtonElement>` | none | No | Forwarded to the button. |
| `...rest` | native `<button>` attributes | | No | Spread last. |

### TabsContent

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `value` | `string` | none | Yes | Panel id matching a trigger. |
| `children` | `ReactNode` | none | Yes | Panel content. |
| `forceMount` | `boolean` | `false` | No | Keep the inactive panel mounted with `hidden`, so form state survives switching. |
| `className` | `string` | none | No | Classes on the panel. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--surface-container-stroke` | Color | light `#BFB4A3`, dark `#474030` | 0.5px tablist bottom rule |
| `--button-primary-background` | Color | light `#FBBF24`, dark `#E0A26A` | Selected underline (2px) |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Selected label, hover label |
| `secondary-700` / `secondary-300` | Color | `#695F4D` light / `#F0EBE4` dark | Unselected label |
| `--focus-ring-primary` | Color | `#FBBF24` | Panel focus ring (`ring-2`) |
| `--focus-offset-color` | Color | light `#FDFCFB`, dark `#0A0704` | Panel ring offset fill (`ring-offset-2`) |
| `--duration-normal` | Motion | `200ms` | Trigger color transition |
| `text-sm` | Typography | `14px` | Trigger labels |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Selected | `value` match | 2px border `--button-primary-background`, label `--text-primary`, `tabIndex=0`, `aria-selected="true"` |
| Unselected | no match | Transparent border, label `secondary-700` / `secondary-300`, `tabIndex=-1` |
| Hover | `:hover` (unselected) | Label `--text-primary` |
| Disabled | `disabled` | `opacity-50`, `cursor-not-allowed`; click and keys ignored on that trigger |
| Trigger focus | `:focus-visible` | No trigger-specific ring is defined (browser default outline) |
| Panel focus | `:focus-visible` on the active panel | `ring-2 --focus-ring-primary`, offset `--focus-offset-color` |
| Hidden panel | inactive + `forceMount` | Rendered with `hidden`, no `tabIndex` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Uncontrolled (`defaultValue`) | Yes | Yes | `Default` |
| `forceMount` panels | Yes | Yes | `With inputs (forceMount)` |
| Controlled (`value` + `onValueChange`) | Yes | No | |
| Disabled trigger | Yes | No | |
| Keyboard (arrows, Home, End) | Yes | Interactive only | |

Interactive controls: none (stories use `render`; no `component` or `argTypes`).

**Coverage:** 50% (2/4)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `border-b-[0.5px]` on the tablist: arbitrary hairline width, no border-width token.
- `opacity-50` on disabled triggers: Tailwind opacity, matches `--opacity-50` in value but not by reference.
- Unselected label uses `secondary-700` / `secondary-300` scale steps rather than a semantic text token.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/tokens/src/styles/tokens.css` (surface, button, text, focus-ring, duration tokens)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `tablist` > `tab` (native `<button>`) > `tabpanel`, linked with `aria-controls` / `aria-labelledby`; `aria-selected` on each tab.
- Required labels: `aria-label` or `aria-labelledby` on `TabsList`; `aria-label` on icon-only triggers.
- Focus order (roving tabindex): only the selected tab is in the tab order (`tabIndex=0`, others `-1`). Tab moves from the strip to the active panel, which is focusable (`tabIndex=0`).
- Keyboard: ArrowRight / ArrowDown select the next tab and ArrowLeft / ArrowUp the previous, wrapping at the ends; Home and End jump to the first and last. Selection follows focus (automatic activation); focus moves on the next animation frame.
- Touch target minimum: not met. Triggers are about 37px tall (`py-2` plus a 21px `text-sm` line), below 44px.
- Color independence: the selected tab is marked by the 2px underline plus the label color change, and `aria-selected` for screen readers.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do label the strip with `aria-label` (or `aria-labelledby` pointing at a visible heading).
- Do use `forceMount` when panels hold form input that must survive switching.
- Do keep labels short (one or two words); the strip wraps, it does not scroll.
- Do use controlled mode (`value` + `onValueChange`) when the active tab is in the URL or app state.
- Don't wrap `TabsTrigger` in other elements inside `TabsList`; keyboard order only sees direct `TabsTrigger` children.
- Don't use Tabs for page navigation or for sequential steps (wizard); tabs are peers.
- Don't disable a tab that users can reach with arrow keys (see Known Gaps); hide it instead.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- In a framed surface, place `Tabs` inside the plate ring (as the stories do) so the tablist rule runs edge to edge; panels add their own `p-4`.
- Inside panels, space content with `Stack` (`gap="3"` for form fields).
- Inside a `Card`, put `Tabs` in the body and let the card title name the object; the tablist then names the sections.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Arrow, Home and End navigation does not skip disabled triggers, so the keyboard can select a disabled tab | None yet | open |
| 2026-09-22 | Triggers have no token focus ring (they rely on the browser outline) and are about 37px tall, below the 44px target | None yet | open |
| 2026-09-22 | No unit tests (keyboard and roving tabindex are untested) | None yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Tabs.tsx`
