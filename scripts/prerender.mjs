import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_URL, categories, toolsData, staticPages } from './prerender-data.mjs';

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

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Global Nav & Footer Generators
function renderHeader(lang) {
  const isBn = lang === 'bn';
  const homeUrl = isBn ? '/bn' : '/';
  const toolsUrl = isBn ? '/bn/tools' : '/tools';
  const aboutUrl = isBn ? '/bn/about' : '/about';
  const contactUrl = isBn ? '/bn/contact' : '/contact';

  return `
    <header class="site-header" style="position: sticky; top: 0; z-index: 50; backdrop-filter: blur(12px); background: rgba(9, 13, 22, 0.85); border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
      <div class="container nav-inner" style="max-width: 1200px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;">
        <a href="${homeUrl}" class="brand" style="display: flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 800; font-size: 1.25rem; color: #f8fafc;">
          <span class="brand-mark" style="background: linear-gradient(135deg, #14b8a6, #0d9488); color: #042f2e; width: 30px; height: 30px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900;">⚡</span>
          <span>Ahadex <span style="color: #14b8a6;">Tools</span></span>
        </a>
        <nav class="nav-links" style="display: flex; align-items: center; gap: 20px;">
          <a href="${homeUrl}" style="color: #cbd5e1; text-decoration: none; font-size: 0.95rem; font-weight: 500;">${isBn ? 'হোম' : 'Home'}</a>
          <a href="${toolsUrl}" style="color: #cbd5e1; text-decoration: none; font-size: 0.95rem; font-weight: 500;">${isBn ? 'টুলস' : 'Tools'}</a>
          <a href="${aboutUrl}" style="color: #cbd5e1; text-decoration: none; font-size: 0.95rem; font-weight: 500;">${isBn ? 'আমাদের সম্পর্কে' : 'About'}</a>
          <a href="${contactUrl}" style="color: #cbd5e1; text-decoration: none; font-size: 0.95rem; font-weight: 500;">${isBn ? 'যোগাযোগ' : 'Contact'}</a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter(lang) {
  const isBn = lang === 'bn';
  const homeUrl = isBn ? '/bn' : '/';
  const toolsUrl = isBn ? '/bn/tools' : '/tools';
  const aboutUrl = isBn ? '/bn/about' : '/about';
  const contactUrl = isBn ? '/bn/contact' : '/contact';
  const privacyUrl = isBn ? '/bn/privacy-policy' : '/privacy-policy';
  const termsUrl = isBn ? '/bn/terms' : '/terms';
  const disclaimerUrl = isBn ? '/bn/disclaimer' : '/disclaimer';
  const cookieUrl = isBn ? '/bn/cookie-policy' : '/cookie-policy';
  const a11yUrl = isBn ? '/bn/accessibility' : '/accessibility';

  return `
    <footer class="site-footer" style="background: #090d16; border-top: 1px solid rgba(255, 255, 255, 0.08); padding: 56px 20px 32px; color: #94a3b8; font-size: 0.9rem; margin-top: 64px;">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 36px;">
        <div>
          <a href="${homeUrl}" style="display: flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 800; font-size: 1.15rem; color: #f8fafc; margin-bottom: 14px;">
            <span style="background: #14b8a6; color: #042f2e; width: 26px; height: 26px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px;">⚡</span>
            <span>Ahadex <span style="color: #14b8a6;">Tools</span></span>
          </a>
          <p style="line-height: 1.6; margin-bottom: 16px; color: #64748b;">
            ${isBn ? 'ছবি, ডকুমেন্ট, টেক্সট এবং ডেভেলপারদের জন্য দ্রুত ও নির্ভরযোগ্য অনলাইন ব্রাউজার টুলস। কোনো সার্ভার আপলোড ছাড়া শতভাগ নিরাপদ।' : 'Fast, private, in-browser digital tools for everyday tasks. Zero accounts, no tracking, and 100% client-side privacy.'}
          </p>
        </div>
        <div>
          <h4 style="color: #f1f5f9; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">${isBn ? 'টুলস ক্যাটালগ' : 'Explore Tools'}</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flexDirection: column; gap: 10px;">
            <li><a href="${isBn ? '/bn/tool/pdf-to-text' : '/tool/pdf-to-text'}" style="color: #94a3b8; text-decoration: none;">PDF to Text</a></li>
            <li><a href="${isBn ? '/bn/tool/image-compressor' : '/tool/image-compressor'}" style="color: #94a3b8; text-decoration: none;">Image Compressor</a></li>
            <li><a href="${isBn ? '/bn/tool/merge-pdf' : '/tool/merge-pdf'}" style="color: #94a3b8; text-decoration: none;">Merge PDF</a></li>
            <li><a href="${isBn ? '/bn/tool/json-formatter' : '/tool/json-formatter'}" style="color: #94a3b8; text-decoration: none;">JSON Formatter</a></li>
            <li><a href="${isBn ? '/bn/tool/photo-qr-code' : '/tool/photo-qr-code'}" style="color: #94a3b8; text-decoration: none;">Photo QR Code</a></li>
            <li><a href="${toolsUrl}" style="color: #14b8a6; text-decoration: none; font-weight: 600;">${isBn ? 'সব টুলস দেখুন →' : 'View All Tools →'}</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color: #f1f5f9; font-size: 0.95rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">${isBn ? 'কোম্পানি ও সহায়তা' : 'Company & Trust'}</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flexDirection: column; gap: 10px;">
            <li><a href="${aboutUrl}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'আমাদের সম্পর্কে' : 'About Ahadex Tools'}</a></li>
            <li><a href="${contactUrl}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'যোগাযোগ করুন' : 'Contact Support'}</a></li>
            <li><a href="${privacyUrl}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</a></li>
            <li><a href="${termsUrl}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms of Use'}</a></li>
            <li><a href="${disclaimerUrl}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'দাবিত্যাগ' : 'Disclaimer'}</a></li>
            <li><a href="${cookieUrl}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'কুকি নীতি' : 'Cookie Policy'}</a></li>
            <li><a href="${a11yUrl}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'অ্যাক্সেসিবিলিটি' : 'Accessibility'}</a></li>
          </ul>
        </div>
      </div>
      <div style="max-width: 1200px; margin: 40px auto 0; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; color: #64748b; font-size: 0.85rem;">
        &copy; ${new Date().getFullYear()} Ahadex Tools. ${isBn ? 'সর্বস্বত্ব সংরক্ষিত। লোকাল প্রসেসিং দ্বারা সুরক্ষিত।' : 'All rights reserved. 100% in-browser processing.'}
      </div>
    </footer>
  `;
}

// Prerender HTML Assembler
function generateHtml({
  lang,
  title,
  description,
  canonicalUrl,
  alternateEnUrl,
  alternateBnUrl,
  alternateDefaultUrl,
  schema,
  is404 = false,
  bodyContent,
}) {
  let html = template;

  // Language attribute
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);

  // Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

  // Description
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
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

  // Canonical & Multilingual Alternates
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />\n` +
    `    <link rel="alternate" hreflang="en" href="${alternateEnUrl}" />\n` +
    `    <link rel="alternate" hreflang="bn" href="${alternateBnUrl}" />\n` +
    `    <link rel="alternate" hreflang="x-default" href="${alternateDefaultUrl}" />`;
  html = html.replace(/<link rel="canonical"[^>]*>/, canonicalTag);

  // OpenGraph Tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(title)}"`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
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
    `<meta name="twitter:title" content="${escapeHtml(title)}"`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );

  // Schema.org JSON-LD
  if (schema) {
    const jsonLdTag = `\n    <script type="application/ld+json" id="ahadex-jsonld">${JSON.stringify(schema)}</script>\n  </head>`;
    html = html.replace('</head>', jsonLdTag);
  }

  // Complete Prerendered Body Content inside <div id="root">
  const fullHtmlContent = `
    ${renderHeader(lang)}
    <main class="page-content" style="min-height: 70vh;">
      ${bodyContent}
    </main>
    ${renderFooter(lang)}
  `;

  html = html.replace('<div id="root"></div>', `<div id="root">${fullHtmlContent}</div>`);

  return html;
}

function writePage(relPath, content) {
  const targetPath = path.join(distDir, relPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
}

console.log('[prerender] Starting high-fidelity static HTML generation for all routes...');
let generatedCount = 0;

// =========================================================================
// 1. TOOL PAGES PRERENDERING (All 9 tools in EN & BN)
// =========================================================================
for (const rawTool of toolsData) {
  for (const lang of ['en', 'bn']) {
    const isBn = lang === 'bn';
    const tool = rawTool[lang];
    const categoryInfo = categories[rawTool.category];
    const categoryTitle = categoryInfo ? categoryInfo[lang].h1 : rawTool.categoryName;
    const categoryUrl = isBn ? `/bn/category/${rawTool.category}` : `/category/${rawTool.category}`;

    const enRelPath = `tool/${rawTool.slug}`;
    const relUrl = isBn ? `/bn/${enRelPath}` : `/${enRelPath}`;
    const canonicalUrl = `${BASE_URL}${relUrl}`;
    const alternateEnUrl = `${BASE_URL}/${enRelPath}`;
    const alternateBnUrl = `${BASE_URL}/bn/${enRelPath}`;
    const alternateDefaultUrl = alternateEnUrl;

    // Related tools lookup
    const relatedCardsHtml = (tool.relatedSlugs || [])
      .map((relSlug) => {
        const relTool = toolsData.find((t) => t.slug === relSlug);
        if (!relTool) return '';
        const relData = relTool[lang];
        const link = isBn ? `/bn/tool/${relSlug}` : `/tool/${relSlug}`;
        return `
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; transition: border-color 0.2s;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #14b8a6; background: rgba(20, 184, 166, 0.1); padding: 3px 8px; border-radius: 6px;">${relTool.categoryName}</span>
              <span style="font-size: 0.75rem; color: #64748b;">${isBn ? 'ফ্রি' : 'Free'}</span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 8px;">
              <a href="${link}" style="color: #f1f5f9; text-decoration: none;">${relData.name}</a>
            </h3>
            <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 14px;">${relData.description}</p>
            <a href="${link}" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #14b8a6; font-weight: 600; text-decoration: none;">
              ${isBn ? 'টুলটি ব্যবহার করুন →' : 'Open Tool →'}
            </a>
          </div>
        `;
      })
      .join('');

    // How-to-use step list
    const stepsHtml = (tool.howToUse || [])
      .map((step, idx) => `
        <li style="display: flex; gap: 14px; margin-bottom: 16px; align-items: flex-start;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: rgba(20, 184, 166, 0.15); color: #14b8a6; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; margin-top: 2px;">0${idx + 1}</span>
          <span style="font-size: 0.95rem; line-height: 1.6; color: #cbd5e1;">${escapeHtml(step)}</span>
        </li>
      `)
      .join('');

    // FAQ list
    const faqListHtml = (tool.faq || [])
      .map((faq) => `
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 18px 20px; margin-bottom: 12px;">
          <h3 style="font-size: 1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="color: #14b8a6;">Q.</span> ${escapeHtml(faq.question)}
          </h3>
          <p style="font-size: 0.9rem; line-height: 1.6; color: #94a3b8; margin: 0; padding-left: 24px;">
            ${escapeHtml(faq.answer)}
          </p>
        </div>
      `)
      .join('');

    // Breadcrumbs
    const homeText = isBn ? 'হোম' : 'Home';
    const toolsText = isBn ? 'টুলস' : 'Tools';
    const breadcrumbHtml = `
      <nav aria-label="Breadcrumbs" style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b; margin-bottom: 24px;">
        <a href="${isBn ? '/bn' : '/'}" style="color: #94a3b8; text-decoration: none;">${homeText}</a>
        <span>/</span>
        <a href="${isBn ? '/bn/tools' : '/tools'}" style="color: #94a3b8; text-decoration: none;">${toolsText}</a>
        <span>/</span>
        <a href="${categoryUrl}" style="color: #94a3b8; text-decoration: none;">${categoryTitle}</a>
        <span>/</span>
        <span style="color: #14b8a6; font-weight: 600;">${tool.name}</span>
      </nav>
    `;

    // Tool Workspace Representation
    const workspaceMockHtml = `
      <section class="tool-workspace-prerender" style="display: grid; grid-template-columns: minmax(280px, 340px) 1fr; gap: 24px; margin-bottom: 48px; background: rgba(17, 23, 38, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 24px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);">
        <!-- Sidebar Controls -->
        <aside style="display: flex; flex-direction: column; gap: 18px; border-right: 1px solid rgba(255, 255, 255, 0.06); padding-right: 20px;">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #14b8a6; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">
              ${isBn ? '১. কনফিগারেশন সেটিংস' : '1. Configuration Settings'}
            </span>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 0; line-height: 1.5;">
              ${isBn ? 'আপনার প্রয়োজন অনুযায়ী অপশন ও প্রসেসিং কোয়ালিটি নির্বাচন করুন।' : 'Fine-tune quality, format, and processing settings for optimal results.'}
            </p>
          </div>

          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 14px;">
            <strong style="display: block; font-size: 0.85rem; color: #f1f5f9; margin-bottom: 6px;">
              ${isBn ? 'লোকাল মেমরি এক্সিকিউশন' : 'In-Browser Execution'}
            </strong>
            <span style="font-size: 0.8rem; color: #64748b; line-height: 1.4; display: block;">
              ${isBn ? 'WebAssembly ও Canvas ইঞ্জিনের মাধ্যমে কোনো সার্ভার কল ছাড়াই সরাসরি কার্যকর হয়।' : 'Runs via modern WebAssembly and Canvas APIs with zero server latency.'}
            </span>
          </div>

          <!-- Privacy Guarantee Box -->
          <div style="background: rgba(20, 184, 166, 0.06); border: 1px solid rgba(20, 184, 166, 0.2); border-radius: 12px; padding: 14px; margin-top: auto;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="color: #14b8a6; font-size: 1rem;">✓</span>
              <strong style="font-size: 0.85rem; color: #14b8a6;">
                ${isBn ? '১০০% ক্লায়েন্ট-সাইড নিরাপদ' : '100% Client-Side Private'}
              </strong>
            </div>
            <p style="font-size: 0.78rem; color: #94a3b8; line-height: 1.45; margin: 0;">
              ${isBn ? 'আপনার ফাইল কোনো সার্ভারে আপলোড হয় না। ব্রাউজার মেমরিতে সম্পূর্ণ প্রক্রিয়া সম্পন্ন হয়।' : 'Sensitive documents never leave your browser. All parsing executes in client memory without uploading files to any server.'}
            </p>
          </div>
        </aside>

        <!-- Main Workspace Interaction Zone -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Drop Target Box -->
          <div style="border: 2px dashed rgba(20, 184, 166, 0.35); background: rgba(20, 184, 166, 0.03); border-radius: 16px; padding: 48px 24px; text-align: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(20, 184, 166, 0.12); color: #14b8a6; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 22px;">
              ⚡
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px;">
              ${isBn ? 'আপনার ফাইল সিলেক্ট বা ড্র্যাগ করুন' : 'Select or Drag & Drop File Here'}
            </h3>
            <p style="font-size: 0.88rem; color: #94a3b8; max-width: 440px; margin: 0 auto 20px; line-height: 1.5;">
              ${tool.intro}
            </p>
            <div style="display: inline-flex; align-items: center; gap: 10px; background: #14b8a6; color: #042f2e; font-weight: 700; font-size: 0.9rem; padding: 10px 22px; border-radius: 10px; cursor: pointer;">
              <span>${isBn ? 'ফাইল নির্বাচন করুন' : 'Choose File to Start'}</span>
            </div>
          </div>
        </div>
      </section>
    `;

    // Complete Tool Page Body Content
    const bodyContent = `
      <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 40px 20px;">
        ${breadcrumbHtml}

        <!-- Hero Header -->
        <header style="margin-bottom: 36px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
            <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #14b8a6; background: rgba(20, 184, 166, 0.12); border: 1px solid rgba(20, 184, 166, 0.25); padding: 4px 10px; border-radius: 999px;">
              ${categoryTitle}
            </span>
            <span style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; background: rgba(255, 255, 255, 0.05); padding: 4px 10px; border-radius: 999px;">
              ${isBn ? '১০০% ফ্রি অনলাইন' : '100% Free Online'}
            </span>
            <span style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; background: rgba(255, 255, 255, 0.05); padding: 4px 10px; border-radius: 999px;">
              ${isBn ? 'কোনো সার্ভার আপলোড নেই' : 'Zero Server Uploads'}
            </span>
          </div>

          <h1 style="font-size: 2.3rem; font-weight: 800; color: #f8fafc; margin-bottom: 14px; letter-spacing: -0.02em;">
            ${tool.h1 || tool.name}
          </h1>
          <p style="font-size: 1.15rem; color: #94a3b8; line-height: 1.6; max-width: 820px; margin: 0;">
            ${tool.description}
          </p>
        </header>

        <!-- Interactive Workspace Mockup (Full representation before JS hydration) -->
        ${workspaceMockHtml}

        <!-- Step-by-Step Guide Section -->
        <section style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 32px 28px; margin-bottom: 40px;">
          <h2 style="font-size: 1.45rem; font-weight: 800; color: #f1f5f9; margin-bottom: 20px;">
            ${isBn ? 'কীভাবে এই টুলটি ব্যবহার করবেন (সম্পূর্ণ গাইড)' : `How to Use ${tool.name} (Step-by-Step Guide)`}
          </h2>
          <ol style="list-style: none; padding: 0; margin: 0;">
            ${stepsHtml}
          </ol>
        </section>

        <!-- About this Tool & Tech Details -->
        <section style="margin-bottom: 44px;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #f1f5f9; margin-bottom: 14px;">
            ${isBn ? 'টুলটি কীভাবে কাজ করে ও মূল বৈশিষ্ট্য' : `How ${tool.name} Works & Key Features`}
          </h2>
          <div style="font-size: 1rem; line-height: 1.7; color: #cbd5e1; display: flex; flex-direction: column; gap: 14px;">
            <p>${tool.intro}</p>
            <p>
              ${isBn ? 'এই টুলটি সম্পূর্ণ ক্লায়েন্ট-সাইড আর্কিটেকচারে তৈরি। আপনার ডিভাইস থেকে কোনো ফাইল কোনো তৃতীয় পক্ষ বা রিমোট সার্ভারে প্রেরিত হয় না। ব্রাউজার মেমরিতে উচ্চমানের পারফরম্যান্স বজায় রেখে তাৎক্ষণিকভাবে ফলাফল পাওয়া যায়।' : 'Built on a client-side first architecture, your documents and images are never transmitted across the network to third-party endpoints. All parsing, processing, and generation occur within your browser thread, eliminating upload waiting times while giving you complete privacy.'}
            </p>
          </div>
        </section>

        <!-- Privacy & Limitations -->
        <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 48px;">
          <div style="background: rgba(20, 184, 166, 0.04); border: 1px solid rgba(20, 184, 166, 0.15); border-radius: 14px; padding: 22px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #14b8a6; margin-bottom: 10px;">
              ${isBn ? 'গোপনীয়তা নিশ্চয়তা' : 'Privacy Guarantee'}
            </h3>
            <p style="font-size: 0.92rem; line-height: 1.6; color: #94a3b8; margin: 0;">
              ${tool.privacy}
            </p>
          </div>

          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 22px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #cbd5e1; margin-bottom: 10px;">
              ${isBn ? 'প্রযুক্তিগত সীমাবদ্ধতা' : 'Technical Specifications & Limits'}
            </h3>
            <p style="font-size: 0.92rem; line-height: 1.6; color: #94a3b8; margin: 0;">
              ${tool.limitations}
            </p>
          </div>
        </section>

        <!-- Related Tools -->
        ${tool.relatedSlugs && tool.relatedSlugs.length > 0 ? `
          <section style="margin-bottom: 48px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 36px;">
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #f1f5f9; margin-bottom: 20px;">
              ${isBn ? 'সম্পর্কিত অন্যান্য প্রয়োজনীয় টুলস' : 'Related Tools You May Like'}
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
              ${relatedCardsHtml}
            </div>
          </section>
        ` : ''}

        <!-- Frequently Asked Questions -->
        <section style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 36px;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #f1f5f9; margin-bottom: 20px;">
            ${isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h2>
          <div>
            ${faqListHtml}
          </div>
        </section>
      </div>
    `;

    // Schema.org
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.h1 || tool.name,
      url: canonicalUrl,
      description: tool.description,
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
      title: tool.title,
      description: tool.description,
      canonicalUrl,
      alternateEnUrl,
      alternateBnUrl,
      alternateDefaultUrl,
      schema,
      bodyContent,
    });

    const fileRel = isBn
      ? path.join('bn', 'tool', rawTool.slug, 'index.html')
      : path.join('tool', rawTool.slug, 'index.html');

    writePage(fileRel, html);
    generatedCount++;
  }
}

// =========================================================================
// 2. CATEGORY PAGES PRERENDERING (4 Categories in EN & BN)
// =========================================================================
for (const [catKey, catObj] of Object.entries(categories)) {
  for (const lang of ['en', 'bn']) {
    const isBn = lang === 'bn';
    const cat = catObj[lang];
    const enRelPath = `category/${catKey}`;
    const relUrl = isBn ? `/bn/${enRelPath}` : `/${enRelPath}`;

    const canonicalUrl = `${BASE_URL}${relUrl}`;
    const alternateEnUrl = `${BASE_URL}/${enRelPath}`;
    const alternateBnUrl = `${BASE_URL}/bn/${enRelPath}`;
    const alternateDefaultUrl = alternateEnUrl;

    // Filter tools for this category
    const catTools = toolsData.filter((t) => t.category === catKey);
    const catToolsHtml = catTools
      .map((t) => {
        const tData = t[lang];
        const link = isBn ? `/bn/tool/${t.slug}` : `/tool/${t.slug}`;
        return `
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 24px; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #14b8a6; background: rgba(20, 184, 166, 0.12); padding: 4px 10px; border-radius: 6px;">
                ${t.categoryName}
              </span>
              <span style="font-size: 0.75rem; color: #10b981; font-weight: 600;">● ${isBn ? 'লাইভ' : 'Live'}</span>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">
              <a href="${link}" style="color: inherit; text-decoration: none;">${tData.name}</a>
            </h3>
            <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">
              ${tData.description}
            </p>
            <a href="${link}" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: rgba(20, 184, 166, 0.12); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.25); border-radius: 10px; padding: 10px 18px; font-size: 0.9rem; font-weight: 600; text-decoration: none;">
              ${isBn ? 'টুলটি চালু করুন →' : 'Launch Tool →'}
            </a>
          </div>
        `;
      })
      .join('');

    const bodyContent = `
      <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 40px 20px;">
        <nav aria-label="Breadcrumbs" style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b; margin-bottom: 24px;">
          <a href="${isBn ? '/bn' : '/'}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'হোম' : 'Home'}</a>
          <span>/</span>
          <a href="${isBn ? '/bn/tools' : '/tools'}" style="color: #94a3b8; text-decoration: none;">${isBn ? 'টুলস' : 'Tools'}</a>
          <span>/</span>
          <span style="color: #14b8a6; font-weight: 600;">${cat.h1}</span>
        </nav>

        <header style="margin-bottom: 36px;">
          <h1 style="font-size: 2.2rem; font-weight: 800; color: #f8fafc; margin-bottom: 12px;">${cat.h1}</h1>
          <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6; max-width: 800px;">${cat.intro}</p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 48px;">
          ${catToolsHtml}
        </div>
      </div>
    `;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: cat.title,
      url: canonicalUrl,
      description: cat.description,
      inLanguage: isBn ? 'bn-BD' : 'en-US',
      isPartOf: { '@type': 'WebSite', name: 'Ahadex Tools', url: BASE_URL },
    };

    const html = generateHtml({
      lang,
      title: cat.title,
      description: cat.description,
      canonicalUrl,
      alternateEnUrl,
      alternateBnUrl,
      alternateDefaultUrl,
      schema,
      bodyContent,
    });

    const fileRel = isBn
      ? path.join('bn', 'category', catKey, 'index.html')
      : path.join('category', catKey, 'index.html');

    writePage(fileRel, html);
    generatedCount++;
  }
}

// =========================================================================
// 3. STATIC PAGES PRERENDERING (Home, Tools, About, Contact, Legal)
// =========================================================================
for (const [key, pageData] of Object.entries(staticPages)) {
  for (const lang of ['en', 'bn']) {
    const isBn = lang === 'bn';
    const enRelPath = key ? `${key}` : '';
    const relUrl = isBn ? (enRelPath ? `/bn/${enRelPath}` : '/bn') : (enRelPath ? `/${enRelPath}` : '/');

    const canonicalUrl = `${BASE_URL}${relUrl}`;
    const alternateEnUrl = `${BASE_URL}${enRelPath ? `/${enRelPath}` : '/'}`;
    const alternateBnUrl = `${BASE_URL}${enRelPath ? `/bn/${enRelPath}` : '/bn'}`;
    const alternateDefaultUrl = alternateEnUrl;

    const pageMeta = pageData[lang];

    let bodyContent = '';

    if (key === '') {
      // Home Page
      const toolsGridHtml = toolsData
        .map((t) => {
          const tData = t[lang];
          const link = isBn ? `/bn/tool/${t.slug}` : `/tool/${t.slug}`;
          return `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 22px; display: flex; flex-direction: column;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 800; color: #14b8a6; background: rgba(20, 184, 166, 0.12); padding: 4px 8px; border-radius: 6px;">${t.categoryName}</span>
                <span style="font-size: 0.75rem; color: #64748b;">${isBn ? '১০০% ফ্রি' : '100% Free'}</span>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">
                <a href="${link}" style="color: inherit; text-decoration: none;">${tData.name}</a>
              </h3>
              <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.55; margin-bottom: 18px; flex-grow: 1;">
                ${tData.description}
              </p>
              <a href="${link}" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: rgba(20, 184, 166, 0.1); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.2); border-radius: 10px; padding: 9px 16px; font-size: 0.88rem; font-weight: 600; text-decoration: none;">
                ${isBn ? 'টুল খুলুন →' : 'Open Tool →'}
              </a>
            </div>
          `;
        })
        .join('');

      bodyContent = `
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 48px 20px;">
          <!-- Hero Section -->
          <section style="text-align: center; max-width: 820px; margin: 0 auto 56px;">
            <span style="display: inline-block; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #14b8a6; background: rgba(20, 184, 166, 0.12); border: 1px solid rgba(20, 184, 166, 0.25); padding: 6px 14px; border-radius: 999px; margin-bottom: 18px;">
              ${pageMeta.eyebrow}
            </span>
            <h1 style="font-size: 2.7rem; font-weight: 900; color: #f8fafc; line-height: 1.2; margin-bottom: 18px; letter-spacing: -0.03em;">
              ${pageMeta.h1}
            </h1>
            <p style="font-size: 1.2rem; color: #94a3b8; line-height: 1.6; margin-bottom: 28px;">
              ${pageMeta.intro}
            </p>
            <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
              <a href="${isBn ? '/bn/tools' : '/tools'}" style="background: #14b8a6; color: #042f2e; font-weight: 700; padding: 12px 26px; border-radius: 12px; text-decoration: none; font-size: 0.95rem;">
                ${isBn ? 'সব টুলস ব্রাউজ করুন' : 'Browse All Tools'}
              </a>
              <a href="${isBn ? '/bn/tool/pdf-to-text' : '/tool/pdf-to-text'}" style="background: rgba(255, 255, 255, 0.05); color: #f1f5f9; border: 1px solid rgba(255, 255, 255, 0.1); font-weight: 600; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-size: 0.95rem;">
                PDF to Text
              </a>
              <a href="${isBn ? '/bn/tool/image-compressor' : '/tool/image-compressor'}" style="background: rgba(255, 255, 255, 0.05); color: #f1f5f9; border: 1px solid rgba(255, 255, 255, 0.1); font-weight: 600; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-size: 0.95rem;">
                Image Compressor
              </a>
            </div>
          </section>

          <!-- 3 Trust Pillars -->
          <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 64px;">
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 24px;">
              <div style="font-size: 24px; margin-bottom: 12px;">🔒</div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px;">
                ${isBn ? 'শতভাগ লোকাল প্রসেসিং' : '100% Client-Side Privacy'}
              </h3>
              <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5; margin: 0;">
                ${isBn ? 'আপনার ফাইল ও ডকুমেন্ট আপনার ব্রাউজার মেমরিতেই প্রসেস হয়, কোনো সার্ভারে আপলোড হয় না।' : 'Files are processed in your browser memory without uploading to unknown cloud queues.'}
              </p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 24px;">
              <div style="font-size: 24px; margin-bottom: 12px;">⚡</div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px;">
                ${isBn ? 'তাৎক্ষণিক ফলাফল' : 'Zero Wait Time'}
              </h3>
              <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5; margin: 0;">
                ${isBn ? 'হাই-স্পিড ব্রাউজার এপিআই দিয়ে চোখের পলকে বড় ফাইল কম্প্রেশন বা টেক্সট এক্সট্রাকশন সম্পন্ন হয়।' : 'Experience instant execution without queue delays, file limits, or subscription paywalls.'}
              </p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 24px;">
              <div style="font-size: 24px; margin-bottom: 12px;">✨</div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px;">
                ${isBn ? 'কোনো অ্যাকাউন্ট প্রয়োজন নেই' : 'No Account Needed'}
              </h3>
              <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5; margin: 0;">
                ${isBn ? 'লগইন বা সাইন আপ ছাড়াই সরাসরি সাইটে প্রবেশ করে যেকোনো টুল তৎক্ষণাৎ ব্যবহার করুন।' : 'Direct access to all 9 production tools without registration or hidden premium tiers.'}
              </p>
            </div>
          </section>

          <!-- Featured Tools Catalog -->
          <section style="margin-bottom: 64px;">
            <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px;">
              <div>
                <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #14b8a6; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">
                  ${isBn ? 'সব টুলস' : 'CATALOG'}
                </span>
                <h2 style="font-size: 1.8rem; font-weight: 800; color: #f8fafc; margin: 0;">
                  ${isBn ? 'জনপ্রিয় অনলাইন ইউটিলিটি টুলস' : 'Production-Ready Tools'}
                </h2>
              </div>
              <a href="${isBn ? '/bn/tools' : '/tools'}" style="color: #14b8a6; text-decoration: none; font-weight: 600; font-size: 0.95rem;">
                ${isBn ? 'সব টুলস ক্যাটালগ দেখুন →' : 'View Full Catalog →'}
              </a>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
              ${toolsGridHtml}
            </div>
          </section>
        </div>
      `;
    } else if (key === 'tools') {
      // Tools Page
      const toolsGridHtml = toolsData
        .map((t) => {
          const tData = t[lang];
          const link = isBn ? `/bn/tool/${t.slug}` : `/tool/${t.slug}`;
          return `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 22px; display: flex; flex-direction: column;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 800; color: #14b8a6; background: rgba(20, 184, 166, 0.12); padding: 4px 8px; border-radius: 6px;">${t.categoryName}</span>
                <span style="font-size: 0.75rem; color: #10b981; font-weight: 600;">● ${isBn ? 'লাইভ' : 'Live'}</span>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">
                <a href="${link}" style="color: inherit; text-decoration: none;">${tData.name}</a>
              </h3>
              <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.55; margin-bottom: 18px; flex-grow: 1;">
                ${tData.description}
              </p>
              <a href="${link}" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: rgba(20, 184, 166, 0.1); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.2); border-radius: 10px; padding: 9px 16px; font-size: 0.88rem; font-weight: 600; text-decoration: none;">
                ${isBn ? 'টুলটি চালু করুন →' : 'Launch Tool →'}
              </a>
            </div>
          `;
        })
        .join('');

      bodyContent = `
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
          <header style="margin-bottom: 40px;">
            <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #14b8a6; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">
              ${pageMeta.eyebrow}
            </span>
            <h1 style="font-size: 2.3rem; font-weight: 800; color: #f8fafc; margin-bottom: 12px;">
              ${pageMeta.h1}
            </h1>
            <p style="font-size: 1.15rem; color: #94a3b8; line-height: 1.6; max-width: 780px;">
              ${pageMeta.intro}
            </p>
          </header>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
            ${toolsGridHtml}
          </div>
        </div>
      `;
    } else {
      // About, Contact, Legal Pages
      bodyContent = `
        <div class="container" style="max-width: 860px; margin: 0 auto; padding: 48px 20px;">
          <header style="margin-bottom: 36px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 24px;">
            <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #14b8a6; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">
              ${pageMeta.eyebrow}
            </span>
            <h1 style="font-size: 2.4rem; font-weight: 800; color: #f8fafc; margin-bottom: 14px;">
              ${pageMeta.h1}
            </h1>
            <p style="font-size: 1.15rem; color: #94a3b8; line-height: 1.6;">
              ${pageMeta.intro}
            </p>
          </header>

          <article style="font-size: 1rem; line-height: 1.75; color: #cbd5e1; display: flex; flex-direction: column; gap: 22px;">
            <p>
              ${isBn
                ? 'Ahadex Tools একটি সম্পূর্ণ আধুনিক, দ্রুত ও নির্ভরযোগ্য ওয়েব প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য হল ব্যবহারকারীদের জন্য দৈনন্দিন ডিজিটাল কাজগুলোকে নিরাপদ ও সহজ করে তোলা।'
                : 'Ahadex Tools is an independent digital tool suite committed to accessible, reliable, and privacy-respecting browser utilities.'}
            </p>
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 24px;">
              <h3 style="font-size: 1.15rem; font-weight: 700; color: #f1f5f9; margin-bottom: 10px;">
                ${isBn ? '১. ক্লায়েন্ট-সাইড প্রসেসিং আর্কিটেকচার' : '1. In-Browser Client-Side Architecture'}
              </h3>
              <p style="margin: 0; color: #94a3b8;">
                ${isBn
                  ? 'আমরা কোনো সাধারণ ক্লাউড কনভার্টারের মতো আপনার মূল্যবান ছবি, ডকুমেন্ট বা কোড সার্ভারে আপলোড করি না। সমস্ত প্রসেসিং সরাসরি আপনার ডিভাইসের ব্রাউজারে HTML5 Canvas, pdf-lib, এবং WebAssembly প্রযুক্তি ব্যবহার করে সম্পন্ন হয়।'
                  : 'Unlike legacy online converters that upload your confidential files to remote cloud storage, Ahadex Tools executes entirely within your browser window using modern HTML5 Canvas, pdf-lib, and WebAssembly technologies.'}
              </p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 24px;">
              <h3 style="font-size: 1.15rem; font-weight: 700; color: #f1f5f9; margin-bottom: 10px;">
                ${isBn ? '২. যোগাযোগ ও সহায়তা' : '2. Contact & Feedback Channels'}
              </h3>
              <p style="margin: 0; color: #94a3b8;">
                ${isBn
                  ? 'যেকোনো জিজ্ঞাসা বা মতামতের জন্য আমাদের অফিসিয়াল ইমেইল support@ahadex.online অথবা সরাসরি WhatsApp মাধ্যমে যোগাযোগ করতে পারেন।'
                  : 'For technical inquiries, feature suggestions, or feedback, you can reach our engineering team directly via email at support@ahadex.online or via WhatsApp.'}
              </p>
            </div>
          </article>
        </div>
      `;
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageMeta.title,
      url: canonicalUrl,
      description: pageMeta.description,
      inLanguage: isBn ? 'bn-BD' : 'en-US',
      isPartOf: { '@type': 'WebSite', name: 'Ahadex Tools', url: BASE_URL },
    };

    const html = generateHtml({
      lang,
      title: pageMeta.title,
      description: pageMeta.description,
      canonicalUrl,
      alternateEnUrl,
      alternateBnUrl,
      alternateDefaultUrl,
      schema,
      bodyContent,
    });

    const fileRel = isBn
      ? (key ? path.join('bn', key, 'index.html') : path.join('bn', 'index.html'))
      : (key ? path.join(key, 'index.html') : 'index.html');

    writePage(fileRel, html);
    generatedCount++;
  }
}

console.log(`[prerender] ✓ Successfully generated ${generatedCount} rich static HTML pages with full tool workspaces, step-by-step guides, FAQs, and SEO tags!`);
