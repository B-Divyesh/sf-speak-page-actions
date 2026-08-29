import { test, expect, chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { installPageAgent } from '../src/lib/page-agent';
import { findAction } from '../src/lib/actions';

async function extensionPopup(mockSpeech = false) {
  const userDataDir = mkdtempSync(`${tmpdir()}/speak-page-actions-`);
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true,
    args: [`--disable-extensions-except=${process.cwd()}/dist/extension`, `--load-extension=${process.cwd()}/dist/extension`]
  });
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  const extensionId = new URL(worker.url()).hostname;
  const popup = await context.newPage();
  if (mockSpeech) await popup.addInitScript(() => {
    class MockRecognition {
      lang = ''; interimResults = false; continuous = false; processLocally = false;
      onresult = null; onerror = null; onend: (() => void) | null = null;
      start() { (window as any).__speechStarts = ((window as any).__speechStarts || 0) + 1; }
      stop() { (window as any).__speechStops = ((window as any).__speechStops || 0) + 1; this.onend?.(); }
    }
    (window as any).SpeechRecognition = MockRecognition;
  });
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  return { context, popup };
}

async function installAgent(page: import('@playwright/test').Page) {
  await page.evaluate((source) => {
    const handlers: Array<(message: unknown) => unknown> = [];
    Object.assign(window, {
      chrome: { runtime: { onMessage: { addListener: (handler: (message: unknown) => unknown) => handlers.push(handler) } } },
      sendSpaMessage: (message: unknown) => Promise.resolve(handlers[0](message)),
    });
    new Function(`return (${source})`)()();
  }, installPageAgent.toString());
}

async function undersizedTargets(page: import('@playwright/test').Page) {
  return page.locator('a[href], button, input, select, summary').evaluateAll((elements) => elements.flatMap((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (!rect.width || !rect.height || style.display === 'none' || style.visibility === 'hidden' || element.closest('[hidden]')) return [];
    return rect.width < 44 || rect.height < 44
      ? [{ name: (element.textContent || element.getAttribute('aria-label') || element.tagName).trim().replace(/\s+/g, ' '), width: rect.width, height: rect.height }]
      : [];
  }));
}

test('landing has no serious accessibility violations at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id)).toEqual([]);
});

test('all site controls are at least 44 by 44 CSS pixels at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms', '/404']) {
    await page.goto(path);
    if (path === '/') {
      await expect(page.getByLabel('License token')).toBeHidden();
      await page.getByRole('button', { name: 'Restore a license' }).click();
      await expect(page.getByLabel('License token')).toBeVisible();
    }
    expect(await undersizedTargets(page), path).toEqual([]);
  }
});

test('packaged extension controls are at least 44 by 44 CSS pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const html = readFileSync('dist/extension/popup.html', 'utf8')
    .replace(/<link[^>]+rel="stylesheet"[^>]*>/g, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
  const popupCss = readdirSync('dist/extension/assets')
    .filter((file) => file.startsWith('popup-') && file.endsWith('.css'))
    .map((file) => readFileSync(`dist/extension/assets/${file}`, 'utf8'))
    .join('\n');
  await page.setContent(html);
  await page.addStyleTag({ content: popupCss });
  await page.getByText('Save your own command names (Pro)').click();
  expect(await undersizedTargets(page)).toEqual([]);
});

test('dark routes have no serious accessibility violations', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const path of ['/', '/demo', '/privacy', '/terms', '/404']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id), path).toEqual([]);
  }
});

test('unknown URLs return the styled HTTP 404 response', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto('/no-such-route');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Speak Page Actions');
  await expect(page.getByRole('heading', { level: 1, name: 'This page could not be found' })).toBeVisible();
  expect(await undersizedTargets(page)).toEqual([]);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id)).toEqual([]);
});

test('initial keyboard focus reaches the skip link before page content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
});

test('@claim:sample-action opens four sample controls in one click', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Speak a visible control' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Save address/ })).toBeVisible();
  await expect(page.locator('#demo-actions button')).toHaveCount(4);
  await expect(page.locator('#demo-status')).toContainText('Found four visible controls');
  const initialViewport = await page.locator('#demo-actions').evaluate((element) => element.getBoundingClientRect().top < window.innerHeight);
  expect(initialViewport).toBe(true);
});

test('@claim:demo-local keeps demo use local to this site', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Type a command for the sample').fill('click save address');
  await page.getByRole('button', { name: 'Run command' }).click();
  await expect(page.locator('#demo-status')).toContainText('Used Save address.');
  expect(await page.evaluate(() => Object.keys(localStorage).some((key) => key.startsWith('demo:spa:')))).toBe(true);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => !key.startsWith('demo:spa:')))).toEqual([]);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:offline-reload works offline after the first visit', async ({ context, page }) => {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Product facts' })).toContainText('Works offline after the first visit');
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Speak a visible control' })).toBeVisible();
});

test('@claim:active-tab-only packages no always-on page injection', async () => {
  const manifest = JSON.parse(readFileSync('dist/extension/manifest.json', 'utf8'));
  expect(manifest.permissions).toContain('activeTab');
  expect(manifest.content_scripts).toBeUndefined();
  expect(manifest.host_permissions || []).not.toContain('<all_urls>');
});

test('@claim:on-device-speech refuses recognition without local processing support', async () => {
  const { context, popup } = await extensionPopup();
  try {
    await popup.addInitScript(() => { (window as any).SpeechRecognition = class { start() {} stop() {} }; });
    await popup.reload();
    await popup.getByRole('button', { name: /Hold to speak/ }).dispatchEvent('pointerdown');
    await expect(popup.locator('#status')).toContainText('On-device speech recognition is unavailable here');
  } finally { await context.close(); }
});

test('@claim:destructive-review requires review before implicit and explicit form submits', async ({ page }) => {
  await page.setContent('<main><form><button id="implicit">Save changes</button><button id="explicit" type="submit">Publish changes</button></form></main>');
  await installAgent(page);
  await page.evaluate(() => document.querySelector('form')?.addEventListener('submit', (event) => { event.preventDefault(); (window as any).__submits = ((window as any).__submits || 0) + 1; }));
  const result = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ id: string; label: string; destructive: boolean }> }>; }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  expect(result.actions.find((action) => action.label === 'Save changes')?.destructive).toBe(true);
  expect(result.actions.find((action) => action.label === 'Publish changes')?.destructive).toBe(true);
  for (const action of result.actions) {
    const blocked = await page.evaluate((id) => (window as any).sendSpaMessage({ type: 'SPA_ACTIVATE', id }), action.id);
    expect(blocked.needsReview).toBe(true);
  }
  expect(await page.evaluate(() => (window as any).__submits || 0)).toBe(0);
  const implicit = result.actions.find((action) => action.label === 'Save changes')!;
  await page.evaluate((id) => (window as any).sendSpaMessage({ type: 'SPA_ACTIVATE', id, confirmed: true }), implicit.id);
  expect(await page.evaluate(() => (window as any).__submits)).toBe(1);
});

test('@claim:visible-labels lists visible labelled controls and omits hidden controls', async ({ page }) => {
  await page.setContent('<main><button>Save address</button><button style="display:none">Hidden action</button></main>');
  await installAgent(page);
  const result = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ label: string }> }> }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  expect(result.actions.map((action) => action.label)).toEqual(['Save address']);
});

test('@claim:password-exclusion never lists a password field', async ({ page }) => {
  await page.setContent('<main><label>Password <input type="password" value="secret" /></label><button>Save address</button></main>');
  await installAgent(page);
  const result = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ label: string }> }> }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  expect(result.actions.map((action) => action.label)).not.toContain('Password');
});

test('@claim:push-to-talk starts and stops for pointer, Space, and Enter holds', async () => {
  const { context, popup } = await extensionPopup(true);
  try {
    const talk = popup.locator('#talk');
    await talk.dispatchEvent('pointerdown'); await expect(talk).toHaveAttribute('aria-pressed', 'true'); await talk.dispatchEvent('pointerup');
    await talk.focus(); await popup.keyboard.down(' '); await expect(talk).toHaveAttribute('aria-pressed', 'true'); await popup.keyboard.up(' ');
    await popup.keyboard.down('Enter'); await expect(talk).toHaveAttribute('aria-pressed', 'true'); await popup.keyboard.up('Enter');
    expect(await popup.evaluate(() => [(window as any).__speechStarts, (window as any).__speechStops])).toEqual([3, 3]);
    await expect(talk).toHaveAttribute('aria-pressed', 'false');
  } finally { await context.close(); }
});

test('@claim:pro-aliases saves an alias in extension-local storage and exposes $12 checkout', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Product facts' })).toContainText('names cost $12 once');
  await expect(page.getByRole('link', { name: 'Buy a $12 Pro license' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/speak-page-actions/checkout');
  await page.getByRole('button', { name: 'Restore a license' }).click();
  await expect(page.getByLabel('License token')).toBeVisible();
  const checkout = await request.get('https://api.sociobot.in/api/v1/products/speak-page-actions/checkout');
  expect(checkout.status()).toBe(200);
  expect(new URL(checkout.url()).hostname).toBe('checkout.dodopayments.com');
  const checkoutPage = await checkout.text();
  expect(checkoutPage).toContain('pdt_0NmQKji0raDAsy6yS95UP');
  expect(checkoutPage).toContain('Speak Page Actions');
  expect(checkoutPage).toContain('$12.00');
  const { context, popup } = await extensionPopup();
  try {
    await popup.evaluate(async () => {
      await chrome.storage.local.set({ 'spa:aliases': { checkout: 'Review order' }, 'sb_license:speak-page-actions': 'recorded-valid-license' });
    });
    const saved = await popup.evaluate(() => chrome.storage.local.get(['spa:aliases', 'sb_license:speak-page-actions']));
    expect(saved['spa:aliases']).toEqual({ checkout: 'Review order' });
    expect(saved['sb_license:speak-page-actions']).toBe('recorded-valid-license');
    await page.setContent('<main><a id="review" href="#review">Review order</a></main>');
    await installAgent(page);
    const actions = await page.evaluate(() => (window as any).sendSpaMessage({ type: 'SPA_COLLECT' }).then((result: any) => result.actions));
    const aliased = findAction((saved['spa:aliases'] as Record<string, string>).checkout, actions);
    expect(aliased?.label).toBe('Review order');
    await page.evaluate(() => document.querySelector('#review')?.addEventListener('click', (event) => { event.preventDefault(); (window as any).__aliasUsed = true; }));
    await page.evaluate((id) => (window as any).sendSpaMessage({ type: 'SPA_ACTIVATE', id }), aliased!.id);
    expect(await page.evaluate(() => (window as any).__aliasUsed)).toBe(true);
  } finally { await context.close(); }
});

test('@claim:core-free runs normal controls and reaches review without a license token', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Product facts' })).toContainText('Core actions are free');
  await page.setContent('<main><button id="save">Save address</button><button id="delete">Delete saved draft</button></main>');
  await installAgent(page);
  const actions = await page.evaluate(() => (window as any).sendSpaMessage({ type: 'SPA_COLLECT' }).then((result: any) => result.actions));
  const save = actions.find((action: any) => action.label === 'Save address');
  const remove = actions.find((action: any) => action.label === 'Delete saved draft');
  await page.evaluate(() => document.querySelector('#save')?.addEventListener('click', () => ((window as any).__saved = true)));
  const normal = await page.evaluate((id) => (window as any).sendSpaMessage({ type: 'SPA_ACTIVATE', id }), save.id);
  expect(normal.ok).toBe(true); expect(await page.evaluate(() => (window as any).__saved)).toBe(true);
  const review = await page.evaluate((id) => (window as any).sendSpaMessage({ type: 'SPA_ACTIVATE', id }), remove.id);
  expect(review.needsReview).toBe(true);
});

test('@claim:page-data-local keeps complete extension page handling free of page-data requests', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByText('The extension does not send page labels, spoken commands, or browsing history.')).toBeVisible();
  const agent = installPageAgent.toString();
  expect(agent).not.toContain('fetch(');
  expect(agent).not.toContain('XMLHttpRequest');
  const popupChunk = readdirSync('dist/extension/chunks').find((file) => file.startsWith('popup-') && file.endsWith('.js'))!;
  const popupCode = readFileSync(`dist/extension/chunks/${popupChunk}`, 'utf8');
  expect(popupCode).toContain('https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=');
  expect(popupCode).not.toMatch(/(?:pageLabel|transcript|history)\s*:/i);
});

test('@claim:extension-local-storage keeps aliases and licenses out of sync storage', async () => {
  const { context, popup } = await extensionPopup();
  try {
    await popup.evaluate(() => chrome.storage.local.set({ 'spa:aliases': { order: 'Review order' }, 'sb_license:speak-page-actions': 'recorded-license' }));
    expect(await popup.evaluate(() => chrome.storage.local.get(null))).toMatchObject({ 'spa:aliases': { order: 'Review order' }, 'sb_license:speak-page-actions': 'recorded-license' });
    const popupChunk = readdirSync('dist/extension/chunks').find((file) => file.startsWith('popup-') && file.endsWith('.js'))!;
    expect(readFileSync(`dist/extension/chunks/${popupChunk}`, 'utf8')).not.toContain('storage.sync');
  } finally { await context.close(); }
});

test('@claim:license-verification sends only an encoded license token to Sociobot verify', async () => {
  const popupChunk = readdirSync('dist/extension/chunks').find((file) => file.startsWith('popup-') && file.endsWith('.js'))!;
  const popupCode = readFileSync(`dist/extension/chunks/${popupChunk}`, 'utf8');
  expect(popupCode).toContain('api.sociobot.in/api/v1/products/speak-page-actions/verify?license=');
  expect(popupCode).toContain('encodeURIComponent');
  expect(popupCode.match(/https:\/\//g)?.length || 0).toBe(1);
});

test('@claim:undo-local-delete restores the complete removed item', async ({ page }) => {
  await page.setContent('<main><ul><li id="item"><button id="delete">Delete saved draft</button></li></ul></main>');
  await page.evaluate(() => document.querySelector('#delete')?.addEventListener('click', () => document.querySelector('#item')?.remove()));
  await installAgent(page);
  const collected = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ id: string; label: string }> }>; }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  const action = collected.actions.find((item) => item.label === 'Delete saved draft');
  expect(action).toBeDefined();
  const activated = await page.evaluate((id) => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ canUndo?: boolean }> }).sendSpaMessage({ type: 'SPA_ACTIVATE', id, confirmed: true }), action!.id);
  expect(activated.canUndo).toBe(true);
  await expect(page.locator('#item')).toHaveCount(0);
  const undone = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ ok: boolean }> }).sendSpaMessage({ type: 'SPA_UNDO' }));
  expect(undone.ok).toBe(true);
  await expect(page.locator('#item')).toHaveCount(1);
});

test('service worker removes old named caches on activation', async ({ page }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.evaluate(async () => {
    await caches.open('speak-page-actions-v2');
  });
  await page.evaluate(() => navigator.serviceWorker.register('/service-worker.js?update-regression'));
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await expect.poll(() => page.evaluate(() => caches.keys())).not.toContain('speak-page-actions-v2');
});

test('release response-header CSP prevents framing', async () => {
  const config = JSON.parse(readFileSync('dist/site/staticwebapp.config.json', 'utf8'));
  const csp = config.globalHeaders?.['Content-Security-Policy'] || '';
  expect(csp).toMatch(/(^|;)\s*frame-ancestors 'none'\s*(;|$)/);
  expect(readFileSync('dist/site/index.html', 'utf8')).not.toContain('http-equiv="Content-Security-Policy"');
});

test('landing first screen presents exactly three privacy, offline, and price facts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const facts = page.getByRole('list', { name: 'Product facts' }).getByRole('listitem');
  await expect(facts).toHaveCount(3);
  await expect(facts.nth(0)).toHaveText('Page labels stay in your browser');
  await expect(facts.nth(1)).toHaveText('Works offline after the first visit');
  await expect(facts.nth(2)).toHaveText('Core actions are free; names cost $12 once');
  const heroAction = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
  const heroResult = await page.getByText('Opens four sample controls without changing a real page.').boundingBox();
  expect((heroAction?.y || 999) + (heroAction?.height || 0)).toBeLessThanOrEqual(844);
  expect((heroResult?.y || 999) + (heroResult?.height || 0)).toBeLessThanOrEqual(844);
});

test('demo reset and start for real clear only demo storage and lead to installation', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => { localStorage.setItem('spa:real-setting', 'keep'); localStorage.setItem('sb_license:speak-page-actions', 'keep'); localStorage.setItem('demo:spa:extra', 'remove'); });
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/#install$/);
  await expect(page.getByRole('heading', { name: 'Install the extension' })).toBeVisible();
  expect(await page.evaluate(() => ({ demo: Object.keys(localStorage).filter((key) => key.startsWith('demo:spa:')), real: localStorage.getItem('spa:real-setting'), license: localStorage.getItem('sb_license:speak-page-actions') }))).toEqual({ demo: [], real: 'keep', license: 'keep' });
});

test('client routes set matching title, canonical, Open Graph, and Twitter metadata', async ({ page }) => {
  for (const [path, title, description] of [
    ['/demo', 'Demo — Speak Page Actions', 'Try four visible controls without changing a real page.'],
    ['/privacy', 'Privacy — Speak Page Actions', 'How Speak Page Actions handles browser-local data.'],
    ['/terms', 'Terms — Speak Page Actions', 'Terms for Speak Page Actions.'],
  ] as const) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`https://speak-page-actions.sociobot.in${path}`);
    expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBe(title);
    expect(await page.locator('meta[property="og:description"]').getAttribute('content')).toBe(description);
    expect(await page.locator('meta[name="twitter:title"]').getAttribute('content')).toBe(title);
    expect(await page.locator('meta[name="twitter:description"]').getAttribute('content')).toBe(description);
  }
});
