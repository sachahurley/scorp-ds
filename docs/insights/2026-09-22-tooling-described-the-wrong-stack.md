# Most agent tooling described a stack this repo does not use

- **Source:** audit of `.claude/` and `scripts/`, 2026-09-22
- **Date:** 2026-09-22

## Finding

Scorp DS was generated from `ds-framework`, whose template ships **both** a
`starters/flutter` and a `starters/react-ts`. The Flutter branches came in with the
template and were never stripped. At the time of the audit:

- **13 of 19** `SKILL.md` files carried Flutter branches, telling agents to scan for
  `Color(0x`, `EdgeInsets`, `pubspec.yaml` and `.dart` files that do not exist here.
- `.claude/shared/token-taxonomy.md` mapped tokens to `colors.dart`, `typography.dart`
  and `spacing.dart`. None exist; the real source is one `tokens.json`. Four of its
  eight `{tokens.classes.*}` placeholders were not even defined in `ds-config.json`.
- `ds-config.json` carried `tokens.classes` describing Dart classes that exist nowhere.

## Why it mattered more than dead weight

Three of these were **actively wrong**, not merely unused:

1. `review-component` and `token-taxonomy.md` instructed agents to enforce a
   `ScorpButton` naming convention that `CLAUDE.md` explicitly forbids. An agent
   following its own tooling would have "fixed" correct code.
2. `detect-spec-drift.sh` read `components` and `foundation` from config but left
   `primitives` and `lab` pinned to `ds/lib/*`. Those directories do not exist, and the
   function opened with a silent `return`, so **the primitives layer was never scanned
   and drift reported clean**. Its status-upgrade search matched `.dart` and `.ts` but
   not `.tsx`, so it found zero component sources; after the fix it found 51.
3. `ds-health.sh` defaulted `STACK="flutter"` and fell back to it whenever `python3` was
   unavailable, running the entire Flutter path against a React repo.

## Lesson

A silent skip is worse than a crash. Tooling that cannot check a layer must **say so**;
a default that is plausible but wrong converts a missing check into a false pass. Both
scripts now read every path from config and fail loudly when they cannot, and a
configured-but-missing layer is reported as `SKIPPED`.
