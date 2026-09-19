#!/usr/bin/env node
/**
 * CI helper: serve `storybook-static` on 127.0.0.1 (first free port in 6006–6015),
 * run axe test-runner with matching `--url`, then stop the server.
 *
 * Prerequisite: `npm run build-storybook --workspace=@scorp-ds/storybook`
 *
 * Usage: `node scripts/test-storybook-ci.mjs`
 */

import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staticDir = path.join(root, 'packages', 'storybook', 'storybook-static');
const storybookPkg = path.join(root, 'packages', 'storybook');
const HOST = '127.0.0.1';
const PORT_MIN = 6006;
const PORT_MAX = 6015;

/** @returns {Promise<number>} */
function findFreePort() {
  return new Promise((resolve, reject) => {
    let port = PORT_MIN;
    const tryListen = () => {
      if (port > PORT_MAX) {
        reject(new Error(`No free port on ${HOST} in range ${PORT_MIN}-${PORT_MAX}`));
        return;
      }
      const server = net.createServer();
      server.once('error', () => {
        port += 1;
        tryListen();
      });
      server.listen(port, HOST, () => {
        server.close(() => resolve(port));
      });
    };
    tryListen();
  });
}

/** @param {string} baseUrl @param {number} deadlineMs */
async function waitForServer(baseUrl, deadlineMs) {
  const start = Date.now();
  while (Date.now() - start < deadlineMs) {
    try {
      const res = await fetch(baseUrl, { redirect: 'follow' });
      if (res.ok) return;
    } catch {
      /* not ready */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Timed out after ${deadlineMs}ms waiting for ${baseUrl}`);
}

const port = await findFreePort();
const baseUrl = `http://${HOST}:${port}/`;

const server = spawn('npx', ['--yes', 'http-server', staticDir, '-p', String(port), '-a', HOST, '-c-1'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

let exiting = false;
function stopServer() {
  if (exiting) return;
  exiting = true;
  server.kill('SIGTERM');
}

server.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

process.on('SIGINT', () => {
  stopServer();
  process.exit(130);
});
process.on('SIGTERM', () => {
  stopServer();
  process.exit(143);
});

try {
  await waitForServer(baseUrl, 90_000);
} catch (e) {
  console.error(e);
  stopServer();
  process.exit(1);
}

const storybookUrl = baseUrl.replace(/\/$/, '');

/**
 * @param {'light' | 'dark'} theme
 * @returns {Promise<number>}
 */
function runTestStorybook(theme) {
  return new Promise((resolve, reject) => {
    console.log(`\n[test-storybook-ci] STORYBOOK_TEST_THEME=${theme}\n`);
    const test = spawn('npx', ['test-storybook', '--url', storybookUrl], {
      cwd: storybookPkg,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, STORYBOOK_TEST_THEME: theme },
    });
    test.on('error', reject);
    test.on('close', (code) => resolve(code ?? 1));
  });
}

try {
  const codeLight = await runTestStorybook('light');
  if (codeLight !== 0) {
    stopServer();
    process.exit(codeLight);
  }
  const codeDark = await runTestStorybook('dark');
  stopServer();
  process.exit(codeDark);
} catch (e) {
  console.error(e);
  stopServer();
  process.exit(1);
}
