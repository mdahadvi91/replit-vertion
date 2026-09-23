import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Mail, MessageCircle } from 'lucide-react';
import { useI18n } from '@/i18n';

const CONTACT_EMAIL = 'mdahadvi91@gmail.com';
const WHATSAPP_NUMBER = '971507975837';

/**
 * Contact is intentionally backend-free. The browser opens the user's email
 * client with a prefilled message; WhatsApp is available as a direct fallback.
 */
export default function ContactPage() {
  const { copy, language } = useI18n();
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const subject = encodeURIComponent(`Ahadex contact message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const confirmation = language === 'bn'
    ? 'আপনার ইমেইল অ্যাপ খুলবে। সেখানে Send চাপলে বার্তাটি পাঠানো হবে।'
    : 'Your email app should open. Press Send there to deliver the message.';

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
              <a href={`mailto:${CONTACT_EMAIL}`} className="contact-method-card" title={`Send email to ${CONTACT_EMAIL}`}>
                <div className="contact-method-icon"><Mail size={18} /></div>
                <div className="contact-method-info"><strong>{copy.emailLabel}</strong><span>{CONTACT_EMAIL}</span></div>
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Ahadex%20Tools`} target="_blank" rel="noopener noreferrer" className="contact-method-card" title={`Chat on WhatsApp +${WHATSAPP_NUMBER}`}>
                <div className="contact-method-icon whatsapp"><MessageCircle size={18} /></div>
                <div className="contact-method-info"><strong>{copy.whatsappLabel}</strong><span>+971507975837</span></div>
              </a>
            </div>
            <p className="mono" style={{ fontSize: 11, marginTop: 18, color: 'hsl(var(--muted-foreground))' }}>{CONTACT_EMAIL} · +971507975837</p>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="form-field"><label htmlFor="contact-name">{copy.formNameLabel}</label><input id="contact-name" name="name" required maxLength={100} placeholder={copy.formNamePlaceholder} /></div>
            <div className="form-field"><label htmlFor="contact-email">{copy.formEmailLabel}</label><input id="contact-email" name="email" type="email" required maxLength={254} placeholder={copy.formEmailPlaceholder} /></div>
            <div className="form-field"><label htmlFor="contact-message">{copy.formMessageLabel}</label><textarea id="contact-message" name="message" required maxLength={5000} placeholder={copy.formMessagePlaceholder} /></div>
            {sent ? (
              <div className="success-note" role="status"><Check size={15} style={{ verticalAlign: 'middle', marginRight: 5 }} /> {confirmation}</div>
            ) : (
              <button className="button button-primary" type="submit">{copy.sendButton} <ArrowRight size={16} /></button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
