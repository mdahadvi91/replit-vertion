import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  Scissors,
  Archive,
  Layers,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
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

function parsePageRanges(input: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(maxPages, Math.max(start, end));
        for (let i = from; i <= to; i++) {
          pages.add(i);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
        pages.add(pageNum);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export function SplitPdfTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  const [resultSummary, setResultSummary] = useState<string>('');

  const resetWorkspace = () => {
    setFile(null);
    setTotalPages(0);
    setStatus('idle');
    setErrorMessage('');
    setDownloadBlob(null);
    setDownloadFilename('');
    setResultSummary('');
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
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pagesCount = pdfDoc.getPageCount();

      setFile(selected);
      setTotalPages(pagesCount);
      setRangeInput(`1-${Math.min(pagesCount, 3)}`);
      setStatus('idle');
      setErrorMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'PDF লোড করতে ব্যর্থ হয়েছে।' : 'Failed to parse PDF document.');
    }
  };

  const handleSplit = async () => {
    if (!file || totalPages === 0) return;
    setStatus('processing');
    setErrorMessage('');

    try {
      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      if (splitMode === 'range') {
        const pageNumbers = parsePageRanges(rangeInput, totalPages);
        if (pageNumbers.length === 0) {
          setStatus('error');
          setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে একটি সঠিক পৃষ্ঠা রেঞ্জ দিন (যেমন: 1-3, 5)।' : 'Please specify a valid page range (e.g. 1-3, 5).');
          return;
        }

        const newPdf = await PDFDocument.create();
        const indices = pageNumbers.map((p) => p - 1);
        const copiedPages = await newPdf.copyPages(srcPdf, indices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
        setDownloadBlob(blob);
        setDownloadFilename(`${baseName}-split.pdf`);
        setResultSummary(
          language === 'bn'
            ? `${pageNumbers.length}টি পৃষ্ঠা নিয়ে নতুন PDF তৈরি হয়েছে (${pageNumbers.join(', ')})`
            : `Created new PDF containing ${pageNumbers.length} pages (${pageNumbers.join(', ')})`
        );
        setStatus('done');
      } else {
        // Split every single page into individual PDFs inside a ZIP
        const zip = new JSZip();

        for (let i = 0; i < totalPages; i++) {
          const singlePdf = await PDFDocument.create();
          const [copiedPage] = await singlePdf.copyPages(srcPdf, [i]);
          singlePdf.addPage(copiedPage);
          const bytes = await singlePdf.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, bytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setDownloadBlob(zipBlob);
        setDownloadFilename(`${baseName}-all-pages.zip`);
        setResultSummary(
          language === 'bn'
            ? `সবগুলো ${totalPages}টি পৃষ্ঠা আলাদা আলাদা PDF হিসেবে জিপ ফাইলে তৈরি হয়েছে`
            : `Split all ${totalPages} pages into individual PDFs in a ZIP archive`
        );
        setStatus('done');
      }

      trackEvent('tool_run', { tool: 'split-pdf', mode: splitMode });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'PDF স্প্লিট করতে সমস্যা হয়েছে।' : 'An error occurred while splitting the PDF.');
    }
  };

  const handleDownload = () => {
    if (!downloadBlob) return;
    const url = URL.createObjectURL(downloadBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
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
          {tool.category} / {isBn ? '১০০% ক্লায়েন্ট-সাইড' : '100% In-Browser'}
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
              <Scissors size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'যে PDF ফাইলটি স্প্লিট করতে চান সেটি নির্বাচন করুন' : 'Select PDF File to Split'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'লোকাল মেমরিতে তাৎক্ষণিকভাবে স্প্লিট হবে' : 'Processes instantly in local browser memory'}
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
                    {formatBytes(file.size)} • {totalPages} {isBn ? 'টি পৃষ্ঠা' : 'pages total'}
                  </span>
                </div>
              </div>
              <button type="button" className="button button-ghost" onClick={resetWorkspace} style={{ fontSize: 13 }}>
                <RotateCcw size={14} /> {isBn ? 'অন্য ফাইল' : 'New File'}
              </button>
            </div>

            {/* Split Mode Options */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: 20,
                borderRadius: 14,
                background: 'hsl(var(--secondary) / .2)',
                border: '1px solid hsl(var(--border))',
              }}
            >
              <strong style={{ fontSize: 15 }}>{isBn ? 'স্প্লিট করার পদ্ধতি নির্বাচন করুন' : 'Select Split Method'}</strong>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="splitMode"
                    value="range"
                    checked={splitMode === 'range'}
                    onChange={() => setSplitMode('range')}
                  />
                  <span>{isBn ? 'নির্দিষ্ট পৃষ্ঠা রেঞ্জ (Custom Range)' : 'Extract Specific Range'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="splitMode"
                    value="all"
                    checked={splitMode === 'all'}
                    onChange={() => setSplitMode('all')}
                  />
                  <span>{isBn ? 'প্রতিটি পৃষ্ঠা আলাদা PDF করুন (ZIP)' : 'Split Every Page into Individual PDFs (ZIP)'}</span>
                </label>
              </div>

              {splitMode === 'range' && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    {isBn ? 'পৃষ্ঠা নম্বর বা রেঞ্জ লিখুন (যেমন: 1-3, 5):' : 'Enter Page Range (e.g. 1-3, 5):'}
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8"
                    className="input"
                    style={{ maxWidth: 360, padding: '10px 14px', fontSize: 14, borderRadius: 8 }}
                  />
                  <span style={{ display: 'block', fontSize: 12, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>
                    {isBn
                      ? `১ থেকে ${totalPages} পর্যন্ত পৃষ্ঠা নম্বর ব্যবহার করুন।`
                      : `Total pages available: 1 to ${totalPages}. Comma separated.`}
                  </span>
                </div>
              )}
            </div>

            {status !== 'done' && (
              <button
                type="button"
                className="button button-primary"
                disabled={status === 'processing'}
                onClick={handleSplit}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
              >
                <Scissors size={16} />
                {status === 'processing'
                  ? isBn ? 'স্প্লিট হচ্ছে...' : 'Splitting PDF...'
                  : isBn ? 'PDF স্প্লিট করুন' : 'Split PDF Now'}
              </button>
            )}

            {status === 'done' && downloadBlob && (
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
                    <strong style={{ fontSize: 16 }}>{isBn ? 'স্প্লিট সম্পন্ন হয়েছে!' : 'Split Completed!'}</strong>
                    <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                      {resultSummary} ({formatBytes(downloadBlob.size)})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleDownload}
                  style={{ padding: '10px 24px', fontSize: 14 }}
                >
                  <Download size={16} /> {isBn ? 'ডাউনলোড করুন' : `Download ${downloadFilename.endsWith('.zip') ? 'ZIP' : 'PDF'}`}
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
        <h2>{isBn ? 'কীভাবে PDF স্প্লিট করবেন' : 'How to Split a PDF Online'}</h2>
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

export default SplitPdfTool;
