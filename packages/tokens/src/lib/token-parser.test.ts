/**
 * TOKEN DRIFT TEST
 *
 * `tokens.json` and `styles/tokens.css` are both hand-maintained: the JSON is
 * the source of truth for tooling, the CSS is what ships to the browser and
 * carries comments nothing can regenerate (measured contrast ratios, the
 * deliberate dark `field.border` exception at 1.76:1). Nothing writes one from
 * the other, so this test is the only thing stopping them from drifting.
 *
 * It parses the stylesheet, parses the token parser's output for both themes,
 * and asserts the two agree in BOTH directions, on names and on values. When a
 * token is added to one file and not the other, the failure names it.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { flattenTokens, getTokensForTheme, tokens } from './token-parser';

/**
 * Walks up from the working directory to find the stylesheet, so the test
 * passes whether vitest is run from the repo root or from packages/tokens.
 */
function findTokensCss(): string {
  const relatives = ['packages/tokens/src/styles/tokens.css', 'src/styles/tokens.css'];
  let dir = process.cwd();
  for (;;) {
    for (const relative of relatives) {
      const candidate = resolve(dir, relative);
      if (existsSync(candidate)) return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) throw new Error('Could not locate packages/tokens/src/styles/tokens.css');
    dir = parent;
  }
}

const css = readFileSync(findTokensCss(), 'utf8');

/** Returns the body of the first `<selector> { … }` rule, brace-matched. */
function ruleBody(selector: string): string {
  const at = css.indexOf(`${selector} {`);
  if (at === -1) throw new Error(`tokens.css has no "${selector}" rule`);
  const start = css.indexOf('{', at) + 1;
  let depth = 1;
  let i = start;
  while (depth > 0) {
    if (i >= css.length) throw new Error(`Unbalanced braces after "${selector}"`);
    const ch = css[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') depth -= 1;
    i += 1;
  }
  return css.slice(start, i - 1);
}

/** Every `--name: value;` declaration in a rule body, comments stripped. */
function customProperties(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const withoutComments = body.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of withoutComments.matchAll(/--([A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[match[1]] = match[2].trim();
  }
  return out;
}

/**
 * Follows `var(--other-token)` indirections so a declaration written as an
 * alias (`--switch-track-height-md: var(--control-height-sm)`) compares equal
 * to the parser's resolved value, the same way the browser resolves it.
 */
function resolveVarReferences(map: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, raw] of Object.entries(map)) {
    let value = raw;
    for (let pass = 0; pass < 10 && value.includes('var(--'); pass += 1) {
      value = value.replace(/var\(--([A-Za-z0-9-]+)\)/g, (whole, ref: string) =>
        ref in map ? map[ref] : whole
      );
    }
    out[name] = value.trim();
  }
  return out;
}

const rootDeclarations = customProperties(ruleBody(':root'));
const darkDeclarations = { ...rootDeclarations, ...customProperties(ruleBody('.dark')) };

/** What the browser ends up with per theme, mirroring how `.dark` overrides `:root`. */
const cssTokens = {
  light: resolveVarReferences(rootDeclarations),
  dark: resolveVarReferences(darkDeclarations),
} as const;

const THEMES = ['light', 'dark'] as const;

describe('token parser / tokens.css drift', () => {
  it.each(THEMES)('%s: every parser token has a matching CSS custom property', (theme) => {
    const parsed = getTokensForTheme(theme);
    const missing = Object.keys(parsed)
      .filter((name) => !(name in cssTokens[theme]))
      .sort();

    expect(
      missing,
      `tokens.json defines these with no --custom-property in tokens.css (${theme}): ${missing.join(', ')}`
    ).toEqual([]);
  });

  it.each(THEMES)('%s: every CSS custom property has a matching parser token', (theme) => {
    const parsed = getTokensForTheme(theme);
    const missing = Object.keys(cssTokens[theme])
      .filter((name) => !(name in parsed))
      .sort();

    expect(
      missing,
      `tokens.css defines these with nothing in tokens.json (${theme}): ${missing.join(', ')}`
    ).toEqual([]);
  });

  it.each(THEMES)('%s: shared tokens resolve to the same value', (theme) => {
    const parsed = getTokensForTheme(theme);
    const differences = Object.keys(parsed)
      .filter((name) => name in cssTokens[theme] && parsed[name] !== cssTokens[theme][name])
      .sort()
      .map((name) => `${name}: tokens.json "${parsed[name]}" vs tokens.css "${cssTokens[theme][name]}"`);

    expect(differences, `Values disagree (${theme}):\n  ${differences.join('\n  ')}`).toEqual([]);
  });
});

describe('token parser naming contract', () => {
  it('kebab-cases camelCase JSON segments', () => {
    const global = flattenTokens(tokens.global);

    expect(global['z-index-modal']).toBe('1040');
    expect(global['line-height-tight']).toBe('1.25');
    expect(global['easing-ease-in-out']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(Object.keys(global).filter((key) => /[A-Z]/.test(key))).toEqual([]);
  });

  it('resolves references through to a literal value', () => {
    const light = getTokensForTheme('light');

    expect(light['color-primary-400']).toBe('#FBBF24');
    expect(light['button-size-md-height']).toBe('40px');
  });

  it('exposes the breakpoint scale, including the docked component breakpoint', () => {
    const global = flattenTokens(tokens.global);

    expect(global['breakpoint-sm']).toBe('640px');
    expect(global['breakpoint-md']).toBe('768px');
    expect(global['breakpoint-lg']).toBe('1024px');
    expect(global['breakpoint-xl']).toBe('1280px');
    expect(global['breakpoint-docked']).toBe('960px');
  });
});

/**
 * The Tailwind preset declares its breakpoints as literals, because consumer
 * sites vendor it as a single standalone file with no sibling tokens.json
 * (the showcase imports `vendor/scorp-ds/tailwind.preset.cjs` directly). This
 * test is what stops those literals from drifting from the token source.
 */
describe('tailwind preset breakpoints', () => {
  const presetPath = resolve(dirname(findTokensCss()), '../../tailwind.preset.js');
  const presetSource = readFileSync(presetPath, 'utf8');
  const presetScreens = Object.fromEntries(
    [...presetSource.slice(presetSource.indexOf('const screens = {')).matchAll(/(\w+):\s*'([^']+)'/g)]
      .slice(0, 5)
      .map(([, name, value]) => [name, value])
  );

  it('does not load tokens.json at require time (vendored copies have no sibling src/)', () => {
    expect(presetSource).not.toMatch(/require\(['"]\.\/src\/tokens\.json['"]\)/);
  });

  it('matches global.breakpoint in tokens.json', () => {
    const fromTokens = Object.fromEntries(
      Object.entries(tokens.global.breakpoint as Record<string, { $value: string }>).map(
        ([name, token]) => [name, token.$value]
      )
    );
    expect(presetScreens).toEqual(fromTokens);
  });

  it('matches the --breakpoint-* custom properties in tokens.css', () => {
    const fromCss = Object.fromEntries(
      Object.entries(rootDeclarations)
        .filter(([name]) => name.startsWith('breakpoint-'))
        .map(([name, value]) => [name.replace('breakpoint-', ''), value])
    );
    expect(presetScreens).toEqual(fromCss);
  });
});
