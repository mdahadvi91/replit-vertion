import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  RotateCw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  Layers,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument, degrees } from 'pdf-lib';
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

interface PageItem {
  pageNumber: number;
  previewUrl: string;
  rotation: number; // 0, 90, 180, 270
}

export function PdfRotateTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'rendering' | 'saving' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [rotatedPdfBlob, setRotatedPdfBlob] = useState<Blob | null>(null);

  const resetWorkspace = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setFile(null);
    setTotalPages(0);
    setPages([]);
    setStatus('idle');
    setErrorMessage('');
    setRotatedPdfBlob(null);
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

    setFile(selected);
    setStatus('rendering');
    setErrorMessage('');

    try {
      const buffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      const items: PageItem[] = [];

      for (let i = 1; i <= Math.min(numPages, 100); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;

          const blob: Blob = await new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.85);
          });
          const url = URL.createObjectURL(blob);
          items.push({ pageNumber: i, previewUrl: url, rotation: 0 });
        }
      }

      setPages(items);
      setStatus('idle');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'PDF লোড করতে সমস্যা হয়েছে।' : 'Failed to parse PDF.');
    }
  };

  const rotatePage = (pageNumber: number) => {
    setPages((prev) =>
      prev.map((p) =>
        p.pageNumber === pageNumber
          ? { ...p, rotation: (p.rotation + 90) % 360 }
          : p
      )
    );
  };

  const rotateAll = (deg: number) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + deg) % 360,
      }))
    );
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setStatus('saving');
    setErrorMessage('');

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      pages.forEach((p, idx) => {
        if (p.rotation !== 0) {
          const docPage = pdfDoc.getPage(idx);
          const currentRotation = docPage.getRotation().angle;
          docPage.setRotation(degrees((currentRotation + p.rotation) % 360));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setRotatedPdfBlob(blob);
      setStatus('done');

      trackEvent('tool_run', { tool: 'pdf-rotate', pages: pages.length });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'ঘোরানো PDF সেভ করতে সমস্যা হয়েছে।' : 'Error saving rotated PDF.');
    }
  };

  const handleDownload = () => {
    if (!rotatedPdfBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(rotatedPdfBlob);
    link.download = `${baseName}-rotated.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isBn = language === 'bn';

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? 'সহজ পৃষ্ঠা রোটেশন' : 'Visual Page Rotation'}
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
              <RotateCw size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'আপনার PDF ফাইল নির্বাচন বা ড্র্যাগ করুন' : 'Select PDF File to Rotate'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'একক পৃষ্ঠা বা সমস্ত পৃষ্ঠা ৯০°, ১৮০° বা ২৭০° কোণে ঘুরিয়ে সেভ করুন' : 'Rotate individual pages or all pages simultaneously with live visual preview'}
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

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="button button-ghost" onClick={() => rotateAll(90)} style={{ fontSize: 13 }}>
                  <RotateCw size={14} /> {isBn ? 'সবগুলো +৯০° ঘুরান' : 'Rotate All Right (+90°)'}
                </button>
                <button type="button" className="button button-ghost" onClick={() => rotateAll(180)} style={{ fontSize: 13 }}>
                  <RotateCw size={14} /> {isBn ? 'সবগুলো ১৮০° উল্টান' : 'Rotate All (180°)'}
                </button>
                <button type="button" className="button button-ghost" onClick={resetWorkspace} style={{ fontSize: 13 }}>
                  <RotateCcw size={14} /> {isBn ? 'নতুন ফাইল' : 'New File'}
                </button>
              </div>
            </div>

            {status === 'rendering' && (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 14, color: 'hsl(var(--primary))', fontWeight: 600 }}>
                  {isBn ? 'পৃষ্ঠাগুলোর প্রিভিউ প্রস্তুত হচ্ছে...' : 'Rendering PDF pages...'}
                </span>
              </div>
            )}

            {/* Pages Grid */}
            {pages.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: 14,
                  maxHeight: 480,
                  overflowY: 'auto',
                  padding: 8,
                  borderRadius: 12,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--secondary) / .15)',
                }}
              >
                {pages.map((p) => (
                  <div
                    key={p.pageNumber}
                    style={{
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 10,
                      padding: 10,
                      background: 'hsl(var(--card))',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 130,
                        height: 160,
                        background: '#f8fafc',
                        borderRadius: 6,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={p.previewUrl}
                        alt={`Page ${p.pageNumber}`}
                        style={{
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain',
                          transform: `rotate(${p.rotation}deg)`,
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>
                        #{p.pageNumber} {p.rotation > 0 && `(${p.rotation}°)`}
                      </span>
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => rotatePage(p.pageNumber)}
                        style={{ padding: '4px 8px', fontSize: 12 }}
                        title="Rotate this page +90°"
                      >
                        <RotateCw size={13} /> +90°
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {status !== 'saving' && status !== 'done' && pages.length > 0 && (
              <button
                type="button"
                className="button button-primary"
                onClick={handleSave}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
              >
                <Sparkles size={16} /> {isBn ? 'ঘোরানো PDF সেভ করুন' : 'Save Rotated PDF'}
              </button>
            )}

            {status === 'saving' && (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 14, color: 'hsl(var(--primary))', fontWeight: 600 }}>
                  {isBn ? 'PDF আপডেট করে সেভ করা হচ্ছে...' : 'Saving rotated document...'}
                </span>
              </div>
            )}

            {status === 'done' && rotatedPdfBlob && (
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
                    <strong style={{ fontSize: 16 }}>{isBn ? 'ঘোরানো PDF প্রস্তুত!' : 'Rotated PDF Ready!'}</strong>
                    <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                      {formatBytes(rotatedPdfBlob.size)} • {totalPages} {isBn ? 'টি পৃষ্ঠা সমন্বিত' : 'pages document'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleDownload}
                  style={{ padding: '10px 24px', fontSize: 14 }}
                >
                  <Download size={16} /> {isBn ? 'ঘোরানো PDF ডাউনলোড' : 'Download Rotated PDF'}
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
        <h2>{isBn ? 'কীভাবে PDF পৃষ্ঠাগুলো ঘোরাবেন' : 'How to Rotate PDF Pages Online'}</h2>
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

export default PdfRotateTool;
