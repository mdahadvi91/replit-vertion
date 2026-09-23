import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://ahadex.online';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/tools', changefreq: 'daily', priority: '0.9' },
  { url: '/about', changefreq: 'monthly', priority: '0.7' },
  { url: '/contact', changefreq: 'monthly', priority: '0.8' },
  { url: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
  { url: '/terms', changefreq: 'monthly', priority: '0.5' },
  { url: '/disclaimer', changefreq: 'monthly', priority: '0.5' },
  { url: '/cookie-policy', changefreq: 'monthly', priority: '0.5' },
  { url: '/accessibility', changefreq: 'monthly', priority: '0.5' },
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
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static pages
for (const page of staticPages) {
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  xml += `    <priority>${page.priority}</priority>\n`;
  xml += `  </url>\n`;
}

// Add categories
for (const cat of categories) {
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/category/${cat}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
}

// Add tools
for (const slug of slugs) {
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/tool/${slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`[sitemap] Generated sitemap with ${staticPages.length + categories.length + slugs.size} URLs at ${sitemapPath}`);
