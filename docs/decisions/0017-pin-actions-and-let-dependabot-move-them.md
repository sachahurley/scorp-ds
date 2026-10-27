# 17. Pin actions to commits, and let Dependabot move them

- **Status:** accepted
- **Date:** 2026-10-27
- **Affects:** every `uses:` in `.github/workflows/`, `.github/dependabot.yml`, the repo's Dependabot settings

## Context

Every workflow referenced its actions by a moving major tag (`actions/checkout@v4`). The
owner of a tag can point it at different code at any time, and the next run executes it with
this repo's token. Aura DS pins every action to a commit hash with the tag in a comment; the one
exception there (`trivy-scan@main`) is the one it cannot vouch for.

Separately, nothing kept dependencies current. Dependabot alerts were **off**, and on
2026-10-27 `npm audit` reported 38 findings (4 critical, 11 high), 5 of them in packages that
are not dev-only: esbuild, nanoid, postcss, postcss-selector-parser and source-map-js.

## Decision

- Every `uses:` names a full commit SHA, followed by `# vX.Y.Z`. The SHAs chosen on
  2026-10-27 are the ones the moving tags pointed at that day, so pinning changed no behaviour.
- `.github/dependabot.yml` opens weekly grouped PRs: one for actions, and for npm one each for
  Storybook packages, runtime dependencies and tooling. Semver-major version updates are
  ignored; a major is a migration and gets its own PR.
- Dependabot alerts and Dependabot security updates are enabled in the repo settings.
- `npm audit` is **not** a CI gate yet. It would be red on day one, and a gate that starts red
  gets bypassed (decision 0014). The weekly health run (decision 0018) reports it; once the
  findings outside dev dependencies are cleared, `npm audit --omit=dev --audit-level=high`
  joins the `checks` job.

## Options rejected

- **Keep tags and trust the publishers.** Cheapest, and the only option where a compromised
  tag runs here with no change of ours.
- **Pin SHAs without Dependabot.** Pins then rot: nobody updates a hash by hand, so the repo
  would sit on old action versions indefinitely.
- **Gate on `npm audit` now.** See above: it would block every PR on findings no PR caused.
- **Let Dependabot propose majors.** Storybook 9 or a new `@storybook/test-runner` arrives as a
  routine-looking PR that breaks the a11y runner (CLAUDE.md pins the test-runner to the
  Storybook major).

## Consequences

- Updating an action means taking Dependabot's PR, not editing a tag.
- Dependabot PRs must pass the required checks like any other; a dependency that changes how
  something renders fails `visual` and needs a baseline refresh in the same PR.
- A vulnerability whose only fix is a major shows up as an alert, not a PR.
