# Token Taxonomy — Shared Reference

> Before using this file, read `.claude/ds-config.json` to get the correct class names, file paths, and package name for this project. Substitute those values wherever you see `{prefix}`, `{package}`, etc.

This file defines how tokens are classified, named, and organized in both code and Figma.

## Foundation File Locations

Read `.claude/ds-config.json: paths.foundation` for the base path. Files follow this pattern:

```
{paths.foundation}/colors.dart     → {tokens.classes.colors}
{paths.foundation}/typography.dart  → {tokens.classes.textStyles}
{paths.foundation}/spacing.dart     → {tokens.classes.spacing}
{paths.foundation}/icons.dart       → {tokens.classes.icons}
{paths.foundation}/motion.dart      → {tokens.classes.motion}
{paths.foundation}/opacity.dart     → {tokens.classes.opacity}
{paths.foundation}/gradients.dart   → {tokens.classes.gradients}
{paths.foundation}/shadows.dart     → {tokens.classes.shadows}
```

**Flutter:** All tokens are imported via barrel: `import 'package:{project.package}/{project.package}.dart';`

**React/TypeScript:** All tokens are imported from `@{project.package}/tokens` or `packages/tokens/src/index.ts`.

## Foundation vs Semantic Classification

| Type | Holds | Named by | Examples |
|------|-------|----------|----------|
| **Foundation** | Raw, unaliased design values — base scales and primitives | Raw value or scale step | `red500`, `fontSize14`, `space16`, `alphaBlack20` |
| **Semantic** | Purpose-named tokens that reference base values | Usage/context | `surfaceRaised`, `textPrimary`, `radiusMd`, `borderDefault` |

**Rule:** If a token holds a raw value, it is Foundation. If it is named by purpose/usage, it is Semantic.

## Figma Collection Structure

Use exactly **two** Figma variable collections:

### Collection 1: `Foundation`

Contains raw base scales organized by type:

| Group path | Content |
|---|---|
| `Colors/{Scale}` | Color scales (50-950 shades) |
| `Colors/Alpha` | Alpha overlay variants |
| `Colors/Shared` | Shared color primitives |
| `Typography/FontSize` | Font size scale |
| `Typography/FontWeight` | Font weight scale |
| `Typography/LineHeight` | Line height scale |
| `Typography/LetterSpacing` | Letter spacing scale |
| `Spacing/Scale` | Spacing scale + design unit |
| `Spacing/BorderWidth` | Base border widths |
| `Spacing/Blur` | Base blur values |
| `Opacity/Scale` | Opacity scale |

### Collection 2: `Semantic`

Contains purpose-named tokens referencing foundation values:

| Group path | Content |
|---|---|
| `Colors/Surface` | Surface color tokens |
| `Colors/Text` | Text color tokens |
| `Colors/Icon` | Icon color tokens |
| `Colors/Border` | Border color tokens |
| `Colors/Interactive` | Interactive state tokens |
| `Colors/Status` | Status feedback tokens |
| `Colors/State` | UI state overlay tokens |
| `Spacing/IconSize` | Icon size tokens |
| `Spacing/ImageSize` | Image container sizes |
| `Spacing/Radius` | Border radius tokens |
| `Spacing/ComponentHeight` | Component height tokens |
| `Spacing/ComponentPadding` | Component padding and gap tokens |
| `Spacing/BorderWidth` | Semantic border widths |
| `Spacing/Blur` | Semantic blur values |

**Note:** Semantic typography tokens are **Figma Text Styles**, NOT variables. Figma has no variable type for composed typography.

## Figma Variable Naming Convention

Variable names use `/` as the group separator:

```
{GroupPath}/{tokenName}
```

Examples:
- `Colors/Emerald/emerald50` — Foundation collection
- `Colors/Surface/surfaceDefault` — Semantic collection
- `Typography/FontSize/fontSize14` — Foundation collection
- `Spacing/Radius/radiusMd` — Semantic collection

## Token Naming Convention (Code)

- **Color tokens**: camelCase `{group}{Variant}{State}` — e.g. `textDefault`, `surfaceElevated`, `borderFocused`
- **Spacing tokens**: t-shirt sizing — e.g. `xs`, `sm`, `md`, `lg`, `xl`
- **Icon tokens**: camelCase, semantic names describing purpose not appearance
- **Component widgets/components**: PascalCase with `{prefix}` prefix — e.g. `{prefix}Button`
