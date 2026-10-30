# A vendored dist must be built with the toolchain on `main`

- **Source:** the vendor pass after #119 (Storybook 8.6.19, Vite 6.4.5) on 2026-10-29; portfolio and scorp-protodash vendor PRs failed `ds-check` with `STALE components/dist`
- **Date:** 2026-10-29

## Finding

The portfolio and scorp-protodash vendor a *built* `components/dist`, compiled in the local
scorp-ds checkout. After pulling #119 the checkout's `node_modules` still held Vite 6.4.1. The
dist built with it differed from the one `ds-check` rebuilds in CI with Vite 6.4.5, so both
vendor PRs failed even though no source had changed. The showcase vendors source, not a dist,
and passed.

## Lesson

A build artifact is a function of the source and the toolchain. Pulling the source is not
enough; reinstall with `npm ci` before building anything that is compared against a CI build.
The `/vendor-portfolio` skill does this now (#127).
