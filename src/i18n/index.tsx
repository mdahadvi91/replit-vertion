import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'bn';

export type Copy = {
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
  addImage: string;
  chooseImage: string;
  removeFile: string;
  compressionProfile: string;
  imageStaysLocal: string;
  onlyEssential: string;
  allowMeasurement: string;
  privacyNotice: string;
  languageLabel: string;
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
  exploreTools: 'Explore the tools',
  whyAhadex: 'Why Ahadex?',
  searchTools: 'Search tools',
  browseAllTools: 'Browse all tools',
  liveNow: 'Live now',
  planned: 'Planned',
  backToTools: 'Back to Tools',
  addImage: 'Add an image first',
  chooseImage: 'Choose an image',
  removeFile: 'Remove file',
  compressionProfile: 'Compression profile',
  imageStaysLocal: 'Your image stays in this browser for this workspace.',
  onlyEssential: 'Only essential',
  allowMeasurement: 'Allow analytics',
  privacyNotice:
    'Ahadex uses essential storage for preferences. Optional analytics only starts after you allow it.',
  languageLabel: 'EN / বাংলা',
};

const bangla: Copy = {
  home: 'হোম',
  tools: 'টুলস',
  about: 'আমাদের কথা',
  contact: 'যোগাযোগ',
  privacy: 'গোপনীয়তা',
  terms: 'শর্তাবলি',
  disclaimer: 'দাবিত্যাগ',
  cookiePolicy: 'কুকি নীতি',
  accessibility: 'অ্যাক্সেসিবিলিটি',
  exploreTools: 'টুলস দেখুন',
  whyAhadex: 'কেন Ahadex?',
  searchTools: 'টুল খুঁজুন',
  browseAllTools: 'সব টুল দেখুন',
  liveNow: 'এখন ব্যবহার করুন',
  planned: 'শীঘ্রই আসছে',
  backToTools: 'টুলসে ফিরে যান',
  addImage: 'আগে একটি ছবি যোগ করুন',
  chooseImage: 'ছবি বেছে নিন',
  removeFile: 'ফাইল সরান',
  compressionProfile: 'কমপ্রেশন প্রোফাইল',
  imageStaysLocal: 'এই workspace-এর জন্য আপনার ছবি browser-এর মধ্যেই থাকে।',
  onlyEssential: 'শুধু প্রয়োজনীয়',
  allowMeasurement: 'Analytics অনুমতি দিন',
  privacyNotice:
    'Ahadex preference-এর জন্য প্রয়োজনীয় storage ব্যবহার করে। আপনার অনুমতি ছাড়া optional analytics চালু হয় না।',
  languageLabel: 'EN / বাংলা',
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