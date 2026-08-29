import { readFileSync, readdirSync } from 'node:fs';

const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8'));
if (!Array.isArray(claims) || claims.length === 0) throw new Error('The claim registry must be a non-empty array.');

const sources = readdirSync('tests')
  .filter((file) => file.endsWith('.spec.ts'))
  .map((file) => readFileSync(`tests/${file}`, 'utf8'))
  .join('\n');
const ids = new Set();
for (const claim of claims) {
  if (!claim.id || ids.has(claim.id)) throw new Error(`Missing or duplicate claim id: ${claim.id || '(empty)'}.`);
  ids.add(claim.id);
  const tag = `@claim:${claim.id}`;
  const count = sources.split(tag).length - 1;
  if (count !== 1) throw new Error(`${tag} must appear in exactly one browser test; found ${count}.`);
  const command = `npm test -- --grep ${tag}`;
  if (claim.test !== command) throw new Error(`${tag} must declare its exact test command: ${command}`);
  for (const field of ['claim', 'where', 'sandbox']) if (!claim[field]) throw new Error(`${tag} is missing ${field}.`);
}

const undeclared = [...sources.matchAll(/@claim:([a-z0-9-]+)/g)]
  .map((match) => match[1])
  .filter((id) => !ids.has(id));
if (undeclared.length) throw new Error(`Undeclared claim tests: ${[...new Set(undeclared)].join(', ')}.`);

console.log(`Claim registry verified: ${claims.length} claims, each with one tagged browser test.`);
