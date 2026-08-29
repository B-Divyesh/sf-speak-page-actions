import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', testMatch: '*.spec.ts', timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium' },
  webServer: { command: 'SPA_TEST_EXTENSION=1 npm run build:site && npm run preview', port: 4173, reuseExistingServer: !process.env.CI }
});
