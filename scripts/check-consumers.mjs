/**
 * check-consumers.mjs: build every consumer against THIS scorp-ds checkout,
 * before it merges.
 *
 * Three sites vendor a committed copy of scorp-ds (decision 0005): the
 * portfolio, the Scorpion Design System showcase and scorp-protodash. Each has
 * a `ds:check`, but that only says whether its vendored copy matches the DS; a
 * renamed prop or a dropped export first shows up as a broken build after
 * scorp-ds has merged, while /vendor-portfolio is shipping the vendor PRs.
 *
 * This moves that moment earlier. For each consumer it makes a throwaway git
 * worktree of the consumer's origin/main, vendors this checkout into it, and
 * runs the consumer's own checks. Then it deletes the worktree. It never
 * commits, never pushes and never touches the consumers' own checkouts.
 *
 * Aura DS does the same job with check_app_api_compat.py, which lists the API
 * names the app uses. For TypeScript consumers the compiler already knows
 * that, so this runs the compiler instead of reimplementing it.
 *
 * What is vendored:
 *   - portfolio, scorp-protodash: this working tree, uncommitted changes
 *     included (their vendor scripts build packages/components here).
 *   - showcase: this checkout's HEAD commit (its vendor script reads through
 *     git), so commit first. It needs SCORP_DS_REF support in its
 *     vendor-ds.sh (scorpion-design-system#44); without it the showcase is
 *     reported as SKIPPED rather than silently checking origin/main.
 *
 * Consumers are found at the paths CLAUDE.md names. Override one with
 * PORTFOLIO_DIR, SHOWCASE_DIR or PROTODASH_DIR.
 *
 * Usage:
 *   npm run consumers:check                     all three, in turn
 *   npm run consumers:check -- --only portfolio  one (portfolio | showcase | scorp-protodash)
 *
 * Exit codes:
 *   0  every consumer that ran passed (a SKIPPED one is printed, not failed)
 *   1  at least one consumer failed
 *   2  bad arguments, or a consumer checkout is missing
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOME = homedir();
const STEP_TIMEOUT_MS = 10 * 60 * 1000;
const TAIL_LINES = 25;

const CONSUMERS = [
  {
    name: 'portfolio',
    dir: process.env.PORTFOLIO_DIR ?? path.join(HOME, 'Projects/portfolio'),
    steps: [
      ['npm', 'ci', '--no-audit', '--no-fund'],
      ['npm', 'run', 'vendor:ds'],
      ['npm', 'install', '--no-audit', '--no-fund'],
      ['npm', 'run', 'ds:check'],
      ['npm', 'run', 'build'],
    ],
  },
  {
    name: 'showcase',
    dir: process.env.SHOWCASE_DIR ?? path.join(HOME, 'Projects/scorpion-design-system'),
    // Its vendor script must honour SCORP_DS_REF, or it would vendor
    // origin/main and report on the wrong code.
    requires: { file: 'scripts/vendor-ds.sh', text: 'SCORP_DS_REF', why: 'needs scorpion-design-system#44' },
    steps: [
      ['npm', 'ci', '--no-audit', '--no-fund'],
      ['npm', 'run', 'vendor:ds'],
      ['npm', 'run', 'ds:check'],
      ['npm', 'run', 'build'],
    ],
  },
  {
    name: 'scorp-protodash',
    dir: process.env.PROTODASH_DIR ?? path.join(HOME, 'conductor/repos/aura-protodash'),
    steps: [
      ['npm', 'ci', '--no-audit', '--no-fund'],
      ['npm', 'run', 'vendor:ds'],
      ['npm', 'install', '--no-audit', '--no-fund'],
      ['npm', 'run', 'ds:check'],
      ['npm', 'run', 'check'],
    ],
  },
];

function parseArgs(argv) {
  const only = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--only' && argv[i + 1]) only.push(argv[++i]);
    else {
      console.error(`Unknown argument: ${argv[i]}`);
      process.exit(2);
    }
  }
  const unknown = only.filter((name) => !CONSUMERS.some((c) => c.name === name));
  if (unknown.length) {
    console.error(`Unknown consumer: ${unknown.join(', ')}. Known: ${CONSUMERS.map((c) => c.name).join(', ')}`);
    process.exit(2);
  }
  return only.length ? CONSUMERS.filter((c) => only.includes(c.name)) : CONSUMERS;
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    encoding: 'utf8',
    timeout: STEP_TIMEOUT_MS,
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  const ok = result.status === 0;
  return { ok, output: result.error ? `${output}\n${result.error.message}` : output };
}

function tail(text) {
  return text.trimEnd().split('\n').slice(-TAIL_LINES).map((line) => `      ${line}`).join('\n');
}

const head = run('git', ['-C', ROOT, 'rev-parse', 'HEAD']).output.trim();
const shortHead = head.slice(0, 7);
const dirty = run('git', ['-C', ROOT, 'status', '--porcelain']).output.trim() !== '';

const env = { ...process.env, SCORP_DS_DIR: ROOT, SCORP_DS_REF: head };
const worktrees = [];

function cleanup() {
  for (const { repo, dir } of worktrees.splice(0)) {
    run('git', ['-C', repo, 'worktree', 'remove', '--force', dir]);
    rmSync(dir, { recursive: true, force: true });
  }
}
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});

function checkConsumer(consumer) {
  if (!existsSync(path.join(consumer.dir, '.git'))) {
    return { status: 'MISSING', detail: `no git checkout at ${consumer.dir}` };
  }

  const fetched = run('git', ['-C', consumer.dir, 'fetch', 'origin', 'main', '-q']);
  if (!fetched.ok) return { status: 'FAIL', step: 'git fetch origin main', output: fetched.output };

  const dir = mkdtempSync(path.join(tmpdir(), `scorp-consumer-${consumer.name}-`));
  rmSync(dir, { recursive: true, force: true });
  const added = run('git', ['-C', consumer.dir, 'worktree', 'add', '--detach', dir, 'origin/main']);
  if (!added.ok) return { status: 'FAIL', step: 'git worktree add', output: added.output };
  worktrees.push({ repo: consumer.dir, dir });

  try {
    if (consumer.requires) {
      const file = path.join(dir, consumer.requires.file);
      if (!existsSync(file) || !readFileSync(file, 'utf8').includes(consumer.requires.text)) {
        return {
          status: 'SKIPPED',
          detail: `${consumer.requires.file} on origin/main has no ${consumer.requires.text} (${consumer.requires.why})`,
        };
      }
    }
    for (const [cmd, ...args] of consumer.steps) {
      const step = [cmd, ...args].join(' ');
      process.stdout.write(`    ${step} ... `);
      const result = run(cmd, args, { cwd: dir, env });
      console.log(result.ok ? 'ok' : 'FAILED');
      if (!result.ok) return { status: 'FAIL', step, output: result.output };
    }
    return { status: 'PASS' };
  } finally {
    cleanup();
  }
}

const selected = parseArgs(process.argv.slice(2));

console.log('');
console.log(`── Consumer dry run: scorp-ds @ ${shortHead}${dirty ? ' (plus uncommitted changes)' : ''} ──`);
if (dirty) {
  console.log('  Note: the showcase vendors the HEAD commit only; the others include uncommitted changes.');
}
console.log('');

const results = [];
for (const consumer of selected) {
  console.log(`  ${consumer.name}  (${consumer.dir})`);
  const result = checkConsumer(consumer);
  results.push({ name: consumer.name, ...result });
  if (result.status === 'PASS') console.log('  ✓ PASS');
  else if (result.status === 'SKIPPED') console.log(`  ⚠ SKIPPED  ${result.detail}`);
  else if (result.status === 'MISSING') console.log(`  ✗ MISSING  ${result.detail}`);
  else console.log(`  ✗ FAIL at \`${result.step}\`\n${tail(result.output)}`);
  console.log('');
}

const count = (status) => results.filter((r) => r.status === status).length;
console.log(
  `  ${count('PASS')} passed, ${count('FAIL')} failed, ${count('SKIPPED')} skipped, ${count('MISSING')} missing.`
);
console.log('');

if (count('MISSING')) process.exit(2);
process.exit(count('FAIL') ? 1 : 0);
