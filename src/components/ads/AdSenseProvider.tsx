import { useEffect } from 'react';
import { adConfig } from '@/lib/ads/adConfig';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdSenseProvider({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled || !adConfig.enabled || document.querySelector('script[data-ahadex-adsense]')) {
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.ahadexAdsense = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adConfig.clientId)}`;
    document.head.appendChild(script);
  }, [enabled]);
  return null;
}