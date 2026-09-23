import { useEffect, useRef } from 'react';
import { adConfig } from '@/components/ads/adConfig';

declare global { interface Window { adsbygoogle?: Array<Record<string, unknown>>; } }

export function AdSlot({ enabled, slot, label = 'Advertisement' }: { enabled: boolean; slot: string; label?: string }) {
  const ref = useRef<HTMLModElement | null>(null);
  const advertisingConsent = typeof window !== 'undefined' && localStorage.getItem('ahadex-ad-consent') === 'advertising';
  useEffect(() => {
    if (!enabled || !advertisingConsent || !adConfig.enabled || !slot || !ref.current || ref.current.dataset.loaded) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); ref.current.dataset.loaded = 'true'; } catch { /* AdSense may still be loading. */ }
  }, [enabled, advertisingConsent, slot]);
  if (!enabled || !advertisingConsent || !adConfig.enabled || !slot) return null;
  return <aside className="ad-slot" aria-label={label}><span>{label}</span><ins ref={ref} className="adsbygoogle" style={{ display: 'block' }} data-ad-client={adConfig.clientId} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" /></aside>;
}
