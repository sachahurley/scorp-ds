# Scorp DS: what it is for

## The one-line version

Scorp DS is a terminal-inspired React design system that gives Sacha's projects one
visual identity and one set of decisions, so each new surface starts from a system
rather than from scratch.

## Who consumes it

Three sites, all of which read a **committed vendored copy** rather than a published
package:

| Consumer | Repo | Host |
|---|---|---|
| Portfolio | `~/Projects/portfolio` | Vercel |
| Scorpion Design System showcase | `scorpion-design-system` | GitHub Pages |
| scorp-protodash | `scorp-protodash` | Vercel |

Merging to `main` here changes nothing downstream until each consumer is re-vendored.
That is why `/vendor-portfolio` runs after every merge, unprompted. See
[0005](decisions/0005-vendored-copies-not-a-published-package.md).

## The design stance

Scorp DS is TUI-inspired, and the stance is deliberate rather than decorative:

- **Sharp corners.** No border radius anywhere. Softened corners are stepped plate
  silhouettes, not curves. See [0001](decisions/0001-plates-replace-border-radius.md).
- **Monospace throughout.** Fragment Mono, one type family, no sans-serif.
- **Warm amber and sepia.** Amber is primary, sepia is neutral.
- **One-bit icons.** 7x7 pixel grids drawn as SVG, identical on every OS. See
  [0003](decisions/0003-one-bit-icon-set.md).
- **Flat.** Depth is carried by borders, not shadows. Every elevation shadow token is
  `none`, with exactly one documented exception.
- **Snappy.** 150 to 200ms for interactive states.
- **High contrast, deliberate borders.** One rule weight in the whole system.

## What the system optimises for

1. **Re-themeability.** Components reference semantic aliases, never raw scales, so the
   palette can be swapped without touching components. See
   [0006](decisions/0006-components-use-semantic-aliases-only.md).
2. **Honesty about state.** Tooling reports what it actually checked. A layer it could
   not scan says so rather than passing silently.
3. **Agent-legibility.** The repo is the source of truth. Specs live beside the code
   ([0008](decisions/0008-specs-live-in-the-repo-only.md)), rules that matter are
   enforced by lint rather than prose
   ([0009](decisions/0009-claude-md-rules-are-enforced-by-lint.md)), and the reasons
   behind decisions live here.

## What it is not

- Not a general-purpose UI kit. It is brand-specific to the Scorp identity.
- Not a published npm package. Consumers vendor it.
- Not a mobile system. It targets the web.

## Where to look next

| Question | File |
|---|---|
| What are the rules? | `CLAUDE.md` |
| Why is it that way? | `docs/decisions/` |
| What does this component do? | `docs/specs/{Component}.md` |
| What tokens exist? | `design-tokens.md`, `packages/tokens/src/tokens.json` |
| What did we learn? | `docs/insights/` |
