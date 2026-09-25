import { useEffect, useMemo, useState } from 'react';
import { Search, Star, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { categoryList, tools, getLocalizedTool, type ToolCategory } from '@/registry/tool-registry';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';
import { useI18n } from '@/i18n';
import { useFavoriteTools } from '@/features/favorites/useFavorites';
import { trackEvent } from '@/lib/analytics';
import { useConsent } from '@/features/consent';
import ToolCard from '@/components/tool/ToolCard';
import { matchToolQuery } from '@/lib/search/toolSearch';

export default function ToolsPage({ initialCategory = 'All' }: { initialCategory?: 'All' | 'Favorites' | ToolCategory }) {
  const { copy, language } = useI18n();
  const { consent } = useConsent();
  const { favoriteIds } = useFavoriteTools();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<'All' | 'Favorites' | ToolCategory>(initialCategory);
  const query = searchParams.get('query') ?? '';

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const localizedTools = useMemo(() => tools.map((tool) => getLocalizedTool(tool, language)), [language]);

  const filtered = useMemo(
    () =>
      localizedTools.filter((tool) => {
        const matchesCategory =
          category === 'All'
            ? true
            : category === 'Favorites'
            ? favoriteIds.includes(tool.id)
            : tool.category === category;

        const raw = tools.find((r) => r.id === tool.id);
        const matchesQuery = matchToolQuery(tool, query, raw);

        return matchesCategory && matchesQuery;
      }),
    [category, query, favoriteIds, localizedTools],
  );

  const setQuery = (value: string) => setSearchParams(value ? { query: value } : {});
  const favoriteCount = favoriteIds.length;

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">{copy.toolsPageEyebrow}</span>
          <h1>{copy.toolsPageH1}</h1>
          <p>{copy.toolsPageCopy}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="library-toolbar">
            <div className="search-field" style={{ display: 'flex', alignItems: 'center' }}>
              <Search size={16} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchTools}
                aria-label={copy.searchTools}
              />
              {query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setQuery('')}
                  aria-label={copy.clearSearch}
                  style={{ marginRight: 6 }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <span className="muted mono" style={{ fontSize: 11 }}>
              {filtered.length} / {tools.length} {copy.filterCountSuffix}
            </span>
          </div>
          <div className="category-tabs" role="tablist" aria-label="Tool categories">
            <button
              className={`category-tab${category === 'All' ? ' active' : ''}`}
              type="button"
              role="tab"
              aria-selected={category === 'All'}
              onClick={() => {
                setCategory('All');
                trackEvent('category_open', { category: 'All' });
              }}
            >
              {copy.categories?.All || copy.allCategory}
            </button>
            <button
              className={`category-tab${category === 'Favorites' ? ' active' : ''}`}
              type="button"
              role="tab"
              aria-selected={category === 'Favorites'}
              onClick={() => {
                setCategory('Favorites');
                trackEvent('category_open', { category: 'Favorites' });
              }}
            >
              <Star size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {copy.favoritesCategory} ({favoriteCount})
            </button>
            {categoryList
              .filter((c): c is ToolCategory => c !== 'All')
              .map((candidate) => (
                <button
                  key={candidate}
                  className={`category-tab${category === candidate ? ' active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={category === candidate}
                  onClick={() => {
                    setCategory(candidate);
                    trackEvent('category_open', { category: candidate });
                  }}
                >
                  {copy.categories?.[candidate] || candidate}
                </button>
              ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>
                {category === 'Favorites' && favoriteCount === 0
                  ? copy.noFavoritesYet
                  : copy.noToolsMatch}
              </p>
              {query ? (
                <button className="button button-ghost" type="button" onClick={() => setQuery('')}>
                  <X size={14} /> {copy.clearSearch}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="tool-grid">
              {filtered.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>
          )}

          <div style={{ marginTop: 40 }}>
            <AdSlot enabled={consent.advertising} slot={adConfig.librarySlot} label="Sponsored Ad" />
          </div>
        </div>
      </section>
    </main>
  );
}
