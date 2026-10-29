# Accordion

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Accordion` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/Accordion.tsx` |
| Story | `Components/Display/Accordion` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |
| API hash | `2e6c2346a2258516` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Stacked sections that expand and collapse under headings. Compound API: Accordion, AccordionItem, AccordionTrigger, AccordionContent. `type="single"` (default) keeps one open; add `collapsible` to allow none (otherwise the open trigger is aria-disabled). `type="multiple"` opens independently, and `collapsible` has no effect there: every item can always close. Controlled via value + onValueChange or uncontrolled via defaultValue.

Motion: grid-rows 0fr to 1fr over duration.normal (200ms) with a rotating 1-bit ChevronRight; both instant under reduced motion. Collapsed bodies are visibility-hidden so they leave the tab order.

Don't use this for: switching between alternative views of the same content (use Tabs instead), a nested hierarchy such as files or an outline (use TreeView instead), or anything the user must not miss, which should stay visible rather than collapsed.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|-----------|-------------|
| `single` | One open (default) |
| `single collapsible` | One or none |
| `multiple` | Any number |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `(none)` | No `size` prop. Row height comes from the trigger's own padding and the content it wraps; the open/closed transition animates `grid-template-rows` rather than a fixed height. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `type` | `single | multiple` | `"single"` | No | Open model |
| `value` | `string | string[]` | `undefined` | No | Controlled |
| `defaultValue` | `string | string[]` |  | No | Uncontrolled |
| `onValueChange` | `(value) => void` |  | No | Open item(s) |
| `collapsible` | `boolean` | `false` | No | Single: allow closing the open item so none are open. No effect with `type="multiple"`, where every item can always close; accepted there only so switching `type` does not mean dropping the prop |
| `headingLevel` | `2-6` | `3` | No | Heading around triggers |
| `disabled` | `boolean` | `false` | No | Disable all |
| `AccordionItem.value` | `string` |  | Yes | Item id |
| `AccordionItem.disabled` | `boolean` | `false` | No | Disable one |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--border-hairline` | Color | semantic | Dividers |
| `--surface-subtle` | Color | semantic | Trigger hover |
| `--text-primary / --text-secondary` | Color | semantic | Trigger / body |
| `--focus-ring-primary, --focus-ring-width` | Focus | semantic | Inset focus ring |
| `--duration-normal / --duration-fast` | Motion | 200/120ms | Expand, chevron, hover |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| open / closed | `data-state, aria-expanded` | grid rows, chevron rotation |
| locked | `aria-disabled` | cursor |
| disabled | `disabled` | opacity-50 |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Open | Yes | Yes |  |
| Multiple | Yes | Yes |  |
| Single, not collapsible | Yes | Yes |  |
| Disabled item | Yes | Yes |  |
| Controlled | Yes | Yes |  |

Interactive controls: Yes (autodocs argTypes)

**Coverage:** 100% (6/6)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

TuiIcon

### Foundation Files Referenced

`packages/tokens/src/tokens.json` (via the Tailwind preset and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: button in heading; region labelled by trigger
- Required labels: Trigger text
- Focus order: Enter/Space toggle; ArrowUp/Down wrap, Home/End
- Touch target minimum: Triggers are min-h-touch (44px)
- Color independence: Chevron rotation plus aria-expanded

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

[TODO: add usage guidelines]

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

[TODO: define how this component behaves with others]

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-21 | added | Initial Accordion component, story, and unit tests |
| Unreleased | 2026-10-28 | docs | Documented that `collapsible` has no effect in `multiple` mode |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Accordion.tsx`
