import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Logo } from './Header';

export function Footer() {
  const { copy } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand"><Logo /><p>{copy.footerDescription}</p></div>
          <div className="footer-links">
            <div>
              <h4>{copy.exploreHeader}</h4>
              <Link className="footer-link" to="/tools">{copy.tools}</Link>
              <Link className="footer-link" to="/about">{copy.about}</Link>
              <Link className="footer-link" to="/contact">{copy.contact}</Link>
            </div>
            <div>
              <h4>{copy.trustHeader}</h4>
              <Link className="footer-link" to="/privacy-policy">{copy.privacy}</Link>
              <Link className="footer-link" to="/terms">{copy.terms}</Link>
              <Link className="footer-link" to="/disclaimer">{copy.disclaimer}</Link>
              <Link className="footer-link" to="/cookie-policy">{copy.cookiePolicy}</Link>
              <Link className="footer-link" to="/accessibility">{copy.accessibility}</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{copy.footerCopyright}</span>
          <span>{copy.footerTagline}</span>
        </div>
      </div>
    </footer>
  );
}

