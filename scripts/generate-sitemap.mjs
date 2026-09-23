import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve('src/registry/tool-registry.ts'), 'utf8');
const urls = [
  '/', '/tools', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/cookie-policy', '/accessibility',
  ...[...source.matchAll(/route:\s*'([^']+)'/g)].map((match) => match[1]),
  ...['images', 'documents', 'text', 'developer'].map((category) => `/category/${category}`),
];
const unique = [...new Set(urls)];
const today = new Date().toISOString().slice(0, 10);
const body = unique.map((url) => `  <url>\n    <loc>https://ahadex.online${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${url.startsWith('/tool/') ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${url === '/' ? '1.0' : url.startsWith('/tool/') ? '0.9' : '0.7'}</priority>\n  </url>`).join('\n');
fs.writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
console.log(`Sitemap generated (${unique.length} URLs)`);
