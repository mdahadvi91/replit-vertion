import { useEffect, useRef } from 'react';
import { adConfig } from '@/components/ads/adConfig';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdSlot({
  enabled,
  slot,
  label = 'Advertisement',
}: {
  enabled: boolean;
  slot: string;
  label?: string;
}) {
  const ref = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!enabled || !adConfig.enabled || !slot || !ref.current || ref.current.dataset.loaded) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      ref.current.dataset.loaded = 'true';
    } catch {
      // The ad script may not be ready yet. The slot remains non-blocking.
    }
  }, [enabled]);

  if (!enabled || !adConfig.enabled || !slot) return null;

  return (
    <aside className="ad-slot" aria-label={label}>
      <span>{label}</span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adConfig.clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}