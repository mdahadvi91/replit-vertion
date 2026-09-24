import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://ahadex.online';
const today = new Date().toISOString().split('T')[0];

const staticPaths = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: '/tools', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms', changefreq: 'monthly', priority: '0.5' },
  { path: '/disclaimer', changefreq: 'monthly', priority: '0.5' },
  { path: '/cookie-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/accessibility', changefreq: 'monthly', priority: '0.5' },
];

const categories = ['images', 'documents', 'text', 'developer'];

// Parse tools from src/registry/tool-registry.ts
const registryFile = path.join(rootDir, 'src', 'registry', 'tool-registry.ts');
const registryContent = fs.readFileSync(registryFile, 'utf8');

const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
const slugs = new Set();
let match;
while ((match = slugRegex.exec(registryContent)) !== null) {
  slugs.add(match[1]);
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

function renderUrlEntry(enPath, bnPath, changefreq, priority) {
  const enUrl = `${BASE_URL}${enPath}`;
  const bnUrl = `${BASE_URL}${bnPath}`;

  // EN Entry
  xml += `  <url>\n`;
  xml += `    <loc>${enUrl}</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="bn" href="${bnUrl}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += `    <priority>${priority}</priority>\n`;
  xml += `  </url>\n`;

  // BN Entry
  xml += `  <url>\n`;
  xml += `    <loc>${bnUrl}</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="bn" href="${bnUrl}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += `    <priority>${priority}</priority>\n`;
  xml += `  </url>\n`;
}

// 1. Static Pages (EN + BN)
for (const page of staticPaths) {
  const enPath = page.path || '/';
  const bnPath = page.path ? `/bn${page.path}` : '/bn';
  renderUrlEntry(enPath, bnPath, page.changefreq, page.priority);
}

// 2. Categories (EN + BN)
for (const cat of categories) {
  renderUrlEntry(`/category/${cat}`, `/bn/category/${cat}`, 'weekly', '0.8');
}

// 3. Tools (EN + BN)
for (const slug of slugs) {
  renderUrlEntry(`/tool/${slug}`, `/bn/tool/${slug}`, 'weekly', '0.9');
}

xml += `</urlset>\n`;

const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

const totalUrls = (staticPaths.length + categories.length + slugs.size) * 2;
console.log(`[sitemap] Generated bilingual sitemap with ${totalUrls} crawlable URLs at ${sitemapPath}`);
