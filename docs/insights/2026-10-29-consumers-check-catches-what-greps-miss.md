# consumers:check catches what a grep for call sites misses

- **Source:** the alias removal (#120), the chat composer (#140) and the required-names change (#117), 2026-10-29
- **Date:** 2026-10-29

## Finding

Before each breaking change, agents grepped the three consumers for affected call sites and
migrated them. `npm run consumers:check`, which vendors this checkout into each consumer and runs
that consumer's own build, still found breaks every grep missed:

- a multi-line `<Alert>` whose `variant` sat on the line after the tag (portfolio TarotLab);
- a site-owned component living among vendored files, which the migration script skipped by path
  (the showcase's `MusicPlayer.tsx`);
- a portfolio `<TabsList>` with no accessible name, missed by a single-line pattern;
- a vendor script that rewrote `../lib/` imports but not `../primitives/`, so the first DS
  component to import a primitive broke the showcase build (fixed in showcase #62).

## Lesson

A grep finds the call sites someone thought to look for; the compiler finds the rest. Fix what a
grep finds first, then run `consumers:check`, and fix the consumer (a forward-compatible PR there)
before the DS change merges, per decision 0021.
