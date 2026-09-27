import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';

export default function AboutPage() {
  const { copy, language, getLocalizedPath } = useI18n();
  const isBn = language === 'bn';

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

      {/* Engineering Standards & Technology Section */}
      <section className="section" style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: 48, paddingBottom: 48 }}>
        <div className="container">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <span className="eyebrow">{isBn ? 'প্রযুক্তি ও নিরাপত্তা' : 'Engineering & Privacy'}</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 20 }}>
              {isBn ? 'কেন লোকাল ব্রাউজার প্রসেসিং সবচেয়ে নিরাপদ?' : 'Why In-Browser Client-Side Processing Matters'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: '1.02rem', lineHeight: 1.7, color: 'hsl(var(--muted-foreground))' }}>
              <p>
                {isBn
                  ? 'ইন্টারনেটে অধিকাংশ ফাইল কনভার্টার ও টুল ব্যবহারকারীর সংবেদনশীল ছবি, পাসপোর্ট, এনআইডি এবং ব্যক্তিগত ডকুমেন্ট তাদের রিমোট ক্লাউড সার্ভারে আপলোড করে প্রসেস করে। এতে বড় ধরনের ডেটা ফাঁসের ঝুঁকি থাকে এবং আপনার মূল্যবান ডেটা তৃতীয় পক্ষের সার্ভারে সংরক্ষিত হতে পারে।'
                  : 'Traditional online file converters force users to upload sensitive contracts, ID cards, personal photographs, and business reports to remote cloud servers. This exposes your data to data leakage, server breaches, and opaque cloud retention policies.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 10 }}>
                <div style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 14, padding: 20 }}>
                  <h4 style={{ color: 'hsl(var(--primary))', margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 700 }}>
                    {isBn ? '১. শূন্য নেটওয়ার্ক আপলোড' : '1. Zero Network Uploads'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {isBn
                      ? 'Ahadex Tools আপনার ডিভাইসের লোকাল র‍্যাম ও সিপিইউ ব্যবহার করে ফাইল প্রসেস করে। ইন্টারনেটে কোনো ফাইল বাইট পাঠানো হয় না।'
                      : 'All computation executes locally via WebAssembly, HTML5 Canvas, and Web Cryptography without transmitting bytes over network sockets.'}
                  </p>
                </div>
                <div style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 14, padding: 20 }}>
                  <h4 style={{ color: 'hsl(var(--primary))', margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 700 }}>
                    {isBn ? '২. ১০০% ফ্রি ও উন্মুক্ত' : '2. No Accounts, No Paywalls'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {isBn
                      ? 'কোনো অ্যাকাউন্ট তৈরি, সাইন-ইন বা সাবস্ক্রিপশন ফি ছাড়া সকল টুলস অবাধে ও সীমাহীনভাবে ব্যবহারযোগ্য।'
                      : 'Completely free for students, researchers, developers, and businesses with zero daily quotas or forced account registrations.'}
                  </p>
                </div>
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
