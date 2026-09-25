import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  FileCode,
  Languages,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Document, Paragraph, TextRun, Packer, HeadingLevel } from 'docx';
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

interface PageContent {
  pageNumber: number;
  lines: string[];
}

export function PdfToWordTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'converting' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [extractedPages, setExtractedPages] = useState<PageContent[]>([]);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);

  const resetWorkspace = () => {
    setFile(null);
    setTotalPages(0);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setExtractedPages([]);
    setDocxBlob(null);
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

    if (selected.size > 50 * 1024 * 1024) {
      setErrorMessage(language === 'bn' ? 'ফাইলের আকার ৫০ মেগাবাইটের কম হতে হবে।' : 'File size must be under 50 MB.');
      setStatus('error');
      return;
    }

    setFile(selected);
    setStatus('parsing');
    setErrorMessage('');
    setProgress(10);

    try {
      const buffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);
      setStatus('idle');
      setProgress(0);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'PDF ফাইলটি লোড করতে সমস্যা হয়েছে। ফাইলটি লক করা বা ক্ষতিগ্রস্ত হতে পারে।' : 'Failed to parse PDF. It might be corrupted or password-protected.');
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setStatus('converting');
    setProgress(15);
    setErrorMessage('');

    try {
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const pagesData: PageContent[] = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round(15 + (i / numPages) * 60));
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        let currentLine = '';
        let lastY: number | null = null;
        const pageLines: string[] = [];

        for (const item of textContent.items) {
          if ('str' in item) {
            const str = item.str;
            const transform = item.transform;
            const currentY = transform ? transform[5] : 0;

            if (lastY !== null && Math.abs(currentY - lastY) > 8) {
              if (currentLine.trim()) pageLines.push(currentLine.trim());
              currentLine = str;
            } else {
              currentLine += (currentLine.endsWith(' ') || str.startsWith(' ') ? '' : ' ') + str;
            }
            lastY = currentY;
          }
        }
        if (currentLine.trim()) pageLines.push(currentLine.trim());

        pagesData.push({
          pageNumber: i,
          lines: pageLines,
        });
      }

      setExtractedPages(pagesData);
      setProgress(85);

      // Generate DOCX with docx library
      const docChildren: Paragraph[] = [];

      pagesData.forEach((pg) => {
        if (includePageNumbers) {
          docChildren.push(
            new Paragraph({
              text: `--- Page ${pg.pageNumber} ---`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            })
          );
        }

        pg.lines.forEach((line) => {
          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: line, size: 24 })],
              spacing: { after: 120 },
            })
          );
        });
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren.length > 0 ? docChildren : [new Paragraph('Extracted PDF Content')],
          },
        ],
      });

      const generatedBlob = await Packer.toBlob(doc);
      setDocxBlob(generatedBlob);
      setProgress(100);
      setStatus('done');

      trackEvent('tool_run', { tool: 'pdf-to-word', pages: numPages });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'Word ফাইল তৈরিতে সমস্যা হয়েছে।' : 'Failed to convert PDF to DOCX format.');
    }
  };

  const handleDownload = () => {
    if (!docxBlob || !file) return;
    const url = URL.createObjectURL(docxBlob);
    const link = document.createElement('a');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    link.href = url;
    link.download = `${baseName}.docx`;
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
          {tool.category} / {isBn ? '১০০% ব্রাউজারে সুরক্ষিত' : '100% In-Browser Private'}
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>{tool.seo.h1}</h1>
        <p style={{ fontSize: 16, color: 'hsl(var(--muted-foreground))', marginTop: 8 }}>{tool.description}</p>
      </header>

      {/* Main Workspace */}
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
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'আপনার PDF ফাইল নির্বাচন বা ড্র্যাগ করুন' : 'Select or Drag & Drop PDF File'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'সর্বোচ্চ ৫০ মেগাবাইট পর্যন্ত ফাইল সাপোর্টেড' : 'Supports standard PDF files up to 50 MB'}
            </p>
            <button type="button" className="button button-primary">
              <Upload size={16} /> {isBn ? 'ফাইল বেছে নিন' : 'Choose PDF File'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* File Info Bar */}
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
                    {formatBytes(file.size)} • {totalPages} {isBn ? 'পৃষ্ঠা' : 'pages'}
                  </span>
                </div>
              </div>
              <button type="button" className="button button-ghost" onClick={resetWorkspace} style={{ fontSize: 13 }}>
                <RotateCcw size={14} /> {isBn ? 'নতুন ফাইল' : 'New File'}
              </button>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                />
                <span>{isBn ? 'ডকুমেন্টে পৃষ্ঠা নম্বর হেডার অন্তর্ভুক্ত করুন' : 'Include Page Header Dividers'}</span>
              </label>
            </div>

            {/* Progress or Actions */}
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
                  {isBn ? `Word (.docx) কনভার্ট হচ্ছে... (${progress}%)` : `Converting to Word (.docx)... (${progress}%)`}
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
                <Sparkles size={16} /> {isBn ? 'Word (.docx) ফরম্যাটে রূপান্তর করুন' : 'Convert to Word (.DOCX)'}
              </button>
            )}

            {status === 'done' && docxBlob && (
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
                    <strong style={{ fontSize: 16, color: 'hsl(var(--foreground))' }}>
                      {isBn ? 'Word ফাইল সফলভাবে তৈরি হয়েছে!' : 'Word Document Generated Successfully!'}
                    </strong>
                    <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                      {formatBytes(docxBlob.size)} • Microsoft Word / Google Docs Compatible (.docx)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleDownload}
                  style={{ padding: '10px 24px', fontSize: 14 }}
                >
                  <Download size={16} /> {isBn ? 'DOCX ডাউনলোড করুন' : 'Download .DOCX File'}
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

      {/* SEO & Guide Section */}
      <section className="tool-content" style={{ marginTop: 40, borderTop: '1px solid hsl(var(--border))', paddingTop: 28 }}>
        <h2>{isBn ? 'কীভাবে PDF থেকে Word ফাইলে রূপান্তর করবেন' : 'How to Convert PDF to Word (.docx)'}</h2>
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

export default PdfToWordTool;
