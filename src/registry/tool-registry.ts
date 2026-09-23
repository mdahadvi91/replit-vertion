import {
  Braces,
  FileArchive,
  FileText,
  Image,
  Palette,
  QrCode,
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
    localized: {
      bn: {
        name: 'পিডিএফ টু টেক্সট',
        description: 'পিডিএফ ফাইল থেকে পরিষ্কার ও কপিযোগ্য টেক্সট নিষ্কাশন করুন কয়েক সেকেন্ডে।',
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
          privacy: 'সম্পূর্ণ প্রসেসিং আপনার ব্রাউজারের ভেতর মেমরিতে ঘটে। কোনো ফাইল বা মেটাডাটা ইন্টারনেটে পাঠানো হয় না।',
          limitations: 'শুধুমাত্র ডিজিটাল টেক্সট থাকা পিডিএফ থেকে সরাসরি টেক্সট বের হয়। স্ক্যান করা ছবির ক্ষেত্রে ফলাফল সীমিত হতে পারে।',
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
