# CodeBlock

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

> **Proposed, not built yet.** This spec is written ahead of the code so the API can be reviewed before anything renders. The AUTO sections describe the intended build; `/update-spec` rewrites them from source once `CodeBlock.tsx` exists, and the API hash row is added then.

## Status

| Field | Value |
|-------|-------|
| Component | `CodeBlock` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Terminal` |
| File | `packages/components/src/components/CodeBlock.tsx` (planned) |
| Story | `Components/Terminal/CodeBlock` (planned) |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

CodeBlock shows read-only code: a snippet in a chat reply, the generated source of a layout, a config file. It has a title bar with the file name or language, optional line numbers, and a copy button. It uses the same frame as LogView (plate ring, page fill), so code and logs read as the same kind of surface.

There is no syntax highlighting in v1. Scorp DS has no syntax color roles yet, and inventing them inside a component would break the semantic-aliases-only rule (decision 0006). Monospace on the page fill is already legible; color roles are a separate token proposal.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A `<figure>` with the plate ring (`plate-round-lg p-px`, `--surface-container-stroke`) holding:

1. **Title bar**: `title` (or `language` when no title) in `text-xs` `--text-secondary`, a hairline rule filling the gap (as Window's title bar), and the copy button on the right. Hidden when there is no title, no language and `copyable` is false.
2. **Code**: a `<pre><code>` on `--surface-page`, `text-xs leading-relaxed`, scrolling horizontally unless `wrap`. Optional line-number gutter, sized in `ch` to the widest number.

```
+- settings-screen.tsx -----------------[ copy ]-+
|  1  <Card title="Danger zone">                 |
|  2    <Button variant="destructive">           |
|  3      Delete account                         |
+------------------------------------------------+
```

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | One frame. `framed={false}` drops the ring for use inside a Window body, as LogView. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `code` | `string` | none | Yes | The code. Rendered as text, never as HTML. |
| `language` | `string` | none | No | Language name ("tsx", "json"). A label only in v1, also set as `data-language`. |
| `title` | `ReactNode` | `language` | No | Title bar text, usually a file name. |
| `showLineNumbers` | `boolean` | `false` | No | Line-number gutter. |
| `highlightLines` | `number[]` | none | No | 1-based lines to mark: `--surface-muted` row plus a `ChevronRight` gutter marker, so marking is not color alone. |
| `wrap` | `boolean` | `false` | No | Wrap long lines instead of scrolling horizontally. |
| `copyable` | `boolean` | `true` | No | Show the copy button. Hidden anyway when the Clipboard API is unavailable. |
| `onCopy` | `(code: string) => void` | none | No | Fires after a successful copy. |
| `framed` | `boolean` | `true` | No | Draw the plate ring. |
| `aria-label` | `string` | `title` text, else "Code" | No | Accessible name of the code region. |
| `className` | `string` | none | No | Applied to the `<figure>`. Cap the height here (`max-h-96`); the code scrolls. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--surface-container-stroke` | Color | light `#BFB4A3`, dark `#474030` | Ring, title bar rule |
| `--surface-page` | Color | light `#FDFCFB`, dark `#1A150F` | Code fill |
| `--surface-muted` | Color | light `#F7F5F2`, dark `#221E13` | Highlighted lines |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Code |
| `--text-secondary` | Color | light `#695F4D`, dark `#BFB4A3` | Title, line numbers |
| `--plate-round-lg` | Shape | stepped large corner polygon | Frame |
| `--focus-ring-primary`, `--focus-ring-width` | Color, Size | `#FBBF24`, `2px` | Inset focus ring on the scrollable code |
| `text-xs` | Typography | `12px` | Code, title |

No new tokens.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Default | none | Frame, title bar, code |
| Line numbers | `showLineNumbers` | Gutter in `--text-secondary`, `select-none` |
| Highlighted lines | `highlightLines` | Row on `--surface-muted`, marker in the gutter |
| Wrapped | `wrap` | `whitespace-pre-wrap`, no horizontal scroll |
| Copied | copy succeeded | Button shows `Check` and "Copied" for 2s, then returns to `Copy` |
| Copy failed | Clipboard rejected | Button shows "Copy failed" for 2s |
| Unframed | `framed={false}` | No ring; fill inherits the parent |
| Focus | `:focus-visible` on the `<pre>` | Inset focus ring |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

Planned stories under `Components/Terminal/CodeBlock`:

| Story | Shows |
|-------|-------|
| `Default` | Title, code, copy |
| `LineNumbers` | Gutter |
| `Highlighted` | Marked lines |
| `LongLines` | Horizontal scroll and `wrap` side by side |
| `Unframed` | Inside a Window body |
| `Focused` | `play` tabs into the code region |

**Coverage:** 0% (not built)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

Expected: the gutter width in `ch`, derived from the line count (as LogView), and the 2s copied-state timer. Nothing else.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Button` (copy, `variant="ghost" size="sm"`)
- `TuiIcon` (`Copy`, `Check`, `ChevronRight`)
- `VisuallyHidden` (copy result announcement)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic structure: `<figure>` named by its title (`aria-labelledby`), or by `aria-label`. The code is `<pre><code>`.
- Keyboard: the `<pre>` is focusable (`tabIndex=0`) so overflowing code can be scrolled without a mouse (axe scrollable-region-focusable).
- Line numbers and highlight markers are `aria-hidden` and `select-none`, so a screen reader reads only the code and a manual copy gives clean code.
- Copy: the button's name is "Copy code"; the result ("Copied", "Copy failed") is announced through a polite live region, not only shown.
- Color independence: highlighted lines carry a gutter marker as well as a fill.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use the file name as the `title` when there is one; it says more than the language.
- Do cap the height in long replies so one snippet does not push the conversation off screen.
- Don't use CodeBlock for streaming output; that is LogView.
- Don't use CodeBlock for inline code in a sentence; that is `Prose`.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Inside a `Message`, a CodeBlock takes the full body width.
- Inside a `Window`, set `framed={false}` and let the Window draw the frame.
- In the chat pattern's Code tab, one CodeBlock per generated file, titled with the file name.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-28 | No syntax color roles in the token set | Separate token proposal: semantic `--code-*` roles (keyword, string, comment, number) mapped to the terminal tier (`--color-term-*`), then a highlighter in CodeBlock | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-28 | docs | Proposed spec, written ahead of the code for review |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/CodeBlock.tsx` (planned)
