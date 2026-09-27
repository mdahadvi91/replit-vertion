import type { ToolDefinition } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { getEditorialGuide } from '@/data/tool-editorial-content';
import {
  Cpu,
  Lightbulb,
  Briefcase,
  ShieldCheck,
  HelpCircle,
  Wrench,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export function ToolEditorialGuide({ tool }: { tool: ToolDefinition }) {
  const { language } = useI18n();
  const guide = getEditorialGuide(tool, language);
  const isBn = language === 'bn';

  return (
    <section className="editorial-guide-section" style={{ marginTop: 48, borderTop: '1px solid hsl(var(--border))', paddingTop: 40 }}>
      {/* 1. Technical Architecture & How It Works */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Cpu size={22} style={{ color: 'hsl(var(--primary))' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
            {guide.howItWorksTitle}
          </h2>
        </div>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'hsl(var(--muted-foreground))', marginBottom: 20 }}>
          {guide.howItWorksIntro}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {guide.technicalSteps.map((step, idx) => (
            <div
              key={step.title}
              style={{
                background: 'hsl(var(--secondary) / .3)',
                border: '1px solid hsl(var(--border))',
                borderRadius: 14,
                padding: '20px 18px',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'hsl(var(--primary) / .15)',
                  color: 'hsl(var(--primary))',
                  fontWeight: 800,
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                0{idx + 1}
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: 'hsl(var(--foreground))' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Pro Tips for Best Results */}
      <div
        style={{
          background: 'hsl(var(--primary) / .05)',
          border: '1px solid hsl(var(--primary) / .2)',
          borderRadius: 16,
          padding: '26px 24px',
          marginBottom: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Lightbulb size={22} style={{ color: 'hsl(var(--primary))' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'hsl(var(--foreground))' }}>
            {guide.proTipsTitle}
          </h3>
        </div>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {guide.proTips.map((tip, idx) => (
            <li key={idx} style={{ fontSize: '0.94rem', lineHeight: 1.6, color: 'hsl(var(--foreground))' }}>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Real-World Use Cases */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Briefcase size={22} style={{ color: 'hsl(var(--primary))' }} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            {guide.useCasesTitle}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {guide.useCases.map((uc) => (
            <div
              key={uc.role}
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 14,
                padding: '20px 18px',
              }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: 'hsl(var(--primary))',
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                {uc.role}
              </span>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'hsl(var(--foreground))', margin: '0 0 10px', fontWeight: 500 }}>
                {uc.scenario}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>
                <CheckCircle2 size={15} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                <span>{uc.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Comparison Table: Local vs Cloud */}
      <div style={{ marginBottom: 40, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <ShieldCheck size={22} style={{ color: 'hsl(var(--primary))' }} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            {guide.comparisonTitle}
          </h3>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
            textAlign: 'left',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid hsl(var(--border))',
          }}
        >
          <thead>
            <tr style={{ background: 'hsl(var(--secondary) / .5)', borderBottom: '1px solid hsl(var(--border))' }}>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>{isBn ? 'বৈশিষ্ট্য' : 'Feature'}</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                Ahadex Tools (In-Browser)
              </th>
              <th style={{ padding: '14px 16px', fontWeight: 700, color: 'hsl(var(--muted-foreground))' }}>
                {isBn ? 'সাধারণ ক্লাউড কনভার্টার' : 'Legacy Cloud Converters'}
              </th>
            </tr>
          </thead>
          <tbody>
            {guide.comparisonItems.map((item, idx) => (
              <tr
                key={item.feature}
                style={{
                  borderBottom: idx < guide.comparisonItems.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                  background: idx % 2 === 0 ? 'transparent' : 'hsl(var(--secondary) / .15)',
                }}
              >
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{item.feature}</td>
                <td style={{ padding: '14px 16px', color: 'hsl(var(--foreground))' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                    <span>{item.local}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: 'hsl(var(--muted-foreground))' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <XCircle size={16} style={{ color: 'hsl(var(--destructive))', flexShrink: 0 }} />
                    <span>{item.cloud}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Troubleshooting Common Questions */}
      {guide.troubleshooting.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Wrench size={22} style={{ color: 'hsl(var(--primary))' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {guide.troubleshootingTitle}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {guide.troubleshooting.map((item) => (
              <div
                key={item.problem}
                style={{
                  background: 'hsl(var(--secondary) / .2)',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 12,
                  padding: '16px 20px',
                }}
              >
                <strong style={{ fontSize: '0.98rem', display: 'block', marginBottom: 6, color: 'hsl(var(--foreground))' }}>
                  ❓ {item.problem}
                </strong>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))' }}>
                  💡 {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Extended FAQs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <HelpCircle size={22} style={{ color: 'hsl(var(--primary))' }} />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            {guide.extendedFaqTitle}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {guide.extendedFaqs.map((faq) => (
            <details
              key={faq.q}
              style={{
                background: 'hsl(var(--secondary) / .2)',
                border: '1px solid hsl(var(--border))',
                borderRadius: 12,
                padding: '14px 18px',
                cursor: 'pointer',
              }}
            >
              <summary style={{ fontWeight: 700, fontSize: '0.95rem', color: 'hsl(var(--foreground))' }}>
                {faq.q}
              </summary>
              <p style={{ margin: '12px 0 0', fontSize: '0.9rem', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))' }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ToolEditorialGuide;
