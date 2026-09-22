# Window

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Window` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Terminal` |
| File | `packages/components/src/components/Window.tsx` |
| Story | `Components/Terminal/Window` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

WINDOW COMPONENT (pane)

A framed terminal pane: the large plate ring (stroke layer + fill inset 1px),
a TUI title bar (title, a hairline rule filling the gap, optional `status` text
and `actions`), and a keyboard-focusable scroll body named by the title. Frames
are CSS only (no tui-art import, per the dependency layering).

`variant="active"` marks the focused pane: accent ring, muted title bar, and a
ChevronRight marker before the title, so focus is never shown by color alone.
Set `scroll={false}` when the child scrolls itself (an unframed LogView).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| `default` | Container stroke ring |
| `active` | Accent ring, muted title bar, ChevronRight marker |

### Sizes

| Enum Value | Description |
|------------|-------------|
| (consumer) | Set width / height via `className`; title bar is at least `control.height.sm` |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `title` | `ReactNode` | - | Yes | Title; names the section and scroll body. |
| `status` | `ReactNode` | - | No | Right-side status text. |
| `actions` | `ReactNode` | - | No | Title bar actions (small buttons). |
| `variant` | `"default" \| "active"` | `"default"` | No | Focused pane treatment. |
| `titleAs` | `"h1".."h6" \| "span"` | `"h2"` | No | Title element. |
| `scroll` | `boolean` | `true` | No | Scrollable, focusable body. |
| `className` / `bodyClassName` | `string` | - | No | Frame / body classes. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `surface.container-stroke` | color | theme | Default ring, title rule |
| `accent` | color | theme | Active ring |
| `surface.card` | color | theme | Pane fill |
| `surface.muted` | color | theme | Active title bar |
| `border.hairline` | color | theme | Title bar bottom edge |
| `plate.round-lg`, focus inset ring | shape / focus | - | Frame, body focus |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| Default | `variant` | Stroke ring |
| Active | `variant="active"` | Accent ring + marker |
| Body focus | keyboard | Inset ring |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Active | Yes | Yes |  |
| WithActions | Yes | Yes |  |
| SplitPanes | Yes | Yes |  |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (4/4)

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

- TuiIcon

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `section` (region) labelled by the title; body is a focusable `group` with the same name
- Required labels: `title`
- Focus order: title bar actions, then the scroll body
- Touch target minimum: N/A (actions supply their own)
- Color independence: active state adds a ChevronRight marker

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do mark only the pane with keyboard focus or the current context as `active`.
- Do set `scroll={false}` when nesting a scrolling child.
- Don't nest Windows inside Windows.

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

`packages/components/src/components/Window.tsx`
