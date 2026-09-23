import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import { Combobox, type ComboboxOption } from '@scorp-ds/components';

const COUNTRIES: ComboboxOption[] = [
  { value: 'ar', label: 'Argentina' },
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'cl', label: 'Chile', disabled: true },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'mx', label: 'Mexico' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'no', label: 'Norway' },
  { value: 'pt', label: 'Portugal' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Components/Inputs/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    helperText: { control: 'text', description: 'Hint under the field (linked via aria-describedby)' },
    errorMessage: { control: 'text', description: 'Validation message; implies error and replaces helperText' },
    emptyText: { control: 'text' },
    disabled: { control: 'boolean' },
    openOnFocus: { control: 'boolean' },
    portal: { control: 'boolean' },
  },
  args: { options: COUNTRIES, onValueChange: fn() },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

/** Leaves room under the field for the open list. */
const Frame = ({ children }: { children: ReactNode }) => <div className="min-h-[420px] w-72 pt-4">{children}</div>;

export const Default: Story = {
  // Opens the list, which is the part of a combobox worth a baseline. Only the
  // stories whose subject IS the list get this: opening Sizes would cover the
  // other two fields and destroy the size comparison the story exists for.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox'));
  },
  render: (args) => (
    <Frame>
      <Combobox {...args} />
    </Frame>
  ),
  args: { label: 'Country', placeholder: 'Search countries', helperText: 'Type to filter the list.', size: 'md' },
};

export const WithValue: Story = {
  name: 'With value',
  // Open, so the baseline covers how the already-selected option is marked in
  // the list rather than just the field showing its value.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox'));
  },
  render: Default.render,
  args: { label: 'Country', defaultValue: 'jp', size: 'md' },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <Combobox {...args} size="sm" label="Small" />
      <Combobox {...args} size="md" label="Medium" />
      <Combobox {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Error: Story = {
  render: Default.render,
  args: { label: 'Country', errorMessage: 'Pick a country to continue.' },
};

export const Disabled: Story = {
  render: Default.render,
  args: { label: 'Country', defaultValue: 'ca', disabled: true },
};

/** A custom matcher: only labels that start with the query. */
export const CustomFilter: Story = {
  name: 'Custom filter',
  // Types a query, because a prefix matcher is invisible until something is
  // filtered. "n" keeps New Zealand and Norway and drops Canada, which a
  // substring matcher would have kept: the baseline shows the difference.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('combobox'), 'n');
  },
  render: Default.render,
  args: {
    label: 'Country (prefix match)',
    filter: (option, query) => option.label.toLowerCase().startsWith(query.trim().toLowerCase()),
    emptyText: 'No country starts with that',
  },
};

/** When a visible label is not possible, name the field with `aria-label`. */
export const AriaLabelOnly: Story = {
  name: 'Aria label only',
  // Open, so the a11y pass inspects an expanded listbox whose field is named
  // only by aria-label. That combination is the whole point of this story.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox'));
  },
  render: Default.render,
  args: { 'aria-label': 'Country', placeholder: 'Country' },
};
