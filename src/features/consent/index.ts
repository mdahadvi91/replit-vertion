export type ConsentChoice = 'unknown' | 'essential' | 'measurement';

export function readConsent(): ConsentChoice {
  const value = localStorage.getItem('ahadex-consent');
  return value === 'essential' || value === 'measurement' ? value : 'unknown';
}