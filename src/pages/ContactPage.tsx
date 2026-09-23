import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Mail, MessageCircle } from 'lucide-react';
import { useI18n } from '@/i18n';

const CONTACT_ENDPOINT = (import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string | undefined)?.trim();
const CONTACT_EMAIL = 'mdahadvi91@gmail.com';

export default function ContactPage() {
  const { copy, language } = useI18n();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    try {
      if (!CONTACT_ENDPOINT) {
        const subject = encodeURIComponent(`Ahadex contact message from ${payload.name}`);
        const body = encodeURIComponent(`From: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setStatus('sent');
        return;
      }

      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Contact request failed (${response.status})`);
      form.reset();
      setStatus('sent');
    } catch (submissionError) {
      console.error(submissionError);
      setError(language === 'bn' ? 'বার্তা পাঠানো যায়নি। অনুগ্রহ করে ইমেইল বা WhatsApp ব্যবহার করুন।' : 'The message could not be sent. Please use email or WhatsApp instead.');
      setStatus('error');
    }
  }

  const sentMessage = CONTACT_ENDPOINT
    ? copy.successNote
    : language === 'bn'
      ? 'আপনার ইমেইল অ্যাপ খোলার কথা—Send চাপলে বার্তাটি পাঠানো হবে।'
      : 'Your email app should now be open. Press Send to deliver the message.';

  return (
    <main>
      <div className="page-hero"><div className="container"><span className="eyebrow">{copy.contactEyebrow}</span><h1>{copy.contactH1}</h1><p>{copy.contactIntro}</p></div></div>
      <section className="section"><div className="container contact-grid">
        <div className="contact-card">
          <h3>{copy.contactCardTitle}</h3><p>{copy.contactCardDesc}</p>
          <div className="contact-methods">
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-method-card" title={`Send email to ${CONTACT_EMAIL}`}><div className="contact-method-icon"><Mail size={18} /></div><div className="contact-method-info"><strong>{copy.emailLabel}</strong><span>{CONTACT_EMAIL}</span></div></a>
            <a href="https://wa.me/971507975837?text=Hello%20Ahadex%20Tools" target="_blank" rel="noopener noreferrer" className="contact-method-card" title="Chat on WhatsApp +971507975837"><div className="contact-method-icon whatsapp"><MessageCircle size={18} /></div><div className="contact-method-info"><strong>{copy.whatsappLabel}</strong><span>+971507975837</span></div></a>
          </div>
          <p className="mono" style={{ fontSize: 11, marginTop: 18, color: 'hsl(var(--muted-foreground))' }}>hello@ahadex.online · {CONTACT_EMAIL}</p>
        </div>
        <form className="contact-form" onSubmit={submit} noValidate>
          <div className="form-field"><label htmlFor="contact-name">{copy.formNameLabel}</label><input id="contact-name" name="name" required maxLength={100} placeholder={copy.formNamePlaceholder} /></div>
          <div className="form-field"><label htmlFor="contact-email">{copy.formEmailLabel}</label><input id="contact-email" name="email" type="email" required maxLength={254} placeholder={copy.formEmailPlaceholder} /></div>
          <div className="form-field"><label htmlFor="contact-message">{copy.formMessageLabel}</label><textarea id="contact-message" name="message" required maxLength={5000} placeholder={copy.formMessagePlaceholder} /></div>
          {status === 'sent' ? <div className="success-note" role="status"><Check size={15} style={{ verticalAlign: 'middle', marginRight: 5 }} /> {sentMessage}</div> : <button className="button button-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? (language === 'bn' ? 'পাঠানো হচ্ছে…' : 'Sending…') : <>{copy.sendButton} <ArrowRight size={16} /></>}</button>}
          {status === 'error' && <p role="alert" style={{ color: 'hsl(var(--destructive))', fontSize: 13 }}>{error}</p>}
        </form>
      </div></section>
    </main>
  );
}
