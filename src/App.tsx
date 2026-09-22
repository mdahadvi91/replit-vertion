import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Languages,
  Menu,
  Moon,
  MoveRight,
  Plus,
  Search,
  Settings2,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { AdSenseProvider } from '@/components/ads/AdSenseProvider';
import { AdSlot } from '@/components/ads/AdSlot';
import { categoryList, getToolBySlug, tools, type ToolCategory, type ToolDefinition } from '@/data/tools';
import { ImageCompressor } from '@/components/tool/ImageCompressor';
import { I18nProvider, useI18n, type Language } from '@/i18n';
import { enableAnalytics, trackEvent, trackPageView } from '@/lib/analytics';
import { adConfig } from '@/lib/ads/adConfig';

const SITE_URL = 'https://ahadex.fun';
type Theme = 'light' | 'dark';
type ConsentChoice = 'unknown' | 'essential' | 'measurement';

const pageMeta: Record<string, { title: string; description: string; h1: string }> = {
  '/': {
    title: 'Free Online Tools — Ahadex Tools',
    description: 'Fast, useful browser tools for images, documents, text and developer tasks. No account required for everyday work.',
    h1: 'Make the small stuff feel small.',
  },
  '/tools': {
    title: 'Online Tool Library — Ahadex Tools',
    description: 'Browse useful online tools for images, documents, text and developer work, built to be clear and easy to use.',
    h1: 'Pick a task. Make it lighter.',
  },
  '/about': {
    title: 'About Ahadex Tools',
    description: 'Learn why Ahadex Tools exists and how we build useful, accessible browser utilities.',
    h1: 'The internet has enough complicated helpers.',
  },
  '/contact': {
    title: 'Contact Ahadex Tools',
    description: 'Suggest a useful tool, report a problem or share feedback with Ahadex Tools.',
    h1: 'Good tools start with good questions.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy — Ahadex Tools',
    description: 'Read how Ahadex Tools handles browser preferences, optional analytics and local file processing.',
    h1: 'Privacy policy',
  },
  '/terms': {
    title: 'Terms of Use — Ahadex Tools',
    description: 'Read the terms for using Ahadex Tools and its browser-based utilities.',
    h1: 'Terms of use',
  },
  '/disclaimer': {
    title: 'Disclaimer — Ahadex Tools',
    description: 'Important information about Ahadex Tools outputs, limitations and responsible use.',
    h1: 'Disclaimer',
  },
  '/cookie-policy': {
    title: 'Cookie Policy — Ahadex Tools',
    description: 'Learn which essential storage Ahadex Tools uses and how optional measurement consent works.',
    h1: 'Cookie policy',
  },
  '/accessibility': {
    title: 'Accessibility — Ahadex Tools',
    description: 'Learn about Ahadex Tools accessibility goals, keyboard support and reduced motion options.',
    h1: 'Accessibility',
  },
};

const faqItems = [
  ['Are Ahadex tools free to use?', 'Yes. Ahadex is designed to keep the core utility of every released tool free for everyday work.'],
  ['Do you upload my files?', 'The live Image Compressor processes files in your browser. The file is not sent to an Ahadex server by that tool.'],
  ['Will more tools be added?', 'Yes. New tools are added only when they solve a real task, work reliably and can be explained clearly.'],
  ['Can I suggest a tool?', 'Yes. Send a note through Contact and describe the task, the input you start with and the result you need.'],
];

function usePageMeta(pathname: string) {
  const { language } = useI18n();
  useEffect(() => {
    const toolSlug = pathname.startsWith('/tool/') ? pathname.replace('/tool/', '') : '';
    const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
    const categorySlug = pathname.startsWith('/category/') ? pathname.replace('/category/', '') : '';
    const category = categoryList.find((candidate) => candidate.toLowerCase() === categorySlug.toLowerCase() && candidate !== 'All');
    const current = tool
      ? { title: tool.seo.title, description: tool.seo.description, h1: tool.seo.h1 }
      : category
        ? { title: `${category} Tools — Ahadex Tools`, description: `Browse useful ${category.toLowerCase()} tools from Ahadex Tools.`, h1: `${category} tools` }
      : pageMeta[pathname] ?? {
          title: 'Page not found — Ahadex Tools',
          description: 'The page you requested could not be found. Browse the Ahadex Tools library instead.',
          h1: 'Page not found',
        };
    const canonicalPath = tool?.seo.canonical ?? pathname;
    const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    document.title = current.title;
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
    document.querySelector('meta[name="description"]')?.setAttribute('content', current.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', current.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', current.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', current.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', current.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);

    const schema = {
      '@context': 'https://schema.org',
      '@type': tool ? 'WebApplication' : 'WebSite',
      name: tool ? tool.name : 'Ahadex Tools',
      description: current.description,
      url: canonicalUrl,
      applicationCategory: tool ? 'UtilitiesApplication' : undefined,
      operatingSystem: 'Web',
      isPartOf: { '@type': 'WebSite', name: 'Ahadex Tools', url: SITE_URL },
    };
    let schemaScript = document.querySelector<HTMLScriptElement>('#ahadex-jsonld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'ahadex-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
    trackPageView(pathname, current.title);
  }, [language, pathname]);
}

function Logo() {
  return (
    <Link to="/" className="brand" aria-label="Ahadex Tools home" data-testid="link-logo">
      <span className="brand-mark" aria-hidden="true"><Zap size={18} strokeWidth={2.5} /></span>
      <span>Ahadex<span style={{ color: 'hsl(var(--primary))' }}> Tools</span></span>
    </Link>
  );
}

function MobileDrawer({
  side,
  open,
  title,
  onClose,
  children,
}: {
  side: 'left' | 'right';
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const firstControlRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstControlRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;
  return (
    <>
      <button type="button" className="drawer-backdrop" aria-label="Close menu" onClick={onClose} />
      <aside className={`mobile-drawer ${side}`} aria-label={title} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <strong>{title}</strong>
          <button ref={firstControlRef} type="button" className="icon-button" aria-label="Close menu" onClick={onClose}><X size={17} /></button>
        </div>
        {children}
      </aside>
    </>
  );
}

function Header({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const { copy, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navItems = [
    ['/', copy.home],
    ['/tools', copy.tools],
    ['/about', copy.about],
    ['/contact', copy.contact],
  ];

  const closeTools = () => setToolsOpen(false);
  const closeSettings = () => setSettingsOpen(false);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    trackEvent('search', { query: query.trim().slice(0, 80) });
    navigate(query.trim() ? `/tools?query=${encodeURIComponent(query.trim())}` : '/tools');
    closeTools();
  };

  return (
    <>
      <header className="site-header">
        <div className="container nav-inner">
          <button className="menu-button" type="button" aria-label="Open tool categories" aria-expanded={toolsOpen} onClick={() => setToolsOpen(true)}><Menu size={18} /></button>
          <Logo />
          <nav className="nav-links" aria-label="Primary navigation">
            {navItems.map(([href, label]) => (
              <Link key={href} to={href} className={`nav-link${location.pathname === href ? ' active' : ''}`} data-testid={`link-nav-${label.toLowerCase()}`}>{label}</Link>
            ))}
          </nav>
          <form className="header-search" onSubmit={submitSearch} role="search">
            <Search size={15} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchTools} aria-label={copy.searchTools} />
          </form>
          <div className="nav-actions">
            <button className="lang-button" type="button" aria-label="Switch language" onClick={() => { const next: Language = language === 'en' ? 'bn' : 'en'; setLanguage(next); trackEvent('language_change', { language: next }); }}><Languages size={15} /><span>{copy.languageLabel}</span></button>
            <button className="icon-button" type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => { const next: Theme = theme === 'light' ? 'dark' : 'light'; setTheme(next); trackEvent('theme_change', { theme: next }); }}>{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button>
            <button className="settings-button icon-button" type="button" aria-label="Open settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(true)}><Settings2 size={16} /></button>
          </div>
        </div>
      </header>
      <MobileDrawer side="left" open={toolsOpen} title={copy.tools} onClose={closeTools}>
        <form className="drawer-search" onSubmit={submitSearch} role="search">
          <Search size={15} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchTools} aria-label={copy.searchTools} />
        </form>
        <nav className="drawer-links" aria-label="Tool categories">
          {categoryList.map((category) => <Link key={category} to={category === 'All' ? '/tools' : `/category/${category.toLowerCase()}`} onClick={closeTools}>{category === 'All' ? 'All Tools' : category}</Link>)}
        </nav>
      </MobileDrawer>
      <MobileDrawer side="right" open={settingsOpen} title="Settings" onClose={closeSettings}>
        <div className="settings-list">
          <span className="drawer-label">Theme</span>
          <button type="button" className={`setting-choice${theme === 'light' ? ' active' : ''}`} onClick={() => setTheme('light')}><Sun size={15} /> Light</button>
          <button type="button" className={`setting-choice${theme === 'dark' ? ' active' : ''}`} onClick={() => setTheme('dark')}><Moon size={15} /> Dark</button>
          <span className="drawer-label">Language</span>
          <button type="button" className={`setting-choice${language === 'en' ? ' active' : ''}`} onClick={() => setLanguage('en')}>English</button>
          <button type="button" className={`setting-choice${language === 'bn' ? ' active' : ''}`} onClick={() => setLanguage('bn')}>বাংলা</button>
          <span className="drawer-label">Motion</span>
          <p className="drawer-note">Your browser's reduced-motion preference is always respected.</p>
        </div>
      </MobileDrawer>
    </>
  );
}

function Footer() {
  const { copy } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand"><Logo /><p>Useful browser tools for the small digital jobs that interrupt a good day.</p></div>
          <div className="footer-links">
            <div><h4>Explore</h4><Link className="footer-link" to="/tools">{copy.tools}</Link><Link className="footer-link" to="/about">{copy.about}</Link><Link className="footer-link" to="/contact">{copy.contact}</Link></div>
            <div><h4>Trust</h4><Link className="footer-link" to="/privacy-policy">{copy.privacy}</Link><Link className="footer-link" to="/terms">{copy.terms}</Link><Link className="footer-link" to="/disclaimer">{copy.disclaimer}</Link><Link className="footer-link" to="/cookie-policy">{copy.cookiePolicy}</Link><Link className="footer-link" to="/accessibility">{copy.accessibility}</Link></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 Ahadex Tools</span><span>Made for the in-between tasks.</span></div>
      </div>
    </footer>
  );
}

function ToolCard({ tool, index }: { tool: ToolDefinition; index: number }) {
  const Icon = tool.icon;
  const content = (
    <>
      <div><span className="tool-icon" style={{ '--tool-color': tool.color } as CSSProperties}><Icon size={21} /></span><h3>{tool.name}</h3><p>{tool.description}</p></div>
      <div className="tool-card-foot"><span>{tool.status === 'live' ? 'Live now' : 'Planned'}</span><ArrowRight size={16} /></div>
    </>
  );
  if (tool.status !== 'live') {
    return <div className="tool-card reveal" style={{ '--tool-color': tool.color, animationDelay: `${index * 55}ms` } as CSSProperties} aria-label={`${tool.name} — planned`}>{content}</div>;
  }
  return <Link to={tool.route} className="tool-card reveal" style={{ '--tool-color': tool.color, animationDelay: `${index * 55}ms` } as CSSProperties} onClick={() => trackEvent('tool_open', { tool_id: tool.id, tool_slug: tool.slug, category: tool.category })}>{content}</Link>;
}

function Home({ consent }: { consent: ConsentChoice }) {
  const { copy } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <main>
      <section className="hero"><div className="container hero-grid"><div className="reveal"><span className="eyebrow">A growing digital toolkit</span><h1>Make the small stuff feel <em>small.</em></h1><p className="hero-copy">Ahadex Tools brings the useful utilities you reach for between bigger tasks — quick, considered, and ready when you are.</p><div className="hero-ctas"><Link to="/tools" className="button button-primary" onClick={() => trackEvent('tool_open', { source: 'hero' })}>{copy.exploreTools} <ArrowRight size={16} /></Link><Link to="/about" className="button button-ghost">{copy.whyAhadex}</Link></div><div className="micro-trust"><span className="trust-dot" /> Browser-first <span>·</span> No account needed <span>·</span> Free to start</div></div><div className="hero-art reveal delay-2" aria-label="Abstract illustration of connected utilities"><div className="art-panel"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><span className="orb orb-a" /><span className="orb orb-b" /><span className="orb orb-c" /><div className="art-card"><span>AHX / 001</span><strong>lighter work</strong><small>one focused tool at a time</small></div><div className="art-label">THE TOOLKIT, IN MOTION</div></div></div></div></section>
      <section className="section section-tint"><div className="container"><div className="section-heading"><div><span className="eyebrow">Start here</span><h2>One less tab to search for.</h2></div><p>Focused tools for images, documents, text and developer work. No noisy dashboards. Just the right surface for the job.</p></div><div className="tool-grid">{tools.slice(0, 3).map((tool, index) => <ToolCard key={tool.id} tool={tool} index={index} />)}</div><AdSlot enabled={consent === 'measurement'} slot={adConfig.homeSlot} /></div></section>
      <section className="section"><div className="container"><div className="steps"><div><span className="eyebrow">The Ahadex way</span><h2>Useful is a feeling.</h2><div className="stat-strip"><div className="stat"><strong>01</strong><span>One clear purpose</span></div><div className="stat"><strong>0</strong><span>Accounts to create</span></div><div className="stat"><strong>∞</strong><span>Small tasks ahead</span></div></div></div><div className="step-list"><div className="step"><span className="step-number">01 /</span><div><h3>Find the tool that fits.</h3><p>Every utility has one job and a name that tells you what it does. No treasure hunt, no feature maze.</p></div></div><div className="step"><span className="step-number">02 /</span><div><h3>Bring your work in.</h3><p>Drop in a file, paste some text or choose a setting. Ahadex keeps the handoff obvious and the controls calm.</p></div></div><div className="step"><span className="step-number">03 /</span><div><h3>Leave with a finished thing.</h3><p>Download the result, copy it on, and get back to the part of your work that matters more.</p></div></div></div></div></div></section>
      <section className="section section-tint"><div className="container faq-wrap"><div><span className="eyebrow">Good to know</span><h2>Questions, answered plainly.</h2></div><div className="faq-list">{faqItems.map(([question, answer], index) => { const open = openFaq === index; return <div className="faq-item" key={question}><button className={`faq-question${open ? ' open' : ''}`} type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}><span>{question}</span>{open ? <X size={17} /> : <Plus size={17} />}</button><div className={`faq-answer${open ? ' open' : ''}`}><p>{answer}</p></div></div>; })}</div></div></section>
      <div className="container"><div className="cta-band"><div><span className="eyebrow">Your next tiny win</span><h2>See what the toolkit can take off your plate.</h2></div><Link to="/tools" className="button">{copy.browseAllTools} <MoveRight size={16} /></Link></div></div>
    </main>
  );
}

function ToolsPage({ initialCategory = 'All' }: { initialCategory?: 'All' | ToolCategory }) {
  const { copy } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<'All' | ToolCategory>(initialCategory);
  const query = searchParams.get('query') ?? '';
  const filtered = useMemo(() => tools.filter((tool) => (category === 'All' || tool.category === category) && `${tool.name} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const setQuery = (value: string) => setSearchParams(value ? { query: value } : {});
  return <main><div className="page-hero"><div className="container"><span className="eyebrow">The library</span><h1>{pageMeta['/tools'].h1}</h1><p>A growing shelf of browser utilities, each built to get out of your way quickly.</p></div></div><section className="section"><div className="container"><div className="library-toolbar"><label className="search-field"><Search size={16} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchTools} aria-label={copy.searchTools} /></label><span className="muted mono" style={{ fontSize: 11 }}>{filtered.length} of {tools.length} tools</span></div><div className="category-tabs" role="tablist" aria-label="Tool categories">{categoryList.map((item) => <button key={item} className={`category-tab${category === item ? ' active' : ''}`} type="button" role="tab" aria-selected={category === item} onClick={() => { setCategory(item); trackEvent('category_open', { category: item }); }}>{item}</button>)}</div><div className="tool-grid" style={{ marginTop: 25 }}>{filtered.length ? filtered.map((tool, index) => <ToolCard key={tool.id} tool={tool} index={index} />) : <div className="empty-state" style={{ gridColumn: '1 / -1' }}><Search size={23} /><p>No tools match “{query}”. Try a broader phrase.</p><button type="button" className="button button-ghost" onClick={() => { setQuery(''); setCategory('All'); }}>Clear search</button></div>}</div></div></section></main>;
}

function ToolBreadcrumb({ tool }: { tool: ToolDefinition }) {
  return <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/tools">Tools</Link><span>/</span><span>{tool.category}</span><span>/</span><strong>{tool.name}</strong></nav>;
}

function PlannedTool({ tool }: { tool: ToolDefinition }) {
  return <main className="prose-page"><span className="eyebrow">{tool.category} / Planned tool</span><h1>{tool.seo.h1}</h1><p style={{ fontSize: 18 }}>{tool.description}</p><p>Ahadex will publish this utility only after it has real processing, validation, useful content and a dependable export flow. It is not presented as live yet.</p><Link to="/tools" className="button button-primary"><ArrowLeft size={16} /> Back to Tools</Link></main>;
}

function About() {
  return <main><div className="page-hero"><div className="container"><span className="eyebrow">About Ahadex Tools</span><h1>{pageMeta['/about'].h1}</h1><p>Ahadex Tools is a growing toolkit for the moments when a simple digital task somehow becomes a whole thing.</p></div></div><section className="section"><div className="container steps"><div><span className="eyebrow">A useful point of view</span><h2>Less friction is a form of care.</h2></div><div className="step-list"><div className="step"><span className="step-number">01 /</span><div><h3>Clarity before cleverness.</h3><p>We name tools plainly, show only the controls that matter and keep the next step visible.</p></div></div><div className="step"><span className="step-number">02 /</span><div><h3>Private by default.</h3><p>Whenever a job can happen in your browser, that is where we start. File handling claims match the actual implementation.</p></div></div><div className="step"><span className="step-number">03 /</span><div><h3>Useful before monetized.</h3><p>Ads are secondary. A tool must solve a real problem without relying on advertising to make the experience valuable.</p></div></div></div></div></section><div className="container"><div className="cta-band"><div><span className="eyebrow">Have a nuisance?</span><h2>Tell us what should be easier.</h2></div><Link to="/contact" className="button">Send a note <ArrowRight size={16} /></Link></div></div></main>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  return <main><div className="page-hero"><div className="container"><span className="eyebrow">Get in touch</span><h1>{pageMeta['/contact'].h1}</h1><p>Found a rough edge, have a tool idea or simply want to say hello? We read every note.</p></div></div><section className="section"><div className="container contact-grid"><div className="contact-card"><h3>Send a useful note.</h3><p>Tell us what you were trying to get done and where things got awkward. Specific beats polished.</p><p className="mono" style={{ fontSize: 11, marginTop: 25 }}>hello@ahadex.fun</p></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><div className="form-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" required placeholder="How should we address you?" /></div><div className="form-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" type="email" required placeholder="you@example.com" /></div><div className="form-field"><label htmlFor="contact-message">Your note</label><textarea id="contact-message" required placeholder="The task I wish was easier is…" /></div>{sent ? <div className="success-note" role="status"><Check size={15} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Thanks — your note is queued for a thoughtful read.</div> : <button className="button button-primary" type="submit">Send note <ArrowRight size={16} /></button>}</form></div></section></main>;
}

const legalContent = {
  '/privacy-policy': { eyebrow: 'A plain-language promise', title: 'Privacy policy', intro: 'Ahadex is designed to be useful without asking for more information than the job requires.', sections: [['Browser processing', 'When a tool says it processes a file in your browser, the current implementation uses browser APIs and does not upload that file to an Ahadex server. Each tool page describes its own behavior.'], ['Optional measurement', 'Google Analytics is not loaded until you choose the optional analytics setting. When enabled, Ahadex sends limited page and tool interaction events, never file contents, document text, passwords or tokens.'], ['Contact messages', 'The current contact form only shows a local success state. It does not claim to deliver a message until a real delivery service is connected.']] },
  '/terms': { eyebrow: 'The straightforward version', title: 'Terms of use', intro: 'Use Ahadex to make everyday digital tasks easier, responsibly and within the laws that apply to you.', sections: [['Use of the tools', 'You are responsible for the files, text and other material you choose to process. Do not use Ahadex to handle content you are not allowed to access or transform.'], ['Outputs and review', 'Utilities can have limitations. Review important outputs before relying on them for legal, financial, medical, safety or business-critical decisions.'], ['Changes', 'Tools and content may change as the platform grows. We will not describe a planned tool as live or a simulated result as a completed export.']] },
  '/disclaimer': { eyebrow: 'Before you use a tool', title: 'Disclaimer', intro: 'Ahadex tools are practical helpers, not a substitute for professional advice or your own review.', sections: [['No guarantee of fitness', 'A result that is useful for one job may not be suitable for another. Check dimensions, quality, encoding and other output details before use.'], ['Third-party services', 'Optional analytics and advertising services, when enabled, are subject to their own policies and consent requirements.'], ['Questions', 'If a page makes a claim that does not match what the tool does, contact us so it can be corrected.']] },
  '/cookie-policy': { eyebrow: 'Storage, explained', title: 'Cookie policy', intro: 'Ahadex keeps optional measurement off until you make a choice.', sections: [['Essential storage', 'Ahadex stores theme, language and consent choices in local storage so the interface can remember them.'], ['Optional analytics', 'If you allow analytics, the Google Analytics script can load and receive limited interaction events. You can clear the choice in your browser settings.'], ['Advertising', 'AdSense code is loaded only when a valid public client configuration exists and the relevant consent path is enabled. No seller IDs are invented in ads.txt.']] },
  '/accessibility': { eyebrow: 'Designed for more people', title: 'Accessibility', intro: 'Ahadex aims for clear, keyboard-friendly interfaces with sensible motion and readable contrast.', sections: [['Keyboard support', 'Interactive controls use buttons, links, labels and native form elements. Drawers close with Escape and keep the page from scrolling behind them.'], ['Motion', 'The interface honors the browser prefers-reduced-motion setting. Essential information is never conveyed only through animation.'], ['Feedback', 'Tool states expose useful text for empty, processing, success and error conditions. Contact us if a particular interaction is difficult to use.']] },
} as const;

function LegalPage({ path }: { path: keyof typeof legalContent }) {
  const content = legalContent[path];
  return <main><div className="prose-page"><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p style={{ fontSize: 18 }}>{content.intro}</p>{content.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<p className="mono" style={{ fontSize: 11, marginTop: 45 }}>Last updated: 21 September 2026</p></div></main>;
}

function NotFound() {
  return <main className="prose-page"><span className="eyebrow">404 / Not found</span><h1>That page wandered off.</h1><p>There is no tool or page at this address, but there may be a useful one in the library.</p><div className="hero-ctas"><Link to="/tools" className="button button-primary">Back to Tools <ArrowRight size={16} /></Link><Link to="/" className="button button-ghost">Home</Link></div></main>;
}

function ToolRoute() {
  const { toolSlug } = useParams();
  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  if (!tool) return <NotFound />;
  return tool.status === 'live' && tool.slug === 'image-compressor' ? <ImageCompressor tool={tool} /> : <PlannedTool tool={tool} />;
}

function CategoryPage() {
  const { categorySlug } = useParams();
  const category = categoryList.find((candidate) => candidate.toLowerCase() === categorySlug?.toLowerCase());
  if (!category || category === 'All') return <Navigate to="/tools" replace />;
  return <ToolsPage initialCategory={category} />;
}

function ErrorFallback({ resetError }: { resetError: () => void }) {
  return <main className="prose-page"><span className="eyebrow">Something went wrong</span><h1>The toolkit needs a reset.</h1><p>This screen failed without exposing technical details. Try again or return to the tool library.</p><div className="hero-ctas"><button type="button" className="button button-primary" onClick={resetError}>Try again</button><Link to="/tools" className="button button-ghost">Back to Tools</Link></div></main>;
}

function ConsentBanner({ choice, setChoice }: { choice: ConsentChoice; setChoice: (choice: ConsentChoice) => void }) {
  const { copy } = useI18n();
  if (choice !== 'unknown') return null;
  return <aside className="cookie" aria-label="Privacy choices"><p>{copy.privacyNotice} <Link to="/cookie-policy" className="inline-link">Read the cookie policy.</Link></p><div className="cookie-actions"><button className="button button-ghost" type="button" onClick={() => setChoice('essential')}>{copy.onlyEssential}</button><button className="button button-primary" type="button" onClick={() => setChoice('measurement')}>{copy.allowMeasurement}</button></div></aside>;
}

function AppLayout() {
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem('ahadex-theme') === 'dark' ? 'dark' : 'light');
  const [consent, setConsentState] = useState<ConsentChoice>(() => {
    const saved = localStorage.getItem('ahadex-consent');
    return saved === 'essential' || saved === 'measurement' ? saved : 'unknown';
  });
  const setConsent = (next: ConsentChoice) => {
    localStorage.setItem('ahadex-consent', next);
    setConsentState(next);
    if (next === 'measurement') enableAnalytics();
  };
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('ahadex-theme', theme); }, [theme]);
  useEffect(() => { if (consent === 'measurement') enableAnalytics(); }, [consent]);
  return <><AdSenseProvider enabled={consent === 'measurement'} /><div className="app-shell"><Header theme={theme} setTheme={setTheme} /><Routes><Route path="/" element={<Home consent={consent} />} /><Route path="/tools" element={<ToolsPage />} /><Route path="/category/:categorySlug" element={<CategoryPage />} /><Route path="/tool/:toolSlug" element={<ToolRoute />} /><Route path="/tools/image-compressor" element={<Navigate to="/tool/image-compressor" replace />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="/privacy-policy" element={<LegalPage path="/privacy-policy" />} /><Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} /><Route path="/terms" element={<LegalPage path="/terms" />} /><Route path="/disclaimer" element={<LegalPage path="/disclaimer" />} /><Route path="/cookie-policy" element={<LegalPage path="/cookie-policy" />} /><Route path="/accessibility" element={<LegalPage path="/accessibility" />} /><Route path="*" element={<NotFound />} /></Routes><Footer /><ConsentBanner choice={consent} setChoice={setConsent} /></div></>;
}

function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}><I18nProvider><RouteAwareLayout /></I18nProvider></BrowserRouter>;
}

function RouteAwareLayout() {
  const location = useLocation();
  usePageMeta(location.pathname);
  return <ErrorBoundary resetKey={location.pathname} FallbackComponent={ErrorFallback}><AppLayout /></ErrorBoundary>;
}

export default App;