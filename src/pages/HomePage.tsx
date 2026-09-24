import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tools, getLocalizedTool } from '@/registry/tool-registry';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { useConsent, type ConsentState } from '@/features/consent';
import ToolCard from '@/components/tool/ToolCard';

export default function HomePage({ consent }: { consent?: ConsentState | { advertising: boolean } }) {
  const { copy, language, getLocalizedPath } = useI18n();
  const { consent: consentState } = useConsent();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const advertisingConsent = consent?.advertising ?? consentState.advertising;
  const localizedTools = useMemo(() => tools.map((tool) => getLocalizedTool(tool, language)), [language]);

  const honestMicroTrust = language === 'bn'
    ? 'লোকাল ব্রাউজার প্রসেসিং · অ্যাকাউন্ট ছাড়াই ব্যবহারযোগ্য · তাৎক্ষণিক ফলাফল'
    : 'Local Browser Processing · No Sign-Up Needed · Instant Results';

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="reveal">
            <span className="eyebrow">{copy.heroEyebrow}</span>
            <h1>{copy.heroH1}</h1>
            <p className="hero-copy">{copy.heroCopy}</p>
            <div className="hero-ctas">
              <Link to={getLocalizedPath('/tools')} className="button button-primary" onClick={() => trackEvent('tool_open', { source: 'hero' })}>
                {copy.exploreTools} <ArrowRight size={16} />
              </Link>
              <Link to={getLocalizedPath('/about')} className="button button-ghost">
                {copy.whyAhadex}
              </Link>
            </div>
            <div className="micro-trust">
              <span className="trust-dot" /> {honestMicroTrust}
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
            {localizedTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
          <AdSlot enabled={advertisingConsent} slot={adConfig.homeSlot} />
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
              const isOpen = openFaq === index;
              return (
                <div className="faq-item" key={question}>
                  <button
                    className={`faq-question${isOpen ? ' open' : ''}`}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{question}</span>
                    <span className="faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen ? (
                    <div className="faq-answer open">
                      <p>{answer}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <div>
            <span className="eyebrow">{copy.ctaBandEyebrow}</span>
            <h2>{copy.ctaBandTitle}</h2>
          </div>
          <Link to={getLocalizedPath('/tools')} className="button">
            {copy.browseAllTools} <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="container" style={{ margin: '30px auto' }}>
        <AdSlot enabled={advertisingConsent} slot={adConfig.homeSlot} label="Sponsored Ad" />
      </div>
    </main>
  );
}
