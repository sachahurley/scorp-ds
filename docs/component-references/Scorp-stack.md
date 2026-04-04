# ScorpStack

Layout primitive: **vertical or horizontal flex** with **design-system gap** (`gap-*` utilities). Use for stacking form fields, toolbar button groups, or screen sections. **Do not use for:** complex grids — use CSS grid / layout components; **do not** replace semantic `<form>` or `<ul>` structure when those carry meaning.

## Import

```tsx
import { Stack } from "@scorp-ds/components";
```

## API Reference

### Properties

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | — | Yes | Content |
| `gap` | `"none" \| "1" \| "2" \| "3" \| "4" \| "6" \| "8"` | `"4"` | No | Tailwind gap on 4px scale |
| `axis` | `"vertical" \| "horizontal"` | `"vertical"` | No | Column vs row (`row` wraps) |
| `className` | `string` | `""` | No | Extra classes |

## Design Tokens (internals)

Spacing resolves through Tailwind’s theme (from `@scorp-ds/tokens` preset): `gap-4` → **16px** (spacing.4), `gap-6` → **24px**, etc.

## Component Tree

```
div.flex.flex-col|row
  └── children
```

## Usage Examples

### Vertical stack (default)

```tsx
<Stack gap="4">
  <Input placeholder="Name" />
  <Input placeholder="Email" />
</Stack>
```

### Horizontal actions

```tsx
<Stack axis="horizontal" gap="3">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</Stack>
```

## Accessibility

- Renders a **plain `div`** — add `role`, `aria-*`, and headings on children as needed.
- Does not set focus order; keep interactive controls in DOM order.

## Do / Don't

| Do | Don't |
|----|-------|
| Use for consistent vertical rhythm between blocks | Use raw `style={{ gap: 12 }}` in product code |
| Pair with semantic children (`label`, `button`) | Use as a clickable surface — use `Button` |

## Related Components

| Component | When to use instead |
|-----------|---------------------|
| `Card` | Bordered surface with header/footer |
| `Button` | Single action control |
| `Divider` | Visual separation without flex layout |
