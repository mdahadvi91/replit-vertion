import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { updateDocumentMeta } from '@/lib/seo';

export default function NotFoundPage() {
  const { copy, language, getLocalizedPath } = useI18n();

  useEffect(() => {
    updateDocumentMeta({
      title: language === 'bn' ? '৪০৪ / পেজ পাওয়া যায়নি — Ahadex Tools' : '404 / Page Not Found — Ahadex Tools',
      description: language === 'bn' ? 'অনুরোধকৃত পেজটি পাওয়া যায়নি। টুলস লাইব্রেরি দেখুন।' : 'The page you requested could not be found. Browse the Ahadex Tools library instead.',
      robots: 'noindex, nofollow',
      language,
    });
  }, [language]);

  return (
    <main className="prose-page" role="main">
      <span className="eyebrow">{copy.pageNotFoundEyebrow}</span>
      <h1>{copy.pageNotFoundTitle}</h1>
      <p>{copy.pageNotFoundCopy}</p>
      <div className="hero-ctas">
        <Link to={getLocalizedPath('/tools')} className="button button-primary">
          <ArrowLeft size={16} /> {copy.backToTools}
        </Link>
        <Link to={getLocalizedPath('/')} className="button button-ghost">
          {copy.pageNotFoundHome}
        </Link>
      </div>
    </main>
  );
}
