import { useState } from 'react';
import { ArrowLeft, Check, Copy, RotateCcw, Braces, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ToolDefinition, getRelatedTools } from '@/data/tools';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/lib/ads/adConfig';

export function JsonFormatter({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<2 | 4 | 'tab'>(2);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const indentation = indent === 'tab' ? '\t' : indent;
      const formatted = JSON.stringify(parsed, null, indentation);
      setOutput(formatted);
      setError(null);
      trackEvent('tool_process', { tool_id: tool.id, status: 'formatted' });
      trackEvent('tool_success', { tool_id: tool.id });
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax');
      trackEvent('tool_error', { tool_id: tool.id, error: err?.message });
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      trackEvent('tool_process', { tool_id: tool.id, status: 'minified' });
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('tool_download', { tool_id: tool.id, action: 'copy_json' });
    } catch {
      // ignore
    }
  };

  const handleLoadSample = () => {
    const sample = {
      appName: 'Ahadex Tools',
      domain: 'https://ahadex.online',
      features: ['100% Client-Side', 'Zero Server Uploads', 'Privacy-Focused'],
      stats: {
        activeTools: 8,
        freeForever: true,
        rating: 5.0,
      },
      tags: ['productivity', 'utilities', 'web-tools'],
    };
    setInput(JSON.stringify(sample));
    setError(null);
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
          <section className="workspace-main" aria-label="JSON Formatter workspace">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label htmlFor="json-input" style={{ fontWeight: 600, fontSize: 14 }}>
                {language === 'bn' ? 'কাঁচা JSON পেস্ট করুন:' : 'Input Raw JSON:'}
              </label>
              <button
                type="button"
                className="button button-ghost"
                onClick={handleLoadSample}
                style={{ padding: '6px 12px', fontSize: 13 }}
              >
                <Braces size={14} /> {language === 'bn' ? 'নমুনা JSON লোড করুন' : 'Load Sample'}
              </button>
            </div>

            <textarea
              id="json-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder='{"paste": "your unformatted JSON here", "supported": true}'
              rows={8}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 12,
                border: error ? '1px solid hsl(0 70% 50%)' : '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontFamily: 'monospace',
                fontSize: 13,
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
              }}
            />

            {error && (
              <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 8, background: 'hsl(0 80% 50% / .1)', color: 'hsl(0 75% 45%)', fontSize: 13 }}>
                ⚠️ <strong>{language === 'bn' ? 'ভুল JSON ফরম্যাট:' : 'JSON Syntax Error:'}</strong> {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, margin: '16px 0', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="button button-primary"
                onClick={handleFormat}
                disabled={!input.trim()}
              >
                <Sparkles size={15} /> {language === 'bn' ? 'ফরম্যাট করুন (Prettify)' : 'Format JSON'}
              </button>
              <button
                type="button"
                className="button button-ghost"
                onClick={handleMinify}
                disabled={!input.trim()}
              >
                {language === 'bn' ? 'এক লাইনে ছোট করুন (Minify)' : 'Minify / Compact'}
              </button>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => {
                  setInput('');
                  setOutput('');
                  setError(null);
                }}
                disabled={!input && !output}
              >
                <RotateCcw size={14} /> {language === 'bn' ? 'রিসেট' : 'Clear'}
              </button>
            </div>

            {output && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label htmlFor="json-output" style={{ fontWeight: 600, fontSize: 14, color: 'hsl(var(--primary))' }}>
                    {language === 'bn' ? 'ফরম্যাটকৃত ফলাফল:' : 'Formatted JSON Output:'}
                  </label>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={handleCopy}
                    style={{ padding: '6px 12px', fontSize: 13 }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি করুন' : 'Copy Output')}</span>
                  </button>
                </div>
                <textarea
                  id="json-output"
                  readOnly
                  value={output}
                  rows={10}
                  style={{
                    width: '100%',
                    padding: 14,
                    borderRadius: 12,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--secondary) / .4)',
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    lineHeight: 1.5,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>
            )}

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

            {/* Content-rich, policy-compliant ad placement */}
            <AdSlot enabled={true} slot={adConfig.toolSlot} label="Sponsored Ad" />
          </section>

          <aside className="workspace-side">
            <p className="side-label">{language === 'bn' ? 'ইনডেন্টেশন সেটিং' : 'Indentation'}</p>
            <div className="choice-list" role="radiogroup" aria-label="Indentation spaces">
              <label className={`choice${indent === 2 ? ' selected' : ''}`}>
                <span>
                  <strong>2 Spaces</strong>
                  <small>{language === 'bn' ? 'স্ট্যান্ডার্ড ওয়েব ডেভেলপমেন্ট' : 'Standard Web & JavaScript format'}</small>
                </span>
                <input
                  type="radio"
                  name="indent"
                  checked={indent === 2}
                  onChange={() => setIndent(2)}
                />
              </label>

              <label className={`choice${indent === 4 ? ' selected' : ''}`}>
                <span>
                  <strong>4 Spaces</strong>
                  <small>{language === 'bn' ? 'বেশি ফাঁকা ও স্পষ্ট' : 'Generous spacing for backend APIs'}</small>
                </span>
                <input
                  type="radio"
                  name="indent"
                  checked={indent === 4}
                  onChange={() => setIndent(4)}
                />
              </label>

              <label className={`choice${indent === 'tab' ? ' selected' : ''}`}>
                <span>
                  <strong>Tab</strong>
                  <small>{language === 'bn' ? 'ট্যাব ক্যারেক্টার' : 'Tab character indentation'}</small>
                </span>
                <input
                  type="radio"
                  name="indent"
                  checked={indent === 'tab'}
                  onChange={() => setIndent('tab')}
                />
              </label>
            </div>

            <div style={{ marginTop: 24, padding: 14, background: 'hsl(var(--card))', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
              <strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                {language === 'bn' ? 'নিরাপদ ও প্রাইভেট প্রসেসিং' : 'Local Validation'}
              </strong>
              <small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, lineHeight: 1.5, display: 'block' }}>
                {language === 'bn'
                  ? 'আপনার কোনো ডাটা কোনো সার্ভারে পাঠানো হয় না। ব্রাউজার সরাসরি JSON.parse এবং JSON.stringify দিয়ে নিরাপদে কাজ করে।'
                  : 'JSON parsing and formatting execute strictly inside your local browser thread. Your secrets and configuration payloads never leave your computer.'}
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
