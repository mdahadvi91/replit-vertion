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
      description: 'ছবি, ডকুমেন্ট, টেক্সট এবং ডেভেলপারদের জন্য দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস। কোনো সার্ভার আপলোড ছাড়া শতভাগ নিরাপদ।',
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
  const { language, setLanguage } = useI18n();

  useEffect(() => {
    const isBn = pathname === '/bn' || pathname.startsWith('/bn/');
    const currentLang: Language = isBn ? 'bn' : 'en';

    // Synchronize language state if URL does not match current state
    if (language !== currentLang) {
      setLanguage(currentLang);
    }

    // Determine normalized logical path without /bn prefix
    const normalizedPath = isBn ? (pathname.slice(3) || '/') : pathname;

    const toolSlug = normalizedPath.startsWith('/tool/') ? normalizedPath.replace('/tool/', '') : '';
    const rawTool = toolSlug ? getToolBySlug(toolSlug) : undefined;
    const tool = rawTool ? getLocalizedTool(rawTool, currentLang) : undefined;

    const categorySlug = normalizedPath.startsWith('/category/') ? normalizedPath.replace('/category/', '') : '';
    const category = categoryList.find(
      (candidate) => candidate.toLowerCase() === categorySlug.toLowerCase() && candidate !== 'All'
    );

    const localizedMap = metaByLang[currentLang] ?? metaByLang.en;
    const is404 = !tool && !category && !localizedMap[normalizedPath];

    const current = tool
      ? { title: tool.seo.title, description: tool.seo.description, h1: tool.seo.h1 }
      : category
        ? {
            title: currentLang === 'bn' ? `${category} টুলস — Ahadex Tools` : `${category} Tools — Ahadex Tools`,
            description:
              currentLang === 'bn'
                ? `Ahadex Tools এর সব ${category.toLowerCase()} টুলস দেখুন।`
                : `Browse useful ${category.toLowerCase()} tools from Ahadex Tools.`,
            h1: `${category} tools`,
          }
        : is404
          ? {
              title: currentLang === 'bn' ? '৪০৪ / পেজ পাওয়া যায়নি — Ahadex Tools' : '404 / Page Not Found — Ahadex Tools',
              description:
                currentLang === 'bn'
                  ? 'অনুরোধকৃত পেজটি পাওয়া যায়নি। টুলস লাইব্রেরি দেখুন।'
                  : 'The page you requested could not be found. Browse the Ahadex Tools library instead.',
              h1: currentLang === 'bn' ? 'পেজ পাওয়া যায়নি' : 'Page not found',
            }
          : localizedMap[normalizedPath];

    const canonicalLogicalPath = tool?.seo.canonical ?? normalizedPath;
    const canonicalUrl = `${SITE_URL}${isBn ? '/bn' : ''}${canonicalLogicalPath === '/' ? '' : canonicalLogicalPath}`;
    const alternateEnUrl = `${SITE_URL}${canonicalLogicalPath === '/' ? '' : canonicalLogicalPath}`;
    const alternateBnUrl = `${SITE_URL}/bn${canonicalLogicalPath === '/' ? '' : canonicalLogicalPath}`;
    const alternateDefaultUrl = `${SITE_URL}${canonicalLogicalPath === '/' ? '' : canonicalLogicalPath}`;

    const schema = is404
      ? undefined
      : {
          '@context': 'https://schema.org',
          '@type': tool ? 'WebApplication' : 'WebSite',
          name: tool ? tool.name : 'Ahadex Tools',
          description: current.description,
          url: canonicalUrl,
          applicationCategory: tool ? 'UtilitiesApplication' : undefined,
          operatingSystem: 'Web',
          inLanguage: currentLang === 'bn' ? 'bn-BD' : 'en-US',
          isPartOf: { '@type': 'WebSite', name: 'Ahadex Tools', url: SITE_URL },
        };

    updateDocumentMeta({
      title: current.title,
      description: current.description,
      canonicalUrl: is404 ? undefined : canonicalUrl,
      robots: is404 ? 'noindex, nofollow' : 'index, follow',
      language: currentLang,
      alternateEnUrl: is404 ? undefined : alternateEnUrl,
      alternateBnUrl: is404 ? undefined : alternateBnUrl,
      alternateDefaultUrl: is404 ? undefined : alternateDefaultUrl,
      schema,
    });

    trackPageView(pathname, current.title);
  }, [language, pathname, setLanguage]);
}

function ConsentBanner({ choice, setChoice }: { choice: ConsentChoice; setChoice: (choice: ConsentChoice) => void }) {
  const { copy, getLocalizedPath } = useI18n();
  if (choice !== 'unknown') return null;
  return (
    <aside className="cookie" aria-label="Privacy choices">
      <p>
        {copy.privacyNotice} <Link to={getLocalizedPath('/cookie-policy')} className="inline-link">Read the cookie policy.</Link>
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
  const { copy, getLocalizedPath } = useI18n();
  const location = useLocation();

  const isBn = location.pathname === '/bn' || location.pathname.startsWith('/bn/');
  const normalizedPath = isBn ? (location.pathname.slice(3) || '/') : location.pathname;

  // If user is already on the Home page, the back button should not appear
  if (normalizedPath === '/') {
    return null;
  }

  const isToolsPage = normalizedPath === '/tools';
  const targetPath = getLocalizedPath(isToolsPage ? '/' : '/tools');
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
          {/* English / Default Routes */}
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

          {/* Bengali localized routes for dedicated SEO crawlability */}
          <Route path="/bn" element={<HomePage consent={consent} />} />
          <Route path="/bn/tools" element={<ToolsPage />} />
          <Route path="/bn/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/bn/tool/:toolSlug" element={<ToolPage />} />
          <Route path="/bn/tools/image-compressor" element={<Navigate to="/bn/tool/image-compressor" replace />} />
          <Route path="/bn/about" element={<AboutPage />} />
          <Route path="/bn/contact" element={<ContactPage />} />
          <Route path="/bn/privacy-policy" element={<LegalPage pathKey="privacyPolicy" />} />
          <Route path="/bn/privacy" element={<Navigate to="/bn/privacy-policy" replace />} />
          <Route path="/bn/terms" element={<LegalPage pathKey="terms" />} />
          <Route path="/bn/disclaimer" element={<LegalPage pathKey="disclaimer" />} />
          <Route path="/bn/cookie-policy" element={<LegalPage pathKey="cookiePolicy" />} />
          <Route path="/bn/accessibility" element={<LegalPage pathKey="accessibility" />} />

          {/* Soft 404 Catcher */}
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
