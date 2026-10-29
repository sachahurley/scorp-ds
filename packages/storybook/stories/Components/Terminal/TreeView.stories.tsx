import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState, TreeView, type TreeNode } from '@scorp-ds/components';

const meta: Meta<typeof TreeView> = {
  title: 'Components/Terminal/TreeView',
  component: TreeView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'WAI-ARIA tree: `role="tree"` / `treeitem` / `group`, `aria-expanded`, `aria-level`, `aria-setsize`, `aria-posinset`, `aria-selected`. One tab stop with roving focus. Keys: Up/Down move, Right expands or enters a branch, Left collapses or goes to the parent, Home/End, Enter selects and activates, Space selects, printable keys type-ahead. Disclosure icons are the 1-bit ChevronRight / ChevronDown. `expanded` and `selected` are each controlled or uncontrolled. `loading` shows Skeleton rows under `aria-busy`; `emptyState` renders in place of the tree when `nodes` is empty.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TreeView>;

const files: TreeNode[] = [
  {
    id: 'packages',
    label: 'packages',
    icon: 'Archive',
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'Archive',
        children: [
          { id: 'button', label: 'Button.tsx', icon: 'FileText' },
          { id: 'treeview', label: 'TreeView.tsx', icon: 'FileText' },
          { id: 'index', label: 'index.ts', icon: 'FileText' },
        ],
      },
      {
        id: 'tokens',
        label: 'tokens',
        icon: 'Archive',
        children: [{ id: 'tokens-json', label: 'tokens.json', icon: 'FileText' }],
      },
      { id: 'empty', label: 'site', icon: 'Archive', children: [] },
    ],
  },
  { id: 'package', label: 'package.json', icon: 'FileText' },
  { id: 'readme', label: 'README.md', icon: 'FileText' },
  { id: 'lock', label: 'package-lock.json', icon: 'Lock', disabled: true },
];

/** A file tree with one branch open and a selection. */
export const Default: Story = {
  args: {
    nodes: files,
    'aria-label': 'Files',
    defaultExpanded: ['packages', 'components'],
    defaultSelected: 'treeview',
    className: 'w-72',
  },
};

/** All collapsed, nothing selected: Tab in, then use the arrow keys. */
export const Collapsed: Story = {
  args: { nodes: files, 'aria-label': 'Files', className: 'w-72' },
};

/** Plain labels without icons. */
export const NoIcons: Story = {
  name: 'Without icons',
  args: {
    'aria-label': 'Outline',
    className: 'w-72',
    defaultExpanded: ['intro'],
    nodes: [
      {
        id: 'intro',
        label: 'Introduction',
        children: [
          { id: 'why', label: 'Why a TUI system' },
          { id: 'how', label: 'How to read this' },
        ],
      },
      { id: 'tokens-ch', label: 'Tokens', children: [{ id: 'color', label: 'Color' }] },
      { id: 'appendix', label: 'Appendix' },
    ],
  },
};

/** Controlled selection and expansion, echoed below the tree. */
export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [expanded, setExpanded] = useState<string[]>(['packages']);
      const [selected, setSelected] = useState<string | null>('readme');
      const [opened, setOpened] = useState<string | null>(null);
      return (
        <div className="flex flex-col gap-3">
          <TreeView
            aria-label="Files"
            className="w-72"
            nodes={files}
            expanded={expanded}
            onExpandedChange={setExpanded}
            selected={selected}
            onSelectedChange={setSelected}
            onActivate={setOpened}
          />
          <p className="font-mono text-xs text-[var(--text-primary)]">
            selected: {selected ?? 'none'} / opened: {opened ?? 'none'} / expanded: {expanded.join(', ') || 'none'}
          </p>
        </div>
      );
    };
    return <Demo />;
  },
};

/**
 * `loading`: three Skeleton rows replace the nodes, and the tree carries `aria-busy`
 * until the real nodes render.
 */
export const Loading: Story = {
  args: { nodes: [], 'aria-label': 'Files', loading: true, className: 'w-72' },
};

/**
 * `emptyState`: no nodes, so the empty content renders in place of the tree, in a
 * group that keeps the tree's name. Compose `EmptyState size="sm"` with `titleAs="p"`.
 */
export const Empty: Story = {
  args: {
    nodes: [],
    'aria-label': 'Files',
    className: 'w-72',
    emptyState: (
      <EmptyState
        size="sm"
        icon="Archive"
        titleAs="p"
        title="No files yet"
        description="Files you add to this project appear here."
        primaryAction={{ label: 'Add a file' }}
      />
    ),
  },
};
