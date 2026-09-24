// Cloudflare Pages edge middleware to prevent Soft 404s and enforce proper HTTP 404 status codes

const VALID_TOOL_SLUGS = new Set([
  'image-compressor',
  'pdf-to-text',
  'json-formatter',
  'merge-pdf',
  'word-counter',
  'color-picker',
  'jpg-to-png',
  'image-resizer',
  'photo-qr-code',
]);

const VALID_CATEGORIES = new Set(['images', 'documents', 'text', 'developer']);

const VALID_STATIC_PAGES = new Set([
  '',
  'tools',
  'about',
  'contact',
  'privacy-policy',
  'privacy',
  'terms',
  'disclaimer',
  'cookie-policy',
  'accessibility',
]);

function isValidRoute(pathname: string): boolean {
  // Normalize pathname: remove trailing slash
  let path = pathname.replace(/\/+$/, '');
  if (!path.startsWith('/')) path = '/' + path;

  // Handle Bengali prefix
  if (path === '/bn' || path.startsWith('/bn/')) {
    path = path.slice(3) || '/';
  }

  // Strip leading slash for segment checking
  const segments = path.split('/').filter(Boolean);

  // Root / or /bn
  if (segments.length === 0) return true;

  // Static pages
  if (segments.length === 1 && VALID_STATIC_PAGES.has(segments[0])) {
    return true;
  }

  // Tool routes: /tool/:slug
  if (segments.length === 2 && segments[0] === 'tool') {
    return VALID_TOOL_SLUGS.has(segments[1]);
  }

  // Category routes: /category/:category
  if (segments.length === 2 && segments[0] === 'category') {
    return VALID_CATEGORIES.has(segments[1].toLowerCase());
  }

  // Legacy redirect: /tools/image-compressor
  if (segments.length === 2 && segments[0] === 'tools' && VALID_TOOL_SLUGS.has(segments[1])) {
    return true;
  }

  return false;
}

export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
  env: Record<string, unknown>;
}): Promise<Response> {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // 1. If requesting a static file with extension or system path, pass through to static asset handler
  if (
    pathname.includes('.') ||
    pathname.startsWith('/assets/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/ads.txt' ||
    pathname === '/manifest.webmanifest'
  ) {
    return context.next();
  }

  // 2. Check if the URL is a known valid route
  if (isValidRoute(pathname)) {
    return context.next();
  }

  // 3. Unknown route: Return a real HTTP 404 status code with noindex header to prevent Soft 404
  const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>404 / Page Not Found — Ahadex Tools</title>
    <meta name="description" content="The page you requested could not be found. Browse the Ahadex Tools library instead." />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex, nofollow" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <style>
      :root { --bg: #090d16; --card: #111726; --text: #f1f5f9; --muted: #94a3b8; --primary: #14b8a6; --border: #1e293b; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
      .card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; max-width: 520px; width: 100%; padding: 40px 32px; text-align: center; }
      .badge { display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--primary); background: rgba(20, 184, 166, 0.12); padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; }
      h1 { font-size: 26px; margin-bottom: 12px; font-weight: 800; }
      p { color: var(--muted); font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
      .actions { display: flex; gap: 12px; justify-content: center; }
      .btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; }
      .btn-primary { background: var(--primary); color: #042f2e; }
      .btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">404 / Not Found</span>
      <h1>That page wandered off.</h1>
      <p>There is no tool or page at this address. The URL does not exist or may have been moved.</p>
      <div class="actions">
        <a href="/tools" class="btn btn-primary">Browse All Tools</a>
        <a href="/" class="btn btn-ghost">Home</a>
      </div>
    </div>
  </body>
</html>`;

  return new Response(notFoundHtml, {
    status: 404,
    statusText: 'Not Found',
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
