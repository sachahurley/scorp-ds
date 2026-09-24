# Baseline byte churn is anti-aliasing, and the fix is in what `--update` writes

*2026-09-23. Follows the viewport work in #70–#72.*

## The observation

Every `--update` run produced a handful of modified baselines that contained no
visible change. Six frames have done this since the suite was armed:

- `components-display-accordion--default-dark`
- `components-display-accordion--open-dark`
- `components-display-accordion--controlled-dark`
- `components-display-accordion--multiple-dark`
- `components-display-accordion--not-collapsible-dark`
- `components-inputs-combobox--default-light`

They were reported as "pixel-identical PNG byte churn" and left alone as cosmetic.
That description was right about the effect and incomplete about the cause.

## The measurement

Both revisions of each frame were pulled from git and diffed at the pixel level:

| Frame | Differing px | Max channel delta | Location |
|---|---|---|---|
| `accordion--default-dark` | 3 | 29 / 255 | x=273, y=372–374 |
| `accordion--open-dark` | 3 | 15 / 255 | x=273, y=372–374 |
| `accordion--controlled-dark` | 3 | 11 / 255 | x=273, y=387–389 |
| `accordion--multiple-dark` | 3 | 29 / 255 | x=273, y=403–405 |
| `combobox--default-light` | 1 | 28 / 255 | x=305, y=181 |

Three facts follow.

**It is one pixel column, one to three pixels tall, always at the same x per
component.** That is a sub-pixel edge rasterising one of two ways, not drift.

**`pixelmatch` reports 0 even at threshold 0.** Its anti-aliasing detector
(`includeAA: false`, the default) excludes these pixels at *any* threshold. The
harness is not under-sensitive here, it is deliberately blind to them, and that
exclusion is what keeps the 10 px gate meaningful. With `includeAA: true` the raw
count comes back as 3.

**The byte sizes oscillate between exactly two values** across runs: 12270 ↔ 12266,
12218 ↔ 12217, 13687 ↔ 13691. Bistable, not accumulating.

This also corrects a claim in the harness's own comment. "Two `--update` runs at
the same commit differed by exactly 0 px" is true as pixelmatch measures it and
false of the bytes on disk, and the next person to read it would have gone looking
for a different cause.

## Why it mattered

Not for the bytes. For the diff.

`--update` wrote every frame unconditionally, so a refresh run committed whatever
happened to rasterise differently that day. #71 landed six modified baselines of
which two were real, and telling them apart meant decoding and measuring each one
by hand. A refresh diff that routinely contains noise is a refresh diff that gets
skimmed, and skimming is how a real regression gets waved through. The suite's
value is entirely in someone looking at these images.

## The fix

The choice this forced is recorded in
[`../decisions/0013-update-writes-only-changed-baselines.md`](../decisions/0013-update-writes-only-changed-baselines.md).


`--update` now compares before it writes. A frame is written when it is new, when
its dimensions changed, or when `pixelmatch` reports more than zero differing
pixels. Otherwise the existing baseline is kept and the run logs `SETTLED` with the
raw pixel count, so an invisible difference appears as a number in the CI log
rather than as an unexplained modified file in git.

The write gate (more than 0) is deliberately stricter than the failure gate (more
than 10), so every frame the suite could ever fail on is still rebaselined, with
margin. Only the anti-aliased pixels are skipped, and those can never fail.

**The cost, stated plainly:** an *intended* change that is both under 10 px and
anti-aliasing-classified will not be written. `--update --force`, exposed as the
`force` input on the workflow, restores the old unconditional behaviour and is the
right tool after a Chromium or runner upgrade.

## Verified

Against the real script, on the committed baselines, with `--filter` so pruning
stays off:

| Run | Expectation | Result |
|---|---|---|
| `--update` with Linux baselines and a macOS capture | every frame differs, all written | 12 written, 0 unchanged |
| `--update` again, same platform | nothing to write | 0 written, 12 unchanged |
| `--update` with one baseline re-encoded (same pixels, different bytes) | `SETTLED`, baseline kept | logged, 0 written |
| `--update --force` | rewrite regardless | 12 written |
| compare mode, unchanged | passes | matched 12, changed 0 |
| compare mode, missing baseline | created | `NEW`, new 1 |
| compare mode, 400 px perturbation | fails | `CHANGED` 400 px, exit 1 |
| `--force` without `--update` | refuses rather than no-ops | message, exit 2 |

The end-to-end check in CI is to dispatch `update: true` twice on the same commit.
The second run must report `0 written` and leave `git status` clean.

## Not done

**Chasing the sub-pixel edge at x=273.** It would be a component change to move a
29/255 difference on three pixels, and it would fix only these six frames. The
write gate fixes the class.

**Turning off the anti-aliasing exclusion.** It would convert this into 540 frames
of noise and make the 10 px gate meaningless.
