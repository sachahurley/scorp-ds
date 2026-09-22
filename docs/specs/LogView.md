# LogView

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `LogView` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Terminal` |
| File | `packages/components/src/components/LogView.tsx` |
| Story | `Components/Terminal/LogView` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

LOG VIEW COMPONENT

A monospace scrolling log: build output, server logs, job runs. Each line shows
an optional line number, an optional timestamp, the level as a 1-bit icon plus a
text tag (INFO / WARN / ERROR / DEBUG, never color alone), and the message.

`autoScroll` follows new lines like `tail -f`; scrolling up pauses following and
shows a "Jump to latest" button with the unseen count, and returning to the
bottom resumes. The container is `role="log"` with `aria-live="polite"` and is
keyboard focusable. `framed={false}` drops the plate ring for use inside a
Window body.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| framed | Plate ring around the log (default) |
| unframed | `framed={false}`, inherits the surrounding surface |

### Sizes

| Enum Value | Description |
|------------|-------------|
| (consumer) | Default height `h-80`; set height via `className`. Text `text-xs` |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `lines` | `LogLine[]` | - | Yes | `{ id, text, level?, timestamp? }`, oldest first. |
| `autoScroll` | `boolean` | `true` | No | Follow new lines; pauses when scrolled up. |
| `showLineNumbers` | `boolean` | `false` | No | Line-number gutter (aria-hidden). |
| `wrap` | `boolean` | `true` | No | Wrap vs horizontal scroll. |
| `framed` | `boolean` | `true` | No | Plate ring frame. |
| `emptyState` | `ReactNode` | "No output yet." | No | Shown with no lines. |
| `onFollowChange` | `(following) => void` | - | No | Pause / resume callback. |
| `aria-label` | `string` | `"Log"` | No | Log region name. |
| `className` | `string` | - | No | Frame classes (height). |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `surface.page` | color | theme | Log background (framed) |
| `surface.container-stroke` | color | theme | Ring |
| `text.primary` / `text.secondary` | color | theme | Messages / numbers, timestamps |
| `info` / `warning` / `error` 700 light, 400 dark | color | semantic scales | Level tags |
| `secondary` 700 / 400 | color | semantic scale | Debug tag |
| `plate.round-lg`, focus inset ring | shape / focus | - | Frame, focus |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| Following | at bottom | Auto-scrolls on append |
| Paused | user scrolled up | Jump to latest button with unseen count |
| Empty | no lines | `emptyState` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| LineNumbers | Yes | Yes |  |
| No wrap | Yes | Yes |  |
| Empty | Yes | Yes |  |
| Streaming | Yes | Yes |  |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (5/5)

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

- Button
- TuiIcon

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `log` with `aria-live="polite"`
- Required labels: `aria-label`
- Focus order: log (focusable for keyboard scrolling), then the jump button when shown
- Touch target minimum: N/A (jump button is a Button)
- Color independence: level icon + text tag on every leveled line

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do give lines stable ids.
- Do cap very long logs (virtualize or trim) in product code.
- Don't use LogView for chat; use a message list.

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
| v1 | 2026-09-21 | added | Initial component (terminal batch, ds-nav-terminal) |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/LogView.tsx`
