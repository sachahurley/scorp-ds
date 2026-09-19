import type { Meta, StoryObj } from '@storybook/react';
import { ListRow } from '@scorp-ds/components';

/**
 * Components / Display / ListRow
 *
 * The list/navigation tier of the container system: a plate row whose clip is
 * invisible until hover fills it. Don't use for framed panels (Card) or
 * tabular data (Table).
 *
 * Accessibility: renders a real `<a>` or `<button>` when interactive; focus
 * is an inset ring (the plate clip swallows outside outlines).
 */
const meta: Meta<typeof ListRow> = {
  title: 'Components/Display/ListRow',
  component: ListRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof ListRow>;

export const Default: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <ListRow
        href="#"
        meta="2026 · case study"
        title="Scorpion UI"
        titleSuffix={<span aria-hidden="true">↗</span>}
        description="A design system with a sting"
      />
      <ListRow
        onClick={() => {}}
        meta="2026 · lab"
        title="Tile atlas"
        description="Browse the Urizen 1-bit sprite sheet"
      />
      <ListRow meta="2026 · note" title="Display-only row" description="No link, no accent title" />
    </div>
  ),
};
