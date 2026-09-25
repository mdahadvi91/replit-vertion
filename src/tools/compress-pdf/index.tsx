import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  Minimize2,
  TrendingDown,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument } from 'pdf-lib';
import type { ToolDefinition } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { useConsent } from '@/features/consent';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';
import { RelatedTools } from '@/components/tool/RelatedTools';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

type CompressionLevel = 'recommended' | 'extreme' | 'low';

export function CompressPdfTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [status, setStatus] = useState<'idle' | 'compressing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [stats, setStats] = useState<{ origSize: number; compSize: number; savedPercent: number } | null>(null);

  const resetWorkspace = () => {
    setFile(null);
    setTotalPages(0);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setCompressedBlob(null);
    setStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে একটি বৈধ PDF ফাইল আপলোড করুন।' : 'Please upload a valid PDF file.');
      setStatus('error');
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;

      setFile(selected);
      setTotalPages(pdf.numPages);
      setStatus('idle');
      setErrorMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'PDF লোড করতে সমস্যা হয়েছে।' : 'Failed to parse PDF.');
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus('compressing');
    setProgress(10);
    setErrorMessage('');

    try {
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      // Settings according to compression level
      const config = {
        extreme: { scale: 1.0, quality: 0.5 },
        recommended: { scale: 1.3, quality: 0.72 },
        low: { scale: 1.6, quality: 0.85 },
      }[compressionLevel];

      const newPdfDoc = await PDFDocument.create();

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round(10 + (i / numPages) * 75));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: config.scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) continue;

        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;

        const jpegBlob: Blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', config.quality);
        });

        const jpegBuffer = await jpegBlob.arrayBuffer();
        const embeddedImg = await newPdfDoc.embedJpg(jpegBuffer);

        const pdfPage = newPdfDoc.addPage([viewport.width / config.scale, viewport.height / config.scale]);
        pdfPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: viewport.width / config.scale,
          height: viewport.height / config.scale,
        });
      }

      setProgress(90);
      const compressedBytes = await newPdfDoc.save();
      const resultBlob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });

      const origSize = file.size;
      const compSize = resultBlob.size;
      const savedPercent = Math.max(0, Math.round(((origSize - compSize) / origSize) * 100));

      setCompressedBlob(resultBlob);
      setStats({ origSize, compSize, savedPercent });
      setProgress(100);
      setStatus('done');

      trackEvent('tool_run', { tool: 'compress-pdf', level: compressionLevel, saved: savedPercent });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'কম্প্রেশন প্রক্রিয়ায় সমস্যা হয়েছে।' : 'Error during PDF compression.');
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const link = document.createElement('a');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    link.href = url;
    link.download = `${baseName}-compressed.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const isBn = language === 'bn';

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? 'বাস্তব ক্লায়েন্ট-সাইড কম্প্রেশন' : 'Real In-Browser Compression'}
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
              accept=".pdf,application/pdf"
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
              <Minimize2 size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'আপনার PDF ফাইল নির্বাচন বা ড্র্যাগ করুন' : 'Select PDF File to Compress'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'ছবির কোয়ালিটি অপ্টিমাইজ করে সাইজ কমানো হয়' : 'Optimizes images & rasterizes streams to shrink size'}
            </p>
            <button type="button" className="button button-primary">
              <Upload size={16} /> {isBn ? 'ফাইল বেছে নিন' : 'Choose PDF File'}
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
                <FileText size={24} style={{ color: 'hsl(var(--primary))' }} />
                <div>
                  <strong style={{ fontSize: 15, display: 'block' }}>{file.name}</strong>
                  <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
                    {formatBytes(file.size)} • {totalPages} {isBn ? 'টি পৃষ্ঠা' : 'pages total'}
                  </span>
                </div>
              </div>
              <button type="button" className="button button-ghost" onClick={resetWorkspace} style={{ fontSize: 13 }}>
                <RotateCcw size={14} /> {isBn ? 'নতুন ফাইল' : 'New File'}
              </button>
            </div>

            {/* Compression Level Selector */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                {isBn ? 'কম্প্রেশন লেভেল নির্বাচন করুন' : 'Select Compression Profile'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                <div
                  onClick={() => setCompressionLevel('extreme')}
                  style={{
                    border: `2px solid ${compressionLevel === 'extreme' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: 12,
                    padding: 16,
                    cursor: 'pointer',
                    background: compressionLevel === 'extreme' ? 'hsl(var(--primary) / .06)' : 'transparent',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>
                    {isBn ? 'সর্বোচ্চ কম্প্রেশন (Extreme)' : 'Extreme Compression'}
                  </strong>
                  <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                    {isBn ? 'সবচেয়ে ছোট সাইজ, মাঝারি রেজোলিউশন' : 'Smallest file size, medium visual quality'}
                  </span>
                </div>

                <div
                  onClick={() => setCompressionLevel('recommended')}
                  style={{
                    border: `2px solid ${compressionLevel === 'recommended' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: 12,
                    padding: 16,
                    cursor: 'pointer',
                    background: compressionLevel === 'recommended' ? 'hsl(var(--primary) / .06)' : 'transparent',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>
                    {isBn ? 'সুপারিশকৃত (Recommended)' : 'Recommended (Balanced)'}
                  </strong>
                  <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                    {isBn ? 'ভালো কোয়ালিটি এবং উল্লেখযোগ্য সাইজ হ্রাস' : 'Great visual clarity with significant reduction'}
                  </span>
                </div>

                <div
                  onClick={() => setCompressionLevel('low')}
                  style={{
                    border: `2px solid ${compressionLevel === 'low' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: 12,
                    padding: 16,
                    cursor: 'pointer',
                    background: compressionLevel === 'low' ? 'hsl(var(--primary) / .06)' : 'transparent',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>
                    {isBn ? 'হালকা কম্প্রেশন (Low)' : 'Low Compression'}
                  </strong>
                  <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                    {isBn ? 'উচ্চ রেজোলিউশন বজায় রেখে সামান্য ছোট' : 'Highest image clarity, gentle compression'}
                  </span>
                </div>
              </div>
            </div>

            {status === 'compressing' && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ height: 8, background: 'hsl(var(--secondary))', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: 'hsl(var(--primary))',
                      transition: 'width 0.2s',
                    }}
                  />
                </div>
                <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
                  {isBn ? `PDF অপ্টিমাইজ করা হচ্ছে... (${progress}%)` : `Optimizing and compressing pages... (${progress}%)`}
                </span>
              </div>
            )}

            {status !== 'compressing' && status !== 'done' && (
              <button
                type="button"
                className="button button-primary"
                onClick={handleCompress}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
              >
                <Sparkles size={16} /> {isBn ? 'PDF কম্প্রেস করুন' : 'Compress PDF'}
              </button>
            )}

            {status === 'done' && stats && compressedBlob && (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'hsl(var(--primary) / .2)',
                      color: 'hsl(var(--primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingDown size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 16, display: 'block' }}>
                      {isBn ? 'কম্প্রেশন সম্পন্ন!' : 'Compression Completed!'}
                    </strong>
                    <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
                      {formatBytes(stats.origSize)} → <strong style={{ color: 'hsl(var(--primary))' }}>{formatBytes(stats.compSize)}</strong>
                      {stats.savedPercent > 0 ? ` (${stats.savedPercent}% saved)` : ' (already optimized)'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleDownload}
                  style={{ padding: '10px 24px', fontSize: 14 }}
                >
                  <Download size={16} /> {isBn ? 'কম্প্রেসড PDF ডাউনলোড' : 'Download Compressed PDF'}
                </button>
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
        <h2>{isBn ? 'কীভাবে PDF ফাইলের আকার কমাবেন' : 'How to Compress PDF Files Online'}</h2>
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

export default CompressPdfTool;
