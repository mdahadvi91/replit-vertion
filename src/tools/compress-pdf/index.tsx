import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Upload,
  Check,
  AlertCircle,
  Minimize2,
  TrendingDown,
  Layers,
  FileCheck,
  AlertTriangle,
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

type CompressionMethod = 'visual' | 'stream';
type CompressionLevel = 'recommended' | 'extreme' | 'low';

export function CompressPdfTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [compressionMethod, setCompressionMethod] = useState<CompressionMethod>('visual');
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [status, setStatus] = useState<'idle' | 'compressing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [stats, setStats] = useState<{
    origSize: number;
    compSize: number;
    savedPercent: number;
    sizeIncreased: boolean;
  } | null>(null);

  const isBn = language === 'bn';

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
      setErrorMessage(isBn ? 'অনুগ্রহ করে একটি বৈধ PDF ফাইল আপলোড করুন।' : 'Please upload a valid PDF file.');
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
      setStats(null);
      setCompressedBlob(null);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(isBn ? 'PDF লোড করতে সমস্যা হয়েছে। ফাইলটি লক করা বা ক্ষতিগ্রস্ত হতে পারে।' : 'Failed to parse PDF.');
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus('compressing');
    setProgress(10);
    setErrorMessage('');

    try {
      const buffer = await file.arrayBuffer();
      let resultBlob: Blob;

      if (compressionMethod === 'stream') {
        // Mode B: Structural Clean-up & Stream Compression (Preserves Selectable Text & Vector Graphics)
        setProgress(30);
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        setProgress(65);

        // Strip non-essential document metadata and save with object stream packing
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('Ahadex Tools In-Browser Optimizer');
        pdfDoc.setCreator('Ahadex Tools');

        const compressedBytes = await pdfDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
        });

        resultBlob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      } else {
        // Mode A: Visual Canvas Recompression (For scanned documents, image-heavy brochures)
        const loadingTask = pdfjsLib.getDocument({ data: buffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        const config = {
          extreme: { scale: 0.95, quality: 0.48 },
          recommended: { scale: 1.25, quality: 0.70 },
          low: { scale: 1.55, quality: 0.85 },
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

          // Free canvas memory
          canvas.width = 0;
          canvas.height = 0;
        }

        setProgress(90);
        const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
        resultBlob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      }

      const origSize = file.size;
      const compSize = resultBlob.size;
      const sizeIncreased = compSize >= origSize;
      const savedPercent = sizeIncreased
        ? 0
        : Math.round(((origSize - compSize) / origSize) * 100);

      setCompressedBlob(resultBlob);
      setStats({ origSize, compSize, savedPercent, sizeIncreased });
      setProgress(100);
      setStatus('done');

      trackEvent('tool_run', {
        tool: 'compress-pdf',
        method: compressionMethod,
        level: compressionLevel,
        saved: savedPercent,
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(isBn ? 'কম্প্রেশন প্রক্রিয়ায় সমস্যা হয়েছে।' : 'Error during PDF compression.');
    }
  };

  const handleDownload = (useOriginal: boolean = false) => {
    const targetBlob = useOriginal ? file : compressedBlob;
    if (!targetBlob || !file) return;

    const url = URL.createObjectURL(targetBlob);
    const link = document.createElement('a');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    link.href = url;
    link.download = useOriginal ? file.name : `${baseName}-optimized.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? 'বাস্তব ক্লায়েন্ট-সাইড অপ্টিমাইজেশন' : 'Real In-Browser Optimization'}
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
              accept="application/pdf,.pdf"
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
              {isBn ? 'আপনার PDF ফাইল নির্বাচন বা ড্র্যাগ করুন' : 'Select or Drag & Drop PDF File'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn
                ? 'ব্রাউজারে সরাসরি ভিজ্যুয়াল ইমেজ কম্প্রেশন অথবা লসলেস ভেক্টর স্ট্রিম অপ্টিমাইজেশন করুন'
                : 'Choose between High-Ratio Visual Compression or Lossless Vector Stream Optimization'}
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

            {/* Compression Method Selection */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                {isBn ? '১. কম্প্রেশন মোড নির্বাচন করুন:' : '1. Choose Optimization Method:'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <div
                  onClick={() => setCompressionMethod('visual')}
                  style={{
                    border: `2px solid ${compressionMethod === 'visual' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: 12,
                    padding: 16,
                    cursor: 'pointer',
                    background: compressionMethod === 'visual' ? 'hsl(var(--primary) / .06)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Layers size={18} style={{ color: 'hsl(var(--primary))' }} />
                    <strong style={{ fontSize: 14 }}>
                      {isBn ? 'ভিজ্যুয়াল ক্যানভাস কম্প্রেশন (Visual)' : 'Visual Canvas Compression'}
                    </strong>
                  </div>
                  <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', lineHeight: 1.4, display: 'block' }}>
                    {isBn
                      ? 'স্ক্যান করা কপি, ছবি ও সার্টিফিকেটের জন্য আদর্শ। ছবির সাইজ সর্বোচ্চ ৫০-৮০% পর্যন্ত কমে যায় (টেক্সট র্যাস্টারাইজড হয়)।'
                      : 'Best for scanned documents and image-heavy PDFs. Reduces image weight up to 80% (text is converted to sharp raster).'}
                  </span>
                </div>

                <div
                  onClick={() => setCompressionMethod('stream')}
                  style={{
                    border: `2px solid ${compressionMethod === 'stream' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: 12,
                    padding: 16,
                    cursor: 'pointer',
                    background: compressionMethod === 'stream' ? 'hsl(var(--primary) / .06)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <FileCheck size={18} style={{ color: 'hsl(var(--primary))' }} />
                    <strong style={{ fontSize: 14 }}>
                      {isBn ? 'স্ট্রাকচারাল অপ্টিমাইজেশন (Lossless Vector)' : 'Structural Stream Clean-up'}
                    </strong>
                  </div>
                  <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', lineHeight: 1.4, display: 'block' }}>
                    {isBn
                      ? 'অরিজিনাল ভেক্টর টেক্সট ও সিলেকশন অক্ষুণ্ণ রেখে মেটাডাটা ও অবজেক্ট স্ট্রিম অপ্টিমাইজ করে। টেক্সটের কোনো কোয়ালিটি নষ্ট হয় না।'
                      : 'Keeps 100% vector fonts, selectable text & links intact while stripping redundant stream overhead.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Level (only for visual mode) */}
            {compressionMethod === 'visual' && (
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                  {isBn ? '২. ভিজ্যুয়াল কম্প্রেশন স্তর:' : '2. Image Compression Profile:'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <div
                    onClick={() => setCompressionLevel('extreme')}
                    style={{
                      border: `2px solid ${compressionLevel === 'extreme' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                      borderRadius: 12,
                      padding: 14,
                      cursor: 'pointer',
                      background: compressionLevel === 'extreme' ? 'hsl(var(--primary) / .06)' : 'transparent',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
                      {isBn ? 'সর্বোচ্চ কম্প্রেশন (Extreme)' : 'Extreme (Smallest)'}
                    </strong>
                    <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
                      {isBn ? 'ইমেইল বা হোয়াটসঅ্যাপে পাঠানোর জন্য সেরা' : 'Smallest size for email or messaging'}
                    </span>
                  </div>

                  <div
                    onClick={() => setCompressionLevel('recommended')}
                    style={{
                      border: `2px solid ${compressionLevel === 'recommended' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                      borderRadius: 12,
                      padding: 14,
                      cursor: 'pointer',
                      background: compressionLevel === 'recommended' ? 'hsl(var(--primary) / .06)' : 'transparent',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
                      {isBn ? 'সুপারিশকৃত (Recommended)' : 'Recommended (Balanced)'}
                    </strong>
                    <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
                      {isBn ? 'স্পষ্ট ছবি ও উল্লেখযোগ্য সাইজ হ্রাস' : 'Great balance between quality & size'}
                    </span>
                  </div>

                  <div
                    onClick={() => setCompressionLevel('low')}
                    style={{
                      border: `2px solid ${compressionLevel === 'low' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                      borderRadius: 12,
                      padding: 14,
                      cursor: 'pointer',
                      background: compressionLevel === 'low' ? 'hsl(var(--primary) / .06)' : 'transparent',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
                      {isBn ? 'হালকা কম্প্রেশন (Low)' : 'Low (High Quality)'}
                    </strong>
                    <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
                      {isBn ? 'উচ্চ রেজোলিউশন বজায় রেখে সামান্য সাইজ হ্রাস' : 'Maximum image clarity'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* In-app Transparency Note */}
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'hsl(var(--primary) / .06)', border: '1px solid hsl(var(--primary) / .2)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16 }}>ℹ️</span>
              <p style={{ margin: 0, fontSize: 12.5, color: 'hsl(var(--muted-foreground))', lineHeight: 1.5 }}>
                <strong>{isBn ? 'সতর্কতা ও ফলাফল তথ্য:' : 'Optimization Reality Note:'}</strong>{' '}
                {isBn
                  ? 'আপনার PDF যদি ইতোমধ্যে হাইপার-কম্প্রেসড বা শুধুমাত্র ভেক্টর টেক্সট দিয়ে তৈরি হয়ে থাকে, তবে ভিজ্যুয়াল রিরেন্ডারিংয়ে সাইজ কম নাও হতে পারে। সেই ক্ষেত্রে স্ট্রাকচারাল মোড ব্যবহার করুন অথবা সিস্টেম আপনাকে স্পষ্ট নোটিশে জানিয়ে দেবে।'
                  : 'If your PDF is already heavily optimized or pure vector text, visual re-encoding may not yield size reduction. In such cases, use the structural mode or our tool will honestly alert you with byte-by-byte comparison.'}
              </p>
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
                  {isBn ? `PDF অপ্টিমাইজ করা হচ্ছে... (${progress}%)` : `Optimizing PDF streams... (${progress}%)`}
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
                <Minimize2 size={16} /> {isBn ? 'PDF কম্প্রেস করুন' : 'Optimize & Compress PDF'}
              </button>
            )}

            {/* Result State with Honest Size Verification */}
            {status === 'done' && stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Size Comparison Card */}
                {!stats.sizeIncreased ? (
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
                          background: 'hsl(var(--primary) / .15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'hsl(var(--primary))',
                        }}
                      >
                        <TrendingDown size={24} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <strong style={{ fontSize: 16 }}>
                            {isBn ? 'PDF সফলভাবে ছোট হয়েছে!' : 'PDF Compressed Successfully!'}
                          </strong>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              background: 'hsl(var(--primary))',
                              color: 'hsl(var(--primary-foreground))',
                              padding: '2px 8px',
                              borderRadius: 99,
                            }}
                          >
                            -{stats.savedPercent}%
                          </span>
                        </div>
                        <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block', marginTop: 4 }}>
                          {formatBytes(stats.origSize)} ➔ {formatBytes(stats.compSize)} (
                          {formatBytes(stats.origSize - stats.compSize)} {isBn ? 'সাশ্রয়' : 'saved'})
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="button" className="button button-ghost" onClick={() => handleDownload(true)} style={{ fontSize: 13 }}>
                        {isBn ? 'মূল ফাইল রাখুন' : 'Keep Original'}
                      </button>
                      <button type="button" className="button button-primary" onClick={() => handleDownload(false)} style={{ padding: '10px 24px', fontSize: 14 }}>
                        <Download size={16} /> {isBn ? 'অপ্টিমাইজড PDF ডাউনলোড' : 'Download Compressed'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'hsl(38 92% 50% / .1)',
                      border: '1px solid hsl(38 92% 50% / .3)',
                      borderRadius: 14,
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <AlertTriangle size={24} style={{ color: 'hsl(38 92% 50%)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong style={{ fontSize: 16, color: 'hsl(38 92% 50%)' }}>
                          {isBn ? 'ফাইলের আকার আর কমানো সম্ভব হয়নি' : 'File Size Could Not Be Reduced'}
                        </strong>
                        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'hsl(var(--foreground))', lineHeight: 1.5 }}>
                          {isBn
                            ? `আপনার মূল PDF ফাইলটি (${formatBytes(stats.origSize)}) ইতিমধ্যে সর্বোচ্চ মাত্রায় সংকুচিত ও অপ্টিমাইজড ছিল। প্রক্রিয়াকরণের পর আকার বৃদ্ধি পেয়ে (${formatBytes(stats.compSize)}) হয়েছে। আপনার মূল ফাইলের আকারই সবচেয়ে সাশ্রয়ী।`
                            : `Your original PDF (${formatBytes(stats.origSize)}) is already thoroughly compressed and optimized. Visual re-encoding resulted in ${formatBytes(stats.compSize)}. We recommend keeping your original file.`}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignSelf: 'flex-end', flexWrap: 'wrap' }}>
                      <button type="button" className="button button-primary" onClick={() => handleDownload(true)} style={{ fontSize: 13 }}>
                        <Download size={15} /> {isBn ? 'মূল PDF ডাউনলোড করুন (সেরা সাইজ)' : 'Download Original (Best Size)'}
                      </button>
                      <button type="button" className="button button-ghost" onClick={() => handleDownload(false)} style={{ fontSize: 13 }}>
                        {isBn ? 'নতুন ভার্সন সংরক্ষণ' : 'Save Processed Anyway'}
                      </button>
                    </div>
                  </div>
                )}
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
        <h2>{isBn ? 'কীভাবে PDF সাইজ সঠিকভাবে সংকুচিত করবেন' : 'How to Compress PDF Documents'}</h2>
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
