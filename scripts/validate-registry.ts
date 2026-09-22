import { categoryList, tools } from '../src/data/tools';

const errors: string[] = [];
const ids = new Set<string>();
const slugs = new Set<string>();
const categories = new Set(categoryList.filter((category) => category !== 'All'));

for (const tool of tools) {
  if (ids.has(tool.id)) errors.push(`Duplicate tool id: ${tool.id}`);
  if (slugs.has(tool.slug)) errors.push(`Duplicate tool slug: ${tool.slug}`);
  ids.add(tool.id);
  slugs.add(tool.slug);
  if (!categories.has(tool.category)) errors.push(`Invalid category for ${tool.id}: ${tool.category}`);
  if (!tool.seo.title || !tool.seo.description || !tool.seo.h1 || !tool.seo.canonical) {
    errors.push(`Missing SEO metadata: ${tool.id}`);
  }
  if (!tool.description || !tool.content.intro) errors.push(`Missing content: ${tool.id}`);
  for (const relatedId of tool.relatedToolIds) {
    if (!tools.some((candidate) => candidate.id === relatedId)) {
      errors.push(`Unknown related tool ${relatedId} referenced by ${tool.id}`);
    }
  }
  if (tool.status === 'live' && !tool.route.startsWith('/tool/')) {
    errors.push(`Live tool has invalid route: ${tool.id}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Registry valid: ${tools.length} tools, ${tools.filter((tool) => tool.status === 'live').length} live.`);