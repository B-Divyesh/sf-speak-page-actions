import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/site',
  publicDir: resolve(process.cwd(), 'public'),
  build: { outDir: resolve(process.cwd(), 'dist/site'), emptyOutDir: true },
});
