import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination, type PaginationProps } from '@scorp-ds/components';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Page picker for paged collections. Boundary pages, sibling pages around the current one, and an ellipsis where a gap is skipped (the list length stays constant while paging, so the control does not jump). Prev/next use the 1-bit ArrowLeft/ArrowRight icons with accessible labels. The current page is the primary plate with `aria-current="page"`. Plates follow the Button scale (`sm | md | lg`); hit areas stay at least 44px at every size.',
      },
    },
  },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
    pageCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

function Controlled(props: Partial<PaginationProps> & { initial?: number }) {
  const { initial = 1, pageCount = 20, ...rest } = props;
  const [page, setPage] = useState(initial);
  return <Pagination {...rest} pageCount={pageCount} page={page} onPageChange={setPage} />;
}

/** Twenty pages, starting on page 1. Click through to see the ellipses move. */
export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: { pageCount: 20 },
};

/** Current page in the middle: ellipses on both sides. */
export const MiddlePage: Story = {
  render: (args) => <Controlled {...args} initial={10} />,
  args: { pageCount: 20 },
};

/** Few pages: every page shows, no ellipsis. */
export const FewPages: Story = {
  render: (args) => <Controlled {...args} initial={2} />,
  args: { pageCount: 5 },
};

/** Wider window: two siblings and two boundary pages. */
export const WideWindow: Story = {
  name: 'Siblings 2, boundaries 2',
  render: (args) => <Controlled {...args} initial={25} />,
  args: { pageCount: 50, siblingCount: 2, boundaryCount: 2 },
};

/** The three plate sizes from the Button scale. Hit areas stay at least 44px. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <Controlled size="sm" initial={4} pageCount={12} aria-label="Pagination, small" />
      <Controlled size="md" initial={4} pageCount={12} aria-label="Pagination, medium" />
      <Controlled size="lg" initial={4} pageCount={12} aria-label="Pagination, large" />
    </div>
  ),
};

/** First and last page: prev / next disable at the ends. */
export const Ends: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <Pagination page={1} pageCount={8} aria-label="Pagination, first page" />
      <Pagination page={8} pageCount={8} aria-label="Pagination, last page" />
    </div>
  ),
};
