import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('dist/site');
const port = Number(process.env.PORT || 4173);
const appRoutes = new Set(['/', '/demo', '/privacy', '/terms']);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.zip': 'application/zip',
};

function sendFile(response, file, status = 200) {
  response.writeHead(status, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(response);
}

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  if (appRoutes.has(pathname)) return sendFile(response, join(root, 'index.html'));

  const relative = normalize(pathname).replace(/^[/\\]+/, '');
  const file = resolve(root, relative);
  if (file.startsWith(`${root}/`) && existsSync(file) && statSync(file).isFile()) return sendFile(response, file);
  return sendFile(response, join(root, '404.html'), 404);
}).listen(port, '127.0.0.1', () => {
  console.log(`Production site preview: http://127.0.0.1:${port}`);
});
