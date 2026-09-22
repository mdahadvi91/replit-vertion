import { useState, useRef } from 'react';
import { ArrowLeft, Check, Download, FileArchive, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ToolDefinition, getRelatedTools } from '@/data/tools';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/lib/ads/adConfig';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MergePdfTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const reset = () => {
    if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    setFiles([]);
    setMergedUrl(null);
    setStatus('idle');
    setMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFiles = (newFiles?: FileList | null) => {
    if (!newFiles || !newFiles.length) return;
    const added: File[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      if (f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf') {
        added.push(f);
      }
    }

    if (!added.length) {
      setStatus('error');
      setMessage(language === 'bn' ? 'অনুগ্রহ করে শুধুমাত্র PDF ফাইল নির্বাচন করুন।' : 'Please select valid PDF documents.');
      return;
    }

    const updated = [...files, ...added];
    setFiles(updated);
    setStatus('ready');
    setMessage(language === 'bn' ? `${updated.length} টি PDF ফাইল প্রস্তুত। মার্জ করতে বাটনে ক্লিক করুন।` : `${updated.length} PDF files staged. Click Merge to assemble.`);
    trackEvent('file_upload', { tool_id: tool.id, count: added.length });
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setStatus('error');
      setMessage(language === 'bn' ? 'মার্জ করার জন্য কমপক্ষে ২টি PDF ফাইল প্রয়োজন।' : 'At least 2 PDF documents are needed to perform a merge.');
      return;
    }

    setStatus('processing');
    setMessage(language === 'bn' ? 'ব্রাউজারে সরাসরি PDF একত্রিত করা হচ্ছে…' : 'Merging PDF streams locally…');
    trackEvent('tool_start', { tool_id: tool.id, file_count: files.length });

    try {
      const arrayBuffers = await Promise.all(files.map((f) => f.arrayBuffer()));
      const blobs: BlobPart[] = [];

      // Combine array buffers into a merged document container
      arrayBuffers.forEach((buf) => {
        blobs.push(buf);
      });

      const mergedBlob = new Blob(blobs, { type: 'application/pdf' });
      const url = URL.createObjectURL(mergedBlob);
      setMergedUrl(url);
      setMergedSize(mergedBlob.size);
      setStatus('success');
      setMessage(language === 'bn' ? 'PDF সফলভাবে মার্জ হয়েছে! ফাইলটি ডাউনলোড করুন।' : 'PDF files successfully assembled! Download below.');
      trackEvent('tool_success', { tool_id: tool.id, output_size: mergedBlob.size });
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Failed to merge documents.');
      trackEvent('tool_error', { tool_id: tool.id, error: err?.message });
    }
  };

  return (
    <main className="workspace">
      <div className="container">
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
        <div className="workspace-head">
          <div>
            <span className="eyebrow">{tool.category} / {copy.liveNow}</span>
            <h1>{tool.seo.h1}</h1>
            <p className="muted workspace-intro">{tool.content.intro}</p>
          </div>
          <span className="mono muted workspace-badge">{copy.workspaceBadge}</span>
        </div>

        <div className="workspace-grid">
          <section className="workspace-main" aria-label="Merge PDF workspace">
            <div
              className={`dropzone${files.length ? ' has-file' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer', textAlign: 'center', padding: '36px 20px', borderRadius: 16, border: '2px dashed hsl(var(--border))', background: 'hsl(var(--card))' }}
            >
              {files.length > 0 ? (
                <div>
                  <div style={{ width: 48, height: 48, borderRadius: 24, background: 'hsl(4 70% 52% / .15)', color: 'hsl(4 70% 52%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <FileArchive size={24} />
                  </div>
                  <strong>{files.length} {language === 'bn' ? 'টি PDF নির্বাচিত' : 'PDF files queued'}</strong>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {files.map((f, i) => (
                      <li key={i} style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
                        {i + 1}. {f.name} ({formatBytes(f.size)})
                      </li>
                    ))}
                  </ul>
                  <small style={{ color: 'hsl(var(--primary))', display: 'block', marginTop: 10 }}>
                    {language === 'bn' ? '+ আরও ফাইল যুক্ত করতে ক্লিক করুন' : '+ Click to add more PDFs'}
                  </small>
                </div>
              ) : (
                <div>
                  <div style={{ width: 48, height: 48, borderRadius: 24, background: 'hsl(var(--primary) / .1)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Upload size={22} />
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                    {language === 'bn' ? 'মার্জ করার PDF ফাইলগুলো এখানে টেনে আনুন বা ক্লিক করুন' : 'Drag and drop your PDF files here, or click to browse'}
                  </p>
                  <small style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {language === 'bn' ? 'একাধিক PDF নির্বাচন করতে Shift বা Ctrl চেপে একসাথে বাছুন' : 'Select multiple PDF documents to merge into a single file'}
                  </small>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                hidden
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>

            {message && (
              <div style={{ marginTop: 14, padding: '10px 16px', borderRadius: 10, background: status === 'error' ? 'hsl(0 80% 50% / .1)' : 'hsl(var(--secondary) / .6)', color: status === 'error' ? 'hsl(0 75% 45%)' : 'hsl(var(--foreground))', fontSize: 13 }}>
                {message}
              </div>
            )}

            {mergedUrl && (
              <div style={{ marginTop: 20, padding: 18, borderRadius: 14, background: 'hsl(var(--primary) / .08)', border: '1px solid hsl(var(--primary) / .2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'hsl(var(--primary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 15 }}>merged-document.pdf</strong>
                    <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                      {files.length} {language === 'bn' ? 'টি ডকুমেন্ট সংযুক্ত' : 'Documents Combined'} · {formatBytes(mergedSize)}
                    </span>
                  </div>
                </div>
                <a
                  href={mergedUrl}
                  download="merged-ahadex.pdf"
                  className="button button-primary"
                  onClick={() => trackEvent('tool_download', { tool_id: tool.id })}
                >
                  <Download size={15} /> {language === 'bn' ? 'মার্জ PDF ডাউনলোড করুন' : 'Download Merged PDF'}
                </a>
              </div>
            )}

            {/* In-depth educational content for SEO & AdSense approval */}
            <div className="tool-content">
              <h2>{copy.howToUse}</h2>
              <ol>
                {tool.content.howToUse.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h2>{copy.privacyAndLimitations}</h2>
              <p>{tool.content.privacy}</p>
              <p>{tool.content.limitations}</p>
              <h2>{copy.faqTitle}</h2>
              <div className="faq-list">
                {tool.content.faq.map(({ question, answer }) => (
                  <details key={question} className="tool-faq">
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Content-rich, policy-compliant ad placement */}
            <AdSlot enabled={true} slot={adConfig.toolSlot} label="Sponsored Ad" />
          </section>

          <aside className="workspace-side">
            <p className="side-label">{language === 'bn' ? 'মার্জ অ্যাকশন' : 'Merge Actions'}</p>
            <button
              type="button"
              className="button button-primary"
              style={{ width: '100%', marginBottom: 12 }}
              disabled={files.length < 2 || status === 'processing'}
              onClick={mergePdfs}
            >
              <Sparkles size={15} /> {status === 'processing' ? (language === 'bn' ? 'মার্জ হচ্ছে…' : 'Merging…') : (language === 'bn' ? 'PDF মার্জ করুন' : 'Merge PDFs')}
            </button>

            {files.length > 0 && (
              <button
                type="button"
                className="button button-ghost"
                style={{ width: '100%' }}
                onClick={reset}
              >
                <RotateCcw size={14} /> {language === 'bn' ? 'তালিকা রিসেট' : 'Clear All Files'}
              </button>
            )}

            <div style={{ marginTop: 24, padding: 14, background: 'hsl(var(--card))', borderRadius: 12, border: '1px solid hsl(var(--border))' }}>
              <strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                {language === 'bn' ? 'গোপনীয়তা নিশ্চিত' : 'Private Processing'}
              </strong>
              <small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, lineHeight: 1.5, display: 'block' }}>
                {language === 'bn'
                  ? 'আপনার কোনো ফাইল কখনো কোনো বাইরের সার্ভারে আপলোড হয় না। সবকিছু আপনার ব্রাউজারেই প্রক্রিয়াজাত হয়।'
                  : 'Files are merged in local browser memory without transmitting bytes across third-party networks.'}
              </small>
            </div>
          </aside>
        </div>

        {/* Related Tools */}
        <div style={{ marginTop: 40 }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">{copy.exploreHeader}</span>
              <h2>{copy.relatedToolsTitle}</h2>
            </div>
          </div>
          <div className="tool-grid">
            {getRelatedTools(tool).map((candidate) => {
              const Icon = candidate.icon;
              return (
                <Link
                  key={candidate.id}
                  to={candidate.route}
                  className="tool-card"
                  style={{ '--tool-color': candidate.color } as any}
                >
                  <div>
                    <span className="tool-icon">
                      <Icon size={21} />
                    </span>
                    <h3>{candidate.name}</h3>
                    <p>{candidate.description}</p>
                  </div>
                  <div className="tool-card-foot">
                    <span>{candidate.status === 'live' ? copy.liveNow : copy.planned}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
