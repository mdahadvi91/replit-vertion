import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Logo } from './Header';

export function Footer() {
  const { copy, getLocalizedPath } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand"><Logo /><p>{copy.footerDescription}</p></div>
          <div className="footer-links">
            <div>
              <h4>{copy.exploreHeader}</h4>
              <Link className="footer-link" to={getLocalizedPath('/tools')}>{copy.tools}</Link>
              <Link className="footer-link" to={getLocalizedPath('/about')}>{copy.about}</Link>
              <Link className="footer-link" to={getLocalizedPath('/contact')}>{copy.contact}</Link>
            </div>
            <div>
              <h4>{copy.trustHeader}</h4>
              <Link className="footer-link" to={getLocalizedPath('/privacy-policy')}>{copy.privacy}</Link>
              <Link className="footer-link" to={getLocalizedPath('/terms')}>{copy.terms}</Link>
              <Link className="footer-link" to={getLocalizedPath('/disclaimer')}>{copy.disclaimer}</Link>
              <Link className="footer-link" to={getLocalizedPath('/cookie-policy')}>{copy.cookiePolicy}</Link>
              <Link className="footer-link" to={getLocalizedPath('/accessibility')}>{copy.accessibility}</Link>
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
