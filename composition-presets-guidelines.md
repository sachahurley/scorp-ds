# Composition Presets Guidelines

## What is a composition preset?

A preset is a shared function or constant in `packages/storybook/presets/` that returns
a canonical, locked-in configuration of design-system components.

Presets are the single source of truth for how components are assembled in Storybook
examples and screen compositions. Stories import from the preset rather than restating
the composition, so editing it once updates every place that uses it.

Presets return `JSX.Element` (or typed content data, such as an array of blocks).

## Two levels of editing

### Level 1: the component itself

**Where:** `packages/components/src/components/` or `packages/components/src/primitives/`
**Controls:** what the component CAN do: its props, variants, layout, tokens.
**When to edit:** changing how ALL instances of a component behave.

### Level 2: the preset

**Where:** `packages/storybook/presets/{name}.tsx` (or `.ts` for content-only presets)
**Controls:** how components are USED together in a specific context.
**When to edit:** changing how one screen's version of a composition looks.

## When to create a preset

Create a preset when:

- A composition appears in more than one file
- A screen story needs a composition that also has a playground example
- The assembly is non-trivial (nested components, meaningful state, ordered content)
- A consumer project renders the same composition and must not fork it

Do NOT create a preset for:

- Trivially simple configurations (a single element)
- Configurations unique to one documentation section that will never be reused

## Preset design rules

1. **Compose only DS components and primitives.** A preset must not introduce bespoke
   layout CSS, raw colour values, or hardcoded spacing. If a preset needs something the
   system cannot express, that is a gap in the system: fix the component or add a token.
2. **No hardcoded values.** The same "No Hardcoding" rules in `CLAUDE.md` apply here.
3. **Add a JSDoc comment** naming what the preset is for and who consumes it.
4. **Keep content and structure separable** when a consumer shares the content. See
   `caseStudy.ts`, which exports typed block data consumed by both the Screens story
   and the portfolio, so the demo page never forks.

## Composition rules

How components are put together in a screen. Every rule here is written from what the
patterns in `stories/Patterns/` and their presets already do, so a screen built by these
rules looks like the rest of the system. The reasoning is in
`docs/decisions/0028-composition-rules-are-written-down.md`. When a rule and a preset
disagree, one of them is wrong: fix it in the same change.

Spacing steps are named by their token: `spacing.2` is `--spacing-2` (8px), reached as
`gap="2"` on a layout primitive or as `gap-2` / `p-2` in a class. Only steps in the scale
are allowed (`scorp/no-off-scale-spacing`, decision 0027).

### Spacing hierarchy

Space grows as the relationship loosens. From tightest to loosest:

| Between | Step | Where it is set | Seen in |
|---|---|---|---|
| A label, its control and its message | owned by the field | the component (`space-y-1` inside Input) | every field |
| Options in one choice group (radios, checkboxes) | `spacing.2` | `Stack gap="2"` inside the `fieldset` | Forms |
| A group mixing Switch rows and Checkboxes | `spacing.4` | `Stack gap="4"` inside the `fieldset` | SettingsPanel |
| A legend and its options | `spacing.2` (field-style legend), `spacing.3` (section-style legend) | `mb-2` / `mb-3` on the `legend` | Forms, SettingsPanel |
| Fields in one group, in a Card holding several groups | `spacing.3` | `Stack gap="3"` | SettingsPanel |
| Fields in a Card holding a single group | `spacing.4` | `space-y-4` on the `form` | AuthCard |
| Groups (and, in a page-level form, every field) | `spacing.6` | `Stack gap="6"` / `space-y-6` on the `form` | SettingsPanel, Forms |
| A section rule and the titled group under it | `spacing.4` | `Divider spacing="none"` and the group in a `Stack gap="4"` | SettingsPanel |
| Buttons in an action row | `spacing.3`; `spacing.2` in the densest rows | `Inline gap="3"` / `gap="2"` | Forms, AuthCard, MarketingHero (3); SettingsPanel footer, WorkbenchSplit toolbar (2) |
| The action row and the last field of a page-level form | `spacing.6` plus `spacing.2` | the form's `space-y-6`, `pt-2` on the row | Forms |
| Items inside a dense row; rows of a dense list | `spacing.3`; `spacing.2` | row `gap-3 px-3 py-2`; `Stack gap="2"` | DenseListRow |
| Panes of a split | `spacing.4` | `gap-4` on the split | WorkbenchSplit |
| Page edge to content (pattern pages) | `spacing.6`, `spacing.10` from `md` | `p-6 md:p-10` on the shell | Forms, AuthCard, SettingsPanel, SideNavigation, DenseListRow |
| Page edge to content (tool screens) | `spacing.4`, `spacing.6` from `md` | `p-4 md:p-6` on the shell | WorkbenchSplit |
| Eyebrow line to the content under it | `spacing.4` | `space-y-4` / `mb-4` on the column | every pattern story |

- **Padding belongs to the container.** Card pads its header, body and footer itself
  (`p-4`, `p-6` from `lg`); Modal pads its body `px-6 py-5`; Window pads its body `p-4`.
  Never add padding to a Card or Modal body to change the density. Window is the one
  container whose body padding is meant to be set (`bodyClassName`): `p-2` for a list
  that draws its own rows, `p-0` for an edge-to-edge child.
- **A real page uses Container for its gutters** (20px, 40px from `lg`), not the pattern
  shell's padding; the shell is a documentation frame.
- **Column widths:** `max-w-md` (448px, the same as `Center maxWidth="md"`) for a single
  form or an auth card; `max-w-xl` for a settings card; `max-w-3xl` for lists and
  navigation. A form or card does not set its own width: the column around it does.

### Nesting rules

What may contain what. Each rule is already in the spec named after it.

- **No Card inside a Card.** Separate subgroups inside a Card body with a `Divider` or with
  spacing (`Card.md`). Two independent groups are two Cards.
- **No Window inside a Window** (`Window.md`). Panes sit side by side in a split.
- **No Modal opened from a Modal.** Replace the content or close first (`Modal.md`).
- **No Divider in a Card or Modal header or footer.** They draw their own hairlines
  (`Divider.md`). A Divider inside a Card body, between groups, is the intended use.
- **Menus, popovers and tooltips inside a Card or a ringed Box open inward or portal
  out.** The plate clip-path cuts off anything that overflows (`Card.md`, `Box.md`).
- **A container inside a framed pane drops its own frame.** A SideNav inside a Window
  takes `className="w-full border-0 bg-transparent p-0"` and the Window body `p-2`, so
  there is one frame, not two (WorkbenchSplit).
- **A scrolling child inside a Window turns the Window's scroll off** (`scroll={false}`),
  so there is one scroll region (`Window.md`, WorkbenchSplit).
- **Modal content is the body and the footer, nothing else.** The body is already padded;
  `footerContent` holds the Buttons (see Slot content). The `title` is required and is the
  dialog's accessible name.
- **A form in a Card sits in the body; its actions sit in `footerContent`.** The footer is
  outside the `<form>` element, so the primary action names the form: `type="submit"`
  with `form={formId}` from `useId()` (AuthCard). Or wrap the whole Card in the `<form>`.
- **A full-bleed band is a Box (the background) around a Container (the measure)**
  (`Box.md`).

### Slot content

What each slot accepts and how its contents are arranged.

| Slot | Accepts | Arrangement |
|---|---|---|
| Button `iconLeft` / `iconRight` | One `TuiIcon` with no `size`: Button sizes the box (16, 20, 24px for `sm`, `md`, `lg`) | `iconLeft` makes an action quicker to recognise ("+ New"); `iconRight` shows direction or destination (an arrow on "Next", `ExternalLink`) |
| Icon-only Button (children) | One `TuiIcon`, plus an `aria-label` that names the action ("Open menu") | `variant="icon"` in rows and toolbars, `variant="ghost"` in a Window title bar |
| Card `footerContent` | Buttons in one `Inline`; Card does not lay out its footer | `Inline justify="end"`, quiet action first, primary last (SettingsPanel). The auth footer is the exception: a quiet `link` on the left, the primary on the right, `Inline justify="between"` (AuthCard). One primary per Card. |
| Card `headerContent` | A custom header (an Avatar plus a name) when `title` and `subtitle` are not enough | Replaces `title` / `subtitle`; render the heading yourself if the page needs a level other than `h3` |
| Modal `footerContent` | Buttons as a fragment, with no wrapper | Modal right-aligns them with `spacing.3` itself; secondary (Cancel) first, primary last |
| Window `actions` | `sm` icon-only Buttons (`variant="ghost"`) or a Badge, as a fragment | Window places them right of `status` with `spacing.1`. Labelled actions go in a toolbar inside the body (WorkbenchSplit), not in the title bar. |
| Window `status` | Short text or a `sm` Badge ("tail · last 200 lines", "passed") | Right of the title |
| AppHeader `actions` | A few controls, as a fragment: ThemeToggle, an icon-only search Button, an Avatar | AppHeader right-aligns them with `spacing.2`; they stay visible on mobile, so never put the only copy of an action in `mobileMenu` |

**Action order, everywhere:** the quiet or secondary action comes first and the one
primary action comes last (rightmost). In a toolbar the field comes first and takes the
spare width (`flex-1`), then secondary, then primary (WorkbenchSplit). In a dense row the
status Badge comes before the actions, and the overflow icon menu is always last
(DenseListRow).

**Action size:** Buttons match the fields they act on in a page-level form (`md`, Forms).
In a Card footer, a Modal footer, a pane toolbar and a dense row they are `sm`. The one
exception today is AuthCard, whose primary is `md` beside a `sm` link.

### Form rules

- **Every field has a visible label** from the field's own `label` prop; never use the
  placeholder as the label. A field with no room for one (a filter in a toolbar) takes
  `aria-label` instead (WorkbenchSplit). A Switch in a setting row takes `label` plus
  `hideLabel`, with the setting's name and consequence as text beside it (Forms).
- **A group of radios or checkboxes is a `fieldset` with a `legend`,** so the group's name
  is announced when focus enters it. The legend is the first child of the fieldset and
  the options follow in a `Stack`. A legend that asks one question ("Theme") takes the
  field label style (`text-sm`, `secondary-800` / `secondary-200`); a legend that titles a
  section of a settings card takes the eyebrow style (`text-xs uppercase tracking-wider`,
  `--text-primary`).
- **Error messages go in the field's `errorMessage` prop,** which renders under the field
  and links it with `aria-describedby`. Do not render error text yourself. A failed
  submit that is not about one field is an `Alert` above the form.
- **Inside a `<form>`, the primary action is `type="submit"`** and every other button is
  `type="button"`. **Outside a form, every Button is `type="button"`.** Always write the
  type: a button with no type inside a form submits it.
- **One primary action per form or Card.**
- **The `<form>` element carries the spacing class** (`space-y-6`, `space-y-4`), because
  Stack renders a `div` and takes no `as`.

### Layout primitive choice

| Need | Use | Not |
|---|---|---|
| A column of items with one gap (fields, groups, rows) | `Stack` | `space-y-*` on a div (a `<form>` is the exception, see Form rules) |
| A row that may wrap: action rows, toolbars, meta rows, a setting row | `Inline` (`justify="end"` for actions, `"between"` for a setting row or the auth footer, `align="baseline"` for a label plus value) | a hand-written `flex flex-wrap items-center gap-*` div |
| Items that line up across rows and columns (card grids) | `Grid` with `columns` per breakpoint | Inline with fixed widths |
| Tabular data with headers | `Table` | Grid |
| One centred column with a measured width (sign-in, splash, error page) | `Center` (`fullHeight` when it owns the viewport) | `mx-auto max-w-*` outside a pattern shell |
| The page's width and gutters, as the page landmark | `Container` (`as="main"`) | page padding classes |
| A padded surface with a semantic background, optionally ringed, with no header or footer | `Box` | a Card with no title, or a hand-styled div |
| A titled group with header and footer rules | `Card` | Box |
| A framed terminal pane with a title bar | `Window` | Card |

`Stack axis="horizontal"` still works for a button group (MarketingHero uses it), but
`Inline` is the row primitive for new work: it wraps on narrow screens and takes `justify`.

A split whose axis changes at a breakpoint is a `Stack` with a breakpoint map:
`axis={{ base: "vertical", md: "horizontal" }}` (WorkbenchSplit; decision 0032). One thing
still has no primitive and is written as plain flex in its preset: the chrome of a dense
list row (`DenseRowShell`), a Known Gap in its pattern spec.

## Current presets

| File | Exports | Purpose | Story |
|---|---|---|---|
| `presets/caseStudy.ts` | `caseStudyTemplate`, `scorpionCaseStudy` | Canonical case-study content, shared with the portfolio | `Screens/CaseStudyTemplate`, `Patterns/CaseStudy` |
| `presets/marketingHero.tsx` | `MarketingHeroScreen` | Canonical marketing hero composition | `Screens/MarketingHero` |
| `presets/forms.tsx` | `AccountSettingsForm` | A complete single-column form using every field component; the reference for the form rules | `Patterns/Forms` |
| `presets/settingsPanel.tsx` | `WorkspaceSettingsPanel` | One Card of grouped settings with footer actions; the reference for the spacing hierarchy | `Patterns/SettingsPanel` |
| `presets/authCard.tsx` | `SignInCard` | Sign-in Card: password visibility toggle, auth footer, submit button outside the form | `Patterns/AuthCard` |
| `presets/sideNavigation.tsx` | `SideNavigationRail`, `navigationRailTopItems`, `navigationRailSectionItems` | The sidebar rail: SideNav with top-level links and one collapsible group | `Patterns/SideNavigation` |
| `presets/denseListRow.tsx` | `JobRunList`, `JobRunListRow`, `DenseRowShell`, `jobRunRows` | Dense list rows: avatar, text column, status, trailing actions | `Patterns/DenseListRow` |
| `presets/workbenchSplit.tsx` | `LogInspectorSplit`, `workbenchBuffers`, `workbenchLogLines` | Two terminal panes: buffer index beside the focused inspector | `Patterns/WorkbenchSplit` |

`Patterns/MusicPlayer` is not a preset: it is a large stateful demo whose playback hook
and layouts are story-local, documented in `docs/specs/patterns-music-player.md`.

## How stories consume presets

```tsx
import { caseStudyTemplate } from '../../presets/caseStudy';
import { MarketingHeroScreen } from '../../presets/marketingHero';
import { WorkspaceSettingsPanel } from '../../presets/settingsPanel';
```

A pattern story is the page shell (the `--surface-page` background, the column width, the
eyebrow line and the footnote) around one preset. The shell is documentation; the preset
is what a screen copies.

Screen-level composition lives in `presets/` and is documented under `stories/Screens/`.
Flows (multi-step journeys) stay in specs or product apps: Storybook shows one screen at
a time.

## Adding a new preset

1. Add the file to `packages/storybook/presets/`
2. Add a JSDoc comment with a usage example
3. Update any stories that should use it
4. Verify with `npm run lint` and `npm run type-check`
5. If a consumer project will render it, note that in the JSDoc so the vendoring step
   is not missed
