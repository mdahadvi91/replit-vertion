import { useState, type FormEvent } from 'react';
import { Mail, MessageCircle, Send, Check, Copy } from 'lucide-react';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';

const CONTACT_EMAIL = 'mdahadvi91@gmail.com';
const WHATSAPP_NUMBER = '+971507975837';
const WHATSAPP_LINK = 'https://wa.me/971507975837?text=Hello%20Ahadex%20Tools';

export default function ContactPage() {
  const { copy, language } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackEvent('contact_form_submit', { language });

    const mailSubject = subject.trim()
      ? `[Ahadex Tools] ${subject.trim()}`
      : `[Ahadex Tools] Message from ${name || 'User'}`;

    const mailBody = `Name: ${name}
Email: ${email}
Language: ${language}

Message:
${message}`;

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    // Honest behavior: launch the user's email client
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const handleCopyMessage = () => {
    const fullText = `To: ${CONTACT_EMAIL}\nSubject: ${subject || 'Ahadex Tools Feedback'}\nFrom: ${name} (${email})\n\n${message}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const isBn = language === 'bn';

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">{copy.contactEyebrow}</span>
          <h1>{copy.contactH1}</h1>
          <p>{copy.contactIntro}</p>
        </div>
      </div>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-card">
            <h3>{copy.contactCardTitle}</h3>
            <p>{copy.contactCardDesc}</p>

            <div className="contact-methods">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="contact-method-card"
                title={`Send email to ${CONTACT_EMAIL}`}
                onClick={() => trackEvent('contact_click_email', { source: 'card' })}
              >
                <div className="contact-method-icon">
                  <Mail size={18} />
                </div>
                <div className="contact-method-info">
                  <strong>{copy.emailLabel}</strong>
                  <span>{CONTACT_EMAIL}</span>
                </div>
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method-card"
                title={`Chat on WhatsApp ${WHATSAPP_NUMBER}`}
                onClick={() => trackEvent('contact_click_whatsapp', { source: 'card' })}
              >
                <div className="contact-method-icon whatsapp">
                  <MessageCircle size={18} />
                </div>
                <div className="contact-method-info">
                  <strong>{copy.whatsappLabel}</strong>
                  <span>{WHATSAPP_NUMBER}</span>
                </div>
              </a>
            </div>

            <p className="mono" style={{ fontSize: 11, marginTop: 18, color: 'hsl(var(--muted-foreground))' }}>
              hello@ahadex.online · {CONTACT_EMAIL}
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="contact-name">{copy.formNameLabel}</label>
              <input
                id="contact-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.formNamePlaceholder}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">{copy.formEmailLabel}</label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.formEmailPlaceholder}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-subject">{isBn ? 'বিষয় (ঐচ্ছিক)' : 'Subject (Optional)'}</label>
              <input
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={isBn ? 'কী বিষয়ে যোগাযোগ করছেন?' : 'What is this regarding?'}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">{copy.formMessageLabel}</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={copy.formMessagePlaceholder}
              />
            </div>

            {submitted ? (
              <div
                className="success-note"
                role="status"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: 16,
                  borderRadius: 12,
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'hsl(var(--primary))' }}>
                  <Check size={18} />
                  <strong>
                    {isBn
                      ? 'আপনার ইমেইল অ্যাপ ওপেন করা হয়েছে!'
                      : 'Opening your email client...'}
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
                  {isBn
                    ? 'আপনার মেসেজটি স্বয়ংক্রিয়ভাবে সাজানো হয়েছে। ইমেইল অ্যাপ থেকে সেন্ড বাটনে চাপলেই মেসেজটি আমাদের কাছে পৌঁছে যাবে।'
                    : 'Your message has been pre-filled in your default email client. Press Send in your email app to reach us directly.'}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  <button
                    type="button"
                    className="button button-ghost"
                    style={{ minHeight: 36, padding: '0 12px', fontSize: 12 }}
                    onClick={handleCopyMessage}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'মেসেজ কপি করুন' : 'Copy Message')}
                  </button>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-ghost"
                    style={{ minHeight: 36, padding: '0 12px', fontSize: 12 }}
                  >
                    <MessageCircle size={14} />
                    {isBn ? 'হোয়াটসঅ্যাপে পাঠান' : 'Chat on WhatsApp'}
                  </a>
                </div>
              </div>
            ) : (
              <button className="button button-primary" type="submit">
                {copy.sendButton} <Send size={16} />
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
