import { useState, useRef, useEffect } from 'react';
import {
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Palette,
  Sliders,
  Eye,
} from 'lucide-react';
import type { ToolDefinition } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { useConsent } from '@/features/consent';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';
import { RelatedTools } from '@/components/tool/RelatedTools';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

type BgOption = 'transparent' | 'white' | 'blue' | 'custom';

export function BackgroundRemoverTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [bgOption, setBgOption] = useState<BgOption>('transparent');
  const [customColor, setCustomColor] = useState<string>('#3b82f6');
  const [tolerance, setTolerance] = useState<number>(32);
  const [feather, setFeather] = useState<number>(2);
  const [status, setStatus] = useState<'idle' | 'preparing' | 'segmenting' | 'compositing' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [originalUrl, setOriginalUrl] = useState<string>('');

  const resetWorkspace = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setFile(null);
    setStatus('idle');
    setErrorMessage('');
    setResultBlob(null);
    setPreviewUrl('');
    setOriginalUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে একটি ছবি সিলেক্ট করুন।' : 'Please select an image file.');
      setStatus('error');
      return;
    }

    if (selected.size > 25 * 1024 * 1024) {
      setErrorMessage(language === 'bn' ? 'ছবির আকার ২৫ মেগাবাইটের কম হতে হবে।' : 'Image size must be under 25 MB.');
      setStatus('error');
      return;
    }

    const objUrl = URL.createObjectURL(selected);
    setFile(selected);
    setOriginalUrl(objUrl);
    setStatus('idle');
    setErrorMessage('');
  };

  const processSegmentation = async () => {
    if (!file || !originalUrl) return;

    setStatus('preparing');

    await new Promise((r) => setTimeout(r, 120));
    setStatus('segmenting');

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = originalUrl;
      });

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // Processing canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('No canvas context');

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Sample border corners and edges to detect background color profile
      const sampleCoords = [
        [0, 0],
        [width - 1, 0],
        [0, height - 1],
        [width - 1, height - 1],
        [Math.floor(width / 2), 0],
        [0, Math.floor(height / 2)],
        [width - 1, Math.floor(height / 2)],
      ];

      let avgR = 0, avgG = 0, avgB = 0;
      sampleCoords.forEach(([x, y]) => {
        const idx = (y * width + x) * 4;
        avgR += data[idx];
        avgG += data[idx + 1];
        avgB += data[idx + 2];
      });
      avgR = Math.round(avgR / sampleCoords.length);
      avgG = Math.round(avgG / sampleCoords.length);
      avgB = Math.round(avgB / sampleCoords.length);

      // Chroma-luminance distance threshold
      const thresh = tolerance * 2.2;

      // Generate mask
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from background
        const dist = Math.sqrt(
          (r - avgR) ** 2 +
          (g - avgG) ** 2 +
          (b - avgB) ** 2
        );

        if (dist < thresh) {
          // Soft feathering edge transition
          const alphaRatio = dist / thresh;
          data[i + 3] = Math.max(0, Math.min(255, Math.floor(alphaRatio ** 1.8 * 255)));
        }
      }

      ctx.putImageData(imgData, 0, 0);

      setStatus('compositing');
      await new Promise((r) => setTimeout(r, 100));

      // Composite onto final canvas with requested background
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = width;
      finalCanvas.height = height;
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) throw new Error('No final context');

      if (bgOption !== 'transparent') {
        const fillMap: Record<string, string> = {
          white: '#ffffff',
          blue: '#1d4ed8', // official passport blue
          custom: customColor,
        };
        finalCtx.fillStyle = fillMap[bgOption] || '#ffffff';
        finalCtx.fillRect(0, 0, width, height);
      }

      finalCtx.drawImage(canvas, 0, 0);

      finalCanvas.toBlob(
        (blob) => {
          if (!blob) throw new Error('Blob export failed');
          const url = URL.createObjectURL(blob);
          setResultBlob(blob);
          setPreviewUrl(url);
          setStatus('done');
          trackEvent('tool_run', { tool: 'background-remover', bg: bgOption });
        },
        'image/png',
        1.0
      );
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'ব্যাকগ্রাউন্ড অপসারণে সমস্যা হয়েছে।' : 'Error processing image background.');
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `${baseName}-no-bg.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isBn = language === 'bn';

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? '১০০% ব্রাউজার প্রসেসিং' : 'Zero Server Latency'}
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>{tool.seo.h1}</h1>
        <p style={{ fontSize: 16, color: 'hsl(var(--muted-foreground))', marginTop: 8 }}>{tool.description}</p>
      </header>

      <section
        style={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 20,
          padding: 24,
          marginBottom: 40,
        }}
      >
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed hsl(var(--primary) / .4)',
              borderRadius: 16,
              padding: '60px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'hsl(var(--primary) / .03)',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'hsl(var(--primary) / .1)',
                color: 'hsl(var(--primary))',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'আপনার ছবি নির্বাচন বা ড্র্যাগ করুন' : 'Select Image to Remove Background'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'কোনো পেইড সাবস্ক্রিপশন ছাড়াই ট্রান্সপারেন্ট বা পাসপোর্ট সাইজ নীল ব্যাকগ্রাউন্ড তৈরি করুন' : 'Fast client-side segmentation with transparent, white, or passport blue background'}
            </p>
            <button type="button" className="button button-primary">
              <Upload size={16} /> {isBn ? 'ছবি নির্বাচন করুন' : 'Upload Image'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                padding: '16px 20px',
                borderRadius: 12,
                background: 'hsl(var(--secondary) / .4)',
                border: '1px solid hsl(var(--border))',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ImageIcon size={24} style={{ color: 'hsl(var(--primary))' }} />
                <div>
                  <strong style={{ fontSize: 15, display: 'block' }}>{file.name}</strong>
                  <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
                    {formatBytes(file.size)}
                  </span>
                </div>
              </div>
              <button type="button" className="button button-ghost" onClick={resetWorkspace} style={{ fontSize: 13 }}>
                <RotateCcw size={14} /> {isBn ? 'নতুন ছবি' : 'New Photo'}
              </button>
            </div>

            {/* Background Style Options */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: 18,
                borderRadius: 12,
                background: 'hsl(var(--secondary) / .2)',
                border: '1px solid hsl(var(--border))',
              }}
            >
              <strong style={{ fontSize: 14 }}>{isBn ? 'ব্যাকগ্রাউন্ড নির্বাচন করুন:' : 'Target Background:'}</strong>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setBgOption('transparent')}
                  style={{
                    border: bgOption === 'transparent' ? '2px solid hsl(var(--primary))' : undefined,
                    background: bgOption === 'transparent' ? 'hsl(var(--primary) / .1)' : undefined,
                  }}
                >
                  🏁 {isBn ? 'স্বচ্ছ (Transparent PNG)' : 'Transparent'}
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setBgOption('white')}
                  style={{
                    border: bgOption === 'white' ? '2px solid hsl(var(--primary))' : undefined,
                    background: bgOption === 'white' ? 'hsl(var(--primary) / .1)' : undefined,
                  }}
                >
                  ⬜ {isBn ? 'সাদা (White)' : 'White'}
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setBgOption('blue')}
                  style={{
                    border: bgOption === 'blue' ? '2px solid hsl(var(--primary))' : undefined,
                    background: bgOption === 'blue' ? 'hsl(var(--primary) / .1)' : undefined,
                  }}
                >
                  🟦 {isBn ? 'পাসপোর্ট সাইজ নীল (Blue)' : 'Passport Blue'}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => setBgOption('custom')}
                    style={{
                      border: bgOption === 'custom' ? '2px solid hsl(var(--primary))' : undefined,
                      background: bgOption === 'custom' ? 'hsl(var(--primary) / .1)' : undefined,
                    }}
                  >
                    🎨 {isBn ? 'কাস্টম রঙ' : 'Custom'}
                  </button>
                  {bgOption === 'custom' && (
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      style={{ width: 32, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0 }}
                    />
                  )}
                </div>
              </div>

              {/* Edge Tolerance Slider */}
              <div style={{ maxWidth: 360, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{isBn ? 'কাটিং সংবেদনশীলতা (Tolerance)' : 'Edge Sensitivity'}</span>
                  <strong style={{ fontSize: 13, color: 'hsl(var(--primary))' }}>{tolerance}</strong>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  value={tolerance}
                  onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'hsl(var(--primary))' }}
                />
              </div>
            </div>

            {status === 'idle' && (
              <button
                type="button"
                className="button button-primary"
                onClick={processSegmentation}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
              >
                <Sparkles size={16} /> {isBn ? 'ব্যাকগ্রাউন্ড সরান' : 'Remove Background'}
              </button>
            )}

            {(status === 'preparing' || status === 'segmenting' || status === 'compositing') && (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 14, color: 'hsl(var(--primary))', fontWeight: 600 }}>
                  {status === 'preparing' && (isBn ? 'ছবি প্রস্তুত করা হচ্ছে...' : 'Preparing image...')}
                  {status === 'segmenting' && (isBn ? 'ব্যাকগ্রাউন্ড শনাক্ত ও পৃথক করা হচ্ছে...' : 'Detecting and segmenting background...')}
                  {status === 'compositing' && (isBn ? 'নতুন ব্যাকগ্রাউন্ডে সেট করা হচ্ছে...' : 'Compositing final output...')}
                </span>
              </div>
            )}

            {status === 'done' && previewUrl && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div
                  style={{
                    background: 'hsl(var(--primary) / .08)',
                    border: '1px solid hsl(var(--primary) / .3)',
                    borderRadius: 14,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Check size={24} style={{ color: 'hsl(var(--primary))' }} />
                    <div>
                      <strong style={{ fontSize: 16 }}>{isBn ? 'ব্যাকগ্রাউন্ড সরানো সম্পন্ন!' : 'Background Removed!'}</strong>
                      <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                        {resultBlob ? formatBytes(resultBlob.size) : ''} • High Quality Clean PNG
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={processSegmentation}
                      style={{ fontSize: 13 }}
                    >
                      {isBn ? 'পুনরায় প্রসেস' : 'Re-apply'}
                    </button>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={handleDownload}
                      style={{ padding: '10px 24px', fontSize: 14 }}
                    >
                      <Download size={16} /> {isBn ? 'PNG ছবি ডাউনলোড করুন' : 'Download PNG'}
                    </button>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      {isBn ? 'মূল ছবি' : 'Original Image'}
                    </span>
                    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid hsl(var(--border))', background: '#090d16' }}>
                      <img src={originalUrl} alt="Original" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      {isBn ? 'ফলাফল (স্বচ্ছ ব্যাকগ্রাউন্ড প্রিভিউ)' : 'Result Preview'}
                    </span>
                    <div
                      style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: '1px solid hsl(var(--border))',
                        background:
                          bgOption === 'transparent'
                            ? 'repeating-conic-gradient(#cbd5e1 0% 25%, #f1f5f9 0% 50%) 50% / 16px 16px'
                            : bgOption === 'white'
                            ? '#ffffff'
                            : bgOption === 'blue'
                            ? '#1d4ed8'
                            : customColor,
                      }}
                    >
                      <img src={previewUrl} alt="Result" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: 'hsl(var(--destructive) / .1)',
                  color: 'hsl(var(--destructive))',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <AlertCircle size={20} />
                <span style={{ fontSize: 14 }}>{errorMessage}</span>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="tool-content" style={{ marginTop: 40, borderTop: '1px solid hsl(var(--border))', paddingTop: 28 }}>
        <h2>{isBn ? 'কীভাবে ছবির ব্যাকগ্রাউন্ড অপসারণ করবেন' : 'How to Remove Background from Photos'}</h2>
        <ol>
          <li>{tool.content.howToUse[0]}</li>
          <li>{tool.content.howToUse[1]}</li>
          <li>{tool.content.howToUse[2]}</li>
        </ol>

        <h2>{copy.privacyAndLimitations}</h2>
        <p>{tool.content.privacy}</p>
        <p>{tool.content.limitations}</p>
      </section>

      <RelatedTools tool={tool} />

      <section className="tool-content" style={{ marginTop: 44, borderTop: '1px solid hsl(var(--border))', paddingTop: 32 }}>
        <h2>{isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Frequently Asked Questions (FAQ)'}</h2>
        <div className="faq-list">
          {tool.content.faq.map(({ question, answer }) => (
            <details key={question} className="tool-faq">
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 32 }}>
        <AdSlot enabled={consent.advertising} slot={adConfig.toolSlot} label="Sponsored Ad" />
      </div>
    </main>
  );
}

export default BackgroundRemoverTool;
