import {
  Braces,
  FileArchive,
  FileText,
  Image,
  Palette,
  QrCode,
  Scissors,
  Minimize2,
  RotateCw,
  KeyRound,
  Wand2,
  ScanText,
  Layers,
} from 'lucide-react';
import type { ToolDefinition, ToolCategory, ToolStatus, ToolLocalizedData } from './tool-types';

export type { ToolDefinition, ToolCategory, ToolStatus, ToolLocalizedData };

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
    localized: {
      bn: {
        name: 'ইমেজ কম্প্রেসার',
        description: 'ছবির স্পষ্টতা ও কোয়ালিটি বজায় রেখে ফাইলের সাইজ দ্রুত কমান।',
        keywords: ["ছবি ছোট করুন","ছবির সাইজ কমান","ইমেজ কম্প্রেসার","ছবি কম্প্রেস","ফটো সাইজ রিডিউসার","image compress bangla","photo compress","ছবির এমবি কমান","ছবি অপ্টিমাইজ"],
        seo: {
          title: 'অনলাইন ইমেজ কম্প্রেসার — Ahadex Tools',
          description: 'আপনার ব্রাউজারে JPG, PNG ও WebP ছবি কম্প্রেস করুন সম্পূর্ণ বিনামূল্যে, নিরাপদে ও লোকাল প্রসেসিংয়ের মাধ্যমে।',
          h1: 'ইমেজ কম্প্রেসার',
        },
        content: {
          intro: 'ওয়েবসাইট, মেসেজ বা সোশ্যাল মিডিয়া আপলোডের জন্য ছবির সাইজ সহজে ছোট করুন কোনো সার্ভারে ফাইল পাঠানো ছাড়াই।',
          howToUse: [
            '২০ মেগাবাইট পর্যন্ত JPG, PNG বা WebP ছবি নির্বাচন করুন।',
            'আপনার প্রয়োজনীয় কোয়ালিটি অনুযায়ী কম্প্রেশন প্রোফাইল পছন্দ করুন।',
            'ছবি প্রসেস করুন এবং তাৎক্ষণিক অপ্টিমাইজড ফাইলটি ডাউনলোড করে নিন।',
          ],
          privacy: 'আপনার ছবি সম্পূর্ণ স্থানীয়ভাবে ব্রাউজার এপিআই দিয়ে প্রসেস করা হয়। কোনো রিমোট সার্ভারে আপলোড করা হয় না।',
          limitations: 'মূল ছবির ফরম্যাট সংরক্ষিত থাকে। অত্যন্ত অপ্টিমাইজড ছবিতে সাইজ বেশি নাও কমতে পারে।',
          faq: [
            {
              question: 'আমার ছবিগুলো কি সার্ভারে আপলোড করা হয়?',
              answer: 'না। এই টুলটি সরাসরি আপনার ডিভাইসের ব্রাউজারে ইমেজ প্রসেস করে। কোনো ফাইল কোনো সার্ভারে আপলোড হয় না।',
            },
            {
              question: 'কোন কোন ইমেজ ফরম্যাট সাপোর্ট করে?',
              answer: 'সর্বোচ্চ ২০ মেগাবাইট পর্যন্ত JPG, PNG এবং WebP ফরম্যাট সাপোর্ট করে।',
            },
          ],
        },
      },
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
      privacy: 'Your document is processed locally inside your browser memory. No document bytes are uploaded to any server.',
      limitations: 'Direct text extraction parses readable text streams instantly. For scanned image-only documents, client-side OCR is utilized (which loads OCR recognition models into browser memory during execution).',
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
    localized: {
      bn: {
        name: 'পিডিএফ টু টেক্সট',
        description: 'পিডিএফ ফাইল থেকে পরিষ্কার ও কপিযোগ্য টেক্সট নিষ্কাশন করুন কয়েক সেকেন্ডে।',
        keywords: ["পিডিএফ থেকে টেক্সট","পিডিএফ টেক্সট বের করুন","পিডিএফ লেখা কপি","পিডিএফ কনভার্টার","pdf to text bangla","পিডিএফ থেকে লেখা","পিডিএফ টেক্সট এক্সট্র্যাক্টর"],
        seo: {
          title: 'পিডিএফ টু টেক্সট কনভার্টার — Ahadex Tools',
          description: 'ব্রাউজারেই পিডিএফ থেকে টেক্সট বের করুন নিরাপদে ও সম্পূর্ণ বিনামূল্যে। কোনো ফাইল আপলোড প্রয়োজন নেই।',
          h1: 'পিডিএফ টু টেক্সট কনভার্টার',
        },
        content: {
          intro: 'সার্ভারে ফাইল আপলোড না করেই যেকোনো পিডিএফ ডকুমেন্টের সব টেক্সট নিমিষেই এক্সট্রাক্ট করুন।',
          howToUse: [
            'আপনার পিডিএফ ডকুমেন্টটি সিলেক্ট বা ড্র্যাগ অ্যান্ড ড্রপ করুন।',
            'এক্সট্রাক্ট টেক্সট বাটনে চাপ দিয়ে টেক্সট প্রসেস করুন।',
            'ক্লিপবোর্ডে কপি করুন অথবা সরাসরি .txt ফরম্যাটে সেভ করে নিন।',
          ],
          privacy: 'আপনার ডকুমেন্ট সম্পূর্ণ স্থানীয়ভাবে আপনার ব্রাউজার মেমরিতে প্রসেস হয়। কোনো ফাইল সার্ভারে আপলোড করা হয় না।',
          limitations: 'ডিজিটাল টেক্সট সাথে সাথে এক্সট্রাক্ট হয়। স্ক্যান করা বা ছবির ক্ষেত্রে ব্রাউজার-ভিত্তিক OCR কার্যকর হয় (যা প্রসেসিংয়ের সময় ব্রাউজার মেমরিতে মডেল লোড করে)।',
          faq: [
            {
              question: 'আমার গোপনীয় পিডিএফ কি কোথাও সংরক্ষিত হয়?',
              answer: 'না, কোনো সার্ভার স্টোরেজ ব্যবহার করা হয় না। আপনার ডকুমেন্ট সম্পূর্ণ সুরক্ষিত এবং আপনার ডিভাইসেই থাকে।',
            },
            {
              question: 'টেক্সট কি সরাসরি কপি করা যাবে?',
              answer: 'হ্যাঁ! এক ক্লিকে সম্পূর্ণ টেক্সট কপি করতে পারেন অথবা টেক্সট ফাইলে ডাউনলোড করতে পারেন।',
            },
          ],
        },
      },
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
    localized: {
      bn: {
        name: 'জেসন ফরম্যাটার',
        description: 'জটিল ও বিশৃঙ্খল JSON ডেটা সুন্দর, পরিচ্ছন্ন ও পাঠযোগ্য আকারে রূপান্তর করুন।',
        keywords: ["জেসন ফরম্যাটার","জেসন সাজানো","জেসন প্রিটিফায়ার","জেসন ভ্যালিডেটর","json ফরম্যাট","json বিউটিফায়ার","জেসন কোড সাজানো","json formatter bangla"],
        seo: {
          title: 'জেসন ফরম্যাটার ও ভ্যালিডেটর — Ahadex Tools',
          description: 'অনলাইনে JSON কোড ফরম্যাট, ভ্যালিডেট, সাজানো বা মিনিফাই করুন তাৎক্ষণিক ত্রুটি শনাক্তকরণ সহ।',
          h1: 'জেসন ফরম্যাটার ও ভ্যালিডেটর',
        },
        content: {
          intro: 'JSON অবজেক্ট রিয়েল-টাইমে সাজান ও সিনট্যাক্স যাচাই করুন কোনো নেটওয়ার্ক রিকোয়েস্ট ছাড়াই।',
          howToUse: [
            'আপনার কাঁচা বা এলোমেলো JSON ডেটা ইনপুট বক্সে পেস্ট করুন।',
            'পছন্দসই স্পেসিং বা ট্যাব ইনডেন্টেশন নির্বাচন করুন।',
            'ফরম্যাট করতে Format JSON অথবা এক লাইনে আনতে Minify বাটনে চাপুন।',
          ],
          privacy: 'সবকিছু ক্লায়েন্ট-সাইড জাভাস্ক্রিপ্টে রান করে। আপনার এপিআই কি বা টোকেন কখনোই বাইরে যাবে না।',
          limitations: 'ইনপুট কোড অবশ্যই স্ট্যান্ডার্ড JSON RFC 8259 নিয়ম মেনে হতে হবে।',
          faq: [
            {
              question: 'আমার সংবেদনশীল কোড কি গোপন থাকবে?',
              answer: 'হ্যাঁ! কোনো সার্ভার রিকোয়েস্ট ছাড়া সম্পূর্ণ ব্রাউজারে কাজ করায় আপনার ডেটা শতভাগ গোপন থাকে।',
            },
            {
              question: 'সিনট্যাক্স ত্রুটি কীভাবে চিহ্নিত হয়?',
              answer: 'বিল্ট-ইন ইঞ্জিন স্বয়ংক্রিয়ভাবে ভুল লাইনের পজিশন ও বিশদ মেসেজ সহ সতর্ক করে।',
            },
          ],
        },
      },
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
    localized: {
      bn: {
        name: 'পিডিএফ মার্জার',
        description: 'একাধিক বিচ্ছিন্ন পিডিএফ ফাইল একসাথে যুক্ত করে একটি সুশৃঙ্খল ডকুমেন্টে রূপান্তর করুন।',
        keywords: ["পিডিএফ জোড়া লাগান","পিডিএফ মার্জ","একাধিক পিডিএফ একত্রিত","পিডিএফ কম্বাইন","pdf merge bangla","পিডিএফ ফাইল একত্রিত","পিডিএফ জোড়া দেওয়া"],
        seo: {
          title: 'অনলাইন পিডিএফ মার্জার — Ahadex Tools',
          description: 'সহজে ও নিরাপদে একাধিক পিডিএফ ফাইল একত্র করুন বিনামূল্যে কোনো সফটওয়্যার ইনস্টল ছাড়াই।',
          h1: 'পিডিএফ ফাইল মার্জ করুন',
        },
        content: {
          intro: 'কোনো ভারী সফটওয়্যার বা ইন্টারনেট আপলোড ছাড়াই একাধিক পিডিএফ ফাইল এক ফাইলে একত্র করুন।',
          howToUse: [
            'আপনার ডিভাইস থেকে ২টি বা তার বেশি পিডিএফ সিলেক্ট করুন।',
            'লিস্টে ডকুমেন্টের ক্রম দেখে নিন।',
            'Merge PDFs বাটনে ক্লিক করে সম্মিলিত ফাইলটি ডাউনলোড করে নিন।',
          ],
          privacy: 'ব্রাউজার মেমরিতে ফাইলগুলো একত্রিত করা হয়, সার্ভারে কোনো ডকুমেন্ট পাঠানো হয় না।',
          limitations: 'একসাথে অনেকগুলো বড় সাইজের ফাইল মার্জ করার গতি ডিভাইসের র‍্যামের ওপর নির্ভর করে।',
          faq: [
            {
              question: 'পিডিএফ মার্জ করতে কি কোনো ফি দিতে হয়?',
              answer: 'না, এটি সম্পূর্ণ ফ্রি এবং কোনো জলছাপ যুক্ত করা হয় না।',
            },
            {
              question: 'মোবাইল ফোনে কি কাজ করবে?',
              answer: 'হ্যাঁ! মোবাইল, ট্যাবলেট এবং কম্পিউটার সব ডিভাইসেই চমৎকারভাবে কাজ করে।',
            },
          ],
        },
      },
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
    localized: {
      bn: {
        name: 'ওয়ার্ড কাউন্টার',
        description: 'লেখার সাথে সাথে শব্দ, অক্ষর, বাক্য ও পড়ার সময় রিয়েল-টাইমে গণনা করুন।',
        keywords: ["শব্দ গণনা","অক্ষর গণনা","ওয়ার্ড কাউন্টার","বাক্য গণনা","পড়ার সময়","ক্যারেক্টার কাউন্টার","word count bangla","বাংলা শব্দ গণনা"],
        seo: {
          title: 'অনলাইন শব্দ ও অক্ষর গণনাকারী — Ahadex Tools',
          description: 'রিয়েল-টাইমে শব্দ, ক্যারেক্টার, বাক্য ও রিডিং টাইম হিসাব করুন বাংলা ও ইংরেজি উভয়ের জন্য।',
          h1: 'অনলাইন ওয়ার্ড কাউন্টার',
        },
        content: {
          intro: 'লেখক, শিক্ষার্থী এবং কন্টেন্ট ক্রিয়েটরদের জন্য নিখুঁত রিয়েল-টাইম লেখার পরিসংখ্যান।',
          howToUse: [
            'এডিটরে আপনার টেক্সট টাইপ করুন অথবা পেস্ট করুন।',
            'শব্দ, বর্ণ, বাক্য ও পড়ার সময়ের লাইভ হিসাব সরাসরি দেখুন।',
            'প্রয়োজনে অতিরিক্ত স্পেস মোছা বা ফরম্যাট করার টুল ব্যবহার করুন।',
          ],
          privacy: 'আপনার লেখা কেবল আপনার স্ক্রিনে থাকে, কোনো বাহ্যিক ডাটাবেজ বা ট্র্যাকিংয়ে যায় না।',
          limitations: 'বাংলা ও ইংরেজি উভয় ভাষার জন্য স্বয়ংক্রিয়ভাবে উপযোগী হিসাব পদ্ধতি রয়েছে।',
          faq: [
            {
              question: 'বাংলা ভাষা সঠিকভাবে সাপোর্ট করে কি?',
              answer: 'হ্যাঁ! বাংলা যুক্তবর্ণ ও ইউনিকোড ফন্টের জন্য এটি পুরোপুরি নিখুঁত হিসাব দেয়।',
            },
            {
              question: 'রিডিং টাইম কীভাবে নির্ধারিত হয়?',
              answer: 'সাধারণ গতিতে প্রতি মিনিটে ২০০ শব্দ পড়ার গড় হিসাব ধরে পড়ার সময় দেখানো হয়।',
            },
          ],
        },
      },
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
    localized: {
      bn: {
        name: 'কালার পিকার',
        description: 'যেকোনো রঙের শেড বাছাই করুন, কোড দেখুন এবং সুন্দর প্যালেট তৈরি করুন।',
        keywords: ["কালার পিকার","রং সিলেক্টর","হেক্স কোড","RGB কালার","রঙের কোড","কালার কোড জেনারেটর","কালার প্যালেট"],
        seo: {
          title: 'অনলাইন কালার পিকার ও হেক্স কনভার্টার — Ahadex Tools',
          description: 'ইন্টারেক্টিভ কালার পিকার দিয়ে HEX, RGB, HSL এবং Tailwind CSS কোড সহজেই কপি করুন।',
          h1: 'কালার পিকার ও প্যালেট জেনারেটর',
        },
        content: {
          intro: 'ডিজাইন ও ফ্রন্টএন্ড ডেভেলপমেন্টের জন্য যেকোনো শেডের নিখুঁত কালার কোড বের করুন।',
          howToUse: [
            'কালার বক্সে ক্লিক করে অথবা HEX কোড লিখে রঙ নির্বাচন করুন।',
            'স্বয়ংক্রিয়ভাবে তৈরি হওয়া RGB, HSL এবং Tailwind মানগুলো দেখুন।',
            'এক ক্লিকেই পছন্দমতো ফরম্যাটের কোড ক্লিপবোর্ডে কপি করে নিন।',
          ],
          privacy: 'সম্পূর্ণ ব্রাউজারেই কাজ করে, কোনো নেটওয়ার্ক কল নেই।',
          limitations: 'স্ট্যান্ডার্ড sRGB কালার স্পেকট্রাম সাপোর্ট করে।',
          faq: [
            {
              question: 'কোন কোন ফরম্যাটে কালার কপি করা যায়?',
              answer: 'HEX (#FFFFFF), RGB, HSL এবং Tailwind CSS ক্লাস ফরম্যাটে কপি করা যায়।',
            },
            {
              question: 'নতুন রঙের আইডিয়া পাওয়া যাবে?',
              answer: 'হ্যাঁ! Random Color বাটন ব্যবহার করে নিত্যনতুন আকর্ষণীয় কালার পাওয়া সম্ভব।',
            },
          ],
        },
      },
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
      description: 'Convert JPG/JPEG images to lossless PNG format in seconds. Private browser conversion without file limits.',
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
      privacy: 'Pixel conversions execute entirely on your device with HTML5 Canvas. Your photos are not uploaded to any server.',
      limitations: 'Converting JPG to PNG does not automatically create transparent backgrounds if the original JPG had a solid background.',
      faq: [
        {
          question: 'Is my picture uploaded to the cloud?',
          answer: 'No. The conversion happens locally inside your browser thread and is not uploaded to servers.',
        },
        {
          question: 'Does converting JPG to PNG improve photo quality?',
          answer: 'It preserves exact pixel details without adding any further JPEG compression artifacts.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'জেপিজি টু পিএনজি',
        description: 'জেপিজি ছবিকে কোনো মানহানি ছাড়াই সরাসরি হাই-কোয়ালিটি পিএনজি ফাইলে রূপান্তর করুন।',
        keywords: ["জেপিজি থেকে পিএনজি","ছবি কনভার্টার","jpg to png বাংলা","ছবি পিএনজি করুন","জেপিজি কনভার্টার","ট্রান্সপারেন্ট ছবি ফরম্যাট"],
        seo: {
          title: 'JPG থেকে PNG কনভার্টার — Ahadex Tools',
          description: 'বিনামূল্যে কোনো কোয়ালিটি লস ছাড়া JPG ছবিকে PNG ফরম্যাটে রূপান্তর করুন নিমিষেই।',
          h1: 'JPG থেকে PNG কনভার্টার',
        },
        content: {
          intro: 'JPEG ছবিকে হাই-রেজোলিউশন PNG ফাইলে সরাসরি আপনার ব্রাউজারে কনভার্ট করুন।',
          howToUse: [
            '২০ মেগাবাইট পর্যন্ত যেকোনো JPG বা JPEG ছবি আপলোড করুন।',
            'Convert to PNG বাটনে চাপ দিয়ে প্রসেস করুন।',
            'তৈরি হওয়া পিএনজি ফাইলটি তৎক্ষণাৎ ডাউনলোড করে নিন।',
          ],
          privacy: 'HTML5 ক্যানভাস দিয়ে আপনার ডিভাইসেই পুরো কাজ সম্পন্ন হয়, সার্ভারে কোনো ছবি আপলোড হয় না।',
          limitations: 'মূল ছবিতে সলিড ব্যাকগ্রাউন্ড থাকলে স্বয়ংক্রিয়ভাবে ট্রান্সপারেন্ট হবে না।',
          faq: [
            {
              question: 'ছবি কি কোনো সার্ভারে যায়?',
              answer: 'না, রূপান্তর সম্পূর্ণভাবে আপনার ডিভাইসের ব্রাউজারে নিরাপদভাবে ঘটে।',
            },
            {
              question: 'ছবি কি ঘোলা বা খারাপ হবে?',
              answer: 'না, মূল ছবির প্রতিটি পিক্সেল অক্ষত রেখে পিএনজি ফাইলে সংরক্ষিত হয়।',
            },
          ],
        },
      },
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
    localized: {
      bn: {
        name: 'ইমেজ রিসাইজার',
        description: 'ছবির দৈর্ঘ্য ও প্রস্থ নির্দিষ্ট পিক্সেল মাপে সহজে পরিবর্তন করুন নিখুঁত অনুপাতে।',
        keywords: ["ছবি রিসাইজ","ছবির মাপ পরিবর্তন","ছবি বড় ছোট","পাসপোর্ট সাইজ ছবি","ইমেজ রিসাইজার","ছবির পিক্সেল পরিবর্তন","ছবির দৈর্ঘ্য প্রস্থ"],
        seo: {
          title: 'অনলাইন ইমেজ রিসাইজার — Ahadex Tools',
          description: 'অনলাইনে JPG, PNG এবং WebP ছবির দৈর্ঘ্য-প্রস্থ সঠিক মাপে রিসাইজ করুন কোনো সফটওয়্যার ছাড়াই।',
          h1: 'অনলাইন ইমেজ রিসাইজার',
        },
        content: {
          intro: 'সোশ্যাল মিডিয়া ব্যানার, পোস্ট বা ফরম পূরণের জন্য ছবির সঠিক পিক্সেল সাইজ নির্ধারণ করুন।',
          howToUse: [
            'আপনার ছবিটি আপলোড করে মূল দৈর্ঘ্য-প্রস্থ দেখুন।',
            'প্রয়োজনীয় দৈর্ঘ্য ও প্রস্থের মান লিখুন (অনুপাত লক রাখতে পারেন)।',
            'Resize Image বাটনে ক্লিক করে নতুন সাইজের ছবি সেভ করে নিন।',
          ],
          privacy: 'সব ধরনের রিসাইজিং ব্রাউজার মেমরিতে স্থানীয়ভাবে সম্পন্ন হয়।',
          limitations: 'খুব ছোট ছবির রেজোলিউশন মাত্রাতিরিক্ত বৃদ্ধি করলে ছবি ঝাপসা হতে পারে।',
          faq: [
            {
              question: 'ছবির অনুপাত কি ঠিক থাকবে?',
              answer: 'হ্যাঁ, লক অ্যাসপেক্ট রেশিও অন রাখলে ছবির অনুপাত কোনোভাবেই বিকৃত হবে না।',
            },
            {
              question: 'কোন কোন ফরম্যাট সাপোর্ট করে?',
              answer: 'JPG, PNG এবং WebP সব ফরম্যাটই সাপোর্ট করে।',
            },
          ],
        },
      },
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
      privacy: 'Your images and links never leave your browser. All QR generation and image compositing happen locally in your browser.',
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
    localized: {
      bn: {
        name: 'ফটো কিউআর কোড',
        description: 'যেকোনো ছবি বা পোস্টারের ওপর আকর্ষণীয় স্ক্যানযোগ্য কিউআর কোড ব্যাজ যুক্ত করুন।',
        keywords: ["ছবিতে কিউআর কোড","ফটো কিউআর কোড","পোস্টার কিউআর ব্যাজ","ছবির ওপর কিউআর","কিউআর কোড ওয়াটারমার্ক","ছবিতে বারকোড"],
        seo: {
          title: 'ফটো কিউআর কোড জেনারেটর — Ahadex Tools',
          description: 'ছবির ওপর সোশ্যাল মিডিয়া, ওয়েবসাইট, হোয়াটসঅ্যাপ বা ওয়াইফাই কিউআর কোড ব্যাজ যুক্ত করুন দ্রুত ও বিনামূল্যে।',
          h1: 'ফটো কিউআর কোড জেনারেটর',
        },
        content: {
          intro: 'ছবির আসল মান নষ্ট না করে সরাসরি পরিচ্ছন্ন ও স্পষ্ট কিউআর কোড ওয়াটারমার্ক ব্যাজ যুক্ত করুন পোস্টার বা ছবিতে।',
          howToUse: [
            'আপনার ছবি আপলোড করুন (JPG, PNG বা WebP)।',
            'কিউআর কোডের ধরন বেছে নিন (সোশ্যাল, ওয়েবসাইট, হোয়াটসঅ্যাপ, ওয়াইফাই ইত্যাদি)।',
            'আপনার লিঙ্ক বা তথ্য প্রদান করুন এবং ব্যাজের পজিশন ও সাইজ পছন্দ করুন।',
            'লাইভ প্রিভিউ দেখে চূড়ান্ত ছবিটি সরাসরি ডাউনলোড করুন।',
          ],
          privacy: 'ছবি ও তথ্য কখনোই আপনার ব্রাউজারের বাইরে যাবে না। ১০০% স্থানীয় ডিভাইসে তৈরি হয়।',
          limitations: 'সোশ্যাল মিডিয়া কম্প্রেশনেও যাতে সহজে স্ক্যান করা যায় সেজন্য ব্যাজটি পর্যাপ্ত সাইজের রাখুন।',
          faq: [
            {
              question: 'যেকোনো সাধারণ মোবাইল ক্যামেরা দিয়ে কি স্ক্যান হবে?',
              answer: 'হ্যাঁ! উচ্চমানের কনট্রাস্ট ও এরর কারেকশন থাকায় যেকোনো আইফোন বা অ্যান্ড্রয়েড ফোনে সহজে স্ক্যান হয়।',
            },
            {
              question: 'ব্যাজের স্থান কি পরিবর্তন করা যায়?',
              answer: 'হ্যাঁ, ছবির চারটি কোণায় (নিচে ডানে, নিচে বামে, ওপরে ডানে বা ওপরে বামে) বসানো সম্ভব।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['image-compressor', 'image-resizer', 'jpg-to-png'],
  },
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents into editable Microsoft Word (.docx) files locally in your browser.',
    category: 'Documents',
    status: 'live',
    color: '217 91% 60%',
    icon: FileText,
    route: '/tool/pdf-to-word',
    browserProcessing: true,
    keywords: ['pdf to word', 'pdf to docx', 'convert pdf to editable word', 'free pdf to word converter'],
    seo: {
      title: 'PDF to Word Converter — Ahadex Tools',
      description: 'Convert PDF documents to editable Microsoft Word (.docx) files free online in your browser. 100% private client-side processing.',
      h1: 'PDF to Word Converter',
      canonical: '/tool/pdf-to-word',
    },
    content: {
      intro: 'Extract formatted text and paragraphs from your PDF documents and export directly as clean, editable Word (.docx) files without uploading to external servers.',
      howToUse: [
        'Select or drag & drop your PDF file into the upload zone.',
        'Choose whether to include page divider labels in the generated Word document.',
        'Click "Convert to Word (.DOCX)" and download your editable document.',
      ],
      privacy: 'Your PDF is parsed entirely in your browser using client-side JavaScript. Confidential documents are never transmitted across the network.',
      limitations: 'Extracts real readable text streams, headings, and paragraphs into editable Microsoft Word (.docx) format. Note: Multi-column magazine layouts, complex nested tables, background graphics, and scanned non-OCR images are rendered as clean flowing editable text paragraphs rather than rigid absolute coordinate overlays.',
      faq: [
        {
          question: 'Is this PDF to Word converter completely free?',
          answer: 'Yes! You can convert as many PDF files as you need without accounts, paywalls, or limits.',
        },
        {
          question: 'Does it preserve complex magazine layouts and table grids perfectly?',
          answer: 'The converter extracts all textual content, headings, and paragraphs into clean editable text in Word (.docx). Intricate desktop-publishing designs (multi-column flyers or overlapping graphical tables) are structured into clean editable paragraphs for effortless editing rather than absolute-coordinate visual clones.',
        },
        {
          question: 'Are my private PDF documents uploaded to your server?',
          answer: 'No. All parsing and DOCX assembly execute 100% locally within your browser memory.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'PDF থেকে Word কনভার্টার',
        description: 'PDF ফাইল থেকে লেখা ও অনুচ্ছেদগুলো বের করে এডিটেবল মাইক্রোসফট ওয়ার্ড (.docx) ফাইলে রূপান্তর করুন শতভাগ নিরাপদে।',
        keywords: ["পিডিএফ টু ওয়ার্ড","পিডিএফ থেকে ওয়ার্ড","পিডিএফ ওয়ার্ডে রূপান্তর","পিডিএফ কনভার্টার","pdf word converter","ওয়ার্ড ফাইল","docx কনভার্টার","পিডিএফ ডক রূপান্তর","pdf to word bangla"],
        seo: {
          title: 'অনলাইন PDF থেকে Word কনভার্টার — Ahadex Tools',
          description: 'ব্রাউজারে কোনো ফাইল আপলোড ছাড়াই সরাসরি PDF থেকে এডিটেবল Word (.docx) ফাইলে কনভার্ট করুন সম্পূর্ণ বিনামূল্যে।',
          h1: 'PDF থেকে Word কনভার্টার',
        },
        content: {
          intro: 'PDF এর ভেতরের টেক্সট ও প্যারাগ্রাফ নির্ভুলভাবে এক্সট্রাক্ট করে তাৎক্ষণিকভাবে এডিটেবল ওয়ার্ড ফাইলে রূপান্তর করুন।',
          howToUse: [
            'আপনার কাঙ্ক্ষিত PDF ফাইলটি ড্র্যাগ করে আনুন বা নির্বাচন করুন।',
            'ডকুমেন্টে পৃষ্ঠা নম্বর রাখতে চান কিনা তা নির্ধারণ করুন।',
            '"Word (.docx) ফরম্যাটে রূপান্তর করুন" বাটনে ক্লিক করে ফাইলটি ডাউনলোড করুন।',
          ],
          privacy: 'আপনার ফাইল সম্পূর্ণ স্থানীয়ভাবে ব্রাউজার মেমরিতে প্রসেস হয়। কোনো রিমোট সার্ভারে পাঠানো হয় না।',
          limitations: 'PDF থেকে এডিটেবল টেক্সট, শিরোনাম ও প্যারাগ্রাফ বের করে Word (.docx) ফাইলে রূপান্তর করা হয়। তবে জটিল টেবিলের গ্রিড, ব্যাকগ্রাউন্ড ছবি বা একাধিক কলামের ম্যাগাজিন লেআউটের ক্ষেত্রে হুবহু ফিক্সড পিক্সেল ডিজাইনের বদলে সহজে সম্পাদনযোগ্য ফ্লোয়িং টেক্সট তৈরি হয়।',
          faq: [
            {
              question: 'জটিল টেবিল বা একাধিক কলামের লেআউট কি হুবহু একই থাকবে?',
              answer: 'এই টুলটির মূল উদ্দেশ্য হলো PDF-এর লেখাকে সম্পূর্ণরূপে সম্পাদনযোগ্য (Editable) Word ফাইলে পরিণত করা। সাধারণ ডকুমেন্ট নিখুঁত হলেও অত্যন্ত জটিল কলাম বা গ্রাফিকাল টেবিলগুলো সম্পাদনাযোগ্য প্যারাগ্রাফ হিসেবে সংরক্ষিত হয়, হুবহু ভিজ্যুয়াল রেপ্লিকা হিসেবে নয়।',
            },
            {
              question: 'এটি কি মাইক্রোসফট ওয়ার্ড এবং গুগল ডকসে সাপোর্ট করবে?',
              answer: 'হ্যাঁ, তৈরি হওয়া .docx ফাইলটি MS Word, Google Docs এবং LibreOffice-এ স্বাচ্ছন্দ্যে এডিট করা যায়।',
            },
            {
              question: 'আমার ফাইল কি কোনো সার্ভারে জমা থাকে?',
              answer: 'না, আপনার ফাইল আপনার কম্পিউটার বা মোবাইলের ব্রাউজারেই প্রক্রিয়াজাত হয়।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['pdf-to-text', 'merge-pdf', 'split-pdf', 'compress-pdf'],
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG and JPEG images into clean, standardized PDF documents with custom page sizes.',
    category: 'Documents',
    status: 'live',
    color: '142 71% 45%',
    icon: FileText,
    route: '/tool/jpg-to-pdf',
    browserProcessing: true,
    keywords: ['jpg to pdf', 'jpeg to pdf', 'convert jpg to pdf', 'images to pdf online'],
    seo: {
      title: 'JPG to PDF Converter — Ahadex Tools',
      description: 'Convert one or multiple JPG images into a single PDF document. Choose page size, orientation, and margins free online in your browser.',
      h1: 'JPG to PDF Converter',
      canonical: '/tool/jpg-to-pdf',
    },
    content: {
      intro: 'Combine single or multiple JPG/JPEG photos into an organized PDF file with complete control over A4/Letter page size, margins, and page orientation.',
      howToUse: [
        'Select or drag & drop one or multiple JPG photos.',
        'Reorder images as needed and customize page size, orientation, or margins.',
        'Click "Convert to PDF" and download your finished document.',
      ],
      privacy: 'Images are combined and embedded into PDF documents directly inside your browser. No photos leave your device.',
      limitations: 'Supports JPG and JPEG formats. For mixed image types (PNG/WebP), use our Image to PDF tool.',
      faq: [
        {
          question: 'Can I combine multiple photos into a single PDF?',
          answer: 'Yes! You can upload dozens of photos, reorder them with one click, and combine them into one multi-page PDF.',
        },
        {
          question: 'Will image quality be preserved?',
          answer: 'Yes, full original resolution is embedded into the PDF without degradation.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'JPG থেকে PDF কনভার্টার',
        description: 'এক বা একাধিক JPG ছবিকে সহজে একটি পরিচ্ছন্ন ও নিখুঁত PDF ফাইলে রূপান্তর করুন।',
        keywords: ["ছবি থেকে পিডিএফ","জেপিজি থেকে পিডিএফ","ফটো পিডিএফ কনভার্টার","ছবি পিডিএফ বানানোর অ্যাপ","jpg to pdf bangla","জেপিজি পিডিএফ রূপান্তর"],
        seo: {
          title: 'অনলাইন JPG থেকে PDF কনভার্টার — Ahadex Tools',
          description: 'একাধিক JPG ছবি নির্বাচন করে পেজ সাইজ ও মার্জিন পছন্দ অনুযায়ী নিমেষেই PDF তৈরি করুন সম্পূর্ণ বিনামূল্যে।',
          h1: 'JPG থেকে PDF কনভার্টার',
        },
        content: {
          intro: 'ডকুমেন্ট স্ক্যান বা ফটোগ্রাফগুলোকে এক ক্লিকে অফিশিয়াল A4 অথবা লেটার সাইজের PDF ফাইলে রূপান্তর করুন।',
          howToUse: [
            'এক বা একাধিক JPG ছবি আপলোড করুন।',
            'প্রয়োজনে ছবির ক্রম পরিবর্তন করুন এবং পেজের সাইজ নির্ধারণ করুন।',
            '"PDF তৈরি করুন" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করে নিন।',
          ],
          privacy: 'সব ছবি আপনার ডিভাইসের মেমরিতে যুক্ত হয়ে PDF তৈরি হয়। কোনো ক্লাউড সার্ভারে আপলোড হয় না।',
          limitations: 'JPG ও JPEG ফরম্যাটের ফাইল সমর্থিত।',
          faq: [
            {
              question: 'একাধিক ছবি একসাথে একটি ফাইলে জোড়া দেওয়া যাবে কি?',
              answer: 'হ্যাঁ, যতগুলো ইচ্ছা ছবি নির্বাচন করে একটি সিঙ্গেল মাল্টি-পেজ PDF তৈরি করা যাবে।',
            },
            {
              question: 'প্রিন্ট করার জন্য A4 পেজ সাইজ সাপোর্ট করবে?',
              answer: 'হ্যাঁ, A4, US Letter অথবা ছবির মাপ অনুযায়ী যেকোনো সাইজ বেছে নেওয়া যায়।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['image-to-pdf', 'jpg-to-png', 'image-compressor', 'merge-pdf'],
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    description: 'Split PDF files by specific page ranges or extract all pages into separate PDF documents.',
    category: 'Documents',
    status: 'live',
    color: '38 92% 50%',
    icon: Scissors,
    route: '/tool/split-pdf',
    browserProcessing: true,
    keywords: ['split pdf', 'separate pdf pages', 'extract pdf range', 'split pdf online free'],
    seo: {
      title: 'Split PDF Online — Ahadex Tools',
      description: 'Split PDF files into individual pages or custom ranges (e.g., 1-3, 5). Fast, free, and 100% private in-browser tool.',
      h1: 'Split PDF Files Online',
      canonical: '/tool/split-pdf',
    },
    content: {
      intro: 'Divide large PDF documents into smaller files by specifying exact page numbers or extract every page into individual PDFs packed in a ZIP.',
      howToUse: [
        'Upload your PDF document.',
        'Choose whether to extract a specific page range (e.g., 1-3, 5) or split all pages.',
        'Click "Split PDF Now" and instantly download your split PDF or ZIP archive.',
      ],
      privacy: 'PDF page copying and splitting happen locally in WebAssembly memory. Your confidential files are never uploaded.',
      limitations: 'Password-encrypted documents must be unlocked before splitting.',
      faq: [
        {
          question: 'How do I specify multiple page ranges?',
          answer: 'Use commas and dashes like "1-3, 5, 8-10" to include precisely the pages you need.',
        },
        {
          question: 'Can I split every page into separate files?',
          answer: 'Yes! Choose the "Split Every Page" option to receive all pages as individual PDFs bundled in a ZIP.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'স্প্লিট PDF',
        description: 'বড় PDF থেকে নির্দিষ্ট পৃষ্ঠা আলাদা করুন বা প্রতিটি পৃষ্ঠা আলাদা PDF ফাইলে বিভক্ত করুন।',
        keywords: ["পিডিএফ ভাগ করুন","পিডিএফ স্প্লিট","পিডিএফ পেজ আলাদা","পিডিএফ পাতা কাটা","pdf split bangla","পিডিএফ আলাদা করা"],
        seo: {
          title: 'অনলাইন স্প্লিট PDF — Ahadex Tools',
          description: 'সহজে PDF ফাইলের নির্দিষ্ট পেজ আলাদা করুন বা সব পেজ আলাদা PDF বানিয়ে জিপ ফাইলে ডাউনলোড করুন বিনামূল্যে।',
          h1: 'স্প্লিট PDF ফাইল',
        },
        content: {
          intro: 'বড় PDF বই বা ডকুমেন্ট থেকে আপনার প্রয়োজনীয় পৃষ্ঠাগুলো নিমেষেই আলাদা ফাইলে রূপান্তর করুন।',
          howToUse: [
            'আপনার PDF ফাইলটি সিলেক্ট করুন।',
            'নির্দিষ্ট পৃষ্ঠা রেঞ্জ দিন (যেমন: 1-3, 5) অথবা "প্রতিটি পৃষ্ঠা আলাদা PDF" নির্বাচন করুন।',
            '"PDF স্প্লিট করুন" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করুন।',
          ],
          privacy: 'সম্পূর্ণ প্রসেসিং আপনার ব্রাউজারে হয়, কোনো ডেটা সার্ভারে যায় না।',
          limitations: 'লক করা PDF এর ক্ষেত্রে প্রথমে পাসওয়ার্ড দিয়ে আনলক করে নিতে হবে।',
          faq: [
            {
              question: 'রেঞ্জ কীভাবে লিখব?',
              answer: 'কমা এবং ড্যাশ দিয়ে লিখুন, যেমন: ১-৩, ৫, ৭-৯।',
            },
            {
              question: 'আলাদা করা ফাইলগুলোর কোয়ালিটি কি কমে যাবে?',
              answer: 'না, মূল ফাইলের টেক্সট ও ভেক্টর কোয়ালিটি ১০০% অক্ষুণ্ণ থাকে।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['pdf-page-extractor', 'merge-pdf', 'pdf-rotate', 'compress-pdf'],
  },
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size in your browser while maintaining readable text and sharp visual clarity.',
    category: 'Documents',
    status: 'live',
    color: '262 83% 58%',
    icon: Minimize2,
    route: '/tool/compress-pdf',
    browserProcessing: true,
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'online pdf compressor free'],
    seo: {
      title: 'Compress PDF Online — Ahadex Tools',
      description: 'Compress PDF files online to reduce file size for email and web uploads. Real in-browser compression with before and after size stats.',
      h1: 'Compress PDF Online',
      canonical: '/tool/compress-pdf',
    },
    content: {
      intro: 'Optimize and shrink bulky PDF documents for email attachments and web upload limits without sacrificing readability or compromising confidentiality.',
      howToUse: [
        'Select or drag & drop the PDF file you wish to compress.',
        'Choose a compression profile: Extreme, Recommended, or Low.',
        'Click "Compress PDF" and download the optimized file showing exact saved bytes.',
      ],
      privacy: 'Compression executes locally via client-side canvas rasterization and PDF stream reconstruction. No documents are uploaded.',
      limitations: 'Provides two modes: Structural Stream Clean-up (lossless, keeps vector text selectable) and Visual Canvas Compression (for scans/photos). If an original PDF is already heavily optimized, recompression will honestly notify you if size reduction is not possible.',
      faq: [
        {
          question: 'How much can I reduce my PDF size?',
          answer: 'Image-heavy scanned PDFs and presentations can often be compressed by 40% to 80% without noticeable quality loss.',
        },
        {
          question: 'Will text remain selectable and vector-sharp?',
          answer: 'Yes! If you select the "Structural Stream Clean-up" mode, all vector text, fonts, and hyperlinks remain 100% selectable. In "Visual Canvas Compression" mode, pages are converted into sharp high-resolution images for maximum file-weight reduction.',
        },
        {
          question: 'Why did my PDF size not decrease?',
          answer: 'If a PDF was already created with maximum stream compression, re-encoding cannot make it smaller. Our tool performs byte-by-byte verification and will honestly inform you if keeping the original file is the best choice.',
        },
        {
          question: 'Are my confidential documents safe?',
          answer: 'Yes! Processing executes entirely inside your browser sandbox without server interaction.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'কম্প্রেস PDF',
        description: 'ডকুমেন্টের স্পষ্টতা বজায় রেখে PDF ফাইলের সাইজ কমান। ভিজ্যুয়াল বা লসলেস অপ্টিমাইজেশন সাপোর্ট।',
        keywords: ["পিডিএফ সাইজ কমান","পিডিএফ কম্প্রেস","পিডিএফ ছোট করুন","pdf compress bangla","পিডিএফ এর আকার ছোট","পিডিএফ এমবি কমান"],
        seo: {
          title: 'অনলাইন PDF কম্প্রেসার — Ahadex Tools',
          description: 'ইমেইল বা ওয়েবসাইট আপলোডের জন্য PDF ফাইলের সাইজ ছোট করুন বিনামূল্যে ও শতভাগ লোকাল ব্রাউজার প্রসেসিংয়ে।',
          h1: 'PDF ফাইলের আকার ছোট করুন',
        },
        content: {
          intro: 'ভারী PDF ফাইলকে হালকা ও সহজে শেয়ারযোগ্য করতে নির্ভরযোগ্য ক্লায়েন্ট-সাইড অপ্টিমাইজেশন ব্যবহার করুন।',
          howToUse: [
            'যে PDF ফাইলের আকার কমাতে চান সেটি আপলোড করুন।',
            'আপনার প্রয়োজনীয় কম্প্রেশন মোড (ভিজ্যুয়াল ক্যানভাস অথবা স্ট্রাকচারাল লসলেস) নির্বাচন করুন।',
            '"PDF কম্প্রেস করুন" বাটনে ক্লিক করে ফলাফল দেখুন ও ডাউনলোড করুন।',
          ],
          privacy: 'আপনার ফাইল কোনো সার্ভারে আপলোড হয় না, আপনার ডিভাইসেই কম্প্রেস সম্পন্ন হয়।',
          limitations: 'দুটি মোড বিদ্যমান: স্ট্রাকচারাল মোডে টেক্সট ও সিলেকশন অক্ষুণ্ণ থাকে। কোনো ফাইল আগে থেকেই সর্বোচ্চ কম্প্রেসড থাকলে টুলটি স্বচ্ছভাবে তা জানিয়ে মূল ফাইলটি রাখার পরামর্শ দেয়।',
          faq: [
            {
              question: 'কম্প্রেস করার পর কি টেক্সট সিলেক্ট ও কপি করা যাবে?',
              answer: 'হ্যাঁ! আপনি যদি "স্ট্রাকচারাল অপ্টিমাইজেশন" মোড নির্বাচন করেন, তবে সব টেক্সট ১০০% সিলেক্টেবল ও ভেক্টর কোয়ালিটিতে অক্ষুণ্ণ থাকবে। আর স্ক্যান করা ডকুমেন্টের ক্ষেত্রে "ভিজ্যুয়াল ক্যানভাস" মোড সাইজ কমাতে সবচেয়ে কার্যকর।',
            },
            {
              question: 'আমার PDF এর সাইজ কেন কমল না?',
              answer: 'কিছু PDF ফাইল আগে থেকেই সর্বোচ্চ মাত্রায় সংকুচিত থাকে। ফলে অতিরিক্ত প্রসেসিংয়ে সাইজ হ্রাস সম্ভব না হলে আমাদের টুলটি কোনো মিথ্যা তথ্য না দিয়ে আপনাকে স্বচ্ছভাবে মূল ফাইলটি রাখার পরামর্শ দেয়।',
            },
            {
              question: 'লেখা কি অস্পষ্ট হয়ে যাবে?',
              answer: 'প্রস্তাবিত লেভেলে টেক্সট সম্পূর্ণ পড়ার মতো স্পষ্ট ও শার্প থাকে।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['split-pdf', 'merge-pdf', 'pdf-to-jpg', 'image-compressor'],
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert every page of a PDF document into high-resolution JPG images with one click.',
    category: 'Documents',
    status: 'live',
    color: '346 87% 57%',
    icon: Image,
    route: '/tool/pdf-to-jpg',
    browserProcessing: true,
    keywords: ['pdf to jpg', 'pdf to jpeg', 'convert pdf to image', 'extract images from pdf'],
    seo: {
      title: 'PDF to JPG Converter — Ahadex Tools',
      description: 'Convert PDF pages into high-resolution JPG images free online. Download individual pages or all pages as a ZIP archive.',
      h1: 'PDF to JPG Converter',
      canonical: '/tool/pdf-to-jpg',
    },
    content: {
      intro: 'Render PDF pages into crisp, universally viewable JPG images suitable for presentations, social sharing, or image editors.',
      howToUse: [
        'Select your PDF document from your device.',
        'Customize resolution scale (up to 300 DPI) and JPG quality.',
        'Convert all pages and download individual JPGs or everything as a ZIP.',
      ],
      privacy: 'Pages are rendered onto client-side HTML5 canvas elements. Your documents never leave your browser.',
      limitations: 'JPEG does not support transparency; transparent backgrounds are rendered as crisp white.',
      faq: [
        {
          question: 'Can I download all converted pages at once?',
          answer: 'Yes! A single click on "Download All as ZIP" saves every page as a numbered JPG inside a ZIP file.',
        },
        {
          question: 'What resolution are the extracted JPGs?',
          answer: 'You can choose between Standard (1x), High Quality (1.5x), or Ultra Sharp (2x/300 DPI).',
        },
      ],
    },
    localized: {
      bn: {
        name: 'PDF থেকে JPG কনভার্টার',
        description: 'PDF ডকুমেন্টের প্রতিটি পৃষ্ঠাকে উচ্চমানের JPG ছবিতে রূপান্তর করুন।',
        keywords: ["পিডিএফ থেকে ছবি","পিডিএফ থেকে জেপিজি","পিডিএফ ফটো কনভার্ট","pdf to jpg bangla","পিডিএফ পেজ ছবি তৈরি","পিডিএফ ইমেজ কনভার্টার"],
        seo: {
          title: 'অনলাইন PDF থেকে JPG কনভার্টার — Ahadex Tools',
          description: 'PDF ফাইল থেকে প্রতিটি পেজ হাই-রেজোলিউশন JPG ছবিতে রূপান্তর করুন এবং সিঙ্গেল বা জিপ ফাইলে ডাউনলোড করুন।',
          h1: 'PDF থেকে JPG কনভার্টার',
        },
        content: {
          intro: 'ডকুমেন্ট, বই বা রসিদের PDF পৃষ্ঠাকে পরিষ্কার ছবিতে রূপান্তর করে সহজে দেখার উপযোগী করুন।',
          howToUse: [
            'আপনার PDF ফাইলটি সিলেক্ট করুন।',
            'প্রয়োজনে ছবির রেজোলিউশন ও কোয়ালিটি নির্বাচন করুন।',
            '"JPG তে রূপান্তর করুন" বাটনে ক্লিক করে একক ছবি বা জিপ ফাইল ডাউনলোড করুন।',
          ],
          privacy: 'সম্পূর্ণ প্রসেসিং আপনার ব্রাউজারের ভেতর সম্পন্ন হয়।',
          limitations: 'JPG ফরম্যাট স্বচ্ছতা সমর্থন করে না, ব্যাকগ্রাউন্ড সাদা হিসেবে তৈরি হবে।',
          faq: [
            {
              question: 'সবগুলো ছবি কি একবারে ডাউনলোড করা যাবে?',
              answer: 'হ্যাঁ, "সব ছবি জিপ (ZIP) আকারে ডাউনলোড" বাটনে ক্লিক করে সব ছবি এক ক্লিকে পেয়ে যাবেন।',
            },
            {
              question: 'ছবির লেখাগুলো কি পরিষ্কার থাকবে?',
              answer: 'হ্যাঁ, ২x রেটিনা রেজোলিউশনে রেন্ডার হওয়ায় টেক্সট অতি স্পষ্ট থাকে।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['pdf-to-png', 'pdf-to-text', 'jpg-to-pdf', 'merge-pdf'],
  },
  {
    id: 'heic-to-jpg',
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG',
    description: 'Convert iPhone and iPad HEIC/HEIF photos into universally compatible JPG images.',
    category: 'Images',
    status: 'live',
    color: '199 89% 48%',
    icon: Image,
    route: '/tool/heic-to-jpg',
    browserProcessing: true,
    keywords: ['heic to jpg', 'heic to jpeg', 'convert heic', 'iphone photo converter'],
    seo: {
      title: 'HEIC to JPG Converter — Ahadex Tools',
      description: 'Convert Apple iPhone HEIC and HEIF photos into standard JPG images in your browser. 100% free, private, with zero server uploads.',
      h1: 'HEIC to JPG Converter',
      canonical: '/tool/heic-to-jpg',
    },
    content: {
      intro: 'Open and convert Apple High Efficiency Image Format (HEIC/HEIF) photos into universally supported JPEG format compatible with any device, Windows PC, or website.',
      howToUse: [
        'Select or drag & drop your .heic or .heif photo.',
        'Adjust the JPG output quality slider as desired.',
        'Click "Convert to JPG" and download your converted photo.',
      ],
      privacy: 'Decoding and JPEG encoding occur 100% within your browser thread. Photos are never uploaded to any remote server.',
      limitations: 'Supports standard Apple HEIC and HEIF image containers up to 50 MB.',
      faq: [
        {
          question: 'Why do my iPhone photos have the .heic extension?',
          answer: 'Apple devices use HEIC by default to save storage space, but many Windows PCs and websites require standard JPG.',
        },
        {
          question: 'Is my photo uploaded to your server?',
          answer: 'No! The conversion runs completely in your browser without any network upload.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'HEIC থেকে JPG কনভার্টার',
        description: 'iPhone ও iPad এর HEIC/HEIF ছবিকে সহজে সাধারণ ও সব ডিভাইসে সমর্থনযোগ্য JPG তে রূপান্তর করুন।',
        keywords: ["আইফোন ছবি কনভার্ট","heic থেকে jpg","heic ছবি ওপেন","heic to jpg বাংলা","আইফোন ফটো কনভার্টার","heic ফাইল রূপান্তর"],
        seo: {
          title: 'অনলাইন HEIC থেকে JPG কনভার্টার — Ahadex Tools',
          description: 'অ্যাপল ডিভাইসের HEIC ছবিকে সাধারণ JPG ফরম্যাটে রূপান্তর করুন সম্পূর্ণ বিনামূল্যে ও নিরাপদে ব্রাউজারে।',
          h1: 'HEIC থেকে JPG ছবি রূপান্তর',
        },
        content: {
          intro: 'উইন্ডোজ কম্পিউটার বা যেকোনো ওয়েবসাইটে আইফোনের HEIC ছবি সহজে ব্যবহারের উপযোগী করতে JPG তে রূপান্তর করুন।',
          howToUse: [
            'আপনার .heic বা .heif ছবি নির্বাচন করুন।',
            'প্রয়োজনে কোয়ালিটি স্লাইডার অ্যাডজাস্ট করুন।',
            '"JPG ফরম্যাটে কনভার্ট করুন" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করুন।',
          ],
          privacy: 'ছবি সম্পূর্ণ লোকাল ব্রাউজারে ডিকোড হয়, কোনো সার্ভার কল নেই।',
          limitations: 'সর্বোচ্চ ৫০ মেগাবাইট পর্যন্ত ফাইল সমর্থিত।',
          faq: [
            {
              question: 'সব ডিভাইসে কি ছবি ওপেন হবে?',
              answer: 'হ্যাঁ, তৈরি হওয়া JPG যেকোনো কম্পিউটার, ফোন বা ওয়েবসাইটে সাপোর্ট করে।',
            },
            {
              question: 'কোয়ালিটি কি ঠিক থাকবে?',
              answer: 'হ্যাঁ, মূল ছবির সম্পূর্ণ রেজোলিউশন ও রঙের গভীরতা সংরক্ষিত থাকে।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['jpg-to-png', 'png-to-jpg', 'webp-to-jpg', 'image-compressor'],
  },
  {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    name: 'PNG to JPG',
    description: 'Convert PNG images to JPG with custom background colors and quality controls.',
    category: 'Images',
    status: 'live',
    color: '24 95% 53%',
    icon: Layers,
    route: '/tool/png-to-jpg',
    browserProcessing: true,
    keywords: ['png to jpg', 'png to jpeg', 'convert png to jpg', 'change png background to white'],
    seo: {
      title: 'PNG to JPG Converter — Ahadex Tools',
      description: 'Convert PNG images to standard JPG format. Choose white, black, or custom background colors for transparent areas. Free in-browser tool.',
      h1: 'PNG to JPG Converter',
      canonical: '/tool/png-to-jpg',
    },
    content: {
      intro: 'Convert transparent or opaque PNG files into compact, universally compatible JPEG images with fine-tuned background color selection.',
      howToUse: [
        'Select a PNG image from your device.',
        'Choose a background color (White, Black, or Custom) to replace transparent areas.',
        'Click "Convert to JPG" and download your finished image.',
      ],
      privacy: 'Conversion executes in HTML5 canvas memory. Your graphics are never uploaded or saved on our servers.',
      limitations: 'JPEG does not support transparency; any transparent pixels will be filled with your selected background color.',
      faq: [
        {
          question: 'What happens to the transparent background in my PNG?',
          answer: 'You can choose to fill transparent areas with clean white, black, or any custom color of your choice.',
        },
        {
          question: 'Why convert PNG to JPG?',
          answer: 'JPG files are typically 50% to 80% smaller than PNGs, making them ideal for web pages, emails, and social media.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'PNG থেকে JPG কনভার্টার',
        description: 'PNG ছবিকে সাধারণ JPG ফরম্যাটে রূপান্তর করুন এবং স্বচ্ছ ব্যাকগ্রাউন্ডে পছন্দের রঙ বসান।',
        keywords: ["পিএনজি থেকে জেপিজি","সাদা ব্যাকগ্রাউন্ড ছবি","png to jpg বাংলা","পিএনজি ছবি রূপান্তর","png to jpeg"],
        seo: {
          title: 'অনলাইন PNG থেকে JPG কনভার্টার — Ahadex Tools',
          description: 'PNG ছবি সহজে JPG তে রূপান্তর করুন। স্বচ্ছ অংশের জন্য সাদা বা কাস্টম ব্যাকগ্রাউন্ড সিলেক্ট করুন বিনামূল্যে।',
          h1: 'PNG থেকে JPG রূপান্তর',
        },
        content: {
          intro: 'ফাইলের সাইজ ছোট করতে এবং সব প্ল্যাটফর্মে সহজে শেয়ার করার জন্য PNG ছবিকে নিখুঁত JPG তে রূপান্তর করুন।',
          howToUse: [
            'আপনার PNG ছবিটি নির্বাচন করুন।',
            'স্বচ্ছ অংশের জন্য সাদা, কালো বা পছন্দের রঙ বেছে নিন।',
            '"JPG তে রূপান্তর করুন" বাটনে ক্লিক করে ছবিটি ডাউনলোড করুন।',
          ],
          privacy: 'ছবি আপনার ব্রাউজারেই কনভার্ট হয়, কোনো সার্ভার আপলোড ছাড়া।',
          limitations: 'JPG তে স্বচ্ছতা থাকে না, তাই ব্যাকগ্রাউন্ড রঙ অপরিহার্য।',
          faq: [
            {
              question: 'স্বচ্ছ ব্যাকগ্রাউন্ড কি কালো হয়ে যাবে?',
              answer: 'না, আমাদের টুলে আপনি সাদা বা যেকোনো কাস্টম রঙ বেছে নিতে পারেন।',
            },
            {
              question: 'ফাইলের সাইজ কি কমবে?',
              answer: 'হ্যাঁ, JPG ফরম্যাটে ফাইল সাইজ উল্লেখযোগ্য পরিমাণে ছোট হয়ে যায়।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['jpg-to-png', 'webp-to-jpg', 'heic-to-jpg', 'image-compressor'],
  },
  {
    id: 'webp-to-jpg',
    slug: 'webp-to-jpg',
    name: 'WebP to JPG',
    description: 'Convert modern Google WebP images into universally compatible standard JPG format.',
    category: 'Images',
    status: 'live',
    color: '160 84% 39%',
    icon: Image,
    route: '/tool/webp-to-jpg',
    browserProcessing: true,
    keywords: ['webp to jpg', 'webp to jpeg', 'convert webp', 'save webp as jpg'],
    seo: {
      title: 'WebP to JPG Converter — Ahadex Tools',
      description: 'Convert WebP images downloaded from websites into standard JPG photos. Fast, free, and processed 100% in your browser.',
      h1: 'WebP to JPG Converter',
      canonical: '/tool/webp-to-jpg',
    },
    content: {
      intro: 'Turn modern web images (.webp) saved from online stores and websites into standard JPG images that open in any photo editor or legacy software.',
      howToUse: [
        'Select or drag & drop your WebP image file.',
        'Adjust the JPG compression quality if needed.',
        'Click "Convert to JPG" and download your ready image.',
      ],
      privacy: 'Your WebP image is rendered on a local browser canvas. Files never leave your computer or phone.',
      limitations: 'Animated WebP files are converted using their first frame.',
      faq: [
        {
          question: 'Why do websites save images as WebP?',
          answer: 'WebP offers high web compression, but many older programs and desktop editors cannot open it. Converting to JPG solves compatibility.',
        },
        {
          question: 'Does this converter cost anything?',
          answer: 'No, it is completely free and works unlimited times with no signup.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'WebP থেকে JPG কনভার্টার',
        description: 'ইন্টারনেট থেকে ডাউনলোড করা WebP ছবিকে সহজে যেকোনো ডিভাইসে ওপেনযোগ্য সাধারণ JPG তে রূপান্তর করুন।',
        keywords: ["ওয়েবপি থেকে জেপিজি","webp to jpg বাংলা","webp ছবি রূপান্তর","ওয়েবপি কনভার্ট","webp to jpeg"],
        seo: {
          title: 'অনলাইন WebP থেকে JPG কনভার্টার — Ahadex Tools',
          description: 'ওয়েবসাইটের WebP ছবিকে সাধারণ JPG তে রূপান্তর করুন মুহূর্তেই, বিনামূল্যে ও কোনো ফাইল আপলোড ছাড়াই।',
          h1: 'WebP থেকে JPG ছবি রূপান্তর',
        },
        content: {
          intro: 'বিভিন্ন ওয়েবসাইট ও সোশ্যাল মিডিয়ার WebP ফাইলকে সাধারণ JPG ছবিতে পরিণত করুন যাতে যেকোনো ডিভাইসে খোলা যায়।',
          howToUse: [
            'আপনার WebP ছবিটি নির্বাচন করুন।',
            'কোয়ালিটি স্লাইডার চেক করে নিন।',
            '"JPG তে রূপান্তর করুন" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করুন।',
          ],
          privacy: 'সব প্রসেসিং আপনার ব্রাউজারে লোকাল মেমরিতে সম্পন্ন হয়।',
          limitations: 'অ্যানিমেটেড WebP ফাইলের ক্ষেত্রে প্রথম ফ্রেমটি রূপান্তরিত হয়।',
          faq: [
            {
              question: 'কেন WebP ছবিকে JPG তে রূপান্তর করতে হয়?',
              answer: 'অনেক ফটো এডিটর ও পুরোনো কম্পিউটার সিস্টেমে WebP সরাসরি ওপেন হয় না, JPG সব জায়গায় চলে।',
            },
            {
              question: 'ছবির স্পষ্টতা কি কমবে?',
              answer: 'না, উচ্চমানের রেজোলিউশন বজায় রেখেই JPG তৈরি হয়।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['jpg-to-png', 'png-to-jpg', 'heic-to-jpg', 'image-resizer'],
  },
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert mixed JPG, PNG, and WebP images into a single standardized PDF document.',
    category: 'Documents',
    status: 'live',
    color: '280 68% 60%',
    icon: FileText,
    route: '/tool/image-to-pdf',
    browserProcessing: true,
    keywords: ['image to pdf', 'photos to pdf', 'convert pictures to pdf', 'png and jpg to pdf'],
    seo: {
      title: 'Image to PDF Converter — Ahadex Tools',
      description: 'Combine multiple JPG, PNG, and WebP photos into one organized PDF document. Reorder pages and customize margins free online.',
      h1: 'Image to PDF Converter',
      canonical: '/tool/image-to-pdf',
    },
    content: {
      intro: 'Merge multiple mixed-format images into a professional, shareable PDF document with custom page layouts, margins, and automatic orientation detection.',
      howToUse: [
        'Select or drag & drop multiple JPG, PNG, or WebP images.',
        'Reorder photos using the arrow buttons and select your page size (A4, Letter, Fit).',
        'Click "Convert All to PDF" and download your combined document.',
      ],
      privacy: 'Images are drawn to canvas and embedded into PDF bytes directly on your device. Zero cloud uploads.',
      limitations: 'Very large collections (100+ high-res images) may take a few seconds to compile in browser memory.',
      faq: [
        {
          question: 'Can I mix JPG and PNG files in the same PDF?',
          answer: 'Yes! Our tool effortlessly accepts mixed JPG, PNG, and WebP pictures and combines them into one seamless PDF.',
        },
        {
          question: 'Will my pictures stretch or distort?',
          answer: 'No. The converter precisely calculates original aspect ratios and centers images neatly on each page without stretching.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'ছবি থেকে PDF কনভার্টার',
        description: 'যেকোনো JPG, PNG ও WebP ছবিকে একত্রে যুক্ত করে একটি সুন্দর PDF ডকুমেন্ট তৈরি করুন।',
        keywords: ["ছবি দিয়ে পিডিএফ","একাধিক ছবি পিডিএফ","ফটো টু পিডিএফ","গ্যালারির ছবি পিডিএফ","ছবি দিয়ে ফাইল বানান","image to pdf bangla"],
        seo: {
          title: 'অনলাইন ছবি থেকে PDF কনভার্টার — Ahadex Tools',
          description: 'একাধিক ছবি নির্বাচন করে পেজের মাপ ঠিক রেখে সহজে একটি গোছানো PDF ডকুমেন্ট তৈরি করুন সম্পূর্ণ বিনামূল্যে।',
          h1: 'ছবি থেকে PDF ডকুমেন্ট তৈরি',
        },
        content: {
          intro: 'বিভিন্ন ফরম্যাটের ছবিগুলোকে কোনো ঝামেলা ছাড়াই একটি সুশৃঙ্খল PDF ফাইলে রূপান্তর করে শেয়ার করুন।',
          howToUse: [
            'আপনার প্রয়োজনীয় ছবিগুলো একসাথে নির্বাচন করুন।',
            'ছবির ক্রম ঠিক করুন এবং পেজ সাইজ নির্ধারণ করুন।',
            '"PDF তৈরি করুন" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করে নিন।',
          ],
          privacy: 'আপনার ছবি সম্পূর্ণ ডিভাইসের মেমরিতে প্রসেস হয়, কোনো সার্ভারে যায় না।',
          limitations: 'যেকোনো জনপ্রিয় ইমেজ ফরম্যাট সাপোর্টেড।',
          faq: [
            {
              question: 'ছবি কি বাঁকা বা টেনে লম্বা হয়ে যাবে?',
              answer: 'না, প্রতিটি ছবির আসল অনুপাত বজায় রেখে পেজের মাঝে নিখুঁতভাবে বসানো হয়।',
            },
            {
              question: 'একাধিক ফরম্যাট একসাথে দেওয়া যাবে?',
              answer: 'হ্যাঁ, JPG, PNG ও WebP ছবি একসাথে একই ফাইলে দেওয়া যায়।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['jpg-to-pdf', 'merge-pdf', 'image-compressor', 'jpg-to-png'],
  },
  {
    id: 'background-remover',
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Remove background from photos and create transparent PNGs or passport blue ID backgrounds.',
    category: 'Images',
    status: 'live',
    color: '326 100% 74%',
    icon: Wand2,
    route: '/tool/background-remover',
    browserProcessing: true,
    keywords: ['remove background', 'background remover free', 'transparent png maker', 'passport photo blue background'],
    seo: {
      title: 'Free Background Remover Online — Ahadex Tools',
      description: 'Remove background from images free online. Create transparent PNGs or official passport blue backgrounds with zero server uploads.',
      h1: 'Free Online Background Remover',
      canonical: '/tool/background-remover',
    },
    content: {
      intro: 'Isolate subjects and cleanly remove distracting photo backgrounds to produce transparent product shots or official blue/white identification photos.',
      howToUse: [
        'Upload your photo (JPG, PNG, or WebP).',
        'Select your desired background output: Transparent, White, or Passport Blue.',
        'Adjust the edge sensitivity if needed, click "Remove Background", and download your clean PNG.',
      ],
      privacy: 'All pixel analysis and alpha masking execute locally on your browser canvas. Your private photos are never sent to external servers.',
      limitations: 'Works best on images with clear contrast between the subject and the background.',
      faq: [
        {
          question: 'Is this background remover really 100% free without paywalls?',
          answer: 'Yes! Unlike commercial services that charge per download, Ahadex Tools processes entirely inside your browser for free.',
        },
        {
          question: 'Can I create official passport photos with blue backgrounds?',
          answer: 'Yes, simply select the "Passport Blue" option to instantly composite your portrait onto an official blue backdrop.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'ব্যাকগ্রাউন্ড রিমুভার',
        description: 'ছবির ব্যাকগ্রাউন্ড অপসারণ করে স্বচ্ছ পিএনজি অথবা পাসপোর্ট সাইজ নীল ব্যাকগ্রাউন্ড তৈরি করুন।',
        keywords: ["ছবির ব্যাকগ্রাউন্ড রিমুভ","ব্যাকগ্রাউন্ড মুছে ফেলা","পাসপোর্ট ছবি নীল ব্যাকগ্রাউন্ড","ট্রান্সপারেন্ট পিএনজি","ছবির পেছনের ব্যাকগ্রাউন্ড পরিবর্তন","সাদা ব্যাকগ্রাউন্ড ছবি","AI ব্যাকগ্রাউন্ড রিমুভার"],
        seo: {
          title: 'অনলাইন ব্যাকগ্রাউন্ড রিমুভার — Ahadex Tools',
          description: 'কোনো পেইড সাবস্ক্রিপশন ছাড়া সরাসরি ব্রাউজারে ছবির ব্যাকগ্রাউন্ড মুছে স্বচ্ছ বা নীল ব্যাকগ্রাউন্ড বানান বিনামূল্যে।',
          h1: 'ছবির ব্যাকগ্রাউন্ড রিমুভার',
        },
        content: {
          intro: 'প্রোডাক্টের ছবি বা ব্যক্তিগত ছবির ব্যাকগ্রাউন্ড সহজে পরিবর্তন করে স্বচ্ছ বা পাসপোর্ট সাইজ নীল ব্যাকগ্রাউন্ড তৈরি করুন।',
          howToUse: [
            'আপনার ছবিটি আপলোড করুন।',
            'পছন্দের ব্যাকগ্রাউন্ড (স্বচ্ছ, সাদা বা নীল) সিলেক্ট করুন।',
            '"ব্যাকগ্রাউন্ড সরান" বাটনে ক্লিক করে ফলাফল দেখুন এবং PNG ডাউনলোড করুন।',
          ],
          privacy: 'ছবি সম্পূর্ণ লোকাল ডিভাইসে প্রসেস হয়, কোনো সার্ভারে আপলোড করা হয় না।',
          limitations: 'সাবজেক্ট এবং ব্যাকগ্রাউন্ডের মধ্যে ভালো কনট্রাস্ট থাকলে সেরা ফলাফল পাওয়া যায়।',
          faq: [
            {
              question: 'পাসপোর্ট ছবির জন্য কি নীল ব্যাকগ্রাউন্ড দেওয়া যাবে?',
              answer: 'হ্যাঁ, "পাসপোর্ট সাইজ নীল" বাটনে এক ক্লিকেই নীল ব্যাকগ্রাউন্ড পেয়ে যাবেন।',
            },
            {
              question: 'ডাউনলোডের জন্য কি টাকা দিতে হবে?',
              answer: 'না, এটি সম্পূর্ণ বিনামূল্যে ও সীমাহীন ব্যবহারযোগ্য।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['image-compressor', 'png-to-jpg', 'image-resizer', 'photo-qr-code'],
  },
  {
    id: 'image-to-text',
    slug: 'image-to-text',
    name: 'Image to Text / OCR',
    description: 'Extract editable text from images and photos using high-accuracy in-browser OCR.',
    category: 'Text',
    status: 'live',
    color: '205 90% 45%',
    icon: ScanText,
    route: '/tool/image-to-text',
    browserProcessing: true,
    keywords: ['image to text', 'ocr online', 'extract text from photo', 'picture to text converter'],
    seo: {
      title: 'Image to Text Converter (OCR) — Ahadex Tools',
      description: 'Extract readable text from photos and screenshots using in-browser OCR. Supports English, Bengali, Hindi, and 100+ languages.',
      h1: 'Image to Text Converter (OCR)',
      canonical: '/tool/image-to-text',
    },
    content: {
      intro: 'Convert photographed documents, book pages, receipts, and screenshots into selectable, editable text with support for English, Bengali, and multiple global scripts.',
      howToUse: [
        'Upload your image containing text (JPG, PNG, or WebP).',
        'Select the primary language of the text (e.g. English, Bengali, Hindi, Spanish).',
        'Click "Extract Text with OCR" and copy to clipboard or download as TXT / Word (.docx).',
      ],
      privacy: 'Optical Character Recognition runs client-side via WebAssembly. Your documents are never uploaded to cloud servers.',
      limitations: 'Text recognition accuracy depends on photo clarity, lighting, and resolution. Blurry or low-resolution images may produce recognition errors.',
      faq: [
        {
          question: 'Does this OCR support Bengali text?',
          answer: 'Yes! Tesseract OCR supports Bengali (বাংলা), English, and mixed bilingual documents with high accuracy.',
        },
        {
          question: 'Can I export the extracted text to Microsoft Word?',
          answer: 'Yes! Click "Download Word" to receive a formatted .docx document immediately.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'ছবি থেকে টেক্সট (OCR)',
        description: 'ছবি ও স্ক্রিনশট থেকে বাংলা ও ইংরেজি টেক্সট স্বয়ংক্রিয়ভাবে পড়ে এডিটেবল লেখায় রূপান্তর করুন।',
        keywords: ["ছবি থেকে লেখা","ছবি থেকে টেক্সট","ছবির লেখা কপি","OCR বাংলা","স্ক্যান করা লেখা","ছবি থেকে টাইপ","ছবি লেখা স্ক্যানার"],
        seo: {
          title: 'অনলাইন ছবি থেকে টেক্সট কনভার্টার (OCR) — Ahadex Tools',
          description: 'বইয়ের পাতা, রসিদ বা ডকুমেন্টের ছবি থেকে বাংলা ও ইংরেজি লেখা নিমেষেই কপি ও ওয়ার্ড ফাইলে ডাউনলোড করুন।',
          h1: 'ছবি থেকে টেক্সট এক্সট্রাক্ট (OCR)',
        },
        content: {
          intro: 'ছবিতে থাকা যেকোনো লেখা টাইপ করার ঝামেলা ছাড়াই স্বয়ংক্রিয় OCR প্রযুক্তির মাধ্যমে সরাসরি এডিটেবল লেখায় রূপান্তর করুন।',
          howToUse: [
            'লেখা থাকা ছবিটি আপলোড করুন।',
            'ছবির ভাষা (বাংলা, ইংরেজি ইত্যাদি) সিলেক্ট করুন।',
            '"টেক্সট এক্সট্রাক্ট করুন" বাটনে ক্লিক করে লেখা কপি করুন অথবা Word (.docx) ফাইল ডাউনলোড করুন।',
          ],
          privacy: 'OCR ইঞ্জিন সরাসরি আপনার ব্রাউজারে চলে, ফাইল কখনো সার্ভারে যায় না।',
          limitations: 'ছবি যত পরিষ্কার এবং স্পষ্ট হবে, লেখার নির্ভুলতা তত বেশি হবে।',
          faq: [
            {
              question: 'বাংলা বইয়ের পাতা কি স্ক্যান করা যাবে?',
              answer: 'হ্যাঁ, বাংলা অপশন সিলেক্ট করলে পরিষ্কার বাংলা লেখা নিখুঁতভাবে শনাক্ত করে।',
            },
            {
              question: 'ওয়ার্ড ফাইলে সেভ করা যাবে?',
              answer: 'হ্যাঁ, এক ক্লিকেই .TXT অথবা .DOCX ফাইল ডাউনলোড করা যায়।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['pdf-to-text', 'word-counter', 'pdf-to-word', 'photo-qr-code'],
  },
  {
    id: 'pdf-page-extractor',
    slug: 'pdf-page-extractor',
    name: 'PDF Page Extractor',
    description: 'View PDF page thumbnails, select specific pages visually, and export to a clean new PDF document.',
    category: 'Documents',
    status: 'live',
    color: '175 84% 32%',
    icon: Layers,
    route: '/tool/pdf-page-extractor',
    browserProcessing: true,
    keywords: ['pdf page extractor', 'extract pages from pdf', 'select pdf pages', 'save specific pdf pages'],
    seo: {
      title: 'PDF Page Extractor — Ahadex Tools',
      description: 'View page thumbnails and visually select specific pages from a PDF to export into a new document. 100% private in-browser tool.',
      h1: 'PDF Page Extractor',
      canonical: '/tool/pdf-page-extractor',
    },
    content: {
      intro: 'Browse visual thumbnails of every page in your PDF document, click to select the exact pages you want, and generate a new custom PDF document in seconds.',
      howToUse: [
        'Upload your PDF document.',
        'Click on the visual page thumbnails to select or deselect pages.',
        'Click "Extract Selected Pages to PDF" and download your newly created document.',
      ],
      privacy: 'Thumbnails and extracted PDFs are compiled locally in browser memory without sending data to servers.',
      limitations: 'For huge PDFs over 100 pages, the first 100 thumbnails are previewed visually for optimal memory performance.',
      faq: [
        {
          question: 'How is this different from Split PDF?',
          answer: 'Split PDF requires typing page numbers (e.g. 1-3), while Page Extractor lets you see visual thumbnails and click to select pages directly.',
        },
        {
          question: 'Are extracted pages re-compressed or altered?',
          answer: 'No. Original vector fidelity and fonts are preserved identically.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'PDF পৃষ্ঠা এক্সট্রাক্টর',
        description: 'PDF এর প্রতিটি পৃষ্ঠার ছবি দেখে পছন্দমতো পেজ সিলেক্ট করে নতুন PDF বানান।',
        keywords: ["পিডিএফ পেজ এক্সট্র্যাক্ট","পিডিএফ থেকে নির্দিষ্ট পাতা আলাদা","পিডিএফ পেজ সংরক্ষণ","পিডিএফ পৃষ্ঠা নির্বাচন","পিডিএফ পেজ বের করা"],
        seo: {
          title: 'অনলাইন PDF পৃষ্ঠা এক্সট্রাক্টর — Ahadex Tools',
          description: 'থাম্বনেইল দেখে এক ক্লিকে প্রয়োজনীয় পৃষ্ঠাগুলো বেছে নিয়ে নতুন PDF তৈরি ও ডাউনলোড করুন সম্পূর্ণ বিনামূল্যে।',
          h1: 'PDF পৃষ্ঠা এক্সট্রাক্টর',
        },
        content: {
          intro: 'পেজ নম্বর মুখস্থ না রেখে সরাসরি প্রতিটি পৃষ্ঠার ছবি দেখে দেখে প্রয়োজনীয় পৃষ্ঠাগুলো আলাদা ফাইলে রূপান্তর করুন।',
          howToUse: [
            'আপনার PDF ফাইল আপলোড করুন।',
            'প্রদর্শিত থাম্বনেইলগুলোর ওপর ক্লিক করে কাঙ্ক্ষিত পৃষ্ঠাগুলো নির্বাচন করুন।',
            '"নির্বাচিত পৃষ্ঠা দিয়ে নতুন PDF বানান" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করুন।',
          ],
          privacy: 'সম্পূর্ণ প্রক্রিয়াটি আপনার নিজস্ব ডিভাইসের ব্রাউজারে সম্পন্ন হয়।',
          limitations: 'বড় ফাইলের ক্ষেত্রে মেমরি সেভ রাখতে ১০০টি পেজ পর্যন্ত থাম্বনেইল দেখানো হয়।',
          faq: [
            {
              question: 'একাধিক পেজ কীভাবে সিলেক্ট করব?',
              answer: 'প্রতিটি পেজের ওপর ক্লিক করলেই টিক চিহ্ন উঠবে এবং সিলেক্ট হয়ে যাবে।',
            },
            {
              question: 'ফাইলের কোয়ালিটি কি ঠিক থাকবে?',
              answer: 'হ্যাঁ, মূল ফাইলের টেক্সট ও ছবি হুবহু অক্ষত থাকবে।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['split-pdf', 'pdf-rotate', 'merge-pdf', 'pdf-to-jpg'],
  },
  {
    id: 'pdf-rotate',
    slug: 'pdf-rotate',
    name: 'PDF Rotate',
    description: 'Permanently rotate upside down or sideways PDF pages by 90°, 180°, or 270° degrees.',
    category: 'Documents',
    status: 'live',
    color: '200 98% 39%',
    icon: RotateCw,
    route: '/tool/pdf-rotate',
    browserProcessing: true,
    keywords: ['rotate pdf', 'fix upside down pdf', 'rotate pdf 90 degrees', 'rotate pdf online free'],
    seo: {
      title: 'Rotate PDF Online — Ahadex Tools',
      description: 'Rotate individual pages or all pages of a PDF document by 90, 180, or 270 degrees. Fast, free, and completely client-side.',
      h1: 'Rotate PDF Pages Online',
      canonical: '/tool/pdf-rotate',
    },
    content: {
      intro: 'Fix upside down or sideways scanned documents permanently by rotating individual pages or all pages simultaneously with real-time visual feedback.',
      howToUse: [
        'Select or drag & drop your PDF file.',
        'Rotate individual pages using the +90° buttons or click "Rotate All" to turn the entire document.',
        'Click "Save Rotated PDF" to download your permanently corrected document.',
      ],
      privacy: 'Orientation metadata is updated directly inside your browser. No files are uploaded to any server.',
      limitations: 'Changes are applied to the orientation tag of the PDF; original content is preserved without degradation.',
      faq: [
        {
          question: 'Will the rotation be permanent when I open the PDF on other devices?',
          answer: 'Yes! The rotation angle is permanently embedded into the PDF structure, ensuring it displays correctly on all phones and computers.',
        },
        {
          question: 'Can I rotate just one upside-down page?',
          answer: 'Yes! Every page has its own individual rotate button so you can rotate only the specific pages that need fixing.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'রোটেট PDF',
        description: 'উল্টো বা বাঁকা হয়ে স্ক্যান হওয়া PDF পেজকে ৯০°, ১৮০° বা ২৭০° কোণে ঘুরিয়ে ঠিক করুন।',
        keywords: ["পিডিএফ ঘোরান","উল্টো পিডিএফ সোজা","পিডিএফ রোটেট","pdf rotate 90","পিডিএফ পৃষ্ঠা ঘোরানো","পিডিএফ সোজা করা"],
        seo: {
          title: 'অনলাইন রোটেট PDF — Ahadex Tools',
          description: 'PDF ডকুমেন্টের একক পেজ বা সব পেজ ঘুরিয়ে স্থায়ীভাবে সোজা করুন সম্পূর্ণ বিনামূল্যে ও নিরাপদে।',
          h1: 'PDF পৃষ্ঠা ঘোরান ও সোজা করুন',
        },
        content: {
          intro: 'স্ক্যান করার সময় উল্টো হওয়া ডকুমেন্টকে এক ক্লিকে ঘুরিয়ে স্থায়ীভাবে সোজা করে সেভ করুন।',
          howToUse: [
            'আপনার PDF ফাইলটি সিলেক্ট করুন।',
            'নির্দিষ্ট পৃষ্ঠার নিচে থাকা বাটন দিয়ে অথবা "সবগুলো ঘুরান" বাটন দিয়ে সোজা করুন।',
            '"ঘোরানো PDF সেভ করুন" বাটনে ক্লিক করে ফাইলটি ডাউনলোড করে নিন।',
          ],
          privacy: 'সব প্রসেসিং আপনার ব্রাউজারে হয়, কোনো ক্লাউড সার্ভারে যায় না।',
          limitations: 'মূল ডকুমেন্টের ভেতরের কোনো লেখা বা ছবির মান পরিবর্তন হয় না।',
          faq: [
            {
              question: 'অন্য ডিভাইসে ওপেন করলেও কি সোজা দেখাবে?',
              answer: 'হ্যাঁ, নতুন ফাইলে অ্যাঙ্গেল স্থায়ীভাবে সেট হয়ে যায়, তাই সব ডিভাইসেই সোজা থাকবে।',
            },
            {
              question: 'শুধু ১টি পেজ ঘোরানো যাবে?',
              answer: 'হ্যাঁ, যেকোনো একক পৃষ্ঠা আলাদাভাবে ঘোরানো যায়।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['pdf-page-extractor', 'split-pdf', 'merge-pdf', 'compress-pdf'],
  },
  {
    id: 'pdf-to-png',
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    description: 'Convert PDF document pages into high-resolution, lossless PNG images with transparent support.',
    category: 'Documents',
    status: 'live',
    color: '221 83% 53%',
    icon: Image,
    route: '/tool/pdf-to-png',
    browserProcessing: true,
    keywords: ['pdf to png', 'convert pdf to png', 'high resolution pdf to png', 'extract png from pdf'],
    seo: {
      title: 'PDF to PNG Converter — Ahadex Tools',
      description: 'Convert PDF document pages to high-resolution, lossless PNG images. Download individual pages or all pages as a ZIP archive.',
      h1: 'PDF to PNG Converter',
      canonical: '/tool/pdf-to-png',
    },
    content: {
      intro: 'Convert PDF pages into ultra-crisp, lossless PNG images preserving sharp vector typography, lines, diagrams, and transparent layers.',
      howToUse: [
        'Upload your PDF file.',
        'Select resolution quality (Standard, Retina 2x, or 300 DPI Ultra).',
        'Click "Convert All Pages to PNG" and download individual PNGs or all as a ZIP.',
      ],
      privacy: 'Pages are rendered locally using PDF.js and Canvas APIs with zero server latency or data sharing.',
      limitations: 'Lossless PNG images are larger in file size than lossy JPGs because they preserve perfect pixel-level clarity.',
      faq: [
        {
          question: 'Why choose PNG instead of JPG for PDF conversion?',
          answer: 'PNG uses lossless compression, meaning text, diagrams, and logos remain razor-sharp without JPEG compression artifacts.',
        },
        {
          question: 'Can I download all pages as a single ZIP file?',
          answer: 'Yes! Click "Download All as ZIP" to get every page neatly packaged and numbered.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'PDF থেকে PNG কনভার্টার',
        description: 'PDF পৃষ্ঠাকে উচ্চ রেজোলিউশনের ক্রিস্প ও লসলেস PNG ছবিতে রূপান্তর করুন।',
        keywords: ["পিডিএফ থেকে পিএনজি","হাই কোয়ালিটি পিডিএফ ছবি","pdf to png বাংলা","পিডিএফ পিএনজি তৈরি","পিডিএফ ইমেজ এক্সট্র্যাক্ট"],
        seo: {
          title: 'অনলাইন PDF থেকে PNG কনভার্টার — Ahadex Tools',
          description: 'ডকুমেন্ট ও ডায়াগ্রামের শার্পনেস অক্ষুণ্ণ রেখে PDF থেকে হাই-কোয়ালিটি PNG ছবি তৈরি ও ডাউনলোড করুন।',
          h1: 'PDF থেকে PNG কনভার্টার',
        },
        content: {
          intro: 'ডকুমেন্টের চার্ট, ডায়াগ্রাম ও টেক্সটকে বিন্দুমাত্র কোয়ালিটি লস ছাড়া ঝকঝকে PNG ছবিতে রূপান্তর করুন।',
          howToUse: [
            'আপনার PDF ফাইল আপলোড করুন।',
            'প্রয়োজনে রেজোলিউশন (স্ট্যান্ডার্ড বা রেটিনা ২x) নির্ধারণ করুন।',
            '"PNG ছবিতে রূপান্তর করুন" বাটনে ক্লিক করে একক বা জিপ ফাইল ডাউনলোড করুন।',
          ],
          privacy: 'সম্পূর্ণ কনভার্শন আপনার ব্রাউজার মেমরিতে স্থানীয়ভাবে সম্পন্ন হয়।',
          limitations: 'লসলেস কোয়ালিটি হওয়ায় PNG ছবির ফাইলের আকার JPG-এর চেয়ে কিছুটা বড় হতে পারে।',
          faq: [
            {
              question: 'লেখা ও লাইনগুলো কি স্পষ্ট থাকবে?',
              answer: 'হ্যাঁ, PNG ফরম্যাটে কোনো আর্টফ্যাক্ট তৈরি হয় না, তাই টেক্সট অতি স্পষ্ট থাকে।',
            },
            {
              question: 'সবগুলো পেজ একসাথে জিপে পাওয়া যাবে?',
              answer: 'হ্যাঁ, এক ক্লিকেই সব পেজ জিপ ফাইলে ডাউনলোড করা সম্ভব।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['pdf-to-jpg', 'pdf-to-text', 'jpg-to-pdf', 'merge-pdf'],
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, cryptographically secure passwords locally in your browser with custom rules.',
    category: 'Developer',
    status: 'live',
    color: '16 100% 50%',
    icon: KeyRound,
    route: '/tool/password-generator',
    browserProcessing: true,
    keywords: ['password generator', 'strong password maker', 'secure password generator', 'random password'],
    seo: {
      title: 'Strong Password Generator — Ahadex Tools',
      description: 'Generate strong, cryptographically secure random passwords in your browser. 100% local using Web Crypto API with strength meter.',
      h1: 'Strong Password Generator',
      canonical: '/tool/password-generator',
    },
    content: {
      intro: 'Create uncrackable, cryptographically secure random passwords using your browser\'s native Web Crypto API with customizable length, symbols, and batch generation.',
      howToUse: [
        'Adjust the password length slider (6 to 64 characters).',
        'Toggle desired character sets (Uppercase, Lowercase, Numbers, Symbols).',
        'Click the copy button to copy the password instantly to your clipboard.',
      ],
      privacy: 'Passwords are generated exclusively in your browser using crypto.getRandomValues(). No passwords are ever stored or sent over the internet.',
      limitations: 'Never share your master passwords or write them in unprotected plaintext documents.',
      faq: [
        {
          question: 'How secure are the generated passwords?',
          answer: 'Extremely secure. They use the browser\'s cryptographically secure pseudo-random number generator (CSPRNG), not weak Math.random().',
        },
        {
          question: 'Can I generate multiple passwords at once?',
          answer: 'Yes! Choose the Batch Quantity option (up to 10) to generate multiple passwords simultaneously.',
        },
      ],
    },
    localized: {
      bn: {
        name: 'পাসওয়ার্ড জেনারেটর',
        description: 'ক্রিপ্টোগ্রাফিক নিরাপত্তাসহ অত্যন্ত শক্তিশালী ও ইউনিক পাসওয়ার্ড তৈরি করুন সরাসরি ব্রাউজারে।',
        keywords: ["পাসওয়ার্ড জেনারেটর","শক্তিশালী পাসওয়ার্ড তৈরি","পাসওয়ার্ড বানান","র‍্যান্ডম পাসওয়ার্ড","স্ট্রং পাসওয়ার্ড","পাসওয়ার্ড তৈরির সফটওয়্যার"],
        seo: {
          title: 'অনলাইন শক্তিশালী পাসওয়ার্ড জেনারেটর — Ahadex Tools',
          description: 'সম্পূর্ণ নিরাপদ ও হ্যাক-প্রুফ র‍্যান্ডম পাসওয়ার্ড তৈরি করুন ওয়েব ক্রিপ্টো এপিআই দিয়ে শতভাগ গোপনে।',
          h1: 'নিরাপদ পাসওয়ার্ড জেনারেটর',
        },
        content: {
          intro: 'সোশ্যাল মিডিয়া, ইমেইল ও ব্যাংকিং অ্যাকাউন্টের সুরক্ষায় অত্যন্ত শক্তিশালী ও অনুমান-অসম্ভব পাসওয়ার্ড তৈরি করুন।',
          howToUse: [
            'পাসওয়ার্ডের দৈর্ঘ্য (যেমন ১৬ বা ২০ অক্ষর) নির্ধারণ করুন।',
            'প্রতীক, সংখ্যা ও বড় হাতের অক্ষরের রুলস সিলেক্ট করুন।',
            'কপি বাটনে ক্লিক করে সাথে সাথে নিরাপদ পাসওয়ার্ড ব্যবহার করুন।',
          ],
          privacy: 'পাসওয়ার্ড আপনার ব্রাউজারের ক্রিপ্টো ইঞ্জিনে তৈরি হয়, কোনো সার্ভার এটি দেখতে পায় না।',
          limitations: 'গুরুত্বপূর্ণ পাসওয়ার্ড সুরক্ষিত পাসওয়ার্ড ম্যানেজারে সংরক্ষণ করুন।',
          faq: [
            {
              question: 'এই পাসওয়ার্ডগুলো কি সত্যিই নিরাপদ?',
              answer: 'হ্যাঁ, এতে ক্রিপ্টোগ্রাফিক CSPRNG অ্যালগরিদম ব্যবহৃত হয় যা সাধারণ পদ্ধতিতে ক্র্যাক করা অসম্ভব।',
            },
            {
              question: 'একসাথে একাধিক পাসওয়ার্ড তৈরি করা যাবে?',
              answer: 'হ্যাঁ, একসাথে সর্বোচ্চ ১০টি পর্যন্ত পাসওয়ার্ড তৈরি করে তালিকা থেকে পছন্দ করতে পারেন।',
            },
          ],
        },
      },
    },
    relatedToolIds: ['color-picker', 'format-json', 'word-counter'],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getLocalizedTool(tool: ToolDefinition, language: 'en' | 'bn'): ToolDefinition {
  if (language !== 'bn' || !tool.localized?.bn) {
    return tool;
  }
  const bn = tool.localized.bn;
  return {
    ...tool,
    name: bn.name || tool.name,
    description: bn.description || tool.description,
    keywords: bn.keywords ? [...tool.keywords, ...bn.keywords] : tool.keywords,
    seo: {
      ...tool.seo,
      title: bn.seo?.title || tool.seo.title,
      description: bn.seo?.description || tool.seo.description,
      h1: bn.seo?.h1 || tool.seo.h1,
      canonical: bn.seo?.canonical || tool.seo.canonical,
    },
    content: {
      ...tool.content,
      intro: bn.content?.intro || tool.content.intro,
      howToUse: bn.content?.howToUse || tool.content.howToUse,
      privacy: bn.content?.privacy || tool.content.privacy,
      limitations: bn.content?.limitations || tool.content.limitations,
      faq: bn.content?.faq || tool.content.faq,
    },
  };
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
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
