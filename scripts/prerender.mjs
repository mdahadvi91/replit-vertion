import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('[prerender] dist/ directory not found. Please run vite build first.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
const template = fs.readFileSync(templatePath, 'utf8');

const BASE_URL = 'https://ahadex.online';

// Read tools from registry
const registryFile = path.join(rootDir, 'src', 'registry', 'tool-registry.ts');
const registryContent = fs.readFileSync(registryFile, 'utf8');

// Parse tools metadata
const toolRegex = /id:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*description:\s*['"]([^'"]+)['"],\s*category:\s*['"]([^'"]+)['"]/g;
const tools = [];
let tMatch;
while ((tMatch = toolRegex.exec(registryContent)) !== null) {
  tools.push({
    id: tMatch[1],
    slug: tMatch[2],
    name: tMatch[3],
    description: tMatch[4],
    category: tMatch[5],
  });
}

// Tool SEO titles & descriptions
const toolSeoData = {
  'image-compressor': {
    en: {
      title: 'Image Compressor — Ahadex Tools',
      description: 'Compress JPG, PNG and WebP images in your browser with clear settings, honest limits and a real downloadable result.',
      h1: 'Image Compressor',
    },
    bn: {
      title: 'অনলাইন ইমেজ কম্প্রেসার — Ahadex Tools',
      description: 'আপনার ব্রাউজারে JPG, PNG ও WebP ছবি কম্প্রেস করুন সম্পূর্ণ বিনামূল্যে, নিরাপদে ও লোকাল প্রসেসিংয়ের মাধ্যমে।',
      h1: 'ইমেজ কম্প্রেসার',
    },
  },
  'pdf-to-text': {
    en: {
      title: 'PDF to Text Converter — Ahadex Tools',
      description: 'Extract readable text and paragraphs from PDF documents in your browser. Fast, private, and 100% free.',
      h1: 'PDF to Text Converter',
    },
    bn: {
      title: 'পিডিএফ টু টেক্সট কনভার্টার — Ahadex Tools',
      description: 'ব্রাউজারেই পিডিএফ থেকে টেক্সট বের করুন নিরাপদে ও সম্পূর্ণ বিনামূল্যে। কোনো ফাইল আপলোড প্রয়োজন নেই।',
      h1: 'পিডিএফ টু টেক্সট কনভার্টার',
    },
  },
  'json-formatter': {
    en: {
      title: 'JSON Formatter & Validator — Ahadex Tools',
      description: 'Format, validate, prettify, and minify JSON data online with instant error detection and customizable indentations.',
      h1: 'JSON Formatter & Validator',
    },
    bn: {
      title: 'জেসন ফরম্যাটার ও ভ্যালিডেটর — Ahadex Tools',
      description: 'অনলাইনে JSON কোড ফরম্যাট, ভ্যালিডেট, সাজানো বা মিনিফাই করুন তাৎক্ষণিক ত্রুটি শনাক্তকরণ সহ।',
      h1: 'জেসন ফরম্যাটার ও ভ্যালিডেটর',
    },
  },
  'merge-pdf': {
    en: {
      title: 'Merge PDF Online Free — Ahadex Tools',
      description: 'Combine multiple PDF documents into a single consolidated file in your browser. Fast, secure, and zero installation.',
      h1: 'Merge PDF Documents',
    },
    bn: {
      title: 'অনলাইন পিডিএফ মার্জার — Ahadex Tools',
      description: 'সহজে ও নিরাপদে একাধিক পিডিএফ ফাইল একত্র করুন বিনামূল্যে কোনো সফটওয়্যার ইনস্টল ছাড়াই।',
      h1: 'পিডিএফ ফাইল মার্জ করুন',
    },
  },
  'word-counter': {
    en: {
      title: 'Online Word Counter & Character Counter — Ahadex Tools',
      description: 'Calculate real-time word counts, characters, spaces, sentences, paragraphs, and reading time for articles and essays.',
      h1: 'Online Word & Character Counter',
    },
    bn: {
      title: 'অনলাইন শব্দ ও অক্ষর গণনাকারী — Ahadex Tools',
      description: 'রিয়েল-টাইমে শব্দ, ক্যারেক্টার, বাক্য ও রিডিং টাইম হিসাব করুন বাংলা ও ইংরেজি উভয়ের জন্য।',
      h1: 'অনলাইন ওয়ার্ড কাউন্টার',
    },
  },
  'color-picker': {
    en: {
      title: 'Online Color Picker & Hex to RGB Converter — Ahadex Tools',
      description: 'Interactive HTML/CSS color picker. Convert between HEX, RGB, HSL, and Tailwind CSS classes with instant one-click copying.',
      h1: 'Color Picker & Palette Generator',
    },
    bn: {
      title: 'অনলাইন কালার পিকার ও হেক্স কনভার্টার — Ahadex Tools',
      description: 'ইন্টারেক্টিভ কালার পিকার দিয়ে HEX, RGB, HSL এবং Tailwind CSS কোড সহজেই কপি করুন।',
      h1: 'কালার পিকার ও প্যালেট জেনারেটর',
    },
  },
  'jpg-to-png': {
    en: {
      title: 'Convert JPG to PNG Online Free — Ahadex Tools',
      description: 'Convert JPG/JPEG images to lossless PNG format in seconds. Private browser conversion without file limits.',
      h1: 'JPG to PNG Image Converter',
    },
    bn: {
      title: 'JPG থেকে PNG কনভার্টার — Ahadex Tools',
      description: 'বিনামূল্যে কোনো কোয়ালিটি লস ছাড়া JPG ছবিকে PNG ফরম্যাটে রূপান্তর করুন নিমিষেই।',
      h1: 'JPG থেকে PNG কনভার্টার',
    },
  },
  'image-resizer': {
    en: {
      title: 'Resize Image Dimensions Online Free — Ahadex Tools',
      description: 'Resize JPG, PNG, and WebP images to exact pixel widths and heights with aspect ratio locking and bicubic resampling.',
      h1: 'Image Resizer & Dimension Scaler',
    },
    bn: {
      title: 'অনলাইন ইমেজ রিসাইজার — Ahadex Tools',
      description: 'অনলাইনে JPG, PNG এবং WebP ছবির দৈর্ঘ্য-প্রস্থ সঠিক মাপে রিসাইজ করুন কোনো সফটওয়্যার ছাড়াই।',
      h1: 'অনলাইন ইমেজ রিসাইজার',
    },
  },
  'photo-qr-code': {
    en: {
      title: 'Photo QR Code Generator Online Free — Ahadex Tools',
      description: 'Upload your image and overlay a high-clarity scannable QR code badge for Social links, Website URLs, WhatsApp, WiFi, or Phone numbers in seconds.',
      h1: 'Photo QR Code Generator & Watermark Badge',
    },
    bn: {
      title: 'ফটো কিউআর কোড জেনারেটর — Ahadex Tools',
      description: 'ছবির ওপর সোশ্যাল মিডিয়া, ওয়েবসাইট, হোয়াটসঅ্যাপ বা ওয়াইফাই কিউআর কোড ব্যাজ যুক্ত করুন দ্রুত ও বিনামূল্যে।',
      h1: 'ফটো কিউআর কোড জেনারেটর',
    },
  },
};

const staticPages = {
  '': {
    en: {
      title: 'Ahadex Tools — Free Online Tools',
      description: 'Fast, useful browser tools for images, documents, text and developer tasks. No account required.',
      h1: 'Everyday digital tasks, done in seconds.',
    },
    bn: {
      title: 'ফ্রি অনলাইন ব্রাউজার টুলস — Ahadex Tools',
      description: 'ছবি, ডকুমেন্ট, টেক্সট এবং ডেভেলপারদের জন্য দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস। কোনো সার্ভার আপলোড ছাড়া শতভাগ নিরাপদ।',
      h1: 'কঠিন ও জটিল কাজগুলো এবার হবে নিমেষেই সহজ।',
    },
  },
  tools: {
    en: {
      title: 'Online Tool Library — Ahadex Tools',
      description: 'Handcrafted browser utilities designed to solve everyday tasks instantly. Your files are processed locally in your browser and are not uploaded to servers.',
      h1: 'Smart tools for swift work.',
    },
    bn: {
      title: 'টুলস সংগ্রহশালা — Ahadex Tools',
      description: 'দৈনন্দিন কাজের জন্য তৈরি দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস। আপনার ফাইল নিরাপদে লোকাল ব্রাউজারে প্রসেস হয় এবং সার্ভারে আপলোড করা হয় না।',
      h1: 'সহজ সমাধান, দ্রুত কাজের নিশ্চয়তা।',
    },
  },
  about: {
    en: {
      title: 'About Ahadex Tools',
      description: 'Learn why Ahadex Tools exists and how we build useful, accessible browser utilities.',
      h1: 'The internet has enough complicated helpers.',
    },
    bn: {
      title: 'আমাদের সম্পর্কে — Ahadex Tools',
      description: 'Ahadex Tools কেন তৈরি এবং কীভাবে আমরা নির্ভরযোগ্য ব্রাউজার ইউটিলিটি তৈরি করি তা জানুন।',
      h1: 'ইন্টারনেটে অতিরিক্ত জটিলতার বিপরীতে এক সরল মাধ্যম।',
    },
  },
  contact: {
    en: {
      title: 'Contact Ahadex Tools',
      description: 'Contact Ahadex Tools directly via email or WhatsApp support for assistance, suggestions, or feedback.',
      h1: 'Good tools start with good questions.',
    },
    bn: {
      title: 'যোগাযোগ করুন — Ahadex Tools',
      description: 'সরাসরি ইমেইল বা হোয়াটসঅ্যাপের মাধ্যমে Ahadex Tools টিমের সাথে যোগাযোগ করুন।',
      h1: 'যেকোনো প্রয়োজনে সরাসরি আমাদের সাথে যুক্ত হোন।',
    },
  },
  'privacy-policy': {
    en: {
      title: 'Privacy Policy — Ahadex Tools',
      description: 'Read how Ahadex Tools handles browser preferences, optional analytics and local file processing.',
      h1: 'Privacy policy',
    },
    bn: {
      title: 'গোপনীয়তা নীতি — Ahadex Tools',
      description: 'Ahadex Tools আপনার ডেটা এবং ব্রাউজার ফাইল প্রসেসিং কীভাবে পরিচালনা করে তা পড়ুন।',
      h1: 'গোপনীয়তা নীতি',
    },
  },
  terms: {
    en: {
      title: 'Terms of Use — Ahadex Tools',
      description: 'Read the terms for using Ahadex Tools and its browser-based utilities.',
      h1: 'Terms of use',
    },
    bn: {
      title: 'ব্যবহারের শর্তাবলী — Ahadex Tools',
      description: 'Ahadex Tools ব্যবহারের নিয়মাবলী ও শর্তসমূহ।',
      h1: 'ব্যবহারের শর্তাবলী',
    },
  },
  disclaimer: {
    en: {
      title: 'Disclaimer — Ahadex Tools',
      description: 'Important information about Ahadex Tools outputs, limitations and responsible use.',
      h1: 'Disclaimer',
    },
    bn: {
      title: 'দাবিত্যাগ — Ahadex Tools',
      description: 'Ahadex Tools ব্যবহারের ফলাফল ও দায়মুক্তি সম্পর্কিত তথ্য।',
      h1: 'দাবিত্যাগ',
    },
  },
  'cookie-policy': {
    en: {
      title: 'Cookie Policy — Ahadex Tools',
      description: 'Learn which essential storage Ahadex Tools uses and how optional measurement consent works.',
      h1: 'Cookie policy',
    },
    bn: {
      title: 'কুকি নীতি — Ahadex Tools',
      description: 'Ahadex Tools এর স্টোরেজ ও কুকি ব্যবহারের নিয়মাবলী।',
      h1: 'কুকি নীতি',
    },
  },
  accessibility: {
    en: {
      title: 'Accessibility — Ahadex Tools',
      description: 'Learn about Ahadex Tools accessibility goals, keyboard support and reduced motion options.',
      h1: 'Accessibility',
    },
    bn: {
      title: 'অ্যাক্সেসিবিলিটি — Ahadex Tools',
      description: 'Ahadex Tools এর কীবোর্ড ও রিডিউসড-মোশন অ্যাক্সেসিবিলিটি তথ্য।',
      h1: 'অ্যাক্সেসিবিলিটি',
    },
  },
};

const categories = {
  images: {
    en: { title: 'Images Tools — Ahadex Tools', description: 'Browse useful image tools from Ahadex Tools.', h1: 'Images Tools' },
    bn: { title: 'ছবি (Images) টুলস — Ahadex Tools', description: 'Ahadex Tools এর সব ছবি ও ইমেজ টুলস দেখুন।', h1: 'ছবি (Images) টুলস' },
  },
  documents: {
    en: { title: 'Documents Tools — Ahadex Tools', description: 'Browse useful documents tools from Ahadex Tools.', h1: 'Documents Tools' },
    bn: { title: 'ডকুমেন্ট (Documents) টুলস — Ahadex Tools', description: 'Ahadex Tools এর সব ডকুমেন্ট ও পিডিএফ টুলস দেখুন।', h1: 'ডকুমেন্ট (Documents) টুলস' },
  },
  text: {
    en: { title: 'Text Tools — Ahadex Tools', description: 'Browse useful text tools from Ahadex Tools.', h1: 'Text Tools' },
    bn: { title: 'টেক্সট (Text) টুলস — Ahadex Tools', description: 'Ahadex Tools এর সব টেক্সট ও লেখার টুলস দেখুন।', h1: 'টেক্সট (Text) টুলস' },
  },
  developer: {
    en: { title: 'Developer Tools — Ahadex Tools', description: 'Browse useful developer tools from Ahadex Tools.', h1: 'Developer Tools' },
    bn: { title: 'ডেভেলপার (Developer) টুলস — Ahadex Tools', description: 'Ahadex Tools এর সব ডেভেলপার ও কোডিং টুলস দেখুন।', h1: 'ডেভেলপার (Developer) টুলস' },
  },
};

function generateHtml({
  lang,
  title,
  description,
  canonicalUrl,
  alternateEnUrl,
  alternateBnUrl,
  alternateDefaultUrl,
  h1,
  schema,
  is404 = false,
}) {
  let html = template;

  // Language attribute
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);

  // Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  // Description
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${description}" />`
  );

  // Robots
  const robotsDirective = is404 ? 'noindex, nofollow' : 'index, follow';
  html = html.replace(
    /<meta name="robots" content="[^"]*"/,
    `<meta name="robots" content="${robotsDirective}"`
  );
  html = html.replace(
    /<meta name="googlebot" content="[^"]*"/,
    `<meta name="googlebot" content="${robotsDirective}"`
  );

  // Canonical & Alternates
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />\n` +
    `    <link rel="alternate" hreflang="en" href="${alternateEnUrl}" />\n` +
    `    <link rel="alternate" hreflang="bn" href="${alternateBnUrl}" />\n` +
    `    <link rel="alternate" hreflang="x-default" href="${alternateDefaultUrl}" />`;
  html = html.replace(/<link rel="canonical"[^>]*>/, canonicalTag);

  // OpenGraph Tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${title}"`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${canonicalUrl}"`
  );
  html = html.replace(
    /<meta property="og:locale" content="[^"]*"/,
    `<meta property="og:locale" content="${lang === 'bn' ? 'bn_BD' : 'en_US'}"`
  );

  // Twitter Cards
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${title}"`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:description" content="${description}" />`
  );

  // Schema.org JSON-LD
  if (schema) {
    const jsonLdTag = `\n    <script type="application/ld+json" id="ahadex-jsonld">${JSON.stringify(schema)}</script>\n  </head>`;
    html = html.replace('</head>', jsonLdTag);
  }

  // Initial SSR skeleton inside <div id="root">
  const initialContent = `
    <header class="site-header" style="opacity: 0.9;">
      <div class="container nav-inner">
        <a href="${lang === 'bn' ? '/bn' : '/'}" class="brand">
          <span class="brand-mark">⚡</span>
          <span>Ahadex <span style="color: #14b8a6;">Tools</span></span>
        </a>
        <nav class="nav-links">
          <a href="${lang === 'bn' ? '/bn' : '/'}" class="nav-link">${lang === 'bn' ? 'হোম' : 'Home'}</a>
          <a href="${lang === 'bn' ? '/bn/tools' : '/tools'}" class="nav-link">${lang === 'bn' ? 'টুলস' : 'Tools'}</a>
          <a href="${lang === 'bn' ? '/bn/about' : '/about'}" class="nav-link">${lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About'}</a>
          <a href="${lang === 'bn' ? '/bn/contact' : '/contact'}" class="nav-link">${lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</a>
        </nav>
      </div>
    </header>
    <main class="page-content">
      <div class="container" style="padding: 40px 20px;">
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 12px;">${h1 || title}</h1>
        <p style="font-size: 1.1rem; color: #94a3b8; max-width: 680px; line-height: 1.6;">${description}</p>
      </div>
    </main>
  `;
  html = html.replace('<div id="root"></div>', `<div id="root">${initialContent}</div>`);

  return html;
}

function writePage(relPath, content) {
  const targetPath = path.join(distDir, relPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
}

console.log('[prerender] Generating static HTML pages with full SEO metadata...');
let generatedCount = 0;

// 1. Static pages (Home, Tools, About, Contact, Legal) in EN & BN
for (const [key, data] of Object.entries(staticPages)) {
  for (const lang of ['en', 'bn']) {
    const isBn = lang === 'bn';
    const enRelPath = key ? `${key}` : '';
    const relUrl = isBn ? (enRelPath ? `/bn/${enRelPath}` : '/bn') : (enRelPath ? `/${enRelPath}` : '/');

    const canonicalUrl = `${BASE_URL}${relUrl}`;
    const alternateEnUrl = `${BASE_URL}${enRelPath ? `/${enRelPath}` : '/'}`;
    const alternateBnUrl = `${BASE_URL}${enRelPath ? `/bn/${enRelPath}` : '/bn'}`;
    const alternateDefaultUrl = alternateEnUrl;

    const pageMeta = data[lang];
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ahadex Tools',
      url: BASE_URL,
      description: pageMeta.description,
      inLanguage: isBn ? 'bn-BD' : 'en-US',
    };

    const html = generateHtml({
      lang,
      title: pageMeta.title,
      description: pageMeta.description,
      canonicalUrl,
      alternateEnUrl,
      alternateBnUrl,
      alternateDefaultUrl,
      h1: pageMeta.h1,
      schema,
    });

    const fileRel = isBn
      ? (key ? path.join('bn', key, 'index.html') : path.join('bn', 'index.html'))
      : (key ? path.join(key, 'index.html') : 'index.html');

    writePage(fileRel, html);
    generatedCount++;
  }
}

// 2. Categories in EN & BN
for (const [catKey, data] of Object.entries(categories)) {
  for (const lang of ['en', 'bn']) {
    const isBn = lang === 'bn';
    const enRelPath = `category/${catKey}`;
    const relUrl = isBn ? `/bn/${enRelPath}` : `/${enRelPath}`;

    const canonicalUrl = `${BASE_URL}${relUrl}`;
    const alternateEnUrl = `${BASE_URL}/${enRelPath}`;
    const alternateBnUrl = `${BASE_URL}/bn/${enRelPath}`;
    const alternateDefaultUrl = alternateEnUrl;

    const catMeta = data[lang];
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: catMeta.title,
      url: canonicalUrl,
      description: catMeta.description,
      inLanguage: isBn ? 'bn-BD' : 'en-US',
      isPartOf: { '@type': 'WebSite', name: 'Ahadex Tools', url: BASE_URL },
    };

    const html = generateHtml({
      lang,
      title: catMeta.title,
      description: catMeta.description,
      canonicalUrl,
      alternateEnUrl,
      alternateBnUrl,
      alternateDefaultUrl,
      h1: catMeta.h1,
      schema,
    });

    const fileRel = isBn
      ? path.join('bn', 'category', catKey, 'index.html')
      : path.join('category', catKey, 'index.html');

    writePage(fileRel, html);
    generatedCount++;
  }
}

// 3. All 9 tools in EN & BN
for (const tool of tools) {
  const seo = toolSeoData[tool.slug] || {
    en: { title: `${tool.name} — Ahadex Tools`, description: tool.description, h1: tool.name },
    bn: { title: `${tool.name} — Ahadex Tools`, description: tool.description, h1: tool.name },
  };

  for (const lang of ['en', 'bn']) {
    const isBn = lang === 'bn';
    const enRelPath = `tool/${tool.slug}`;
    const relUrl = isBn ? `/bn/${enRelPath}` : `/${enRelPath}`;

    const canonicalUrl = `${BASE_URL}${relUrl}`;
    const alternateEnUrl = `${BASE_URL}/${enRelPath}`;
    const alternateBnUrl = `${BASE_URL}/bn/${enRelPath}`;
    const alternateDefaultUrl = alternateEnUrl;

    const toolMeta = seo[lang];
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: lang === 'bn' ? (toolSeoData[tool.slug]?.bn.h1 || tool.name) : tool.name,
      url: canonicalUrl,
      description: toolMeta.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      inLanguage: isBn ? 'bn-BD' : 'en-US',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      isPartOf: { '@type': 'WebSite', name: 'Ahadex Tools', url: BASE_URL },
    };

    const html = generateHtml({
      lang,
      title: toolMeta.title,
      description: toolMeta.description,
      canonicalUrl,
      alternateEnUrl,
      alternateBnUrl,
      alternateDefaultUrl,
      h1: toolMeta.h1,
      schema,
    });

    const fileRel = isBn
      ? path.join('bn', 'tool', tool.slug, 'index.html')
      : path.join('tool', tool.slug, 'index.html');

    writePage(fileRel, html);
    generatedCount++;
  }
}

console.log(`[prerender] ✓ Successfully generated ${generatedCount} static HTML routes with complete metadata & JSON-LD!`);
