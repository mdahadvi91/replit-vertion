import { useState, useRef } from 'react';
import { ArrowLeft, Check, Download, FileImage, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ToolDefinition, getRelatedTools } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageResizer({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
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
    if (!newFile.type.startsWith('image/')) {
      setStatus('error');
      setMessage(language === 'bn' ? 'অনুগ্রহ করে একটি ছবি ফাইল আপলোড করুন।' : 'Please choose a valid image file.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    const prev = URL.createObjectURL(newFile);
    const img = new Image();
    img.src = prev;
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setFile(newFile);
      setPreviewUrl(prev);
      setOutputUrl(null);
      setStatus('ready');
      setMessage(language === 'bn' ? 'ছবি প্রস্তুত। নতুন সাইজ লিখে রিসাইজ করুন।' : 'Image ready. Set your desired dimensions and click Resize.');
    };
    img.onerror = () => {
      setStatus('error');
      setMessage(language === 'bn' ? 'ছবিটি লোড করা সম্ভব হয়নি।' : 'Failed to read image dimensions.');
    };
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (maintainAspect && originalWidth > 0 && originalHeight > 0) {
      setTargetHeight(Math.round((w / originalWidth) * originalHeight));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (maintainAspect && originalWidth > 0 && originalHeight > 0) {
      setTargetWidth(Math.round((h / originalHeight) * originalWidth));
    }
  };

  const handleResize = async () => {
    if (!file || !previewUrl || targetWidth <= 0 || targetHeight <= 0) return;
    setStatus('processing');
    setMessage(language === 'bn' ? 'ব্রাউজারে কোনো ডেটা আপলোড ছাড়াই রিসাইজ চলছে…' : 'Resizing your image in browser memory…');
    trackEvent('tool_start', { tool_id: tool.id, width: targetWidth, height: targetHeight });

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve) => {
        img.onload = () => resolve(true);
      });

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = file.type || 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas encoding failed'));
        }, mimeType, 0.92);
      });

      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputSize(blob.size);
      setStatus('success');
      setMessage(language === 'bn' ? `ছবিটি সফলভাবে ${targetWidth}x${targetHeight} পিক্সেলে রিসাইজ করা হয়েছে!` : `Successfully resized to ${targetWidth}x${targetHeight}px!`);
      trackEvent('tool_success', { tool_id: tool.id });
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Failed to resize image.');
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
          <section className="workspace-main" aria-label="Image Resizer workspace">
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
                    {language === 'bn' ? `মূল সাইজ: ${originalWidth} × ${originalHeight} পিক্সেল (${formatBytes(file?.size || 0)})` : `Original: ${originalWidth} × ${originalHeight} px (${formatBytes(file?.size || 0)})`}
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ width: 48, height: 48, borderRadius: 24, background: 'hsl(var(--primary) / .1)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Upload size={22} />
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                    {language === 'bn' ? 'ছবি টেনে আনুন অথবা ক্লিক করে আপলোড করুন' : 'Drag and drop your image here, or click to browse'}
                  </p>
                  <small style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {language === 'bn' ? 'JPG, PNG বা WebP যেকোনো সাইজের ছবি সমর্থিত' : 'Supports JPG, PNG, and WebP images'}
                  </small>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                    <strong style={{ display: 'block', fontSize: 15 }}>{file?.name}</strong>
                    <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                      {targetWidth} × {targetHeight} px · {formatBytes(outputSize)}
                    </span>
                  </div>
                </div>
                <a
                  href={outputUrl}
                  download={`resized-${file?.name}`}
                  className="button button-primary"
                  onClick={() => trackEvent('tool_download', { tool_id: tool.id })}
                >
                  <Download size={15} /> {language === 'bn' ? 'রিসাইজ ছবি ডাউনলোড করুন' : 'Download Resized Image'}
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
            <p className="side-label">{language === 'bn' ? 'পিক্সেল ডাইমেনশন' : 'Dimensions (px)'}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
                  {language === 'bn' ? 'প্রস্থ (Width):' : 'Width (px):'}
                </label>
                <input
                  type="number"
                  value={targetWidth || ''}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  disabled={!file}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
                  {language === 'bn' ? 'উচ্চতা (Height):' : 'Height (px):'}
                </label>
                <input
                  type="number"
                  value={targetHeight || ''}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  disabled={!file}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                />
                <span>{language === 'bn' ? 'অনুপাত ঠিক রাখুন (Aspect Ratio)' : 'Lock Aspect Ratio'}</span>
              </label>

              <button
                type="button"
                className="button button-primary"
                style={{ width: '100%', marginTop: 8 }}
                disabled={!file || status === 'processing' || targetWidth <= 0 || targetHeight <= 0}
                onClick={handleResize}
              >
                <Sparkles size={15} /> {status === 'processing' ? (language === 'bn' ? 'রিসাইজ হচ্ছে…' : 'Resizing…') : (language === 'bn' ? 'রিসাইজ করুন' : 'Resize Image')}
              </button>

              {file && (
                <button
                  type="button"
                  className="button button-ghost"
                  style={{ width: '100%' }}
                  onClick={reset}
                >
                  <RotateCcw size={14} /> {language === 'bn' ? 'রিসেট' : 'Reset / Clear'}
                </button>
              )}
            </div>

            <div style={{ marginTop: 24, padding: 14, background: 'hsl(var(--card))', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
              <strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                {language === 'bn' ? 'হাই-কোয়ালিটি স্কেলিং' : 'Bicubic Image Resampling'}
              </strong>
              <small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, lineHeight: 1.5, display: 'block' }}>
                {language === 'bn'
                  ? 'আপনার ব্রাউজারের হাই কোয়ালিটি ইন্টারপোলেশন ব্যবহার করে ছবি রিসাইজ করা হয় যাতে স্পষ্টতা বজায় থাকে।'
                  : 'High quality bicubic interpolation is utilized locally, ensuring crisp edges for web and social banners.'}
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

export default ImageResizer;
