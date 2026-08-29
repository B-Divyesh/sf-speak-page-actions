import { readFileSync } from 'node:fs';

const audit = readFileSync('.factory/copy-audit.md', 'utf8');
const siteSource = readFileSync('src/site/main.ts', 'utf8');
const htmlSources = [
  readFileSync('src/entrypoints/popup/index.html', 'utf8'),
  readFileSync('public/404.html', 'utf8'),
];
const banned = /\b(leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|delightful|journey|ecosystem|ai-powered)\b/i;
const normalize = (value) => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/\$\{[^}]+\}/g, '')
  .replaceAll('&amp;', '&')
  .replaceAll('&mdash;', '—')
  .replace(/&[a-z#0-9]+;/gi, '')
  .replace(/\s+/g, ' ')
  .replace(/\s+([.,!?])/g, '$1')
  .trim()
  .replace(/^●\s*/, '');
const splitSentences = (value) => {
  const clean = normalize(value);
  if (!clean) return [];
  return clean.replace(/([.!?][”"']?)\s+/g, '$1\n').split('\n').map((part) => part.trim()).filter(Boolean);
};

const rows = new Map();
for (const line of audit.split('\n')) {
  const match = line.match(/^\| (.+) \| (\d+) \|/);
  if (!match || match[1] === 'Copy') continue;
  const copy = match[1].replaceAll('`', '').trim();
  const expected = Number(match[2]);
  const actual = copy.split(/\s+/).filter(Boolean).length;
  if (actual !== expected) throw new Error(`Copy audit count mismatch: “${copy}” is ${actual}, not ${expected}.`);
  if (expected > 22) throw new Error(`Copy audit sentence is over 22 words: “${copy}”.`);
  if (banned.test(copy)) throw new Error(`Copy audit contains a banned word: “${copy}”.`);
  rows.set(copy, expected);
}

const rendered = new Set();
const markupChunks = [
  ...htmlSources,
  ...[...siteSource.matchAll(/`([^`]*)`/gs)].map((match) => match[1]).filter((value) => value.includes('<')),
  ...[...siteSource.matchAll(/'([^'\n]*<[^'\n]*)'/g)].map((match) => match[1]),
];
for (const source of markupChunks) {
  for (const match of source.matchAll(/<(title|h[1-6]|p|li|a|button|label|summary|small|figcaption)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)) {
    for (const sentence of splitSentences(match[2])) rendered.add(sentence);
  }
  for (const match of source.matchAll(/(?:aria-label|placeholder)="([^"]+)"/g)) {
    for (const sentence of splitSentences(match[1])) rendered.add(sentence);
  }
}
for (const source of [siteSource, readFileSync('src/entrypoints/popup/main.ts', 'utf8')]) {
  for (const match of source.matchAll(/(?:setStatus\(|\.textContent\s*=)\s*'([^']+)'/g)) {
    for (const sentence of splitSentences(match[1])) rendered.add(sentence);
  }
}

const readme = readFileSync('README.md', 'utf8').replace(/```[\s\S]*?```/g, '');
for (const line of readme.split('\n')) {
  const prose = line
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
  for (const sentence of splitSentences(prose)) rendered.add(sentence);
}

const ignored = [/^\$\{/, /^\/$/, /^●$/, /^\d+$/];
const missing = [...rendered].filter((copy) => !ignored.some((pattern) => pattern.test(copy)) && !rows.has(copy));
if (missing.length) throw new Error(`Copy audit is missing rendered or README copy:\n${missing.map((copy) => `- ${copy}`).join('\n')}`);

console.log(`Copy audit verified: ${rows.size} rows cover ${rendered.size} extracted strings.`);
