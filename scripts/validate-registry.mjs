import fs from 'node:fs';
import path from 'node:path';

const registry = fs.readFileSync(path.resolve('src/registry/tool-registry.ts'), 'utf8');
const required = ['id:', 'slug:', 'route:', 'browserProcessing:', 'seo:', 'content:', 'relatedToolIds:'];
const missing = required.filter((token) => !registry.includes(token));
if (missing.length) throw new Error(`Registry validation failed: missing ${missing.join(', ')}`);
const slugs = [...registry.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
if (new Set(slugs).size !== slugs.length) throw new Error('Registry validation failed: duplicate tool slug');
console.log(`Registry valid (${slugs.length} tools)`);
