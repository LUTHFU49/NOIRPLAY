import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';

// Tiny .env loader (no extra dependency)
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const { handler } = await import('./backend/index.ts');

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const query = Object.fromEntries(url.searchParams);
  const out = await handler(req.method, url.pathname, query);
  res.writeHead(out.status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(out.data));
}).listen(3001, () => console.log('API running on http://localhost:3001'));
