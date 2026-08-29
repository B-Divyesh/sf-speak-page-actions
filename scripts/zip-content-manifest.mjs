import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

export function zipContentManifest(archivePath) {
  const entries = execFileSync('unzip', ['-Z1', archivePath], { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .sort();
  if (new Set(entries).size !== entries.length) throw new Error(`${archivePath} contains duplicate ZIP member names.`);
  return entries.map((name) => {
    const content = name.endsWith('/')
      ? Buffer.alloc(0)
      : execFileSync('unzip', ['-p', archivePath, name], { encoding: null, maxBuffer: 50 * 1024 * 1024 });
    return { name, bytes: content.byteLength, sha256: createHash('sha256').update(content).digest('hex') };
  });
}
