# 32. A responsive prop takes a breakpoint map, and only where a pattern needs one

- **Status:** accepted
- **Date:** 2026-10-29
- **Affects:** `Stack` (`axis`, `align`), `Grid` (`columns`), every future responsive prop on
  a primitive; follows [0028](0028-composition-rules-are-written-down.md) and
  [0012](0012-stories-drive-their-own-interactions.md)

## Context

[0028](0028-composition-rules-are-written-down.md) moved every pattern into a preset that
uses the layout primitives, and let a preset keep plain flex only where no primitive fits.
WorkbenchSplit was one of the two exceptions: its two panes stack below `md` and sit side by
side from `md`, written as `flex min-h-[70vh] flex-col gap-4 md:flex-row`, because Stack's
`axis` was fixed per render. #115 logged it as a Known Gap on the pattern spec. A split that
changes direction at a breakpoint is the commonest responsive layout there is, so an agent
copying the preset was copying hand-written flex for the one part a primitive should own.

Grid already had the shape this needs. Its `columns` takes a number or a map such as
`{ base: 1, md: 2, lg: 3 }`, resolved through a static table of `grid-cols-*` classes per
breakpoint. Nothing had written that shape down as the rule for the next responsive prop.

Two facts constrain the implementation. Tailwind generates only the classes it finds
literally in source, so a class assembled at runtime (`` `${bp}:flex-row` ``) renders
nothing. And the breakpoints are tokens: `global.breakpoint` is `sm` 640, `md` 768, `lg`
1024, `xl` 1280 (plus `docked` 960, a component breakpoint for Modal), mirrored in the
preset's `screens`, so `md:` in a class is the token.

## Decision

1. **A responsive prop accepts either its plain value or a breakpoint map.** The map's keys
   are `base`, `sm`, `md`, `lg` and `xl`, mobile first: `base` applies below `sm`, and each
   later key applies from its breakpoint until the next key overrides it. `docked` is not a
   key: it belongs to Modal, not to layout. The plain value keeps exactly the classes it
   emitted before the prop became responsive, so making a prop responsive never changes an
   existing render.
2. **A new responsive prop requires `base`.** `Stack`'s `axis` map is
   `{ base: "vertical" | "horizontal"; sm?; md?; lg?; xl? }`. Grid's `columns` map predates
   this record and lets `base` fall back to one column; that stays, since tightening it would
   break callers.
3. **Classes come from a static table**, one entry per breakpoint and value, written out in
   full (`md:flex-row md:flex-wrap`), and are emitted in breakpoint order whatever order the
   caller wrote the keys in. Never a template string.
4. **A value means the same thing at every breakpoint.** `horizontal` is a wrapping row that
   centres its children whether it is the plain value or the `md` entry of a map; a later
   `vertical` entry resets the wrap and the centring an earlier `horizontal` turned on.
5. **Only the prop a pattern needs becomes responsive.** `axis` is responsive because
   WorkbenchSplit needs it. Stack also gains `align` (`start | center | end | stretch`, the
   Grid vocabulary), but as a plain value, because a split's panes want `stretch` at every
   breakpoint while a row's default is `center`. `gap`, `align`, Inline's props and the rest
   become responsive when a real pattern needs a value to change at a breakpoint, not before.
6. **A responsive prop that changes structure ships a story on each side of its
   breakpoint**, each declaring its viewport, as 0012 already requires:
   `Stack/Responsive Axis: base` at 375 and `Stack/Responsive Axis: md` at 1024, and
   `Patterns/WorkbenchSplit` gains `Log inspector: stacked` at 375 beside the 900 frame.

## Options rejected

- **Responsive maps on every Stack prop at once** (`gap`, `align` and `axis`). It is the
  complete API, but no pattern changes its gap or its alignment at a breakpoint, and every
  responsive prop multiplies the class table and the frames 0012 asks for. A prop nobody
  uses has no story that shows it working.
- **A direction-only map**, where `md: "horizontal"` emits just `md:flex-row`. It is what
  the split wanted without `align`, but `axis="horizontal"` and
  `axis={{ base: "horizontal" }}` would then render differently, and an agent cannot learn
  a value that means two things.
- **A separate `ResponsiveStack` or `Split` component.** A split is a Stack whose direction
  changes; a second primitive would duplicate gap, ref forwarding and attribute spreading,
  and agents would have to choose between two near-identical components.
- **Building the class name from the breakpoint** (`` `${bp}:flex-row` ``). Tailwind never
  sees the class, so it ships unstyled.
- **Leaving the split as plain flex with a className override** (`md:items-stretch` merged
  over the row's `md:items-center`). It works through tailwind-merge, but the caller has to
  know which class the primitive emits in order to cancel it.

## Consequences

- WorkbenchSplit's split is a `Stack` (`axis={{ base: "vertical", md: "horizontal" }}`,
  `align="stretch"`), and its Known Gap is closed. The rendered result is unchanged: the
  row gains `md:flex-wrap`, which never wraps here because the inspector's flex basis is
  zero, and `items-stretch`, which is the flex default the old div already had.
- The catalog lists `axis` as `StackAxis`, not as its values, because a union with an
  object type has no value list; the prop's JSDoc names the values and the map. Grid's
  `columns` has the same limitation.
- The breakpoint names now live in two type aliases, `GridBreakpoint` and
  `StackBreakpoint`. A third responsive primitive is the point to move them, and the map
  type, into one shared `lib/` module rather than copy them again.
- `composition-presets-guidelines.md` still lists the responsive split as having no
  primitive; it is updated alongside this record's PR or right after it.
