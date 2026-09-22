import {
  Braces,
  FileArchive,
  FileText,
  Image,
  Palette,
  type LucideIcon,
} from 'lucide-react';

export type ToolCategory = 'Images' | 'Documents' | 'Text' | 'Developer';
export type ToolStatus = 'live' | 'planned';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  color: string;
  icon: LucideIcon;
  route: string;
  browserProcessing: boolean;
  keywords: string[];
  seo: {
    title: string;
    description: string;
    h1: string;
    canonical: string;
  };
  content: {
    intro: string;
    howToUse: string[];
    privacy?: string;
    limitations?: string;
    faq: Array<{ question: string; answer: string }>;
  };
  relatedToolIds: string[];
}

export const categoryList: Array<'All' | ToolCategory> = [
  'All',
  'Images',
  'Documents',
  'Text',
  'Developer',
];

export const tools: ToolDefinition[] = [
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Shrink image files without turning crisp details into mush.',
    category: 'Images',
    status: 'live',
    color: '171 68% 34%',
    icon: Image,
    route: '/tool/image-compressor',
    browserProcessing: true,
    keywords: ['compress image', 'reduce image size', 'jpg compressor', 'png compressor'],
    seo: {
      title: 'Image Compressor — Ahadex Tools',
      description:
        'Compress JPG, PNG and WebP images in your browser with clear settings, honest limits and a real downloadable result.',
      h1: 'Image Compressor',
      canonical: '/tool/image-compressor',
    },
    content: {
      intro:
        'Make an image smaller for a website, message or upload without sending it to an unknown queue.',
      howToUse: [
        'Choose a JPG, PNG or WebP image up to 20 MB.',
        'Pick a compression profile that matches the quality you need.',
        'Process the image and download the finished file.',
      ],
      privacy:
        'Your image is processed locally with browser APIs. It is not uploaded to an Ahadex server, and the temporary download URL is released when you reset the workspace or leave the page.',
      limitations:
        'The tool preserves the source format. PNG files may not get smaller when their pixels are already highly optimized, and important images should still be checked after compression.',
      faq: [
        {
          question: 'Are my images uploaded?',
          answer:
            'No. This tool processes the image in your browser. The current implementation does not send the file to an Ahadex server.',
        },
        {
          question: 'Which formats are supported?',
          answer: 'JPG, PNG and WebP files up to 20 MB are supported.',
        },
      ],
    },
    relatedToolIds: ['jpg-to-png', 'image-resizer'],
  },
  {
    id: 'pdf-to-text',
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Pull clean, copyable text from a PDF in a few quiet seconds.',
    category: 'Documents',
    status: 'planned',
    color: '29 91% 50%',
    icon: FileText,
    route: '/tool/pdf-to-text',
    browserProcessing: true,
    keywords: ['extract pdf text', 'pdf converter', 'copy pdf'],
    seo: {
      title: 'PDF to Text — Ahadex Tools',
      description: 'Extract readable text from PDF documents with Ahadex Tools.',
      h1: 'PDF to Text',
      canonical: '/tool/pdf-to-text',
    },
    content: {
      intro: 'A focused PDF text extraction tool is planned for a future release.',
      howToUse: [],
      faq: [],
    },
    relatedToolIds: ['merge-pdf'],
  },
  {
    id: 'format-json',
    slug: 'format-json',
    name: 'JSON Formatter',
    description: 'Turn tangled JSON into something a human can actually read.',
    category: 'Developer',
    status: 'planned',
    color: '214 65% 48%',
    icon: Braces,
    route: '/tool/json-formatter',
    browserProcessing: true,
    keywords: ['json formatter', 'json validator', 'pretty print json'],
    seo: {
      title: 'JSON Formatter & Validator — Ahadex Tools',
      description: 'Format and validate JSON in a fast browser-based workspace.',
      h1: 'JSON Formatter & Validator',
      canonical: '/tool/json-formatter',
    },
    content: {
      intro: 'A private browser-based JSON formatter is planned for a future release.',
      howToUse: [],
      faq: [],
    },
    relatedToolIds: ['word-counter'],
  },
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Bring scattered pages together into one tidy document.',
    category: 'Documents',
    status: 'planned',
    color: '4 70% 52%',
    icon: FileArchive,
    route: '/tool/merge-pdf',
    browserProcessing: true,
    keywords: ['merge pdf', 'combine pdf files', 'join pdf'],
    seo: {
      title: 'Merge PDF — Ahadex Tools',
      description: 'Combine PDF files into one document with Ahadex Tools.',
      h1: 'Merge PDF',
      canonical: '/tool/merge-pdf',
    },
    content: {
      intro: 'A local PDF merge workflow is planned for a future release.',
      howToUse: [],
      faq: [],
    },
    relatedToolIds: ['pdf-to-text'],
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters and reading time as you write.',
    category: 'Text',
    status: 'planned',
    color: '269 54% 49%',
    icon: FileText,
    route: '/tool/word-counter',
    browserProcessing: true,
    keywords: ['word count', 'character count', 'reading time'],
    seo: {
      title: 'Word Counter — Ahadex Tools',
      description: 'Count words, characters and estimated reading time in your browser.',
      h1: 'Word Counter',
      canonical: '/tool/word-counter',
    },
    content: {
      intro: 'A lightweight writing counter is planned for a future release.',
      howToUse: [],
      faq: [],
    },
    relatedToolIds: ['format-json'],
  },
  {
    id: 'color-picker',
    slug: 'color-picker',
    name: 'Color Picker',
    description: 'Name a color, save its value and build a calmer palette.',
    category: 'Developer',
    status: 'planned',
    color: '337 63% 51%',
    icon: Palette,
    route: '/tool/color-picker',
    browserProcessing: true,
    keywords: ['color picker', 'hex color', 'rgb color'],
    seo: {
      title: 'Color Picker — Ahadex Tools',
      description: 'Pick and copy useful color values with Ahadex Tools.',
      h1: 'Color Picker',
      canonical: '/tool/color-picker',
    },
    content: {
      intro: 'A focused color utility is planned for a future release.',
      howToUse: [],
      faq: [],
    },
    relatedToolIds: ['format-json'],
  },
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    description: 'Convert a JPG into a shareable PNG when transparency or lossless output matters.',
    category: 'Images',
    status: 'planned',
    color: '171 68% 34%',
    icon: Image,
    route: '/tool/jpg-to-png',
    browserProcessing: true,
    keywords: ['jpg converter', 'convert jpg to png', 'image converter'],
    seo: {
      title: 'JPG to PNG Converter — Ahadex Tools',
      description: 'Convert JPG images to PNG files in your browser.',
      h1: 'JPG to PNG Converter',
      canonical: '/tool/jpg-to-png',
    },
    content: {
      intro: 'A browser-local JPG to PNG converter is planned for a future release.',
      howToUse: [],
      faq: [],
    },
    relatedToolIds: ['image-compressor'],
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize an image to a precise width and height for the job ahead.',
    category: 'Images',
    status: 'planned',
    color: '171 68% 34%',
    icon: Image,
    route: '/tool/image-resizer',
    browserProcessing: true,
    keywords: ['resize image', 'image dimensions', 'change image size'],
    seo: {
      title: 'Image Resizer — Ahadex Tools',
      description: 'Resize images to useful dimensions in your browser.',
      h1: 'Image Resizer',
      canonical: '/tool/image-resizer',
    },
    content: {
      intro: 'A browser-local image resizing tool is planned for a future release.',
      howToUse: [],
      faq: [],
    },
    relatedToolIds: ['image-compressor', 'jpg-to-png'],
  },
];

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(tool: ToolDefinition) {
  return tool.relatedToolIds
    .map((id) => tools.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is ToolDefinition => Boolean(candidate));
}