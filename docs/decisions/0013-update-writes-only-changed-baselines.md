# 13. `--update` writes only the baselines that changed

- **Status:** accepted
- **Date:** 2026-09-23
- **Affects:** `scripts/visual-regression.mjs`, the `Visual regression` workflow, every baseline refresh

## Context

`--update` wrote every frame unconditionally:

```js
if (UPDATE || !existsSync(baselinePath)) { writeFileSync(baselinePath, shot); }
```

So a refresh run committed whatever happened to rasterise differently that day, not
what changed. `#71` landed six modified baselines of which **two** were real; the
other four contained no visible difference, and separating them meant decoding and
measuring each one by hand.

Six frames have moved this way since the suite was armed: four Accordion frames,
`accordion--not-collapsible-dark`, and `combobox--default-light`. Measured across
both revisions of each:

| Frame | Differing px | Max channel delta | Location |
|---|---|---|---|
| `accordion--default-dark` | 3 | 29 / 255 | x=273, y=372–374 |
| `accordion--open-dark` | 3 | 15 / 255 | x=273, y=372–374 |
| `accordion--controlled-dark` | 3 | 11 / 255 | x=273, y=387–389 |
| `accordion--multiple-dark` | 3 | 29 / 255 | x=273, y=403–405 |
| `combobox--default-light` | 1 | 28 / 255 | x=305, y=181 |

One pixel column, one to three pixels tall, same x per component, byte sizes
oscillating between exactly two values across runs. `pixelmatch` reports 0 for all
of them **even at threshold 0**, because its anti-aliasing detector excludes them.
Full measurement: `../insights/2026-09-23-baseline-churn-is-antialiasing.md`.

The cost is not the bytes. It is that a refresh diff which routinely contains noise
is a refresh diff that gets skimmed, and skimming is how a real regression gets
waved through. This suite's entire value is someone looking at these images.

## Decision

**An update run rewrites a baseline only when it is new, when its dimensions
changed, or when `pixelmatch` reports more than zero differing pixels.** Otherwise
the existing baseline is kept and the run logs `SETTLED` with the raw pixel count,
so an invisible difference is a number in the CI log rather than an unexplained
modified file in git.

The write gate (more than 0) is deliberately **stricter** than the failure gate
(more than `MAX_DIFF_PIXELS`, 10), so every frame the suite could ever fail on is
still rebaselined, with margin. Only the anti-aliased pixels are skipped, and the
comparison can never fail on those.

`--update --force`, exposed as the `force` input on the workflow, restores the
unconditional behaviour. That is the right tool after a Chromium or runner upgrade,
where a wholesale refresh is what you actually want. `--force` without `--update`
exits 2 rather than doing nothing quietly.

## Options rejected

- **Chase the sub-pixel edge at x=273.** It would be a component change to move a
  29/255 difference across three pixels, and it would fix these six frames rather
  than the class. The next component with a fractional edge would start it again.
- **Turn off `includeAA`.** It would convert this into 540 frames of noise and make
  the 10 px gate meaningless. The exclusion is what lets the gate sit at 10.
- **Leave it as cosmetic.** That was the standing position, and it holds right up
  until a refresh diff is large enough that nobody checks which frames in it are
  real.
- **Make the write gate equal the failure gate (10).** Simpler to explain, but it
  would silently decline to rebaseline a real 1–10 px change, which is exactly the
  size of the focus rings this suite exists to catch.

## Consequences

- **A baseline commit now contains only the frames the change produced.** That is
  what makes reviewing one possible.
- **An intended change that is both under 10 px and anti-aliasing-classified will
  not be written by `--update`.** Narrow, and `--force` covers it. This is the real
  cost of the decision and should not be discovered later by surprise.
- **Pruning is unaffected.** Skipped frames are still recorded as captured, so
  nothing is pruned for being unchanged.
- **The artifact flow still works.** `upload-artifact` uploads the whole baselines
  directory, so download-and-replace produces a clean diff.
- **The check for the next person:** dispatch `update: true` twice on the same
  commit. The second run must report `0 written` and leave `git status` clean.
