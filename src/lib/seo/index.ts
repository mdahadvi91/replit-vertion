export interface DocumentMetaOptions {
  title: string;
  description: string;
  canonicalUrl?: string;
  robots?: string; // e.g. 'index, follow' or 'noindex, nofollow'
  language?: 'en' | 'bn';
  alternateEnUrl?: string;
  alternateBnUrl?: string;
  alternateDefaultUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  schema?: Record<string, unknown>;
}

function setMetaTag(nameOrProperty: 'name' | 'property', key: string, value?: string) {
  if (!value) return;
  let element = document.querySelector<HTMLMetaElement>(`meta[${nameOrProperty}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(nameOrProperty, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

function setLinkTag(rel: string, href?: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.querySelector<HTMLLinkElement>(selector);
  if (!href) {
    if (element) element.remove();
    return;
  }
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    if (hreflang) element.setAttribute('hreflang', hreflang);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function updateDocumentMeta(options: DocumentMetaOptions | string, legacyDescription?: string) {
  if (typeof options === 'string') {
    options = {
      title: options,
      description: legacyDescription || '',
    };
  }

  const {
    title,
    description,
    canonicalUrl,
    robots = 'index, follow',
    language = 'en',
    alternateEnUrl,
    alternateBnUrl,
    alternateDefaultUrl,
    ogType = 'website',
    ogImage = 'https://ahadex.online/favicon.svg',
    schema,
  } = options;

  // Title
  document.title = title;

  // Lang on html element
  document.documentElement.lang = language === 'bn' ? 'bn' : 'en';

  // Standard Meta
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'robots', robots);
  setMetaTag('name', 'googlebot', robots);

  // OpenGraph Meta
  setMetaTag('property', 'og:site_name', 'Ahadex Tools');
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  if (canonicalUrl) setMetaTag('property', 'og:url', canonicalUrl);
  if (ogImage) setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:locale', language === 'bn' ? 'bn_BD' : 'en_US');

  // Twitter Meta
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  if (ogImage) setMetaTag('name', 'twitter:image', ogImage);

  // Canonical & Multilingual Alternate Hreflang Links
  setLinkTag('canonical', canonicalUrl);
  if (alternateEnUrl) setLinkTag('alternate', alternateEnUrl, 'en');
  if (alternateBnUrl) setLinkTag('alternate', alternateBnUrl, 'bn');
  if (alternateDefaultUrl) setLinkTag('alternate', alternateDefaultUrl, 'x-default');

  // JSON-LD Structured Data
  let schemaScript = document.querySelector<HTMLScriptElement>('#ahadex-jsonld');
  if (schema) {
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'ahadex-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
  } else if (schemaScript) {
    schemaScript.remove();
  }
}
