import { useEffect } from 'react';
import { adConfig } from '@/components/ads/adConfig';

declare global { interface Window { adsbygoogle?: Array<Record<string, unknown>>; } }

/** Ads require a separate advertising choice; analytics consent never enables them. */
export function AdSenseProvider({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled || !adConfig.enabled || localStorage.getItem('ahadex-ad-consent') !== 'advertising' || document.querySelector('script[data-ahadex-adsense]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.ahadexAdsense = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adConfig.clientId)}`;
    document.head.appendChild(script);
  }, [enabled]);
  return null;
}
