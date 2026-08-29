import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const run = (command, commandArgs) => {
  const result = spawnSync(command, commandArgs, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run('npx', ['vitest', 'run', 'tests/actions.test.ts']);
run('node', ['scripts/check-copy-audit.mjs']);
run('node', ['scripts/check-claims.mjs']);
run('npx', ['playwright', 'test', ...args]);
