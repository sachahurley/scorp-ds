import type { ReactNode } from 'react';
import { Avatar, Badge, Button, Inline, Stack, TuiIcon, type AvatarProps, type BadgeTone } from '@scorp-ds/components';

/**
 * Row chrome for a dense list: a wrapping flex row with `gap-3`, a hairline
 * `--surface-container-stroke` border, the `--surface-card` fill, `px-3 py-2`
 * and square corners. It is a bespoke shell because no component draws a square
 * hairline row at this density yet (see the Known Gaps of `patterns-dense-list-row.md`).
 *
 * @example
 * <DenseRowShell>
 *   <Avatar alt="" initials="BR" size="sm" />
 *   <span className="flex-1">build · main</span>
 * </DenseRowShell>
 */
export function DenseRowShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        flex flex-wrap items-center gap-3 border-hairline border-solid border-[var(--surface-container-stroke)]
        bg-[var(--surface-card)] px-3 py-2 font-mono text-sm text-[var(--text-primary)]
      "
    >
      {children}
    </div>
  );
}

/** Content of one job-run row. */
export interface JobRunRowData {
  /** Stable key for the list. */
  id: string;
  /** Two-letter initials for the leading Avatar. */
  initials: string;
  /** Presence dot on the Avatar; omit for none. */
  presence?: AvatarProps['status'];
  /** Primary line ("build · main"); truncates when the row is narrow. */
  title: string;
  /** Run number shown after the title with a `#` prefix (4821 renders "#4821"). */
  runNumber: number;
  /** Secondary line (commit, runner, age); truncates when the row is narrow. */
  detail: string;
  /** Status text in the Badge; the word carries the meaning, the tone only tints it. */
  status: string;
  /** Badge tone matching the status. */
  statusTone: BadgeTone;
  /** Whether "Logs" is unavailable yet (a queued run has none). */
  logsDisabled?: boolean;
}

/**
 * One dense job-run row: leading Avatar, a text column (title and run number over a
 * truncating detail line), the status Badge, then the trailing actions in a fixed
 * order: the text action ("Logs", `outline`), then the overflow icon menu.
 *
 * @example
 * <JobRunListRow {...jobRunRows[0]} />
 */
export function JobRunListRow({
  initials,
  presence,
  title,
  runNumber,
  detail,
  status,
  statusTone,
  logsDisabled = false,
}: JobRunRowData) {
  return (
    <DenseRowShell>
      <Avatar alt="" initials={initials} size="sm" status={presence} />
      <div className="min-w-0 flex-1">
        <Inline align="baseline" gap="2">
          <span className="truncate font-medium">{title}</span>
          <span className="text-secondary-900 dark:text-secondary-200">#{runNumber}</span>
        </Inline>
        <p className="truncate text-xs text-secondary-900 dark:text-secondary-200">{detail}</p>
      </div>
      <Badge tone={statusTone}>{status}</Badge>
      <Button variant="outline" size="sm" type="button" disabled={logsDisabled}>
        Logs
      </Button>
      <Button variant="icon" size="sm" type="button" aria-label="Open menu">
        <TuiIcon name="MoreVertical" />
      </Button>
    </DenseRowShell>
  );
}

/** The specimen runs: one passed, one queued. */
export const jobRunRows: JobRunRowData[] = [
  {
    id: 'build-main',
    initials: 'BR',
    presence: 'online',
    title: 'build · main',
    runNumber: 4821,
    detail: 'chore: token sweep — 2m ago',
    status: 'passed',
    statusTone: 'success',
  },
  {
    id: 'e2e-nightly',
    initials: 'QA',
    title: 'e2e · nightly',
    runNumber: 119,
    detail: 'queued on runner-east — just now',
    status: 'queued',
    statusTone: 'neutral',
    logsDisabled: true,
  },
];

/**
 * Dense list row preset: job-run rows (CI jobs, inbox items, log streams) stacked
 * with `Stack gap="2"`. Pair it with your own scroll container or virtualised list.
 *
 * Consumed by `Patterns/DenseListRow`. No consumer project renders it yet; if one
 * does, vendor this file with it.
 *
 * @example
 * <JobRunList rows={jobRunRows} />
 */
export function JobRunList({ rows = jobRunRows }: { rows?: JobRunRowData[] }) {
  return (
    <Stack gap="2">
      {rows.map((row) => (
        <JobRunListRow key={row.id} {...row} />
      ))}
    </Stack>
  );
}
