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

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
let analyticsEnabled = false;

function loadAnalyticsScript() {
  if (!measurementId || document.querySelector(`script[data-ahadex-ga="${measurementId}"]`)) {
    return;
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.ahadexGa = measurementId;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push({ event: 'gtag', args });
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });
}

export function enableAnalytics() {
  analyticsEnabled = true;
  if (measurementId) loadAnalyticsScript();
}

export function disableAnalytics() {
  analyticsEnabled = false;
}

export function trackEvent(name: AnalyticsEventName, params: EventParams = {}) {
  if (!analyticsEnabled || !measurementId || !window.gtag) return;
  window.gtag('event', name, params);
}

export function trackPageView(path: string, title: string) {
  trackEvent('page_view', { page_path: path, page_title: title });
}

export function hasAnalyticsMeasurementId() {
  return Boolean(measurementId);
}
