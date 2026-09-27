export type AnalyticsEventName =
  | 'page_view'
  | 'tool_open'
  | 'tool_start'
  | 'file_upload'
  | 'tool_process'
  | 'tool_success'
  | 'tool_error'
  | 'tool_download'
  | 'search'
  | 'search_result_click'
  | 'category_open'
  | 'tool_favorite_toggle'
  | 'related_tool_click'
  | 'theme_change'
  | 'language_change'
  | 'contact_form_submit'
  | 'contact_click_email'
  | 'contact_click_whatsapp'
  | 'tool_run';

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || 'G-SFQG7CCVTQ';
let analyticsEnabled = true;

function loadAnalyticsScript() {
  if (typeof window === 'undefined') return;
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.ahadexGa = measurementId;
    document.head.appendChild(script);
  }
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push({ event: 'gtag', args });
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });
  }
}

export function enableAnalytics() {
  analyticsEnabled = true;
  loadAnalyticsScript();
}

export function disableAnalytics() {
  analyticsEnabled = false;
}

export function trackEvent(name: AnalyticsEventName, params: EventParams = {}) {
  if (!analyticsEnabled || typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', name, params);
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
  }
}

export function trackPageView(path: string, title: string) {
  trackEvent('page_view', { page_path: path, page_title: title });
}

export function hasAnalyticsMeasurementId() {
  return true;
}
