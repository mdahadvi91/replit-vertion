import { useState, useRef, useEffect } from 'react';
import {
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
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
  const [status, setStatus] = useState<'idle' | 'loading_model' | 'segmenting' | 'compositing' | 'done' | 'error'>('idle');
  const [progressStage, setProgressStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [transparentBlob, setTransparentBlob] = useState<Blob | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [originalUrl, setOriginalUrl] = useState<string>('');

  const isBn = language === 'bn';

  const resetWorkspace = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setFile(null);
    setStatus('idle');
    setProgressStage('');
    setProgressPercent(0);
    setErrorMessage('');
    setTransparentBlob(null);
    setResultBlob(null);
    setPreviewUrl('');
    setOriginalUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে একটি বৈধ ইমেজ ফাইল সিলেক্ট করুন।' : 'Please select a valid image file.');
      setStatus('error');
      return;
    }

    if (selected.size > 25 * 1024 * 1024) {
      setErrorMessage(isBn ? 'ছবির আকার ২৫ মেগাবাইটের কম হতে হবে।' : 'Image size must be under 25 MB.');
      setStatus('error');
      return;
    }

    const objUrl = URL.createObjectURL(selected);
    setFile(selected);
    setOriginalUrl(objUrl);
    setStatus('idle');
    setErrorMessage('');
    setTransparentBlob(null);
    setResultBlob(null);
    setPreviewUrl('');
  };

  // Helper to composite the transparent subject onto chosen background
  const compositeBackground = async (sourceTransparentBlob: Blob, targetBg: BgOption, colorVal: string): Promise<Blob> => {
    if (targetBg === 'transparent') {
      return sourceTransparentBlob;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const tempUrl = URL.createObjectURL(sourceTransparentBlob);

      img.onload = () => {
        URL.revokeObjectURL(tempUrl);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(sourceTransparentBlob);
          return;
        }

        const fillMap: Record<string, string> = {
          white: '#ffffff',
          blue: '#1d4ed8', // Passport / ID photo blue
          custom: colorVal,
        };

        ctx.fillStyle = fillMap[targetBg] || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((b) => {
          if (b) resolve(b);
          else resolve(sourceTransparentBlob);
        }, 'image/png', 1.0);
      };

      img.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        reject(new Error('Failed to load segmented image for background composite'));
      };

      img.src = tempUrl;
    });
  };

  const processSegmentation = async () => {
    if (!file) return;

    setStatus('loading_model');
    setProgressPercent(10);
    setProgressStage(isBn ? 'AI নিউরাল মডেল লোড হচ্ছে...' : 'Loading neural AI segmentation model...');
    setErrorMessage('');

    try {
      // Lazy load @imgly/background-removal so it never delays initial page loads
      const { removeBackground } = await import('@imgly/background-removal');

      setStatus('segmenting');
      setProgressStage(isBn ? 'AI সাবজেক্ট সেগমেন্টেশন প্রসেসিং...' : 'Running AI neural segmentation on subject...');

      const segmentedBlob = await removeBackground(file, {
        model: 'isnet_fp16',
        output: {
          format: 'image/png',
          quality: 0.95,
        },
        progress: (key: string, current: number, total: number) => {
          if (key.includes('fetch')) {
            const pct = Math.round((current / (total || 1)) * 100);
            setProgressPercent(Math.min(50, Math.max(10, Math.round(pct * 0.5))));
            setProgressStage(isBn ? `মডেল ডেটা ডাউনলোড হচ্ছে (${pct}%)...` : `Downloading neural weights (${pct}%)...`);
          } else if (key.includes('compute')) {
            const pct = Math.round((current / (total || 1)) * 100);
            setProgressPercent(50 + Math.min(45, Math.max(5, Math.round(pct * 0.45))));
            setProgressStage(isBn ? 'নিউরাল নেটওয়ার্ক মাস্ক তৈরি করছে...' : 'Computing neural foreground mask...');
          }
        },
      });

      setTransparentBlob(segmentedBlob);

      setStatus('compositing');
      setProgressStage(isBn ? 'আউটপুট কম্পোজিট করা হচ্ছে...' : 'Compositing final output image...');
      setProgressPercent(95);

      const finalBlob = await compositeBackground(segmentedBlob, bgOption, customColor);
      const url = URL.createObjectURL(finalBlob);

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setResultBlob(finalBlob);
      setPreviewUrl(url);
      setProgressPercent(100);
      setStatus('done');

      trackEvent('tool_run', { tool: 'background-remover', bg: bgOption });
    } catch (err: unknown) {
      console.error('[background-remover] AI segmentation failed:', err);
      setStatus('error');
      setErrorMessage(
        isBn
          ? 'AI ব্যাকগ্রাউন্ড অপসারণে সমস্যা হয়েছে। অনুগ্রহ করে আপনার ব্রাউজারে WebAssembly সক্ষম কিনা ও ইন্টারনেট সংযোগ নিশ্চিত করুন।'
          : 'Failed to run AI segmentation. Please verify that your browser supports WebAssembly and has an active network connection for initial model initialization.'
      );
    }
  };

  // Instant re-composite when user switches background option after segmentation has run
  const handleBgOptionChange = async (newOption: BgOption) => {
    setBgOption(newOption);
    if (transparentBlob && status === 'done') {
      try {
        const updatedBlob = await compositeBackground(transparentBlob, newOption, customColor);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(updatedBlob);
        setResultBlob(updatedBlob);
        setPreviewUrl(url);
      } catch (err) {
        console.error('Failed to re-composite background:', err);
      }
    }
  };

  const handleCustomColorChange = async (newColor: string) => {
    setCustomColor(newColor);
    if (bgOption === 'custom' && transparentBlob && status === 'done') {
      try {
        const updatedBlob = await compositeBackground(transparentBlob, 'custom', newColor);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(updatedBlob);
        setResultBlob(updatedBlob);
        setPreviewUrl(url);
      } catch (err) {
        console.error('Failed to update custom color:', err);
      }
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const suffix = bgOption === 'transparent' ? 'transparent' : bgOption;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `${baseName}-${suffix}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? 'AI নিউরাল সেগমেন্টেশন' : 'Client-Side Neural AI'}
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
              {isBn
                ? 'ব্রাউজারে নিউরাল AI মডেল দিয়ে চুল ও সূক্ষ্ম সীমানা নিখুঁত রেখে স্বচ্ছ বা পাসপোর্ট সাইজ নীল ব্যাকগ্রাউন্ড তৈরি করুন'
                : '100% in-browser AI segmentation model. Preserves hair, clothing edges, and produces clean transparent PNG or ID blue background.'}
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

            {/* Target Background Choice */}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 14 }}>{isBn ? 'ব্যাকগ্রাউন্ড নির্বাচন করুন:' : 'Target Background:'}</strong>
                {transparentBlob && (
                  <span style={{ fontSize: 12, color: 'hsl(var(--primary))', fontWeight: 600 }}>
                    ⚡ {isBn ? 'তাৎক্ষণিক পরিবর্তন সচল' : 'Instant live preview'}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => handleBgOptionChange('transparent')}
                  style={{
                    border: bgOption === 'transparent' ? '2px solid hsl(var(--primary))' : undefined,
                    background: bgOption === 'transparent' ? 'hsl(var(--primary) / .1)' : undefined,
                  }}
                >
                  🏁 {isBn ? 'স্বচ্ছ (Transparent PNG)' : 'Transparent PNG'}
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => handleBgOptionChange('white')}
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
                  onClick={() => handleBgOptionChange('blue')}
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
                    onClick={() => handleBgOptionChange('custom')}
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
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      style={{ width: 32, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0 }}
                    />
                  )}
                </div>
              </div>
            </div>

            {status === 'idle' && (
              <button
                type="button"
                className="button button-primary"
                onClick={processSegmentation}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Sparkles size={16} /> {isBn ? 'AI দিয়ে ব্যাকগ্রাউন্ড সরান' : 'Remove Background with AI'}
              </button>
            )}

            {(status === 'loading_model' || status === 'segmenting' || status === 'compositing') && (
              <div style={{ padding: '24px 16px', borderRadius: 14, background: 'hsl(var(--secondary) / .3)', border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Loader2 size={20} className="animate-spin" style={{ color: 'hsl(var(--primary))' }} />
                  <strong style={{ fontSize: 15, color: 'hsl(var(--primary))' }}>{progressStage}</strong>
                </div>

                <div style={{ width: '100%', maxWidth: 360, margin: '0 auto', background: 'hsl(var(--border))', height: 8, borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'hsl(var(--primary))',
                      width: `${progressPercent}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <span style={{ display: 'block', fontSize: 12, color: 'hsl(var(--muted-foreground))', marginTop: 8 }}>
                  {progressPercent}% • {isBn ? 'ক্লায়েন্ট-সাইড ব্রাউজার প্রসেসিং' : 'Browser WebAssembly Neural Engine'}
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
                      <strong style={{ fontSize: 16 }}>{isBn ? 'AI ব্যাকগ্রাউন্ড অপসারণ সম্পন্ন!' : 'AI Background Removed Successfully!'}</strong>
                      <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                        {resultBlob ? formatBytes(resultBlob.size) : ''} • Clean Subject Mask & Transparent Edges
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
                      {isBn ? 'পুনরায় প্রসেস' : 'Re-run Model'}
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
                      {isBn ? 'ফলাফল (প্রিভিউ)' : 'Result Preview'}
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
