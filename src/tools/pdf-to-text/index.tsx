import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  RotateCcw,
  Sparkles,
  Upload,
  Lock,
  Eye,
  Settings2,
  Sliders,
  HelpCircle,
  FileCode,
  Languages,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { ToolDefinition } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { useConsent } from '@/features/consent';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';
import { RelatedTools } from '@/components/tool/RelatedTools';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

type ExtractionMode = 'auto' | 'direct' | 'ocr';
type OcrLang = 'eng' | 'ben' | 'ben+eng' | 'hin' | 'spa' | 'fra' | 'ara';

export function PdfToTextTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [pdfPassword, setPdfPassword] = useState<string>('');

  // Settings & Controls (Left Sidebar)
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>('auto');
  const [ocrLang, setOcrLang] = useState<OcrLang>('eng');
  const [includePageHeaders, setIncludePageHeaders] = useState<boolean>(true);
  const [cleanExtraWhitespace, setCleanExtraWhitespace] = useState<boolean>(true);
  const [preserveLineBreaks, setPreserveLineBreaks] = useState<boolean>(true);

  // Execution & Progress State
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [usedEngine, setUsedEngine] = useState<'Direct Text Stream' | 'OCR Scanner' | null>(null);

  // Output
  const [extractedText, setExtractedText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Clean up
  const reset = () => {
    setFile(null);
    setFileBuffer(null);
    setPdfPageCount(0);
    setIsPasswordProtected(false);
    setPdfPassword('');
    setExtractedText('');
    setStatus('idle');
    setStatusMessage('');
    setProgressPercent(0);
    setUsedEngine(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (newFile?: File) => {
    if (!newFile) return;
    if (!newFile.name.toLowerCase().endsWith('.pdf') && newFile.type !== 'application/pdf') {
      setStatus('error');
      setStatusMessage(language === 'bn' ? 'অনুগ্রহ করে একটি সঠিক PDF ফাইল নির্বাচন করুন।' : 'Please upload a valid PDF document (.pdf).');
      return;
    }

    setFile(newFile);
    setExtractedText('');
    setStatus('processing');
    setStatusMessage(language === 'bn' ? 'PDF বিশ্লেষণ করা হচ্ছে...' : 'Inspecting PDF document...');
    setProgressPercent(10);
    trackEvent('file_upload', { tool_id: tool.id, file_size: newFile.size });

    try {
      const buffer = await newFile.arrayBuffer();
      setFileBuffer(buffer);

      // Inspect with PDF.js
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
      loadingTask.onPassword = (_updateCallback: any, _reason: any) => {
        setIsPasswordProtected(true);
        setStatus('ready');
        setStatusMessage(
          language === 'bn'
            ? 'এই PDF ফাইলটি পাসওয়ার্ড দ্বারা সুরক্ষিত। অনুগ্রহ করে পাসওয়ার্ড দিন।'
            : 'This PDF is password-protected. Please enter the password.'
        );
      };

      const doc = await loadingTask.promise;
      setPdfPageCount(doc.numPages);
      setIsPasswordProtected(false);
      setStatus('ready');
      setStatusMessage(
        language === 'bn'
          ? `ফাইল প্রস্তুত! মোট ${doc.numPages} টি পৃষ্ঠা রয়েছে। টেক্সট এক্সট্রাক্ট করতে বাটনে ক্লিক করুন।`
          : `Ready! Document has ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}. Click Extract Text to begin.`
      );
      setProgressPercent(100);
    } catch (err: any) {
      if (err?.name === 'PasswordException' || `${err}`.toLowerCase().includes('password')) {
        setIsPasswordProtected(true);
        setStatus('ready');
        setStatusMessage(
          language === 'bn'
            ? 'এই PDF ফাইলটি পাসওয়ার্ড দিয়ে লক করা। অনুগ্রহ করে নিচে পাসওয়ার্ড দিন।'
            : 'This PDF is password protected. Enter password below to unlock.'
        );
      } else {
        setStatus('error');
        setStatusMessage(err?.message || (language === 'bn' ? 'PDF রিড করতে ব্যর্থ হয়েছে।' : 'Failed to read PDF. File may be corrupted.'));
      }
    }
  };

  const processPdf = async () => {
    if (!fileBuffer) return;
    setStatus('processing');
    setProgressPercent(5);
    setExtractedText('');
    trackEvent('tool_start', { tool_id: tool.id });

    let doc: any = null;
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(fileBuffer.slice(0)),
        password: pdfPassword || undefined,
      });

      setStatusMessage(language === 'bn' ? 'PDF লোড করা হচ্ছে...' : 'Loading PDF into memory...');
      doc = await loadingTask.promise;
      const numPages = doc.numPages;
      setPdfPageCount(numPages);

      let fullText = '';
      let requiresOcr = extractionMode === 'ocr';
      const pageTexts: string[] = [];

      // Step 1: Direct Text Extraction (unless mode is forced OCR)
      if (extractionMode !== 'ocr') {
        setStatusMessage(language === 'bn' ? 'ডিজিটাল টেক্সট স্ট্রিম স্ক্যান করা হচ্ছে...' : 'Extracting digital text streams...');

        let totalCharsFound = 0;
        for (let i = 1; i <= numPages; i++) {
          const page = await doc.getPage(i);
          const textContent = await page.getTextContent();
          const pageStr = textContent.items
            .map((item: any) => item.str || '')
            .join(preserveLineBreaks ? '\n' : ' ')
            .trim();

          totalCharsFound += pageStr.length;
          pageTexts.push(pageStr);
          await page.cleanup();
          setProgressPercent(Math.round(10 + (i / numPages) * 35));
        }

        // Evaluate if this PDF has real text or is scanned images
        const averageCharsPerPage = totalCharsFound / Math.max(1, numPages);
        if (averageCharsPerPage < 15 && extractionMode === 'auto') {
          // Almost no text found, trigger OCR!
          requiresOcr = true;
          setStatusMessage(
            language === 'bn'
              ? 'স্ক্যান করা বা ছবিযুক্ত PDF সনাক্ত হয়েছে। OCR ইঞ্জিন চালু করা হচ্ছে...'
              : 'Scanned document detected with image pages. Activating OCR Engine...'
          );
        } else {
          // Direct extraction succeeded!
          setUsedEngine('Direct Text Stream');
          for (let i = 0; i < pageTexts.length; i++) {
            const pageNum = i + 1;
            const content = pageTexts[i];
            if (includePageHeaders) {
              fullText += `\n--- ${language === 'bn' ? 'পৃষ্ঠা' : 'Page'} ${pageNum} ---\n`;
            }
            fullText += content + '\n';
          }
        }
      }

      // Step 2: OCR Fallback if scanned image PDF or forced OCR
      if (requiresOcr) {
        setUsedEngine('OCR Scanner');
        setStatusMessage(
          language === 'bn'
            ? `OCR ইঞ্জিন লোড হচ্ছে (${ocrLang})... ব্রাউজারে অপটিক্যাল ক্যারেক্টার রিকগনিশন চলছে`
            : `Initializing OCR engine (${ocrLang})... Running in-browser optical recognition`
        );

        fullText = '';
        // Dynamically import Tesseract so it is only loaded on demand
        const { default: Tesseract } = await import('tesseract.js');
        const worker = await Tesseract.createWorker(ocrLang);

        try {
          for (let i = 1; i <= numPages; i++) {
            setStatusMessage(
              language === 'bn'
                ? `পৃষ্ঠা ${i} / ${numPages} OCR স্ক্যান করা হচ্ছে...`
                : `Scanning page ${i} of ${numPages} via OCR...`
            );

            const page = await doc.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');

            if (context) {
              await (page.render as any)({ canvas, canvasContext: context, viewport }).promise;

              const ocrResult = await worker.recognize(canvas);

              canvas.width = 1;
              canvas.height = 1;
              await page.cleanup();

              const recognizedText = ocrResult.data.text.trim();
              if (includePageHeaders) {
                fullText += `\n--- ${language === 'bn' ? 'পৃষ্ঠা' : 'Page'} ${i} [OCR] ---\n`;
              }
              fullText += recognizedText + '\n';
            }
            const pageBase = 40 + ((i - 1) / numPages) * 55;
            setProgressPercent(Math.round(pageBase + (1 / numPages) * 55));
          }
        } finally {
          await worker.terminate();
        }
      }

      // Cleanup formatting
      let cleaned = fullText.trim();
      if (cleanExtraWhitespace) {
        cleaned = cleaned.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
      }

      if (!cleaned) {
        cleaned = language === 'bn'
          ? 'কোনো টেক্সট পাওয়া যায়নি। ফাইলটি ফাঁকা বা অস্পষ্ট হতে পারে।'
          : 'No recognizable text could be extracted. The document may be blank or resolution too low.';
      }

      setExtractedText(cleaned);
      setStatus('success');
      setProgressPercent(100);
      setStatusMessage(
        language === 'bn'
          ? `সফলভাবে ${numPages} টি পৃষ্ঠা থেকে টেক্সট এক্সট্রাক্ট করা হয়েছে!`
          : `Extraction complete! Processed ${numPages} page${numPages > 1 ? 's' : ''}.`
      );
      trackEvent('tool_success', { tool_id: tool.id, char_count: cleaned.length });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setStatusMessage(err?.message || (language === 'bn' ? 'টেক্সট এক্সট্রাক্ট করতে ব্যর্থ হয়েছে।' : 'Failed to extract text.'));
      trackEvent('tool_error', { tool_id: tool.id, error: err?.message });
    } finally {
      try {
        if (doc) await doc.cleanup();
      } catch {}
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('tool_download', { tool_id: tool.id, action: 'copy_pdf_text' });
    } catch {
      // fallback
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name.replace(/\.pdf$/i, '') || 'extracted-document') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('tool_download', { tool_id: tool.id, action: 'download_txt' });
  };

  // Word and char statistics
  const charCount = extractedText.length;
  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;

  return (
    <main className="workspace">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/tools">{copy.tools}</Link>
          <span>/</span>
          <span>{tool.category}</span>
          <span>/</span>
          <strong>{tool.name}</strong>
        </nav>
        <Link to="/tools" className="back-link">
          <ArrowLeft size={15} /> {copy.backToTools}
        </Link>

        {/* Workspace Header */}
        <div className="workspace-head">
          <div>
            <span className="eyebrow">{tool.category} / {copy.liveNow}</span>
            <h1>{tool.seo.h1}</h1>
            <p className="muted workspace-intro">{tool.content.intro}</p>
          </div>
          <span className="mono muted workspace-badge">{copy.workspaceBadge}</span>
        </div>

        {/* ================= TWO-COLUMN LAYOUT STANDARD ================= */}
        <div className="tool-two-column-layout">
          {/* ================= LEFT SIDE: FIXED/STICKY TOOL POINTS & SETTINGS ================= */}
          <aside className="tool-points-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Settings2 size={20} style={{ color: 'hsl(var(--primary))' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                {language === 'bn' ? 'টুল পয়েন্টস ও কন্ট্রোল' : 'Tool Points & Controls'}
              </h3>
            </div>

            {/* Point 1: Extraction Engine */}
            <div className="tool-point-card">
              <span className="tool-point-title">
                <Sliders size={15} style={{ color: 'hsl(var(--primary))' }} />
                {language === 'bn' ? '১. এক্সট্রাকশন ইঞ্জিন (Engine)' : '1. Extraction Engine'}
              </span>
              <p className="tool-point-desc">
                {language === 'bn'
                  ? 'স্বয়ংক্রিয়ভাবে টেক্সট-বেসড নাকি স্ক্যান করা ছবি তা নির্ধারণ করবে।'
                  : 'Auto-detects digital text or scanned image documents.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="extractionMode"
                    value="auto"
                    checked={extractionMode === 'auto'}
                    onChange={() => setExtractionMode('auto')}
                  />
                  <span>
                    <strong>{language === 'bn' ? 'অটো-ডিটেক্ট (সুপারিশকৃত)' : 'Auto-Detect (Recommended)'}</strong>
                    <small style={{ display: 'block', color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>
                      {language === 'bn' ? 'ডিজিটাল টেক্সট রিড করবে, প্রয়োজন হলে OCR চালু হবে' : 'Tries native text streams first, fallbacks to OCR'}
                    </small>
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="extractionMode"
                    value="direct"
                    checked={extractionMode === 'direct'}
                    onChange={() => setExtractionMode('direct')}
                  />
                  <span>
                    <strong>{language === 'bn' ? 'শুধু ডিজিটাল টেক্সট' : 'Direct Text Only'}</strong>
                    <small style={{ display: 'block', color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>
                      {language === 'bn' ? 'সবচেয়ে দ্রুত গতির (নরমাল টাইপ করা PDF এর জন্য)' : 'Fastest for standard digital PDFs and eBooks'}
                    </small>
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="extractionMode"
                    value="ocr"
                    checked={extractionMode === 'ocr'}
                    onChange={() => setExtractionMode('ocr')}
                  />
                  <span>
                    <strong>{language === 'bn' ? 'বাধ্যতামূলক OCR স্ক্যান' : 'Force OCR Scanner'}</strong>
                    <small style={{ display: 'block', color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>
                      {language === 'bn' ? 'স্ক্যান করা ডকুমেন্টস বা ছবি-ভিত্তিক ফাইলের জন্য' : 'For scanned receipts, physical docs, and book scans'}
                    </small>
                  </span>
                </label>
              </div>
            </div>

            {/* Point 2: OCR Language Selector */}
            <div className="tool-point-card">
              <span className="tool-point-title">
                <Languages size={15} style={{ color: 'hsl(var(--primary))' }} />
                {language === 'bn' ? '২. OCR ভাষা (Language)' : '2. OCR Language'}
              </span>
              <p className="tool-point-desc">
                {language === 'bn'
                  ? 'স্ক্যান করা পৃষ্ঠার জন্য সঠিক অক্ষর চিনতে সাহায্য করে।'
                  : 'Target recognition script for scanned image text.'}
              </p>

              <select
                value={ocrLang}
                onChange={(e) => setOcrLang(e.target.value as OcrLang)}
                className="select"
                style={{
                  width: '100%',
                  marginTop: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))',
                }}
              >
                <option value="eng">English (English letters)</option>
                <option value="ben">Bengali / বাংলা</option>
                <option value="ben+eng">বাংলা + English (Combined)</option>
                <option value="hin">Hindi / हिन्दी</option>
                <option value="spa">Spanish / Español</option>
                <option value="fra">French / Français</option>
                <option value="ara">Arabic / العربية</option>
              </select>
            </div>

            {/* Point 3: Formatting & Layout Options */}
            <div className="tool-point-card">
              <span className="tool-point-title">
                <FileCode size={15} style={{ color: 'hsl(var(--primary))' }} />
                {language === 'bn' ? '৩. ফরম্যাটিং ও লেআউট' : '3. Output Formatting'}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includePageHeaders}
                    onChange={(e) => setIncludePageHeaders(e.target.checked)}
                  />
                  <span>{language === 'bn' ? 'পৃষ্ঠা নম্বর হেডার যুক্ত করুন' : 'Add Page Number Headers'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preserveLineBreaks}
                    onChange={(e) => setPreserveLineBreaks(e.target.checked)}
                  />
                  <span>{language === 'bn' ? 'প্যারাগ্রাফ ও লাইন ব্রেক সংরক্ষণ করুন' : 'Preserve Paragraph Linebreaks'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cleanExtraWhitespace}
                    onChange={(e) => setCleanExtraWhitespace(e.target.checked)}
                  />
                  <span>{language === 'bn' ? 'অতিরিক্ত স্পেস ক্লিন করুন' : 'Clean Excess Whitespace'}</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: 20 }}>
              <button
                type="button"
                className="button button-primary"
                style={{ width: '100%', marginBottom: 10, padding: '11px', fontSize: 14 }}
                disabled={!file || status === 'processing'}
                onClick={processPdf}
              >
                <Sparkles size={16} />
                {status === 'processing'
                  ? (language === 'bn' ? 'টেক্সট বিশ্লেষণ চলছে...' : 'Extracting...')
                  : (language === 'bn' ? 'টেক্সট এক্সট্রাক্ট করুন' : 'Extract Text Now')}
              </button>

              {file && (
                <button
                  type="button"
                  className="button button-ghost"
                  style={{ width: '100%' }}
                  onClick={reset}
                >
                  <RotateCcw size={14} /> {language === 'bn' ? 'নতুন ফাইল নির্বাচন' : 'Reset / New PDF'}
                </button>
              )}
            </div>

            {/* Privacy Badge */}
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                fontSize: 12,
                color: 'hsl(var(--muted-foreground))',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'hsl(var(--foreground))', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Check size={14} style={{ color: 'hsl(var(--primary))' }} />
                {language === 'bn' ? '১০০% ক্লায়েন্ট-সাইড নিরাপদ' : '100% Client-Side Private'}
              </strong>
              {language === 'bn'
                ? 'আপনার গোপনীয় ব্যাংক স্টেটমেন্ট, মেডিকেল রিপোর্ট বা আইনি নথি কোনো রিমোট সার্ভারে আপলোড হয় না। সবকিছু সরাসরি আপনার ডিভাইসে প্রসেস হয়।'
                : 'Sensitive documents, bank statements, and legal files never leave your device. All parsing and OCR runs in your browser memory.'}
            </div>
          </aside>

          {/* ================= RIGHT SIDE: WORKSPACE (1. Upload, 2. Progress, 3. Preview & Download, etc.) ================= */}
          <section className="workspace-main" style={{ padding: 24, borderRadius: 18, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}>
            {/* 1. PDF Upload Area */}
            <div
              className={`drop-target ${file ? 'has-file' : ''}`}
              style={{
                border: '2px dashed hsl(var(--border))',
                borderRadius: 16,
                padding: file ? '20px' : '36px 20px',
                textAlign: 'center',
                background: file ? 'hsl(var(--card))' : 'hsl(var(--card) / .6)',
                transition: 'all 0.2s ease',
                marginBottom: 20,
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files[0]);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />

              {!file ? (
                <div>
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      margin: '0 auto 14px',
                      borderRadius: '50%',
                      background: 'hsl(var(--primary) / .1)',
                      color: 'hsl(var(--primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Upload size={24} />
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 6, fontWeight: 700 }}>
                    {language === 'bn' ? '১. আপনার PDF ফাইলটি আপলোড করুন' : '1. Upload your PDF Document'}
                  </h3>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: 13, marginBottom: 14 }}>
                    {language === 'bn'
                      ? 'ডিজিটাল বই, স্ক্যান করা পেপার, বা যেকোনো PDF ড্র্যাগ করুন অথবা ক্লিক করে পছন্দ করুন।'
                      : 'Drag & drop any PDF or click to browse. Handles scanned, multi-page, and protected documents.'}
                  </p>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={15} /> {language === 'bn' ? 'PDF নির্বাচন করুন' : 'Choose PDF File'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'hsl(var(--primary) / .12)',
                        color: 'hsl(var(--primary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileText size={24} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ display: 'block', fontSize: 14 }}>{file.name}</strong>
                      <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                        {formatBytes(file.size)}
                        {pdfPageCount > 0 && ` · ${pdfPageCount} ${language === 'bn' ? 'পৃষ্ঠা' : 'pages'}`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} /> {language === 'bn' ? 'অন্য PDF পছন্দ করুন' : 'Change Document'}
                  </button>
                </div>
              )}
            </div>

            {/* Password Protection Handler */}
            {isPasswordProtected && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: 'hsl(var(--secondary) / .8)',
                  border: '1px solid hsl(var(--border))',
                  marginBottom: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'hsl(var(--primary))' }}>
                  <Lock size={16} />
                  <strong style={{ fontSize: 14 }}>
                    {language === 'bn' ? 'পাসওয়ার্ড সুরক্ষিত PDF' : 'Password Protected PDF'}
                  </strong>
                </div>
                <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginBottom: 10 }}>
                  {language === 'bn'
                    ? 'ডকুমেন্টটি আনলক করতে অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন:'
                    : 'This document is encrypted. Please enter the password to unlock text:'}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="password"
                    value={pdfPassword}
                    onChange={(e) => setPdfPassword(e.target.value)}
                    placeholder={language === 'bn' ? 'PDF পাসওয়ার্ড টাইপ করুন' : 'Enter PDF password'}
                    className="input"
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                  />
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={processPdf}
                  >
                    {language === 'bn' ? 'আনলক ও এক্সট্রাক্ট' : 'Unlock & Extract'}
                  </button>
                </div>
              </div>
            )}

            {/* 2. Analysis & Extraction Progress Status */}
            {(statusMessage || status === 'processing') && (
              <div
                style={{
                  marginBottom: 20,
                  padding: 16,
                  borderRadius: 12,
                  background: status === 'error' ? 'hsl(0 80% 50% / .1)' : 'hsl(var(--secondary) / .5)',
                  border: `1px solid ${status === 'error' ? 'hsl(0 80% 50% / .2)' : 'hsl(var(--border))'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: status === 'processing' ? 8 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {status === 'error' ? (
                      <AlertCircle size={16} style={{ color: 'hsl(0 75% 45%)' }} />
                    ) : (
                      <Sparkles size={16} style={{ color: 'hsl(var(--primary))' }} />
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600, color: status === 'error' ? 'hsl(0 75% 45%)' : 'hsl(var(--foreground))' }}>
                      {statusMessage}
                    </span>
                  </div>
                  {usedEngine && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: 'hsl(var(--primary) / .15)',
                        color: 'hsl(var(--primary))',
                      }}
                    >
                      {usedEngine}
                    </span>
                  )}
                </div>

                {status === 'processing' && (
                  <div
                    style={{
                      height: 6,
                      width: '100%',
                      background: 'hsl(var(--muted))',
                      borderRadius: 999,
                      overflow: 'hidden',
                      marginTop: 8,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${progressPercent}%`,
                        background: 'hsl(var(--primary))',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* 3. Live Preview & Instant Download Section */}
            <div style={{ marginTop: 24, marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'hsl(var(--primary))',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    3
                  </span>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                    {language === 'bn' ? '৩. টেক্সট প্রিভিউ ও ডাউনলোড' : '3. Text Preview & Download'}
                  </h4>
                </div>

                {extractedText && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                    <span>{pdfPageCount} {language === 'bn' ? 'পৃষ্ঠা' : 'pages'}</span>
                    <span>·</span>
                    <span>{wordCount.toLocaleString()} {language === 'bn' ? 'শব্দ' : 'words'}</span>
                    <span>·</span>
                    <span>{charCount.toLocaleString()} {language === 'bn' ? 'অক্ষর' : 'chars'}</span>
                  </div>
                )}
              </div>

              {/* Text Preview Box */}
              <div
                style={{
                  borderRadius: 14,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  overflow: 'hidden',
                }}
              >
                <textarea
                  value={extractedText}
                  placeholder={
                    language === 'bn'
                      ? 'PDF ফাইল আপলোড করার পর এক্সট্রাক্ট করা টেক্সট এখানে প্রদর্শিত হবে...'
                      : 'Extracted text will appear here automatically once processed...'
                  }
                  readOnly
                  rows={14}
                  style={{
                    width: '100%',
                    padding: 16,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'var(--font-mono, monospace), system-ui',
                    fontSize: 13,
                    lineHeight: 1.65,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Action Buttons Directly Underneath Preview */}
              {extractedText && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    borderRadius: 14,
                    background: 'hsl(var(--secondary) / .4)',
                    border: '1px solid hsl(var(--border))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      className="button button-primary"
                      style={{ padding: '10px 20px', fontSize: 14 }}
                      onClick={handleDownloadTxt}
                    >
                      <Download size={16} />
                      {language === 'bn' ? '.TXT ফাইল ডাউনলোড করুন' : 'Download .TXT File'}
                    </button>

                    <button
                      type="button"
                      className="button button-ghost"
                      style={{ padding: '10px 18px', fontSize: 14 }}
                      onClick={handleCopy}
                    >
                      {copied ? <Check size={16} style={{ color: 'hsl(var(--primary))' }} /> : <Copy size={16} />}
                      <span>{copied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'টেক্সট কপি করুন' : 'Copy Text')}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="button button-ghost"
                    style={{ fontSize: 13 }}
                    onClick={() => {
                      setExtractedText('');
                      setStatus('ready');
                    }}
                  >
                    {language === 'bn' ? 'মুছে ফেলুন' : 'Clear View'}
                  </button>
                </div>
              )}
            </div>

            {/* 4. How To Use This Tool (Complete Step-by-Step Guide for New Users) */}
            <div className="tool-content" style={{ marginTop: 40, borderTop: '1px solid hsl(var(--border))', paddingTop: 28 }}>
              <h2>{language === 'bn' ? '৪. কীভাবে PDF থেকে টেক্সট বের করবেন (সম্পূর্ণ গাইড)' : '4. How to Extract Text from PDF (Complete Guide)'}</h2>
              <ol>
                <li>
                  <strong>{language === 'bn' ? '১ম ধাপ (PDF আপলোড):' : 'Step 1 (Upload PDF):'}</strong>{' '}
                  {language === 'bn'
                    ? '১ নম্বর বক্সে আপনার কাঙ্ক্ষিত PDF ফাইলটি ড্র্যাগ করে আনুন অথবা "PDF নির্বাচন করুন" বাটনে ক্লিক করে ডিভাইস থেকে সিলেক্ট করুন।'
                    : 'Drag & drop your PDF file into Step 1 or click "Choose PDF File". Multi-page documents and scanned papers are fully supported.'}
                </li>
                <li>
                  <strong>{language === 'bn' ? '২য় ধাপ (পাসওয়ার্ড ও সেটিংস):' : 'Step 2 (Password & Settings):'}</strong>{' '}
                  {language === 'bn'
                    ? 'ডকুমেন্টটি পাসওয়ার্ড দিয়ে লক করা থাকলে পাসওয়ার্ড বক্সে পাসওয়ার্ড দিন। বাম পাশের প্যানেল থেকে চাইলে ওসিআর ভাষা (যেমন বাংলা বা ইংরেজি) এবং লাইন ব্রেক সেটিংস পরিবর্তন করতে পারেন।'
                    : 'If the document is encrypted, input the unlock password. Use the left sidebar to pick OCR script language (e.g., Bengali, English) and layout options.'}
                </li>
                <li>
                  <strong>{language === 'bn' ? '৩য় ধাপ (টেক্সট এক্সট্রাক্ট):' : 'Step 3 (Extraction & OCR Analysis):'}</strong>{' '}
                  {language === 'bn'
                    ? 'বাম পাশের "টেক্সট এক্সট্রাক্ট করুন" বাটনে ক্লিক করুন। এটি প্রথমে সরাসরি টেক্সট স্ট্রিম স্ক্যান করবে; যদি স্ক্যান করা ছবি পায় তবে স্বয়ংক্রিয়ভাবে ক্লায়েন্ট-সাইড Tesseract OCR দিয়ে অক্ষর চিনে টেক্সট বের করবে।'
                    : 'Click "Extract Text Now". The engine analyzes text streams directly, or seamlessly falls back to in-browser Tesseract.js OCR for scanned papers.'}
                </li>
                <li>
                  <strong>{language === 'bn' ? '৪র্থ ধাপ (প্রিভিউ ও ডাউনলোড):' : 'Step 4 (Preview & Download):'}</strong>{' '}
                  {language === 'bn'
                    ? 'প্রসেসিং শেষ হলে ৩ নম্বর বাক্সে পুরো টেক্সট পড়ার উপযোগীভাবে প্রদর্শিত হবে। নিচে থাকা বাটন দিয়ে সরাসরি .TXT ফাইল ডাউনলোড অথবা এক ক্লিকে ক্লিপবোর্ডে কপি করুন।'
                    : 'Read the extracted result in Step 3 Live Preview. Click "Download .TXT File" to save locally or click "Copy Text" to copy directly to your clipboard.'}
                </li>
              </ol>

              <h2>{copy.privacyAndLimitations}</h2>
              <p>{tool.content.privacy}</p>
              <p>{tool.content.limitations}</p>
            </div>

            {/* 5. Related Tools Section */}
            <RelatedTools tool={tool} />

            {/* 6. FAQ Section */}
            <div className="tool-content" style={{ marginTop: 44, borderTop: '1px solid hsl(var(--border))', paddingTop: 32 }}>
              <h2>{language === 'bn' ? '৬. সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : '6. Frequently Asked Questions (FAQ)'}</h2>
              <div className="faq-list">
                {tool.content.faq.map(({ question, answer }) => (
                  <details key={question} className="tool-faq">
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Sponsored Ad Slot */}
            <div style={{ marginTop: 32 }}>
              <AdSlot enabled={consent.advertising} slot={adConfig.toolSlot} label="Sponsored Ad" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PdfToTextTool;
