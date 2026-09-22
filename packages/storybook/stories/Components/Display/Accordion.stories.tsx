import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@scorp-ds/components';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean' },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const ITEMS = [
  { value: 'shipping', title: 'Shipping', body: 'Orders ship within two business days. Tracking arrives by email.' },
  { value: 'returns', title: 'Returns', body: 'Return anything within thirty days for a full refund, no questions asked.' },
  { value: 'warranty', title: 'Warranty', body: 'Hardware carries a one-year warranty against manufacturing defects.' },
];

const Items = ({ disabledValue }: { disabledValue?: string }) => (
  <>
    {ITEMS.map((item) => (
      <AccordionItem key={item.value} value={item.value} disabled={item.value === disabledValue}>
        <AccordionTrigger>{item.title}</AccordionTrigger>
        <AccordionContent>{item.body}</AccordionContent>
      </AccordionItem>
    ))}
  </>
);

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Accordion {...args}>
        <Items />
      </Accordion>
    </div>
  ),
  args: { type: 'single', collapsible: true },
};

/** Opens on load with the first item expanded. */
export const Open: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible defaultValue="shipping">
        <Items />
      </Accordion>
    </div>
  ),
};

/** `type="multiple"`: items open independently. */
export const Multiple: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="multiple" defaultValue={['shipping', 'returns']}>
        <Items />
      </Accordion>
    </div>
  ),
};

/** Without `collapsible`, one item always stays open; its trigger is aria-disabled. */
export const NotCollapsible: Story = {
  name: 'Single, not collapsible',
  render: () => (
    <div className="w-96">
      <Accordion type="single" defaultValue="returns">
        <Items />
      </Accordion>
    </div>
  ),
};

export const DisabledItem: Story = {
  name: 'Disabled item',
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible>
        <Items disabledValue="warranty" />
      </Accordion>
    </div>
  ),
};

/** The parent owns `value`; `""` means every item is closed. */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('returns');
    return (
      <div className="flex w-96 flex-col gap-3">
        <p className="font-mono text-xs text-[var(--text-secondary)]">Open: {value || 'none'}</p>
        <Accordion type="single" collapsible value={value} onValueChange={setValue}>
          <Items />
        </Accordion>
      </div>
    );
  },
};
