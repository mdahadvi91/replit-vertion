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

export function PngToJpgTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [quality, setQuality] = useState<number>(0.92);
  const [status, setStatus] = useState<'idle' | 'converting' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const resetWorkspace = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setStatus('idle');
    setErrorMessage('');
    setResultBlob(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'image/png' && !selected.name.toLowerCase().endsWith('.png')) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে একটি PNG ছবি সিলেক্ট করুন।' : 'Please select a PNG image.');
      setStatus('error');
      return;
    }

    setFile(selected);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleConvert = () => {
    if (!file) return;
    setStatus('converting');

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setStatus('error');
        setErrorMessage('Failed to access 2D canvas context.');
        URL.revokeObjectURL(objectUrl);
        return;
      }

      // Draw user-chosen background color (replaces transparent pixels)
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the PNG image on top
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            setStatus('error');
            setErrorMessage('Canvas toBlob conversion failed.');
            return;
          }
          const url = URL.createObjectURL(blob);
          setResultBlob(blob);
          setPreviewUrl(url);
          setStatus('done');

          trackEvent('tool_run', { tool: 'png-to-jpg' });
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'ছবিটি লোড করা সম্ভব হয়নি।' : 'Failed to load the PNG image.');
    };

    img.src = objectUrl;
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `${baseName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isBn = language === 'bn';

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? 'ব্যাকগ্রাউন্ড রঙ নির্বাচনের সুবিধাসহ' : 'Custom Background Color'}
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
              accept=".png,image/png"
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
              <ImageIcon size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'আপনার PNG ছবি নির্বাচন বা ড্র্যাগ করুন' : 'Select PNG Image to Convert to JPG'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'ট্রান্সপারেন্ট অংশ পছন্দমতো রঙে রূপান্তর করা যাবে' : 'Easily replace transparent backgrounds with white or custom colors'}
            </p>
            <button type="button" className="button button-primary">
              <Upload size={16} /> {isBn ? 'PNG ছবি নির্বাচন করুন' : 'Choose PNG File'}
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
                    {formatBytes(file.size)} • Portable Network Graphics (PNG)
                  </span>
                </div>
              </div>
              <button type="button" className="button button-ghost" onClick={resetWorkspace} style={{ fontSize: 13 }}>
                <RotateCcw size={14} /> {isBn ? 'নতুন ছবি' : 'New Photo'}
              </button>
            </div>

            {/* Custom Options */}
            {status !== 'done' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  padding: 16,
                  borderRadius: 12,
                  background: 'hsl(var(--secondary) / .2)',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                    {isBn ? 'ট্রান্সপারেন্সির ব্যাকগ্রাউন্ড রঙ' : 'Background Color (for transparency)'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0 }}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => setBgColor('#ffffff')}
                        style={{ padding: '4px 10px', fontSize: 12, border: bgColor === '#ffffff' ? '2px solid hsl(var(--primary))' : undefined }}
                      >
                        {isBn ? 'সাদা' : 'White'}
                      </button>
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => setBgColor('#000000')}
                        style={{ padding: '4px 10px', fontSize: 12, border: bgColor === '#000000' ? '2px solid hsl(var(--primary))' : undefined }}
                      >
                        {isBn ? 'কালো' : 'Black'}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{isBn ? 'JPG কোয়ালিটি' : 'JPG Quality'}</span>
                    <strong style={{ fontSize: 13, color: 'hsl(var(--primary))' }}>{Math.round(quality * 100)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.02"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'hsl(var(--primary))' }}
                  />
                </div>
              </div>
            )}

            {status !== 'done' && (
              <button
                type="button"
                className="button button-primary"
                disabled={status === 'converting'}
                onClick={handleConvert}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
              >
                <Sparkles size={16} />
                {status === 'converting'
                  ? isBn ? 'রূপান্তর হচ্ছে...' : 'Converting to JPG...'
                  : isBn ? 'JPG তে রূপান্তর করুন' : 'Convert to JPG Now'}
              </button>
            )}

            {status === 'done' && resultBlob && previewUrl && (
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
                      <strong style={{ fontSize: 16 }}>{isBn ? 'JPG তৈরি সম্পন্ন!' : 'JPG Conversion Ready!'}</strong>
                      <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                        {formatBytes(resultBlob.size)} • Standard High Quality JPEG
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={handleDownload}
                    style={{ padding: '10px 24px', fontSize: 14 }}
                  >
                    <Download size={16} /> {isBn ? 'JPG ডাউনলোড করুন' : 'Download JPG'}
                  </button>
                </div>

                <div style={{ maxWidth: 500, borderRadius: 14, overflow: 'hidden', border: '1px solid hsl(var(--border))' }}>
                  <img src={previewUrl} alt="Converted JPG" style={{ width: '100%', height: 'auto', display: 'block' }} />
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
        <h2>{isBn ? 'কীভাবে PNG ছবিকে JPG তে রূপান্তর করবেন' : 'How to Convert PNG to JPG Online'}</h2>
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

export default PngToJpgTool;
