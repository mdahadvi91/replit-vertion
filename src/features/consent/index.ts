import { useEffect, useState } from 'react';

export type ConsentChoice = 'unknown' | 'essential' | 'measurement' | 'all';

export type ConsentState = {
  essential: true;
  analytics: boolean;
  advertising: boolean;
};

export const DEFAULT_CONSENT: ConsentState = {
  essential: true,
  analytics: false,
  advertising: false,
};

const STORAGE_KEY_STATE = 'ahadex-consent-state';
const STORAGE_KEY_CHOICE = 'ahadex-consent';

export function readConsent(): { choice: ConsentChoice; state: ConsentState } {
  if (typeof window === 'undefined') {
    return { choice: 'unknown', state: DEFAULT_CONSENT };
  }

  try {
    const rawState = localStorage.getItem(STORAGE_KEY_STATE);
    const rawChoice = localStorage.getItem(STORAGE_KEY_CHOICE) as ConsentChoice | null;

    if (rawState) {
      const parsed = JSON.parse(rawState) as ConsentState;
      if (parsed && typeof parsed === 'object') {
        return {
          choice: rawChoice || 'all',
          state: {
            essential: true,
            analytics: Boolean(parsed.analytics),
            advertising: Boolean(parsed.advertising),
          },
        };
      }
    }

    // Migration from legacy choice key
    if (rawChoice === 'measurement' || rawChoice === 'all') {
      return {
        choice: rawChoice,
        state: { essential: true, analytics: true, advertising: true },
      };
    }
    if (rawChoice === 'essential') {
      return {
        choice: 'essential',
        state: { essential: true, analytics: false, advertising: false },
      };
    }
  } catch {
    // Local storage might be disabled or unavailable
  }

  return {
    choice: 'unknown',
    state: DEFAULT_CONSENT,
  };
}

export function readConsentState(): ConsentState {
  return readConsent().state;
}

export function writeConsent(
  choice: ConsentChoice,
  customState?: Partial<Omit<ConsentState, 'essential'>>
): ConsentState {
  let state: ConsentState = { ...DEFAULT_CONSENT };

  if (choice === 'measurement' || choice === 'all') {
    state = { essential: true, analytics: true, advertising: true };
  } else if (choice === 'essential') {
    state = { essential: true, analytics: false, advertising: false };
  }

  if (customState) {
    state = {
      essential: true,
      analytics: customState.analytics !== undefined ? customState.analytics : state.analytics,
      advertising: customState.advertising !== undefined ? customState.advertising : state.advertising,
    };
  }

  try {
    localStorage.setItem(STORAGE_KEY_CHOICE, choice);
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
    // Clean up any old inconsistent keys
    localStorage.removeItem('ahadex-ad-consent');
  } catch {
    // Ignore local storage write errors
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<ConsentState>('ahadex-consent-change', { detail: state }));
  }

  return state;
}

export function isAdvertisingAllowed(): boolean {
  return readConsentState().advertising;
}

export function isAnalyticsAllowed(): boolean {
  return readConsentState().analytics;
}

export function useConsent() {
  const [consentInfo, setConsentInfo] = useState(() => readConsent());

  useEffect(() => {
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentState>;
      const rawChoice = (localStorage.getItem(STORAGE_KEY_CHOICE) as ConsentChoice) || 'unknown';
      setConsentInfo({
        choice: rawChoice,
        state: customEvent.detail || readConsentState(),
      });
    };

    window.addEventListener('ahadex-consent-change', handleConsentChange);
    return () => window.removeEventListener('ahadex-consent-change', handleConsentChange);
  }, []);

  const setConsent = (choice: ConsentChoice, customState?: Partial<Omit<ConsentState, 'essential'>>) => {
    const updatedState = writeConsent(choice, customState);
    setConsentInfo({ choice, state: updatedState });
  };

  return {
    choice: consentInfo.choice,
    consent: consentInfo.state,
    setConsent,
  };
}
