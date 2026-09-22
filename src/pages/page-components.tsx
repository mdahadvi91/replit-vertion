import {
  useMemo,
  useState,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  MessageCircle,
  Plus,
  Search,
  Star,
  X,
} from 'lucide-react';
import {
  Link,
  Navigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { categoryList, getToolBySlug, tools, type ToolCategory, type ToolDefinition } from '@/registry/tool-registry';
import { AdSlot } from '@/components/ads/AdSlot';
import { ImageCompressor } from '@/tools/image-compressor';
import { WordCounter } from '@/tools/word-counter';
import { JsonFormatter } from '@/tools/json-formatter';
import { ColorPickerTool } from '@/tools/color-picker';
import { JpgToPngConverter } from '@/tools/jpg-to-png';
import { ImageResizer } from '@/tools/image-resizer';
import { PdfToTextTool } from '@/tools/pdf-to-text';
import { MergePdfTool } from '@/tools/merge-pdf';
import { PhotoQrCodeTool } from '@/tools/photo-qr-code';
import { useI18n } from '@/i18n';
import { useFavoriteTools } from '@/features/favorites/useFavorites';
import { trackEvent } from '@/lib/analytics';
import { adConfig } from '@/components/ads/adConfig';
import ToolCard from '@/components/tool/ToolCard';

type ConsentChoice = 'unknown' | 'essential' | 'measurement';

export function Home({ consent }: { consent: ConsentChoice }) {
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

export function ToolsPage({ initialCategory = 'All' }: { initialCategory?: 'All' | 'Favorites' | ToolCategory }) {
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

export function PlannedTool({ tool }: { tool: ToolDefinition }) {
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

export function About() {
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

export function Contact() {
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

export function LegalPage({ pathKey }: { pathKey: 'privacyPolicy' | 'terms' | 'disclaimer' | 'cookiePolicy' | 'accessibility' }) {
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

export function NotFound() {
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

export function ToolRoute() {
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

export function CategoryPage() {
  const { categorySlug } = useParams();
  const category = categoryList.find((candidate) => candidate.toLowerCase() === categorySlug?.toLowerCase());
  if (!category || category === 'All') return <Navigate to="/tools" replace />;
  return <ToolsPage initialCategory={category} />;
}

