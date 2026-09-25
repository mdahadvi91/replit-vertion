// Prerender data containing complete content for all tools, categories, and static pages
// Used by scripts/prerender.mjs to generate rich static HTML for crawlers and initial page load

export const BASE_URL = 'https://ahadex.online';

export const categories = {
  images: {
    id: 'images',
    name: 'Images',
    slug: 'images',
    en: {
      title: 'Free Image Tools Online — Ahadex Tools',
      description: 'Compress, convert, resize, and add QR watermarks to images directly in your browser. 100% private, client-side image processing.',
      h1: 'Online Image Processing Tools',
      intro: 'A complete suite of fast, privacy-focused image tools. Optimize photo dimensions, reduce file size without quality loss, convert formats, or overlay scannable QR code badges—all running locally in your browser memory without uploading pictures to remote servers.',
    },
    bn: {
      title: 'অনলাইন ছবি ও ইমেজ টুলস — Ahadex Tools',
      description: 'ব্রাউজারেই ছবির সাইজ কমান, ফরম্যাট পরিবর্তন করুন, রিসাইজ করুন এবং কিউআর কোড ব্যাজ যুক্ত করুন সম্পূর্ণ বিনামূল্যে ও নিরাপদে।',
      h1: 'অনলাইন ইমেজ প্রসেসিং টুলস',
      intro: 'ছবির সাইজ অপ্টিমাইজেশন, জেপিজি থেকে পিএনজি কনভার্শন, সঠিক মাপে রিসাইজ এবং কিউআর কোড ওয়াটারমার্ক ব্যাজ তৈরির জন্য সম্পূর্ণ প্রাইভেট টুলস। কোনো সার্ভারে ছবি আপলোড না করেই আপনার ডিভাইসের মেমরিতে নিমিষেই কাজ সম্পন্ন হয়।',
    },
  },
  documents: {
    id: 'documents',
    name: 'Documents',
    slug: 'documents',
    en: {
      title: 'Free PDF & Document Tools Online — Ahadex Tools',
      description: 'Extract text from PDFs, combine multiple PDF documents, and organize files in your browser. Zero uploads, 100% secure.',
      h1: 'PDF & Document Processing Tools',
      intro: 'Handle confidential contracts, research papers, reports, and books without uploading document bytes to unknown cloud servers. Everything processes inside your browser memory with client-side WebAssembly and PDF engines.',
    },
    bn: {
      title: 'অনলাইন পিডিএফ ও ডকুমেন্ট টুলস — Ahadex Tools',
      description: 'পিডিএফ থেকে টেক্সট বের করুন এবং একাধিক পিডিএফ একত্রিত করুন বিনামূল্যে কোনো সার্ভার আপলোড ছাড়াই।',
      h1: 'পিডিএফ ও ডকুমেন্ট প্রসেসিং টুলস',
      intro: 'আপনার ব্যক্তিগত ও অফিসের গুরুত্বপূর্ণ নথিপত্র সম্পূর্ণ নিরাপদে প্রসেস করুন। কোনো সার্ভারে ফাইল পাঠানো ছাড়া ব্রাউজারেই সরাসরি পিডিএফ মার্জ এবং টেক্সট এক্সট্রাক্ট করুন।',
    },
  },
  text: {
    id: 'text',
    name: 'Text',
    slug: 'text',
    en: {
      title: 'Free Text & Writing Tools Online — Ahadex Tools',
      description: 'Count words, characters, sentences, paragraphs, and reading time in real-time. Full support for English and Bengali Unicode scripts.',
      h1: 'Text & Writing Utility Tools',
      intro: 'Fast, accurate writing analytics for authors, students, bloggers, and translators. Instant statistics with zero tracking or latency.',
    },
    bn: {
      title: 'অনলাইন টেক্সট ও লেখার টুলস — Ahadex Tools',
      description: 'রিয়েল-টাইমে শব্দ, অক্ষর, বাক্য ও পড়ার সময় গণনা করুন। বাংলা ও ইংরেজি উভয়ের জন্য শতভাগ সঠিক ফলাফল।',
      h1: 'টেক্সট ও লেখার ইউটিলিটি টুলস',
      intro: 'লেখক, শিক্ষার্থী ও সাংবাদিকদের জন্য দ্রুত ও নির্ভুল লেখার পরিসংখ্যান। আপনার কনটেন্ট কোনো ডাটাবেজে সংরক্ষণ না করে রিয়েল-টাইমে গণনা প্রদর্শন করে।',
    },
  },
  developer: {
    id: 'developer',
    name: 'Developer',
    slug: 'developer',
    en: {
      title: 'Free Developer & Coding Tools Online — Ahadex Tools',
      description: 'Format and validate JSON, pick colors, inspect hex/rgb/hsl values, and copy Tailwind CSS classes online with zero network overhead.',
      h1: 'Developer Utilities & Code Formatters',
      intro: 'Handcrafted utilities built for web developers and designers. Validate and prettify tangled JSON payloads, inspect CSS color palettes, and copy ready-to-use variables instantly.',
    },
    bn: {
      title: 'ডেভেলপার ও কোডিং টুলস — Ahadex Tools',
      description: 'JSON ফরম্যাট ও ভ্যালিডেট করুন, কালার কোড ও প্যালেট তৈরি করুন সম্পূর্ণ ক্লায়েন্ট-সাইড প্রসেসিংয়ের মাধ্যমে।',
      h1: 'ডেভেলপার ও কোডিং ইউটিলিটি টুলস',
      intro: 'প্রোগ্রামার ও ওয়েব ডিজাইনারদের দৈনন্দিন কাজের জন্য দ্রুতগতির টুলস। কনফিগারেশন বা এপিআই ডেটা নেটওয়ার্কে না পাঠিয়ে ব্রাউজারেই নির্ভুলভাবে প্রসেস করুন।',
    },
  },
};

export const toolsData = [
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    category: 'images',
    categoryName: 'Images',
    en: {
      name: 'Image Compressor',
      title: 'Image Compressor — Ahadex Tools',
      description: 'Compress JPG, PNG and WebP images in your browser with clear settings, honest limits and a real downloadable result.',
      h1: 'Image Compressor',
      intro: 'Make an image smaller for a website, message or upload without sending it to an unknown queue. Shrink image files without turning crisp details into mush.',
      howToUse: [
        'Choose a JPG, PNG or WebP image up to 20 MB from your device.',
        'Pick a compression profile (Light, Balanced, or Maximum Saving) that matches the quality you need.',
        'Process the image and download the finished file immediately with clear before/after size stats.',
      ],
      privacy: 'Your image is processed locally with browser Canvas APIs. It is not uploaded to an Ahadex server, and the temporary download URL is released when you reset the workspace or leave the page.',
      limitations: 'The tool preserves the source format. PNG files may not get smaller when their pixels are already highly optimized, and important images should still be checked after compression.',
      faq: [
        {
          question: 'Are my images uploaded to any server?',
          answer: 'No. This tool processes the image in your browser using HTML5 Canvas. The current implementation does not send any image data to an Ahadex server.',
        },
        {
          question: 'Which image formats are supported?',
          answer: 'JPG, JPEG, PNG, and WebP files up to 20 MB are supported with high visual fidelity retention.',
        },
        {
          question: 'Can I convert to WebP during compression?',
          answer: 'Yes! Toggle the Convert to WebP option to achieve up to 80% extra file size reduction while preserving crisp edges.',
        },
      ],
      relatedSlugs: ['jpg-to-png', 'image-resizer', 'photo-qr-code'],
    },
    bn: {
      name: 'ইমেজ কম্প্রেসার',
      title: 'অনলাইন ইমেজ কম্প্রেসার — Ahadex Tools',
      description: 'আপনার ব্রাউজারে JPG, PNG ও WebP ছবি কম্প্রেস করুন সম্পূর্ণ বিনামূল্যে, নিরাপদে ও লোকাল প্রসেসিংয়ের মাধ্যমে।',
      h1: 'ইমেজ কম্প্রেসার',
      intro: 'ওয়েবসাইট, মেসেজ বা সোশ্যাল মিডিয়া আপলোডের জন্য ছবির সাইজ সহজে ছোট করুন কোনো সার্ভারে ফাইল পাঠানো ছাড়াই। ছবির স্পষ্টতা ও কোয়ালিটি বজায় রেখে ফাইলের সাইজ দ্রুত কমান।',
      howToUse: [
        '২০ মেগাবাইট পর্যন্ত JPG, PNG বা WebP ছবি নির্বাচন করুন।',
        'আপনার প্রয়োজনীয় কোয়ালিটি অনুযায়ী কম্প্রেশন প্রোফাইল (লাইট, ব্যালান্সড, ম্যাক্সিমাম) পছন্দ করুন।',
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
        {
          question: 'WebP ফরম্যাটে রূপান্তর করা যাবে কি?',
          answer: 'হ্যাঁ, WebP অপশন অন করে আরো কম সাইজে চমৎকার স্পষ্ট ছবি পাওয়া যায়।',
        },
      ],
      relatedSlugs: ['jpg-to-png', 'image-resizer', 'photo-qr-code'],
    },
  },
  {
    id: 'pdf-to-text',
    slug: 'pdf-to-text',
    category: 'documents',
    categoryName: 'Documents',
    en: {
      name: 'PDF to Text',
      title: 'PDF to Text Converter — Ahadex Tools',
      description: 'Extract readable text and paragraphs from PDF documents in your browser. Fast, private, and 100% free.',
      h1: 'PDF to Text Converter',
      intro: 'Extract clean, copyable text from PDF files directly in your browser without uploading your documents to remote servers. Pull clean, copyable text from a PDF in a few quiet seconds.',
      howToUse: [
        'Select or drag and drop your PDF document into the workspace (up to 25 MB).',
        'Configure language options or enter password if the document is encrypted.',
        'Click the Extract Text button to parse textual streams directly or invoke client-side OCR for scanned pages.',
        'Copy the extracted text to your clipboard or download it as a clean .txt file.',
      ],
      privacy: 'Your document is processed locally inside your browser memory. No document bytes are uploaded to any server. Sensitive financial, legal, and personal files remain strictly on your machine.',
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
          question: 'Does this handle password-protected PDFs?',
          answer: 'Yes! Simply provide the password in the password field to decrypt and extract the contents directly in your browser.',
        },
        {
          question: 'Does OCR support Bengali (বাংলা) and English?',
          answer: 'Yes! Both English and Bengali OCR language packs are supported for scanned paper documents.',
        },
      ],
      relatedSlugs: ['merge-pdf', 'word-counter', 'image-compressor'],
    },
    bn: {
      name: 'পিডিএফ টু টেক্সট',
      title: 'পিডিএফ টু টেক্সট কনভার্টার — Ahadex Tools',
      description: 'ব্রাউজারেই পিডিএফ থেকে টেক্সট বের করুন নিরাপদে ও সম্পূর্ণ বিনামূল্যে। কোনো ফাইল আপলোড প্রয়োজন নেই।',
      h1: 'পিডিএফ টু টেক্সট কনভার্টার',
      intro: 'সার্ভারে ফাইল আপলোড না করেই যেকোনো পিডিএফ ডকুমেন্টের সব টেক্সট নিমিষেই এক্সট্রাক্ট করুন। পিডিএফ ফাইল থেকে পরিষ্কার ও কপিযোগ্য টেক্সট নিষ্কাশন করুন কয়েক সেকেন্ডে।',
      howToUse: [
        'আপনার পিডিএফ ডকুমেন্টটি সিলেক্ট বা ড্র্যাগ অ্যান্ড ড্রপ করুন (সর্বোচ্চ ২৫ মেগাবাইট)।',
        'পাসওয়ার্ড থাকলে পাসওয়ার্ড প্রদান করুন এবং পছন্দমতো ওসিআর ভাষা বেছে নিন।',
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
        {
          question: 'স্ক্যান করা নথিতে কি বাংলা সাপোর্ট করে?',
          answer: 'হ্যাঁ! বাংলা ও ইংরেজি উভয় ভাষার জন্য ইন-ব্রাউজার ওসিআর সুবিধা রয়েছে।',
        },
      ],
      relatedSlugs: ['merge-pdf', 'word-counter', 'image-compressor'],
    },
  },
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    category: 'developer',
    categoryName: 'Developer',
    en: {
      name: 'JSON Formatter',
      title: 'JSON Formatter & Validator — Ahadex Tools',
      description: 'Format, validate, prettify, and minify JSON data online with instant error detection and customizable indentations.',
      h1: 'JSON Formatter & Validator',
      intro: 'Turn tangled JSON into something a human can actually read. Validate, prettify, and minify JSON objects in real time with line-by-line syntax checking and customizable spacing.',
      howToUse: [
        'Paste your raw, messy, or minified JSON into the editor input.',
        'Select your preferred indentation (2 spaces, 4 spaces, or Tab).',
        'Click Format JSON to beautify or Minify to compact into a single line.',
        'Copy the formatted output or download it as a .json file.',
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
          answer: 'It leverages the browser native JSON parsing engine and highlights exact parsing issues with clear diagnostic line and character positions.',
        },
      ],
      relatedSlugs: ['word-counter', 'color-picker'],
    },
    bn: {
      name: 'জেসন ফরম্যাটার',
      title: 'জেসন ফরম্যাটার ও ভ্যালিডেটর — Ahadex Tools',
      description: 'অনলাইনে JSON কোড ফরম্যাট, ভ্যালিডেট, সাজানো বা মিনিফাই করুন তাৎক্ষণিক ত্রুটি শনাক্তকরণ সহ।',
      h1: 'জেসন ফরম্যাটার ও ভ্যালিডেটর',
      intro: 'জটিল ও বিশৃঙ্খল JSON ডেটা সুন্দর, পরিচ্ছন্ন ও পাঠযোগ্য আকারে রূপান্তর করুন। JSON অবজেক্ট রিয়েল-টাইমে সাজান ও সিনট্যাক্স যাচাই করুন কোনো নেটওয়ার্ক রিকোয়েস্ট ছাড়াই।',
      howToUse: [
        'আপনার কাঁচা বা এলোমেলো JSON ডেটা ইনপুট বক্সে পেস্ট করুন।',
        'পছন্দসই স্পেসিং বা ট্যাব ইনডেন্টেশন নির্বাচন করুন (২ স্পেস, ৪ স্পেস ইত্যাদি)।',
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
      relatedSlugs: ['word-counter', 'color-picker'],
    },
  },
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    category: 'documents',
    categoryName: 'Documents',
    en: {
      name: 'Merge PDF',
      title: 'Merge PDF Online Free — Ahadex Tools',
      description: 'Combine multiple PDF documents into a single consolidated file in your browser. Fast, secure, and zero installation.',
      h1: 'Merge PDF Documents',
      intro: 'Bring scattered pages together into one tidy document. Join multiple separate PDF files into a single continuous file smoothly without installing bulky software.',
      howToUse: [
        'Select 2 or more PDF documents from your device.',
        'Review the list and reorder documents if necessary.',
        'Click Merge PDFs to assemble and download your unified document in seconds.',
      ],
      privacy: 'PDF streams are combined directly in client memory with pdf-lib without external network uploads.',
      limitations: 'Merging very large batches of high-resolution PDFs depends on your device available RAM.',
      faq: [
        {
          question: 'Is there a cost or page limit to merge PDFs?',
          answer: 'No, Ahadex PDF Merger is completely free with no watermark, page count limit, or hidden fee.',
        },
        {
          question: 'Can I combine PDFs on mobile devices?',
          answer: 'Yes! The tool is fully responsive and functions smoothly on mobile smartphones, tablets, and desktop browsers.',
        },
      ],
      relatedSlugs: ['pdf-to-text', 'image-compressor'],
    },
    bn: {
      name: 'পিডিএফ মার্জার',
      title: 'অনলাইন পিডিএফ মার্জার — Ahadex Tools',
      description: 'সহজে ও নিরাপদে একাধিক পিডিএফ ফাইল একত্র করুন বিনামূল্যে কোনো সফটওয়্যার ইনস্টল ছাড়াই।',
      h1: 'পিডিএফ ফাইল মার্জ করুন',
      intro: 'একাধিক বিচ্ছিন্ন পিডিএফ ফাইল একসাথে যুক্ত করে একটি সুশৃঙ্খল ডকুমেন্টে রূপান্তর করুন। কোনো ভারী সফটওয়্যার বা ইন্টারনেট আপলোড ছাড়াই ব্রাউজারে নিমিষেই সম্পন্ন করুন।',
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
      relatedSlugs: ['pdf-to-text', 'image-compressor'],
    },
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    category: 'text',
    categoryName: 'Text',
    en: {
      name: 'Word Counter',
      title: 'Online Word Counter & Character Counter — Ahadex Tools',
      description: 'Calculate real-time word counts, characters, spaces, sentences, paragraphs, and reading time for articles and essays.',
      h1: 'Online Word & Character Counter',
      intro: 'Count words, characters and reading time as you write. Accurate, real-time writing statistics for writers, students, bloggers, and SEO professionals.',
      howToUse: [
        'Type or paste your text into the workspace editor.',
        'View live metrics for words, characters, sentences, paragraphs, and estimated reading time.',
        'Use quick action buttons to format case, copy clean text, or strip extraneous whitespace.',
      ],
      privacy: 'Your text remains entirely on your screen. No words or paragraphs are sent to external analytics or database systems.',
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
      relatedSlugs: ['json-formatter', 'pdf-to-text'],
    },
    bn: {
      name: 'ওয়ার্ড কাউন্টার',
      title: 'অনলাইন শব্দ ও অক্ষর গণনাকারী — Ahadex Tools',
      description: 'রিয়েল-টাইমে শব্দ, ক্যারেক্টার, বাক্য ও রিডিং টাইম হিসাব করুন বাংলা ও ইংরেজি উভয়ের জন্য।',
      h1: 'অনলাইন ওয়ার্ড কাউন্টার',
      intro: 'লেখার সাথে সাথে শব্দ, অক্ষর, বাক্য ও পড়ার সময় রিয়েল-টাইমে গণনা করুন। লেখক, শিক্ষার্থী এবং কন্টেন্ট ক্রিয়েটরদের জন্য নিখুঁত রিয়েল-টাইম লেখার পরিসংখ্যান।',
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
      relatedSlugs: ['json-formatter', 'pdf-to-text'],
    },
  },
  {
    id: 'color-picker',
    slug: 'color-picker',
    category: 'developer',
    categoryName: 'Developer',
    en: {
      name: 'Color Picker',
      title: 'Online Color Picker & Hex to RGB Converter — Ahadex Tools',
      description: 'Interactive HTML/CSS color picker. Convert between HEX, RGB, HSL, and Tailwind CSS classes with instant one-click copying.',
      h1: 'Color Picker & Palette Generator',
      intro: 'Name a color, save its value and build a calmer palette. Pick harmonious colors, inspect live hex/rgb/hsl values, and copy CSS color variables for web design and frontend projects.',
      howToUse: [
        'Click the interactive color box or type any HEX code to preview your shade.',
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
      relatedSlugs: ['json-formatter', 'image-resizer'],
    },
    bn: {
      name: 'কালার পিকার',
      title: 'অনলাইন কালার পিকার ও হেক্স কনভার্টার — Ahadex Tools',
      description: 'ইন্টারেক্টিভ কালার পিকার দিয়ে HEX, RGB, HSL এবং Tailwind CSS কোড সহজেই কপি করুন।',
      h1: 'কালার পিকার ও প্যালেট জেনারেটর',
      intro: 'যেকোনো রঙের শেড বাছাই করুন, কোড দেখুন এবং সুন্দর প্যালেট তৈরি করুন। ডিজাইন ও ফ্রন্টএন্ড ডেভেলপমেন্টের জন্য যেকোনো শেডের নিখুঁত কালার কোড বের করুন।',
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
      relatedSlugs: ['json-formatter', 'image-resizer'],
    },
  },
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    category: 'images',
    categoryName: 'Images',
    en: {
      name: 'JPG to PNG',
      title: 'Convert JPG to PNG Online Free — Ahadex Tools',
      description: 'Convert JPG/JPEG images to lossless PNG format in seconds. Private browser conversion without file limits.',
      h1: 'JPG to PNG Image Converter',
      intro: 'Convert a JPG into a shareable PNG when transparency or lossless output matters. Convert JPEG images to high-definition PNG files directly in your browser with zero compression artifacts.',
      howToUse: [
        'Drop or choose a JPG or JPEG photo up to 20 MB from your device.',
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
      relatedSlugs: ['image-compressor', 'image-resizer'],
    },
    bn: {
      name: 'জেপিজি টু পিএনজি',
      title: 'JPG থেকে PNG কনভার্টার — Ahadex Tools',
      description: 'বিনামূল্যে কোনো কোয়ালিটি লস ছাড়া JPG ছবিকে PNG ফরম্যাটে রূপান্তর করুন নিমিষেই।',
      h1: 'JPG থেকে PNG কনভার্টার',
      intro: 'জেপিজি ছবিকে কোনো মানহানি ছাড়াই সরাসরি হাই-কোয়ালিটি পিএনজি ফাইলে রূপান্তর করুন। JPEG ছবিকে হাই-রেজোলিউশন PNG ফাইলে সরাসরি আপনার ব্রাউজারে কনভার্ট করুন।',
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
      relatedSlugs: ['image-compressor', 'image-resizer'],
    },
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    category: 'images',
    categoryName: 'Images',
    en: {
      name: 'Image Resizer',
      title: 'Resize Image Dimensions Online Free — Ahadex Tools',
      description: 'Resize JPG, PNG, and WebP images to exact pixel widths and heights with aspect ratio locking and bicubic resampling.',
      h1: 'Image Resizer & Dimension Scaler',
      intro: 'Resize an image to a precise width and height for the job ahead. Scale down or resize any photo to exact pixel specifications for social media banners, website headers, or email attachments.',
      howToUse: [
        'Upload your image to inspect its original pixel dimensions.',
        'Enter target width and height (optionally lock aspect ratio to prevent stretching).',
        'Click Resize Image and download your newly scaled photo instantly.',
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
      relatedSlugs: ['image-compressor', 'jpg-to-png'],
    },
    bn: {
      name: 'ইমেজ রিসাইজার',
      title: 'অনলাইন ইমেজ রিসাইজার — Ahadex Tools',
      description: 'অনলাইনে JPG, PNG এবং WebP ছবির দৈর্ঘ্য-প্রস্থ সঠিক মাপে রিসাইজ করুন কোনো সফটওয়্যার ছাড়াই।',
      h1: 'অনলাইন ইমেজ রিসাইজার',
      intro: 'ছবির দৈর্ঘ্য ও প্রস্থ নির্দিষ্ট পিক্সেল মাপে সহজে পরিবর্তন করুন নিখুঁত অনুপাতে। সোশ্যাল মিডিয়া ব্যানার, পোস্ট বা ফরম পূরণের জন্য ছবির সঠিক পিক্সেল সাইজ নির্ধারণ করুন।',
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
      relatedSlugs: ['image-compressor', 'jpg-to-png'],
    },
  },
  {
    id: 'photo-qr-code',
    slug: 'photo-qr-code',
    category: 'images',
    categoryName: 'Images',
    en: {
      name: 'Photo QR Code',
      title: 'Photo QR Code Generator Online Free — Ahadex Tools',
      description: 'Upload your image and overlay a high-clarity scannable QR code badge for Social links, Website URLs, WhatsApp, WiFi, or Phone numbers in seconds.',
      h1: 'Photo QR Code Generator & Watermark Badge',
      intro: 'Embed a scannable QR code watermark badge seamlessly onto any photo. Easily place a clear, fully scannable QR code badge directly onto your photo or poster without ruining the original image quality.',
      howToUse: [
        'Upload your photo (JPG, PNG, or WebP).',
        'Choose your payload type (Social, Website, WhatsApp, Wi-Fi, Phone, Email, Text).',
        'Enter your link, credentials, or custom information.',
        'Customize badge corner position, size, and styling with real-time preview.',
        'Download your ready-to-share composite image instantly.',
      ],
      privacy: 'Your images and links never leave your browser. All QR generation and image compositing happen locally in your browser canvas.',
      limitations: 'Make sure the badge is large enough to scan reliably when printing or uploading to compressed social media.',
      faq: [
        {
          question: 'Can any standard phone camera scan this QR code on the photo?',
          answer: 'Yes! The QR code is generated with High Error Correction (level H/Q) and high contrast on a protective background, making it easily scannable on any iPhone, Android, or barcode scanner app.',
        },
        {
          question: 'Can I pick which corner the QR badge appears in?',
          answer: 'Yes, you can choose Bottom-Right, Bottom-Left, Top-Right, or Top-Left, and adjust its size, padding, and transparency.',
        },
        {
          question: 'What types of payloads are supported?',
          answer: 'Website URL, WhatsApp direct chat, Wi-Fi network auto-connect, Social profiles (Facebook, Instagram, YouTube, Twitter/X, TikTok, LinkedIn, Telegram), Phone call, Email, and plain Text.',
        },
      ],
      relatedSlugs: ['image-compressor', 'image-resizer', 'jpg-to-png'],
    },
    bn: {
      name: 'ফটো কিউআর কোড',
      title: 'ফটো কিউআর কোড জেনারেটর — Ahadex Tools',
      description: 'ছবির ওপর সোশ্যাল মিডিয়া, ওয়েবসাইট, হোয়াটসঅ্যাপ বা ওয়াইফাই কিউআর কোড ব্যাজ যুক্ত করুন দ্রুত ও বিনামূল্যে।',
      h1: 'ফটো কিউআর কোড জেনারেটর',
      intro: 'যেকোনো ছবি বা পোস্টারের ওপর আকর্ষণীয় স্ক্যানযোগ্য কিউআর কোড ব্যাজ যুক্ত করুন। ছবির আসল মান নষ্ট না করে সরাসরি পরিচ্ছন্ন ও স্পষ্ট কিউআর কোড ওয়াটারমার্ক ব্যাজ যুক্ত করুন পোস্টার বা ছবিতে।',
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
      relatedSlugs: ['image-compressor', 'image-resizer', 'jpg-to-png'],
    },
  },
  {
    "id": "pdf-to-word",
    "slug": "pdf-to-word",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "PDF to Word",
      "title": "PDF to Word Converter — Ahadex Tools",
      "description": "Convert PDF documents to editable Microsoft Word (.docx) files free online in your browser. 100% private client-side processing.",
      "h1": "PDF to Word Converter",
      "intro": "Extract formatted text and paragraphs from your PDF documents and export directly as clean, editable Word (.docx) files without uploading to external servers.",
      "howToUse": [
        "Select or drag & drop your PDF file into the upload zone.",
        "Choose whether to include page divider labels in the generated Word document.",
        "Click \"Convert to Word (.DOCX)\" and download your editable document."
      ],
      "privacy": "Your PDF is parsed entirely in your browser using client-side JavaScript. Confidential documents are never transmitted across the network.",
      "limitations": "Scanned image-only PDFs with no embedded text streams require OCR extraction. Very complex multi-column brochure layouts are exported as clean editable text paragraphs.",
      "faq": [
        {
          "question": "Is this PDF to Word converter completely free?",
          "answer": "Yes! You can convert as many PDF files as you need without accounts, paywalls, or limits."
        },
        {
          "question": "Are my private PDF documents uploaded to your server?",
          "answer": "No. All parsing and DOCX assembly execute 100% locally within your browser memory."
        }
      ],
      "relatedSlugs": [
        "pdf-to-text",
        "merge-pdf",
        "split-pdf",
        "compress-pdf"
      ]
    },
    "bn": {
      "name": "PDF থেকে Word কনভার্টার",
      "title": "অনলাইন PDF থেকে Word কনভার্টার — Ahadex Tools",
      "description": "ব্রাউজারে কোনো ফাইল আপলোড ছাড়াই সরাসরি PDF থেকে এডিটেবল Word (.docx) ফাইলে কনভার্ট করুন সম্পূর্ণ বিনামূল্যে।",
      "h1": "PDF থেকে Word কনভার্টার",
      "intro": "PDF এর ভেতরের টেক্সট ও প্যারাগ্রাফ নির্ভুলভাবে এক্সট্রাক্ট করে তাৎক্ষণিকভাবে এডিটেবল ওয়ার্ড ফাইলে রূপান্তর করুন।",
      "howToUse": [
        "আপনার কাঙ্ক্ষিত PDF ফাইলটি ড্র্যাগ করে আনুন বা নির্বাচন করুন।",
        "ডকুমেন্টে পৃষ্ঠা নম্বর রাখতে চান কিনা তা নির্ধারণ করুন।",
        "\"Word (.docx) ফরম্যাটে রূপান্তর করুন\" বাটনে ক্লিক করে ফাইলটি ডাউনলোড করুন।"
      ],
      "privacy": "আপনার ফাইল সম্পূর্ণ স্থানীয়ভাবে ব্রাউজার মেমরিতে প্রসেস হয়। কোনো রিমোট সার্ভারে পাঠানো হয় না।",
      "limitations": "শুধুমাত্র স্ক্যান করা ছবির PDF-এর ক্ষেত্রে টেক্সট রিকগনিশন প্রয়োজন হতে পারে। সাধারণ টেক্সট PDF পুরোপুরি এডিটেবল হয়।",
      "faq": [
        {
          "question": "এটি কি মাইক্রোসফট ওয়ার্ড এবং গুগল ডকসে সাপোর্ট করবে?",
          "answer": "হ্যাঁ, তৈরি হওয়া .docx ফাইলটি MS Word, Google Docs এবং LibreOffice-এ স্বাচ্ছন্দ্যে এডিট করা যায়।"
        },
        {
          "question": "আমার ফাইল কি কোনো সার্ভারে জমা থাকে?",
          "answer": "না, আপনার ফাইল আপনার কম্পিউটার বা মোবাইলের ব্রাউজারেই প্রক্রিয়াজাত হয়।"
        }
      ],
      "relatedSlugs": [
        "pdf-to-text",
        "merge-pdf",
        "split-pdf",
        "compress-pdf"
      ]
    }
  },
  {
    "id": "jpg-to-pdf",
    "slug": "jpg-to-pdf",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "JPG to PDF",
      "title": "JPG to PDF Converter — Ahadex Tools",
      "description": "Convert one or multiple JPG images into a single PDF document. Choose page size, orientation, and margins free online in your browser.",
      "h1": "JPG to PDF Converter",
      "intro": "Combine single or multiple JPG/JPEG photos into an organized PDF file with complete control over A4/Letter page size, margins, and page orientation.",
      "howToUse": [
        "Select or drag & drop one or multiple JPG photos.",
        "Reorder images as needed and customize page size, orientation, or margins.",
        "Click \"Convert to PDF\" and download your finished document."
      ],
      "privacy": "Images are combined and embedded into PDF documents directly inside your browser. No photos leave your device.",
      "limitations": "Supports JPG and JPEG formats. For mixed image types (PNG/WebP), use our Image to PDF tool.",
      "faq": [
        {
          "question": "Can I combine multiple photos into a single PDF?",
          "answer": "Yes! You can upload dozens of photos, reorder them with one click, and combine them into one multi-page PDF."
        },
        {
          "question": "Will image quality be preserved?",
          "answer": "Yes, full original resolution is embedded into the PDF without degradation."
        }
      ],
      "relatedSlugs": [
        "image-to-pdf",
        "jpg-to-png",
        "image-compressor",
        "merge-pdf"
      ]
    },
    "bn": {
      "name": "JPG থেকে PDF কনভার্টার",
      "title": "অনলাইন JPG থেকে PDF কনভার্টার — Ahadex Tools",
      "description": "একাধিক JPG ছবি নির্বাচন করে পেজ সাইজ ও মার্জিন পছন্দ অনুযায়ী নিমেষেই PDF তৈরি করুন সম্পূর্ণ বিনামূল্যে।",
      "h1": "JPG থেকে PDF কনভার্টার",
      "intro": "ডকুমেন্ট স্ক্যান বা ফটোগ্রাফগুলোকে এক ক্লিকে অফিশিয়াল A4 অথবা লেটার সাইজের PDF ফাইলে রূপান্তর করুন।",
      "howToUse": [
        "এক বা একাধিক JPG ছবি আপলোড করুন।",
        "প্রয়োজনে ছবির ক্রম পরিবর্তন করুন এবং পেজের সাইজ নির্ধারণ করুন।",
        "\"PDF তৈরি করুন\" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করে নিন।"
      ],
      "privacy": "সব ছবি আপনার ডিভাইসের মেমরিতে যুক্ত হয়ে PDF তৈরি হয়। কোনো ক্লাউড সার্ভারে আপলোড হয় না।",
      "limitations": "JPG ও JPEG ফরম্যাটের ফাইল সমর্থিত।",
      "faq": [
        {
          "question": "একাধিক ছবি একসাথে একটি ফাইলে জোড়া দেওয়া যাবে কি?",
          "answer": "হ্যাঁ, যতগুলো ইচ্ছা ছবি নির্বাচন করে একটি সিঙ্গেল মাল্টি-পেজ PDF তৈরি করা যাবে।"
        },
        {
          "question": "প্রিন্ট করার জন্য A4 পেজ সাইজ সাপোর্ট করবে?",
          "answer": "হ্যাঁ, A4, US Letter অথবা ছবির মাপ অনুযায়ী যেকোনো সাইজ বেছে নেওয়া যায়।"
        }
      ],
      "relatedSlugs": [
        "image-to-pdf",
        "jpg-to-png",
        "image-compressor",
        "merge-pdf"
      ]
    }
  },
  {
    "id": "split-pdf",
    "slug": "split-pdf",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "Split PDF",
      "title": "Split PDF Online — Ahadex Tools",
      "description": "Split PDF files into individual pages or custom ranges (e.g., 1-3, 5). Fast, free, and 100% private in-browser tool.",
      "h1": "Split PDF Files Online",
      "intro": "Divide large PDF documents into smaller files by specifying exact page numbers or extract every page into individual PDFs packed in a ZIP.",
      "howToUse": [
        "Upload your PDF document.",
        "Choose whether to extract a specific page range (e.g., 1-3, 5) or split all pages.",
        "Click \"Split PDF Now\" and instantly download your split PDF or ZIP archive."
      ],
      "privacy": "PDF page copying and splitting happen locally in WebAssembly memory. Your confidential files are never uploaded.",
      "limitations": "Password-encrypted documents must be unlocked before splitting.",
      "faq": [
        {
          "question": "How do I specify multiple page ranges?",
          "answer": "Use commas and dashes like \"1-3, 5, 8-10\" to include precisely the pages you need."
        },
        {
          "question": "Can I split every page into separate files?",
          "answer": "Yes! Choose the \"Split Every Page\" option to receive all pages as individual PDFs bundled in a ZIP."
        }
      ],
      "relatedSlugs": [
        "pdf-page-extractor",
        "merge-pdf",
        "pdf-rotate",
        "compress-pdf"
      ]
    },
    "bn": {
      "name": "স্প্লিট PDF",
      "title": "অনলাইন স্প্লিট PDF — Ahadex Tools",
      "description": "সহজে PDF ফাইলের নির্দিষ্ট পেজ আলাদা করুন বা সব পেজ আলাদা PDF বানিয়ে জিপ ফাইলে ডাউনলোড করুন বিনামূল্যে।",
      "h1": "স্প্লিট PDF ফাইল",
      "intro": "বড় PDF বই বা ডকুমেন্ট থেকে আপনার প্রয়োজনীয় পৃষ্ঠাগুলো নিমেষেই আলাদা ফাইলে রূপান্তর করুন।",
      "howToUse": [
        "আপনার PDF ফাইলটি সিলেক্ট করুন।",
        "নির্দিষ্ট পৃষ্ঠা রেঞ্জ দিন (যেমন: 1-3, 5) অথবা \"প্রতিটি পৃষ্ঠা আলাদা PDF\" নির্বাচন করুন।",
        "\"PDF স্প্লিট করুন\" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করুন।"
      ],
      "privacy": "সম্পূর্ণ প্রসেসিং আপনার ব্রাউজারে হয়, কোনো ডেটা সার্ভারে যায় না।",
      "limitations": "লক করা PDF এর ক্ষেত্রে প্রথমে পাসওয়ার্ড দিয়ে আনলক করে নিতে হবে।",
      "faq": [
        {
          "question": "রেঞ্জ কীভাবে লিখব?",
          "answer": "কমা এবং ড্যাশ দিয়ে লিখুন, যেমন: ১-৩, ৫, ৭-৯।"
        },
        {
          "question": "আলাদা করা ফাইলগুলোর কোয়ালিটি কি কমে যাবে?",
          "answer": "না, মূল ফাইলের টেক্সট ও ভেক্টর কোয়ালিটি ১০০% অক্ষুণ্ণ থাকে।"
        }
      ],
      "relatedSlugs": [
        "pdf-page-extractor",
        "merge-pdf",
        "pdf-rotate",
        "compress-pdf"
      ]
    }
  },
  {
    "id": "compress-pdf",
    "slug": "compress-pdf",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "Compress PDF",
      "title": "Compress PDF Online — Ahadex Tools",
      "description": "Compress PDF files online to reduce file size for email and web uploads. Real in-browser compression with before and after size stats.",
      "h1": "Compress PDF Online",
      "intro": "Optimize and shrink bulky PDF documents for email attachments and web upload limits without sacrificing readability or compromising confidentiality.",
      "howToUse": [
        "Select or drag & drop the PDF file you wish to compress.",
        "Choose a compression profile: Extreme, Recommended, or Low.",
        "Click \"Compress PDF\" and download the optimized file showing exact saved bytes."
      ],
      "privacy": "Compression executes locally via client-side canvas rasterization and PDF stream reconstruction. No documents are uploaded.",
      "limitations": "Text-only documents with no raster images are already at minimum size and will not shrink significantly.",
      "faq": [
        {
          "question": "How much can I reduce my PDF size?",
          "answer": "Image-heavy scanned PDFs and presentations can often be compressed by 40% to 80% without noticeable quality loss."
        },
        {
          "question": "Are my confidential documents safe?",
          "answer": "Yes! Processing executes entirely inside your browser sandbox without server interaction."
        }
      ],
      "relatedSlugs": [
        "split-pdf",
        "merge-pdf",
        "pdf-to-jpg",
        "image-compressor"
      ]
    },
    "bn": {
      "name": "কম্প্রেস PDF",
      "title": "অনলাইন PDF কম্প্রেসার — Ahadex Tools",
      "description": "ইমেইল বা ওয়েবসাইট আপলোডের জন্য PDF ফাইলের সাইজ ছোট করুন বিনামূল্যে ও শতভাগ লোকাল ব্রাউজার প্রসেসিংয়ে।",
      "h1": "PDF ফাইলের আকার ছোট করুন",
      "intro": "ভারী PDF ফাইলকে হালকা ও সহজে শেয়ারযোগ্য করতে নির্ভরযোগ্য ক্লায়েন্ট-সাইড অপ্টিমাইজেশন ব্যবহার করুন।",
      "howToUse": [
        "যে PDF ফাইলের আকার কমাতে চান সেটি আপলোড করুন।",
        "আপনার প্রয়োজনীয় কম্প্রেশন লেভেল (সুপারিশকৃত বা সর্বোচ্চ) নির্বাচন করুন।",
        "\"PDF কম্প্রেস করুন\" বাটনে ক্লিক করে ফলাফল দেখুন ও ডাউনলোড করুন।"
      ],
      "privacy": "আপনার ফাইল কোনো সার্ভারে আপলোড হয় না, আপনার ডিভাইসেই কম্প্রেস সম্পন্ন হয়।",
      "limitations": "শুধুমাত্র টেক্সট থাকা অতি-ছোট PDF এর সাইজ বেশি কমবে না।",
      "faq": [
        {
          "question": "সাইজ কতটুকু কমবে?",
          "answer": "ছবিযুক্ত বা স্ক্যান করা ডকুমেন্টের সাইজ সাধারণত ৫০% থেকে ৮০% পর্যন্ত কমে যায়।"
        },
        {
          "question": "লেখা কি অস্পষ্ট হয়ে যাবে?",
          "answer": "প্রস্তাবিত লেভেলে টেক্সট সম্পূর্ণ পড়ার মতো স্পষ্ট ও শার্প থাকে।"
        }
      ],
      "relatedSlugs": [
        "split-pdf",
        "merge-pdf",
        "pdf-to-jpg",
        "image-compressor"
      ]
    }
  },
  {
    "id": "pdf-to-jpg",
    "slug": "pdf-to-jpg",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "PDF to JPG",
      "title": "PDF to JPG Converter — Ahadex Tools",
      "description": "Convert PDF pages into high-resolution JPG images free online. Download individual pages or all pages as a ZIP archive.",
      "h1": "PDF to JPG Converter",
      "intro": "Render PDF pages into crisp, universally viewable JPG images suitable for presentations, social sharing, or image editors.",
      "howToUse": [
        "Select your PDF document from your device.",
        "Customize resolution scale (up to 300 DPI) and JPG quality.",
        "Convert all pages and download individual JPGs or everything as a ZIP."
      ],
      "privacy": "Pages are rendered onto client-side HTML5 canvas elements. Your documents never leave your browser.",
      "limitations": "JPEG does not support transparency; transparent backgrounds are rendered as crisp white.",
      "faq": [
        {
          "question": "Can I download all converted pages at once?",
          "answer": "Yes! A single click on \"Download All as ZIP\" saves every page as a numbered JPG inside a ZIP file."
        },
        {
          "question": "What resolution are the extracted JPGs?",
          "answer": "You can choose between Standard (1x), High Quality (1.5x), or Ultra Sharp (2x/300 DPI)."
        }
      ],
      "relatedSlugs": [
        "pdf-to-png",
        "pdf-to-text",
        "jpg-to-pdf",
        "merge-pdf"
      ]
    },
    "bn": {
      "name": "PDF থেকে JPG কনভার্টার",
      "title": "অনলাইন PDF থেকে JPG কনভার্টার — Ahadex Tools",
      "description": "PDF ফাইল থেকে প্রতিটি পেজ হাই-রেজোলিউশন JPG ছবিতে রূপান্তর করুন এবং সিঙ্গেল বা জিপ ফাইলে ডাউনলোড করুন।",
      "h1": "PDF থেকে JPG কনভার্টার",
      "intro": "ডকুমেন্ট, বই বা রসিদের PDF পৃষ্ঠাকে পরিষ্কার ছবিতে রূপান্তর করে সহজে দেখার উপযোগী করুন।",
      "howToUse": [
        "আপনার PDF ফাইলটি সিলেক্ট করুন।",
        "প্রয়োজনে ছবির রেজোলিউশন ও কোয়ালিটি নির্বাচন করুন।",
        "\"JPG তে রূপান্তর করুন\" বাটনে ক্লিক করে একক ছবি বা জিপ ফাইল ডাউনলোড করুন।"
      ],
      "privacy": "সম্পূর্ণ প্রসেসিং আপনার ব্রাউজারের ভেতর সম্পন্ন হয়।",
      "limitations": "JPG ফরম্যাট স্বচ্ছতা সমর্থন করে না, ব্যাকগ্রাউন্ড সাদা হিসেবে তৈরি হবে।",
      "faq": [
        {
          "question": "সবগুলো ছবি কি একবারে ডাউনলোড করা যাবে?",
          "answer": "হ্যাঁ, \"সব ছবি জিপ (ZIP) আকারে ডাউনলোড\" বাটনে ক্লিক করে সব ছবি এক ক্লিকে পেয়ে যাবেন।"
        },
        {
          "question": "ছবির লেখাগুলো কি পরিষ্কার থাকবে?",
          "answer": "হ্যাঁ, ২x রেটিনা রেজোলিউশনে রেন্ডার হওয়ায় টেক্সট অতি স্পষ্ট থাকে।"
        }
      ],
      "relatedSlugs": [
        "pdf-to-png",
        "pdf-to-text",
        "jpg-to-pdf",
        "merge-pdf"
      ]
    }
  },
  {
    "id": "heic-to-jpg",
    "slug": "heic-to-jpg",
    "category": "images",
    "categoryName": "Images",
    "en": {
      "name": "HEIC to JPG",
      "title": "HEIC to JPG Converter — Ahadex Tools",
      "description": "Convert Apple iPhone HEIC and HEIF photos into standard JPG images in your browser. 100% free, private, with zero server uploads.",
      "h1": "HEIC to JPG Converter",
      "intro": "Open and convert Apple High Efficiency Image Format (HEIC/HEIF) photos into universally supported JPEG format compatible with any device, Windows PC, or website.",
      "howToUse": [
        "Select or drag & drop your .heic or .heif photo.",
        "Adjust the JPG output quality slider as desired.",
        "Click \"Convert to JPG\" and download your converted photo."
      ],
      "privacy": "Decoding and JPEG encoding occur 100% within your browser thread. Photos are never uploaded to any remote server.",
      "limitations": "Supports standard Apple HEIC and HEIF image containers up to 50 MB.",
      "faq": [
        {
          "question": "Why do my iPhone photos have the .heic extension?",
          "answer": "Apple devices use HEIC by default to save storage space, but many Windows PCs and websites require standard JPG."
        },
        {
          "question": "Is my photo uploaded to your server?",
          "answer": "No! The conversion runs completely in your browser without any network upload."
        }
      ],
      "relatedSlugs": [
        "jpg-to-png",
        "png-to-jpg",
        "webp-to-jpg",
        "image-compressor"
      ]
    },
    "bn": {
      "name": "HEIC থেকে JPG কনভার্টার",
      "title": "অনলাইন HEIC থেকে JPG কনভার্টার — Ahadex Tools",
      "description": "অ্যাপল ডিভাইসের HEIC ছবিকে সাধারণ JPG ফরম্যাটে রূপান্তর করুন সম্পূর্ণ বিনামূল্যে ও নিরাপদে ব্রাউজারে।",
      "h1": "HEIC থেকে JPG ছবি রূপান্তর",
      "intro": "উইন্ডোজ কম্পিউটার বা যেকোনো ওয়েবসাইটে আইফোনের HEIC ছবি সহজে ব্যবহারের উপযোগী করতে JPG তে রূপান্তর করুন।",
      "howToUse": [
        "আপনার .heic বা .heif ছবি নির্বাচন করুন।",
        "প্রয়োজনে কোয়ালিটি স্লাইডার অ্যাডজাস্ট করুন।",
        "\"JPG ফরম্যাটে কনভার্ট করুন\" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করুন।"
      ],
      "privacy": "ছবি সম্পূর্ণ লোকাল ব্রাউজারে ডিকোড হয়, কোনো সার্ভার কল নেই।",
      "limitations": "সর্বোচ্চ ৫০ মেগাবাইট পর্যন্ত ফাইল সমর্থিত।",
      "faq": [
        {
          "question": "সব ডিভাইসে কি ছবি ওপেন হবে?",
          "answer": "হ্যাঁ, তৈরি হওয়া JPG যেকোনো কম্পিউটার, ফোন বা ওয়েবসাইটে সাপোর্ট করে।"
        },
        {
          "question": "কোয়ালিটি কি ঠিক থাকবে?",
          "answer": "হ্যাঁ, মূল ছবির সম্পূর্ণ রেজোলিউশন ও রঙের গভীরতা সংরক্ষিত থাকে।"
        }
      ],
      "relatedSlugs": [
        "jpg-to-png",
        "png-to-jpg",
        "webp-to-jpg",
        "image-compressor"
      ]
    }
  },
  {
    "id": "png-to-jpg",
    "slug": "png-to-jpg",
    "category": "images",
    "categoryName": "Images",
    "en": {
      "name": "PNG to JPG",
      "title": "PNG to JPG Converter — Ahadex Tools",
      "description": "Convert PNG images to standard JPG format. Choose white, black, or custom background colors for transparent areas. Free in-browser tool.",
      "h1": "PNG to JPG Converter",
      "intro": "Convert transparent or opaque PNG files into compact, universally compatible JPEG images with fine-tuned background color selection.",
      "howToUse": [
        "Select a PNG image from your device.",
        "Choose a background color (White, Black, or Custom) to replace transparent areas.",
        "Click \"Convert to JPG\" and download your finished image."
      ],
      "privacy": "Conversion executes in HTML5 canvas memory. Your graphics are never uploaded or saved on our servers.",
      "limitations": "JPEG does not support transparency; any transparent pixels will be filled with your selected background color.",
      "faq": [
        {
          "question": "What happens to the transparent background in my PNG?",
          "answer": "You can choose to fill transparent areas with clean white, black, or any custom color of your choice."
        },
        {
          "question": "Why convert PNG to JPG?",
          "answer": "JPG files are typically 50% to 80% smaller than PNGs, making them ideal for web pages, emails, and social media."
        }
      ],
      "relatedSlugs": [
        "jpg-to-png",
        "webp-to-jpg",
        "heic-to-jpg",
        "image-compressor"
      ]
    },
    "bn": {
      "name": "PNG থেকে JPG কনভার্টার",
      "title": "অনলাইন PNG থেকে JPG কনভার্টার — Ahadex Tools",
      "description": "PNG ছবি সহজে JPG তে রূপান্তর করুন। স্বচ্ছ অংশের জন্য সাদা বা কাস্টম ব্যাকগ্রাউন্ড সিলেক্ট করুন বিনামূল্যে।",
      "h1": "PNG থেকে JPG রূপান্তর",
      "intro": "ফাইলের সাইজ ছোট করতে এবং সব প্ল্যাটফর্মে সহজে শেয়ার করার জন্য PNG ছবিকে নিখুঁত JPG তে রূপান্তর করুন।",
      "howToUse": [
        "আপনার PNG ছবিটি নির্বাচন করুন।",
        "স্বচ্ছ অংশের জন্য সাদা, কালো বা পছন্দের রঙ বেছে নিন।",
        "\"JPG তে রূপান্তর করুন\" বাটনে ক্লিক করে ছবিটি ডাউনলোড করুন।"
      ],
      "privacy": "ছবি আপনার ব্রাউজারেই কনভার্ট হয়, কোনো সার্ভার আপলোড ছাড়া।",
      "limitations": "JPG তে স্বচ্ছতা থাকে না, তাই ব্যাকগ্রাউন্ড রঙ অপরিহার্য।",
      "faq": [
        {
          "question": "স্বচ্ছ ব্যাকগ্রাউন্ড কি কালো হয়ে যাবে?",
          "answer": "না, আমাদের টুলে আপনি সাদা বা যেকোনো কাস্টম রঙ বেছে নিতে পারেন।"
        },
        {
          "question": "ফাইলের সাইজ কি কমবে?",
          "answer": "হ্যাঁ, JPG ফরম্যাটে ফাইল সাইজ উল্লেখযোগ্য পরিমাণে ছোট হয়ে যায়।"
        }
      ],
      "relatedSlugs": [
        "jpg-to-png",
        "webp-to-jpg",
        "heic-to-jpg",
        "image-compressor"
      ]
    }
  },
  {
    "id": "webp-to-jpg",
    "slug": "webp-to-jpg",
    "category": "images",
    "categoryName": "Images",
    "en": {
      "name": "WebP to JPG",
      "title": "WebP to JPG Converter — Ahadex Tools",
      "description": "Convert WebP images downloaded from websites into standard JPG photos. Fast, free, and processed 100% in your browser.",
      "h1": "WebP to JPG Converter",
      "intro": "Turn modern web images (.webp) saved from online stores and websites into standard JPG images that open in any photo editor or legacy software.",
      "howToUse": [
        "Select or drag & drop your WebP image file.",
        "Adjust the JPG compression quality if needed.",
        "Click \"Convert to JPG\" and download your ready image."
      ],
      "privacy": "Your WebP image is rendered on a local browser canvas. Files never leave your computer or phone.",
      "limitations": "Animated WebP files are converted using their first frame.",
      "faq": [
        {
          "question": "Why do websites save images as WebP?",
          "answer": "WebP offers high web compression, but many older programs and desktop editors cannot open it. Converting to JPG solves compatibility."
        },
        {
          "question": "Does this converter cost anything?",
          "answer": "No, it is completely free and works unlimited times with no signup."
        }
      ],
      "relatedSlugs": [
        "jpg-to-png",
        "png-to-jpg",
        "heic-to-jpg",
        "image-resizer"
      ]
    },
    "bn": {
      "name": "WebP থেকে JPG কনভার্টার",
      "title": "অনলাইন WebP থেকে JPG কনভার্টার — Ahadex Tools",
      "description": "ওয়েবসাইটের WebP ছবিকে সাধারণ JPG তে রূপান্তর করুন মুহূর্তেই, বিনামূল্যে ও কোনো ফাইল আপলোড ছাড়াই।",
      "h1": "WebP থেকে JPG ছবি রূপান্তর",
      "intro": "বিভিন্ন ওয়েবসাইট ও সোশ্যাল মিডিয়ার WebP ফাইলকে সাধারণ JPG ছবিতে পরিণত করুন যাতে যেকোনো ডিভাইসে খোলা যায়।",
      "howToUse": [
        "আপনার WebP ছবিটি নির্বাচন করুন।",
        "কোয়ালিটি স্লাইডার চেক করে নিন।",
        "\"JPG তে রূপান্তর করুন\" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করুন।"
      ],
      "privacy": "সব প্রসেসিং আপনার ব্রাউজারে লোকাল মেমরিতে সম্পন্ন হয়।",
      "limitations": "অ্যানিমেটেড WebP ফাইলের ক্ষেত্রে প্রথম ফ্রেমটি রূপান্তরিত হয়।",
      "faq": [
        {
          "question": "কেন WebP ছবিকে JPG তে রূপান্তর করতে হয়?",
          "answer": "অনেক ফটো এডিটর ও পুরোনো কম্পিউটার সিস্টেমে WebP সরাসরি ওপেন হয় না, JPG সব জায়গায় চলে।"
        },
        {
          "question": "ছবির স্পষ্টতা কি কমবে?",
          "answer": "না, উচ্চমানের রেজোলিউশন বজায় রেখেই JPG তৈরি হয়।"
        }
      ],
      "relatedSlugs": [
        "jpg-to-png",
        "png-to-jpg",
        "heic-to-jpg",
        "image-resizer"
      ]
    }
  },
  {
    "id": "image-to-pdf",
    "slug": "image-to-pdf",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "Image to PDF",
      "title": "Image to PDF Converter — Ahadex Tools",
      "description": "Combine multiple JPG, PNG, and WebP photos into one organized PDF document. Reorder pages and customize margins free online.",
      "h1": "Image to PDF Converter",
      "intro": "Merge multiple mixed-format images into a professional, shareable PDF document with custom page layouts, margins, and automatic orientation detection.",
      "howToUse": [
        "Select or drag & drop multiple JPG, PNG, or WebP images.",
        "Reorder photos using the arrow buttons and select your page size (A4, Letter, Fit).",
        "Click \"Convert All to PDF\" and download your combined document."
      ],
      "privacy": "Images are drawn to canvas and embedded into PDF bytes directly on your device. Zero cloud uploads.",
      "limitations": "Very large collections (100+ high-res images) may take a few seconds to compile in browser memory.",
      "faq": [
        {
          "question": "Can I mix JPG and PNG files in the same PDF?",
          "answer": "Yes! Our tool effortlessly accepts mixed JPG, PNG, and WebP pictures and combines them into one seamless PDF."
        },
        {
          "question": "Will my pictures stretch or distort?",
          "answer": "No. The converter precisely calculates original aspect ratios and centers images neatly on each page without stretching."
        }
      ],
      "relatedSlugs": [
        "jpg-to-pdf",
        "merge-pdf",
        "image-compressor",
        "jpg-to-png"
      ]
    },
    "bn": {
      "name": "ছবি থেকে PDF কনভার্টার",
      "title": "অনলাইন ছবি থেকে PDF কনভার্টার — Ahadex Tools",
      "description": "একাধিক ছবি নির্বাচন করে পেজের মাপ ঠিক রেখে সহজে একটি গোছানো PDF ডকুমেন্ট তৈরি করুন সম্পূর্ণ বিনামূল্যে।",
      "h1": "ছবি থেকে PDF ডকুমেন্ট তৈরি",
      "intro": "বিভিন্ন ফরম্যাটের ছবিগুলোকে কোনো ঝামেলা ছাড়াই একটি সুশৃঙ্খল PDF ফাইলে রূপান্তর করে শেয়ার করুন।",
      "howToUse": [
        "আপনার প্রয়োজনীয় ছবিগুলো একসাথে নির্বাচন করুন।",
        "ছবির ক্রম ঠিক করুন এবং পেজ সাইজ নির্ধারণ করুন।",
        "\"PDF তৈরি করুন\" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করে নিন।"
      ],
      "privacy": "আপনার ছবি সম্পূর্ণ ডিভাইসের মেমরিতে প্রসেস হয়, কোনো সার্ভারে যায় না।",
      "limitations": "যেকোনো জনপ্রিয় ইমেজ ফরম্যাট সাপোর্টেড।",
      "faq": [
        {
          "question": "ছবি কি বাঁকা বা টেনে লম্বা হয়ে যাবে?",
          "answer": "না, প্রতিটি ছবির আসল অনুপাত বজায় রেখে পেজের মাঝে নিখুঁতভাবে বসানো হয়।"
        },
        {
          "question": "একাধিক ফরম্যাট একসাথে দেওয়া যাবে?",
          "answer": "হ্যাঁ, JPG, PNG ও WebP ছবি একসাথে একই ফাইলে দেওয়া যায়।"
        }
      ],
      "relatedSlugs": [
        "jpg-to-pdf",
        "merge-pdf",
        "image-compressor",
        "jpg-to-png"
      ]
    }
  },
  {
    "id": "background-remover",
    "slug": "background-remover",
    "category": "images",
    "categoryName": "Images",
    "en": {
      "name": "Background Remover",
      "title": "Free Background Remover Online — Ahadex Tools",
      "description": "Remove background from images free online. Create transparent PNGs or official passport blue backgrounds with zero server uploads.",
      "h1": "Free Online Background Remover",
      "intro": "Isolate subjects and cleanly remove distracting photo backgrounds to produce transparent product shots or official blue/white identification photos.",
      "howToUse": [
        "Upload your photo (JPG, PNG, or WebP).",
        "Select your desired background output: Transparent, White, or Passport Blue.",
        "Adjust the edge sensitivity if needed, click \"Remove Background\", and download your clean PNG."
      ],
      "privacy": "All pixel analysis and alpha masking execute locally on your browser canvas. Your private photos are never sent to external servers.",
      "limitations": "Works best on images with clear contrast between the subject and the background.",
      "faq": [
        {
          "question": "Is this background remover really 100% free without paywalls?",
          "answer": "Yes! Unlike commercial services that charge per download, Ahadex Tools processes entirely inside your browser for free."
        },
        {
          "question": "Can I create official passport photos with blue backgrounds?",
          "answer": "Yes, simply select the \"Passport Blue\" option to instantly composite your portrait onto an official blue backdrop."
        }
      ],
      "relatedSlugs": [
        "image-compressor",
        "png-to-jpg",
        "image-resizer",
        "photo-qr-code"
      ]
    },
    "bn": {
      "name": "ব্যাকগ্রাউন্ড রিমুভার",
      "title": "অনলাইন ব্যাকগ্রাউন্ড রিমুভার — Ahadex Tools",
      "description": "কোনো পেইড সাবস্ক্রিপশন ছাড়া সরাসরি ব্রাউজারে ছবির ব্যাকগ্রাউন্ড মুছে স্বচ্ছ বা নীল ব্যাকগ্রাউন্ড বানান বিনামূল্যে।",
      "h1": "ছবির ব্যাকগ্রাউন্ড রিমুভার",
      "intro": "প্রোডাক্টের ছবি বা ব্যক্তিগত ছবির ব্যাকগ্রাউন্ড সহজে পরিবর্তন করে স্বচ্ছ বা পাসপোর্ট সাইজ নীল ব্যাকগ্রাউন্ড তৈরি করুন।",
      "howToUse": [
        "আপনার ছবিটি আপলোড করুন।",
        "পছন্দের ব্যাকগ্রাউন্ড (স্বচ্ছ, সাদা বা নীল) সিলেক্ট করুন।",
        "\"ব্যাকগ্রাউন্ড সরান\" বাটনে ক্লিক করে ফলাফল দেখুন এবং PNG ডাউনলোড করুন।"
      ],
      "privacy": "ছবি সম্পূর্ণ লোকাল ডিভাইসে প্রসেস হয়, কোনো সার্ভারে আপলোড করা হয় না।",
      "limitations": "সাবজেক্ট এবং ব্যাকগ্রাউন্ডের মধ্যে ভালো কনট্রাস্ট থাকলে সেরা ফলাফল পাওয়া যায়।",
      "faq": [
        {
          "question": "পাসপোর্ট ছবির জন্য কি নীল ব্যাকগ্রাউন্ড দেওয়া যাবে?",
          "answer": "হ্যাঁ, \"পাসপোর্ট সাইজ নীল\" বাটনে এক ক্লিকেই নীল ব্যাকগ্রাউন্ড পেয়ে যাবেন।"
        },
        {
          "question": "ডাউনলোডের জন্য কি টাকা দিতে হবে?",
          "answer": "না, এটি সম্পূর্ণ বিনামূল্যে ও সীমাহীন ব্যবহারযোগ্য।"
        }
      ],
      "relatedSlugs": [
        "image-compressor",
        "png-to-jpg",
        "image-resizer",
        "photo-qr-code"
      ]
    }
  },
  {
    "id": "image-to-text",
    "slug": "image-to-text",
    "category": "text",
    "categoryName": "Text",
    "en": {
      "name": "Image to Text / OCR",
      "title": "Image to Text Converter (OCR) — Ahadex Tools",
      "description": "Extract readable text from photos and screenshots using in-browser OCR. Supports English, Bengali, Hindi, and 100+ languages.",
      "h1": "Image to Text Converter (OCR)",
      "intro": "Convert photographed documents, book pages, receipts, and screenshots into selectable, editable text with support for English, Bengali, and multiple global scripts.",
      "howToUse": [
        "Upload your image containing text (JPG, PNG, or WebP).",
        "Select the primary language of the text (e.g. English, Bengali, Hindi, Spanish).",
        "Click \"Extract Text with OCR\" and copy to clipboard or download as TXT / Word (.docx)."
      ],
      "privacy": "Optical Character Recognition runs client-side via WebAssembly. Your documents are never uploaded to cloud servers.",
      "limitations": "Text recognition accuracy depends on photo clarity, lighting, and resolution. Blurry or low-resolution images may produce recognition errors.",
      "faq": [
        {
          "question": "Does this OCR support Bengali text?",
          "answer": "Yes! Tesseract OCR supports Bengali (বাংলা), English, and mixed bilingual documents with high accuracy."
        },
        {
          "question": "Can I export the extracted text to Microsoft Word?",
          "answer": "Yes! Click \"Download Word\" to receive a formatted .docx document immediately."
        }
      ],
      "relatedSlugs": [
        "pdf-to-text",
        "word-counter",
        "pdf-to-word",
        "photo-qr-code"
      ]
    },
    "bn": {
      "name": "ছবি থেকে টেক্সট (OCR)",
      "title": "অনলাইন ছবি থেকে টেক্সট কনভার্টার (OCR) — Ahadex Tools",
      "description": "বইয়ের পাতা, রসিদ বা ডকুমেন্টের ছবি থেকে বাংলা ও ইংরেজি লেখা নিমেষেই কপি ও ওয়ার্ড ফাইলে ডাউনলোড করুন।",
      "h1": "ছবি থেকে টেক্সট এক্সট্রাক্ট (OCR)",
      "intro": "ছবিতে থাকা যেকোনো লেখা টাইপ করার ঝামেলা ছাড়াই স্বয়ংক্রিয় OCR প্রযুক্তির মাধ্যমে সরাসরি এডিটেবল লেখায় রূপান্তর করুন।",
      "howToUse": [
        "লেখা থাকা ছবিটি আপলোড করুন।",
        "ছবির ভাষা (বাংলা, ইংরেজি ইত্যাদি) সিলেক্ট করুন।",
        "\"টেক্সট এক্সট্রাক্ট করুন\" বাটনে ক্লিক করে লেখা কপি করুন অথবা Word (.docx) ফাইল ডাউনলোড করুন।"
      ],
      "privacy": "OCR ইঞ্জিন সরাসরি আপনার ব্রাউজারে চলে, ফাইল কখনো সার্ভারে যায় না।",
      "limitations": "ছবি যত পরিষ্কার এবং স্পষ্ট হবে, লেখার নির্ভুলতা তত বেশি হবে।",
      "faq": [
        {
          "question": "বাংলা বইয়ের পাতা কি স্ক্যান করা যাবে?",
          "answer": "হ্যাঁ, বাংলা অপশন সিলেক্ট করলে পরিষ্কার বাংলা লেখা নিখুঁতভাবে শনাক্ত করে।"
        },
        {
          "question": "ওয়ার্ড ফাইলে সেভ করা যাবে?",
          "answer": "হ্যাঁ, এক ক্লিকেই .TXT অথবা .DOCX ফাইল ডাউনলোড করা যায়।"
        }
      ],
      "relatedSlugs": [
        "pdf-to-text",
        "word-counter",
        "pdf-to-word",
        "photo-qr-code"
      ]
    }
  },
  {
    "id": "pdf-page-extractor",
    "slug": "pdf-page-extractor",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "PDF Page Extractor",
      "title": "PDF Page Extractor — Ahadex Tools",
      "description": "View page thumbnails and visually select specific pages from a PDF to export into a new document. 100% private in-browser tool.",
      "h1": "PDF Page Extractor",
      "intro": "Browse visual thumbnails of every page in your PDF document, click to select the exact pages you want, and generate a new custom PDF document in seconds.",
      "howToUse": [
        "Upload your PDF document.",
        "Click on the visual page thumbnails to select or deselect pages.",
        "Click \"Extract Selected Pages to PDF\" and download your newly created document."
      ],
      "privacy": "Thumbnails and extracted PDFs are compiled locally in browser memory without sending data to servers.",
      "limitations": "For huge PDFs over 100 pages, the first 100 thumbnails are previewed visually for optimal memory performance.",
      "faq": [
        {
          "question": "How is this different from Split PDF?",
          "answer": "Split PDF requires typing page numbers (e.g. 1-3), while Page Extractor lets you see visual thumbnails and click to select pages directly."
        },
        {
          "question": "Are extracted pages re-compressed or altered?",
          "answer": "No. Original vector fidelity and fonts are preserved identically."
        }
      ],
      "relatedSlugs": [
        "split-pdf",
        "pdf-rotate",
        "merge-pdf",
        "pdf-to-jpg"
      ]
    },
    "bn": {
      "name": "PDF পৃষ্ঠা এক্সট্রাক্টর",
      "title": "অনলাইন PDF পৃষ্ঠা এক্সট্রাক্টর — Ahadex Tools",
      "description": "থাম্বনেইল দেখে এক ক্লিকে প্রয়োজনীয় পৃষ্ঠাগুলো বেছে নিয়ে নতুন PDF তৈরি ও ডাউনলোড করুন সম্পূর্ণ বিনামূল্যে।",
      "h1": "PDF পৃষ্ঠা এক্সট্রাক্টর",
      "intro": "পেজ নম্বর মুখস্থ না রেখে সরাসরি প্রতিটি পৃষ্ঠার ছবি দেখে দেখে প্রয়োজনীয় পৃষ্ঠাগুলো আলাদা ফাইলে রূপান্তর করুন।",
      "howToUse": [
        "আপনার PDF ফাইল আপলোড করুন।",
        "প্রদর্শিত থাম্বনেইলগুলোর ওপর ক্লিক করে কাঙ্ক্ষিত পৃষ্ঠাগুলো নির্বাচন করুন।",
        "\"নির্বাচিত পৃষ্ঠা দিয়ে নতুন PDF বানান\" বাটনে ক্লিক করে সাথে সাথে ডাউনলোড করুন।"
      ],
      "privacy": "সম্পূর্ণ প্রক্রিয়াটি আপনার নিজস্ব ডিভাইসের ব্রাউজারে সম্পন্ন হয়।",
      "limitations": "বড় ফাইলের ক্ষেত্রে মেমরি সেভ রাখতে ১০০টি পেজ পর্যন্ত থাম্বনেইল দেখানো হয়।",
      "faq": [
        {
          "question": "একাধিক পেজ কীভাবে সিলেক্ট করব?",
          "answer": "প্রতিটি পেজের ওপর ক্লিক করলেই টিক চিহ্ন উঠবে এবং সিলেক্ট হয়ে যাবে।"
        },
        {
          "question": "ফাইলের কোয়ালিটি কি ঠিক থাকবে?",
          "answer": "হ্যাঁ, মূল ফাইলের টেক্সট ও ছবি হুবহু অক্ষত থাকবে।"
        }
      ],
      "relatedSlugs": [
        "split-pdf",
        "pdf-rotate",
        "merge-pdf",
        "pdf-to-jpg"
      ]
    }
  },
  {
    "id": "pdf-rotate",
    "slug": "pdf-rotate",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "PDF Rotate",
      "title": "Rotate PDF Online — Ahadex Tools",
      "description": "Rotate individual pages or all pages of a PDF document by 90, 180, or 270 degrees. Fast, free, and completely client-side.",
      "h1": "Rotate PDF Pages Online",
      "intro": "Fix upside down or sideways scanned documents permanently by rotating individual pages or all pages simultaneously with real-time visual feedback.",
      "howToUse": [
        "Select or drag & drop your PDF file.",
        "Rotate individual pages using the +90° buttons or click \"Rotate All\" to turn the entire document.",
        "Click \"Save Rotated PDF\" to download your permanently corrected document."
      ],
      "privacy": "Orientation metadata is updated directly inside your browser. No files are uploaded to any server.",
      "limitations": "Changes are applied to the orientation tag of the PDF; original content is preserved without degradation.",
      "faq": [
        {
          "question": "Will the rotation be permanent when I open the PDF on other devices?",
          "answer": "Yes! The rotation angle is permanently embedded into the PDF structure, ensuring it displays correctly on all phones and computers."
        },
        {
          "question": "Can I rotate just one upside-down page?",
          "answer": "Yes! Every page has its own individual rotate button so you can rotate only the specific pages that need fixing."
        }
      ],
      "relatedSlugs": [
        "pdf-page-extractor",
        "split-pdf",
        "merge-pdf",
        "compress-pdf"
      ]
    },
    "bn": {
      "name": "রোটেট PDF",
      "title": "অনলাইন রোটেট PDF — Ahadex Tools",
      "description": "PDF ডকুমেন্টের একক পেজ বা সব পেজ ঘুরিয়ে স্থায়ীভাবে সোজা করুন সম্পূর্ণ বিনামূল্যে ও নিরাপদে।",
      "h1": "PDF পৃষ্ঠা ঘোরান ও সোজা করুন",
      "intro": "স্ক্যান করার সময় উল্টো হওয়া ডকুমেন্টকে এক ক্লিকে ঘুরিয়ে স্থায়ীভাবে সোজা করে সেভ করুন।",
      "howToUse": [
        "আপনার PDF ফাইলটি সিলেক্ট করুন।",
        "নির্দিষ্ট পৃষ্ঠার নিচে থাকা বাটন দিয়ে অথবা \"সবগুলো ঘুরান\" বাটন দিয়ে সোজা করুন।",
        "\"ঘোরানো PDF সেভ করুন\" বাটনে ক্লিক করে ফাইলটি ডাউনলোড করে নিন।"
      ],
      "privacy": "সব প্রসেসিং আপনার ব্রাউজারে হয়, কোনো ক্লাউড সার্ভারে যায় না।",
      "limitations": "মূল ডকুমেন্টের ভেতরের কোনো লেখা বা ছবির মান পরিবর্তন হয় না।",
      "faq": [
        {
          "question": "অন্য ডিভাইসে ওপেন করলেও কি সোজা দেখাবে?",
          "answer": "হ্যাঁ, নতুন ফাইলে অ্যাঙ্গেল স্থায়ীভাবে সেট হয়ে যায়, তাই সব ডিভাইসেই সোজা থাকবে।"
        },
        {
          "question": "শুধু ১টি পেজ ঘোরানো যাবে?",
          "answer": "হ্যাঁ, যেকোনো একক পৃষ্ঠা আলাদাভাবে ঘোরানো যায়।"
        }
      ],
      "relatedSlugs": [
        "pdf-page-extractor",
        "split-pdf",
        "merge-pdf",
        "compress-pdf"
      ]
    }
  },
  {
    "id": "pdf-to-png",
    "slug": "pdf-to-png",
    "category": "documents",
    "categoryName": "Documents",
    "en": {
      "name": "PDF to PNG",
      "title": "PDF to PNG Converter — Ahadex Tools",
      "description": "Convert PDF document pages to high-resolution, lossless PNG images. Download individual pages or all pages as a ZIP archive.",
      "h1": "PDF to PNG Converter",
      "intro": "Convert PDF pages into ultra-crisp, lossless PNG images preserving sharp vector typography, lines, diagrams, and transparent layers.",
      "howToUse": [
        "Upload your PDF file.",
        "Select resolution quality (Standard, Retina 2x, or 300 DPI Ultra).",
        "Click \"Convert All Pages to PNG\" and download individual PNGs or all as a ZIP."
      ],
      "privacy": "Pages are rendered locally using PDF.js and Canvas APIs with zero server latency or data sharing.",
      "limitations": "Lossless PNG images are larger in file size than lossy JPGs because they preserve perfect pixel-level clarity.",
      "faq": [
        {
          "question": "Why choose PNG instead of JPG for PDF conversion?",
          "answer": "PNG uses lossless compression, meaning text, diagrams, and logos remain razor-sharp without JPEG compression artifacts."
        },
        {
          "question": "Can I download all pages as a single ZIP file?",
          "answer": "Yes! Click \"Download All as ZIP\" to get every page neatly packaged and numbered."
        }
      ],
      "relatedSlugs": [
        "pdf-to-jpg",
        "pdf-to-text",
        "jpg-to-pdf",
        "merge-pdf"
      ]
    },
    "bn": {
      "name": "PDF থেকে PNG কনভার্টার",
      "title": "অনলাইন PDF থেকে PNG কনভার্টার — Ahadex Tools",
      "description": "ডকুমেন্ট ও ডায়াগ্রামের শার্পনেস অক্ষুণ্ণ রেখে PDF থেকে হাই-কোয়ালিটি PNG ছবি তৈরি ও ডাউনলোড করুন।",
      "h1": "PDF থেকে PNG কনভার্টার",
      "intro": "ডকুমেন্টের চার্ট, ডায়াগ্রাম ও টেক্সটকে বিন্দুমাত্র কোয়ালিটি লস ছাড়া ঝকঝকে PNG ছবিতে রূপান্তর করুন।",
      "howToUse": [
        "আপনার PDF ফাইল আপলোড করুন।",
        "প্রয়োজনে রেজোলিউশন (স্ট্যান্ডার্ড বা রেটিনা ২x) নির্ধারণ করুন।",
        "\"PNG ছবিতে রূপান্তর করুন\" বাটনে ক্লিক করে একক বা জিপ ফাইল ডাউনলোড করুন।"
      ],
      "privacy": "সম্পূর্ণ কনভার্শন আপনার ব্রাউজার মেমরিতে স্থানীয়ভাবে সম্পন্ন হয়।",
      "limitations": "লসলেস কোয়ালিটি হওয়ায় PNG ছবির ফাইলের আকার JPG-এর চেয়ে কিছুটা বড় হতে পারে।",
      "faq": [
        {
          "question": "লেখা ও লাইনগুলো কি স্পষ্ট থাকবে?",
          "answer": "হ্যাঁ, PNG ফরম্যাটে কোনো আর্টফ্যাক্ট তৈরি হয় না, তাই টেক্সট অতি স্পষ্ট থাকে।"
        },
        {
          "question": "সবগুলো পেজ একসাথে জিপে পাওয়া যাবে?",
          "answer": "হ্যাঁ, এক ক্লিকেই সব পেজ জিপ ফাইলে ডাউনলোড করা সম্ভব।"
        }
      ],
      "relatedSlugs": [
        "pdf-to-jpg",
        "pdf-to-text",
        "jpg-to-pdf",
        "merge-pdf"
      ]
    }
  },
  {
    "id": "password-generator",
    "slug": "password-generator",
    "category": "developer",
    "categoryName": "Developer",
    "en": {
      "name": "Password Generator",
      "title": "Strong Password Generator — Ahadex Tools",
      "description": "Generate strong, cryptographically secure random passwords in your browser. 100% local using Web Crypto API with strength meter.",
      "h1": "Strong Password Generator",
      "intro": "Create uncrackable, cryptographically secure random passwords using your browser's native Web Crypto API with customizable length, symbols, and batch generation.",
      "howToUse": [
        "Adjust the password length slider (6 to 64 characters).",
        "Toggle desired character sets (Uppercase, Lowercase, Numbers, Symbols).",
        "Click the copy button to copy the password instantly to your clipboard."
      ],
      "privacy": "Passwords are generated exclusively in your browser using crypto.getRandomValues(). No passwords are ever stored or sent over the internet.",
      "limitations": "Never share your master passwords or write them in unprotected plaintext documents.",
      "faq": [
        {
          "question": "How secure are the generated passwords?",
          "answer": "Extremely secure. They use the browser's cryptographically secure pseudo-random number generator (CSPRNG), not weak Math.random()."
        },
        {
          "question": "Can I generate multiple passwords at once?",
          "answer": "Yes! Choose the Batch Quantity option (up to 10) to generate multiple passwords simultaneously."
        }
      ],
      "relatedSlugs": [
        "color-picker",
        "json-formatter",
        "word-counter"
      ]
    },
    "bn": {
      "name": "পাসওয়ার্ড জেনারেটর",
      "title": "অনলাইন শক্তিশালী পাসওয়ার্ড জেনারেটর — Ahadex Tools",
      "description": "সম্পূর্ণ নিরাপদ ও হ্যাক-প্রুফ র‍্যান্ডম পাসওয়ার্ড তৈরি করুন ওয়েব ক্রিপ্টো এপিআই দিয়ে শতভাগ গোপনে।",
      "h1": "নিরাপদ পাসওয়ার্ড জেনারেটর",
      "intro": "সোশ্যাল মিডিয়া, ইমেইল ও ব্যাংকিং অ্যাকাউন্টের সুরক্ষায় অত্যন্ত শক্তিশালী ও অনুমান-অসম্ভব পাসওয়ার্ড তৈরি করুন।",
      "howToUse": [
        "পাসওয়ার্ডের দৈর্ঘ্য (যেমন ১৬ বা ২০ অক্ষর) নির্ধারণ করুন।",
        "প্রতীক, সংখ্যা ও বড় হাতের অক্ষরের রুলস সিলেক্ট করুন।",
        "কপি বাটনে ক্লিক করে সাথে সাথে নিরাপদ পাসওয়ার্ড ব্যবহার করুন।"
      ],
      "privacy": "পাসওয়ার্ড আপনার ব্রাউজারের ক্রিপ্টো ইঞ্জিনে তৈরি হয়, কোনো সার্ভার এটি দেখতে পায় না।",
      "limitations": "গুরুত্বপূর্ণ পাসওয়ার্ড সুরক্ষিত পাসওয়ার্ড ম্যানেজারে সংরক্ষণ করুন।",
      "faq": [
        {
          "question": "এই পাসওয়ার্ডগুলো কি সত্যিই নিরাপদ?",
          "answer": "হ্যাঁ, এতে ক্রিপ্টোগ্রাফিক CSPRNG অ্যালগরিদম ব্যবহৃত হয় যা সাধারণ পদ্ধতিতে ক্র্যাক করা অসম্ভব।"
        },
        {
          "question": "একসাথে একাধিক পাসওয়ার্ড তৈরি করা যাবে?",
          "answer": "হ্যাঁ, একসাথে সর্বোচ্চ ১০টি পর্যন্ত পাসওয়ার্ড তৈরি করে তালিকা থেকে পছন্দ করতে পারেন।"
        }
      ],
      "relatedSlugs": [
        "color-picker",
        "json-formatter",
        "word-counter"
      ]
    }
  }
];

export const staticPages = {
  '': {
    en: {
      title: 'Ahadex Tools — Free Online Tools',
      description: 'Fast, useful browser tools for images, documents, text and developer tasks. No account required.',
      h1: 'Everyday digital tasks, done in seconds.',
      eyebrow: 'FAST & PRIVATE ONLINE TOOLS',
      intro: 'Handcrafted browser utilities designed to solve everyday tasks instantly. Your files are processed locally in your browser and are not uploaded to servers.',
    },
    bn: {
      title: 'ফ্রি অনলাইন ব্রাউজার টুলস — Ahadex Tools',
      description: 'ছবি, ডকুমেন্ট, টেক্সট এবং ডেভেলপারদের জন্য দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস। কোনো সার্ভার আপলোড ছাড়া শতভাগ নিরাপদ।',
      h1: 'কঠিন ও জটিল কাজগুলো এবার হবে নিমেষেই সহজ।',
      eyebrow: 'দ্রুত ও নিরাপদ অনলাইন টুলস',
      intro: 'দৈনন্দিন কাজের জন্য তৈরি দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস। আপনার ফাইল নিরাপদে লোকাল ব্রাউজারে প্রসেস হয় এবং সার্ভারে আপলোড করা হয় না।',
    },
  },
  tools: {
    en: {
      title: 'Online Tool Library — Ahadex Tools',
      description: 'Handcrafted browser utilities designed to solve everyday tasks instantly. Your files are processed locally in your browser and are not uploaded to servers.',
      h1: 'Smart tools for swift work.',
      eyebrow: 'TOOL CATALOG',
      intro: 'Handcrafted browser utilities designed to solve everyday tasks instantly. Pick a tool, do what needs doing, and get on with your day.',
    },
    bn: {
      title: 'টুলস সংগ্রহশালা — Ahadex Tools',
      description: 'দৈনন্দিন কাজের জন্য তৈরি দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস। আপনার ফাইল নিরাপদে লোকাল ব্রাউজারে প্রসেস হয় এবং সার্ভারে আপলোড করা হয় না।',
      h1: 'সহজ সমাধান, দ্রুত কাজের নিশ্চয়তা।',
      eyebrow: 'টুলস ক্যাটালগ',
      intro: 'দৈনন্দিন কাজের জন্য তৈরি সহজ ও দ্রুত ব্রাউজার টুলস। কোনো ঝামেলা বা রেজিস্ট্রেশন ছাড়া সরাসরি ব্রাউজারে ফাইল প্রসেস করুন।',
    },
  },
  about: {
    en: {
      title: 'About Ahadex Tools',
      description: 'Learn why Ahadex Tools exists and how we build useful, accessible browser utilities.',
      h1: 'The internet has enough complicated helpers.',
      eyebrow: 'ABOUT US',
      intro: 'Ahadex Tools was built on a simple premise: everyday digital tasks should not require an account, a paid subscription, or uploading private files to mysterious remote servers.',
    },
    bn: {
      title: 'আমাদের সম্পর্কে — Ahadex Tools',
      description: 'Ahadex Tools কেন তৈরি এবং কীভাবে আমরা নির্ভরযোগ্য ব্রাউজার ইউটিলিটি তৈরি করি তা জানুন।',
      h1: 'ইন্টারনেটে অতিরিক্ত জটিলতার বিপরীতে এক সরল মাধ্যম।',
      eyebrow: 'আমাদের সম্পর্কে',
      intro: 'Ahadex Tools তৈরি হয়েছে একটি সহজ আদর্শ নিয়ে: দৈনন্দিন কাজের জন্য কোনো অ্যাকাউন্ট খোলা, সাবস্ক্রিপশন কেনা কিংবা ব্যক্তিগত ফাইল অচেনা সার্ভারে পাঠানোর প্রয়োজন নেই।',
    },
  },
  contact: {
    en: {
      title: 'Contact Ahadex Tools',
      description: 'Contact Ahadex Tools directly via email or WhatsApp support for assistance, suggestions, or feedback.',
      h1: 'Good tools start with good questions.',
      eyebrow: 'CONTACT US',
      intro: 'Have a suggestion for a new tool, found an edge case, or want to say hello? Reach out directly via email or WhatsApp.',
    },
    bn: {
      title: 'যোগাযোগ করুন — Ahadex Tools',
      description: 'সরাসরি ইমেইল বা হোয়াটসঅ্যাপের মাধ্যমে Ahadex Tools টিমের সাথে যোগাযোগ করুন।',
      h1: 'যেকোনো প্রয়োজনে সরাসরি আমাদের সাথে যুক্ত হোন।',
      eyebrow: 'যোগাযোগ করুন',
      intro: 'নতুন কোনো টুলের প্রস্তাবনা, কোনো ত্রুটির রিপোর্ট কিংবা যেকোনো ফিডব্যাকের জন্য সরাসরি আমাদের ইমেইল বা হোয়াটসঅ্যাপে বার্তা পাঠান।',
    },
  },
  'privacy-policy': {
    en: {
      title: 'Privacy Policy — Ahadex Tools',
      description: 'Read how Ahadex Tools handles browser preferences, optional analytics and local file processing.',
      h1: 'Privacy Policy',
      eyebrow: 'LEGAL & PRIVACY',
      intro: 'We believe personal privacy is a fundamental human right. Here is our straightforward explanation of how data is handled.',
    },
    bn: {
      title: 'গোপনীয়তা নীতি — Ahadex Tools',
      description: 'Ahadex Tools আপনার ডেটা এবং ব্রাউজার ফাইল প্রসেসিং কীভাবে পরিচালনা করে তা পড়ুন।',
      h1: 'গোপনীয়তা নীতি',
      eyebrow: 'আইনি ও নীতিমালা',
      intro: 'আমরা বিশ্বাস করি ব্যক্তিগত গোপনীয়তা একটি মৌলিক অধিকার। আমরা কীভাবে ডেটা পরিচালনা করি তার সহজ ও স্বচ্ছ বিবরণ নিচে দেওয়া হলো।',
    },
  },
  terms: {
    en: {
      title: 'Terms of Use — Ahadex Tools',
      description: 'Read the terms for using Ahadex Tools and its browser-based utilities.',
      h1: 'Terms of Use',
      eyebrow: 'LEGAL',
      intro: 'By accessing or using Ahadex Tools, you agree to these clear and fair usage terms.',
    },
    bn: {
      title: 'ব্যবহারের শর্তাবলী — Ahadex Tools',
      description: 'Ahadex Tools ব্যবহারের নিয়মাবলী ও শর্তসমূহ।',
      h1: 'ব্যবহারের শর্তাবলী',
      eyebrow: 'আইনি ও শর্তাবলী',
      intro: 'Ahadex Tools ব্যবহারের মাধ্যমে আপনি আমাদের স্পষ্ট ও ন্যায়সঙ্গত শর্তাবলীতে সম্মতি জানাচ্ছেন।',
    },
  },
  disclaimer: {
    en: {
      title: 'Disclaimer — Ahadex Tools',
      description: 'Important information about Ahadex Tools outputs, limitations and responsible use.',
      h1: 'Disclaimer',
      eyebrow: 'LEGAL NOTICE',
      intro: 'Important information regarding client-side processing, tool accuracy, and responsible use.',
    },
    bn: {
      title: 'দাবিত্যাগ — Ahadex Tools',
      description: 'Ahadex Tools ব্যবহারের ফলাফল ও দায়মুক্তি সম্পর্কিত তথ্য।',
      h1: 'দাবিত্যাগ',
      eyebrow: 'আইনি বিজ্ঞপ্তি',
      intro: 'ক্লায়েন্ট-সাইড প্রসেসিং, টুলের ফলাফল ও দায়মুক্তি সম্পর্কিত গুরুত্বপূর্ণ তথ্যাবলী।',
    },
  },
  'cookie-policy': {
    en: {
      title: 'Cookie Policy — Ahadex Tools',
      description: 'Learn which essential storage Ahadex Tools uses and how optional measurement consent works.',
      h1: 'Cookie Policy',
      eyebrow: 'STORAGE & COOKIES',
      intro: 'Clear transparency on our minimal storage practices and cookie controls.',
    },
    bn: {
      title: 'কুকি নীতি — Ahadex Tools',
      description: 'Ahadex Tools এর স্টোরেজ ও কুকি ব্যবহারের নিয়মাবলী।',
      h1: 'কুকি নীতি',
      eyebrow: 'স্টোরেজ ও কুকিজ',
      intro: 'আমাদের ব্রাউজার স্টোরেজ ব্যবহার ও কুকি সংক্রান্ত স্বচ্ছ নীতিমালা।',
    },
  },
  accessibility: {
    en: {
      title: 'Accessibility — Ahadex Tools',
      description: 'Learn about Ahadex Tools accessibility goals, keyboard support and reduced motion options.',
      h1: 'Accessibility Statement',
      eyebrow: 'INCLUSION',
      intro: 'We are committed to making digital tools accessible, fast, and usable for everyone.',
    },
    bn: {
      title: 'অ্যাক্সেসিবিলিটি — Ahadex Tools',
      description: 'Ahadex Tools এর কীবোর্ড ও রিডিউসড-মোশন অ্যাক্সেসিবিলিটি তথ্য।',
      h1: 'অ্যাক্সেসিবিলিটি বিবৃতি',
      eyebrow: 'সবার জন্য সহজপ্রবেশ্যতা',
      intro: 'প্রতিটি মানুষের জন্য সহজ, সুন্দর ও অ্যাক্সেসযোগ্য ডিজিটাল টুলস গড়ে তোলাই আমাদের লক্ষ্য।',
    },
  },
};
