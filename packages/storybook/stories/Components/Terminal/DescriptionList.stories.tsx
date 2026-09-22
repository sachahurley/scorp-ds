import type { Meta, StoryObj } from '@storybook/react';
import { Badge, DescriptionList, Link } from '@scorp-ds/components';

const meta: Meta<typeof DescriptionList> = {
  title: 'Components/Terminal/DescriptionList',
  component: DescriptionList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Term / value pairs on a real `<dl>` (each pair is a `<div>` with one `<dt>` and one `<dd>`). `layout="inline"` (default) puts term and value on one row with the value right-aligned; `leader` adds a dotted rule between them, drawn as a pseudo-element so the list markup stays clean. `layout="stacked"` puts a small term above each value for long values or narrow panes.',
      },
    },
  },
  argTypes: {
    layout: { control: 'radio', options: ['inline', 'stacked'] },
    leader: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DescriptionList>;

const system = [
  { term: 'OS', description: 'scorp-os 1.2' },
  { term: 'Kernel', description: '6.9.4-scorp' },
  { term: 'Uptime', description: '4 days, 3 hours' },
  { term: 'Shell', description: 'zsh 5.9' },
  { term: 'Memory', description: '7.2 GiB / 16 GiB' },
];

/** Inline rows. */
export const Default: Story = {
  args: { items: system, className: 'w-full max-w-sm' },
};

/** Inline rows with dotted leaders (the TUI table-of-contents look). */
export const Leader: Story = {
  args: { items: system, leader: true, className: 'w-full max-w-sm' },
};

/** Term above value. */
export const Stacked: Story = {
  args: {
    layout: 'stacked',
    className: 'w-full max-w-sm',
    items: [
      { term: 'Repository', description: 'sachahurley/scorp-ds' },
      { term: 'Description', description: 'TUI-inspired React design system with 1-bit icons and plate silhouettes.' },
      { term: 'Status', description: <Badge size="sm" variant="success">healthy</Badge> },
    ],
  },
};

/** Rich values: badges and links. */
export const RichValues: Story = {
  args: {
    leader: true,
    className: 'w-full max-w-sm',
    items: [
      { term: 'Build', description: <Badge size="sm" variant="success">passed</Badge> },
      { term: 'Coverage', description: '91%' },
      { term: 'Docs', description: <Link href="#docs">storybook</Link> },
    ],
  },
};
