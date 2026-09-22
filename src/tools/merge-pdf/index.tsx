import { useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  FileArchive,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import {
  getDocument,
  GlobalWorkerOptions,
} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import {
  type ToolDefinition,
  getRelatedTools,
} from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';

GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfFileItem {
  id: string;
  file: File;
  previewUrl: string | null;
  pageCount: number | null;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function createPdfPreview(
  file: File,
): Promise<{
  previewUrl: string | null;
  pageCount: number | null;
}> {
  try {
    const sourceBytes = new Uint8Array(
      await file.arrayBuffer(),
    );

    const loadingTask = getDocument({
      data: sourceBytes,
      verbosity: 0,
    });

    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    if (pageCount < 1) {
      return {
        previewUrl: null,
        pageCount: 0,
      };
    }

    const page = await pdf.getPage(1);

    const baseViewport = page.getViewport({
      scale: 1,
    });

    const targetWidth = 150;

    const scale = Math.min(
      targetWidth / baseViewport.width,
      0.32,
    );

    const viewport = page.getViewport({
      scale,
    });

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d', {
      alpha: false,
    });

    if (!context) {
      return {
        previewUrl: null,
        pageCount,
      };
    }

    canvas.width = Math.max(
      1,
      Math.ceil(viewport.width),
    );

    canvas.height = Math.max(
      1,
      Math.ceil(viewport.height),
    );

    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const previewUrl = canvas.toDataURL(
      'image/jpeg',
      0.78,
    );

    canvas.width = 1;
    canvas.height = 1;

    return {
      previewUrl,
      pageCount,
    };
  } catch (error) {
    console.error(
      'Failed to generate PDF preview:',
      error,
    );

    return {
      previewUrl: null,
      pageCount: null,
    };
  }
}

export function MergePdfTool({
  tool,
}: {
  tool: ToolDefinition;
}) {
  const { copy, language } = useI18n();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<PdfFileItem[]>(
    [],
  );

  const [mergedUrl, setMergedUrl] =
    useState<string | null>(null);

  const [mergedSize, setMergedSize] =
    useState<number>(0);

  const [status, setStatus] = useState<
    'idle' | 'ready' | 'processing' | 'success' | 'error'
  >('idle');

  const [message, setMessage] =
    useState('');

  const [previewing, setPreviewing] =
    useState(false);

  const files = items.map(
    (item) => item.file,
  );

  const clearMergedOutput = () => {
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
    }

    setMergedUrl(null);
    setMergedSize(0);
  };

  const reset = () => {
    clearMergedOutput();

    setItems([]);
    setStatus('idle');
    setMessage('');
    setPreviewing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = async (
    newFiles?: FileList | File[],
  ) => {
    if (!newFiles || !newFiles.length) {
      return;
    }

    const added = Array.from(newFiles).filter(
      (file) =>
        file.name
          .toLowerCase()
          .endsWith('.pdf') ||
        file.type === 'application/pdf',
    );

    if (!added.length) {
      setStatus('error');

      setMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে শুধুমাত্র PDF ফাইল নির্বাচন করুন।'
          : 'Please select valid PDF documents.',
      );

      return;
    }

    clearMergedOutput();

    setStatus('ready');
    setMessage('');
    setPreviewing(true);

    trackEvent('file_upload', {
      tool_id: tool.id,
      count: added.length,
    });

    const newItems: PdfFileItem[] = [];

    for (const file of added) {
      const result =
        await createPdfPreview(file);

      newItems.push({
        id: [
          file.name,
          file.size,
          file.lastModified,
          Math.random(),
        ].join('-'),

        file,

        previewUrl: result.previewUrl,

        pageCount: result.pageCount,
      });
    }

    setItems((current) => [
      ...current,
      ...newItems,
    ]);

    setPreviewing(false);

    const totalCount =
      items.length + newItems.length;

    setStatus('ready');

    setMessage(
      language === 'bn'
        ? `${totalCount} টি PDF ফাইল প্রস্তুত। মার্জ করতে বাটনে ক্লিক করুন।`
        : `${totalCount} PDF files staged. Click Merge to assemble.`,
    );
  };

  const removeFile = (id: string) => {
    setItems((current) =>
      current.filter(
        (item) => item.id !== id,
      ),
    );

    clearMergedOutput();

    setStatus('ready');

    setMessage('');
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setStatus('error');

      setMessage(
        language === 'bn'
          ? 'মার্জ করার জন্য কমপক্ষে ২টি PDF ফাইল প্রয়োজন।'
          : 'At least 2 PDF documents are needed to perform a merge.',
      );

      return;
    }

    setStatus('processing');

    setMessage(
      language === 'bn'
        ? 'ব্রাউজারে সরাসরি PDF একত্রিত করা হচ্ছে…'
        : 'Merging PDF documents locally…',
    );

    trackEvent('tool_start', {
      tool_id: tool.id,
      file_count: files.length,
    });

    try {
      const mergedPdf =
        await PDFDocument.create();

      for (const file of files) {
        const sourceBytes =
          await file.arrayBuffer();

        const sourcePdf =
          await PDFDocument.load(
            sourceBytes,
            {
              ignoreEncryption: false,
            },
          );

        const copiedPages =
          await mergedPdf.copyPages(
            sourcePdf,
            sourcePdf.getPageIndices(),
          );

        for (const page of copiedPages) {
          mergedPdf.addPage(page);
        }
      }

      const pageCount =
        mergedPdf.getPageCount();

      const mergedBytes =
        await mergedPdf.save({
          useObjectStreams: true,
        });

      const mergedArrayBuffer =
        mergedBytes.buffer.slice(
          mergedBytes.byteOffset,
          mergedBytes.byteOffset +
            mergedBytes.byteLength,
        ) as ArrayBuffer;

      const mergedBlob = new Blob(
        [mergedArrayBuffer],
        {
          type: 'application/pdf',
        },
      );

      clearMergedOutput();

      const url =
        URL.createObjectURL(
          mergedBlob,
        );

      setMergedUrl(url);
      setMergedSize(mergedBlob.size);
      setStatus('success');

      setMessage(
        language === 'bn'
          ? `${pageCount}টি পৃষ্ঠা সফলভাবে একত্র করা হয়েছে।`
          : `${pageCount} pages successfully merged.`,
      );

      trackEvent('tool_success', {
        tool_id: tool.id,
        file_count: files.length,
        page_count: pageCount,
        output_size: mergedBlob.size,
      });
    } catch (error: unknown) {
      console.error(
        'Merge PDF failed:',
        error,
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : '';

      setStatus('error');

      setMessage(
        language === 'bn'
          ? 'PDF মার্জ করা যায়নি। PDF ফাইলগুলো সঠিক এবং password-protected নয় কিনা পরীক্ষা করুন।'
          : errorMessage ||
            'Failed to merge the PDF documents. Please make sure the files are valid and not password-protected.',
      );

      trackEvent('tool_error', {
        tool_id: tool.id,
        error: errorMessage,
      });
    }
  };

  return (
    <main className="workspace">
      <div className="container">
        <nav
          className="breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link to="/tools">
            {copy.tools}
          </Link>

          <span>/</span>

          <span>{tool.category}</span>

          <span>/</span>

          <strong>{tool.name}</strong>
        </nav>

        <Link
          to="/tools"
          className="back-link"
        >
          <ArrowLeft size={15} />
          {copy.backToTools}
        </Link>

        <div className="workspace-head">
          <div>
            <span className="eyebrow">
              {tool.category} / {copy.liveNow}
            </span>

            <h1>{tool.seo.h1}</h1>

            <p className="muted workspace-intro">
              {tool.content.intro}
            </p>
          </div>

          <span className="mono muted workspace-badge">
            {copy.workspaceBadge}
          </span>
        </div>

        <div className="workspace-grid">
          <section
            className="workspace-main"
            aria-label="Merge PDF workspace"
          >
            <div
              className={`dropzone${
                items.length
                  ? ' has-file'
                  : ''
              }`}
              onClick={() =>
                fileInputRef.current?.click()
              }
              onDragOver={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();

                if (
                  event.dataTransfer.files
                    .length
                ) {
                  void handleFiles(
                    event.dataTransfer.files,
                  );
                }
              }}
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: '36px 20px',
                borderRadius: 16,
                border:
                  '2px dashed hsl(var(--border))',
                background:
                  'hsl(var(--card))',
              }}
            >
              {items.length > 0 ? (
                <div>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      background:
                        'hsl(4 70% 52% / .15)',
                      color:
                        'hsl(4 70% 52%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'center',
                      margin:
                        '0 auto 12px',
                    }}
                  >
                    <FileArchive
                      size={24}
                    />
                  </div>

                  <strong>
                    {items.length}{' '}
                    {language === 'bn'
                      ? 'টি PDF নির্বাচিত'
                      : 'PDF files queued'}
                  </strong>

                  <small
                    style={{
                      color:
                        'hsl(var(--muted-foreground))',
                      display: 'block',
                      marginTop: 8,
                    }}
                  >
                    {previewing
                      ? language === 'bn'
                        ? 'PDF preview তৈরি হচ্ছে…'
                        : 'Generating PDF previews…'
                      : language === 'bn'
                        ? 'প্রয়োজনে নিচের Trash button দিয়ে PDF সরাতে পারবেন'
                        : 'Use the trash button below to remove a PDF'}
                  </small>

                  <small
                    style={{
                      color:
                        'hsl(var(--primary))',
                      display: 'block',
                      marginTop: 10,
                    }}
                  >
                    {language === 'bn'
                      ? '+ আরও PDF যুক্ত করতে ক্লিক করুন'
                      : '+ Click to add more PDFs'}
                  </small>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      background:
                        'hsl(var(--primary) / .1)',
                      color:
                        'hsl(var(--primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'center',
                      margin:
                        '0 auto 12px',
                    }}
                  >
                    <Upload size={22} />
                  </div>

                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 4,
                    }}
                  >
                    {language === 'bn'
                      ? 'PDF ফাইলগুলো এখানে টেনে আনুন বা ক্লিক করুন'
                      : 'Drag and drop your PDF files here, or click to browse'}
                  </p>

                  <small
                    style={{
                      color:
                        'hsl(var(--muted-foreground))',
                    }}
                  >
                    {language === 'bn'
                      ? 'একাধিক PDF একসাথে নির্বাচন করতে পারবেন'
                      : 'Select multiple PDF documents to merge into one file'}
                  </small>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                hidden
                onChange={(event) => {
                  if (event.target.files) {
                    void handleFiles(
                      event.target.files,
                    );
                  }

                  event.target.value = '';
                }}
              />
            </div>

            {items.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {items.map(
                  (item, index) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems:
                          'center',
                        gap: 12,
                        padding: 10,
                        border:
                          '1px solid hsl(var(--border))',
                        borderRadius: 14,
                        background:
                          'hsl(var(--card))',
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 76,
                          height: 92,
                          flexShrink: 0,
                          overflow: 'hidden',
                          borderRadius: 8,
                          background:
                            'hsl(var(--secondary))',
                          border:
                            '1px solid hsl(var(--border))',
                          display: 'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                        }}
                      >
                        {item.previewUrl ? (
                          <img
                            src={
                              item.previewUrl
                            }
                            alt={`${item.file.name} first page preview`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit:
                                'cover',
                              display:
                                'block',
                            }}
                          />
                        ) : (
                          <FileArchive
                            size={28}
                            style={{
                              opacity: 0.65,
                            }}
                          />
                        )}
                      </div>

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          textAlign:
                            'left',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily:
                              'var(--font-mono)',
                            color:
                              'hsl(var(--primary))',
                            marginBottom: 3,
                          }}
                        >
                          #{index + 1}
                        </div>

                        <strong
                          title={
                            item.file.name
                          }
                          style={{
                            display:
                              'block',
                            overflow:
                              'hidden',
                            textOverflow:
                              'ellipsis',
                            whiteSpace:
                              'nowrap',
                            fontSize: 14,
                          }}
                        >
                          {item.file.name}
                        </strong>

                        <span
                          style={{
                            display:
                              'block',
                            marginTop: 4,
                            fontSize: 12,
                            color:
                              'hsl(var(--muted-foreground))',
                          }}
                        >
                          {formatBytes(
                            item.file.size,
                          )}

                          {item.pageCount !==
                            null &&
                            ` · ${
                              item.pageCount
                            } ${
                              language ===
                              'bn'
                                ? 'পৃষ্ঠা'
                                : 'pages'
                            }`}
                        </span>
                      </div>

                      <button
                        type="button"
                        aria-label={
                          language === 'bn'
                            ? 'PDF সরান'
                            : 'Remove PDF'
                        }
                        title={
                          language === 'bn'
                            ? 'PDF সরান'
                            : 'Remove PDF'
                        }
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();
                          removeFile(
                            item.id,
                          );
                        }}
                        style={{
                          width: 38,
                          height: 38,
                          flexShrink: 0,
                          border: 0,
                          borderRadius: 10,
                          display: 'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                          cursor: 'pointer',
                          background:
                            'hsl(0 75% 50% / .10)',
                          color:
                            'hsl(0 70% 48%)',
                        }}
                      >
                        <Trash2
                          size={18}
                        />
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}

            {message && (
              <div
                style={{
                  marginTop: 14,
                  padding: '10px 16px',
                  borderRadius: 10,
                  background:
                    status === 'error'
                      ? 'hsl(0 80% 50% / .1)'
                      : 'hsl(var(--secondary) / .6)',
                  color:
                    status === 'error'
                      ? 'hsl(0 75% 45%)'
                      : 'hsl(var(--foreground))',
                  fontSize: 13,
                }}
              >
                {message}
              </div>
            )}

            {mergedUrl && (
              <div
                style={{
                  marginTop: 20,
                  padding: 18,
                  borderRadius: 14,
                  background:
                    'hsl(var(--primary) / .08)',
                  border:
                    '1px solid hsl(var(--primary) / .2)',
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'space-between',
                  flexWrap: 'wrap',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background:
                        'hsl(var(--primary))',
                      color: '#fff',
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                    }}
                  >
                    <Check size={20} />
                  </div>

                  <div>
                    <strong
                      style={{
                        display:
                          'block',
                        fontSize: 15,
                      }}
                    >
                      merged-document.pdf
                    </strong>

                    <span
                      style={{
                        fontSize: 12,
                        color:
                          'hsl(var(--muted-foreground))',
                      }}
                    >
                      {files.length}{' '}
                      {language === 'bn'
                        ? 'টি ডকুমেন্ট সংযুক্ত'
                        : 'Documents Combined'}{' '}
                      ·{' '}
                      {formatBytes(
                        mergedSize,
                      )}
                    </span>
                  </div>
                </div>

                <a
                  href={mergedUrl}
                  download="merged-ahadex.pdf"
                  className="button button-primary"
                  onClick={() =>
                    trackEvent(
                      'tool_download',
                      {
                        tool_id: tool.id,
                        output_size:
                          mergedSize,
                      },
                    )
                  }
                >
                  <Download size={15} />
                  {language === 'bn'
                    ? 'মার্জ PDF ডাউনলোড করুন'
                    : 'Download Merged PDF'}
                </a>
              </div>
            )}

            <div
              className="tool-content"
            >
              <h2>
                {copy.howToUse}
              </h2>

              <ol>
                {tool.content.howToUse.map(
                  (step) => (
                    <li key={step}>
                      {step}
                    </li>
                  ),
                )}
              </ol>

              <h2>
                {copy.privacyAndLimitations}
              </h2>

              <p>
                {tool.content.privacy}
              </p>

              <p>
                {tool.content.limitations}
              </p>

              <h2>
                {copy.faqTitle}
              </h2>

              <div className="faq-list">
                {tool.content.faq.map(
                  ({
                    question,
                    answer,
                  }) => (
                    <details
                      key={question}
                      className="tool-faq"
                    >
                      <summary>
                        {question}
                      </summary>

                      <p>
                        {answer}
                      </p>
                    </details>
                  ),
                )}
              </div>
            </div>

            <AdSlot
              enabled={true}
              slot={adConfig.toolSlot}
              label="Sponsored Ad"
            />
          </section>

          <aside className="workspace-side">
            <p className="side-label">
              {language === 'bn'
                ? 'মার্জ অ্যাকশন'
                : 'Merge Actions'}
            </p>

            <button
              type="button"
              className="button button-primary"
              style={{
                width: '100%',
                marginBottom: 12,
              }}
              disabled={
                files.length < 2 ||
                status === 'processing' ||
                previewing
              }
              onClick={() => {
                void mergePdfs();
              }}
            >
              <Sparkles size={15} />

              {status === 'processing'
                ? language === 'bn'
                  ? 'মার্জ হচ্ছে…'
                  : 'Merging…'
                : language === 'bn'
                  ? 'PDF মার্জ করুন'
                  : 'Merge PDFs'}
            </button>

            {files.length > 0 && (
              <button
                type="button"
                className="button button-ghost"
                style={{
                  width: '100%',
                }}
                onClick={reset}
              >
                <RotateCcw size={14} />

                {language === 'bn'
                  ? 'তালিকা রিসেট'
                  : 'Clear All Files'}
              </button>
            )}

            <div
              style={{
                marginTop: 24,
                padding: 14,
                background:
                  'hsl(var(--card))',
                borderRadius: 12,
                border:
                  '1px solid hsl(var(--border))',
              }}
            >
              <strong
                style={{
                  fontSize: 13,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                {language === 'bn'
                  ? 'গোপনীয়তা নিশ্চিত'
                  : 'Private Processing'}
              </strong>

              <small
                style={{
                  color:
                    'hsl(var(--muted-foreground))',
                  fontSize: 11,
                  lineHeight: 1.5,
                  display: 'block',
                }}
              >
                {language === 'bn'
                  ? 'আপনার PDF ফাইল কোনো বাইরের সার্ভারে আপলোড না করে আপনার ব্রাউজারেই প্রক্রিয়াজাত করা হয়।'
                  : 'Files are merged locally in your browser without uploading the PDF bytes to our server.'}
              </small>
            </div>
          </aside>
        </div>

        <div
          style={{
            marginTop: 40,
          }}
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {copy.exploreHeader}
              </span>

              <h2>
                {copy.relatedToolsTitle}
              </h2>
            </div>
          </div>

          <div className="tool-grid">
            {getRelatedTools(tool).map(
              (candidate) => {
                const Icon =
                  candidate.icon;

                return (
                  <Link
                    key={candidate.id}
                    to={candidate.route}
                    className="tool-card"
                    style={
                      {
                        '--tool-color':
                          candidate.color,
                      } as React.CSSProperties
                    }
                  >
                    <div>
                      <span className="tool-icon">
                        <Icon size={21} />
                      </span>

                      <h3>
                        {candidate.name}
                      </h3>

                      <p>
                        {candidate.description}
                      </p>
                    </div>

                    <div className="tool-card-foot">
                      <span>
                        {candidate.status ===
                        'live'
                          ? copy.liveNow
                          : copy.planned}
                      </span>
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MergePdfTool;
