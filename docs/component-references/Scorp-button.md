# ScorpButton

Primary interactive control for **actions** (submit, navigate, toggle). Variants map to **semantic** colors (`primary`, `secondary`, `destructive`, …). **Do not use for:** in-page text links that should look like prose — use `variant="link"` sparingly or native anchors with token styling; **do not** use for icon-only chrome without an **accessible name** (`aria-label` or `title`).

## Import

```tsx
import { Button } from "@scorp-ds/components";
```

## API Reference

### Variants

| Value | Use for |
|-------|---------|
| `primary` | Main CTA |
| `secondary` | Secondary actions |
| `ghost` | Low-emphasis |
| `link` | Text-like action |
| `outline` | Bordered neutral |
| `destructive` | Irreversible / delete |
| `icon` | Square icon-only (must label for a11y) |

### Sizes

| Value | Height (approx) |
|-------|-----------------|
| `small` | 32px |
| `medium` | 40px (default) |
| `large` | 48px |
| `icon` | Square icon button |

### Properties

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `variant` | see table | `primary` | No | Visual style |
| `size` | see table | `medium` | No | Control size |
| `disabled` | `boolean` | `false` | No | Disables interaction |
| `children` | `ReactNode` | — | No* | Label or icon |
| `iconLeft` / `iconRight` | `ReactNode` | — | No | TUI icons |
| `className` | `string` | `""` | No | Utilities |
| … | `ButtonHTMLAttributes` | — | — | Native `type`, `onClick`, etc. |

\*Provide `aria-label` if there is no visible text.

## Design Tokens (internals)

Uses **semantic Tailwind classes** (`bg-primary-400`, `text-secondary-50`, `border-error-600`, …) which resolve to **CSS variables** from `@scorp-ds/tokens/styles/tokens.css`. Sizes align with `light.button.size.*` in `tokens.json`.

## Usage Examples

### Primary

```tsx
<Button variant="primary" type="button">
  Continue
</Button>
```

### Destructive

```tsx
<Button variant="destructive" type="button">
  Delete project
</Button>
```

### With icon slot

```tsx
import { Button, TuiIcon } from "@scorp-ds/components";

<Button variant="secondary" iconLeft={<TuiIcon name="Check" size="4" />}>
  Saved
</Button>
```

## Accessibility

- Renders **native `<button>`** (unless `asChild` pattern added later).
- **Minimum target:** prefer `size` ≥ `small`; icon-only needs **`aria-label`**.
- Focus ring uses **semantic** focus tokens via Tailwind `focus:ring-*`.

## Do / Don't

| Do | Don't |
|----|-------|
| Set `type="button"` when not submitting forms | Use `div` + `onClick` for actions |
| Use `variant` for meaning (destructive for delete) | Hardcode hex colors on buttons |

## Related Components

| Component | When to use instead |
|-----------|---------------------|
| `ThemeToggle` | Theme switching |
| `Switch` | On/off setting |
| `Badge` | Status, not an action |
