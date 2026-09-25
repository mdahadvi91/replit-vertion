import { useState, useRef } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
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

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export function JpgToPdfTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('portrait');
  const [margin, setMargin] = useState<number>(20); // pts
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const resetWorkspace = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setStatus('idle');
    setErrorMessage('');
    setPdfBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: ImageItem[] = [];
    const validTypes = ['image/jpeg', 'image/jpg'];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(jpe?g)$/)) {
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImages((prev) =>
          prev.map((item) =>
            item.id === file.name + file.lastModified
              ? { ...item, width: img.naturalWidth, height: img.naturalHeight }
              : item
          )
        );
      };
      img.src = previewUrl;

      newItems.push({
        id: file.name + file.lastModified + Math.random(),
        file,
        previewUrl,
        width: 800,
        height: 600,
      });
    });

    if (newItems.length === 0) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে শুধু JPG বা JPEG ফাইল সিলেক্ট করুন।' : 'Please select valid JPG/JPEG images.');
      setStatus('error');
      return;
    }

    setImages((prev) => [...prev, ...newItems]);
    setStatus('idle');
    setErrorMessage('');
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].previewUrl);
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    setStatus('generating');
    setErrorMessage('');

    try {
      const pdfDoc = await PDFDocument.create();

      // Page dimension constants in points (72 points = 1 inch)
      const pageDimensions: Record<string, [number, number]> = {
        a4: [595.28, 841.89],
        letter: [612.0, 792.0],
      };

      for (const item of images) {
        const buffer = await item.file.arrayBuffer();
        const embeddedImg = await pdfDoc.embedJpg(buffer);

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === 'fit') {
          pageWidth = embeddedImg.width + margin * 2;
          pageHeight = embeddedImg.height + margin * 2;
        } else {
          const dims = pageDimensions[pageSize];
          let [w, h] = dims;

          const isImgLandscape = embeddedImg.width > embeddedImg.height;
          const useLandscape = orientation === 'landscape' || (orientation === 'auto' && isImgLandscape);

          pageWidth = useLandscape ? Math.max(w, h) : Math.min(w, h);
          pageHeight = useLandscape ? Math.min(w, h) : Math.max(w, h);
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate fitted image dimensions maintaining aspect ratio
        const availableW = pageWidth - margin * 2;
        const availableH = pageHeight - margin * 2;
        const imgRatio = embeddedImg.width / embeddedImg.height;
        const boxRatio = availableW / availableH;

        let drawW: number;
        let drawH: number;

        if (imgRatio > boxRatio) {
          drawW = availableW;
          drawH = availableW / imgRatio;
        } else {
          drawH = availableH;
          drawW = availableH * imgRatio;
        }

        const drawX = margin + (availableW - drawW) / 2;
        const drawY = margin + (availableH - drawH) / 2;

        page.drawImage(embeddedImg, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setPdfBlob(blob);
      setStatus('done');

      trackEvent('tool_run', { tool: 'jpg-to-pdf', count: images.length });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(language === 'bn' ? 'PDF তৈরি করতে ব্যর্থ হয়েছে।' : 'Failed to generate PDF from images.');
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ahadex-images.pdf';
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
          {tool.category} / {isBn ? '১০০% ব্রাউজারে তৈরি' : '100% Client-Side'}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed hsl(var(--primary) / .4)',
              borderRadius: 16,
              padding: images.length > 0 ? '30px 20px' : '60px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'hsl(var(--primary) / .03)',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,image/jpeg"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'hsl(var(--primary) / .1)',
                color: 'hsl(var(--primary))',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <ImageIcon size={24} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>
              {images.length > 0
                ? isBn ? 'আরও JPG ছবি যোগ করুন' : 'Add More JPG Images'
                : isBn ? 'আপনার JPG ছবিগুলো নির্বাচন বা ড্র্যাগ করুন' : 'Select or Drag & Drop JPG Images'}
            </h3>
            <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
              {isBn ? 'একাধিক ছবি একসাথে নির্বাচন করা যাবে' : 'Select one or multiple images simultaneously'}
            </span>
          </div>

          {/* Config Controls */}
          {images.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                padding: 16,
                borderRadius: 12,
                background: 'hsl(var(--secondary) / .3)',
                border: '1px solid hsl(var(--border))',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  {isBn ? 'পৃষ্ঠার সাইজ' : 'Page Size'}
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8 }}
                >
                  <option value="a4">A4 (Standard)</option>
                  <option value="letter">US Letter</option>
                  <option value="fit">{isBn ? 'ছবির মাপ অনুযায়ী (Fit)' : 'Fit to Image'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  {isBn ? 'অরিয়েন্টেশন' : 'Orientation'}
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  disabled={pageSize === 'fit'}
                  className="input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8 }}
                >
                  <option value="portrait">{isBn ? 'লম্বালম্বি (Portrait)' : 'Portrait'}</option>
                  <option value="landscape">{isBn ? 'আড়াআড়ি (Landscape)' : 'Landscape'}</option>
                  <option value="auto">{isBn ? 'স্বয়ংক্রিয় (Auto)' : 'Auto-detect per image'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  {isBn ? 'মার্জিন' : 'Page Margin'}
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8 }}
                >
                  <option value={0}>{isBn ? 'মার্জিন ছাড়া (0)' : 'No Margin'}</option>
                  <option value={15}>{isBn ? 'ছোট (15pt)' : 'Small Margin'}</option>
                  <option value={30}>{isBn ? 'বড় (30pt)' : 'Normal Margin'}</option>
                </select>
              </div>
            </div>
          )}

          {/* Image List Preview & Reorder */}
          {images.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <strong style={{ fontSize: 15 }}>
                  {isBn ? `নির্বাচিত ছবি (${images.length}টি)` : `Selected Images (${images.length})`}
                </strong>
                <button type="button" className="button button-ghost" onClick={resetWorkspace} style={{ fontSize: 12 }}>
                  <RotateCcw size={13} /> {isBn ? 'সব মুছুন' : 'Clear All'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    style={{
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 12,
                      padding: 10,
                      background: 'hsl(var(--card))',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', height: 120, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                      <img
                        src={img.previewUrl}
                        alt={img.file.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 6,
                          left: 6,
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        #{idx + 1}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={img.file.name}
                    >
                      {img.file.name}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          className="button button-ghost"
                          onClick={() => moveImage(idx, 'up')}
                          disabled={idx === 0}
                          style={{ padding: 4 }}
                          title="Move Left/Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          className="button button-ghost"
                          onClick={() => moveImage(idx, 'down')}
                          disabled={idx === images.length - 1}
                          style={{ padding: 4 }}
                          title="Move Right/Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => removeImage(idx)}
                        style={{ padding: 4, color: 'hsl(var(--destructive))' }}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button & Result */}
          {images.length > 0 && status !== 'done' && (
            <button
              type="button"
              className="button button-primary"
              disabled={status === 'generating'}
              onClick={handleGeneratePdf}
              style={{ padding: '12px 28px', fontSize: 15, alignSelf: 'flex-start' }}
            >
              <Sparkles size={16} />
              {status === 'generating'
                ? isBn ? 'PDF তৈরি হচ্ছে...' : 'Generating PDF...'
                : isBn ? 'PDF তৈরি করুন' : 'Convert to PDF'}
            </button>
          )}

          {status === 'done' && pdfBlob && (
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
                  <strong style={{ fontSize: 16 }}>{isBn ? 'PDF প্রস্তুত!' : 'PDF Generated Successfully!'}</strong>
                  <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', display: 'block' }}>
                    {formatBytes(pdfBlob.size)} • {images.length} {isBn ? 'টি ছবি অন্তর্ভুক্ত' : 'images included'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="button button-primary"
                onClick={handleDownload}
                style={{ padding: '10px 24px', fontSize: 14 }}
              >
                <Download size={16} /> {isBn ? 'PDF ডাউনলোড করুন' : 'Download PDF'}
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
      </section>

      <section className="tool-content" style={{ marginTop: 40, borderTop: '1px solid hsl(var(--border))', paddingTop: 28 }}>
        <h2>{isBn ? 'কীভাবে JPG ছবিকে PDF এ রূপান্তর করবেন' : 'How to Convert JPG Images to PDF'}</h2>
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

export default JpgToPdfTool;
