import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  Languages,
  Menu,
  Moon,
  Search,
  Settings2,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { categoryList, tools, getLocalizedTool } from '@/registry/tool-registry';
import { useI18n, type Language } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { MainNavigation } from '@/components/navigation/MainNavigation';
import { matchToolQuery, calculateToolScore } from '@/lib/search/toolSearch';

type Theme = 'light' | 'dark';

export function Logo() {
  const { getLocalizedPath } = useI18n();
  return (
    <Link
      to={getLocalizedPath('/')}
      className="brand"
      aria-label="Ahadex Tools home"
      data-testid="link-logo"
    >
      <span className="brand-mark" aria-hidden="true">
        <Zap size={18} strokeWidth={2.5} />
      </span>

      <span>
        Ahadex
        <span style={{ color: 'hsl(var(--primary))' }}> Tools</span>
      </span>
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
      if (event.key === 'Escape') {
        onClose();
      }
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
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="Close menu"
        onClick={onClose}
      />

      <aside
        className={`mobile-drawer ${side}`}
        aria-label={title}
        role="dialog"
        aria-modal="true"
      >
        <div className="drawer-head">
          <strong>{title}</strong>

          <button
            ref={firstControlRef}
            type="button"
            className="icon-button"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        {children}
      </aside>
    </>
  );
}

export function Header({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) {
  const { copy, language, setLanguage, getLocalizedPath } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [toolsOpen, setToolsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const drawerSearchRef = useRef<HTMLDivElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const navItems: Array<[string, string]> = [
    [getLocalizedPath('/'), copy.home],
    [getLocalizedPath('/tools'), copy.tools],
    [getLocalizedPath('/about'), copy.about],
    [getLocalizedPath('/contact'), copy.contact],
  ];

  const handleToggleLanguage = (targetLang?: Language) => {
    const nextLang: Language = targetLang || (language === 'en' ? 'bn' : 'en');
    setLanguage(nextLang);
    const targetUrl = getLocalizedPath(location.pathname + location.search, nextLang);
    navigate(targetUrl);
    trackEvent('language_change', { language: nextLang });
  };

  const closeTools = () => {
    setToolsOpen(false);
    setSearchOpen(false);
    setActiveIndex(-1);
  };
  const closeSettings = () => setSettingsOpen(false);

  const normalizedQuery = query.trim().toLowerCase();

  const localizedTools = useMemo(() => {
    return tools.map((tool) => getLocalizedTool(tool, language));
  }, [language]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return localizedTools
      .map((tool) => {
        const raw = tools.find((r) => r.id === tool.id);
        const score = calculateToolScore(tool, normalizedQuery, raw);
        return { tool, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.tool)
      .slice(0, 8);
  }, [normalizedQuery, localizedTools]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDesktop = searchRef.current?.contains(target);
      const clickedInsideDrawer = drawerSearchRef.current?.contains(target);

      if (!clickedInsideDesktop && !clickedInsideDrawer) {
        setSearchOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const openTool = (tool: (typeof localizedTools)[number], isDrawer = false) => {
    trackEvent('search_result_click', {
      query: query.trim().slice(0, 80),
      tool: tool.slug,
    });

    navigate(getLocalizedPath(tool.route));

    setQuery('');
    setSearchOpen(false);
    setActiveIndex(-1);
    if (isDrawer) closeTools();
  };

  const submitSearch = (event: FormEvent, isDrawer = false) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (activeIndex >= 0 && activeIndex < searchResults.length) {
      const tool = searchResults[activeIndex];
      openTool(tool, isDrawer);
      return;
    }

    trackEvent('search', {
      query: trimmedQuery.slice(0, 80),
    });

    navigate(
      trimmedQuery
        ? getLocalizedPath(`/tools?query=${encodeURIComponent(trimmedQuery)}`)
        : getLocalizedPath('/tools'),
    );

    setSearchOpen(false);
    setActiveIndex(-1);
    if (isDrawer) closeTools();
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    isDrawer = false,
  ) => {
    if (!searchOpen) {
      if (event.key === 'ArrowDown' && searchResults.length > 0) {
        event.preventDefault();
        setSearchOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (searchResults.length === 0) return;
      setActiveIndex((current) =>
        current >= searchResults.length - 1 ? 0 : current + 1,
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (searchResults.length === 0) return;
      setActiveIndex((current) =>
        current <= 0 ? searchResults.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setSearchOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      const tool = searchResults[activeIndex];
      if (tool) {
        openTool(tool, isDrawer);
      }
    }
  };

  const renderSearchResults = (isDrawer = false) => {
    if (!searchOpen || !normalizedQuery) {
      return null;
    }

    if (searchResults.length === 0) {
      return (
        <div className="search-dropdown" role="status">
          <div className="search-no-results">
            {copy.searchNoResults}
          </div>
          <button
            type="button"
            className="search-dropdown-footer"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              navigate(`/tools?query=${encodeURIComponent(query.trim())}`);
              setSearchOpen(false);
              if (isDrawer) closeTools();
            }}
          >
            {language === 'bn' ? 'সব টুলস লাইব্রেরিতে খুঁজুন' : 'Search in all tools library'} →
          </button>
        </div>
      );
    }

    return (
      <div
        className="search-dropdown"
        role="listbox"
        aria-label={copy.searchTools}
      >
        {searchResults.map((tool, index) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              type="button"
              className={`search-result-item${
                activeIndex === index ? ' active' : ''
              }`}
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => openTool(tool, isDrawer)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span
                className="search-result-icon"
                aria-hidden="true"
                style={{ color: tool.color }}
              >
                <Icon size={16} />
              </span>

              <span className="search-result-content">
                <strong>{tool.name}</strong>
                <small>{tool.description}</small>
              </span>

              <span className="search-result-badge">
                {tool.status === 'live' ? copy.liveNow : copy.planned}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          className="search-dropdown-footer"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            navigate(`/tools?query=${encodeURIComponent(query.trim())}`);
            setSearchOpen(false);
            if (isDrawer) closeTools();
          }}
        >
          {language === 'bn'
            ? `"${query.trim()}" এর সকল ফলাফল দেখুন (${searchResults.length})`
            : `${copy.searchViewAll} for "${query.trim()}" (${searchResults.length})`} →
        </button>
      </div>
    );
  };

  return (
    <>
      <header className="site-header">
        <div className="container nav-inner">
          <button
            className="menu-button"
            type="button"
            aria-label="Open tool categories"
            aria-expanded={toolsOpen}
            onClick={() => setToolsOpen(true)}
          >
            <Menu size={18} />
          </button>

          <Logo />

          <MainNavigation items={navItems} />

          <div
            ref={searchRef}
            className="header-search-wrapper"
          >
            <form
              className="header-search"
              onSubmit={(e) => submitSearch(e, false)}
              role="search"
            >
              <button
                type="submit"
                className="search-icon-btn"
                aria-label={copy.searchTools}
              >
                <Search size={15} aria-hidden="true" />
              </button>

              <input
                ref={desktopInputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => {
                  if (query.trim()) {
                    setSearchOpen(true);
                  }
                }}
                onKeyDown={(e) => handleSearchKeyDown(e, false)}
                placeholder={copy.searchTools}
                aria-label={copy.searchTools}
                aria-expanded={searchOpen}
                autoComplete="off"
              />

              {query.trim() && (
                <button
                  type="button"
                  className="search-clear-btn"
                  aria-label={copy.clearSearch}
                  onClick={() => {
                    setQuery('');
                    setSearchOpen(false);
                    setActiveIndex(-1);
                    desktopInputRef.current?.focus();
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {renderSearchResults(false)}
          </div>

          <div className="nav-actions">
            <button
              className="lang-button"
              type="button"
              aria-label="Switch language"
              onClick={() => handleToggleLanguage()}
            >
              <Languages size={15} />
              <span>{copy.languageLabel}</span>
            </button>

            <button
              className="icon-button"
              type="button"
              aria-label={`Switch to ${
                theme === 'light' ? 'dark' : 'light'
              } theme`}
              onClick={() => {
                const next: Theme =
                  theme === 'light' ? 'dark' : 'light';

                setTheme(next);

                trackEvent('theme_change', {
                  theme: next,
                });
              }}
            >
              {theme === 'light' ? (
                <Moon size={16} />
              ) : (
                <Sun size={16} />
              )}
            </button>

            <button
              className="settings-button icon-button"
              type="button"
              aria-label="Open settings"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2 size={16} />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        side="left"
        open={toolsOpen}
        title={copy.tools}
        onClose={closeTools}
      >
        <div className="drawer-search-wrapper" ref={drawerSearchRef}>
          <form
            className="drawer-search"
            onSubmit={(e) => submitSearch(e, true)}
            role="search"
          >
            <button
              type="submit"
              className="search-icon-btn"
              aria-label={copy.searchTools}
            >
              <Search size={15} aria-hidden="true" />
            </button>

            <input
              ref={mobileInputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => {
                if (query.trim()) {
                  setSearchOpen(true);
                }
              }}
              onKeyDown={(e) => handleSearchKeyDown(e, true)}
              placeholder={copy.searchTools}
              aria-label={copy.searchTools}
              autoComplete="off"
            />

            {query.trim() && (
              <button
                type="button"
                className="search-clear-btn"
                aria-label={copy.clearSearch}
                onClick={() => {
                  setQuery('');
                  setSearchOpen(false);
                  setActiveIndex(-1);
                  mobileInputRef.current?.focus();
                }}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {renderSearchResults(true)}
        </div>

        <nav
          className="drawer-links"
          aria-label="Tool categories"
        >
          {categoryList.map((category) => (
            <Link
              key={category}
              to={getLocalizedPath(
                category === 'All'
                  ? '/tools'
                  : `/category/${category.toLowerCase()}`
              )}
              onClick={closeTools}
            >
              {copy.categories?.[category] || (category === 'All' ? copy.allCategory : category)}
            </Link>
          ))}
        </nav>
      </MobileDrawer>

      <MobileDrawer
        side="right"
        open={settingsOpen}
        title={copy.settings}
        onClose={closeSettings}
      >
        <div className="settings-list">
          <span className="drawer-label">
            {copy.settings}
          </span>

          <button
            type="button"
            className={`setting-choice${
              theme === 'light' ? ' active' : ''
            }`}
            onClick={() => setTheme('light')}
          >
            <Sun size={15} />
            {copy.themeLight}
          </button>

          <button
            type="button"
            className={`setting-choice${
              theme === 'dark' ? ' active' : ''
            }`}
            onClick={() => setTheme('dark')}
          >
            <Moon size={15} />
            {copy.themeDark}
          </button>

          <span className="drawer-label">
            {copy.languageLabel}
          </span>

          <button
            type="button"
            className={`setting-choice${
              language === 'en' ? ' active' : ''
            }`}
            onClick={() => handleToggleLanguage('en')}
          >
            English
          </button>

          <button
            type="button"
            className={`setting-choice${
              language === 'bn' ? ' active' : ''
            }`}
            onClick={() => handleToggleLanguage('bn')}
          >
            বাংলা
          </button>

          <span className="drawer-label">
            {copy.motion}
          </span>

          <p className="drawer-note">
            {copy.reducedMotionNote}
          </p>
        </div>
      </MobileDrawer>
    </>
  );
}
