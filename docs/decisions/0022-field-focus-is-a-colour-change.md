# 22. Text-field focus is a colour change, not an inset ring

- **Status:** accepted
- **Date:** 2026-10-28
- **Affects:** `Input` (box and quiet), `Textarea`; narrows [0002](0002-focus-rings-are-inset.md) for text fields

## Context

Fields are drawn with the plate ring recipe: a wrapper filled with the border colour,
clipped to the plate, holding the field 1px inset. On focus the wrapper turns
`--field-border-focus`.

In #49 Input and Textarea also gained the system's 2px inset focus ring from
[0002](0002-focus-rings-are-inset.md), drawn inside the plate on top of the amber
wrapper. The two stack, so a focused field read as a 3px amber border: heavier than
every other field, and it looked like the field had grown. The quiet Input did the same
thing to its underline. Select and Combobox never took the inset ring; they change the
ring colour only, and focus wins over error there so an errored field still shows focus.

The audit finding #49 was fixing had two parts: the ring change was only 1px, and the
error state showed no focus change at all. The second part was a real WCAG 2.4.7 failure.
The first was a preference.

Measured: in dark the focus ring is 4.67:1 against the idle ring and 8.78:1 on the
field. In light it is 2.03:1 against the idle ring and 1.67:1 on the white field. A
text field also shows a blinking caret the moment it has focus, which no button or
checkbox does.

## Decision

Text-field focus is the 1px ring (or quiet underline) changing to `--field-border-focus`,
and nothing else. No inset box-shadow, no thickening. Focus wins over error, exactly as in
Select and Combobox:

```
ring:  bg-[var(--field-border)] hover:bg-[var(--field-border-hover)] focus-within:!bg-[var(--field-border-focus)]
error: bg-[var(--field-border-error)] focus-within:!bg-[var(--field-border-focus)]
quiet: border-b ... focus:!border-[var(--field-border-focus)]
```

[0002](0002-focus-rings-are-inset.md) still governs every other focusable component.

## Options rejected

- **Keep the inset ring at 1px.** Still stacks on the 1px wrapper to make 2px, so the
  field still grows on focus.
- **Keep the inset ring and drop the wrapper colour change.** Same weight problem, and
  it diverges from Select and Combobox.
- **Keep the error ring red on focus and only add the inset ring there.** Brings back a
  heavier focus in one state; focus-wins-over-error already fixes the 2.4.7 gap and is
  what the other two fields do.

## Consequences

- All four field components (Input, Textarea, Select, Combobox) now show focus the same
  way, which is the point.
- Light-mode focus leans on a 2.03:1 colour step plus the caret. That passes 2.4.7 (AA)
  but not the 3:1 change-of-contrast in 2.4.13 Focus Appearance (AAA). If light focus
  needs to be stronger, change `--field-border-focus` in light; do not add weight.
- In the error state the red ring turns amber while focused. The error is still carried
  by the error fill, `aria-invalid` and the message with its icon.
