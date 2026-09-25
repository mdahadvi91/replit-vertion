import { lazy, Suspense, type ComponentType } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getToolBySlug, getLocalizedTool, type ToolDefinition } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import NotFoundPage from '@/pages/NotFoundPage';

// Lazy loader registry for all current tools
// Heavy dependencies (pdfjs-dist, pdf-lib, tesseract.js) are only loaded when opening their specific tool
const toolLoaders: Record<string, () => Promise<{ default: ComponentType<{ tool: ToolDefinition }> }>> = {
  'image-compressor': () => import('@/tools/image-compressor').then((m) => ({ default: m.ImageCompressor })),
  'word-counter': () => import('@/tools/word-counter').then((m) => ({ default: m.WordCounter })),
  'json-formatter': () => import('@/tools/json-formatter').then((m) => ({ default: m.JsonFormatter })),
  'color-picker': () => import('@/tools/color-picker').then((m) => ({ default: m.ColorPickerTool })),
  'jpg-to-png': () => import('@/tools/jpg-to-png').then((m) => ({ default: m.JpgToPngConverter })),
  'image-resizer': () => import('@/tools/image-resizer').then((m) => ({ default: m.ImageResizer })),
  'pdf-to-text': () => import('@/tools/pdf-to-text').then((m) => ({ default: m.PdfToTextTool })),
  'merge-pdf': () => import('@/tools/merge-pdf').then((m) => ({ default: m.MergePdfTool })),
  'photo-qr-code': () => import('@/tools/photo-qr-code').then((m) => ({ default: m.PhotoQrCodeTool })),
  'pdf-to-word': () => import('@/tools/pdf-to-word').then((m) => ({ default: m.PdfToWordTool })),
  'jpg-to-pdf': () => import('@/tools/jpg-to-pdf').then((m) => ({ default: m.JpgToPdfTool })),
  'split-pdf': () => import('@/tools/split-pdf').then((m) => ({ default: m.SplitPdfTool })),
  'compress-pdf': () => import('@/tools/compress-pdf').then((m) => ({ default: m.CompressPdfTool })),
  'pdf-to-jpg': () => import('@/tools/pdf-to-jpg').then((m) => ({ default: m.PdfToJpgTool })),
  'heic-to-jpg': () => import('@/tools/heic-to-jpg').then((m) => ({ default: m.HeicToJpgTool })),
  'png-to-jpg': () => import('@/tools/png-to-jpg').then((m) => ({ default: m.PngToJpgTool })),
  'webp-to-jpg': () => import('@/tools/webp-to-jpg').then((m) => ({ default: m.WebpToJpgTool })),
  'image-to-pdf': () => import('@/tools/image-to-pdf').then((m) => ({ default: m.ImageToPdfTool })),
  'background-remover': () => import('@/tools/background-remover').then((m) => ({ default: m.BackgroundRemoverTool })),
  'image-to-text': () => import('@/tools/image-to-text').then((m) => ({ default: m.ImageToTextTool })),
  'pdf-page-extractor': () => import('@/tools/pdf-page-extractor').then((m) => ({ default: m.PdfPageExtractorTool })),
  'pdf-rotate': () => import('@/tools/pdf-rotate').then((m) => ({ default: m.PdfRotateTool })),
  'pdf-to-png': () => import('@/tools/pdf-to-png').then((m) => ({ default: m.PdfToPngTool })),
  'password-generator': () => import('@/tools/password-generator').then((m) => ({ default: m.PasswordGeneratorTool })),
};

const lazyCache = new Map<string, React.LazyExoticComponent<ComponentType<{ tool: ToolDefinition }>>>();

function getToolComponent(slug: string) {
  if (!lazyCache.has(slug)) {
    const loader = toolLoaders[slug];
    if (loader) {
      lazyCache.set(slug, lazy(loader));
    }
  }
  return lazyCache.get(slug);
}

function PlannedTool({ tool }: { tool: ToolDefinition }) {
  const { copy, getLocalizedPath } = useI18n();
  return (
    <main className="prose-page">
      <span className="eyebrow">{tool.category} / {copy.plannedBadge}</span>
      <h1>{tool.seo.h1}</h1>
      <p style={{ fontSize: 18 }}>{tool.description}</p>
      <p>{copy.plannedIntro}</p>
      <Link to={getLocalizedPath('/tools')} className="button button-primary">
        <ArrowLeft size={16} /> {copy.backToTools}
      </Link>
    </main>
  );
}

function ToolLoadingFallback({ tool }: { tool: ToolDefinition }) {
  const { language } = useI18n();
  const isBn = language === 'bn';

  return (
    <main className="prose-page" style={{ textAlign: 'center', padding: '120px 20px' }}>
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Loader2 size={36} className="animate-spin text-primary" style={{ color: 'hsl(var(--primary))' }} />
        <h2 style={{ margin: 0, fontSize: 20 }}>
          {isBn ? `${tool.name} লোড হচ্ছে...` : `Loading ${tool.name}...`}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
          {isBn ? 'টুলটি চালু হচ্ছে' : 'Initializing tool workspace'}
        </p>
      </div>
    </main>
  );
}

export default function ToolPage() {
  const { toolSlug } = useParams();
  const { language } = useI18n();

  const rawTool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  if (!rawTool) {
    return <NotFoundPage />;
  }

  const tool = getLocalizedTool(rawTool, language);

  if (tool.status !== 'live') {
    return <PlannedTool tool={tool} />;
  }

  const Component = getToolComponent(tool.slug);
  if (!Component) {
    return <PlannedTool tool={tool} />;
  }

  return (
    <Suspense fallback={<ToolLoadingFallback tool={tool} />}>
      <Component tool={tool} />
    </Suspense>
  );
}
