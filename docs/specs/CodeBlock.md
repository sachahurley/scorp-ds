# CodeBlock

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.


## Status

| Field | Value |
|-------|-------|
| Component | `CodeBlock` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Terminal` |
| File | `packages/components/src/components/CodeBlock.tsx` |
| Story | `Components/Terminal/CodeBlock` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-29 |
| API hash | `10508666b4affdc0` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

CodeBlock shows read-only code: a snippet in a chat reply, the generated source of a layout, a config file. It has a title bar with the file name or language, optional line numbers, and a copy button. It uses the same frame as LogView (plate ring, page fill), so code and logs read as the same kind of surface.

There is no syntax highlighting in v1. Scorp DS has no syntax color roles yet, and inventing them inside a component would break the semantic-aliases-only rule (decision 0006). Monospace on the page fill is already legible; color roles are a separate token proposal.

Don't use this for: output that streams in line by line, such as build or server logs (use `LogView` instead), a key or shortcut inside a sentence (use `Kbd` instead), or a terminal pane with its own title and actions around other content (use `Window` instead, with an unframed CodeBlock inside if it holds code).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A `<figure>` named by `aria-label` (the title when it is text, else the language, else "Code"). Framed, it draws the plate ring (`plate-round-lg p-px`, `--surface-container-stroke`) around a `--surface-page` fill. Inside:

1. **Title bar** (`<figcaption>`, `min-h-control-sm`, hairline bottom border): `title` (or `language`) in `text-xs` `--text-secondary`, a hairline rule filling the gap (as Window's title bar), and the copy button. Shown when there is a heading or a working copy button.
2. **Code**: a focusable `<pre><code>`, `text-xs leading-relaxed`, one row per line. Each row is optional highlight marker, optional line number (sized in `ch` to the widest), then the line. Rows are `w-max min-w-full` when not wrapping, so a highlight spans the scroll width.
3. **Status region**: visually hidden, announces "Copied to clipboard" or "Copy failed".

A trailing newline in `code` does not make an empty last row.

```
+- settings-screen.tsx -----------------[ Copy ]-+
|  1  <Card title="Danger zone">                 |
|> 2    <Button variant="destructive">           |
|  3  </Card>                                    |
+------------------------------------------------+
```

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | One frame. `framed={false}` drops the ring and fill for use inside a Window body, as LogView. |

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
| Line numbers | `showLineNumbers` | Gutter in `--text-secondary`, `select-none`, `aria-hidden` |
| Highlighted lines | `highlightLines` | Row on `--surface-muted`, `ChevronRight` marker in `--accent` |
| Wrapped | `wrap` | `whitespace-pre-wrap break-words`, no horizontal scroll |
| Copied | copy succeeded | Button shows `Check` and "Copied" for 2s, then returns to "Copy" |
| Copy failed | Clipboard rejected | Button shows "Copy failed" for 2s |
| No Clipboard API | `navigator.clipboard` missing | No copy button |
| Unframed | `framed={false}` | No ring or fill |
| Focus | `:focus-visible` on the `<pre>` | Inset focus ring |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Title, code, copy | Yes | Yes | `Default` |
| Line numbers | Yes | Yes | `Line numbers` |
| Highlighted lines | Yes | Yes | `Highlighted` |
| Horizontal scroll and wrap | Yes | Yes | `Long lines` |
| Unframed in a Window | Yes | Yes | `Unframed` |
| Keyboard focus on the code | Yes | Yes | `Focused` (`play` tabs past the copy button) |
| Copied / failed | Yes | Interactive only | Click Copy in any story. No story of its own: the result reverts on a two-second timer, so it could not hold a stable frame, and it depends on clipboard permission in the runner. Covered by `CodeBlock.test.tsx` |

Interactive controls: `showLineNumbers`, `wrap`, `copyable`, `framed`.

**Coverage:** 86% (6/7)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- The line-number gutter's `min-width` is an inline style in `ch`, derived from the line count (as LogView).
- `COPY_RESULT_MS = 2000`: how long the copy result stays on the button.

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

- Semantic structure: `<figure>` named by `aria-label`; the code is `<pre><code>`.
- Keyboard: the `<pre>` is focusable (`tabIndex=0`), after the copy button, so overflowing code can be scrolled without a mouse (axe scrollable-region-focusable).
- Line numbers and highlight markers are `aria-hidden` and `select-none`, so a screen reader reads only the code and a manual copy gives clean code.
- Copy: a `type="button"` Button whose name is "Copy code" (visible "Copy" plus hidden " code"), then "Copied" or "Copy failed", which is also announced through a polite status region. Its icon is passed by name (`iconLeft="Copy"` / `"Check"`), so Button sizes it.
- Name: the figure is not interactive, so its type does not require a name (decision 0029 covers interactive components); it derives one from the title or language and falls back to "Code". Pass `aria-label` when the title is a node.
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
| v1 | 2026-10-28 | added | Built to the reviewed spec. The figure is named with `aria-label`; the copy button keeps its visible text in its name |
| v1 | 2026-10-29 | changed | Rebuilt on current main (takeover of #99): the copy button takes its icon by name and is `type="button"`; the focusable `<pre>` carries a justified `no-noninteractive-tabindex` exception, as LogView; prop docs say when to use each prop |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/CodeBlock.tsx`
