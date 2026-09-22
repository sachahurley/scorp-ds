import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Card, EmptyState } from '@scorp-ds/components';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    titleAs: { control: 'select', options: ['h2', 'h3', 'h4', 'p'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: 'Archive',
    title: 'No projects yet',
    description: 'Projects you create or join show up here.',
    primaryAction: { label: 'Create project', icon: 'Plus', onClick: fn() },
    secondaryAction: { label: 'Import', onClick: fn() },
  },
};

export const NoResults: Story = {
  name: 'No results',
  args: {
    icon: 'Search',
    title: 'No results',
    description: 'Try a shorter search or clear the filters.',
    secondaryAction: { label: 'Clear filters', onClick: fn() },
  },
};

export const TitleOnly: Story = {
  name: 'Title only',
  args: { icon: 'CheckCircle', title: 'All caught up' },
};

/** `size="sm"` for inline use inside a card, table body, or panel. */
export const InlineSmall: Story = {
  name: 'Inline (sm)',
  render: () => (
    <Card title="Notifications" className="w-96">
      <EmptyState
        size="sm"
        titleAs="h3"
        icon="Bell"
        title="No notifications"
        description="Mentions and replies land here."
        secondaryAction={{ label: 'Notification settings', onClick: fn() }}
      />
    </Card>
  ),
};
