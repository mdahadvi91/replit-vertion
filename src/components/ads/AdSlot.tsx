import { useEffect, useRef, useState } from 'react';
import { adConfig } from '@/components/ads/adConfig';
import { readConsentState } from '@/features/consent';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdSlot({
  enabled = true,
  slot,
  label = 'Advertisement',
}: {
  enabled?: boolean;
  slot: string;
  label?: string;
}) {
  const ref = useRef<HTMLModElement | null>(null);
  const [hasAdConsent, setHasAdConsent] = useState(() => readConsentState().advertising);

  useEffect(() => {
    const handleConsent = () => {
      setHasAdConsent(readConsentState().advertising);
    };

    window.addEventListener('ahadex-consent-change', handleConsent);
    return () => window.removeEventListener('ahadex-consent-change', handleConsent);
  }, []);

  const isAllowed = enabled && hasAdConsent && adConfig.enabled && Boolean(slot);

  useEffect(() => {
    if (!isAllowed || !ref.current || ref.current.dataset.loaded) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      ref.current.dataset.loaded = 'true';
    } catch {
      // The ad script may not be ready yet. The slot remains non-blocking.
    }
  }, [isAllowed]);

  if (!isAllowed) return null;

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
