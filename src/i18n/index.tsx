import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'bn';

export interface LegalSection {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<[string, string]>;
}

export type Copy = {
  // Navigation & Core
  home: string;
  tools: string;
  about: string;
  contact: string;
  privacy: string;
  terms: string;
  disclaimer: string;
  cookiePolicy: string;
  accessibility: string;
  exploreTools: string;
  whyAhadex: string;
  searchTools: string;
  browseAllTools: string;
  liveNow: string;
  planned: string;
  backToTools: string;
  allTools: string;
  themeLight: string;
  themeDark: string;
  languageLabel: string;
  settings: string;
  motion: string;
  reducedMotionNote: string;
  privacyNotice: string;
  onlyEssential: string;
  allowMeasurement: string;

  // Home Hero & Sections
  heroEyebrow: string;
  heroH1: string;
  heroCopy: string;
  microTrust: string;
  homeStartHereEyebrow: string;
  homeStartHereTitle: string;
  homeStartHereCopy: string;
  theAhadexWay: string;
  usefulIsAFeeling: string;
  stat01Num: string;
  stat01Label: string;
  stat02Num: string;
  stat02Label: string;
  stat03Num: string;
  stat03Label: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  faqEyebrow: string;
  faqTitle: string;
  faqItems: Array<[string, string]>;
  ctaBandEyebrow: string;
  ctaBandTitle: string;

  // Tools Page (Hero)
  toolsPageEyebrow: string;
  toolsPageH1: string;
  toolsPageCopy: string;
  allCategory: string;
  filterCountSuffix: string;
  noToolsMatch: string;
  clearSearch: string;

  // About Page
  aboutEyebrow: string;
  aboutH1: string;
  aboutIntro: string;
  pointOfViewEyebrow: string;
  pointOfViewTitle: string;
  p1Title: string;
  p1Desc: string;
  p2Title: string;
  p2Desc: string;
  p3Title: string;
  p3Desc: string;
  aboutCtaEyebrow: string;
  aboutCtaTitle: string;
  sendANote: string;

  // Contact Page
  contactEyebrow: string;
  contactH1: string;
  contactIntro: string;
  contactCardTitle: string;
  contactCardDesc: string;
  emailLabel: string;
  whatsappLabel: string;
  chatOnWhatsApp: string;
  sendEmail: string;
  formNameLabel: string;
  formNamePlaceholder: string;
  formEmailLabel: string;
  formEmailPlaceholder: string;
  formMessageLabel: string;
  formMessagePlaceholder: string;
  sendButton: string;
  successNote: string;

  // Legal Pages
  legal: {
    privacyPolicy: LegalSection;
    terms: LegalSection;
    disclaimer: LegalSection;
    cookiePolicy: LegalSection;
    accessibility: LegalSection;
  };

  // Tool Workspace & Compressor
  workspaceBadge: string;
  dropAnImageHere: string;
  orChooseAFile: string;
  noImageSelected: string;
  imageReady: string;
  workingLocally: string;
  compressionComplete: string;
  actionNeeded: string;
  chooseImage: string;
  downloadFile: string;
  resetWorkspace: string;
  compressionProfile: string;
  profileLight: string;
  profileLightDesc: string;
  profileBalanced: string;
  profileBalancedDesc: string;
  profileSmall: string;
  profileSmallDesc: string;
  imageStaysLocal: string;
  compressImageButton: string;
  processingImage: string;
  howToUse: string;
  privacyAndLimitations: string;
  relatedToolsTitle: string;
  keepGoing: string;
  originalSize: string;
  compressedSize: string;
  reductionSaved: string;
  convertToWebPLabel: string;
  convertToWebPDesc: string;

  // Planned & 404
  plannedBadge: string;
  plannedIntro: string;
  pageNotFoundEyebrow: string;
  pageNotFoundTitle: string;
  pageNotFoundCopy: string;
  pageNotFoundHome: string;

  // Footer
  footerDescription: string;
  exploreHeader: string;
  trustHeader: string;
  footerCopyright: string;
  footerTagline: string;
};

const english: Copy = {
  home: 'Home',
  tools: 'Tools',
  about: 'About',
  contact: 'Contact',
  privacy: 'Privacy',
  terms: 'Terms',
  disclaimer: 'Disclaimer',
  cookiePolicy: 'Cookie policy',
  accessibility: 'Accessibility',
  exploreTools: 'Explore tools',
  whyAhadex: 'Why Ahadex?',
  searchTools: 'Search tools…',
  browseAllTools: 'Browse all tools',
  liveNow: 'Live now',
  planned: 'Planned',
  backToTools: 'Back to Tools',
  allTools: 'All Tools',
  themeLight: 'Light',
  themeDark: 'Dark',
  languageLabel: 'EN / বাংলা',
  settings: 'Settings',
  motion: 'Motion',
  reducedMotionNote: "Your browser's reduced-motion preference is always respected.",
  privacyNotice: 'Ahadex uses essential storage for preferences. Optional analytics only starts after you allow it.',
  onlyEssential: 'Only essential',
  allowMeasurement: 'Allow analytics',

  heroEyebrow: 'Fast, Private Web Utilities',
  heroH1: 'Everyday digital tasks, done in seconds.',
  heroCopy: 'Ahadex brings lightweight, zero-upload browser tools for images, documents, text, and code — completely free, private, and always ready.',
  microTrust: '100% Client-Side · No Sign-Up Needed · Instant Results',
  homeStartHereEyebrow: 'Explore Toolkit',
  homeStartHereTitle: 'Zero clutter. Pure utility.',
  homeStartHereCopy: 'Purpose-built utilities designed to work directly inside your browser. No server uploads, no wait queues, and no noisy dashboard mazes.',
  theAhadexWay: 'The Ahadex way',
  usefulIsAFeeling: 'Useful is a feeling.',
  stat01Num: '01',
  stat01Label: 'One clear purpose',
  stat02Num: '0',
  stat02Label: 'Accounts to create',
  stat03Num: '∞',
  stat03Label: 'Instant digital tasks',
  step1Title: 'Find the tool that fits.',
  step1Desc: 'Every utility has one job and a name that tells you what it does. No treasure hunt, no feature maze.',
  step2Title: 'Bring your work in.',
  step2Desc: 'Drop in a file, paste some text or choose a setting. Ahadex keeps the handoff obvious and the controls calm.',
  step3Title: 'Leave with a finished thing.',
  step3Desc: 'Download the result, copy it on, and get back to the part of your work that matters more.',
  faqEyebrow: 'Good to know',
  faqTitle: 'Questions, answered plainly.',
  faqItems: [
    ['Are Ahadex tools free to use?', 'Yes. Ahadex is designed to keep the core utility of every released tool free for everyday work.'],
    ['Do you upload my files?', 'The live Image Compressor processes files directly in your browser. Files are never uploaded to an Ahadex server.'],
    ['Will more tools be added?', 'Yes. New tools are added when they solve a real task, work reliably, and maintain privacy.'],
    ['Can I suggest a tool?', 'Yes! Send us a note through the Contact page or directly on WhatsApp.'],
  ],
  ctaBandEyebrow: 'Your next tiny win',
  ctaBandTitle: 'See what the toolkit can take off your plate.',

  // Tools Page
  toolsPageEyebrow: 'The library',
  toolsPageH1: 'Smart tools for swift work.',
  toolsPageCopy: 'Handcrafted browser utilities designed to solve everyday image, document, text, and developer tasks instantly — 100% private, client-side, and ad-light.',
  allCategory: 'All Tools',
  filterCountSuffix: 'tools',
  noToolsMatch: 'No tools match',
  clearSearch: 'Clear search',

  // About Page
  aboutEyebrow: 'About Ahadex Tools',
  aboutH1: 'The internet has enough complicated helpers.',
  aboutIntro: 'Ahadex Tools is a growing toolkit for the moments when a simple digital task somehow becomes a whole thing.',
  pointOfViewEyebrow: 'A useful point of view',
  pointOfViewTitle: 'Less friction is a form of care.',
  p1Title: 'Clarity before cleverness.',
  p1Desc: 'We name tools plainly, show only the controls that matter and keep the next step visible.',
  p2Title: 'Private by default.',
  p2Desc: 'Whenever a job can happen in your browser, that is where we start. File handling claims match the actual implementation.',
  p3Title: 'Useful before monetized.',
  p3Desc: 'Ads are secondary. A tool must solve a real problem without relying on advertising to make the experience valuable.',
  aboutCtaEyebrow: 'Have a nuisance?',
  aboutCtaTitle: 'Tell us what should be easier.',
  sendANote: 'Send a note',

  // Contact Page
  contactEyebrow: 'Get in touch',
  contactH1: 'Good tools start with good questions.',
  contactIntro: 'Found a rough edge, have a tool idea or simply want to say hello? We read every note.',
  contactCardTitle: 'Reach us directly',
  contactCardDesc: 'Connect with our team via email or instant WhatsApp support for quick queries or custom tool requests.',
  emailLabel: 'Official Email',
  whatsappLabel: 'WhatsApp Support',
  chatOnWhatsApp: 'Chat on WhatsApp',
  sendEmail: 'Send Email',
  formNameLabel: 'Your name',
  formNamePlaceholder: 'How should we address you?',
  formEmailLabel: 'Email address',
  formEmailPlaceholder: 'you@example.com',
  formMessageLabel: 'Your note',
  formMessagePlaceholder: 'The task I wish was easier is…',
  sendButton: 'Send note',
  successNote: 'Thanks — your note is received and queued for a thoughtful read.',

  // Legal Pages
  legal: {
    privacyPolicy: {
      eyebrow: 'A plain-language promise',
      title: 'Privacy policy',
      intro: 'Ahadex is designed to be useful without asking for more information than the job requires.',
      sections: [
        ['Browser processing', 'When a tool says it processes a file in your browser, the current implementation uses browser APIs and does not upload that file to an Ahadex server. Each tool page describes its own behavior.'],
        ['Optional measurement', 'Google Analytics is not loaded until you choose the optional analytics setting. When enabled, Ahadex sends limited page and tool interaction events, never file contents, document text, passwords or tokens.'],
        ['Contact messages', 'Contact messages are sent directly to our team to assist you and are never shared with third parties.'],
      ],
    },
    terms: {
      eyebrow: 'The straightforward version',
      title: 'Terms of use',
      intro: 'Use Ahadex to make everyday digital tasks easier, responsibly and within the laws that apply to you.',
      sections: [
        ['Use of the tools', 'You are responsible for the files, text and other material you choose to process. Do not use Ahadex to handle content you are not allowed to access or transform.'],
        ['Outputs and review', 'Utilities can have limitations. Review important outputs before relying on them for legal, financial, medical, safety or business-critical decisions.'],
        ['Changes', 'Tools and content may change as the platform grows. We will not describe a planned tool as live or a simulated result as a completed export.'],
      ],
    },
    disclaimer: {
      eyebrow: 'Before you use a tool',
      title: 'Disclaimer',
      intro: 'Ahadex tools are practical helpers, not a substitute for professional advice or your own review.',
      sections: [
        ['No guarantee of fitness', 'A result that is useful for one job may not be suitable for another. Check dimensions, quality, encoding and other output details before use.'],
        ['Third-party services', 'Optional analytics and advertising services, when enabled, are subject to their own policies and consent requirements.'],
        ['Questions', 'If a page makes a claim that does not match what the tool does, contact us so it can be corrected.'],
      ],
    },
    cookiePolicy: {
      eyebrow: 'Storage, explained',
      title: 'Cookie policy',
      intro: 'Ahadex keeps optional measurement off until you make a choice.',
      sections: [
        ['Essential storage', 'Ahadex stores theme, language and consent choices in local storage so the interface can remember them.'],
        ['Optional analytics', 'If you allow analytics, the Google Analytics script can load and receive limited interaction events. You can clear the choice in your browser settings.'],
        ['Advertising', 'AdSense code is loaded only when a valid public client configuration exists and the relevant consent path is enabled.'],
      ],
    },
    accessibility: {
      eyebrow: 'Designed for more people',
      title: 'Accessibility',
      intro: 'Ahadex aims for clear, keyboard-friendly interfaces with sensible motion and readable contrast.',
      sections: [
        ['Keyboard support', 'Interactive controls use buttons, links, labels and native form elements. Drawers close with Escape and keep the page from scrolling behind them.'],
        ['Motion', 'The interface honors the browser prefers-reduced-motion setting. Essential information is never conveyed only through animation.'],
        ['Feedback', 'Tool states expose useful text for empty, processing, success and error conditions. Contact us if a particular interaction is difficult to use.'],
      ],
    },
  },

  // Tool Workspace & Compressor
  workspaceBadge: 'BROWSER-FIRST WORKSPACE',
  dropAnImageHere: 'Drop an image here',
  orChooseAFile: 'Or choose a file from your device. JPG, PNG and WebP up to 20 MB.',
  noImageSelected: 'No image selected',
  imageReady: 'Image ready',
  workingLocally: 'Working locally',
  compressionComplete: 'Compression complete',
  actionNeeded: 'Action needed',
  chooseImage: 'Choose an image',
  downloadFile: 'Download',
  resetWorkspace: 'Reset workspace',
  compressionProfile: 'Compression profile',
  profileLight: 'More detail',
  profileLightDesc: 'Preserves the highest fidelity and details',
  profileBalanced: 'Everyday use',
  profileBalancedDesc: 'Balanced file size and visual clarity',
  profileSmall: 'Smallest output',
  profileSmallDesc: 'Maximum reduction for web and chats',
  imageStaysLocal: 'Your image stays in this browser. No account required.',
  compressImageButton: 'Compress image',
  processingImage: 'Processing…',
  howToUse: 'How to use',
  privacyAndLimitations: 'Privacy and limitations',
  relatedToolsTitle: 'Related tools',
  keepGoing: 'Keep going',
  originalSize: 'Original size',
  compressedSize: 'Compressed size',
  reductionSaved: 'Saved',
  convertToWebPLabel: 'Convert to WebP',
  convertToWebPDesc: 'Ultra-efficient modern web format with higher compression ratio',

  // Planned & 404
  plannedBadge: 'Planned tool',
  plannedIntro: 'Ahadex will publish this utility only after it has real processing, validation, useful content and a dependable export flow.',
  pageNotFoundEyebrow: '404 / Not found',
  pageNotFoundTitle: 'That page wandered off.',
  pageNotFoundCopy: 'There is no tool or page at this address, but there may be a useful one in the library.',
  pageNotFoundHome: 'Home',

  // Footer
  footerDescription: 'Useful browser tools for the small digital jobs that interrupt a good day.',
  exploreHeader: 'Explore',
  trustHeader: 'Trust',
  footerCopyright: '© 2026 Ahadex Tools',
  footerTagline: 'Made for the in-between tasks.',
};

const bangla: Copy = {
  home: 'হোম',
  tools: 'টুলস',
  about: 'আমাদের সম্পর্কে',
  contact: 'যোগাযোগ',
  privacy: 'গোপনীয়তা নীতি',
  terms: 'ব্যবহারের শর্তাবলী',
  disclaimer: 'দাবিত্যাগ',
  cookiePolicy: 'কুকি নীতি',
  accessibility: 'অ্যাক্সেসিবিলিটি',
  exploreTools: 'টুলস দেখুন',
  whyAhadex: 'কেন Ahadex?',
  searchTools: 'টুল খুঁজুন…',
  browseAllTools: 'সব টুলস দেখুন',
  liveNow: 'এখন চালু আছে',
  planned: 'শীঘ্রই আসছে',
  backToTools: 'টুলসে ফিরে যান',
  allTools: 'সব টুলস',
  themeLight: 'লাইট মোড',
  themeDark: 'ডার্ক মোড',
  languageLabel: 'বাংলা / EN',
  settings: 'সেটিংস',
  motion: 'মোশন ও অ্যানিমেশন',
  reducedMotionNote: 'আপনার ব্রাউজারের রিডিউসড-মোশন সেটিংকে সর্বদা অগ্রাধিকার দেওয়া হয়।',
  privacyNotice: 'Ahadex ব্রাউজারের লোকাল স্টোরেজে কেবল আপনার পছন্দের সেটিংস সংরক্ষণ করে। আপনার সম্মতি ছাড়া অ্যানালিটিক্স চালু হয় না।',
  onlyEssential: 'শুধুমাত্র প্রয়োজনীয়',
  allowMeasurement: 'অ্যানালিটিক্স অনুমোদন দিন',

  heroEyebrow: 'দ্রুত ও নির্ভরযোগ্য ব্রাউজার টুলস',
  heroH1: 'কঠিন ও জটিল কাজগুলো এবার হবে নিমেষেই সহজ।',
  heroCopy: 'Ahadex Tools নিয়ে এসেছে আপনার দৈনন্দিন ডিজিটাল কাজের প্রয়োজনীয় সব টুলস — দ্রুত, নির্ভরযোগ্য এবং কোনো বাড়তি ঝামেলা ছাড়াই প্রস্তুত।',
  microTrust: 'ব্রাউজারেই প্রসেসিং · কোনো অ্যাকাউন্ট দরকার নেই · ১০০% ফ্রি',
  homeStartHereEyebrow: 'শুরু করুন এখান থেকেই',
  homeStartHereTitle: 'একটি ক্লিকের দূরত্বে সমাধান।',
  homeStartHereCopy: 'ছবি, ডকুমেন্ট, টেক্সট এবং ডেভেলপারদের কাজের জন্য প্রস্তুত হালকা ও নির্ভুল টুলস। কোনো অপ্রয়োজনীয় জটিলতা ছাড়া কেবল কাজের পরিবেশ।',
  theAhadexWay: 'আমাদের কাজের ধরন',
  usefulIsAFeeling: 'সহজ ও স্বাচ্ছন্দ্যময় অভিজ্ঞতা।',
  stat01Num: '০১',
  stat01Label: 'একটি নির্দিষ্ট উদ্দেশ্য',
  stat02Num: '০',
  stat02Label: 'কোনো অ্যাকাউন্টের ঝামেলা নেই',
  stat03Num: '∞',
  stat03Label: 'তাৎক্ষণিক ব্রাউজার সমাধান',
  step1Title: 'আপনার পছন্দের টুলটি বেছে নিন।',
  step1Desc: 'প্রতিটি টুলের রয়েছে স্পষ্ট নাম ও নির্দিষ্ট কাজ। কোনো গোলকধাঁধা নেই, খুব সহজেই খুঁজে পাবেন।',
  step2Title: 'আপনার ফাইল বা টেক্সট যোগ করুন।',
  step2Desc: 'ড্রপ করুন ফাইল, টেক্সট পেস্ট করুন অথবা প্রয়োজনীয় সেটিং দিন। ফাইল সম্পূর্ণ আপনার ব্রাউজারেই থাকবে।',
  step3Title: 'মুহূর্তেই পান কাঙ্ক্ষিত রেজাল্ট।',
  step3Desc: 'ফাইলটি ডাউনলোড করুন বা কপি করে আপনার পরবর্তী কাজে দ্রুত ফিরে যান।',
  faqEyebrow: 'প্রয়োজনীয় প্রশ্নোত্তর',
  faqTitle: 'সাধারণ প্রশ্নের সহজ উত্তর।',
  faqItems: [
    ['Ahadex টুলস কি সম্পূর্ণ ফ্রি?', 'হ্যাঁ, Ahadex এর সকল টুলস দৈনন্দিন কাজের জন্য সম্পূর্ণ ফ্রি এবং কোনো সাবস্ক্রিপশন ছাড়াই ব্যবহার করা যায়।'],
    ['আমার ফাইল কি আপনাদের সার্ভারে আপলোড হয়?', 'না! Image Compressor টুলটি আপনার ব্রাউজারের নিজস্ব মেমরিতে ফাইল প্রসেস করে। কোনো ফাইল সার্ভারে আপলোড করা হয় না।'],
    ['ভবিষ্যতে কি আরো নতুন টুলস আসবে?', 'অবশ্যই! ব্যবহারকারীদের বাস্তব প্রয়োজন ও সিকিউরিটির বিষয়টি নিশ্চিত করে নিয়মিত নতুন টুলস যুক্ত করা হচ্ছে।'],
    ['আমি কি নতুন কোনো টুলের পরামর্শ দিতে পারি?', 'হ্যাঁ! আমাদের Contact পেজের মাধ্যমে অথবা সরাসরি হোয়াটসঅ্যাপে আপনার পছন্দের টুলের আইডিয়া শেয়ার করতে পারেন।'],
  ],
  ctaBandEyebrow: 'কাজের গতি বৃদ্ধি করুন',
  ctaBandTitle: 'আজই আবিষ্কার করুন আপনার প্রয়োজনীয় টুলটি।',

  // Tools Page
  toolsPageEyebrow: 'টুলস লাইব্রেরি',
  toolsPageH1: 'সহজ সমাধান, দ্রুত কাজের নিশ্চয়তা।',
  toolsPageCopy: 'ছবি, ডকুমেন্ট, টেক্সট এবং কোডিং সংক্রান্ত দৈনন্দিন কাজের জন্য তৈরি দ্রুত ও নিরাপদ ব্রাউজার টুলস — ১০০% ক্লায়েন্ট-সাইড এবং বিজ্ঞাপন-মুক্ত ভাব।',
  allCategory: 'সব টুলস',
  filterCountSuffix: 'টি টুল',
  noToolsMatch: 'এমন কোনো টুল পাওয়া যায়নি',
  clearSearch: 'সার্চ রিসেট করুন',

  // About Page
  aboutEyebrow: 'Ahadex Tools সম্পর্কে',
  aboutH1: 'ইন্টারনেটে অতিরিক্ত জটিলতার বিপরীতে এক সরল মাধ্যম।',
  aboutIntro: 'একটি সাধারণ কাজ করতে গিয়ে যখন অযথা সময় নষ্ট হয়, সেই মুহূর্তগুলোকে স্বস্তিময় করে তুলতেই তৈরি হয়েছে Ahadex Tools।',
  pointOfViewEyebrow: 'আমাদের দর্শন',
  pointOfViewTitle: 'কাজের জটিলতা কমানোই আমাদের প্রথম অগ্রাধিকার।',
  p1Title: 'চাতুর্যের চেয়ে স্পষ্টতা জরুরি।',
  p1Desc: 'টুলগুলোর নাম ও কাজ আমরা সহজ-সরল রাখি এবং অপ্রয়োজনীয় জটিল বাটন আড়াল করে রাখি।',
  p2Title: 'শুরু থেকেই সম্পূর্ণ প্রাইভেট।',
  p2Desc: 'যেসব কাজ আপনার ব্রাউজারেই করা সম্ভব, সেগুলো আমরা কখনই বাইরে পাঠাই না।',
  p3Title: 'বিজ্ঞাপনের চেয়ে উপযোগিতা বড়।',
  p3Desc: 'বিজ্ঞাপন আমাদের কাছে গৌণ। একটি টুল যদি আপনার বাস্তব কাজের উপকারে না আসে, তবে তার কোনো মূল্য নেই।',
  aboutCtaEyebrow: 'কোনো নতুন কাজের ঝামেলা?',
  aboutCtaTitle: 'আমাদের জানান কোন কাজটি আরো সহজ হওয়া প্রয়োজন।',
  sendANote: 'বার্তা পাঠান',

  // Contact Page
  contactEyebrow: 'যোগাযোগ করুন',
  contactH1: 'যেকোনো প্রয়োজনে সরাসরি আমাদের সাথে যুক্ত হোন।',
  contactIntro: 'কোনো নতুন টুলের আইডিয়া দিতে চান, সাইটের কোনো সমস্যা জানাতে চান কিংবা কিছু বলতে চান? আমরা প্রতিটি বার্তা মনোযোগ দিয়ে পড়ি।',
  contactCardTitle: 'সরাসরি যোগাযোগের ঠিকানা',
  contactCardDesc: 'ইমেইল বা হোয়াটসঅ্যাপের মাধ্যমে সরাসরি আমাদের সাথে যোগাযোগ করতে পারেন।',
  emailLabel: 'অফিসিয়াল ইমেইল',
  whatsappLabel: 'হোয়াটসঅ্যাপ সাপোর্ট',
  chatOnWhatsApp: 'হোয়াটসঅ্যাপে মেসেজ দিন',
  sendEmail: 'ইমেইল পাঠান',
  formNameLabel: 'আপনার নাম',
  formNamePlaceholder: 'কী নামে আপনাকে সম্বোধন করব?',
  formEmailLabel: 'ইমেইল অ্যাড্রেস',
  formEmailPlaceholder: 'yourname@example.com',
  formMessageLabel: 'আপনার বার্তা',
  formMessagePlaceholder: 'আপনি কী ধরনের টুল বা সুবিধা চান তা লিখুন…',
  sendButton: 'বার্তা পাঠান',
  successNote: 'ধন্যবাদ — আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা দ্রুত উত্তর দেব।',

  // Legal Pages
  legal: {
    privacyPolicy: {
      eyebrow: 'স্পষ্ট অঙ্গীকার',
      title: 'গোপনীয়তা নীতি',
      intro: 'Ahadex এমনভাবে তৈরি যাতে কাজের প্রয়োজনে যতটুকু ছাড়া বাড়তি কোনো ব্যক্তিগত তথ্যের প্রয়োজন না হয়।',
      sections: [
        ['ব্রাউজার প্রসেসিং', 'যেসব টুল ব্রাউজারে কাজ করে, সেগুলো কোনো ফাইল আমাদের সার্ভারে আপলোড করে না। পেজ বন্ধ করলে সাময়িক ফাইলগুলো নিজে থেকেই নষ্ট হয়ে যায়।'],
        ['ঐচ্ছিক পরিমাপ', 'আপনি অনুমতি না দেওয়া পর্যন্ত Google Analytics চালু হয় না। অনুমতি দিলে শুধুমাত্র পেজ ভিউ এবং টুলের ব্যবহার ডেটা নেওয়া হয়, কোনো ফাইল বা পাসওয়ার্ড কখনই নয়।'],
        ['যোগাযোগ বার্তা', 'আমাদের কাছে পাঠানো আপনার নাম ও ইমেইল শুধুমাত্র আপনাকে সহায়তা করার কাজে ব্যবহৃত হয় এবং কোনো তৃতীয় পক্ষের কাছে দেওয়া হয় না।'],
      ],
    },
    terms: {
      eyebrow: 'সহজ সংস্করণ',
      title: 'ব্যবহারের শর্তাবলী',
      intro: 'Ahadex ব্যবহার করে আপনার দৈনন্দিন কাজগুলোকে সহজে ও দায়িত্বশীলভাবে সম্পন্ন করুন।',
      sections: [
        ['টুলস ব্যবহার', 'আপনি যেসব ফাইল বা টেক্সট প্রসেস করছেন তার দায়দায়িত্ব আপনার। যেসব কনটেন্টে আপনার অধিকার নেই তা প্রসেস করবেন না।'],
        ['ফলাফল ও যাচাই', 'প্রয়োজনীয় আইনি, চিকিৎসা বা ব্যবসায়িক সিদ্ধান্তের ক্ষেত্রে আউটপুটটি নিজে ভালোভাবে যাচাই করে নিন।'],
        ['পরিবর্তন', 'প্ল্যাটফর্মের অগ্রগতির সাথে সাথে টুলস ও ফিচার আপডেট বা উন্নত করা হতে পারে।'],
      ],
    },
    disclaimer: {
      eyebrow: 'টুল ব্যবহারের পূর্বে',
      title: 'দাবিত্যাগ',
      intro: 'Ahadex টুলস আপনার দৈনন্দিন কাজের সহায়ক, কোনো পেশাদার পরামর্শের বিকল্প নয়।',
      sections: [
        ['কাজের উপযুক্ততা', 'একটি নির্দিষ্ট কাজের আউটপুট অন্য কোনো কাজের জন্য সবসময় উপযুক্ত নাও হতে পারে। ফাইল সাইজ ও কোয়ালিটি দেখে নিন।'],
        ['থার্ড-পার্টি সার্ভিস', 'ঐচ্ছিক অ্যানালিটিক্স বা বিজ্ঞাপন সার্ভিস তাদের নিজস্ব নীতিমালা মেনে পরিচালিত হয়।'],
        ['পরামর্শ ও সংশোধন', 'কোনো ফিচারে অসামঞ্জস্য দেখলে আমাদের জানাতে পারেন, আমরা সাথে সাথে সংশোধন করব।'],
      ],
    },
    cookiePolicy: {
      eyebrow: 'স্টোরেজ ব্যাখ্যা',
      title: 'কুকি নীতি',
      intro: 'Ahadex আপনার অনুমতি ছাড়া কোনো অপ্রয়োজনীয় ট্র্যাকিং কুকি ব্যবহার করে না।',
      sections: [
        ['প্রয়োজনীয় লোকাল স্টোরেজ', 'থিম ডার্ক/লাইট, ভাষা এবং প্রাইভেসি পছন্দ মনে রাখার জন্য ব্রাউজারের লোকাল স্টোরেজ ব্যবহার করা হয়।'],
        ['ঐচ্ছিক অ্যানালিটিক্স', 'আপনি অনুমতি দিলেই কেবল অ্যানালিটিক্স লোড হয়। ব্রাউজার সেটিং থেকে যেকোনো সময় ক্যাশ ক্লিয়ার করতে পারবেন।'],
        ['বিজ্ঞাপন', 'বিজ্ঞাপন কোড শুধুমাত্র সঠিক অনুমতি ও কনফিগারেশন থাকলেই লোড হয়।'],
      ],
    },
    accessibility: {
      eyebrow: 'সবার জন্য তৈরি',
      title: 'অ্যাক্সেসিবিলিটি',
      intro: 'Ahadex কীবোর্ড-বান্ধব, স্পষ্ট কনট্রাস্ট এবং রিডিউসড-মোশন সমর্থিত ইন্টারফেস নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।',
      sections: [
        ['কীবোর্ড সাপোর্ট', 'সবগুলো বোতাম, ইনপুট এবং ড্রয়ার কীবোর্ড দিয়ে সহজে নিয়ন্ত্রণ করা যায়। Escape চাপলে মেনু বন্ধ হয়।'],
        ['মোশন ও দৃশ্যমানতা', 'ব্রাউজারের রিডিউসড-মোশন সেটিং থাকলে অপ্রয়োজনীয় অ্যানিমেশন বন্ধ থাকে।'],
        ['সহায়তা', 'কোনো অংশ ব্যবহার করতে অসুবিধা হলে আমাদের জানাতে দ্বিধা করবেন না।'],
      ],
    },
  },

  // Tool Workspace & Compressor
  workspaceBadge: '১০০% ক্লায়েন্ট-সাইড ব্রাউজার টুল',
  dropAnImageHere: 'এখানে ছবি ড্রপ করুন',
  orChooseAFile: 'অথবা ডিভাইস থেকে ছবি বেছে নিন। JPG, PNG ও WebP (সর্বোচ্চ ২০ মেগাবাইট)।',
  noImageSelected: 'কোনো ছবি নির্বাচন করা হয়নি',
  imageReady: 'ছবি প্রস্তুত',
  workingLocally: 'ব্রাউজারে কমপ্রেস হচ্ছে…',
  compressionComplete: 'কমপ্রেশন সম্পন্ন হয়েছে',
  actionNeeded: 'মনোযোগ প্রয়োজন',
  chooseImage: 'ছবি বেছে নিন',
  downloadFile: 'ডাউনলোড',
  resetWorkspace: 'রিসেট করুন',
  compressionProfile: 'কমপ্রেশন প্রোফাইল',
  profileLight: 'হাই কোয়ালিটি',
  profileLightDesc: 'ছবির সূক্ষ্ম ডিটেইলস ও স্পষ্টতা ধরে রাখে',
  profileBalanced: 'ব্যালেন্সড (প্রস্তাবিত)',
  profileBalancedDesc: 'দৈনন্দিন ব্যবহারের জন্য আদর্শ আকার ও কোয়ালিটি',
  profileSmall: 'ছোট সাইজ',
  profileSmallDesc: 'ওয়েব ও চ্যাটের জন্য সবচেয়ে ছোট সাইজ',
  imageStaysLocal: 'আপনার ছবি সম্পূর্ণ এই ব্রাউজারে থাকে। কোনো অ্যাকাউন্ট প্রয়োজন নেই।',
  compressImageButton: 'কমপ্রেস করুন',
  processingImage: 'কাজ চলছে…',
  howToUse: 'ব্যবহার বিধি',
  privacyAndLimitations: 'গোপনীয়তা ও সীমাবদ্ধতা',
  relatedToolsTitle: 'সম্পর্কিত টুলস',
  keepGoing: 'আরো দেখুন',
  originalSize: 'আসল সাইজ',
  compressedSize: 'নতুন সাইজ',
  reductionSaved: 'সাশ্রয় হয়েছে',
  convertToWebPLabel: 'WebP ফরম্যাটে রূপান্তর',
  convertToWebPDesc: 'উন্নত ও আধুনিক ওয়েব ফরম্যাট যা ছবির সাইজ বহুগুণ কমিয়ে আনে',

  // Planned & 404
  plannedBadge: 'পরিকল্পিত টুল',
  plannedIntro: 'Ahadex এই টুলটি সম্পূর্ণ টেস্ট, নির্ভুল প্রসেসিং ও নির্ভরযোগ্য এক্সপোর্টের ব্যবস্থা সম্পন্ন হলে উন্মুক্ত করবে।',
  pageNotFoundEyebrow: '৪০৪ / পেজ পাওয়া যায়নি',
  pageNotFoundTitle: 'এই পেজটি খুঁজে পাওয়া যায়নি।',
  pageNotFoundCopy: 'এই ঠিকানায় কোনো পেজ নেই, তবে আপনি টুলস লাইব্রেরিতে গিয়ে আপনার প্রয়োজনীয় টুলটি খুঁজে নিতে পারেন।',
  pageNotFoundHome: 'হোম পেজ',

  // Footer
  footerDescription: 'দৈনন্দিন ডিজিটাল কাজের প্রয়োজনীয় ব্রাউজার টুলস — দ্রুত ও সহজ।',
  exploreHeader: 'টুলস এক্সপ্লোর',
  trustHeader: 'নীতিমালা',
  footerCopyright: '© ২০২৬ Ahadex Tools',
  footerTagline: 'আপনার কাজ হোক আরো হালকা ও দ্রুত।',
};

const copyByLanguage: Record<Language, Copy> = { en: english, bn: bangla };

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: Copy;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ahadex-language');
    return saved === 'bn' ? 'bn' : 'en';
  });
  const value = useMemo(
    () => ({
      language,
      setLanguage: (next: Language) => {
        localStorage.setItem('ahadex-language', next);
        setLanguage(next);
      },
      copy: copyByLanguage[language],
    }),
    [language],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
