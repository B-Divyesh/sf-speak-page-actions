import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { zipContentManifest } from './zip-content-manifest.mjs';

const root = mkdtempSync(join(tmpdir(), 'speak-page-actions-zip-test-'));
try {
  const first = join(root, 'first');
  const second = join(root, 'second');
  const changed = join(root, 'changed');
  for (const directory of [first, second, changed]) mkdirSync(directory);
  for (const directory of [first, second]) writeFileSync(join(directory, 'popup.js'), 'same extension payload\n');
  writeFileSync(join(changed, 'popup.js'), 'changed extension payload\n');
  utimesSync(join(first, 'popup.js'), new Date('2024-01-01T00:00:00Z'), new Date('2024-01-01T00:00:00Z'));
  utimesSync(join(second, 'popup.js'), new Date('2025-01-01T00:00:00Z'), new Date('2025-01-01T00:00:00Z'));
  const firstZip = join(root, 'first.zip');
  const secondZip = join(root, 'second.zip');
  const changedZip = join(root, 'changed.zip');
  execFileSync('zip', ['-q', firstZip, 'popup.js'], { cwd: first });
  execFileSync('zip', ['-q', secondZip, 'popup.js'], { cwd: second });
  execFileSync('zip', ['-q', changedZip, 'popup.js'], { cwd: changed });
  const archiveHash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
  assert.notEqual(archiveHash(firstZip), archiveHash(secondZip), 'The fixture archives must differ in timestamp metadata.');
  assert.deepEqual(zipContentManifest(firstZip), zipContentManifest(secondZip), 'Timestamp-only ZIP differences must compare as equal.');
  assert.notDeepEqual(zipContentManifest(firstZip), zipContentManifest(changedZip), 'Changed ZIP member bytes must be detected.');
  console.log('ZIP content comparison verified: timestamps ignored; member changes detected.');
} finally {
  rmSync(root, { recursive: true, force: true });
}
