import type { ToolDefinition } from '@/registry/tool-registry';

export interface EditorialGuideData {
  howItWorksTitle: string;
  howItWorksIntro: string;
  technicalSteps: Array<{ title: string; desc: string }>;
  proTipsTitle: string;
  proTips: string[];
  useCasesTitle: string;
  useCases: Array<{ role: string; scenario: string; benefit: string }>;
  comparisonTitle: string;
  comparisonItems: Array<{ feature: string; local: string; cloud: string }>;
  troubleshootingTitle: string;
  troubleshooting: Array<{ problem: string; solution: string }>;
  extendedFaqTitle: string;
  extendedFaqs: Array<{ q: string; a: string }>;
}

export function getEditorialGuide(tool: ToolDefinition, lang: 'en' | 'bn'): EditorialGuideData {
  const isBn = lang === 'bn';
  const slug = tool.slug;
  const name = tool.name;
  const cat = tool.category;

  // Category specific technical details
  if (cat === 'Documents' || slug.includes('pdf')) {
    return {
      howItWorksTitle: isBn ? `${name} কীভাবে কাজ করে ও ভেতরের প্রযুক্তি` : `How ${name} Works: Technical Architecture`,
      howItWorksIntro: isBn
        ? `এই টুলটি ক্লায়েন্ট-সাইড WebAssembly এবং HTML5 স্যান্ডবক্স মেমোরি ব্যবহার করে সরাসরি আপনার ব্রাউজারে PDF ফাইল পার্স ও প্রসেস করে। কোনো ফাইল কোনো রিমোট সার্ভারে আপলোড করা হয় না।`
        : `This tool operates entirely within your browser thread using WebAssembly and client-side PDF document manipulation engines. Your files never leave your local device memory.`,
      technicalSteps: [
        {
          title: isBn ? '১. লোকাল বাফার লোডিং' : '1. Local Buffer Ingestion',
          desc: isBn
            ? 'ব্রাউজারের FileReader API দিয়ে ফাইলটি শুধুমাত্র আপনার কম্পিউটারের র‍্যামে (RAM) অ্যারেবাফার হিসেবে পড়া হয়।'
            : 'The document bytes are read into an in-memory ArrayBuffer via the browser FileReader API without touching any network socket.',
        },
        {
          title: isBn ? '২. অবজেক্ট স্ট্রিম ডিকোডিং' : '2. Object Stream Processing',
          desc: isBn
            ? 'PDF-এর ক্রস-রেফারেন্স (XRef) টেবিল এবং অবজেক্ট স্ট্রিমগুলো লোকাল ইঞ্জিন দিয়ে নিরাপদে বিশ্লেষণ করা হয়।'
            : 'Cross-reference tables (XRef), dictionary streams, and content tokens are parsed and transformed in real-time.',
        },
        {
          title: isBn ? '৩. অপ্টিমাইজড রেন্ডারিং ও এক্সপোর্ট' : '3. Clean Output Serialization',
          desc: isBn
            ? 'প্রক্রিয়াকরণ শেষে নতুন ডকুমেন্ট তৈরি করে একটি লোকাল ব্লব (Blob) লিংক দেওয়া হয়, যা পেজ রিলোড করলেই মেমোরি থেকে মুছে যায়।'
            : 'The output file is serialized directly into a temporary local Blob URL that automatically releases upon download or tab close.',
        },
      ],
      proTipsTitle: isBn ? 'সেরা ফলাফলের জন্য প্রয়োজনীয় টিপস' : 'Pro Tips for Optimal Results',
      proTips: [
        isBn
          ? 'স্ক্যান করা ডকুমেন্টের ক্ষেত্রে নিশ্চিত করুন মূল ফাইলের রেজোলিউশন ৩০০ DPI বা তার বেশি, যাতে টেক্সট স্পষ্ট থাকে।'
          : 'For scanned papers, ensure the original scan is at least 300 DPI to maintain optimal visual legibility.',
        isBn
          ? 'পাসওয়ার্ড সুরক্ষিত PDF প্রসেস করার আগে পাসওয়ার্ড সরিয়ে নিন অথবা আনলক করে আপলোড করুন।'
          : 'If your PDF is password-protected, remove password encryption before loading to ensure clean stream processing.',
        isBn
          ? 'বড় বই বা শত পৃষ্ঠার ফাইলের ক্ষেত্রে ব্রাউজারে পর্যাপ্ত র‍্যাম ফাঁকা রেখে প্রসেস করলে কাজ দ্রুত সম্পন্ন হয়।'
          : 'When handling large documents (100+ pages), closing background browser tabs will accelerate in-memory processing.',
      ],
      useCasesTitle: isBn ? 'বাস্তব জীবনের জনপ্রিয় ব্যবহার ক্ষেত্র' : 'Real-World Use Cases',
      useCases: [
        {
          role: isBn ? 'চাকরিপ্রার্থী ও পেশাজীবী' : 'Job Applicants & Professionals',
          scenario: isBn ? 'সিভি (CV), শিক্ষাগত সনদ ও কভার লেটার নির্দিষ্ট সাইজ লিমিটে তৈরি করা।' : 'Formatting CVs, diplomas, and cover letters to meet strict online job portal file size caps.',
          benefit: isBn ? 'ব্যক্তিগত তথ্য শতভাগ গোপন থাকে এবং কোনো ডেটা ফাঁস হয় না।' : 'Zero risk of identity theft or personal phone/address leakage to third-party databases.',
        },
        {
          role: isBn ? 'আইনজীবী ও ব্যবসায়িক প্রতিষ্ঠান' : 'Legal & Corporate Teams',
          scenario: isBn ? 'গোপনীয় চুক্তিপত্র, অডিট রিপোর্ট ও আদালতের নথি সংকলন ও প্রস্তুত করা।' : 'Handling confidential NDA agreements, financial balance sheets, and audit filings.',
          benefit: isBn ? 'GDPR এবং ডেটা প্রাইভেসি নিয়মাবলী সম্পূর্ণ অক্ষুণ্ণ থাকে।' : 'Full compliance with enterprise data privacy regulations and non-disclosure standards.',
        },
        {
          role: isBn ? 'শিক্ষার্থী ও গবেষক' : 'Students & Academic Researchers',
          scenario: isBn ? 'থিসিস পেপার, রেফারেন্স বই ও লেকচার নোট থেকে প্রয়োজনীয় অংশ আলাদা করা।' : 'Extracting chapters, merging research citations, and preparing thesis submissions.',
          benefit: isBn ? 'দ্রুত প্রসেসিং, কোনো ইন্টারনেট ব্যান্ডউইথ খরচ বা অপেক্ষা ছাড়া।' : 'Instant processing with zero wait queues or daily upload limitations.',
        },
      ],
      comparisonTitle: isBn ? 'Ahadex লোকাল টুল বনাম সাধারণ ক্লাউড সার্ভার টুল' : 'Ahadex In-Browser vs. Legacy Cloud Upload Converters',
      comparisonItems: [
        {
          feature: isBn ? 'ডেটা নিরাপত্তা ও প্রাইভেসি' : 'Data Privacy & Security',
          local: isBn ? '১০০% লোকাল। কোনো ফাইল সার্ভারে যায় না।' : '100% In-Browser. File bytes never cross the network.',
          cloud: isBn ? 'ক্লাউড সার্ভারে আপলোড হয় এবং সেখানে সাময়িক জমা থাকে।' : 'Uploaded to remote third-party cloud servers with data retention.',
        },
        {
          feature: isBn ? 'কাজের গতি' : 'Processing Speed',
          local: isBn ? 'তাত্ক্ষণিক লোকাল প্রসেসিং (ইন্টারনেট স্পিডের ওপর নির্ভর করে না)।' : 'Near-instant client-side CPU processing; zero upload delay.',
          cloud: isBn ? 'বড় ফাইল আপলোড ও ডাউনলোড হতে দীর্ঘ সময় লাগে।' : 'Slow due to uploading large MBs and waiting in server queues.',
        },
        {
          feature: isBn ? 'ব্যবহারের সীমা ও সাবস্ক্রিপশন' : 'Usage Limits & Pricing',
          local: isBn ? 'সম্পূর্ণ ফ্রি, কোনো অ্যাকাউন্ট তৈরি বা দৈনিক লিমিট নেই।' : 'Completely free. No account signup, no paywalls, no limits.',
          cloud: isBn ? 'দিনে ২-৩ বারের বেশি কাজ করতে গেলে টাকা দাবি করে।' : 'Often restricted to 2 tasks per day without paid subscription.',
        },
      ],
      troubleshootingTitle: isBn ? 'সম্ভাব্য সমস্যা ও দ্রুত সমাধান' : 'Troubleshooting & Common Questions',
      troubleshooting: [
        {
          problem: isBn ? 'ফাইলের আকার প্রত্যাশিত মাত্রায় কমেনি কেন?' : 'Why did my file size not shrink significantly?',
          solution: isBn
            ? 'আপনার মূল PDF-টি যদি আগেই উচ্চমাত্রায় কম্প্রেস করা থাকে, তবে নতুন করে রি-কম্প্রেশনে আকার বেশি কমে না। মূল ফাইলের আকারই সবচেয়ে উপযুক্ত।'
            : 'If your PDF is already heavily optimized, re-compressing cannot remove additional redundancy without destroying readability.',
        },
        {
          problem: isBn ? 'বাংলা যুক্তাক্ষর বা বিশেষ ফন্ট ভেঙে যায় কি?' : 'Are Unicode and complex Bengali scripts preserved?',
          solution: isBn
            ? 'আমাদের ইঞ্জিন ডিজিটাল টেক্সট স্ট্রিম অক্ষুণ্ণ রাখে। ভেক্টর টেক্সট মোডে মূল ফন্ট ও গ্লিফ অক্ষত থাকে।'
            : 'Our engine parses standard Unicode glyphs directly, preserving embedded fonts in stream optimization mode.',
        },
      ],
      extendedFaqTitle: isBn ? 'প্রয়োজনীয় প্রশ্নোত্তর (Extended FAQ)' : 'Frequently Asked Technical Questions',
      extendedFaqs: [
        {
          q: isBn ? 'আমার নথির তথ্য কি কেউ দেখতে পাবে?' : 'Can anyone access or view my uploaded documents?',
          a: isBn
            ? 'কখনোই না। প্রসেসিং সম্পূর্ণভাবে আপনার ব্রাউজার মেমরিতে সম্পন্ন হয়। আমাদের সার্ভারে ফাইল পাঠানো বা সংরক্ষণ করার কোনো ব্যাকএন্ড কোডই নেই।'
            : 'Absolutely not. All processing occurs strictly within your browser environment. Ahadex maintains no server storage or file logging.',
        },
        {
          q: isBn ? 'টুলটি কি মোবাইল এবং আইপ্যাডে কাজ করবে?' : 'Does this tool work smoothly on mobile browsers and iPads?',
          a: isBn
            ? 'হ্যাঁ, ক্রোম, সাফারি, ফায়ারফক্স বা এজ সহ যেকোনো আধুনিক মোবাইল ব্রাউজারে সম্পূর্ণ রেসপনসিভভাবে কাজ করে।'
            : 'Yes, full compatibility is guaranteed across Chrome, Safari, Firefox, and Edge on iOS, Android, macOS, and Windows.',
        },
        {
          q: isBn ? 'কোনো সফটওয়্যার বা এক্সটেনশন ইনস্টল করার দরকার আছে কি?' : 'Do I need to install any plugin, extension, or desktop software?',
          a: isBn
            ? 'না, কোনো সফটওয়্যার ইনস্টল করার প্রয়োজন নেই। শুধুমাত্র ব্রাউজারেই সরাসরি ব্যবহার করতে পারবেন।'
            : 'No software, plugin, or app installation is required. Everything runs natively via modern browser WebAssembly and Canvas standards.',
        },
        {
          q: isBn ? 'সর্বোচ্চ কত সাইজের ফাইল প্রসেস করা যায়?' : 'What is the maximum supported file size?',
          a: isBn
            ? 'সাধারণত ৫০ মেগাবাইট পর্যন্ত ফাইল অনায়াসে প্রসেস করা যায়। আপনার ডিভাইসের র‍্যাম বেশি থাকলে আরও বড় ফাইলও সম্ভব।'
            : 'Standard configurations handle files up to 50 MB smoothly. The only boundary is your local device available browser memory.',
        },
      ],
    };
  }

  // Image Processing Category
  if (cat === 'Images' || slug.includes('image') || slug.includes('jpg') || slug.includes('png') || slug.includes('heic') || slug.includes('webp')) {
    return {
      howItWorksTitle: isBn ? `${name} কীভাবে কাজ করে ও ইমেজ অপ্টিমাইজেশন প্রযুক্তি` : `How ${name} Works: Image Pipeline & Compression`,
      howItWorksIntro: isBn
        ? `এই টুলটি আধুনিক HTML5 Canvas, WebGL এবং ক্লায়েন্ট-সাইড এনকোডার প্রযুক্তি ব্যবহার করে আপনার ছবির রেজোলিউশন, কোয়ালিটি ও পিক্সেল ডেনসিটি রিয়েল-টাইমে অপ্টিমাইজ করে।`
        : `This tool utilizes modern HTML5 Canvas, 2D hardware-accelerated context, and local rasterization encoders to optimize pixel density, compression matrices, and color profiles directly on your GPU/CPU.`,
      technicalSteps: [
        {
          title: isBn ? '১. পিক্সেল ডিকোড ও মেমোরি ম্যাপিং' : '1. Pixel Decode & Bitmap Mapping',
          desc: isBn
            ? 'ব্রাউজারের ইমেজ ডিকোডার দিয়ে ছবির অরিজিনাল পিক্সেল অ্যারে লোকাল মেমরিতে লোড করা হয়।'
            : 'The image source is decoded into an uncompressed RGBA pixel array in local memory using createImageBitmap or HTMLImageElement.',
        },
        {
          title: isBn ? '২. ক্রোমা সাব-স্যাম্পলিং ও কোয়ালিটি এনকোডিং' : '2. Chroma Subsampling & Quantization',
          desc: isBn
            ? 'অপ্রয়োজনীয় মেটাডাটা (Exif) দূর করে কোয়ালিটি ম্যাট্রিক্স অনুযায়ী অপ্টিমাইজড আউটপুট তৈরি করা হয়।'
            : 'Unnecessary Exif metadata tags are cleanly stripped, and Discrete Cosine Transform (DCT) quantization compresses byte weight.',
        },
        {
          title: isBn ? '৩. আধুনিক ফরম্যাটে এক্সপোর্ট' : '3. Instant Local Blob Generation',
          desc: isBn
            ? 'ছবিটি তাৎক্ষণিকভাবে তৈরি করে একটি নিরাপদ ডাউনলোড ব্লব লিংক তৈরি করা হয়।'
            : 'The final optimized file is output as a local Blob without transmitting any photo data over the internet.',
        },
      ],
      proTipsTitle: isBn ? 'ছবির কোয়ালিটি বজায় রাখার সেরা টিপস' : 'Pro Tips for Crisp Images',
      proTips: [
        isBn
          ? 'ওয়েবসাইটের জন্য আধুনিক WebP ফরম্যাট নির্বাচন করুন, যা JPG-এর তুলনায় প্রায় ৩০-৫০% বেশি সাইজ সাশ্রয় করে।'
          : 'Choose modern WebP format for websites to achieve up to 30-50% smaller sizes than JPG at equivalent perceptual clarity.',
        isBn
          ? 'সোশ্যাল মিডিয়া বা প্রোফাইল ছবির জন্য ব্যালেন্সড প্রোফাইল ব্যবহার করুন, যাতে রঙ ও টেক্সচার নিখুঁত থাকে।'
          : 'Use the Balanced compression profile for photography to preserve facial textures and color gradations.',
        isBn
          ? 'লোগো, আইকন বা টেক্সটযুক্ত ছবির জন্য PNG অথবা হাই-কোয়ালিটি প্রোফাইল সবচেয়ে উপযুক্ত।'
          : 'For logos, sharp diagrams, or line graphics with transparent backgrounds, retain PNG format.',
      ],
      useCasesTitle: isBn ? 'জনপ্রিয় ব্যবহার ক্ষেত্রসমূহ' : 'Key Practical Use Cases',
      useCases: [
        {
          role: isBn ? 'ওয়েব ডেভেলপার ও ব্লগার' : 'Web Developers & Bloggers',
          scenario: isBn ? 'ওয়েব পেজের লোডিং স্পিড বাড়াতে এবং Core Web Vitals স্কোর উন্নত করতে ছবির সাইজ কমানো।' : 'Optimizing hero graphics and thumbnails to achieve 95+ PageSpeed Insights and fast Core Web Vitals.',
          benefit: isBn ? 'ওয়েবসাইট দ্রুত লোড হয় এবং গুগল র‍্যাংকিং উন্নত হয়।' : 'Dramatically reduced bounce rates, faster mobile load times, and better SEO performance.',
        },
        {
          role: isBn ? 'ই-কমার্স বিক্রেতা ও মার্চেন্ট' : 'E-Commerce Sellers & Merchants',
          scenario: isBn ? 'দারাজ, আমাজন বা শপিফাই স্টোরে পণ্যের ছবি আপলোড করার জন্য সঠিক ডাইমেনশন ও সাইজে রূপান্তর।' : 'Batch preparing product catalogs for Amazon, Shopify, or local online marketplaces.',
          benefit: isBn ? 'আপলোড রিজেকশন এড়ানো যায় এবং পণ্য দ্রুত দৃশ্যমান হয়।' : 'Guaranteed compliance with marketplace file size ceilings without fuzzy artifacts.',
        },
        {
          role: isBn ? 'ফটোগ্রাফার ও সাধারণ ব্যবহারকারী' : 'Photographers & Daily Users',
          scenario: isBn ? 'স্মার্টফোনে তোলা ভারী ছবি হোয়াটসঅ্যাপ, মেসেঞ্জার বা ইমেইলে সহজে শেয়ার করা।' : 'Downsizing large 20+ megapixel smartphone photos for fast email attachments and chat sharing.',
          benefit: isBn ? 'মোবাইল ডেটা সাশ্রয় হয় এবং নিমিষেই পাঠানো যায়।' : 'Instant sharing without chewing through mobile data caps.',
        },
      ],
      comparisonTitle: isBn ? 'Ahadex বনাম সাধারণ অনলাইন ফটো কনভার্টার' : 'Ahadex In-Browser vs. Remote Upload Tools',
      comparisonItems: [
        {
          feature: isBn ? 'ছবির ব্যক্তিগত নিরাপত্তা' : 'Photo Privacy & Copyright',
          local: isBn ? 'ছবি ডিভাইসেই থাকে; কোনো সার্ভার বা এআই মডেলে ব্যবহৃত হয় না।' : 'Photos never leave your device. Never used for AI training or stored on disk.',
          cloud: isBn ? 'থার্ড-পার্টি সার্ভারে সংরক্ষিত হতে পারে এবং ডেটা চুরির ঝুঁকি থাকে।' : 'Stored on remote cloud hosting with ambiguous data retention policies.',
        },
        {
          feature: isBn ? 'প্রসেসিং লেটেন্সি' : 'Processing Latency',
          local: isBn ? '১ সেকেন্ডেরও কম সময়ে লোকাল জেনারেট হয়।' : 'Instantaneous hardware-accelerated processing in sub-seconds.',
          cloud: isBn ? 'ইন্টারনেট স্পিডের ওপর নির্ভর করে আপলোড হওয়ার অপেক্ষা করতে হয়।' : 'Bound by network uplink speeds and cloud queue wait times.',
        },
        {
          feature: isBn ? 'ওয়াটারমার্ক বা হিডেন কস্ট' : 'Watermarks & Hidden Fees',
          local: isBn ? 'কোনো ওয়াটারমার্ক নেই, ১০০% ফ্রি ও আনলিমিটেড।' : 'Zero watermarks, zero subscription fees, unlimited usage.',
          cloud: isBn ? 'অনেক সময় ছবিতে ওয়াটারমার্ক বসায় বা ফুল সাইজের জন্য টাকা চায়।' : 'Frequently stamps intrusive watermarks unless an expensive plan is purchased.',
        },
      ],
      troubleshootingTitle: isBn ? 'সমস্যা ও সমাধান' : 'Troubleshooting & Tips',
      troubleshooting: [
        {
          problem: isBn ? 'ছবি কম্প্রেশনের পর ঘোলা দেখাচ্ছে কেন?' : 'Why does my picture appear blurry after reduction?',
          solution: isBn
            ? 'সর্বোচ্চ সাইজ হ্রাসের বদলে "ব্যালেন্সড" বা "হাই কোয়ালিটি" প্রোফাইল নির্বাচন করুন। এতে শার্পনেস অক্ষুণ্ণ থাকবে।'
            : 'Switch to the "Balanced" or "Light" profile rather than Maximum compression to preserve edge clarity.',
        },
        {
          problem: isBn ? 'PNG ছবির সাইজ কমছে না কেন?' : 'Why does my PNG file not decrease significantly?',
          solution: isBn
            ? 'PNG লসলেস ফরম্যাট। সাইজ বেশি কমাতে "Convert to WebP" অপশনটি চালু করুন।'
            : 'PNG uses lossless compression. Check the "Convert to WebP" option for up to 60% byte reduction.',
        },
      ],
      extendedFaqTitle: isBn ? 'সচরাচর জিজ্ঞাসিত প্রযুক্তিগত প্রশ্ন' : 'Technical Frequently Asked Questions',
      extendedFaqs: [
        {
          q: isBn ? 'আমার ছবি কি আপনাদের কাছে সংরক্ষিত থাকে?' : 'Are my personal images saved on your servers?',
          a: isBn
            ? 'কখনোই না। এই ওয়েবসাইটটি সম্পূর্ণ ক্লায়েন্ট-সাইড প্রযুক্তি দিয়ে তৈরি। আপনার ছবি আপনার ব্রাউজার ছাড়া পৃথিবীর কোথাও যায় না।'
            : 'No. Ahadex Tools has no image upload endpoint. Every operation executes in your browser sandbox.',
        },
        {
          q: isBn ? 'কোন কোন ফরম্যাটের ছবি সাপোর্ট করে?' : 'Which image formats are fully supported?',
          a: isBn
            ? 'JPG, JPEG, PNG, WebP এবং আধুনিক আইফোনের HEIC ফরম্যাট সম্পূর্ণভাবে সাপোর্ট করে।'
            : 'JPG, JPEG, PNG, WebP, and modern Apple iPhone HEIC/HEIF photo formats are fully supported.',
        },
        {
          q: isBn ? 'একসাথে বড় সাইজের ছবি প্রসেস করা যাবে?' : 'Can I process high-resolution DSLR or iPhone raw photos?',
          a: isBn
            ? 'হ্যাঁ, সর্বোচ্চ ২০ মেগাবাইট এবং ৫০ মেগাপিক্সেল পর্যন্ত যেকোনো ছবি সহজে প্রসেস করা যায়।'
            : 'Yes, modern browser engines easily handle photos up to 20 MB and 50+ megapixels.',
        },
      ],
    };
  }

  // Text & Developer Category
  return {
    howItWorksTitle: isBn ? `${name} কীভাবে কাজ করে ও প্রযুক্তিগত বিশ্লেষণ` : `How ${name} Works: Algorithmic Architecture`,
    howItWorksIntro: isBn
      ? `এই ইউটিলিটি টুলটি রিয়েল-টাইমে জাভাস্ক্রিপ্ট এবং ব্রাউজারের আধুনিক নেটিভ এপিআই দিয়ে কাজ করে। এটি উচ্চ কার্যক্ষমতা ও নির্ভুল ফলাফল প্রদান করে।`
      : `This utility operates via deterministic native JavaScript engines and web standard APIs, delivering sub-millisecond execution with cryptographic precision and Unicode fidelity.`,
    technicalSteps: [
      {
        title: isBn ? '১. রিয়েল-টাইম ইনপুট পার্সিং' : '1. Real-Time Tokenization',
        desc: isBn ? 'ইনপুট গ্রহণ করে মেমরিতে সেভ না করেই তাত্ক্ষণিক পার্স করা হয়।' : 'Input stream is parsed in-memory without persistent local storage or remote synchronization.',
      },
      {
        title: isBn ? '২. ক্রিপ্টোগ্রাফিক ও অ্যালগরিদমিক প্রসেসিং' : '2. Cryptographic & Lexical Processing',
        desc: isBn ? 'নিরাপদ CSPRNG বা ইউনিকোড রেজেক্স ইঞ্জিন দিয়ে ফলাফল গণনা করা হয়।' : 'Operations execute via standard Web Cryptography or Unicode grapheme cluster segmentation.',
      },
      {
        title: isBn ? '৩. তাত্ক্ষণিক ফলাফল প্রদর্শন' : '3. Instantaneous Output Presentation',
        desc: isBn ? 'ফলাফল নিমিষেই কপি বা ডাউনলোড করার জন্য স্ক্রিনে প্রদর্শিত হয়।' : 'Results are rendered with one-click clipboard copy and zero network delay.',
      },
    ],
    proTipsTitle: isBn ? 'সেরা ব্যবহারের নিয়মাবলী' : 'Pro Tips & Best Practices',
    proTips: [
      isBn ? 'গোপনীয় তথ্য বা কোড যেকোনো ভয় ছাড়া প্রসেস করতে পারেন কারণ কোনো ডেটা বাইরে যায় না।' : 'Safely process proprietary code or sensitive tokens without fear of network transmission.',
      isBn ? 'বাংলা ও ইংরেজি উভয় ভাষার টেক্সটের জন্য নির্ভুল গণনা প্রদান করে।' : 'Full support for multi-byte Unicode scripts, complex Bengali conjuncts, and international characters.',
    ],
    useCasesTitle: isBn ? 'বাস্তব জীবনের জনপ্রিয় ব্যবহার ক্ষেত্র' : 'Real-World Scenarios',
    useCases: [
      {
        role: isBn ? 'সফটওয়্যার ডেভেলপার ও ইঞ্জিনিয়ার' : 'Software Engineers & Developers',
        scenario: isBn ? 'এপিআই রেসপন্স ভ্যালিডেশন, ডিবাগিং ও নিরাপদ পাসওয়ার্ড তৈরি।' : 'Validating API JSON payloads, formatting minify payloads, and generating secure keys.',
        benefit: isBn ? 'প্রডাকশন ডেটা লিক হওয়ার কোনো ঝুঁকি থাকে না।' : 'Zero risk of leaking customer payload tokens or API secrets.',
      },
      {
        role: isBn ? 'লেখক, সাংবাদিক ও শিক্ষার্থী' : 'Writers, Journalists & Students',
        scenario: isBn ? 'প্রতিবেদন বা এসাইন্মেন্টের শব্দ সংখ্যা ও পাঠের সময় নিরূপণ।' : 'Measuring reading time, paragraph structure, and character quotas for publication.',
        benefit: isBn ? 'বাংলা যুক্তাক্ষর সহ নিখুঁত পরিসংখ্যান পাওয়া যায়।' : 'Accurate statistics for complex non-Latin multilingual scripts.',
      },
    ],
    comparisonTitle: isBn ? 'Ahadex লোকাল টুল বনাম অনলাইন সাধারণ কনভার্টার' : 'Ahadex Client-Side vs Traditional Cloud Tools',
    comparisonItems: [
      {
        feature: isBn ? 'ডেটা গোপনীয়তা' : 'Data Privacy',
        local: isBn ? '১০০% ব্রাউজারেই সীমাবদ্ধ।' : '100% Client-side. No telemetry or server storage.',
        cloud: isBn ? 'সার্ভারে লগ হতে পারে।' : 'Server-side logging and request payload tracking.',
      },
      {
        feature: isBn ? 'কাজের গতি' : 'Speed',
        local: isBn ? 'মিলিসেকেন্ডে ফলাফল।' : 'Sub-millisecond instant execution.',
        cloud: isBn ? 'সার্ভার ট্রাফিকের ওপর নির্ভরশীল।' : 'Laggy server roundtrips.',
      },
    ],
    troubleshootingTitle: isBn ? 'সমস্যা ও সমাধান' : 'Troubleshooting',
    troubleshooting: [
      {
        problem: isBn ? 'আমার ডেটা কি ব্রাউজার ক্যাশে থেকে যাবে?' : 'Is my sensitive data cached in the browser?',
        solution: isBn ? 'না, পেজ রিফ্রেশ বা ট্যাব বন্ধ করলেই সমস্ত ভেরিয়েবল মুছে যায়।' : 'No, state resides purely in volatile memory and cleans up when the tab closes.',
      },
    ],
    extendedFaqTitle: isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন' : 'Frequently Asked Questions',
    extendedFaqs: [
      {
        q: isBn ? 'টুলটি কি অফলাইনে কাজ করতে পারে?' : 'Can this utility function offline without an active connection?',
        a: isBn ? 'হ্যাঁ, পেজটি একবার লোড হলে ইন্টারনেট সংযোগ ছাড়াও সম্পূর্ণ অফলাইনে কাজ করে।' : 'Yes! Once loaded, the scripts operate entirely offline in your browser.',
      },
      {
        q: isBn ? 'ব্যবসায়িক কাজে ব্যবহার করা যাবে কি?' : 'Can I use this for enterprise and commercial tasks?',
        a: isBn ? 'হ্যাঁ, কোনো বাধা নেই। আপনি যেকোনো বাণিজ্যিক বা ব্যক্তিগত কাজে নিশ্চিন্তে ব্যবহার করতে পারবেন।' : 'Yes, completely free for personal, commercial, and enterprise workflows.',
      },
    ],
  };
}
