import {
  Braces,
  FileArchive,
  FileText,
  Image,
  Palette,
  QrCode,
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
    status: 'live',
    color: '29 91% 50%',
    icon: FileText,
    route: '/tool/pdf-to-text',
    browserProcessing: true,
    keywords: ['extract pdf text', 'pdf converter', 'copy pdf', 'pdf to txt'],
    seo: {
      title: 'PDF to Text Converter — Ahadex Tools',
      description: 'Extract readable text and paragraphs from PDF documents in your browser. Fast, private, and 100% free.',
      h1: 'PDF to Text Converter',
      canonical: '/tool/pdf-to-text',
    },
    content: {
      intro: 'Extract clean, copyable text from PDF files directly in your browser without uploading your documents to remote servers.',
      howToUse: [
        'Select or drag and drop your PDF document into the workspace.',
        'Click the Extract Text button to parse textual content locally.',
        'Copy the extracted text to your clipboard or download it as a .txt file.',
      ],
      privacy: 'Your document is analyzed locally inside your browser memory using Web APIs. No document bytes are transmitted to any remote server.',
      limitations: 'Text extraction relies on readable vector text streams. Scanned image-only PDFs without an OCR layer may produce limited results.',
      faq: [
        {
          question: 'Are my private PDF documents uploaded to your servers?',
          answer: 'No. All processing happens entirely within your web browser. Neither your document content nor its metadata leaves your device.',
        },
        {
          question: 'Can I export the text after extraction?',
          answer: 'Yes, you can copy the plain text with a single click or save it as a clean .txt file on your machine.',
        },
        {
          question: 'Is there a limit on PDF file size?',
          answer: 'We recommend files up to 25 MB for the smoothest browser performance.',
        },
      ],
    },
    relatedToolIds: ['merge-pdf', 'word-counter'],
  },
  {
    id: 'format-json',
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Turn tangled JSON into something a human can actually read.',
    category: 'Developer',
    status: 'live',
    color: '214 65% 48%',
    icon: Braces,
    route: '/tool/json-formatter',
    browserProcessing: true,
    keywords: ['json formatter', 'json validator', 'pretty print json', 'minify json'],
    seo: {
      title: 'JSON Formatter & Validator — Ahadex Tools',
      description: 'Format, validate, prettify, and minify JSON data online with instant error detection and customizable indentations.',
      h1: 'JSON Formatter & Validator',
      canonical: '/tool/json-formatter',
    },
    content: {
      intro: 'Validate, prettify, and minify JSON objects in real time with line-by-line syntax checking and customizable spacing.',
      howToUse: [
        'Paste your raw, messy, or minified JSON into the editor input.',
        'Select your preferred indentation (2 spaces, 4 spaces, or Tab).',
        'Click Format JSON to beautify or Minify to compact into a single line.',
      ],
      privacy: 'Everything executes via client-side JavaScript. Your confidential API configurations, tokens, and payloads are never transmitted across the network.',
      limitations: 'Input must strictly adhere to the standard JSON RFC 8259 syntax specifications.',
      faq: [
        {
          question: 'Will my API keys or sensitive JSON data stay private?',
          answer: 'Yes! Formatting occurs entirely in your browser window with zero server calls. Your sensitive data stays strictly on your computer.',
        },
        {
          question: 'How does it detect syntax errors?',
          answer: 'It leverages the browser native JSON parsing engine and highlights exact parsing issues with clear diagnostic messages.',
        },
      ],
    },
    relatedToolIds: ['word-counter', 'color-picker'],
  },
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Bring scattered pages together into one tidy document.',
    category: 'Documents',
    status: 'live',
    color: '4 70% 52%',
    icon: FileArchive,
    route: '/tool/merge-pdf',
    browserProcessing: true,
    keywords: ['merge pdf', 'combine pdf files', 'join pdf', 'pdf merger'],
    seo: {
      title: 'Merge PDF Online Free — Ahadex Tools',
      description: 'Combine multiple PDF documents into a single consolidated file in your browser. Fast, secure, and zero installation.',
      h1: 'Merge PDF Documents',
      canonical: '/tool/merge-pdf',
    },
    content: {
      intro: 'Join multiple separate PDF files into a single continuous file smoothly without installing bulky software.',
      howToUse: [
        'Select 2 or more PDF documents from your device.',
        'Verify your queued documents in the list.',
        'Click Merge PDFs to generate and download your unified document.',
      ],
      privacy: 'PDF streams are combined directly in client memory without external network uploads.',
      limitations: 'Merging very large batches of high-resolution PDFs may depend on your device available RAM.',
      faq: [
        {
          question: 'Is there a cost to merge PDFs?',
          answer: 'No, Ahadex PDF Merger is completely free with no watermark or page restrictions.',
        },
        {
          question: 'Can I combine PDFs on mobile devices?',
          answer: 'Yes! The tool is fully responsive and functions smoothly on mobile smartphones, tablets, and desktop browsers.',
        },
      ],
    },
    relatedToolIds: ['pdf-to-text', 'image-compressor'],
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters and reading time as you write.',
    category: 'Text',
    status: 'live',
    color: '269 54% 49%',
    icon: FileText,
    route: '/tool/word-counter',
    browserProcessing: true,
    keywords: ['word count', 'character count', 'reading time', 'text statistics'],
    seo: {
      title: 'Online Word Counter & Character Counter — Ahadex Tools',
      description: 'Calculate real-time word counts, characters, spaces, sentences, paragraphs, and reading time for articles and essays.',
      h1: 'Online Word & Character Counter',
      canonical: '/tool/word-counter',
    },
    content: {
      intro: 'Accurate, real-time writing statistics for writers, students, bloggers, and SEO professionals.',
      howToUse: [
        'Type or paste your text into the workspace editor.',
        'View live metrics for words, characters, sentences, and estimated reading time.',
        'Use quick action buttons to format case or strip extraneous whitespace.',
      ],
      privacy: 'Your text remains entirely on your screen. No word counts or paragraphs are sent to external analytics or database systems.',
      limitations: 'Calculations adapt dynamically to standard Latin and Unicode Bengali writing scripts.',
      faq: [
        {
          question: 'Does the counter support Bengali (বাংলা) and English text?',
          answer: 'Yes! The word counter is built with full UTF-8 Unicode support for Bengali, English, and multilingual texts.',
        },
        {
          question: 'How is reading time calculated?',
          answer: 'Based on an industry-standard average reading speed of 200 words per minute for comprehensive comprehension.',
        },
      ],
    },
    relatedToolIds: ['format-json', 'pdf-to-text'],
  },
  {
    id: 'color-picker',
    slug: 'color-picker',
    name: 'Color Picker',
    description: 'Name a color, save its value and build a calmer palette.',
    category: 'Developer',
    status: 'live',
    color: '337 63% 51%',
    icon: Palette,
    route: '/tool/color-picker',
    browserProcessing: true,
    keywords: ['color picker', 'hex color', 'rgb color', 'hsl color', 'css color'],
    seo: {
      title: 'Online Color Picker & Hex to RGB Converter — Ahadex Tools',
      description: 'Interactive HTML/CSS color picker. Convert between HEX, RGB, HSL, and Tailwind CSS classes with instant one-click copying.',
      h1: 'Color Picker & Palette Generator',
      canonical: '/tool/color-picker',
    },
    content: {
      intro: 'Pick harmonious colors, inspect live hex/rgb/hsl values, and copy CSS color variables for web design and frontend projects.',
      howToUse: [
        'Click the color box or type any HEX code to preview your shade.',
        'View automatically computed RGB, HSL, and Tailwind CSS values.',
        'Click Copy beside any format to copy it immediately to your clipboard.',
      ],
      privacy: 'Runs purely in the browser with standard CSS color manipulation algorithms.',
      limitations: 'Supports standard sRGB color spectrums and hex representations.',
      faq: [
        {
          question: 'What formats can I copy?',
          answer: 'You can copy HEX (#FFFFFF), RGB, HSL, and pre-formatted Tailwind CSS class strings.',
        },
        {
          question: 'Can I generate random colors for inspiration?',
          answer: 'Yes! Use the Random Color button to generate fresh color ideas with one click.',
        },
      ],
    },
    relatedToolIds: ['format-json', 'image-resizer'],
  },
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    description: 'Convert a JPG into a shareable PNG when transparency or lossless output matters.',
    category: 'Images',
    status: 'live',
    color: '171 68% 34%',
    icon: Image,
    route: '/tool/jpg-to-png',
    browserProcessing: true,
    keywords: ['jpg converter', 'convert jpg to png', 'image converter', 'jpeg to png'],
    seo: {
      title: 'Convert JPG to PNG Online Free — Ahadex Tools',
      description: 'Convert JPG/JPEG images to lossless PNG format in seconds. 100% private, client-side conversion without file limits.',
      h1: 'JPG to PNG Image Converter',
      canonical: '/tool/jpg-to-png',
    },
    content: {
      intro: 'Convert JPEG images to high-definition PNG files directly in your browser with zero compression artifacts.',
      howToUse: [
        'Drop or choose a JPG or JPEG photo up to 20 MB.',
        'Click Convert to PNG to process the image in browser canvas memory.',
        'Download your crisp, lossless PNG file right away.',
      ],
      privacy: 'Pixel conversions execute entirely on your device with HTML5 Canvas. No photos are uploaded to any server.',
      limitations: 'Converting JPG to PNG does not automatically create transparent backgrounds if the original JPG had a solid background.',
      faq: [
        {
          question: 'Is my picture uploaded to the cloud?',
          answer: 'No. The conversion happens 100% client-side inside your browser thread.',
        },
        {
          question: 'Does converting JPG to PNG improve photo quality?',
          answer: 'It preserves exact pixel details without adding any further JPEG compression artifacts.',
        },
      ],
    },
    relatedToolIds: ['image-compressor', 'image-resizer'],
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize an image to a precise width and height for the job ahead.',
    category: 'Images',
    status: 'live',
    color: '171 68% 34%',
    icon: Image,
    route: '/tool/image-resizer',
    browserProcessing: true,
    keywords: ['resize image', 'image dimensions', 'change image size', 'scale picture'],
    seo: {
      title: 'Resize Image Dimensions Online Free — Ahadex Tools',
      description: 'Resize JPG, PNG, and WebP images to exact pixel widths and heights with aspect ratio locking and bicubic resampling.',
      h1: 'Image Resizer & Dimension Scaler',
      canonical: '/tool/image-resizer',
    },
    content: {
      intro: 'Scale down or resize any photo to exact pixel specifications for social media banners, website headers, or email attachments.',
      howToUse: [
        'Upload your image to inspect its original pixel dimensions.',
        'Enter target width and height (optionally lock aspect ratio).',
        'Click Resize Image and download your newly scaled photo.',
      ],
      privacy: 'All rescaling is performed in local memory with high-quality bicubic smoothing.',
      limitations: 'Enlarging small low-resolution photos significantly beyond their original size may lead to pixelation.',
      faq: [
        {
          question: 'Can I lock aspect ratio?',
          answer: 'Yes! The aspect ratio lock ensures your image scales proportionally without distortion.',
        },
        {
          question: 'Which image formats can I resize?',
          answer: 'JPG, PNG, and WebP images are all fully supported.',
        },
      ],
    },
    relatedToolIds: ['image-compressor', 'jpg-to-png'],
  },
  {
    id: 'photo-qr-code',
    slug: 'photo-qr-code',
    name: 'Photo QR Code',
    description: 'Embed a scannable QR code watermark badge seamlessly onto any photo.',
    category: 'Images',
    status: 'live',
    color: '171 68% 34%',
    icon: QrCode,
    route: '/tool/photo-qr-code',
    browserProcessing: true,
    keywords: [
      'photo qr code',
      'qr code on photo',
      'qr badge image',
      'watermark qr code',
      'social qr code image',
      'wifi qr photo',
    ],
    seo: {
      title: 'Photo QR Code Generator Online Free — Ahadex Tools',
      description:
        'Upload your image and overlay a high-clarity scannable QR code badge for Social links, Website URLs, WhatsApp, WiFi, or Phone numbers in seconds.',
      h1: 'Photo QR Code Generator & Watermark Badge',
      canonical: '/tool/photo-qr-code',
    },
    content: {
      intro:
        'Easily place a clear, fully scannable QR code badge directly onto your photo or poster without ruining the original image quality. Perfect for social banners, restaurant menus, flyers, business cards, and portfolios.',
      howToUse: [
        'Upload your photo (JPG, PNG, or WebP).',
        'Choose your payload type (Social, Website, WhatsApp, Wi-Fi, Phone, Email, Text).',
        'Enter your link, credentials, or custom information.',
        'Customize badge corner position, size, and styling with real-time preview.',
        'Download your ready-to-share composite image instantly.',
      ],
      privacy: 'Your images and links never leave your browser. All QR generation and image compositing happen 100% locally.',
      limitations: 'Make sure the badge is large enough to scan reliably when printing or uploading to compressed social media.',
      faq: [
        {
          question: 'Can any standard phone camera scan this QR code on the photo?',
          answer:
            'Yes! The QR code is generated with High Error Correction (level H/Q) and high contrast on a protective background, making it easily scannable on any iPhone, Android, or barcode scanner app.',
        },
        {
          question: 'Can I pick which corner the QR badge appears in?',
          answer:
            'Yes, you can choose Bottom-Right, Bottom-Left, Top-Right, or Top-Left, and adjust its size, padding, and transparency.',
        },
        {
          question: 'What types of payloads are supported?',
          answer:
            'Website URL, WhatsApp direct chat, Wi-Fi network auto-connect, Social profiles (Facebook, Instagram, YouTube, Twitter/X, TikTok, LinkedIn, Telegram), Phone call, Email, and plain Text.',
        },
      ],
    },
    relatedToolIds: ['image-compressor', 'image-resizer', 'jpg-to-png'],
  },
];

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(tool: ToolDefinition) {
  // First get explicitly configured related tools
  const explicit = tool.relatedToolIds
    .map((id) => tools.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is ToolDefinition => Boolean(candidate));

  // Then include all other available tools so that all current and future tools appear automatically
  const others = tools.filter(
    (candidate) => candidate.id !== tool.id && !explicit.some((e) => e.id === candidate.id)
  );

  return [...explicit, ...others];
}