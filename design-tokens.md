# Scorp DS — Design Tokens Reference

> This is the prescriptive reference that maps every UI context to the correct token.
> Source of truth: `packages/tokens/src/tokens.json`

## How Tokens Work

Scorp DS uses a three-layer token architecture:

1. **Foundation** (`global` in tokens.json) — raw color scales, typography, spacing, motion. Reference these only from semantic tokens, never from components.
2. **Semantic** (`light` / `dark` in tokens.json) — purpose-named tokens that reference foundation values. Components always use these.
3. **CSS Variables** — generated from tokens.json and injected at runtime. Tailwind classes map to these via the preset.

## Semantic Aliases

| Alias | Resolves To | Use For |
|-------|------------|---------|
| `primary` | amber | Brand actions, CTAs, interactive highlights |
| `secondary` | sepia | Neutral actions, secondary surfaces |
| `success` | green | Positive states, confirmations |
| `info` | blue | Informational content |
| `warning` | purple | Caution states |
| `error` | red | Error states, destructive actions |

## Color Tokens

### Surface

| Token | Light | Dark | Use For |
|-------|-------|------|---------|
| `surface.page` | sepia.50 | sepia.1000 | Page/app background |
| `surface.container` | sepia.50 | sepia.1000 | Container background |
| `surface.card` | white | sepia.975 | Card surfaces |
| `surface.container-stroke` | sepia.500 | sepia.800 | Container borders |

### Text

| Token | Light | Dark | Use For |
|-------|-------|------|---------|
| `text.primary` | sepia.900 | sepia.50 | Primary body text, headings |
| `text.secondary` | sepia.600 | sepia.400 | Supporting text, captions |

### Button

| Context | Light Token | Dark Token |
|---------|------------|-----------|
| Primary background | primary.400 (amber.400) | primary.400 |
| Primary hover | primary.500 | primary.500 |
| Primary text | black | black |
| Secondary background | secondary.700 (sepia.700) | secondary.700 |
| Secondary text | secondary.50 | secondary.50 |

## Typography Tokens

| Token | Value | Use For |
|-------|-------|---------|
| `font.family.mono` | Fragment Mono | All text — Scorp DS is monospace everywhere |
| `font.size.xs` | 12px | Labels, captions |
| `font.size.sm` | 14px | Body text, buttons |
| `font.size.base` | 16px | Default body |
| `font.size.lg` | 18px | Lead text |
| `font.size.xl` | 20px | Section headings |
| `font.size.2xl` | 24px | Page subheadings |
| `font.size.3xl` | 48px | Page headings |

## Spacing Tokens

Base unit: **4px** per step (see `global.spacing` in `tokens.json`). Tailwind spacing classes (`p-4`, `gap-6`) map to these steps.

| Token | Value | Use For |
|-------|-------|---------|
| `spacing.0` | 0 | Flush layouts |
| `spacing.1` | 4px | Tight gaps |
| `spacing.2` | 8px | Small padding, icon gaps |
| `spacing.3` | 12px | Input padding, compact items |
| `spacing.4` | 16px | Standard padding |
| `spacing.5` | 20px | Comfortable inline spacing |
| `spacing.6` | 24px | Card padding, section gaps |
| `spacing.8` | 32px | Large section spacing |
| `spacing.10` | 40px | Hero / section padding |
| `spacing.12` | 48px | Major section breaks |
| `spacing.16` | 64px | Page-level rhythm |
| `spacing.20` | 80px | Marketing / landing blocks |
| `spacing.24` | 96px | Maximum layout rhythm |

## Motion Tokens

**Source of truth in `tokens.json`** (`global.duration`):

| Token | Duration (JSON) | Use For |
|-------|-----------------|--------|
| `duration.instant` | 0ms | No animation |
| `duration.fast` | 150ms | Hover, color transitions |
| `duration.normal` | 200ms | Show/hide, expand/collapse |
| `duration.slow` | 300ms | Modal enter/exit |
| `duration.slower` | 500ms | Full-page transitions |

**Runtime CSS (`packages/tokens/src/styles/tokens.css`)** currently exposes **shorter** values for the TUI tier (e.g. `--duration-fast: 50ms`). Components using Tailwind `duration-200` or CSS `var(--duration-*)` follow **whatever is in the CSS file** until the stylesheet is regenerated to match JSON. When in doubt, inspect `tokens.css` or Storybook **Foundation / Motion**.

## Radius Tokens

| Token | Value in `tokens.json` | Value in `tokens.css` (current) |
|-------|------------------------|----------------------------------|
| `radius.button` | 12px | `0px` (TUI sharp corners) |
| `radius.container` | 24px | `0px` (TUI sharp corners) |

> **Scorp DS** ships **sharp corners** in product UI (`rounded-none`). JSON retains non-zero radii for tooling / future tiers; CSS variables used in apps are **0px** today.
