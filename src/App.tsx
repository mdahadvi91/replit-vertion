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
  ArrowLeft,
  ArrowRight,
  Check,
  Languages,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  MoveRight,
  Plus,
  Search,
  Settings2,
  Star,
  Sun,
  X,
  Zap,
} from 'lucide-react';
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
import { categoryList, getToolBySlug, tools, type ToolCategory, type ToolDefinition } from '@/data/tools';
import { AdSlot } from '@/components/ads/AdSlot';
import { AdSenseProvider } from '@/components/ads/AdSenseProvider';
import { ErrorBoundary } from '@/components/error-boundary';
import { ImageCompressor } from '@/components/tool/ImageCompressor';
import { WordCounter } from '@/components/tool/WordCounter';
import { JsonFormatter } from '@/components/tool/JsonFormatter';
import { ColorPickerTool } from '@/components/tool/ColorPickerTool';
import { JpgToPngConverter } from '@/components/tool/JpgToPngConverter';
import { ImageResizer } from '@/components/tool/ImageResizer';
import { PdfToTextTool } from '@/components/tool/PdfToTextTool';
import { MergePdfTool } from '@/components/tool/MergePdfTool';
import { PhotoQrCodeTool } from '@/components/tool/PhotoQrCodeTool';
import { I18nProvider, useI18n, type Language } from '@/i18n';
import { useFavoriteTools } from '@/lib/favorites';
import { enableAnalytics, trackEvent, trackPageView } from '@/lib/analytics';
import { adConfig } from '@/lib/ads/adConfig';

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://ahadex.online';
type Theme = 'light' | 'dark';
type ConsentChoice = 'unknown' | 'essential' | 'measurement';

const metaByLang: Record<Language, Record<string, { title: string; description: string; h1: string }>> = {
  en: {
    '/': {
      title: 'Free Online Tools — Ahadex Tools',
      description: 'Fast, useful browser tools for images, documents, text and developer tasks. No account required.',
      h1: 'Make the small stuff feel small.',
    },
    '/tools': {
      title: 'Online Tool Library — Ahadex Tools',
      description: 'Handcrafted browser utilities designed to solve everyday tasks instantly — 100% private, client-side, and ad-light.',
      h1: 'Smart tools for swift work.',
    },
    '/about': {
      title: 'About Ahadex Tools',
      description: 'Learn why Ahadex Tools exists and how we build useful, accessible browser utilities.',
      h1: 'The internet has enough complicated helpers.',
    },
    '/contact': {
      title: 'Contact Ahadex Tools',
      description: 'Contact Ahadex Tools directly via email or WhatsApp support for assistance, suggestions, or feedback.',
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
  },
  bn: {
    '/': {
      title: 'ফ্রি অনলাইন ব্রাউজার টুলস — Ahadex Tools',
      description: 'ছবি, ডকুমেন্ট, টেক্সট এবং ডেভেলপারদের জন্য দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস।',
      h1: 'কঠিন ও জটিল কাজগুলো এবার হবে নিমেষেই সহজ।',
    },
    '/tools': {
      title: 'টুলস সংগ্রহশালা — Ahadex Tools',
      description: 'দৈনন্দিন কাজের জন্য তৈরি দ্রুত ও নিরাপদ ব্রাউজার টুলস — কোনো ফাইল আপলোড ছাড়াই ১০০% ক্লায়েন্ট-সাইড।',
      h1: 'সহজ সমাধান, দ্রুত কাজের নিশ্চয়তা।',
    },
    '/about': {
      title: 'আমাদের সম্পর্কে — Ahadex Tools',
      description: 'Ahadex Tools কেন তৈরি এবং কীভাবে আমরা নির্ভরযোগ্য ব্রাউজার ইউটিলিটি তৈরি করি তা জানুন।',
      h1: 'ইন্টারনেটে অতিরিক্ত জটিলতার বিপরীতে এক সরল মাধ্যম।',
    },
    '/contact': {
      title: 'যোগাযোগ করুন — Ahadex Tools',
      description: 'সরাসরি ইমেইল বা হোয়াটসঅ্যাপের মাধ্যমে Ahadex Tools টিমের সাথে যোগাযোগ করুন।',
      h1: 'যেকোনো প্রয়োজনে সরাসরি আমাদের সাথে যুক্ত হোন।',
    },
    '/privacy-policy': {
      title: 'গোপনীয়তা নীতি — Ahadex Tools',
      description: 'Ahadex Tools আপনার ডেটা এবং ব্রাউজার ফাইল প্রসেসিং কীভাবে পরিচালনা করে তা পড়ুন।',
      h1: 'গোপনীয়তা নীতি',
    },
    '/terms': {
      title: 'ব্যবহারের শর্তাবলী — Ahadex Tools',
      description: 'Ahadex Tools ব্যবহারের নিয়মাবলী ও শর্তসমূহ।',
      h1: 'ব্যবহারের শর্তাবলী',
    },
    '/disclaimer': {
      title: 'দাবিত্যাগ — Ahadex Tools',
      description: 'Ahadex Tools ব্যবহারের ফলাফল ও দায়মুক্তি সম্পর্কিত তথ্য।',
      h1: 'দাবিত্যাগ',
    },
    '/cookie-policy': {
      title: 'কুকি নীতি — Ahadex Tools',
      description: 'Ahadex Tools এর স্টোরেজ ও কুকি ব্যবহারের নিয়মাবলী।',
      h1: 'কুকি নীতি',
    },
    '/accessibility': {
      title: 'অ্যাক্সেসিবিলিটি — Ahadex Tools',
      description: 'Ahadex Tools এর কীবোর্ড ও রিডিউসড-মোশন অ্যাক্সেসিবিলিটি তথ্য।',
      h1: 'অ্যাক্সেসিবিলিটি',
    },
  },
};

function usePageMeta(pathname: string) {
  const { language } = useI18n();
  useEffect(() => {
    const toolSlug = pathname.startsWith('/tool/') ? pathname.replace('/tool/', '') : '';
    const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
    const categorySlug = pathname.startsWith('/category/') ? pathname.replace('/category/', '') : '';
    const category = categoryList.find((candidate) => candidate.toLowerCase() === categorySlug.toLowerCase() && candidate !== 'All');

    const localizedMap = metaByLang[language] ?? metaByLang.en;
    const current = tool
      ? { title: tool.seo.title, description: tool.seo.description, h1: tool.seo.h1 }
      : category
        ? {
            title: language === 'bn' ? `${category} টুলস — Ahadex Tools` : `${category} Tools — Ahadex Tools`,
            description: language === 'bn' ? `Ahadex Tools এর সব ${category.toLowerCase()} টুলস দেখুন।` : `Browse useful ${category.toLowerCase()} tools from Ahadex Tools.`,
            h1: `${category} tools`,
          }
      : localizedMap[pathname] ?? {
          title: language === 'bn' ? 'পেজ পাওয়া যায়নি — Ahadex Tools' : 'Page not found — Ahadex Tools',
          description: language === 'bn' ? 'অনুরোধকৃত পেজটি পাওয়া যায়নি। টুলস লাইব্রেরি দেখুন।' : 'The page you requested could not be found. Browse the Ahadex Tools library instead.',
          h1: language === 'bn' ? 'পেজ পাওয়া যায়নি' : 'Page not found',
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
          {categoryList.map((category) => (
            <Link key={category} to={category === 'All' ? '/tools' : `/category/${category.toLowerCase()}`} onClick={closeTools}>
              {category === 'All' ? copy.allCategory : category}
            </Link>
          ))}
        </nav>
      </MobileDrawer>
      <MobileDrawer side="right" open={settingsOpen} title={copy.settings} onClose={closeSettings}>
        <div className="settings-list">
          <span className="drawer-label">{copy.settings}</span>
          <button type="button" className={`setting-choice${theme === 'light' ? ' active' : ''}`} onClick={() => setTheme('light')}><Sun size={15} /> {copy.themeLight}</button>
          <button type="button" className={`setting-choice${theme === 'dark' ? ' active' : ''}`} onClick={() => setTheme('dark')}><Moon size={15} /> {copy.themeDark}</button>
          <span className="drawer-label">{copy.languageLabel}</span>
          <button type="button" className={`setting-choice${language === 'en' ? ' active' : ''}`} onClick={() => setLanguage('en')}>English</button>
          <button type="button" className={`setting-choice${language === 'bn' ? ' active' : ''}`} onClick={() => setLanguage('bn')}>বাংলা</button>
          <span className="drawer-label">{copy.motion}</span>
          <p className="drawer-note">{copy.reducedMotionNote}</p>
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
          <div className="footer-brand"><Logo /><p>{copy.footerDescription}</p></div>
          <div className="footer-links">
            <div>
              <h4>{copy.exploreHeader}</h4>
              <Link className="footer-link" to="/tools">{copy.tools}</Link>
              <Link className="footer-link" to="/about">{copy.about}</Link>
              <Link className="footer-link" to="/contact">{copy.contact}</Link>
            </div>
            <div>
              <h4>{copy.trustHeader}</h4>
              <Link className="footer-link" to="/privacy-policy">{copy.privacy}</Link>
              <Link className="footer-link" to="/terms">{copy.terms}</Link>
              <Link className="footer-link" to="/disclaimer">{copy.disclaimer}</Link>
              <Link className="footer-link" to="/cookie-policy">{copy.cookiePolicy}</Link>
              <Link className="footer-link" to="/accessibility">{copy.accessibility}</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{copy.footerCopyright}</span>
          <span>{copy.footerTagline}</span>
        </div>
      </div>
    </footer>
  );
}

function ToolCard({ tool, index }: { tool: ToolDefinition; index: number }) {
  const { copy } = useI18n();
  const { isFavorite, toggleFavorite } = useFavoriteTools();
  const Icon = tool.icon;
  const isFav = isFavorite(tool.id);

  const favButton = (
    <button
      type="button"
      className={`tool-favorite-btn ${isFav ? 'active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(tool.id);
        trackEvent('tool_favorite_toggle', { tool_id: tool.id, is_favorite: !isFav });
      }}
      title={isFav ? copy.removeFromFavorites : copy.pinToFavorites}
      aria-label={isFav ? copy.removeFromFavorites : copy.pinToFavorites}
    >
      <Star size={16} fill={isFav ? 'currentColor' : 'none'} strokeWidth={isFav ? 1.5 : 2} />
    </button>
  );

  const content = (
    <>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
          <span className="tool-icon" style={{ '--tool-color': tool.color, margin: 0 } as CSSProperties}>
            <Icon size={21} />
          </span>
          {favButton}
        </div>
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </div>
      <div className="tool-card-foot">
        <span>{tool.status === 'live' ? copy.liveNow : copy.planned}</span>
        <ArrowRight size={16} />
      </div>
    </>
  );
  if (tool.status !== 'live') {
    return (
      <div
        className="tool-card reveal"
        style={{ '--tool-color': tool.color, animationDelay: `${index * 55}ms` } as CSSProperties}
        aria-label={`${tool.name} — ${copy.planned}`}
      >
        {content}
      </div>
    );
  }
  return (
    <Link
      to={tool.route}
      className="tool-card reveal"
      style={{ '--tool-color': tool.color, animationDelay: `${index * 55}ms` } as CSSProperties}
      onClick={() => trackEvent('tool_open', { tool_id: tool.id, tool_slug: tool.slug, category: tool.category })}
    >
      {content}
    </Link>
  );
}

function Home({ consent }: { consent: ConsentChoice }) {
  const { copy } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="reveal">
            <span className="eyebrow">{copy.heroEyebrow}</span>
            <h1>{copy.heroH1}</h1>
            <p className="hero-copy">{copy.heroCopy}</p>
            <div className="hero-ctas">
              <Link to="/tools" className="button button-primary" onClick={() => trackEvent('tool_open', { source: 'hero' })}>
                {copy.exploreTools} <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="button button-ghost">
                {copy.whyAhadex}
              </Link>
            </div>
            <div className="micro-trust">
              <span className="trust-dot" /> {copy.microTrust}
            </div>
          </div>
          <div className="hero-art reveal delay-2" aria-label="Abstract illustration of connected utilities">
            <div className="art-panel">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />
              <span className="orb orb-a" />
              <span className="orb orb-b" />
              <span className="orb orb-c" />
              <div className="art-card">
                <span>AHX / 001</span>
                <strong>lighter work</strong>
                <small>one focused tool at a time</small>
              </div>
              <div className="art-label">THE TOOLKIT, IN MOTION</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{copy.homeStartHereEyebrow}</span>
              <h2>{copy.homeStartHereTitle}</h2>
            </div>
            <p>{copy.homeStartHereCopy}</p>
          </div>
          <div className="tool-grid">
            {tools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
          <AdSlot enabled={consent === 'measurement'} slot={adConfig.homeSlot} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="steps">
            <div>
              <span className="eyebrow">{copy.theAhadexWay}</span>
              <h2>{copy.usefulIsAFeeling}</h2>
              <div className="stat-strip">
                <div className="stat">
                  <strong>{copy.stat01Num}</strong>
                  <span>{copy.stat01Label}</span>
                </div>
                <div className="stat">
                  <strong>{copy.stat02Num}</strong>
                  <span>{copy.stat02Label}</span>
                </div>
                <div className="stat">
                  <strong>{copy.stat03Num}</strong>
                  <span>{copy.stat03Label}</span>
                </div>
              </div>
            </div>
            <div className="step-list">
              <div className="step">
                <span className="step-number">01 /</span>
                <div>
                  <h3>{copy.step1Title}</h3>
                  <p>{copy.step1Desc}</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">02 /</span>
                <div>
                  <h3>{copy.step2Title}</h3>
                  <p>{copy.step2Desc}</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">03 /</span>
                <div>
                  <h3>{copy.step3Title}</h3>
                  <p>{copy.step3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container faq-wrap">
          <div>
            <span className="eyebrow">{copy.faqEyebrow}</span>
            <h2>{copy.faqTitle}</h2>
          </div>
          <div className="faq-list">
            {copy.faqItems.map(([question, answer], index) => {
              const open = openFaq === index;
              return (
                <div className="faq-item" key={question}>
                  <button
                    className={`faq-question${open ? ' open' : ''}`}
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span>{question}</span>
                    {open ? <X size={17} /> : <Plus size={17} />}
                  </button>
                  <div className={`faq-answer${open ? ' open' : ''}`}>
                    <p>{answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad Placement on Home Page */}
      <div className="container" style={{ margin: '30px auto' }}>
        <AdSlot enabled={true} slot={adConfig.homeSlot} label="Sponsored Ad" />
      </div>
    </main>
  );
}

function ToolsPage({ initialCategory = 'All' }: { initialCategory?: 'All' | 'Favorites' | ToolCategory }) {
  const { copy } = useI18n();
  const { favoriteIds } = useFavoriteTools();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<'All' | 'Favorites' | ToolCategory>(initialCategory);
  const query = searchParams.get('query') ?? '';
  const filtered = useMemo(
    () =>
      tools.filter((tool) => {
        const matchesCategory =
          category === 'All'
            ? true
            : category === 'Favorites'
            ? favoriteIds.includes(tool.id)
            : tool.category === category;
        const matchesQuery = `${tool.name} ${tool.description} ${tool.keywords.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [category, query, favoriteIds],
  );
  const setQuery = (value: string) => setSearchParams(value ? { query: value } : {});
  const favoriteCount = favoriteIds.length;

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">{copy.toolsPageEyebrow}</span>
          <h1>{copy.toolsPageH1}</h1>
          <p>{copy.toolsPageCopy}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="library-toolbar">
            <label className="search-field">
              <Search size={16} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchTools}
                aria-label={copy.searchTools}
              />
            </label>
            <span className="muted mono" style={{ fontSize: 11 }}>
              {filtered.length} / {tools.length} {copy.filterCountSuffix}
            </span>
          </div>
          <div className="category-tabs" role="tablist" aria-label="Tool categories">
            <button
              className={`category-tab${category === 'All' ? ' active' : ''}`}
              type="button"
              role="tab"
              aria-selected={category === 'All'}
              onClick={() => {
                setCategory('All');
                trackEvent('category_open', { category: 'All' });
              }}
            >
              {copy.allCategory}
            </button>

            <button
              className={`category-tab${category === 'Favorites' ? ' active' : ''}`}
              type="button"
              role="tab"
              aria-selected={category === 'Favorites'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              onClick={() => {
                setCategory('Favorites');
                trackEvent('category_open', { category: 'Favorites' });
              }}
            >
              <Star size={13} fill={category === 'Favorites' ? 'currentColor' : 'none'} style={{ color: category === 'Favorites' ? 'currentColor' : '#f59e0b' }} />
              <span>{copy.favoritesCategory}</span>
              {favoriteCount > 0 && (
                <span
                  style={{
                    background: category === 'Favorites' ? 'hsl(var(--primary-foreground) / .2)' : 'hsl(var(--secondary))',
                    padding: '1px 6px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {favoriteCount}
                </span>
              )}
            </button>

            {categoryList.filter((item) => item !== 'All').map((item) => (
              <button
                key={item}
                className={`category-tab${category === item ? ' active' : ''}`}
                type="button"
                role="tab"
                aria-selected={category === item}
                onClick={() => {
                  setCategory(item);
                  trackEvent('category_open', { category: item });
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="tool-grid" style={{ marginTop: 25 }}>
            {filtered.length ? (
              filtered.map((tool, index) => <ToolCard key={tool.id} tool={tool} index={index} />)
            ) : category === 'Favorites' ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <Star size={32} style={{ color: '#f59e0b', margin: '0 auto 8px' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '4px 0' }}>{copy.favoritesCategory}</h3>
                <p style={{ maxWidth: 420, margin: '0 auto 16px', color: 'hsl(var(--muted-foreground))' }}>{copy.noFavoritesYet}</p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setCategory('All')}
                >
                  {copy.allCategory}
                </button>
              </div>
            ) : (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <Search size={23} />
                <p>
                  {copy.noToolsMatch} “{query}”.
                </p>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => {
                    setQuery('');
                    setCategory('All');
                  }}
                >
                  {copy.clearSearch}
                </button>
              </div>
            )}
          </div>
          {/* AdSense Placement in Tool Library */}
          <div style={{ marginTop: 40 }}>
            <AdSlot enabled={true} slot={adConfig.librarySlot} label="Sponsored Ad" />
          </div>
        </div>
      </section>
    </main>
  );
}

function PlannedTool({ tool }: { tool: ToolDefinition }) {
  const { copy } = useI18n();
  return (
    <main className="prose-page">
      <span className="eyebrow">{tool.category} / {copy.plannedBadge}</span>
      <h1>{tool.seo.h1}</h1>
      <p style={{ fontSize: 18 }}>{tool.description}</p>
      <p>{copy.plannedIntro}</p>
      <Link to="/tools" className="button button-primary">
        <ArrowLeft size={16} /> {copy.backToTools}
      </Link>
    </main>
  );
}

function About() {
  const { copy } = useI18n();
  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">{copy.aboutEyebrow}</span>
          <h1>{copy.aboutH1}</h1>
          <p>{copy.aboutIntro}</p>
        </div>
      </div>
      <section className="section">
        <div className="container steps">
          <div>
            <span className="eyebrow">{copy.pointOfViewEyebrow}</span>
            <h2>{copy.pointOfViewTitle}</h2>
          </div>
          <div className="step-list">
            <div className="step">
              <span className="step-number">01 /</span>
              <div>
                <h3>{copy.p1Title}</h3>
                <p>{copy.p1Desc}</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">02 /</span>
              <div>
                <h3>{copy.p2Title}</h3>
                <p>{copy.p2Desc}</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">03 /</span>
              <div>
                <h3>{copy.p3Title}</h3>
                <p>{copy.p3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="cta-band">
          <div>
            <span className="eyebrow">{copy.aboutCtaEyebrow}</span>
            <h2>{copy.aboutCtaTitle}</h2>
          </div>
          <Link to="/contact" className="button">
            {copy.sendANote} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}

function Contact() {
  const { copy } = useI18n();
  const [sent, setSent] = useState(false);

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">{copy.contactEyebrow}</span>
          <h1>{copy.contactH1}</h1>
          <p>{copy.contactIntro}</p>
        </div>
      </div>
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-card">
            <h3>{copy.contactCardTitle}</h3>
            <p>{copy.contactCardDesc}</p>

            <div className="contact-methods">
              <a
                href="mailto:mdahadvi91@gmail.com"
                className="contact-method-card"
                title="Send email to mdahadvi91@gmail.com"
              >
                <div className="contact-method-icon">
                  <Mail size={18} />
                </div>
                <div className="contact-method-info">
                  <strong>{copy.emailLabel}</strong>
                  <span>mdahadvi91@gmail.com</span>
                </div>
              </a>

              <a
                href="https://wa.me/971507975837?text=Hello%20Ahadex%20Tools"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method-card"
                title="Chat on WhatsApp +971507975837"
              >
                <div className="contact-method-icon whatsapp">
                  <MessageCircle size={18} />
                </div>
                <div className="contact-method-info">
                  <strong>{copy.whatsappLabel}</strong>
                  <span>+971507975837</span>
                </div>
              </a>
            </div>

            <p className="mono" style={{ fontSize: 11, marginTop: 18, color: 'hsl(var(--muted-foreground))' }}>
              hello@ahadex.online · mdahadvi91@gmail.com
            </p>
          </div>

          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <div className="form-field">
              <label htmlFor="contact-name">{copy.formNameLabel}</label>
              <input id="contact-name" required placeholder={copy.formNamePlaceholder} />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">{copy.formEmailLabel}</label>
              <input id="contact-email" type="email" required placeholder={copy.formEmailPlaceholder} />
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">{copy.formMessageLabel}</label>
              <textarea id="contact-message" required placeholder={copy.formMessagePlaceholder} />
            </div>
            {sent ? (
              <div className="success-note" role="status">
                <Check size={15} style={{ verticalAlign: 'middle', marginRight: 5 }} /> {copy.successNote}
              </div>
            ) : (
              <button className="button button-primary" type="submit">
                {copy.sendButton} <ArrowRight size={16} />
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

function LegalPage({ pathKey }: { pathKey: 'privacyPolicy' | 'terms' | 'disclaimer' | 'cookiePolicy' | 'accessibility' }) {
  const { copy, language } = useI18n();
  const content = copy.legal[pathKey];
  const lastUpdated = language === 'bn' ? 'সর্বশেষ আপডেট: ২১ সেপ্টেম্বর ২০২৬' : 'Last updated: 21 September 2026';

  return (
    <main>
      <div className="prose-page">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p style={{ fontSize: 18 }}>{content.intro}</p>
        {content.sections.map(([heading, body]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
        <p className="mono" style={{ fontSize: 11, marginTop: 45 }}>{lastUpdated}</p>
      </div>
    </main>
  );
}

function NotFound() {
  const { copy } = useI18n();
  return (
    <main className="prose-page">
      <span className="eyebrow">{copy.pageNotFoundEyebrow}</span>
      <h1>{copy.pageNotFoundTitle}</h1>
      <p>{copy.pageNotFoundCopy}</p>
      <div className="hero-ctas">
        <Link to="/tools" className="button button-primary">
          <ArrowLeft size={16} /> {copy.backToTools}
        </Link>
        <Link to="/" className="button button-ghost">
          {copy.pageNotFoundHome}
        </Link>
      </div>
    </main>
  );
}

function ToolRoute() {
  const { toolSlug } = useParams();
  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  if (!tool) return <NotFound />;

  if (tool.status === 'live') {
    switch (tool.slug) {
      case 'image-compressor':
        return <ImageCompressor tool={tool} />;
      case 'word-counter':
        return <WordCounter tool={tool} />;
      case 'json-formatter':
        return <JsonFormatter tool={tool} />;
      case 'color-picker':
        return <ColorPickerTool tool={tool} />;
      case 'jpg-to-png':
        return <JpgToPngConverter tool={tool} />;
      case 'image-resizer':
        return <ImageResizer tool={tool} />;
      case 'pdf-to-text':
        return <PdfToTextTool tool={tool} />;
      case 'merge-pdf':
        return <MergePdfTool tool={tool} />;
      case 'photo-qr-code':
        return <PhotoQrCodeTool tool={tool} />;
      default:
        return <PlannedTool tool={tool} />;
    }
  }

  return <PlannedTool tool={tool} />;
}

function CategoryPage() {
  const { categorySlug } = useParams();
  const category = categoryList.find((candidate) => candidate.toLowerCase() === categorySlug?.toLowerCase());
  if (!category || category === 'All') return <Navigate to="/tools" replace />;
  return <ToolsPage initialCategory={category} />;
}

function ErrorFallback({ resetError }: { resetError: () => void }) {
  const { copy } = useI18n();
  return (
    <main className="prose-page">
      <span className="eyebrow">Something went wrong</span>
      <h1>The toolkit needs a reset.</h1>
      <p>This screen failed without exposing technical details. Try again or return to the tool library.</p>
      <div className="hero-ctas">
        <button type="button" className="button button-primary" onClick={resetError}>
          Try again
        </button>
        <Link to="/tools" className="button button-ghost">
          {copy.backToTools}
        </Link>
      </div>
    </main>
  );
}

function ConsentBanner({ choice, setChoice }: { choice: ConsentChoice; setChoice: (choice: ConsentChoice) => void }) {
  const { copy } = useI18n();
  if (choice !== 'unknown') return null;
  return (
    <aside className="cookie" aria-label="Privacy choices">
      <p>
        {copy.privacyNotice} <Link to="/cookie-policy" className="inline-link">Read the cookie policy.</Link>
      </p>
      <div className="cookie-actions">
        <button className="button button-ghost" type="button" onClick={() => setChoice('essential')}>
          {copy.onlyEssential}
        </button>
        <button className="button button-primary" type="button" onClick={() => setChoice('measurement')}>
          {copy.allowMeasurement}
        </button>
      </div>
    </aside>
  );
}

function FixedToolsButton() {
  const { copy } = useI18n();
  const location = useLocation();

  // If user is already on the Home page, the back button should not appear / have no action
  if (location.pathname === '/') {
    return null;
  }

  // From any tool, category, or inner page, button goes directly back to the Tools directory
  // If on the /tools directory page itself, clicking goes back to Home ('/')
  const isToolsPage = location.pathname === '/tools';
  const targetPath = isToolsPage ? '/' : '/tools';
  const label = isToolsPage ? copy.home : copy.backToTools;

  return (
    <aside className="fixed-nav-wrap" aria-label="Quick navigation">
      <Link
        to={targetPath}
        className="fixed-tools-btn"
        data-testid="fixed-button-back-to-tools"
        title={label}
      >
        <ArrowLeft size={16} />
        <span>{label}</span>
      </Link>
    </aside>
  );
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ahadex-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (consent === 'measurement') enableAnalytics();
  }, [consent]);

  return (
    <>
      <AdSenseProvider enabled={consent === 'measurement'} />
      <div className="app-shell">
        <Header theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<Home consent={consent} />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/tool/:toolSlug" element={<ToolRoute />} />
          <Route path="/tools/image-compressor" element={<Navigate to="/tool/image-compressor" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<LegalPage pathKey="privacyPolicy" />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/terms" element={<LegalPage pathKey="terms" />} />
          <Route path="/disclaimer" element={<LegalPage pathKey="disclaimer" />} />
          <Route path="/cookie-policy" element={<LegalPage pathKey="cookiePolicy" />} />
          <Route path="/accessibility" element={<LegalPage pathKey="accessibility" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ConsentBanner choice={consent} setChoice={setConsent} />
        <FixedToolsButton />
      </div>
    </>
  );
}

function RouteAwareLayout() {
  const location = useLocation();
  usePageMeta(location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <ErrorBoundary resetKey={location.pathname} FallbackComponent={ErrorFallback}>
      <AppLayout />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <I18nProvider>
        <RouteAwareLayout />
      </I18nProvider>
    </BrowserRouter>
  );
}

export default App;
