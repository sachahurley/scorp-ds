import type { Meta, StoryObj } from '@storybook/react';
import { Input, Stack, Tabs, TabsContent, TabsList, TabsTrigger } from '@scorp-ds/components';

const meta: Meta = {
  title: 'Components/Navigation/Tabs',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Keyboard-accessible tablist (arrow keys, Home/End). Pair with `TabsContent`; use `forceMount` when panels contain form state you need to preserve while hidden.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md plate-round-lg p-px bg-[var(--surface-container-stroke)]">
      <div className="plate-round-lg bg-[var(--surface-card)]">
      <Tabs defaultValue="general">
        <TabsList aria-label="Account sections">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <p className="text-sm text-secondary-800 dark:text-secondary-200">Profile and workspace defaults.</p>
        </TabsContent>
        <TabsContent value="security">
          <p className="text-sm text-secondary-800 dark:text-secondary-200">Sessions, 2FA, and API tokens.</p>
        </TabsContent>
        <TabsContent value="billing">
          <p className="text-sm text-secondary-800 dark:text-secondary-200">Plans and invoices.</p>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  ),
};

export const WithFormFields: Story = {
  name: 'With inputs (forceMount)',
  render: () => (
    <div className="w-full max-w-md plate-round-lg p-px bg-[var(--surface-container-stroke)]">
      <div className="plate-round-lg bg-[var(--surface-card)]">
      <Tabs defaultValue="a">
        <TabsList aria-label="Editable sections">
          <TabsTrigger value="a">Panel A</TabsTrigger>
          <TabsTrigger value="b">Panel B</TabsTrigger>
        </TabsList>
        <TabsContent value="a" forceMount>
          <Stack gap="3">
            <Input label="Field A1" defaultValue="kept in DOM" size="medium" />
            <Input label="Field A2" size="medium" />
          </Stack>
        </TabsContent>
        <TabsContent value="b" forceMount>
          <Stack gap="3">
            <Input label="Field B1" size="medium" />
          </Stack>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  ),
};
