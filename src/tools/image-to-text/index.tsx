import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  Copy,
  AlertCircle,
  Image as ImageIcon,
  Languages,
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { Document, Paragraph, TextRun, Packer } from 'docx';
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

type OcrLang = 'eng' | 'ben' | 'ben+eng' | 'hin' | 'spa' | 'fra' | 'deu' | 'ara';

export function ImageToTextTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [ocrLang, setOcrLang] = useState<OcrLang>('eng');
  const [status, setStatus] = useState<'idle' | 'recognizing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const resetWorkspace = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setStatus('idle');
    setProgress(0);
    setProgressStatus('');
    setExtractedText('');
    setCopied(false);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে একটি ছবি সিলেক্ট করুন।' : 'Please select a valid image file.');
      setStatus('error');
      return;
    }

    const objUrl = URL.createObjectURL(selected);
    setFile(selected);
    setPreviewUrl(objUrl);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleRunOcr = async () => {
    if (!file) return;

    setStatus('recognizing');
    setProgress(10);
    setProgressStatus(language === 'bn' ? 'OCR মডেল লোড হচ্ছে...' : 'Initializing OCR engine...');
    setErrorMessage('');

    try {
      const worker = await createWorker(ocrLang);

      setProgress(40);
      setProgressStatus(language === 'bn' ? 'অক্ষর শনাক্তকরণ চলছে...' : 'Recognizing text...');

      const ret = await worker.recognize(file);
      await worker.terminate();

      const text = ret.data.text.trim();
      setExtractedText(text || (language === 'bn' ? 'কোনো সুস্পষ্ট টেক্সট পাওয়া যায়নি।' : 'No readable text recognized in image.'));
      setProgress(100);
      setStatus('done');

      trackEvent('tool_run', { tool: 'image-to-text', lang: ocrLang });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'OCR প্রক্রিয়ায় সমস্যা হয়েছে।' : 'Error during text extraction.');
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    link.href = url;
    link.download = `${baseName}-ocr.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadDocx = async () => {
    if (!extractedText || !file) return;
    const paragraphs = extractedText.split('\n').map((line) => new Paragraph({ children: [new TextRun(line)] }));
    const doc = new Document({
      sections: [{ children: paragraphs.length > 0 ? paragraphs : [new Paragraph('No text')] }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    link.href = url;
    link.download = `${baseName}-ocr.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const isBn = language === 'bn';
  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? 'বহুভাষিক OCR ইঞ্জিন' : 'Multilingual Browser OCR'}
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
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
              {isBn ? 'যে ছবি থেকে টেক্সট বের করবেন সেটি নির্বাচন করুন' : 'Select Image to Extract Text (OCR)'}
            </h3>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px' }}>
              {isBn ? 'JPG, PNG বা WebP ছবি থেকে বাংলা, ইংরেজি ও অন্যান্য ভাষার টেক্সট পড়ুন' : 'Supports English, Bengali, Spanish, French, and 100+ languages'}
            </p>
            <button type="button" className="button button-primary">
              <Upload size={16} /> {isBn ? 'ছবি নির্বাচন করুন' : 'Choose Image'}
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

            {/* Language Selection */}
            {status !== 'done' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  borderRadius: 12,
                  background: 'hsl(var(--secondary) / .2)',
                  border: '1px solid hsl(var(--border))',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Languages size={18} style={{ color: 'hsl(var(--primary))' }} />
                  <strong style={{ fontSize: 14 }}>{isBn ? 'ছবির ভাষা:' : 'Script Language:'}</strong>
                </div>
                <select
                  value={ocrLang}
                  onChange={(e) => setOcrLang(e.target.value as any)}
                  className="input"
                  style={{ minWidth: 200, padding: '8px 12px', fontSize: 13, borderRadius: 8 }}
                >
                  <option value="eng">English (English)</option>
                  <option value="ben">বাংলা (Bengali)</option>
                  <option value="ben+eng">বাংলা + English (Mixed)</option>
                  <option value="hin">हिन्दी (Hindi)</option>
                  <option value="spa">Español (Spanish)</option>
                  <option value="fra">Français (French)</option>
                  <option value="deu">Deutsch (German)</option>
                  <option value="ara">العربية (Arabic)</option>
                </select>
              </div>
            )}

            {status !== 'recognizing' && status !== 'done' && (
              <button
                type="button"
                className="button button-primary"
                onClick={handleRunOcr}
                style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
              >
                <Sparkles size={16} /> {isBn ? 'টেক্সট এক্সট্রাক্ট করুন (OCR)' : 'Extract Text with OCR'}
              </button>
            )}

            {status === 'recognizing' && (
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
                <span style={{ fontSize: 14, color: 'hsl(var(--primary))', fontWeight: 600 }}>
                  {progressStatus}
                </span>
              </div>
            )}

            {status === 'done' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Check size={20} style={{ color: 'hsl(var(--primary))' }} />
                    <span style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))' }}>
                      {wordCount} {isBn ? 'শব্দ' : 'words'} • {charCount} {isBn ? 'অক্ষর' : 'characters'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button type="button" className="button button-ghost" onClick={handleCopy} style={{ fontSize: 13 }}>
                      {copied ? <Check size={14} style={{ color: 'hsl(var(--primary))' }} /> : <Copy size={14} />}
                      {copied ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'কপি করুন' : 'Copy Text')}
                    </button>
                    <button type="button" className="button button-ghost" onClick={handleDownloadTxt} style={{ fontSize: 13 }}>
                      <Download size={14} /> {isBn ? '.TXT ডাউনলোড' : 'Download .TXT'}
                    </button>
                    <button type="button" className="button button-primary" onClick={handleDownloadDocx} style={{ fontSize: 13 }}>
                      <Download size={14} /> {isBn ? 'Word (.docx) ডাউনলোড' : 'Download Word'}
                    </button>
                  </div>
                </div>

                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  rows={10}
                  className="input"
                  style={{
                    width: '100%',
                    padding: 16,
                    fontFamily: 'monospace, system-ui',
                    fontSize: 14,
                    lineHeight: 1.6,
                    borderRadius: 12,
                    boxSizing: 'border-box',
                  }}
                />
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
        <h2>{isBn ? 'কীভাবে ছবি থেকে টেক্সট বের করবেন' : 'How to Extract Text from Images with OCR'}</h2>
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

export default ImageToTextTool;
