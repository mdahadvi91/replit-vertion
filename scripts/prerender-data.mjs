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
