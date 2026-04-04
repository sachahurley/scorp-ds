# Composition Presets Guidelines

## What is a Composition Preset?

A preset is a shared function in your storybook's `presets/` directory that returns a component/widget with a canonical, locked-in configuration.

Presets are the single source of truth for how components are assembled in storybook examples and screen compositions. Both story playgrounds and screen samples import from the same preset, so editing it once updates every place that uses it.

**Flutter:** Presets live in `ds/example/lib/storybook/presets/` and return `Widget`.
**React/TypeScript:** Presets live in `packages/storybook/presets/` and return `JSX.Element`.

## Two Levels of Editing

### Level 1: The component itself
**Where**: `ds/lib/components/` (Flutter) or `packages/components/src/` (React/TS)
**Controls**: What the component CAN do — its props, variants, layout, tokens.
**When to edit**: Changing how ALL instances of a component behave.

### Level 2: The preset function
**Where**: `example/lib/storybook/presets/{category}_presets.dart` or `packages/storybook/presets/{category}.tsx`
**Controls**: How a component is USED in a specific context.
**When to edit**: Changing how one screen's version of a component looks.

## When to Create a Preset

Create a preset when:
- A component configuration appears in more than one file
- A screen template needs a component that has a playground example
- A widget tree involves non-trivial assembly (nested components, custom painters, complex state)

Do NOT create a preset for:
- Trivially simple configurations (a single text element)
- Configurations unique to one documentation section that will never be reused

## Preset Design Rules

1. **Return the component, not state.** Presets are pure component factories. Stateful logic stays in the screen sample.

2. **Lock all design decisions.** Tokens, variants, spacing, and visual configuration are fixed inside the function body.

3. **Only expose what genuinely varies:**
   - `onDark` — surface context (required for most presets)
   - Callback functions — `onPress`, `onTap`, `onItemTapped`
   - Display data — text strings, numbers, images

4. **Never accept token values as parameters.** No `color: string`, no `spacing: number`, no `variant: string` where the variant should be locked. If someone needs a different variant, that is a different preset.

5. **Naming**: `{context}{Component}Preset()`
   - `homeAppBarPreset()` — the Home screen's app bar
   - `glassAvatarPreset()` — the glass-rimmed avatar used in app bars
   - `insuranceCardPreset()` — a single insurance offer card

6. **Doc comments** on every preset explaining what it configures and showing a usage example.

## File Organization

| File | Contents |
|------|----------|
| `app_bar_presets.*` | App bar layout configurations |
| `nav_bar_presets.*` | Bottom nav bar configurations |
| `card_presets.*` | Card compositions |
| `list_presets.*` | List compositions |
| `screen_scaffold_presets.*` | Screen archetype presets |

New files follow the pattern: `{category}_presets.*`

## How Stories Consume Presets

**Flutter:**
```dart
_LayoutLabel(label: 'Home'),
homeAppBarPreset(onDark: false),
```

**React/TypeScript:**
```tsx
<LayoutLabel label="Home" />
{homeAppBarPreset({ onDark: false })}
```

## Screen Archetype Presets

Every screen falls into one of five archetypes. Each archetype has a corresponding preset function in `screen_scaffold_presets.*` that pre-configures the scaffold with the correct app bar variant, bottom nav settings, and layout.

### Archetype Reference

| Archetype | Preset | App Bar | Bottom Nav | Notes |
|-----------|--------|---------|------------|-------|
| Home hub | `hubScreenScaffold()` | Avatar + center element | Yes | Main entry point screen |
| Section landing | `sectionScreenScaffold()` | Left title | Yes | Category pages with tab bars |
| Detail page | `detailScreenScaffold()` | Back + title | No | Content detail screens |
| Wizard/flow | `wizardScreenScaffold()` | Back + progress | No (CTA footer) | Multi-step flows |
| Immersive | `immersiveScreenScaffold()` | Back only | No | Full-bleed content screens |

### Rules

1. Every screen sample MUST use a screen archetype preset.
2. Never place titles or navigation elements in the scrollable body. Use the app bar or pinned content slots.
3. Sticky footers use the `footer` parameter, not positioned/absolute elements.
4. Tab bars use the `pinnedContent` parameter.
5. Always pass `scrollController` to the scrollable widget and use `contentPadding` for correct bottom clearance.

## Adding a New Preset

1. Add the function to the appropriate `*_presets.*` file
2. Add a doc comment with usage example
3. If creating a new file, export it from the presets barrel file
4. Update any stories or samples that should use it
5. Verify with static analysis (`flutter analyze` or `tsc`)
