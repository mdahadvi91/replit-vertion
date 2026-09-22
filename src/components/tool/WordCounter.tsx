import { useState, useMemo } from 'react';
import { ArrowLeft, Copy, Check, RotateCcw, Sparkles, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ToolDefinition, getRelatedTools } from '@/data/tools';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/lib/ads/adConfig';

export function WordCounter({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
      };
    }

    // Word count supporting Unicode (including Bengali and English)
    const wordsArray = raw.split(/\s+/).filter(Boolean);
    const words = wordsArray.length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;
    
    // Sentences count: splitting by '.', '!', '?', or '।' (Bengali Dari)
    const sentences = raw.split(/[.!?।]+/).filter((s) => s.trim().length > 0).length || 1;
    
    // Paragraphs count: splitting by newlines
    const paragraphs = raw.split(/\n+/).filter((p) => p.trim().length > 0).length || 1;

    // Reading time: avg 200 words per minute
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    // Speaking time: avg 130 words per minute
    const speakingTimeMinutes = Math.max(1, Math.ceil(words / 130));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('tool_success', { tool_id: tool.id, action: 'copy_text' });
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    setText('');
    trackEvent('tool_process', { tool_id: tool.id, action: 'clear' });
  };

  return (
    <main className="workspace">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/tools">{copy.tools}</Link>
          <span>/</span>
          <span>{tool.category}</span>
          <span>/</span>
          <strong>{tool.name}</strong>
        </nav>
        <Link to="/tools" className="back-link">
          <ArrowLeft size={15} /> {copy.backToTools}
        </Link>
        <div className="workspace-head">
          <div>
            <span className="eyebrow">{tool.category} / {copy.liveNow}</span>
            <h1>{tool.seo.h1}</h1>
            <p className="muted workspace-intro">{tool.content.intro}</p>
          </div>
          <span className="mono muted workspace-badge">{copy.workspaceBadge}</span>
        </div>

        <div className="workspace-grid">
          <section className="workspace-main" aria-label="Word counter workspace">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label htmlFor="word-counter-input" style={{ fontWeight: 600, fontSize: 14 }}>
                {language === 'bn' ? 'আপনার টেক্সট এখানে লিখুন বা পেস্ট করুন:' : 'Type or paste your text below:'}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={handleCopy}
                  disabled={!text}
                  style={{ padding: '6px 12px', fontSize: 13 }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied!') : (language === 'bn' ? 'কপি করুন' : 'Copy Text')}</span>
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={handleClear}
                  disabled={!text}
                  style={{ padding: '6px 12px', fontSize: 13 }}
                >
                  <RotateCcw size={14} />
                  <span>{language === 'bn' ? 'মুছে ফেলুন' : 'Clear'}</span>
                </button>
              </div>
            </div>

            <textarea
              id="word-counter-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={language === 'bn' ? 'এখানে আপনার লেখা পেস্ট করুন বা টাইপ করা শুরু করুন…' : 'Start typing or paste your content here to see instant live statistics…'}
              rows={12}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 12,
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontFamily: 'inherit',
                fontSize: 15,
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
              }}
            />

            {/* Statistics Banner */}
            <div
              style={{
                marginTop: 20,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 12,
              }}
            >
              <div style={{ padding: '14px 16px', background: 'hsl(var(--secondary) / .5)', borderRadius: 12, border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                  {language === 'bn' ? 'মোট শব্দ (Words)' : 'Words'}
                </span>
                <strong style={{ fontSize: 24, fontWeight: 700, color: 'hsl(var(--primary))' }}>{stats.words}</strong>
              </div>

              <div style={{ padding: '14px 16px', background: 'hsl(var(--secondary) / .5)', borderRadius: 12, border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                  {language === 'bn' ? 'অক্ষর (Characters)' : 'Characters'}
                </span>
                <strong style={{ fontSize: 24, fontWeight: 700, color: 'hsl(var(--foreground))' }}>{stats.characters}</strong>
              </div>

              <div style={{ padding: '14px 16px', background: 'hsl(var(--secondary) / .5)', borderRadius: 12, border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                  {language === 'bn' ? 'স্পেস ছাড়া অক্ষর' : 'No Spaces'}
                </span>
                <strong style={{ fontSize: 24, fontWeight: 700, color: 'hsl(var(--foreground))' }}>{stats.charactersNoSpaces}</strong>
              </div>

              <div style={{ padding: '14px 16px', background: 'hsl(var(--secondary) / .5)', borderRadius: 12, border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                  {language === 'bn' ? 'বাক্য (Sentences)' : 'Sentences'}
                </span>
                <strong style={{ fontSize: 24, fontWeight: 700, color: 'hsl(var(--foreground))' }}>{stats.sentences}</strong>
              </div>

              <div style={{ padding: '14px 16px', background: 'hsl(var(--secondary) / .5)', borderRadius: 12, border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                  {language === 'bn' ? 'প্যারাগ্রাফ (Paragraphs)' : 'Paragraphs'}
                </span>
                <strong style={{ fontSize: 24, fontWeight: 700, color: 'hsl(var(--foreground))' }}>{stats.paragraphs}</strong>
              </div>

              <div style={{ padding: '14px 16px', background: 'hsl(var(--secondary) / .5)', borderRadius: 12, border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                  {language === 'bn' ? 'পড়ার সময় (Reading)' : 'Reading Time'}
                </span>
                <strong style={{ fontSize: 20, fontWeight: 700, color: 'hsl(var(--primary))' }}>
                  ~{stats.readingTimeMinutes} {language === 'bn' ? 'মিনিট' : 'min'}
                </strong>
              </div>
            </div>

            {/* In-depth educational content for SEO & AdSense approval */}
            <div className="tool-content">
              <h2>{copy.howToUse}</h2>
              <ol>
                {tool.content.howToUse.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h2>{copy.privacyAndLimitations}</h2>
              <p>{tool.content.privacy}</p>
              <p>{tool.content.limitations}</p>
              <h2>{copy.faqTitle}</h2>
              <div className="faq-list">
                {tool.content.faq.map(({ question, answer }) => (
                  <details key={question} className="tool-faq">
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Strategic Ad Placement */}
            <AdSlot enabled={true} slot={adConfig.toolSlot} label="Sponsored Ad" />
          </section>

          <aside className="workspace-side">
            <p className="side-label">{language === 'bn' ? 'কুইক টুলস ও ফিল্টার' : 'Quick Actions'}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setText((prev) => prev.toUpperCase())}
                disabled={!text}
                style={{ justifyContent: 'flex-start' }}
              >
                <Sparkles size={14} /> {language === 'bn' ? 'সব বড় হাতের (UPPERCASE)' : 'Convert to UPPERCASE'}
              </button>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setText((prev) => prev.toLowerCase())}
                disabled={!text}
                style={{ justifyContent: 'flex-start' }}
              >
                <Sparkles size={14} /> {language === 'bn' ? 'সব ছোট হাতের (lowercase)' : 'Convert to lowercase'}
              </button>
              <button
                type="button"
                className="button button-ghost"
                onClick={() =>
                  setText((prev) =>
                    prev.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
                  )
                }
                disabled={!text}
                style={{ justifyContent: 'flex-start' }}
              >
                <Sparkles size={14} /> {language === 'bn' ? 'ক্যাপিটালাইজ (Title Case)' : 'Capitalize Words'}
              </button>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setText((prev) => prev.replace(/\s+/g, ' ').trim())}
                disabled={!text}
                style={{ justifyContent: 'flex-start' }}
              >
                <Sparkles size={14} /> {language === 'bn' ? 'অতিরিক্ত স্পেস কমান' : 'Remove Extra Spaces'}
              </button>
            </div>

            <div style={{ marginTop: 24, padding: 14, background: 'hsl(var(--card))', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
              <strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                {language === 'bn' ? '১০০% ব্রাউজার প্রসেসিং' : '100% Client-Side Privacy'}
              </strong>
              <small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, lineHeight: 1.5, display: 'block' }}>
                {language === 'bn'
                  ? 'আপনার লেখা টেক্সট সরাসরি আপনার ডিভাইসে প্রসেস হচ্ছে। কোনো ডাটা সার্ভারে পাঠানো হয় না।'
                  : 'All text analysis executes entirely in your browser memory. Nothing is ever sent to any remote server.'}
              </small>
            </div>
          </aside>
        </div>

        {/* Related Tools */}
        <div style={{ marginTop: 40 }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">{copy.exploreHeader}</span>
              <h2>{copy.relatedToolsTitle}</h2>
            </div>
          </div>
          <div className="tool-grid">
            {getRelatedTools(tool).map((candidate) => {
              const Icon = candidate.icon;
              return (
                <Link
                  key={candidate.id}
                  to={candidate.route}
                  className="tool-card"
                  style={{ '--tool-color': candidate.color } as any}
                >
                  <div>
                    <span className="tool-icon">
                      <Icon size={21} />
                    </span>
                    <h3>{candidate.name}</h3>
                    <p>{candidate.description}</p>
                  </div>
                  <div className="tool-card-foot">
                    <span>{candidate.status === 'live' ? copy.liveNow : copy.planned}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
