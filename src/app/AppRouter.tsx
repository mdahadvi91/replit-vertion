import {
  useEffect,
  useState,
} from 'react';
import {
  ArrowLeft,
} from 'lucide-react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { categoryList, getToolBySlug, getLocalizedTool } from '@/registry/tool-registry';
import { AdSenseProvider } from '@/components/ads/AdSenseProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { I18nProvider, useI18n, type Language } from '@/i18n';
import { enableAnalytics, trackPageView } from '@/lib/analytics';
import { updateDocumentMeta } from '@/lib/seo';
import { useConsent, type ConsentChoice } from '@/features/consent';
import HomePage from '@/pages/HomePage';
import ToolsPage from '@/pages/ToolsPage';
import ToolPage from '@/pages/ToolPage';
import CategoryPage from '@/pages/CategoryPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LegalPage from '@/pages/LegalPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://ahadex.online';
type Theme = 'light' | 'dark';

const metaByLang: Record<Language, Record<string, { title: string; description: string; h1: string }>> = {
  en: {
    '/': {
      title: 'Free Online Tools — Ahadex Tools',
      description: 'Fast, useful browser tools for images, documents, text and developer tasks. No account required.',
      h1: 'Make the small stuff feel small.',
    },
    '/tools': {
      title: 'Online Tool Library — Ahadex Tools',
      description: 'Handcrafted browser utilities designed to solve everyday tasks instantly. Your files are processed locally in your browser and are not uploaded to servers.',
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
      description: 'দৈনন্দিন কাজের জন্য তৈরি দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস। আপনার ফাইল নিরাপদে লোকাল ব্রাউজারে প্রসেস হয় এবং সার্ভারে আপলোড করা হয় না।',
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
    const rawTool = toolSlug ? getToolBySlug(toolSlug) : undefined;
    const tool = rawTool ? getLocalizedTool(rawTool, language) : undefined;
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
    updateDocumentMeta(current.title, current.description);
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
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
        <button className="button button-primary" type="button" onClick={() => setChoice('all')}>
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
  const { choice, consent, setConsent } = useConsent();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ahadex-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (consent.analytics) enableAnalytics();
  }, [consent.analytics]);

  return (
    <>
      <AdSenseProvider enabled={consent.advertising} />
      <div className="app-shell">
        <Header theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<HomePage consent={consent} />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/tool/:toolSlug" element={<ToolPage />} />
          <Route path="/tools/image-compressor" element={<Navigate to="/tool/image-compressor" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<LegalPage pathKey="privacyPolicy" />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/terms" element={<LegalPage pathKey="terms" />} />
          <Route path="/disclaimer" element={<LegalPage pathKey="disclaimer" />} />
          <Route path="/cookie-policy" element={<LegalPage pathKey="cookiePolicy" />} />
          <Route path="/accessibility" element={<LegalPage pathKey="accessibility" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <ConsentBanner choice={choice} setChoice={setConsent} />
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

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <I18nProvider>
        <RouteAwareLayout />
      </I18nProvider>
    </BrowserRouter>
  );
}
