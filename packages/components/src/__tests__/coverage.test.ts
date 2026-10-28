/**
 * COVERAGE RATCHET
 *
 * Every component and primitive in `docs/contracts/api-surface.json` must be
 * shown by a Storybook story and exercised by a unit test. The manifest is the
 * list of what counts, so this test needs no registry of its own, and CI
 * already fails when the manifest is stale.
 *
 * "Shown" means a story imports one of the entry's runtime exports (a function
 * or const, not a type) from `@scorp-ds/components`. "Exercised" is stricter: a
 * test must import the export **and** use it, rendering it as JSX (`<Name`) or
 * calling it (`Name(`). An import alone proved nothing; a test could import a
 * component for a type and never render it. Matching on use rather than file
 * names is what lets `Toast.test.tsx` cover `Toaster` and
 * `FieldFocusStates.test.tsx` cover `Textarea`.
 *
 * Gaps that predate the rule are listed in `coverage-baseline.json`, each with
 * a reason. The ratchet runs both ways: a new gap fails, and so does a listed
 * gap that has since been closed, so the list can only shrink. Specs are not
 * checked here; `scripts/detect-spec-drift.sh` owns them in CI.
 *
 * Reasoning: docs/decisions/0017-coverage-is-a-ratchet.md.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface ManifestExport {
  name: string;
  kind: 'function' | 'const' | 'interface' | 'type';
}

interface ManifestEntry {
  layer: 'component' | 'primitive';
  file: string;
  exports: ManifestExport[];
}

interface Baseline {
  untested: Record<string, string>;
  unstoried: Record<string, string>;
}

/** Walks up from the working directory, so the test runs from the root or a package. */
function findRepoRoot(): string {
  let dir = process.cwd();
  for (;;) {
    if (existsSync(resolve(dir, 'docs/contracts/api-surface.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) throw new Error('Could not locate docs/contracts/api-surface.json');
    dir = parent;
  }
}

function listFiles(dir: string, suffix: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listFiles(path, suffix);
    return path.endsWith(suffix) ? [path] : [];
  });
}

const NAMED_IMPORT = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g;

/** Value names a file imports, optionally only from one module. Type-only names are dropped. */
function importedNames(source: string, fromModule?: string): Set<string> {
  const names = new Set<string>();
  for (const match of source.matchAll(NAMED_IMPORT)) {
    const [statement, body, module] = match;
    if (fromModule && module !== fromModule) continue;
    if (/^import\s+type\s/.test(statement)) continue;
    for (const part of body.split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (name && !name.startsWith('type ')) names.add(name);
    }
  }
  return names;
}

function importedByAny(files: string[], fromModule?: string): Set<string> {
  const names = new Set<string>();
  for (const file of files) {
    for (const name of importedNames(readFileSync(file, 'utf8'), fromModule)) names.add(name);
  }
  return names;
}

const root = findRepoRoot();
const manifest: Record<string, ManifestEntry> = JSON.parse(
  readFileSync(resolve(root, 'docs/contracts/api-surface.json'), 'utf8'),
).components;
const baseline: Baseline = JSON.parse(
  readFileSync(resolve(root, 'packages/components/src/__tests__/coverage-baseline.json'), 'utf8'),
);

const storyImports = importedByAny(
  listFiles(resolve(root, 'packages/storybook/stories'), '.stories.tsx'),
  '@scorp-ds/components',
);
/** Names a test both imports and uses: rendered as `<Name` or called as `Name(`. */
function exercisedByAny(files: string[]): Set<string> {
  const names = new Set<string>();
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const name of importedNames(source)) {
      const escaped = name.replace(/[$]/g, '\\$');
      if (new RegExp(`<${escaped}[\\s/>.]|\\b${escaped}\\(`).test(source)) names.add(name);
    }
  }
  return names;
}

const testImports = exercisedByAny(
  readdirSync(resolve(root, 'packages/components/src/__tests__'))
    .filter((name) => /\.test\.tsx?$/.test(name))
    .map((name) => resolve(root, 'packages/components/src/__tests__', name)),
);

function runtimeExports(entry: ManifestEntry): string[] {
  return entry.exports.filter((e) => e.kind === 'function' || e.kind === 'const').map((e) => e.name);
}

function uncovered(imported: Set<string>): string[] {
  return Object.entries(manifest)
    .filter(([, entry]) => !runtimeExports(entry).some((name) => imported.has(name)))
    .map(([name]) => name)
    .sort();
}

function ratchet(kind: keyof Baseline, gaps: string[], fix: string) {
  const listed = Object.keys(baseline[kind]).sort();

  it('has no new gaps', () => {
    const fresh = gaps.filter((name) => !listed.includes(name));
    expect(fresh, `${fix}: ${fresh.join(', ')}`).toEqual([]);
  });

  it('lists no gap that has been closed', () => {
    const closed = listed.filter((name) => !gaps.includes(name));
    expect(closed, `Covered now, remove from coverage-baseline.json "${kind}": ${closed.join(', ')}`).toEqual([]);
  });

  it('gives every listed gap a reason', () => {
    const unexplained = listed.filter((name) => !baseline[kind][name].trim());
    expect(unexplained).toEqual([]);
  });
}

describe('coverage ratchet', () => {
  it('reads a manifest with entries in it', () => {
    expect(Object.keys(manifest).length).toBeGreaterThan(0);
  });

  describe('every component has a unit test', () => {
    ratchet(
      'untested',
      uncovered(testImports),
      'No test in packages/components/src/__tests__ imports these; add one',
    );
  });

  describe('every component has a story', () => {
    ratchet(
      'unstoried',
      uncovered(storyImports),
      'No story imports these from @scorp-ds/components; add one',
    );
  });
});
