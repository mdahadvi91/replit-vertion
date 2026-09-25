import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  Archive,
  Image as ImageIcon,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import JSZip from 'jszip';
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

interface RenderedPage {
  pageNumber: number;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
}

export function PdfToJpgTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.9);
  const [scale, setScale] = useState<number>(1.5); // standard high-res
  const [status, setStatus] = useState<'idle' | 'converting' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const resetWorkspace = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setFile(null);
    setTotalPages(0);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setPages([]);
    setZipBlob(null);
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

  const handleConvert = async () => {
    if (!file) return;
    setStatus('converting');
    setProgress(10);
    setErrorMessage('');

    try {
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const renderedPages: RenderedPage[] = [];
      const zip = new JSZip();
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round(10 + (i / numPages) * 75));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) continue;

        // White background for JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;

        const blob: Blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', quality);
        });

        const previewUrl = URL.createObjectURL(blob);
        renderedPages.push({
          pageNumber: i,
          blob,
          previewUrl,
          width: canvas.width,
          height: canvas.height,
        });

        zip.file(`${baseName}-page-${i}.jpg`, blob);
      }

      setPages(renderedPages);
      setProgress(90);

      const generatedZip = await zip.generateAsync({ type: 'blob' });
      setZipBlob(generatedZip);
      setProgress(100);
      setStatus('done');

      trackEvent('tool_run', { tool: 'pdf-to-jpg', pages: numPages });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'JPG তৈরিতে সমস্যা হয়েছে।' : 'Error converting PDF pages to JPG.');
    }
  };

  const handleDownloadSingle = (page: RenderedPage) => {
    if (!file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = page.previewUrl;
    link.download = `${baseName}-page-${page.pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = () => {
    if (!zipBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${baseName}-jpg-images.zip`;
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
          {tool.category} / {isBn ? 'হাই-রেজোলিউশন রেন্ডারিং' : 'High Resolution Rendering'}
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
              <ImageIcon size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'আপনার PDF ফাইল নির্বাচন বা ড্র্যাগ করুন' : 'Select PDF File to Convert to JPG'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'প্রতিটি পৃষ্ঠা পৃথক JPG ছবি হিসেবে এক্সপোর্ট হবে' : 'Each page exports as a high-quality JPG image'}
            </p>
            <button type="button" className="button button-primary">
              <Upload size={16} /> {isBn ? 'PDF নির্বাচন করুন' : 'Choose PDF File'}
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

            {/* Quality & Scale Controls */}
            {status !== 'done' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 16,
                  padding: 16,
                  borderRadius: 12,
                  background: 'hsl(var(--secondary) / .2)',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    {isBn ? 'রেজোলিউশন / স্পষ্টতা' : 'Image Resolution'}
                  </label>
                  <select
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8 }}
                  >
                    <option value={1.0}>{isBn ? 'সাধারণ (1x Standard)' : 'Standard (72-96 DPI)'}</option>
                    <option value={1.5}>{isBn ? 'উচ্চমান (1.5x High Quality)' : 'High (150 DPI)'}</option>
                    <option value={2.0}>{isBn ? 'সর্বোচ্চ ক্রিস্প (2x Ultra)' : 'Ultra Sharp (300 DPI)'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    {isBn ? 'JPG কোয়ালিটি' : 'JPG Quality'}
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8 }}
                  >
                    <option value={0.8}>{isBn ? '৮০% (ছোট ফাইল)' : '80% (Compact Size)'}</option>
                    <option value={0.9}>{isBn ? '৯০% (ভারসাম্যপূর্ণ)' : '90% (Recommended)'}</option>
                    <option value={0.98}>{isBn ? '১০০% (সর্বোচ্চ স্পষ্টতা)' : '100% (Maximum Quality)'}</option>
                  </select>
                </div>
              </div>
            )}

            {status === 'converting' && (
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
                  {isBn ? `পৃষ্ঠাগুলো JPG তে রেন্ডার হচ্ছে... (${progress}%)` : `Rendering pages to JPG... (${progress}%)`}
                </span>
              </div>
            )}

            {status !== 'converting' && status !== 'done' && (
              <button
                type="button"
                className="button button-primary"
                onClick={handleConvert}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
              >
                <Sparkles size={16} /> {isBn ? 'JPG তে রূপান্তর করুন' : 'Convert All Pages to JPG'}
              </button>
            )}

            {status === 'done' && (
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
                      <strong style={{ fontSize: 16 }}>{isBn ? 'রূপান্তর সফল হয়েছে!' : 'Conversion Successful!'}</strong>
                      <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                        {pages.length} {isBn ? 'টি পৃষ্ঠা JPG তে তৈরি হয়েছে' : 'pages rendered to JPG'}
                      </span>
                    </div>
                  </div>
                  {zipBlob && (
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={handleDownloadZip}
                      style={{ padding: '10px 24px', fontSize: 14 }}
                    >
                      <Archive size={16} /> {isBn ? 'সব ছবি জিপ (ZIP) আকারে ডাউনলোড' : 'Download All as ZIP'}
                    </button>
                  )}
                </div>

                {/* Individual Pages Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {pages.map((p) => (
                    <div
                      key={p.pageNumber}
                      style={{
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 12,
                        padding: 12,
                        background: 'hsl(var(--card))',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ height: 160, background: '#f8fafc', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={p.previewUrl}
                          alt={`Page ${p.pageNumber}`}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          {isBn ? `পৃষ্ঠা ${p.pageNumber}` : `Page ${p.pageNumber}`}
                        </span>
                        <button
                          type="button"
                          className="button button-ghost"
                          onClick={() => handleDownloadSingle(p)}
                          style={{ padding: '6px 10px', fontSize: 12 }}
                        >
                          <Download size={13} /> {isBn ? 'JPG' : 'Download'}
                        </button>
                      </div>
                    </div>
                  ))}
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
        <h2>{isBn ? 'কীভাবে PDF থেকে JPG ছবিতে রূপান্তর করবেন' : 'How to Convert PDF to JPG Images'}</h2>
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

export default PdfToJpgTool;
