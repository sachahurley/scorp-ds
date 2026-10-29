/**
 * Pins what docs/contracts/api-surface.json must be able to tell an agent:
 * the values a prop accepts (through aliases), which of them are deprecated,
 * props declared behind a type alias, inherited DOM attributes, and every
 * barrel export. Each assertion is a case the manifest used to get wrong.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface Prop {
  name: string;
  values?: string[];
  deprecatedValues?: string[];
}
interface PropSet {
  props?: Prop[];
  inherits?: string[];
  union?: string[];
}
interface Manifest {
  exports: { name: string; kind: string; from: string }[];
  components: Record<string, { exports: { name: string; kind: string }[]; props: Record<string, PropSet> }>;
}

const manifest: Manifest = JSON.parse(
  readFileSync(resolve(__dirname, '../../../../docs/contracts/api-surface.json'), 'utf8'),
);
const prop = (component: string, set: string, name: string) =>
  manifest.components[component].props[set].props?.find((p) => p.name === name);

describe('api-surface.json', () => {
  it('expands aliases into the values a prop accepts', () => {
    expect(prop('Badge', 'BadgeProps', 'size')?.values).toEqual(['"sm"', '"md"', '"lg"', '"small"', '"medium"', '"large"']);
  });

  it('marks values that come from a @deprecated alias', () => {
    expect(prop('Button', 'ButtonProps', 'size')?.deprecatedValues).toEqual(['"small"', '"medium"', '"large"', '"icon"']);
    // Reached through Extract<ControlSizeProp, …>, not a direct reference.
    expect(prop('Kbd', 'KbdProps', 'size')?.deprecatedValues).toEqual(['"small"', '"medium"']);
    // `icon` is a current Button variant: only the size alias deprecates it.
    expect(prop('Button', 'ButtonProps', 'variant')?.deprecatedValues).toBeUndefined();
  });

  it('lists props declared behind a type alias', () => {
    expect(manifest.components.Link.props.LinkProps.props?.length).toBeGreaterThan(0);
    expect(manifest.components.ListRow.props.ListRowProps.props?.length).toBeGreaterThan(0);
  });

  it('records the DOM attributes a component inherits', () => {
    expect(manifest.components.Slider.props.SliderProps.inherits).toContain('InputHTMLAttributes');
  });

  it('lists every barrel export, including the ones outside components/ and primitives/', () => {
    const names = manifest.exports.map((e) => e.name);
    expect(names).toEqual(expect.arrayContaining(['ThemeProvider', 'cn', 'ControlSize', 'CardLayout']));
    expect(manifest.exports.find((e) => e.name === 'ThemeProvider')?.kind).toBe('component');
  });
});
