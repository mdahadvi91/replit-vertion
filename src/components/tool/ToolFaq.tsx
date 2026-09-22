import { useState } from 'react';

export function ToolFaq({ items }: { items: Array<{ question: string; answer: string }> }) {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="faq-list">{items.map((item, index) => <div className="faq-item" key={item.question}><button className={`faq-question ${open === index ? 'open' : ''}`} type="button" onClick={() => setOpen(open === index ? null : index)}>{item.question}<span>+</span></button>{open === index && <div className="faq-answer open"><p>{item.answer}</p></div>}</div>)}</div>;
}