import type { ToolDefinition } from '@/registry/tool-registry';

const stopWords = new Set([
  'থেকে', 'তে', 'দিয়ে', 'এর', 'করুন', 'করা', 'বানান', 'হতে', 'ও', 'এবং', 'কীভাবে', 'কি', 'কী',
  'বের', 'চাই', 'করব', 'হবে', 'নিয়ে', 'দিতে', 'যাবে', 'জন্য',
  'to', 'from', 'in', 'and', 'the', 'for', 'a', 'an', 'online', 'free', 'how', 'want'
]);

// Multilingual alias dictionary bridging English and Bengali intent
const aliases: Record<string, string[]> = {
  'pdf': ['পিডিএফ', 'ডকুমেন্ট', 'নথি'],
  'পিডিএফ': ['pdf', 'ডকুমেন্ট', 'নথি'],
  'word': ['ওয়ার্ড', 'docx', 'doc', 'ডক'],
  'ওয়ার্ড': ['word', 'docx', 'doc'],
  'jpg': ['জেপিজি', 'ছবি', 'ফটো', 'jpeg'],
  'jpeg': ['জেপিজি', 'ছবি', 'jpg'],
  'জেপিজি': ['jpg', 'jpeg', 'ছবি'],
  'png': ['পিএনজি', 'ছবি', 'ট্রান্সপারেন্ট'],
  'পিএনজি': ['png', 'ছবি'],
  'image': ['ছবি', 'ইমেজ', 'ফটো'],
  'photo': ['ছবি', 'ইমেজ', 'ফটো'],
  'ছবি': ['image', 'photo', 'picture'],
  'ছবির': ['image', 'photo', 'ছবি'],
  'ইমেজ': ['image', 'photo'],
  'ফটো': ['photo', 'image'],
  'compress': ['কম্প্রেস', 'ছোট', 'সাইজ', 'রিডিউস'],
  'কম্প্রেস': ['compress', 'ছোট', 'সাইজ'],
  'ছোট': ['compress', 'reduce', 'shrink', 'কম্প্রেস', 'সাইজ'],
  'সাইজ': ['size', 'ছোট', 'রিসাইজ', 'compress'],
  'রিসাইজ': ['resize', 'মাপ', 'স্কেল', 'সাইজ'],
  'resize': ['রিসাইজ', 'মাপ'],
  'টেক্সট': ['text', 'লেখা', 'ocr'],
  'text': ['টেক্সট', 'লেখা', 'ocr'],
  'লেখা': ['text', 'ocr', 'টেক্সট'],
  'মার্জ': ['merge', 'জোড়া', 'একত্রিত', 'কম্বাইন'],
  'merge': ['মার্জ', 'জোড়া', 'combine'],
  'স্প্লিট': ['split', 'ভাগ', 'আলাদা', 'কাটা'],
  'split': ['স্প্লিট', 'ভাগ'],
  'ভাগ': ['split', 'আলাদা'],
  'ব্যাকগ্রাউন্ড': ['background', 'bg', 'পেছনের'],
  'background': ['ব্যাকগ্রাউন্ড', 'bg'],
  'পাসওয়ার্ড': ['password', 'পাসওয়ার্ড'],
  'password': ['পাসওয়ার্ড'],
  'রং': ['color', 'কালার'],
  'কালার': ['color', 'রং'],
  'color': ['কালার', 'রং'],
};

export function calculateToolScore(tool: ToolDefinition, query: string, raw?: ToolDefinition): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;

  const searchable = [
    tool.name,
    tool.description,
    tool.category,
    raw?.name ?? '',
    raw?.description ?? '',
    raw?.category ?? '',
    ...(tool.keywords ?? []),
    ...(raw?.keywords ?? []),
    ...(tool.localized?.bn?.keywords ?? []),
    ...(raw?.localized?.bn?.keywords ?? []),
  ]
    .join(' ')
    .toLowerCase();

  // 1. Exact query match in title/name (top priority)
  if (tool.name.toLowerCase() === q || (tool.localized?.bn?.name && tool.localized.bn.name.toLowerCase() === q)) {
    return 1000;
  }

  // 2. Direct substring match of the full query
  if (searchable.includes(q)) {
    return 500;
  }

  // 3. Tokenize query
  const rawTokens = q.split(/\s+/).filter((t) => t.length > 0);
  if (rawTokens.length === 0) return 0;

  const meaningfulTokens = rawTokens.filter((t) => !stopWords.has(t));
  const effectiveTokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  let matchedTokens = 0;
  for (const token of effectiveTokens) {
    if (searchable.includes(token)) {
      matchedTokens++;
      continue;
    }
    const tokenAliases = aliases[token];
    if (tokenAliases && tokenAliases.some((alias) => searchable.includes(alias))) {
      matchedTokens++;
      continue;
    }
    // Prefix match
    if (token.length >= 2) {
      const words = searchable.split(/\s+/);
      if (words.some((w) => w.startsWith(token))) {
        matchedTokens++;
        continue;
      }
    }
  }

  // If all effective tokens matched
  if (matchedTokens === effectiveTokens.length) {
    return 300 + matchedTokens * 20;
  }

  // If at least 2 tokens matched out of multi-word query
  if (effectiveTokens.length >= 3 && matchedTokens >= 2) {
    return 200 + matchedTokens * 20;
  }

  // For 2-word query, if 1 matches strongly
  if (effectiveTokens.length === 2 && matchedTokens === 1 && rawTokens.some((t) => stopWords.has(t))) {
    return 100;
  }

  return 0;
}

export function matchToolQuery(tool: ToolDefinition, query: string, raw?: ToolDefinition): boolean {
  return calculateToolScore(tool, query, raw) > 0;
}
