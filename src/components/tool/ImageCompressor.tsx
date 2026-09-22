import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileCheck,
  FileImage,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRelatedTools, type ToolDefinition } from '@/data/tools';
import { trackEvent } from '@/lib/analytics';
import { ImageValidationError, validateImageFile } from '@/lib/image-validation';
import { useI18n } from '@/i18n';
import {
  compressImage,
  compressionProfiles,
  type CompressionProfile,
  type CompressionStats,
} from '@/tools/image-compressor';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/lib/ads/adConfig';

type CompressorStatus = 'idle' | 'ready' | 'processing' | 'success' | 'error';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function ToolBreadcrumb({ tool }: { tool: ToolDefinition }) {
  const { copy } = useI18n();
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/tools">{copy.tools}</Link>
      <span>/</span>
      <span>{tool.category}</span>
      <span>/</span>
      <strong>{tool.name}</strong>
    </nav>
  );
}

function RelatedTools({ tool }: { tool: ToolDefinition }) {
  const { copy } = useI18n();
  const related = getRelatedTools(tool);
  if (!related.length) return null;

  return (
    <section className="related-tools" aria-labelledby="related-tools-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{copy.exploreHeader}</span>
          <h2 id="related-tools-heading">{copy.relatedToolsTitle}</h2>
        </div>
      </div>
      <div className="tool-grid">
        {related.map((candidate) => {
          const Icon = candidate.icon;
          return (
            <Link
              key={candidate.id}
              to={candidate.route}
              className="tool-card reveal"
              style={{ '--tool-color': candidate.color } as CSSProperties}
              data-testid={`link-related-tool-${candidate.slug}`}
              onClick={() =>
                trackEvent('related_tool_click', {
                  source_tool_id: tool.id,
                  related_tool_id: candidate.id,
                  related_tool_slug: candidate.slug,
                })
              }
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
                <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ImageCompressor({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const outputUrlRef = useRef('');
  const runIdRef = useRef(0);
  const [quality, setQuality] = useState<CompressionProfile>('balanced');
  const [convertToWebP, setConvertToWebP] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    url: string;
    name: string;
    size: number;
    stats: CompressionStats;
  } | null>(null);
  const [status, setStatus] = useState<CompressorStatus>('idle');
  const [message, setMessage] = useState('');

  const releaseOutput = () => {
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    outputUrlRef.current = '';
    setResult(null);
  };

  useEffect(() => () => {
    runIdRef.current += 1;
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
  }, []);

  const reset = () => {
    runIdRef.current += 1;
    releaseOutput();
    setFile(null);
    setStatus('idle');
    setMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const acceptFile = (nextFile?: File) => {
    if (!nextFile) return;
    runIdRef.current += 1;
    try {
      validateImageFile(nextFile);
    } catch (error) {
      releaseOutput();
      setFile(null);
      setStatus('error');
      setMessage(error instanceof ImageValidationError ? error.message : 'This file could not be validated.');
      trackEvent('tool_error', { tool_id: tool.id, tool_slug: tool.slug, stage: 'validation' });
      return;
    }

    releaseOutput();
    setFile(nextFile);
    setStatus('ready');
    setMessage(
      language === 'bn'
        ? 'ছবি প্রস্তুত। কোয়ালিটি প্রোফাইল নির্বাচন করে কমপ্রেস বাটনে ক্লিক করুন।'
        : 'Ready to compress. Choose a profile, then start the local process.'
    );
    trackEvent('file_upload', {
      tool_id: tool.id,
      tool_slug: tool.slug,
      category: tool.category,
      file_format: nextFile.type,
      file_size_bytes: nextFile.size,
    });
  };

  const processFile = async () => {
    if (!file || status === 'processing') return;
    const currentRunId = ++runIdRef.current;
    setStatus('processing');
    setMessage(
      language === 'bn'
        ? 'ব্রাউজারে কোনো ডেটা আপলোড ছাড়াই লোকাল প্রসেসিং চলছে…'
        : 'Processing your image locally in this browser…'
    );
    trackEvent('tool_start', {
      tool_id: tool.id,
      tool_slug: tool.slug,
      profile: quality,
      convertToWebP,
    });

    try {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 60));
      const output = await compressImage(file, { profile: quality, convertToWebP });
      if (currentRunId !== runIdRef.current) return;
      const url = URL.createObjectURL(output.blob);
      releaseOutput();
      outputUrlRef.current = url;
      setResult({
        url,
        name: output.fileName,
        size: output.blob.size,
        stats: output.stats,
      });
      setStatus('success');
      setMessage(
        language === 'bn'
          ? `${formatBytes(file.size)} থেকে কমে ${formatBytes(output.blob.size)} হয়েছে (${output.stats.ratioPercent}% সাশ্রয়)!`
          : `Compressed from ${formatBytes(file.size)} to ${formatBytes(output.blob.size)} (${output.stats.ratioPercent}% saved).`
      );
      trackEvent('tool_process', {
        tool_id: tool.id,
        tool_slug: tool.slug,
        profile: quality,
        input_bytes: file.size,
        output_bytes: output.blob.size,
        saved_percent: output.stats.ratioPercent,
      });
      trackEvent('tool_success', { tool_id: tool.id, tool_slug: tool.slug });
    } catch (error) {
      if (currentRunId !== runIdRef.current) return;
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'The image could not be processed.');
      trackEvent('tool_error', { tool_id: tool.id, tool_slug: tool.slug, stage: 'processing' });
    }
  };

  const handleDropzoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleDownload = () => {
    trackEvent('tool_download', { tool_id: tool.id, tool_slug: tool.slug, file_name: result?.name });
  };

  return (
    <main className="workspace">
      <div className="container">
        <ToolBreadcrumb tool={tool} />
        <Link to="/tools" className="back-link" data-testid="link-back-to-tools">
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
          <section className="workspace-main" aria-labelledby="compressor-workspace-heading">
            <div
              className={`dropzone tool-dropzone status-${status}`}
              role="button"
              tabIndex={status === 'processing' ? -1 : 0}
              aria-labelledby="compressor-workspace-heading"
              aria-describedby="compressor-help compressor-status"
              aria-disabled={status === 'processing'}
              onKeyDown={handleDropzoneKeyDown}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (status !== 'processing') acceptFile(event.dataTransfer.files[0]);
              }}
              data-testid="dropzone-image"
            >
              <div className="dropzone-content">
                <div className="drop-icon" aria-hidden="true">
                  {status === 'success' ? <Check size={25} /> : status === 'processing' ? <Sparkles size={25} /> : <FileImage size={25} />}
                </div>
                <h2 id="compressor-workspace-heading" data-testid="text-compressor-file">
                  {status === 'idle' || status === 'error' ? copy.dropAnImageHere : file?.name}
                </h2>
                <p id="compressor-help">
                  {message || (language === 'bn' ? 'অথবা আপনার ডিভাইস থেকে ছবি নির্বাচন করুন। JPG, PNG এবং WebP (সর্বোচ্চ ২০ মেগাবাইট)।' : 'Or choose a file from your device. JPG, PNG and WebP up to 20 MB.')}
                </p>
                <div id="compressor-status" className={`tool-status status-${status}`} role="status" aria-live="polite" data-testid="status-compressor">
                  {status === 'processing' && <span className="status-spinner" aria-hidden="true" />}
                  {status === 'success' && <Check size={15} aria-hidden="true" />}
                  {status === 'error' && <X size={15} aria-hidden="true" />}
                  {status === 'ready' && <Upload size={15} aria-hidden="true" />}
                  <span>
                    {status === 'idle'
                      ? (language === 'bn' ? 'কোনো ছবি নির্বাচন করা হয়নি' : 'No image selected')
                      : status === 'ready'
                        ? (language === 'bn' ? 'ছবি প্রস্তুত' : 'Image ready')
                        : status === 'processing'
                          ? (language === 'bn' ? 'লোকাল প্রসেসিং চলছে' : 'Working locally')
                          : status === 'success'
                            ? (language === 'bn' ? 'কম্প্রেশন সম্পন্ন হয়েছে' : 'Compression complete')
                            : (language === 'bn' ? 'পদক্ষেপ প্রয়োজন' : 'Action needed')}
                  </span>
                </div>

                {status === 'success' && result ? (
                  <div className="compression-result-card">
                    <div className="compression-stats-row">
                      <div className="compression-stat-item">
                        <span>{copy.originalSize}</span>
                        <strong>{formatBytes(result.stats.originalBytes)}</strong>
                      </div>
                      <div className="compression-stat-arrow">→</div>
                      <div className="compression-stat-item highlight">
                        <span>{copy.compressedSize}</span>
                        <strong>{formatBytes(result.stats.compressedBytes)}</strong>
                      </div>
                      <div className="compression-stat-badge">
                        <Zap size={13} />
                        <span>{result.stats.ratioPercent}% {copy.reductionSaved}</span>
                      </div>
                    </div>
                    <a
                      className="button button-primary"
                      href={result.url}
                      download={result.name}
                      onClick={handleDownload}
                      data-testid="download-compressed-image"
                    >
                      <Download size={16} /> {copy.downloadFile} {result.name}
                    </a>
                  </div>
                ) : (
                  <button
                    className="button button-primary"
                    type="button"
                    disabled={status === 'processing'}
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-choose-image"
                  >
                    <FileImage size={16} /> {copy.chooseImage}
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  id="image-file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(event) => {
                    acceptFile(event.target.files?.[0]);
                    event.target.value = '';
                  }}
                  data-testid="input-image-file"
                />
              </div>
            </div>

            {file && (
              <button
                className="button button-ghost reset-button"
                type="button"
                onClick={reset}
                data-testid="button-reset-image"
              >
                <RotateCcw size={15} /> {copy.resetWorkspace}
              </button>
            )}

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
            <p className="side-label">{copy.compressionProfile}</p>
            <div className="choice-list" role="radiogroup" aria-label={copy.compressionProfile}>
              {(Object.entries(compressionProfiles) as Array<[CompressionProfile, (typeof compressionProfiles)[CompressionProfile]]>).map(([value, profile]) => (
                <label className={`choice${quality === value ? ' selected' : ''}`} key={value}>
                  <span>
                    <strong>
                      {language === 'bn'
                        ? value === 'light' ? 'হাই কোয়ালিটি' : value === 'balanced' ? 'ব্যালেন্সড (প্রস্তাবিত)' : 'সর্বোচ্চ সাইজ হ্রাস'
                        : profile.label}
                    </strong>
                    <small>
                      {language === 'bn'
                        ? value === 'light' ? 'ছবির সর্বোচ্চ ডিটেইল ও শার্পনেস বজায় রাখে' : value === 'balanced' ? 'দৈনন্দিন শেয়ার ও সাধারণ ব্যবহারের জন্য' : 'ওয়েবসাইট ও চ্যাটের জন্য সবচেয়ে ছোট সাইজ'
                        : value === 'light' ? copy.profileLightDesc : value === 'balanced' ? copy.profileBalancedDesc : copy.profileSmallDesc}
                    </small>
                  </span>
                  <input
                    type="radio"
                    name="quality"
                    value={value}
                    checked={quality === value}
                    onChange={() => setQuality(value)}
                    data-testid={`radio-profile-${value}`}
                  />
                </label>
              ))}
            </div>

            {/* Optional WebP modern format toggle */}
            <div className="webp-toggle-wrap">
              <label className="webp-checkbox-label">
                <input
                  type="checkbox"
                  checked={convertToWebP}
                  onChange={(e) => setConvertToWebP(e.target.checked)}
                />
                <div>
                  <strong>{copy.convertToWebPLabel}</strong>
                  <small>{copy.convertToWebPDesc}</small>
                </div>
              </label>
            </div>

            <p className="side-note">
              <ShieldCheck size={14} aria-hidden="true" /> {copy.imageStaysLocal}
            </p>
            <button
              className="button button-primary process-button"
              type="button"
              disabled={!file || status === 'processing'}
              onClick={processFile}
              data-testid="button-compress-image"
            >
              <Sparkles size={15} /> {status === 'processing' ? (language === 'bn' ? 'প্রসেসিং হচ্ছে…' : 'Processing…') : copy.compressImageButton}
            </button>
          </aside>
        </div>
        <RelatedTools tool={tool} />
      </div>
    </main>
  );
}
