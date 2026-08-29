import { defineConfig } from 'wxt';

// Chromium only grants activeTab after a toolbar action. Playwright opens the
// popup document directly, so its isolated fixture gets a narrow local host
// permission. Release builds never include this development-only permission.
const testHostPermissions = process.env.SPA_TEST_EXTENSION === '1' ? ['http://127.0.0.1:4173/*'] : [];

export default defineConfig({
  manifest: {
    name: 'Speak Page Actions',
    description: 'Speak a visible page action, then review sensitive clicks.',
    icons: { 128: 'icons/icon-128.png' },
    permissions: ['activeTab', 'scripting', 'storage'],
    host_permissions: ['https://api.sociobot.in/*', ...testHostPermissions],
    action: { default_title: 'Speak Page Actions' },
  },
  srcDir: 'src',
});
