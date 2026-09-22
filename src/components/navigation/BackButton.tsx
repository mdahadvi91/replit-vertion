import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BackButton({ href = '/tools', label = 'Back to tools' }: { href?: string; label?: string }) {
  return <Link className="fixed-tools-btn" to={href}><ArrowLeft size={16} />{label}</Link>;
}