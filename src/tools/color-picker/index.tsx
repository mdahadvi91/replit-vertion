import { useState, useMemo } from 'react';
import { ArrowLeft, Check, Copy, Palette, Sparkles, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ToolDefinition } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { useConsent } from '@/features/consent';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';
import { RelatedTools } from '@/components/tool/RelatedTools';

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function ColorPickerTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language, getLocalizedPath } = useI18n();
  const { consent } = useConsent();
  const [color, setColor] = useState('#176B5D');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const rgb = useMemo(() => hexToRgb(color), [color]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const hexString = color.toUpperCase();
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const tailwindSample = `bg-[${color}] text-white`;

  const copyValue = async (val: string, label: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedFormat(label);
      setTimeout(() => setCopiedFormat(null), 1800);
      trackEvent('tool_success', { tool_id: tool.id, color: val });
    } catch {
      // ignore
    }
  };

  const handleRandomColor = () => {
    const randomHex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    setColor(randomHex);
  };

  return (
    <main className="workspace">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to={getLocalizedPath('/tools')}>{copy.tools}</Link>
          <span>/</span>
          <Link to={getLocalizedPath(`/category/${tool.category.toLowerCase()}`)}>{tool.category}</Link>
          <span>/</span>
          <strong>{tool.name}</strong>
        </nav>
        <Link to={getLocalizedPath('/tools')} className="back-link">
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
          <section className="workspace-main" aria-label="Color picker workspace">
            {/* Color preview card */}
            <div
              style={{
                borderRadius: 16,
                height: 180,
                background: color,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
                transition: 'background 0.2s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: hsl.l > 60 ? '#111827' : '#FFFFFF',
                  textShadow: hsl.l > 60 ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {hexString}
              </span>
              <span style={{ fontSize: 13, color: hsl.l > 60 ? '#374151' : '#E5E7EB' }}>
                {rgbString}
              </span>
            </div>

            {/* Inputs & Controls */}
            <div style={{ display: 'flex', gap: 14, marginTop: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: 54,
                  height: 48,
                  padding: 2,
                  borderRadius: 10,
                  border: '1px solid hsl(var(--border))',
                  cursor: 'pointer',
                  background: 'none',
                }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  if (e.target.value.startsWith('#')) setColor(e.target.value);
                  else setColor(`#${e.target.value}`);
                }}
                maxLength={7}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'monospace',
                  fontSize: 15,
                  width: 120,
                  textTransform: 'uppercase',
                }}
              />
              <button
                type="button"
                className="button button-ghost"
                onClick={handleRandomColor}
                style={{ padding: '10px 16px', fontSize: 13 }}
              >
                <Shuffle size={14} /> {language === 'bn' ? 'র‍্যান্ডম রঙ' : 'Random Color'}
              </button>
            </div>

            {/* Formats Copy List */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'hsl(var(--secondary) / .4)', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
                <div>
                  <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', display: 'block' }}>HEX Format</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: 15 }}>{hexString}</strong>
                </div>
                <button type="button" className="button button-ghost" onClick={() => copyValue(hexString, 'HEX')} style={{ padding: '6px 12px', fontSize: 12 }}>
                  {copiedFormat === 'HEX' ? <Check size={14} /> : <Copy size={14} />} {copiedFormat === 'HEX' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'hsl(var(--secondary) / .4)', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
                <div>
                  <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', display: 'block' }}>RGB Format</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: 15 }}>{rgbString}</strong>
                </div>
                <button type="button" className="button button-ghost" onClick={() => copyValue(rgbString, 'RGB')} style={{ padding: '6px 12px', fontSize: 12 }}>
                  {copiedFormat === 'RGB' ? <Check size={14} /> : <Copy size={14} />} {copiedFormat === 'RGB' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'hsl(var(--secondary) / .4)', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
                <div>
                  <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', display: 'block' }}>HSL Format</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: 15 }}>{hslString}</strong>
                </div>
                <button type="button" className="button button-ghost" onClick={() => copyValue(hslString, 'HSL')} style={{ padding: '6px 12px', fontSize: 12 }}>
                  {copiedFormat === 'HSL' ? <Check size={14} /> : <Copy size={14} />} {copiedFormat === 'HSL' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'hsl(var(--secondary) / .4)', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
                <div>
                  <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', display: 'block' }}>Tailwind CSS</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: 14 }}>{tailwindSample}</strong>
                </div>
                <button type="button" className="button button-ghost" onClick={() => copyValue(tailwindSample, 'TW')} style={{ padding: '6px 12px', fontSize: 12 }}>
                  {copiedFormat === 'TW' ? <Check size={14} /> : <Copy size={14} />} {copiedFormat === 'TW' ? 'Copied' : 'Copy'}
                </button>
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

            {/* Content-rich, policy-compliant ad placement */}
            <AdSlot enabled={consent.advertising} slot={adConfig.toolSlot} label="Sponsored Ad" />
          </section>

          <aside className="workspace-side">
            <p className="side-label">{language === 'bn' ? 'জনপ্রিয় কালার প্যালেট' : 'Curated Palettes'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {['#176B5D', '#0F766E', '#0284C7', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#334155', '#1E293B', '#000000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  style={{
                    height: 38,
                    borderRadius: 8,
                    background: preset,
                    border: color === preset ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                    cursor: 'pointer',
                  }}
                  title={preset}
                />
              ))}
            </div>

            <div style={{ marginTop: 24, padding: 14, background: 'hsl(var(--card))', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
              <strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                {language === 'bn' ? 'ডিজাইনারদের জন্য পারফেক্ট' : 'Design & Code Ready'}
              </strong>
              <small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, lineHeight: 1.5, display: 'block' }}>
                {language === 'bn'
                  ? 'সিএসএস, টেলউইন্ড বা গ্রাফিক্স সফটওয়্যারে ব্যবহারের জন্য এক ক্লিকেই কোড কপি করুন।'
                  : 'Convert colors between HEX, RGB, HSL and Tailwind utilities in real time without lag.'}
              </small>
            </div>
          </aside>
        </div>

        {/* Related Tools */}
        <RelatedTools tool={tool} />
      </div>
    </main>
  );
}

export default ColorPickerTool;
