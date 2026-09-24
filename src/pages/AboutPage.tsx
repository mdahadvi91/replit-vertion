import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';

export default function AboutPage() {
  const { copy, getLocalizedPath } = useI18n();

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
          <Link to={getLocalizedPath('/contact')} className="button">
            {copy.sendANote} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
