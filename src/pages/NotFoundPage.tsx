import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';

export default function NotFoundPage() {
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
