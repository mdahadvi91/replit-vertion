import { useState, useRef } from 'react';
import { ArrowLeft, Check, Download, FileImage, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ToolDefinition, getRelatedTools } from '@/data/tools';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/lib/ads/adConfig';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function JpgToPngConverter({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);
  const [outputName, setOutputName] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setPreviewUrl(null);
    setOutputUrl(null);
    setStatus('idle');
    setMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (newFile?: File) => {
    if (!newFile) return;
    if (!newFile.type.includes('jpeg') && !newFile.name.toLowerCase().endsWith('.jpg') && !newFile.name.toLowerCase().endsWith('.jpeg')) {
      setStatus('error');
      setMessage(language === 'bn' ? 'অনুগ্রহ করে একটি সঠিক JPG অথবা JPEG ফাইল আপলোড করুন।' : 'Please choose a valid JPG or JPEG image.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    const prev = URL.createObjectURL(newFile);
    setFile(newFile);
    setPreviewUrl(prev);
    setOutputUrl(null);
    setStatus('ready');
    setMessage(language === 'bn' ? 'JPG ফাইল প্রস্তুত। PNG তে কনভার্ট করতে বাটনে চাপ দিন।' : 'File ready. Click Convert to generate a PNG.');
    trackEvent('file_upload', { tool_id: tool.id, file_size: newFile.size });
  };

  const convertToPng = async () => {
    if (!file || !previewUrl) return;
    setStatus('processing');
    setMessage(language === 'bn' ? 'ব্রাউজারে কোনো ডেটা আপলোড ছাড়াই PNG তৈরি হচ্ছে…' : 'Converting to high-quality lossless PNG…');
    trackEvent('tool_start', { tool_id: tool.id });

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = () => reject(new Error('Failed to load image into canvas.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not access canvas context');

      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Encoding failed'));
        }, 'image/png');
      });

      const convertedUrl = URL.createObjectURL(blob);
      const newName = file.name.replace(/\.(jpe?g)$/i, '') + '.png';
      setOutputUrl(convertedUrl);
      setOutputSize(blob.size);
      setOutputName(newName);
      setStatus('success');
      setMessage(language === 'bn' ? 'কনভার্ট সম্পন্ন! নিচের বাটন থেকে PNG ফাইলটি ডাউনলোড করুন।' : 'Conversion complete! Download your PNG image below.');
      trackEvent('tool_success', { tool_id: tool.id, output_size: blob.size });
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Failed to convert image.');
      trackEvent('tool_error', { tool_id: tool.id, error: err?.message });
    }
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
          <section className="workspace-main" aria-label="JPG to PNG workspace">
            <div
              className={`dropzone${file ? ' has-file' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer', textAlign: 'center', padding: '36px 20px', borderRadius: 16, border: '2px dashed hsl(var(--border))', background: 'hsl(var(--card))' }}
            >
              {previewUrl ? (
                <div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxHeight: 220, maxWidth: '100%', objectFit: 'contain', borderRadius: 8, margin: '0 auto 14px', display: 'block' }}
                  />
                  <strong>{file?.name}</strong>
                  <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                    {formatBytes(file?.size || 0)} · JPG Image
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ width: 48, height: 48, borderRadius: 24, background: 'hsl(var(--primary) / .1)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Upload size={22} />
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                    {language === 'bn' ? 'JPG ছবি এখানে টেনে আনুন বা ক্লিক করে নির্বাচন করুন' : 'Drag and drop your JPG file here, or click to browse'}
                  </p>
                  <small style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {language === 'bn' ? 'সর্বোচ্চ ২০ মেগাবাইট পর্যন্ত ফাইল সমর্থিত' : 'Supports JPG / JPEG files up to 20 MB'}
                  </small>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,image/jpeg"
                hidden
                onChange={(e) => {
                  handleFileChange(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </div>

            {message && (
              <div style={{ marginTop: 14, padding: '10px 16px', borderRadius: 10, background: status === 'error' ? 'hsl(0 80% 50% / .1)' : 'hsl(var(--secondary) / .6)', color: status === 'error' ? 'hsl(0 75% 45%)' : 'hsl(var(--foreground))', fontSize: 13 }}>
                {message}
              </div>
            )}

            {outputUrl && (
              <div style={{ marginTop: 20, padding: 18, borderRadius: 14, background: 'hsl(var(--primary) / .08)', border: '1px solid hsl(var(--primary) / .2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'hsl(var(--primary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 15 }}>{outputName}</strong>
                    <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                      PNG Format · {formatBytes(outputSize)}
                    </span>
                  </div>
                </div>
                <a
                  href={outputUrl}
                  download={outputName}
                  className="button button-primary"
                  onClick={() => trackEvent('tool_download', { tool_id: tool.id })}
                >
                  <Download size={15} /> {language === 'bn' ? 'PNG ডাউনলোড করুন' : 'Download PNG'}
                </a>
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
            <p className="side-label">{language === 'bn' ? 'কনভার্ট অ্যাকশন' : 'Actions'}</p>
            <button
              type="button"
              className="button button-primary"
              style={{ width: '100%', marginBottom: 12 }}
              disabled={!file || status === 'processing'}
              onClick={convertToPng}
            >
              <Sparkles size={15} /> {status === 'processing' ? (language === 'bn' ? 'কনভার্ট হচ্ছে…' : 'Converting…') : (language === 'bn' ? 'PNG তে রূপান্তর করুন' : 'Convert to PNG')}
            </button>

            {file && (
              <button
                type="button"
                className="button button-ghost"
                style={{ width: '100%' }}
                onClick={reset}
              >
                <RotateCcw size={14} /> {language === 'bn' ? 'নতুন ছবি বাছুন' : 'Reset / New Image'}
              </button>
            )}

            <div style={{ marginTop: 24, padding: 14, background: 'hsl(var(--card))', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
              <strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                {language === 'bn' ? 'লসলেস কোয়ালিটি' : 'Lossless Conversion'}
              </strong>
              <small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, lineHeight: 1.5, display: 'block' }}>
                {language === 'bn'
                  ? 'আপনার ছবির প্রতিটি পিক্সেল ব্রাউজার মেমোরিতে ক্যানভাস দিয়ে অবিকল সংরক্ষিত রেখে PNG তে রূপান্তরিত হয়।'
                  : 'Image pixels are decoded and re-encoded using browser Canvas2D APIs with maximum color fidelity and zero quality degradation.'}
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
