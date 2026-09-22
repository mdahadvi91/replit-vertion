import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Languages, Menu, Moon, Search, Settings2, Sun, X, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryList } from '@/registry/tool-registry';
import { useI18n, type Language } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { MainNavigation } from '@/components/navigation/MainNavigation';

type Theme = 'light' | 'dark';

export function Logo() {
  return (
    <Link to="/" className="brand" aria-label="Ahadex Tools home" data-testid="link-logo">
      <span className="brand-mark" aria-hidden="true"><Zap size={18} strokeWidth={2.5} /></span>
      <span>Ahadex<span style={{ color: 'hsl(var(--primary))' }}> Tools</span></span>
    </Link>
  );
}

export function MobileDrawer({
  side,
  open,
  title,
  onClose,
  children,
}: {
  side: 'left' | 'right';
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const firstControlRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstControlRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;
  return (
    <>
      <button type="button" className="drawer-backdrop" aria-label="Close menu" onClick={onClose} />
      <aside className={`mobile-drawer ${side}`} aria-label={title} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <strong>{title}</strong>
          <button ref={firstControlRef} type="button" className="icon-button" aria-label="Close menu" onClick={onClose}><X size={17} /></button>
        </div>
        {children}
      </aside>
    </>
  );
}

export function Header({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const { copy, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navItems: Array<[string, string]> = [
    ['/', copy.home],
    ['/tools', copy.tools],
    ['/about', copy.about],
    ['/contact', copy.contact],
  ];

  const closeTools = () => setToolsOpen(false);
  const closeSettings = () => setSettingsOpen(false);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    trackEvent('search', { query: query.trim().slice(0, 80) });
    navigate(query.trim() ? `/tools?query=${encodeURIComponent(query.trim())}` : '/tools');
    closeTools();
  };

  return (
    <>
      <header className="site-header">
        <div className="container nav-inner">
          <button className="menu-button" type="button" aria-label="Open tool categories" aria-expanded={toolsOpen} onClick={() => setToolsOpen(true)}><Menu size={18} /></button>
          <Logo />
          <MainNavigation items={navItems} />
          <form className="header-search" onSubmit={submitSearch} role="search">
            <Search size={15} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchTools} aria-label={copy.searchTools} />
          </form>
          <div className="nav-actions">
            <button className="lang-button" type="button" aria-label="Switch language" onClick={() => { const next: Language = language === 'en' ? 'bn' : 'en'; setLanguage(next); trackEvent('language_change', { language: next }); }}><Languages size={15} /><span>{copy.languageLabel}</span></button>
            <button className="icon-button" type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => { const next: Theme = theme === 'light' ? 'dark' : 'light'; setTheme(next); trackEvent('theme_change', { theme: next }); }}>{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button>
            <button className="settings-button icon-button" type="button" aria-label="Open settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(true)}><Settings2 size={16} /></button>
          </div>
        </div>
      </header>
      <MobileDrawer side="left" open={toolsOpen} title={copy.tools} onClose={closeTools}>
        <form className="drawer-search" onSubmit={submitSearch} role="search">
          <Search size={15} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchTools} aria-label={copy.searchTools} />
        </form>
        <nav className="drawer-links" aria-label="Tool categories">
          {categoryList.map((category) => (
            <Link key={category} to={category === 'All' ? '/tools' : `/category/${category.toLowerCase()}`} onClick={closeTools}>
              {category === 'All' ? copy.allCategory : category}
            </Link>
          ))}
        </nav>
      </MobileDrawer>
      <MobileDrawer side="right" open={settingsOpen} title={copy.settings} onClose={closeSettings}>
        <div className="settings-list">
          <span className="drawer-label">{copy.settings}</span>
          <button type="button" className={`setting-choice${theme === 'light' ? ' active' : ''}`} onClick={() => setTheme('light')}><Sun size={15} /> {copy.themeLight}</button>
          <button type="button" className={`setting-choice${theme === 'dark' ? ' active' : ''}`} onClick={() => setTheme('dark')}><Moon size={15} /> {copy.themeDark}</button>
          <span className="drawer-label">{copy.languageLabel}</span>
          <button type="button" className={`setting-choice${language === 'en' ? ' active' : ''}`} onClick={() => setLanguage('en')}>English</button>
          <button type="button" className={`setting-choice${language === 'bn' ? ' active' : ''}`} onClick={() => setLanguage('bn')}>বাংলা</button>
          <span className="drawer-label">{copy.motion}</span>
          <p className="drawer-note">{copy.reducedMotionNote}</p>
        </div>
      </MobileDrawer>
    </>
  );
}

