import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  CheckSquare,
  Square,
  Layers,
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

interface PageThumbnail {
  pageNumber: number;
  previewUrl: string;
}

export function PdfPageExtractorTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<'idle' | 'rendering' | 'extracting' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [extractedPdfBlob, setExtractedPdfBlob] = useState<Blob | null>(null);

  const resetWorkspace = () => {
    thumbnails.forEach((t) => URL.revokeObjectURL(t.previewUrl));
    setFile(null);
    setTotalPages(0);
    setThumbnails([]);
    setSelectedPages(new Set());
    setStatus('idle');
    setErrorMessage('');
    setExtractedPdfBlob(null);
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

      const generatedThumbnails: PageThumbnail[] = [];
      const initialSelected = new Set<number>();

      // Render thumbnail previews
      for (let i = 1; i <= Math.min(numPages, 100); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Compact thumbnail scale

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
          generatedThumbnails.push({ pageNumber: i, previewUrl: url });
        }
      }

      setThumbnails(generatedThumbnails);
      // Preselect first page
      initialSelected.add(1);
      setSelectedPages(initialSelected);
      setStatus('idle');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'PDF থাম্বনেইল তৈরি করতে ব্যর্থ হয়েছে।' : 'Failed to generate PDF thumbnails.');
    }
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) {
        next.delete(pageNumber);
      } else {
        next.add(pageNumber);
      }
      return next;
    });
  };

  const selectAll = () => {
    const all = new Set<number>();
    for (let i = 1; i <= totalPages; i++) all.add(i);
    setSelectedPages(all);
  };

  const deselectAll = () => {
    setSelectedPages(new Set());
  };

  const handleExtract = async () => {
    if (!file || selectedPages.size === 0) return;
    setStatus('extracting');
    setErrorMessage('');

    try {
      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
      const indices = sortedPages.map((p) => p - 1);

      const copiedPages = await newPdf.copyPages(srcPdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setExtractedPdfBlob(blob);
      setStatus('done');

      trackEvent('tool_run', { tool: 'pdf-page-extractor', extractedCount: sortedPages.length });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'পৃষ্ঠাগুলো আলাদা করতে সমস্যা হয়েছে।' : 'Error extracting pages.');
    }
  };

  const handleDownload = () => {
    if (!extractedPdfBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(extractedPdfBlob);
    link.download = `${baseName}-selected-pages.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isBn = language === 'bn';

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? 'ভিজ্যুয়াল পৃষ্ঠা সিলেকশন' : 'Visual Page Selection'}
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
              <Layers size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'আপনার PDF ফাইল নির্বাচন বা ড্র্যাগ করুন' : 'Select PDF File to Extract Pages'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'প্রতিটি পৃষ্ঠার ছবি দেখে পছন্দমতো পৃষ্ঠা সিলেক্ট করে নতুন PDF বানান' : 'Visually view all page thumbnails and extract chosen pages into a new PDF'}
            </p>
            <button type="button" className="button button-primary">
              <Upload size={16} /> {isBn ? 'PDF নির্বাচন করুন' : 'Choose PDF'}
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
                    {formatBytes(file.size)} • {totalPages} {isBn ? 'টি পৃষ্ঠা' : 'pages'} •{' '}
                    <strong style={{ color: 'hsl(var(--primary))' }}>
                      {selectedPages.size} {isBn ? 'টি নির্বাচিত' : 'selected'}
                    </strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="button button-ghost" onClick={selectAll} style={{ fontSize: 13 }}>
                  <CheckSquare size={14} /> {isBn ? 'সব নির্বাচন' : 'Select All'}
                </button>
                <button type="button" className="button button-ghost" onClick={deselectAll} style={{ fontSize: 13 }}>
                  <Square size={14} /> {isBn ? 'সব বাতিল' : 'Clear'}
                </button>
                <button type="button" className="button button-ghost" onClick={resetWorkspace} style={{ fontSize: 13 }}>
                  <RotateCcw size={14} /> {isBn ? 'নতুন ফাইল' : 'New'}
                </button>
              </div>
            </div>

            {status === 'rendering' && (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 14, color: 'hsl(var(--primary))', fontWeight: 600 }}>
                  {isBn ? 'পৃষ্ঠাগুলোর প্রিভিউ প্রস্তুত হচ্ছে...' : 'Generating page thumbnails...'}
                </span>
              </div>
            )}

            {/* Thumbnail Gallery Grid */}
            {thumbnails.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 14,
                  maxHeight: 460,
                  overflowY: 'auto',
                  padding: 8,
                  borderRadius: 12,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--secondary) / .15)',
                }}
              >
                {thumbnails.map((t) => {
                  const isSelected = selectedPages.has(t.pageNumber);
                  return (
                    <div
                      key={t.pageNumber}
                      onClick={() => togglePage(t.pageNumber)}
                      style={{
                        position: 'relative',
                        border: `2px solid ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                        borderRadius: 10,
                        padding: 6,
                        cursor: 'pointer',
                        background: isSelected ? 'hsl(var(--primary) / .08)' : 'hsl(var(--card))',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ height: 160, background: '#f8fafc', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={t.previewUrl}
                          alt={`Page ${t.pageNumber}`}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, padding: '0 4px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? 'hsl(var(--primary))' : 'inherit' }}>
                          #{t.pageNumber}
                        </span>
                        {isSelected ? (
                          <CheckSquare size={16} style={{ color: 'hsl(var(--primary))' }} />
                        ) : (
                          <Square size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {status !== 'extracting' && status !== 'done' && thumbnails.length > 0 && (
              <button
                type="button"
                className="button button-primary"
                disabled={selectedPages.size === 0}
                onClick={handleExtract}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
              >
                <Sparkles size={16} />{' '}
                {isBn ? `নির্বাচিত (${selectedPages.size}টি) পৃষ্ঠা দিয়ে নতুন PDF বানান` : `Extract Selected (${selectedPages.size}) Pages to PDF`}
              </button>
            )}

            {status === 'extracting' && (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <span style={{ fontSize: 14, color: 'hsl(var(--primary))', fontWeight: 600 }}>
                  {isBn ? 'নতুন PDF তৈরি হচ্ছে...' : 'Extracting pages and building PDF...'}
                </span>
              </div>
            )}

            {status === 'done' && extractedPdfBlob && (
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
                    <strong style={{ fontSize: 16 }}>{isBn ? 'এক্সট্রাকশন সম্পন্ন হয়েছে!' : 'Pages Extracted Successfully!'}</strong>
                    <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                      {formatBytes(extractedPdfBlob.size)} • {selectedPages.size} {isBn ? 'টি পৃষ্ঠা নিয়ে নতুন PDF তৈরি হয়েছে' : 'pages in new document'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleDownload}
                  style={{ padding: '10px 24px', fontSize: 14 }}
                >
                  <Download size={16} /> {isBn ? 'নতুন PDF ডাউনলোড' : 'Download Extracted PDF'}
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
        <h2>{isBn ? 'কীভাবে PDF থেকে নির্দিষ্ট পৃষ্ঠা বের করবেন' : 'How to Extract Pages from a PDF'}</h2>
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

export default PdfPageExtractorTool;
