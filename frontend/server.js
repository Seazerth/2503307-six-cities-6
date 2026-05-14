const { createServer } = require('node:http');
const { createReadStream, existsSync, statSync } = require('node:fs');
const { extname, join, normalize } = require('node:path');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = join(process.cwd(), 'public');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

const resolveFilePath = (urlPath) => {
  const requestPath = urlPath === '/' ? '/index.html' : urlPath;
  const normalizedPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(PUBLIC_DIR, normalizedPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  if (!existsSync(filePath)) {
    return null;
  }

  const stats = statSync(filePath);
  return stats.isDirectory() ? join(filePath, 'index.html') : filePath;
};

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || `${HOST}:${PORT}`}`);
  const filePath = resolveFilePath(requestUrl.pathname);

  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const extension = extname(filePath);
  const contentType = MIME_TYPES[extension] || 'application/octet-stream';

  response.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
  createReadStream(filePath).pipe(response);
});

server.listen(PORT, HOST, () => {
  console.log(`Six Cities frontend is available at http://${HOST}:${PORT}`);
});
