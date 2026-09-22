import { Link, useLocation } from 'react-router-dom';

export function MainNavigation({ items }: { items: Array<[string, string]> }) {
  const location = useLocation();
  return (
    <nav className="nav-links" aria-label="Primary navigation">
      {items.map(([href, label]) => (
        <Link key={href} to={href} className={`nav-link${location.pathname === href ? ' active' : ''}`} data-testid={`link-nav-${label.toLowerCase()}`}>
          {label}
        </Link>
      ))}
    </nav>
  );
}