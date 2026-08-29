import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = (process.env.BASE_URL || 'https://speak-page-actions.sociobot.in').replace(/\/$/, '');
const evidence = process.env.EVIDENCE_DIR || 'test-results/verify-live-3';
mkdirSync(evidence, { recursive: true });
const report = { base, routes: {}, demo: {}, license: {}, history: {}, offline: {}, assets: {}, errors: [] };
const browser = await chromium.launch();

const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
const page = await context.newPage();
page.on('pageerror', (error) => report.errors.push(String(error)));
page.on('console', (message) => { if (message.type() === 'error') report.errors.push(message.text()); });

const routeData = [
  ['/', 'Speak Page Actions — Speak visible page actions', 'Speak visible page actions with review before sensitive clicks.'],
  ['/demo', 'Demo — Speak Page Actions', 'Try four visible controls without changing a real page.'],
  ['/privacy', 'Privacy — Speak Page Actions', 'How Speak Page Actions handles browser-local data.'],
  ['/terms', 'Terms — Speak Page Actions', 'Terms for Speak Page Actions.'],
];
const internalLinks = new Set();
for (const [path, title, description] of routeData) {
  const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, `${path} must return 200`);
  assert.equal(await page.title(), title);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('main').count(), 1);
  assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), description);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${base}${path}`);
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), title);
  assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute('content'), title);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id);
  assert.deepEqual(serious, [], `${path} has serious Axe findings`);
  for (const href of await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.href))) {
    if (new URL(href).origin === base) internalLinks.add(href);
  }
  report.routes[path] = { status: response.status(), title, seriousAxe: serious.length };
}

await page.goto(`${base}/`, { waitUntil: 'networkidle' });
const cta = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
const explanation = await page.getByText('Opens four sample controls without changing a real page.').boundingBox();
assert.ok(cta && cta.y + cta.height <= 844);
assert.ok(explanation && explanation.y + explanation.height <= 844);
await page.screenshot({ path: join(evidence, 'home-390.png'), fullPage: true });
const demoRequests = [];
page.on('request', (request) => demoRequests.push(request.url()));
await page.getByRole('link', { name: 'Try it with sample data' }).click();
assert.equal(page.url(), `${base}/?demo=1`);
assert.equal(await page.locator('.demo-bar').isVisible(), true);
assert.equal(await page.locator('#demo-actions button').count(), 4);
const lastAction = await page.locator('#demo-actions button').last().boundingBox();
const seeded = await page.locator('.demo-console > div p').boundingBox();
assert.ok(lastAction && lastAction.y + lastAction.height <= 844);
assert.ok(seeded && seeded.y + seeded.height <= 844);
await page.evaluate(() => {
  localStorage.setItem('spa:real-setting', 'keep');
  localStorage.setItem('sb_license:other-product', 'keep');
});
await page.getByRole('button', { name: /Save address/ }).click();
assert.match(await page.locator('#demo-status').textContent(), /Used Save address/);
assert.equal(demoRequests.every((url) => new URL(url).origin === base), true);
await page.screenshot({ path: join(evidence, 'demo-390.png'), fullPage: true });
await page.getByRole('button', { name: 'Reset demo' }).click();
assert.deepEqual(await page.evaluate(() => ({
  demo: Object.keys(localStorage).filter((key) => key.startsWith('demo:spa:')),
  setting: localStorage.getItem('spa:real-setting'),
  license: localStorage.getItem('sb_license:other-product'),
})), { demo: [], setting: 'keep', license: 'keep' });
await page.getByRole('button', { name: /Save address/ }).click();
await page.getByRole('button', { name: 'Start for real' }).click();
assert.equal(page.url(), `${base}/#install`);
assert.equal(await page.getByRole('heading', { name: 'Install on desktop Chrome or Chromium' }).isVisible(), true);
assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:spa:'))), []);
report.demo = { url: `${base}/?demo=1`, controls: 4, sameOriginRequests: true, reset: true, startForReal: true };

await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, 1200));
const priorScroll = await page.evaluate(() => window.scrollY);
await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
await page.goBack();
assert.equal(await page.getByRole('heading', { level: 1, name: 'Speak the action you need' }).evaluate((node) => node === document.activeElement), true);
assert.ok(await page.evaluate(() => window.scrollY) >= priorScroll - 2);
await page.goForward();
assert.equal(await page.getByRole('heading', { level: 1, name: 'Privacy for your current page' }).evaluate((node) => node === document.activeElement), true);
report.history = { priorScroll, restored: true, focusRestored: true };

for (const href of internalLinks) {
  const response = await context.request.get(href);
  assert.equal(response.status(), 200, `${href} must return 200`);
}
const checkout = await context.request.get('https://api.sociobot.in/api/v1/products/speak-page-actions/checkout');
assert.equal(checkout.status(), 200);
assert.equal(new URL(checkout.url()).hostname, 'checkout.dodopayments.com');

const notFoundPage = await context.newPage();
const missing = await notFoundPage.goto(`${base}/missing-polish-3`);
assert.equal(missing.status(), 404);
assert.equal(await notFoundPage.title(), 'Page not found — Speak Page Actions');
assert.equal(await notFoundPage.getByRole('heading', { name: 'This page could not be found' }).isVisible(), true);
await notFoundPage.screenshot({ path: join(evidence, '404-390.png'), fullPage: true });
await notFoundPage.close();

const licenseContext = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
const licensePage = await licenseContext.newPage();
await licensePage.goto(`${base}/`);
await licensePage.waitForFunction(() => navigator.serviceWorker?.controller !== null);
await licensePage.goto(`${base}/?license=cold-return-token`);
assert.equal(licensePage.url(), `${base}/`);
const handoff = licensePage.locator('#license-handoff');
assert.equal(await handoff.isVisible(), true);
assert.equal(await handoff.evaluate((node) => node === document.activeElement), true);
await licensePage.getByRole('button', { name: 'Copy license token' }).click();
assert.equal(await licensePage.evaluate(() => navigator.clipboard.readText()), 'cold-return-token');
const licenseStorage = await licensePage.evaluate(async () => ({
  local: Object.keys(localStorage),
  session: Object.keys(sessionStorage),
  cookie: document.cookie,
  databases: typeof indexedDB.databases === 'function' ? (await indexedDB.databases()).map((database) => database.name) : [],
  cacheUrls: (await Promise.all((await caches.keys()).map(async (name) => (await (await caches.open(name)).keys()).map((request) => request.url)))).flat(),
}));
assert.deepEqual(licenseStorage.local, []);
assert.deepEqual(licenseStorage.session, []);
assert.equal(licenseStorage.cookie, '');
assert.deepEqual(licenseStorage.databases, []);
assert.equal(licenseStorage.cacheUrls.some((url) => url.includes('cold-return-token')), false);
await licensePage.screenshot({ path: join(evidence, 'license-return-390.png'), fullPage: false });
report.license = { urlScrubbed: true, handoffFocused: true, clipboard: true, browserStorageEmpty: true, cacheTokenAbsent: true };
await licenseContext.close();

const darkContext = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
const darkPage = await darkContext.newPage();
for (const [path] of routeData) {
  await darkPage.goto(`${base}${path}`);
  const axe = await new AxeBuilder({ page: darkPage }).analyze();
  assert.deepEqual(axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id), []);
}
await darkContext.close();

const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const offlinePage = await offlineContext.newPage();
await offlinePage.goto(`${base}/demo`);
await offlinePage.waitForFunction(() => navigator.serviceWorker?.controller !== null);
await offlinePage.reload();
await offlineContext.setOffline(true);
await offlinePage.reload();
assert.equal(await offlinePage.getByRole('heading', { name: 'Speak a visible control' }).isVisible(), true);
report.offline = { demoReloaded: true };
await offlineContext.close();

const homeResponse = await fetch(`${base}/`);
assert.equal(homeResponse.status, 200);
const csp = homeResponse.headers.get('content-security-policy') || '';
assert.match(csp, /frame-ancestors 'none'/);
assert.equal(homeResponse.headers.get('referrer-policy'), 'no-referrer');
const homeHtml = await homeResponse.text();
for (const match of homeHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
  const live = Buffer.from(await (await fetch(`${base}${match[1]}`)).arrayBuffer());
  const local = readFileSync(`dist/site${match[1]}`);
  assert.equal(createHash('sha256').update(live).digest('hex'), createHash('sha256').update(local).digest('hex'));
}
const liveZip = Buffer.from(await (await fetch(`${base}/downloads/speak-page-actions.zip`)).arrayBuffer());
const localZip = readFileSync('dist/site/downloads/speak-page-actions.zip');
assert.equal(createHash('sha256').update(liveZip).digest('hex'), createHash('sha256').update(localZip).digest('hex'));
report.assets = { liveBuildMatchesLocal: true, downloadMatchesLocal: true, cspFrameAncestors: true, referrerPolicy: 'no-referrer' };

assert.deepEqual(report.errors, []);
writeFileSync(join(evidence, 'cold-check.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await context.close();
await browser.close();
