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
  deprecated?: string | true;
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
    expect(prop('Badge', 'BadgeProps', 'size')?.values).toEqual(['"sm"', '"md"', '"lg"']);
    // Reached through Extract<ControlSize, …>, not a direct reference.
    expect(prop('Kbd', 'KbdProps', 'size')?.values).toEqual(['"sm"', '"md"']);
  });

  it('marks a @deprecated prop, and lists no deprecated values once an alias is removed', () => {
    expect(prop('Modal', 'ModalProps', 'width')?.deprecated).toBeTruthy();
    expect(prop('Modal', 'ModalProps', 'size')?.deprecated).toBeUndefined();
    // The 0024 aliases are gone (0031): the size scale carries no deprecated values.
    expect(prop('Button', 'ButtonProps', 'size')?.deprecatedValues).toBeUndefined();
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
