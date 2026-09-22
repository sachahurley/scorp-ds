# 5. Consumers vendor a committed copy instead of installing a package

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled; third consumer added in `#36`/`#37`)
- **Affects:** all three consumers, the `/vendor-portfolio` skill, every merge to `main`

## Context

Three sites consume Scorp DS: the portfolio (Vercel), the Scorpion Design System
showcase (GitHub Pages) and scorp-protodash (Vercel). None of them installs
`@scorp-ds/*` from a registry. Each holds a **committed copy** under `vendor/`, wired up
as `file:` dependencies.

## Decision

Keep vendoring. Consumers read a committed copy; `npm run vendor:ds` rebuilds and syncs
it, and the result is committed so cloud builds are self-contained.

Because of that, **merging to `main` here updates nothing downstream.** After every
merge, `/vendor-portfolio` runs for all three consumers without being asked.

## Options rejected

- **Publish to npm.** The clean answer, but it adds a release step, a version-bump
  negotiation and a registry dependency to a single-maintainer system, in exchange for
  solving a problem (drift) that a post-merge routine already solves.
- **Git submodules.** Shifts the problem to submodule pointer updates and breaks cloud
  builds that do not init recursively.
- **A monorepo containing the consumers.** Too large a change, and the three consumers
  have genuinely separate deploy targets and lifecycles.

## Consequences

- **A merge is not a release.** The live sites are unchanged until vendoring runs. This
  is the single easiest thing to forget and the reason the rule is stated in `CLAUDE.md`.
- **New files must be added to each consumer's vendor script**, or they are silently
  absent downstream. This has bitten before with new `lib/` files.
- Each consumer has a `ds:check` that detects drift against the source checkout.
- Anything published in the components package becomes part of the vendored payload,
  which is why contract-style artefacts are kept internal unless a consumer needs them.
