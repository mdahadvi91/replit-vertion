import { useState, useEffect } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  RotateCw,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Sliders,
} from 'lucide-react';
import type { ToolDefinition } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { useConsent } from '@/features/consent';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';
import { RelatedTools } from '@/components/tool/RelatedTools';

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS_CHARS = /[il1Lo0O]/g;

function getSecureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function calculateStrength(password: string): { label: string; score: number; color: string } {
  let score = 0;
  if (!password) return { label: 'Empty', score: 0, color: 'hsl(var(--muted))' };

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 3) return { label: 'Weak', score: 25, color: '#ef4444' };
  if (score <= 5) return { label: 'Moderate', score: 55, color: '#eab308' };
  if (score <= 6) return { label: 'Strong', score: 85, color: '#10b981' };
  return { label: 'Very Strong', score: 100, color: '#14b8a6' };
}

export function PasswordGeneratorTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();

  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePasswords = () => {
    let charset = '';
    if (includeUpper) charset += UPPERCASE_CHARS;
    if (includeLower) charset += LOWERCASE_CHARS;
    if (includeNumbers) charset += NUMBER_CHARS;
    if (includeSymbols) charset += SYMBOL_CHARS;

    if (excludeAmbiguous) {
      charset = charset.replace(AMBIGUOUS_CHARS, '');
    }

    if (!charset) {
      charset = LOWERCASE_CHARS;
    }

    const generated: string[] = [];

    for (let c = 0; c < count; c++) {
      let pass = '';
      for (let i = 0; i < length; i++) {
        pass += charset[getSecureRandomInt(charset.length)];
      }
      generated.push(pass);
    }

    setPasswords(generated);
    trackEvent('tool_run', { tool: 'password-generator', length, count });
  };

  useEffect(() => {
    generatePasswords();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, count]);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  const isBn = language === 'bn';
  const primaryPassword = passwords[0] || '';
  const strength = calculateStrength(primaryPassword);

  return (
    <main className="prose-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ color: 'hsl(var(--primary))' }}>
          {tool.category} / {isBn ? 'ক্রিপ্টোগ্রাফিক সুরক্ষা' : 'Cryptographically Secure'}
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8 }}>{tool.seo.h1}</h1>
        <p style={{ fontSize: 16, color: 'hsl(var(--muted-foreground))', marginTop: 8 }}>{tool.description}</p>
      </header>

      <section
        style={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 20,
          padding: 24,
          marginBottom: 40,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Main Password Display Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '18px 24px',
              borderRadius: 14,
              background: 'hsl(var(--secondary) / .4)',
              border: '1px solid hsl(var(--border))',
            }}
          >
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span
                style={{
                  fontFamily: 'monospace, system-ui',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: 'hsl(var(--foreground))',
                  wordBreak: 'break-all',
                }}
              >
                {primaryPassword}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button
                type="button"
                className="button button-ghost"
                onClick={generatePasswords}
                style={{ padding: 10 }}
                title="Generate New Password"
              >
                <RotateCw size={18} />
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => handleCopy(primaryPassword, 0)}
                style={{ padding: '10px 18px', fontSize: 14 }}
              >
                {copiedIndex === 0 ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedIndex === 0 ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'কপি করুন' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Strength Meter Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span>{isBn ? 'পাসওয়ার্ডের শক্তিমত্তা:' : 'Security Strength:'}</span>
              <strong style={{ color: strength.color }}>{strength.label}</strong>
            </div>
            <div style={{ height: 8, background: 'hsl(var(--secondary))', borderRadius: 99, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${strength.score}%`,
                  background: strength.color,
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Settings Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              padding: 20,
              borderRadius: 14,
              background: 'hsl(var(--secondary) / .2)',
              border: '1px solid hsl(var(--border))',
            }}
          >
            {/* Left: Length & Bulk Count */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{isBn ? 'দৈর্ঘ্য (Length):' : 'Password Length:'}</span>
                  <strong style={{ fontSize: 15, color: 'hsl(var(--primary))' }}>{length}</strong>
                </div>
                <input
                  type="range"
                  min="6"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'hsl(var(--primary))' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  {isBn ? 'একসাথে কতটি পাসওয়ার্ড তৈরি করবেন?' : 'Batch Quantity:'}
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8 }}
                >
                  <option value={1}>{isBn ? '১টি পাসওয়ার্ড' : '1 Password'}</option>
                  <option value={5}>{isBn ? '৫টি পাসওয়ার্ড' : '5 Passwords'}</option>
                  <option value={10}>{isBn ? '১০টি পাসওয়ার্ড' : '10 Passwords'}</option>
                </select>
              </div>
            </div>

            {/* Right: Character Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{isBn ? 'অক্ষরের ধরন:' : 'Character Rules:'}</span>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                />
                <span>{isBn ? 'বড় হাতের অক্ষর (A-Z)' : 'Uppercase Letters (A-Z)'}</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                />
                <span>{isBn ? 'ছোট হাতের অক্ষর (a-z)' : 'Lowercase Letters (a-z)'}</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                />
                <span>{isBn ? 'সংখ্যা (0-9)' : 'Numbers (0-9)'}</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                />
                <span>{isBn ? 'প্রতীক / স্পেশাল ক্যারেক্টার (!@#$%^&*)' : 'Special Symbols (!@#$%^&*)'}</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                />
                <span>{isBn ? 'বিভ্রান্তিকর অক্ষর বাদ দিন (যেমন: 1, l, I, 0, O)' : 'Exclude Ambiguous Characters (1, l, I, 0, O)'}</span>
              </label>
            </div>
          </div>

          {/* Bulk Passwords List if count > 1 */}
          {passwords.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <strong style={{ fontSize: 15 }}>{isBn ? 'জেনারেট করা পাসওয়ার্ড তালিকা:' : 'Generated Passwords Batch:'}</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {passwords.map((pw, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  >
                    <span style={{ fontFamily: 'monospace, system-ui', fontSize: 14 }}>{pw}</span>
                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={() => handleCopy(pw, idx)}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      {copiedIndex === idx ? <Check size={14} style={{ color: 'hsl(var(--primary))' }} /> : <Copy size={14} />}
                      {copiedIndex === idx ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি' : 'Copy')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="tool-content" style={{ marginTop: 40, borderTop: '1px solid hsl(var(--border))', paddingTop: 28 }}>
        <h2>{isBn ? 'নিরাপদ পাসওয়ার্ড তৈরির নিয়মাবলী' : 'Best Practices for Strong Passwords'}</h2>
        <ol>
          <li>{tool.content.howToUse[0]}</li>
          <li>{tool.content.howToUse[1]}</li>
          <li>{tool.content.howToUse[2]}</li>
        </ol>

        <h2>{copy.privacyAndLimitations}</h2>
        <p>{tool.content.privacy}</p>
        <p>{tool.content.limitations}</p>
      </section>

      <RelatedTools tool={tool} />

      <section className="tool-content" style={{ marginTop: 44, borderTop: '1px solid hsl(var(--border))', paddingTop: 32 }}>
        <h2>{isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Frequently Asked Questions (FAQ)'}</h2>
        <div className="faq-list">
          {tool.content.faq.map(({ question, answer }) => (
            <details key={question} className="tool-faq">
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 32 }}>
        <AdSlot enabled={consent.advertising} slot={adConfig.toolSlot} label="Sponsored Ad" />
      </div>
    </main>
  );
}

export default PasswordGeneratorTool;
