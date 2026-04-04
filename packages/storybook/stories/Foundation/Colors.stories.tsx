import type { Meta, StoryObj } from '@storybook/react';

/**
 * Foundation / Colors
 *
 * Scorp DS base color scales. All values are defined in tokens.json and
 * exposed as CSS custom properties. These are foundation tokens — use
 * semantic aliases (primary, secondary, success, etc.) in components,
 * not these raw scale names.
 */

const ColorSwatch = ({ name, value, cssVar }: { name: string; value: string; cssVar: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
    <div
      style={{
        width: '48px',
        height: '48px',
        background: `var(${cssVar}, ${value})`,
        border: '1px solid rgba(0,0,0,0.1)',
        flexShrink: 0,
      }}
    />
    <div style={{ fontFamily: 'Fragment Mono, monospace', fontSize: '13px' }}>
      <div style={{ fontWeight: 700 }}>{name}</div>
      <div style={{ opacity: 0.6 }}>{cssVar}</div>
      <div style={{ opacity: 0.5 }}>{value}</div>
    </div>
  </div>
);

const ColorScale = ({ scaleName, steps }: { scaleName: string; steps: { step: string; value: string }[] }) => (
  <div style={{ marginBottom: '40px' }}>
    <h3 style={{ fontFamily: 'Fragment Mono, monospace', marginBottom: '16px', textTransform: 'capitalize' }}>
      {scaleName}
    </h3>
    <div>
      {steps.map(({ step, value }) => (
        <ColorSwatch
          key={step}
          name={`${scaleName}.${step}`}
          value={value}
          cssVar={`--color-${scaleName}-${step}`}
        />
      ))}
    </div>
  </div>
);

const ColorsPage = () => (
  <div style={{ maxWidth: '600px', padding: '32px' }}>
    <h1 style={{ fontFamily: 'Fragment Mono, monospace', marginBottom: '8px' }}>Foundation / Colors</h1>
    <p style={{ fontFamily: 'Fragment Mono, monospace', fontSize: '14px', opacity: 0.7, marginBottom: '40px' }}>
      Base color scales. Use semantic aliases in components — never reference these directly.
    </p>

    <ColorScale scaleName="amber" steps={[
      { step: '50', value: '#FFFBEB' }, { step: '100', value: '#FEF3C7' },
      { step: '200', value: '#FDE68A' }, { step: '300', value: '#FCD34D' },
      { step: '400', value: '#FBBF24' }, { step: '500', value: '#F59E0B' },
      { step: '600', value: '#D97706' }, { step: '700', value: '#B45309' },
      { step: '800', value: '#92400E' }, { step: '900', value: '#78350F' },
      { step: '950', value: '#451A03' }, { step: '975', value: '#2D1102' },
      { step: '1000', value: '#1A0A01' },
    ]} />

    <ColorScale scaleName="sepia" steps={[
      { step: '50', value: '#FDFCFB' }, { step: '100', value: '#FCFBFA' },
      { step: '200', value: '#F7F5F2' }, { step: '300', value: '#F0EBE4' },
      { step: '400', value: '#E0DACE' }, { step: '500', value: '#BFB4A3' },
      { step: '600', value: '#968A75' }, { step: '700', value: '#695F4D' },
      { step: '800', value: '#474030' }, { step: '900', value: '#2B2718' },
      { step: '925', value: '#221E13' }, { step: '950', value: '#1A150F' },
      { step: '975', value: '#120D09' }, { step: '1000', value: '#0A0704' },
    ]} />
  </div>
);

const meta: Meta = {
  title: 'Foundation/Colors',
  component: ColorsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BaseScales: Story = {
  name: 'Base Color Scales',
};
