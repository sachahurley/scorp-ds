import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@scorp-ds/components';

const meta: Meta = {
  title: 'Components/Display/Table',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Semantic table primitives for dense, monospace data. Wrap in `overflow-x-auto` for small viewports.\n\n**Light / dark:** use the Storybook **Theme** toolbar (sun / moon) at the top — the table uses semantic surfaces and updates with the rest of the system.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
  { job: 'build', branch: 'main', sha: 'a1b2c3d', status: 'passed' as const, duration: '42s' },
  { job: 'lint', branch: 'feat/tabs', sha: 'e4f5g6h', status: 'failed' as const, duration: '12s' },
  { job: 'e2e', branch: 'main', sha: 'a1b2c3d', status: 'queued' as const, duration: null as string | null },
];

function statusVariant(s: (typeof rows)[number]['status']) {
  if (s === 'passed') return 'success' as const;
  if (s === 'failed') return 'error' as const;
  return 'warning' as const;
}

export const Default: Story = {
  render: () => (
    <div className="max-w-3xl overflow-x-auto">
      <Table bordered>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>SHA</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={`${r.job}-${r.sha}`}>
              <TableCell className="font-medium text-[var(--text-primary)]">{r.job}</TableCell>
              <TableCell>{r.branch}</TableCell>
              <TableCell className="text-secondary-700 dark:text-secondary-300">{r.sha}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(r.status)} size="small">
                  {r.status}
                </Badge>
              </TableCell>
              <TableCell>{r.duration ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const Striped: Story = {
  render: () => (
    <div className="max-w-3xl overflow-x-auto">
      <Table bordered striped>
        <TableHeader>
          <TableRow>
            <TableHead>Host</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Load</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {['edge-01', 'edge-02', 'edge-03', 'edge-04'].map((host, i) => (
            <TableRow key={host}>
              <TableCell className="font-medium text-[var(--text-primary)]">{host}</TableCell>
              <TableCell>{i % 2 === 0 ? 'us-east' : 'eu-west'}</TableCell>
              <TableCell>{(12 + i * 7) % 100}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
