import { useI18n } from '@/i18n';

export default function LegalPage({
  pathKey,
}: {
  pathKey: 'privacyPolicy' | 'terms' | 'disclaimer' | 'cookiePolicy' | 'accessibility';
}) {
  const { copy, language } = useI18n();
  const content = copy.legal[pathKey];
  const lastUpdated =
    language === 'bn'
      ? 'সর্বশেষ আপডেট: ২৩ সেপ্টেম্বর ২০২৬'
      : 'Last updated: 23 September 2026';

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
        <p className="mono" style={{ fontSize: 11, marginTop: 45 }}>
          {lastUpdated}
        </p>
      </div>
    </main>
  );
}
