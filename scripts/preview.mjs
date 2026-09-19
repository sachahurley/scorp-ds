#!/usr/bin/env node
/**
 * Localhost preview: build Storybook (when needed) and serve the static output
 * on 127.0.0.1 (first free port in 6006–6015). Stays up until Ctrl+C.
 *
 * Unlike `npm run storybook` (the live dev server with HMR), this previews the
 * exact production build — what CI tests and what a deploy would ship.
 *
 * Usage:
 *   npm run preview           # reuses storybook-static when it exists
 *   npm run preview:fresh     # always rebuilds first
 */

import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staticDir = path.join(root, 'packages', 'storybook', 'storybook-static');
const HOST = '127.0.0.1';
const PORT_MIN = 6006;
const PORT_MAX = 6015;

const fresh = process.argv.includes('--fresh');

if (fresh || !existsSync(path.join(staticDir, 'index.html'))) {
  console.log('[preview] Building Storybook…');
  const build = spawnSync('npm', ['run', 'build-storybook', '--workspace=@scorp-ds/storybook'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
} else {
  console.log('[preview] Reusing existing storybook-static (use `npm run preview:fresh` to rebuild).');
}

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

const port = await findFreePort();
const url = `http://${HOST}:${port}/`;

const server = spawn('npx', ['--yes', 'http-server', staticDir, '-p', String(port), '-a', HOST, '-c-1'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

server.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
server.on('exit', (code) => process.exit(code ?? 0));

process.on('SIGINT', () => server.kill('SIGTERM'));
process.on('SIGTERM', () => server.kill('SIGTERM'));

console.log(`\n[preview] Storybook preview → ${url}  (Ctrl+C to stop)\n`);
