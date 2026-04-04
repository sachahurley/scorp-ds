# Design System Documentation - Page Structure Requirements

> **Purpose:** These rules define the required structure for every documentation page in the design system. Engineers, designers, and non-technical stakeholders should be able to look at any page and immediately understand: what the token is, what it looks like, when to use it, and how to use it in code.

---

## RULE 0 - Golden Principle

Every documentation page must answer four questions **in order**:
1. **What does it look like?** — Visual example first, always.
2. **What is it called?** — Token name.
3. **What is its raw value?** — Hex, px, ms, etc.
4. **When and how do I use it?** — Usage guidance + code.

---

## RULE 1 - Page Header

Every page must begin with a header block containing:

| Field | Description | Example |
|---|---|---|
| `Title` | Plain-English name of the category | `Colors`, `Typography`, `Spacing` |
| `Description` | 1-2 sentences explaining what this category is and why it exists | `Colors define the visual language of the product. Use semantic tokens, never raw values.` |
| `Status badge` | `Stable` / `Beta` / `Deprecated` | `Stable` |
| `Last updated` | Date of last meaningful change | `Apr 2026` |

**Example markup pattern:**
```
# Colors
Colors define the visual language across all surfaces. Always reference semantic tokens — never hardcode raw values directly in components.

[Stable] · Last updated Apr 2026
```

---

## RULE 2 - Section Structure (Repeatable Pattern)

Each conceptual group within the page (e.g. "Primary", "Feedback", "Neutral") must follow this exact section structure:

### 2.1 Section Title + Description
- A short title naming the group (e.g. `Primary Colors`, `Error States`)
- 1-2 sentences explaining the intent/usage of this group

### 2.2 Visual Swatch / Example Block
- **Always first** — before any token names or values
- Must be large enough to evaluate the value at a glance
- For colors: filled square/rectangle swatch (min 80x80px)
- For typography: live text rendered at the defined size/weight
- For spacing: a rendered box showing the actual distance
- For motion/easing: an animated preview
- Swatches must show both **light** and **dark** mode variants side by side if the token changes across modes

### 2.3 Token Table
A table immediately below each swatch block with these exact columns - **in this column order**:

| Column | Description | Example |
|---|---|---|
| `Swatch` | Inline mini-swatch (16x16 or 24x24) | colored square |
| `Token Name` | Full token string as used in code | `{Prefix}Colors.textDefault` |
| `Raw Value` | The actual resolved value | `#042914` |
| `Light Mode` | Value in light theme | `#042914` |
| `Dark Mode` | Value in dark theme | `#e8f5e9` |
| `Usage` | Short plain-English description of when to use it | `Primary actions, focused states` |

**Rules for the table:**
- Token names must be sorted logically (scale order: 100 to 900, or semantic order: default to hover to active to disabled)
- Never omit the raw value column — non-technical readers need it for handoffs
- Never omit the token name — engineers need it for implementation
- If a token is deprecated, show it with a strikethrough and link to its replacement

---

## RULE 3 - Usage Guidelines Block *(Future — not yet required)*

> **Status:** Deferred. The shared `DoDontBlock` widget/component is ready — add it to each story when the team is ready to author authoritative Do/Don't guidance per component.

After the token table for each group, include a **Usage** block with two sub-sections:

### Do
- Bullet list of correct usage patterns (max 4 items)
- Written for both designers and engineers

### Don't
- Bullet list of anti-patterns to avoid (max 4 items)
- Be specific

---

## RULE 4 - Code Snippet Block

Every section must include at least one code example block showing the token in real usage. Requirements:

- Must be syntax-highlighted
- Must show the token name (not the raw value) in use
- Show your stack's code pattern (Dart for Flutter, TypeScript/JSX for React)

**Flutter example:**
```dart
Container(
  color: YourColors.surfaceDefault,
  child: Text(
    'Hello World',
    style: YourTextStyles.bodyRegular,
  ),
)
```

**React/TypeScript example:**
```tsx
import { colors, textStyles } from '@your-ds/tokens';

<div style={{ backgroundColor: colors.surfaceDefault }}>
  <span style={textStyles.bodyRegular}>Hello World</span>
</div>
```

---

## RULE 5 - Accessibility Block *(Future — not yet required)*

> **Status:** Deferred. The shared `AccessibilityBlock` widget/component is ready — add it to each story when the team is ready to audit contrast ratios per component.

Every color or typography section must include an accessibility callout:

| Field | Required content |
|---|---|
| Contrast ratio | WCAG AA and AAA pass/fail for each foreground/background pair |
| Recommended pairings | Which tokens work together accessibly |
| Use with text | Minimum text size before this color fails contrast |

If the token does not affect visual contrast (e.g. spacing, motion), this block may be omitted.

---

## RULE 6 - Related Tokens / Cross-References

At the bottom of each section, include a "Related" row or block:
- Link to tokens that are commonly used alongside this one
- Link to any component pages that use this token
- Example: `See also: Button, Form Input, Alert`

---

## RULE 7 - Page-Level Table of Contents

Every page with more than 2 sections must include a sticky or inline **Table of Contents** at the top listing all section anchors. This is critical for long pages like Colors or Typography.

---

## RULE 8 - Token Naming Convention (Enforced on All Pages)

Token names follow the pattern:

```
{Prefix}Colors.{group}{Variant}{State}
{Prefix}TextStyles.{group}{Variant}
{Prefix}Spacing.{size}
```

The class name provides the category (`{Prefix}Colors` = color, `{Prefix}TextStyles` = font, `{Prefix}Spacing` = spacing).

| Segment | Examples |
|---|---|
| `group` | `text`, `surface`, `border`, `interactive`, `feedback` |
| `variant` | `Default`, `Subtle`, `Inverse`, `Elevated`, `Positive` |
| `state` | `Hovered`, `Pressed`, `Disabled`, `Focused` *(optional)* |

**Examples:**
```
{Prefix}Colors.textDefault
{Prefix}Colors.surfaceElevated
{Prefix}Colors.borderFocused
{Prefix}Spacing.space16
{Prefix}TextStyles.displayXl
```

Any page that introduces new tokens must document the token name before referencing it, and it must follow this naming convention exactly.

---

## RULE 9 - Page Template Scaffolding

Every new documentation page must be generated from this template structure:

```
[Page Header - Rule 1]

[Table of Contents - Rule 7]

---

## [Section Name]

[Section Description]

[Visual Swatch / Example Block - Rule 2.2]

[Token Table - Rule 2.3]

[Usage Guidelines (Do / Don't) - Rule 3]

[Code Snippet Block - Rule 4]

[Accessibility Block - Rule 5]

[Related Tokens - Rule 6]

---

## [Next Section...]
```

Repeat the section block for every conceptual group on the page.

---

## RULE 10 - Non-Technical Reader Accommodation

Every page must be readable by someone with no coding background. Requirements:
- The first paragraph of every page description uses zero technical jargon
- Token names are always accompanied by a plain-English label in tables
- Code blocks are always preceded by a plain sentence explaining what the snippet does
- Accessibility ratios are labeled "passes AA" / "fails AA" — never just a raw number

---

## RULE 11 - Playground Patterns

Every story that includes a live playground must use one of the three standard patterns below.

### Pattern A: Preset/Sample Playgrounds (Screen-level compositions)

A device frame wrapper contains a sample widget/component that assembles the screen by calling shared preset/builder functions.

- **When to use:** Multi-component screen compositions such as onboarding flows, detail screens, or any layout combining several components into a cohesive page.
- **Key rule:** All component configuration lives in preset functions. The sample is a thin layout shell, never inline component setup.

### Pattern B: Inline Component Playgrounds (Single-component stories)

A device frame contains a live render that reads storybook controls/knobs, plus a generated code snippet that stays in sync.

- **When to use:** Individual component stories (button, alert, card, etc.).
- **Key rule:** Every visual property should be controllable via knobs. The generated code snippet must stay in sync with the live preview.

### Pattern C: Complex Preview Playgrounds (Interaction-heavy components)

A device frame wraps a stateful widget/component that manages its own animation or interaction state.

- **When to use:** Components that require user interaction to demonstrate behavior — modals, drawers, bottom sheets.
- **Key rule:** The stateful component owns the interaction lifecycle. Placeholder content is acceptable for background filler.

### Placeholder Content Policy

Plain HTML/Flutter widgets are acceptable as placeholder content behind the component being tested. The tested component itself must always use design system tokens.

---

## Summary Checklist

Before publishing any design system documentation page, verify:

- [ ] Page has a header with title, description, status badge, and date
- [ ] Every section leads with a visual example (swatch, rendered text, etc.)
- [ ] Token table columns are in order: Swatch, Token Name, Raw Value, Light, Dark, Usage
- [ ] *(Future)* Do/Don't usage block is present for every token group
- [ ] At least one code snippet is shown per section
- [ ] *(Future)* Accessibility contrast information is included for color/type tokens
- [ ] Related tokens and component links are listed at the bottom of each section
- [ ] Table of contents exists at top of page if there are 3+ sections
- [ ] Token names follow `{group}{Variant}{State}` convention
- [ ] Non-technical readers can understand every section without a glossary
