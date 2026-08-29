import { test, expect, chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { installPageAgent } from '../src/lib/page-agent';
import { findAction } from '../src/lib/actions';

async function extensionPopup(mockSpeech = false, unsupportedSpeech = false) {
  const userDataDir = mkdtempSync(`${tmpdir()}/speak-page-actions-`);
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium', headless: true,
    args: [`--disable-extensions-except=${process.cwd()}/dist/extension`, `--load-extension=${process.cwd()}/dist/extension`]
  });
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  const extensionId = new URL(worker.url()).hostname;
  const fixture = await context.newPage();
  await fixture.goto('http://127.0.0.1:4173/extension-fixture.html');
  const popup = await context.newPage();
  if (mockSpeech) await popup.addInitScript(() => {
    class MockRecognition {
      lang = ''; interimResults = false; continuous = false; processLocally = false;
      onresult: ((event: any) => void) | null = null; onerror = null; onend: (() => void) | null = null;
      start() { (window as any).__speechStarts = ((window as any).__speechStarts || 0) + 1; const command = (window as any).__speechCommand; if (command) this.onresult?.({ results: [[{ transcript: command }]] } as any); }
      stop() { (window as any).__speechStops = ((window as any).__speechStops || 0) + 1; this.onend?.(); }
    }
    (window as any).SpeechRecognition = MockRecognition;
  });
  if (unsupportedSpeech) await popup.addInitScript(() => {
    (window as any).SpeechRecognition = class { start() {} stop() {} };
  });
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(popup.locator('#status')).toContainText('visible actions on');
  await expect(popup.getByRole('button', { name: /Save address/ })).toBeVisible();
  return { context, popup, fixture };
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

test('all light site routes have no serious accessibility violations at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms', '/404']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id), path).toEqual([]);
  }
});

test('all site controls are at least 44 by 44 CSS pixels at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms', '/404']) {
    await page.goto(path === '/' ? '/?license=touch-target-token' : path);
    if (path === '/') await expect(page.getByLabel('License token returned by checkout')).toBeVisible();
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
  await page.getByText('Restore Pro and save command names').click();
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
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Speak a visible control' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Save address/ })).toBeVisible();
  await expect(page.locator('#demo-actions button')).toHaveCount(4);
  await expect(page.locator('#demo-status')).toContainText('Found four visible controls');
  const initialViewport = await page.locator('#demo-actions button').last().evaluate((element) => element.getBoundingClientRect().bottom <= window.innerHeight);
  const seededResult = await page.locator('.demo-console > div p').evaluate((element) => element.getBoundingClientRect().bottom <= window.innerHeight);
  expect(initialViewport).toBe(true);
  expect(seededResult).toBe(true);
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

test('@claim:demo-isolation keeps real settings unchanged while sample data changes', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => { localStorage.setItem('spa:real-setting', 'keep'); localStorage.setItem('sb_license:speak-page-actions', 'keep'); });
  await page.getByRole('button', { name: /Save address/ }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => ({ setting: localStorage.getItem('spa:real-setting'), license: localStorage.getItem('sb_license:speak-page-actions'), demo: Object.keys(localStorage).filter((key) => key.startsWith('demo:spa:')) }))).toEqual({ setting: 'keep', license: 'keep', demo: [] });
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

test('@claim:on-device-speech refuses recognition without local processing support and keeps typing available', async () => {
  const { context, popup, fixture } = await extensionPopup(false, true);
  try {
    await popup.getByRole('button', { name: /Hold to speak/ }).dispatchEvent('pointerdown');
    await expect(popup.locator('#status')).toContainText('On-device speech recognition is unavailable here');
    await popup.locator('#command').fill('click save address');
    await popup.getByRole('button', { name: 'Run command' }).click();
    await expect(fixture.locator('#result')).toHaveText('Saved address.');
  } finally { await context.close(); }
});

test('@claim:typed-command runs a visible control through the packaged extension', async () => {
  const { context, popup, fixture } = await extensionPopup();
  try {
    await popup.locator('#command').fill('click review order');
    await popup.getByRole('button', { name: 'Run command' }).click();
    await expect(fixture.locator('#result')).toHaveText('Reviewed order.');
  } finally { await context.close(); }
});

test('@claim:destructive-review requires review before every documented sensitive action', async ({ page }) => {
  const labels = [
    'Save changes', 'Publish changes', 'Delete saved draft', 'Send message', 'Pay now',
    'Cancel subscription', 'Unsubscribe', 'Archive conversation', 'Deactivate account',
    'Close your account', 'Sign out',
  ];
  await page.setContent('<main><form><button>Save changes</button><button type="submit">Publish changes</button></form><button>Delete saved draft</button><button>Send message</button><button>Pay now</button><button>Cancel subscription</button><button>Unsubscribe</button><button>Archive conversation</button><button>Deactivate account</button><button>Close your account</button><button>Sign out</button></main>');
  await page.evaluate((sensitiveLabels) => {
    (window as any).__activated = [];
    document.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => (window as any).__activated.push(button.textContent?.trim())));
    document.querySelector('form')?.addEventListener('submit', (event) => event.preventDefault());
    (window as any).__sensitiveLabels = sensitiveLabels;
  }, labels);
  await installAgent(page);
  const result = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ id: string; label: string; destructive: boolean }> }>; }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  const sensitiveActions = labels.map((label) => result.actions.find((action) => action.label === label)!);
  expect(sensitiveActions.every((action) => action?.destructive)).toBe(true);
  for (const action of sensitiveActions) {
    const blocked = await page.evaluate((id) => (window as any).sendSpaMessage({ type: 'SPA_ACTIVATE', id }), action.id);
    expect(blocked.needsReview).toBe(true);
  }
  expect(await page.evaluate(() => (window as any).__activated)).toEqual([]);
  for (const action of sensitiveActions) await page.evaluate((id) => (window as any).sendSpaMessage({ type: 'SPA_ACTIVATE', id, confirmed: true }), action.id);
  expect(await page.evaluate(() => (window as any).__activated)).toEqual(labels);

  const { context, popup, fixture } = await extensionPopup();
  try {
    const popupCases = [
      ['Publish changes', 'Published changes.'],
      ['Cancel subscription', 'Cancelled subscription.'],
      ['Unsubscribe', 'Unsubscribed.'],
      ['Archive conversation', 'Archived conversation.'],
      ['Deactivate account', 'Deactivated account.'],
      ['Close your account', 'Closed account.'],
      ['Sign out', 'Signed out.'],
    ];
    for (const [label, expected] of popupCases) {
      await fixture.locator('#result').evaluate((element) => { element.textContent = ''; });
      await popup.getByRole('button', { name: new RegExp(label) }).click();
      await expect(popup.getByRole('dialog')).toBeVisible();
      await expect(fixture.locator('#result')).toHaveText('');
      const confirm = popup.locator('#confirm');
      await expect(confirm).toHaveText(label);
      if (label === 'Publish changes') await popup.screenshot({ path: 'test-results/polish-5/extension-confirmation.png', fullPage: true });
      await confirm.click();
      await expect(fixture.locator('#result')).toHaveText(expected);
      await expect(popup.getByRole('dialog')).toBeHidden();
      await expect(confirm).toHaveText('Confirm action');
    }
  } finally { await context.close(); }
});

test('@claim:visible-labels lists visible buttons, links, and labelled fields', async ({ page }) => {
  await page.setContent('<main><button>Save address</button><a href="#review">Review order</a><label for="shipping">Shipping method</label><select id="shipping"><option>Standard</option></select><button style="display:none">Hidden action</button></main>');
  await installAgent(page);
  const result = await page.evaluate(() => (window as typeof window & { sendSpaMessage: (message: unknown) => Promise<{ actions: Array<{ label: string }> }> }).sendSpaMessage({ type: 'SPA_COLLECT' }));
  expect(result.actions.map((action) => action.label)).toEqual(['Save address', 'Review order', 'Shipping method']);
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
    await talk.dispatchEvent('pointerdown'); await expect(talk).toHaveAttribute('aria-pressed', 'true'); await talk.dispatchEvent('pointercancel');
    expect(await popup.evaluate(() => [(window as any).__speechStarts, (window as any).__speechStops])).toEqual([4, 4]);
    await expect(talk).toHaveAttribute('aria-pressed', 'false');
  } finally { await context.close(); }
});

test('@claim:pro-aliases saves and uses a command name through the packaged extension', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Product facts' })).toContainText('saved command names cost $12 once');
  await expect(page.getByRole('link', { name: 'Buy Pro in hosted checkout — $12 once' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/speak-page-actions/checkout');
  await expect(page.getByText('Opens Dodo’s checkout in this tab.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open the extension to restore Pro' })).toBeVisible();
  await page.goto('/?license=recorded-valid-license');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.locator('#license-handoff')).toBeFocused();
  const returnedToken = await page.getByLabel('License token returned by checkout').inputValue();
  expect(returnedToken).toBe('recorded-valid-license');
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({});
  const checkout = await request.get('https://api.sociobot.in/api/v1/products/speak-page-actions/checkout');
  expect(checkout.status()).toBe(200);
  expect(new URL(checkout.url()).hostname).toBe('checkout.dodopayments.com');
  const checkoutPage = await checkout.text();
  expect(checkoutPage).toContain('pdt_0NmQKji0raDAsy6yS95UP');
  expect(checkoutPage).toContain('Speak Page Actions');
  expect(checkoutPage).toContain('$12.00');
  const { context, popup, fixture } = await extensionPopup();
  try {
    await context.route('https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=recorded-valid-license', async (route) => {
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
    });
    await popup.getByText('Restore Pro and save command names').click();
    await popup.getByLabel('Pro license token').fill(returnedToken);
    await popup.getByRole('button', { name: 'Restore Pro' }).click();
    await expect(popup.locator('#license-status')).toHaveText('Pro is active in this extension.');
    await popup.getByLabel('Your command name').fill('checkout');
    await popup.getByLabel('Visible control').selectOption({ label: 'Review order' });
    await popup.getByRole('button', { name: 'Save command name' }).click();
    await expect(popup.locator('#alias-status')).toHaveText('Saved “checkout” for Review order.');
    const saved = await popup.evaluate(() => chrome.storage.local.get(['spa:aliases', 'sb_license:speak-page-actions']));
    expect(saved['spa:aliases']).toEqual({ checkout: 'Review order' });
    expect(saved['sb_license:speak-page-actions']).toBe('recorded-valid-license');
    await popup.reload();
    await popup.locator('#command').fill('checkout');
    await popup.getByRole('button', { name: 'Run command' }).click();
    await expect(fixture.locator('#result')).toHaveText('Reviewed order.');
    expect(await popup.evaluate(() => chrome.storage.sync.get(null))).toEqual({});
  } finally { await context.close(); }
});

test('@claim:core-free runs normal controls and reaches review through the packaged extension', async () => {
  const { context, popup, fixture } = await extensionPopup();
  try {
    expect(await popup.evaluate(() => chrome.storage.local.get(['spa:aliases', 'sb_license:speak-page-actions', 'spa:license-verdict']))).toEqual({});
    await popup.getByRole('button', { name: 'Scan page' }).click();
    await popup.getByRole('button', { name: /Save address/ }).click();
    await expect(fixture.locator('#result')).toHaveText('Saved address.');
    await popup.getByRole('button', { name: /Delete saved draft/ }).click();
    await expect(popup.getByRole('dialog')).toBeVisible();
    await expect(popup.locator('#confirm')).toHaveText('Delete saved draft');
    await expect(popup.getByRole('dialog')).toContainText('may change or send something');
    expect(await popup.evaluate(() => chrome.storage.local.get(['spa:aliases', 'sb_license:speak-page-actions', 'spa:license-verdict']))).toEqual({});
  } finally { await context.close(); }
});

test('@claim:page-data-local records no external page-data requests in a complete extension flow', async () => {
  const { context, popup, fixture } = await extensionPopup(true);
  const external: string[] = [];
  context.on('request', (request) => { if (request.url().startsWith('http')) external.push(request.url()); });
  try {
    await popup.getByRole('button', { name: 'Scan page' }).click();
    await popup.locator('#command').fill('click save address');
    await popup.getByRole('button', { name: 'Run command' }).click();
    await expect(fixture.locator('#result')).toHaveText('Saved address.');
    await popup.getByRole('button', { name: /Delete saved draft/ }).click();
    await popup.getByRole('button', { name: 'Delete saved draft', exact: true }).last().click();
    await expect(fixture.locator('#result')).toHaveText('Deleted saved draft.');
    await popup.getByRole('button', { name: 'Undo last page action' }).click();
    await expect(fixture.locator('#draft')).toHaveCount(1);
    await popup.evaluate(() => { (window as any).__speechCommand = 'click save address'; });
    await popup.getByRole('button', { name: /Hold to speak/ }).dispatchEvent('pointerdown');
    await expect(fixture.locator('#result')).toHaveText('Saved address.');
    expect(external.filter((url) => new URL(url).hostname === 'api.sociobot.in')).toEqual([]);
    expect(external.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  } finally { await context.close(); }
});

test('@claim:extension-local-storage keeps license data out of website storage and inside the extension', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.goto('/?license=recorded-license');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  const returned = page.getByLabel('License token returned by checkout');
  await expect(returned).toHaveValue('recorded-license');
  await expect(page.locator('#license-handoff')).toBeFocused();
  const websiteStorage = await page.evaluate(async () => {
    const cacheRequests = (await Promise.all((await caches.keys()).map(async (name) => (await (await caches.open(name)).keys()).map((request) => request.url)))).flat();
    return {
      local: Object.fromEntries(Object.entries(localStorage)),
      session: Object.fromEntries(Object.entries(sessionStorage)),
      cookie: document.cookie,
      databases: typeof indexedDB.databases === 'function' ? (await indexedDB.databases()).map((database) => database.name) : [],
      cacheRequests,
    };
  });
  expect(websiteStorage.local).toEqual({});
  expect(websiteStorage.session).toEqual({});
  expect(websiteStorage.cookie).toBe('');
  expect(websiteStorage.databases).toEqual([]);
  expect(websiteStorage.cacheRequests.some((url) => url.includes('recorded-license'))).toBe(false);
  const { context, popup } = await extensionPopup();
  try {
    await context.route('https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=recorded-license', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true }) }));
    await popup.getByText('Restore Pro and save command names').click();
    await popup.getByLabel('Pro license token').fill('recorded-license');
    await popup.getByRole('button', { name: 'Restore Pro' }).click();
    await expect(popup.locator('#license-status')).toHaveText('Pro is active in this extension.');
    await popup.getByLabel('Your command name').fill('order');
    await popup.getByLabel('Visible control').selectOption({ label: 'Review order' });
    await popup.getByRole('button', { name: 'Save command name' }).click();
    await expect(popup.locator('#alias-status')).toHaveText('Saved “order” for Review order.');
    expect(await popup.evaluate(() => chrome.storage.local.get(null))).toMatchObject({ 'spa:aliases': { order: 'Review order' }, 'sb_license:speak-page-actions': 'recorded-license' });
    expect(await popup.evaluate(() => chrome.storage.sync.get(null))).toEqual({});
  } finally { await context.close(); }
});

test('@claim:license-verification sends an encoded restore token only to Sociobot', async () => {
  const { context, popup } = await extensionPopup();
  const requests: string[] = [];
  context.on('request', (request) => { if (request.url().startsWith('https://')) requests.push(request.url()); });
  try {
    const token = 'recorded valid/license';
    await context.route('https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=recorded%20valid%2Flicense', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true }) }));
    await popup.getByText('Restore Pro and save command names').click();
    await popup.getByLabel('Pro license token').fill(token);
    await popup.getByRole('button', { name: 'Restore Pro' }).click();
    await expect(popup.locator('#license-status')).toHaveText('Pro is active in this extension.');
    expect(requests).toEqual(['https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=recorded%20valid%2Flicense']);
  } finally { await context.close(); }
});

test('license restore errors explain the next step and never save an invalid token', async () => {
  const { context, popup } = await extensionPopup();
  try {
    await popup.getByText('Restore Pro and save command names').click();
    await popup.getByRole('button', { name: 'Restore Pro' }).click();
    await expect(popup.locator('#license-status')).toHaveText('Paste your Pro license token.');
    await context.route('https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=invalid-license', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) }));
    await popup.getByLabel('Pro license token').fill('invalid-license');
    await popup.getByRole('button', { name: 'Restore Pro' }).click();
    await expect(popup.locator('#license-status')).toHaveText('This license is not active. Check the token or buy Pro on the product site.');
    expect(await popup.evaluate(() => chrome.storage.local.get('sb_license:speak-page-actions'))).toEqual({});
    await context.route('https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=offline-license', (route) => route.abort());
    await popup.getByLabel('Pro license token').fill('offline-license');
    await popup.getByRole('button', { name: 'Restore Pro' }).click();
    await expect(popup.locator('#license-status')).toHaveText('The license could not be checked. Connect to the internet and try again.');
  } finally { await context.close(); }
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
  await expect(facts.nth(2)).toHaveText('Core actions are free; saved command names cost $12 once');
  await expect(page.getByText('Desktop Chrome and Chromium only.')).toBeVisible();
  const heroAction = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
  const heroResult = await page.getByText('Opens four sample controls without changing a real page.').boundingBox();
  expect((heroAction?.y || 999) + (heroAction?.height || 0)).toBeLessThanOrEqual(844);
  expect((heroResult?.y || 999) + (heroResult?.height || 0)).toBeLessThanOrEqual(844);
});

test('@claim:desktop-chromium-only packages a working Chromium extension and directs mobile visitors to the demo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const manifest = JSON.parse(readFileSync('dist/extension/manifest.json', 'utf8'));
  expect(manifest.manifest_version).toBe(3);
  expect(manifest.action.default_title).toContain('Speak Page Actions');
  await expect(page.getByText('Mobile browsers can run the demo but cannot install this extension.')).toBeVisible();
  await page.locator('#install').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Install on desktop Chrome or Chromium' })).toBeVisible();
  await expect(page.locator('#install')).toContainText('chrome://extensions');
  await expect(page.locator('#install')).toContainText('Developer mode');
  await expect(page.locator('#install')).toContainText('Load unpacked');
  await expect(page.getByRole('link', { name: 'Download the desktop extension ZIP' })).toHaveAttribute('download', '');
  const { context, popup } = await extensionPopup();
  try {
    await expect(popup).toHaveTitle('Speak Page Actions — Use visible controls by voice');
    await expect(popup.getByRole('heading', { level: 1, name: 'Say a visible action' })).toBeVisible();
  } finally { await context.close(); }
});

test('browser Back and Forward restore route focus and scroll position', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(800);
  const before = await page.evaluate(() => window.scrollY);
  await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Speak the action you need' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before - 2);
  await page.goForward();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy for your current page' })).toBeFocused();
});

test('demo reset and start for real clear only demo storage and lead to installation', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => { localStorage.setItem('spa:real-setting', 'keep'); localStorage.setItem('sb_license:speak-page-actions', 'keep'); localStorage.setItem('demo:spa:extra', 'remove'); });
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/#install$/);
  await expect(page.getByRole('heading', { name: 'Install on desktop Chrome or Chromium' })).toBeVisible();
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

test('valid routes have no console errors, mobile overflow, dead internal links, or active reduced motion', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const internal = new Set<string>();
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    expect(await page.locator('h1').count(), path).toBe(1);
    expect(await page.locator('main').count(), path).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), path).toBe('auto');
    expect(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length), path).toBe(0);
    for (const href of await page.locator('a[href]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href))) {
      if (new URL(href).origin === 'http://127.0.0.1:4173') internal.add(href);
    }
  }
  for (const href of internal) expect((await request.get(href)).status(), href).toBe(200);
  expect(errors).toEqual([]);
});
