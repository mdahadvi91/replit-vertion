import fs from 'node:fs';
import path from 'node:path';
import { categoryList, tools } from '../src/data/tools.ts';

const SITE_URL = 'https://ahadex.online';
const today = new Date().toISOString().split('T')[0];

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

const staticPages: Array<{ path: string; changefreq: SitemapUrl['changefreq']; priority: string }> = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/tools', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms', changefreq: 'monthly', priority: '0.5' },
  { path: '/disclaimer', changefreq: 'monthly', priority: '0.5' },
  { path: '/cookie-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/accessibility', changefreq: 'monthly', priority: '0.5' },
];

const urls: SitemapUrl[] = [];

// 1. Static pages
for (const page of staticPages) {
  urls.push({
    loc: `${SITE_URL}${page.path === '/' ? '/' : page.path}`,
    lastmod: today,
    changefreq: page.changefreq,
    priority: page.priority,
  });
}

// 2. Categories
for (const category of categoryList) {
  if (category === 'All') continue;
  urls.push({
    loc: `${SITE_URL}/category/${category.toLowerCase()}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
  });
}

// 3. Tool routes
for (const tool of tools) {
  urls.push({
    loc: `${SITE_URL}${tool.route}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: tool.status === 'live' ? '0.9' : '0.7',
  });
}

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const publicPath = path.resolve(process.cwd(), 'public/sitemap.xml');
fs.writeFileSync(publicPath, sitemapContent, 'utf-8');
console.log(`[sitemap] Wrote ${urls.length} URLs to ${publicPath}`);

const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  const distPath = path.resolve(distDir, 'sitemap.xml');
  fs.writeFileSync(distPath, sitemapContent, 'utf-8');
  console.log(`[sitemap] Wrote ${urls.length} URLs to ${distPath}`);
}
