import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import type { ErrorFallbackProps } from './ErrorBoundary';

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { copy } = useI18n();
  return (
    <main className="prose-page">
      <span className="eyebrow">Something went wrong</span>
      <h1>The toolkit needs a reset.</h1>
      <p>This screen failed without exposing technical details. Try again or return to the tool library.</p>
      <div className="hero-ctas">
        <button type="button" className="button button-primary" onClick={resetError}>Try again</button>
        <Link to="/tools" className="button button-ghost">{copy.backToTools}</Link>
      </div>
    </main>
  );
}