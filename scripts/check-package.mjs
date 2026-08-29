import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const archive = 'dist/site/downloads/speak-page-actions.zip';
if (!existsSync(archive)) throw new Error(`Missing consumer download: ${archive}`);
const files = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' }).split('\n');
if (!files.includes('manifest.json')) throw new Error('The extension archive has no manifest.json.');
const manifest = JSON.parse(execFileSync('unzip', ['-p', archive, 'manifest.json'], { encoding: 'utf8' }));
if (manifest.manifest_version !== 3 || manifest.name !== 'Speak Page Actions') throw new Error('The consumer archive is not the expected MV3 extension.');
if (manifest.content_scripts?.length) throw new Error('The package must not inject a content script on every page.');
if (manifest.host_permissions?.some((permission) => permission === '<all_urls>')) throw new Error('The package must not request all-site host permission.');
if (!readFileSync(archive)) throw new Error('The download archive is empty.');
const staticConfig = JSON.parse(readFileSync('dist/site/staticwebapp.config.json', 'utf8'));
if (staticConfig.navigationFallback) throw new Error('A navigation fallback would turn unknown URLs into HTTP 200 responses.');
for (const route of ['/', '/demo', '/privacy', '/terms']) {
  if (!staticConfig.routes?.some((entry) => entry.route === route && entry.rewrite === '/index.html')) throw new Error(`Missing SPA rewrite for ${route}.`);
}
if (staticConfig.responseOverrides?.['404']?.rewrite !== '/404.html') throw new Error('Missing static 404 response override.');
if (!existsSync('dist/site/404.html')) throw new Error('Missing styled static 404 page.');
console.log(`Consumer package verified: ${archive}`);
