import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Speak Page Actions',
    description: 'Speak a visible page action, then review sensitive clicks.',
    icons: { 128: 'icons/icon-128.png' },
    permissions: ['activeTab', 'scripting', 'storage'],
    host_permissions: ['https://api.sociobot.in/*'],
    action: { default_title: 'Speak Page Actions' },
  },
  srcDir: 'src',
});
