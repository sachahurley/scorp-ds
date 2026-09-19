import type { Meta, StoryObj } from '@storybook/react';
import { MarketingHeroScreen } from '../../presets/marketingHero';

const meta: Meta = {
  title: 'Screens/MarketingHero',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Screen-level composition lives in `presets/` and is documented here. Flows (multi-step journeys) stay in specs or product apps; Storybook shows one screen at a time.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Marketing hero (preset)',
  render: () => (
    <div className="min-h-screen bg-[var(--surface-page)] py-10">
      <MarketingHeroScreen />
    </div>
  ),
};
