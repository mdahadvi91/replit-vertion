import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const registryFile = path.join(rootDir, 'src', 'registry', 'tool-registry.ts');
const registryContent = fs.readFileSync(registryFile, 'utf8');

console.log('[validate] Running registry validation checks...');

let errors = [];

// Extract tool IDs
const idMatches = Array.from(registryContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)).map((m) => m[1]);
const slugMatches = Array.from(registryContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)).map((m) => m[1]);
const routeMatches = Array.from(registryContent.matchAll(/route:\s*['"]([^'"]+)['"]/g)).map((m) => m[1]);

// 1. Check duplicate IDs
const seenIds = new Set();
for (const id of idMatches) {
  if (seenIds.has(id)) {
    errors.push(`Duplicate tool id: "${id}"`);
  }
  seenIds.add(id);
}

// 2. Check duplicate Slugs
const seenSlugs = new Set();
for (const slug of slugMatches) {
  if (seenSlugs.has(slug)) {
    errors.push(`Duplicate tool slug: "${slug}"`);
  }
  seenSlugs.add(slug);
}

// 3. Check route consistency
for (let i = 0; i < slugMatches.length; i++) {
  const expectedRoute = `/tool/${slugMatches[i]}`;
  const actualRoute = routeMatches[i];
  if (actualRoute && actualRoute !== expectedRoute) {
    errors.push(`Route mismatch for slug "${slugMatches[i]}": expected "${expectedRoute}", got "${actualRoute}"`);
  }
}

// 4. Check relatedToolIds
const relatedMatches = Array.from(registryContent.matchAll(/relatedToolIds:\s*\[([^\]]*)\]/g));
for (const match of relatedMatches) {
  const inner = match[1];
  const ids = Array.from(inner.matchAll(/['"]([^'"]+)['"]/g)).map((m) => m[1]);
  for (const relId of ids) {
    if (!seenIds.has(relId)) {
      errors.push(`Invalid relatedToolId: "${relId}" does not exist in tools`);
    }
  }
}

if (errors.length > 0) {
  console.error('[validate] ❌ Validation failed with errors:');
  errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
}

console.log(`[validate] ✓ Validation passed! ${seenIds.size} tools verified with 0 errors.`);
