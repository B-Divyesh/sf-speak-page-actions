import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, readdirSync } from 'node:fs';
import { installPageAgent } from '../src/lib/page-agent';

test('landing has no serious accessibility violations at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id)).toEqual([]);
});

test('dark routes have no serious accessibility violations', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id), path).toEqual([]);
  }
});

test('initial keyboard focus reaches the skip link before page content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
});

test('@claim:sample-action opens the safe sample in one click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Speak a visible page action' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Save address/ })).toBeVisible();
});

test('@claim:demo-local keeps demo use local to this site', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Type a command for the sample').fill('click save address');
  await page.getByRole('button', { name: 'Run command' }).click();
  await expect(page.locator('#demo-status')).toContainText('Used Save address.');
  expect(await page.evaluate(() => Object.keys(localStorage).some((key) => key.startsWith('demo:spa:')))).toBe(true);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:offline-reload works offline after the first visit', async ({ context, page }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Speak a visible page action' })).toBeVisible();
});

test('@claim:active-tab-only packages no always-on page injection', async () => {
  const manifest = JSON.parse(readFileSync('dist/extension/manifest.json', 'utf8'));
  expect(manifest.permissions).toContain('activeTab');
  expect(manifest.content_scripts).toBeUndefined();
  expect(manifest.host_permissions || []).not.toContain('<all_urls>');
});

test('@claim:on-device-speech keeps spoken words behind local processing support', async () => {
  const popupChunk = readdirSync('dist/extension/chunks').find((file) => file.startsWith('popup-') && file.endsWith('.js'));
  expect(popupChunk).toBeTruthy();
  const popupCode = readFileSync(`dist/extension/chunks/${popupChunk}`, 'utf8');
  expect(popupCode).toContain('processLocally');
  expect(popupCode).toContain('On-device speech recognition is unavailable here');
});

test('@claim:destructive-review classifies concatenated destructive page text for review', async ({ page }) => {
  await page.setContent('<main><ul><li id="item"><button id="delete"><span>BUTTON</span>Delete saved draft <b>review</b></button></li></ul></main>');
  await page.evaluate((source) => {
    const handlers: Array<(message: unknown) => unknown> = [];
    Object.assign(window, {
      chrome: { runtime: { onMessage: { addListener: (handler: (message: unknown) => unknown) => handlers.push(handler) } } },
      sendSpaMessage: (message: unknown) => Promise.resolve(handlers[0](message)),
    });
    new Function(`return (${source})`)()();
  }, installPageAgent.toString());
  const result = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ label: string; destructive: boolean }> }>; }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  expect(result.actions.find((action) => action.label.includes('Delete saved draft'))?.destructive).toBe(true);
});

test('@claim:visible-labels lists visible labelled controls and omits hidden controls', async ({ page }) => {
  await page.setContent('<main><button>Save address</button><button style="display:none">Hidden action</button></main>');
  await page.evaluate((source) => {
    const handlers: Array<(message: unknown) => unknown> = [];
    Object.assign(window, { chrome: { runtime: { onMessage: { addListener: (handler: (message: unknown) => unknown) => handlers.push(handler) } } }, sendSpaMessage: (message: unknown) => Promise.resolve(handlers[0](message)) });
    new Function(`return (${source})`)()();
  }, installPageAgent.toString());
  const result = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ label: string }> }> }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  expect(result.actions.map((action) => action.label)).toEqual(['Save address']);
});

test('@claim:password-exclusion never lists a password field', async ({ page }) => {
  await page.setContent('<main><label>Password <input type="password" value="secret" /></label><button>Save address</button></main>');
  await page.evaluate((source) => {
    const handlers: Array<(message: unknown) => unknown> = [];
    Object.assign(window, { chrome: { runtime: { onMessage: { addListener: (handler: (message: unknown) => unknown) => handlers.push(handler) } } }, sendSpaMessage: (message: unknown) => Promise.resolve(handlers[0](message)) });
    new Function(`return (${source})`)()();
  }, installPageAgent.toString());
  const result = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ label: string }> }> }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  expect(result.actions.map((action) => action.label)).not.toContain('Password');
});

test('@claim:push-to-talk starts speech only from an explicit hold action', async () => {
  const popupChunk = readdirSync('dist/extension/chunks').find((file) => file.startsWith('popup-') && file.endsWith('.js'));
  const popupCode = readFileSync(`dist/extension/chunks/${popupChunk}`, 'utf8');
  expect(popupCode).toContain("addEventListener(\"pointerdown\"");
  expect(popupCode).toContain("addEventListener(\"pointerup\"");
  expect(popupCode).not.toContain('setInterval(');
});

test('@claim:pro-aliases exposes the one-time $12 alias license and restore control', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Buy a $12 pro license' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/speak-page-actions/checkout');
  await page.getByRole('button', { name: 'Have a license? Paste it' }).click();
  await expect(page.getByLabel('License token')).toBeVisible();
});

test('@claim:core-free runs the sample command without a license token', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Type a command for the sample').fill('click save address');
  await page.getByRole('button', { name: 'Run command' }).click();
  await expect(page.locator('#demo-status')).toContainText('Used Save address.');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:speak-page-actions'))).toBeNull();
});

test('@claim:page-data-local keeps the injected page agent free of network calls', async () => {
  const agent = installPageAgent.toString();
  expect(agent).not.toContain('fetch(');
  expect(agent).not.toContain('XMLHttpRequest');
});

test('@claim:undo-local-delete restores the complete removed item', async ({ page }) => {
  await page.setContent('<main><ul><li id="item"><button id="delete">Delete saved draft</button></li></ul></main>');
  await page.evaluate(() => document.querySelector('#delete')?.addEventListener('click', () => document.querySelector('#item')?.remove()));
  await page.evaluate((source) => {
    const handlers: Array<(message: unknown) => unknown> = [];
    Object.assign(window, {
      chrome: { runtime: { onMessage: { addListener: (handler: (message: unknown) => unknown) => handlers.push(handler) } } },
      sendSpaMessage: (message: unknown) => Promise.resolve(handlers[0](message)),
    });
    new Function(`return (${source})`)()();
  }, installPageAgent.toString());
  const collected = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ id: string; label: string }> }>; }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  const action = collected.actions.find((item) => item.label === 'Delete saved draft');
  expect(action).toBeDefined();
  const activated = await page.evaluate((id) => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ canUndo?: boolean }> }).sendSpaMessage({ type: 'SPA_ACTIVATE', id }), action!.id);
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
