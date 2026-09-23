import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useFavoriteTools } from '@/features/favorites/useFavorites';
import { trackEvent } from '@/lib/analytics';
import { getLocalizedTool, type ToolDefinition } from '@/registry/tool-registry';
import type { CSSProperties } from 'react';

export default function ToolCard({ tool: rawTool, index }: { tool: ToolDefinition; index: number }) {
  const { copy, language } = useI18n();
  const tool = getLocalizedTool(rawTool, language);
  const { isFavorite, toggleFavorite } = useFavoriteTools();
  const Icon = tool.icon;
  const isFav = isFavorite(tool.id);

  const favButton = (
    <button
      type="button"
      className={`tool-favorite-btn ${isFav ? 'active' : ''}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(tool.id);
        trackEvent('tool_favorite_toggle', { tool_id: tool.id, is_favorite: !isFav });
      }}
      title={isFav ? copy.removeFromFavorites : copy.pinToFavorites}
      aria-label={isFav ? copy.removeFromFavorites : copy.pinToFavorites}
    >
      <Star size={16} fill={isFav ? 'currentColor' : 'none'} strokeWidth={isFav ? 1.5 : 2} />
    </button>
  );

  const content = (
    <>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
          <span className="tool-icon" style={{ '--tool-color': tool.color, margin: 0 } as CSSProperties}><Icon size={21} /></span>
          {favButton}
        </div>
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </div>
      <div className="tool-card-foot"><span>{tool.status === 'live' ? copy.liveNow : copy.planned}</span><ArrowRight size={16} /></div>
    </>
  );

  if (tool.status !== 'live') {
    return <div className="tool-card reveal" style={{ '--tool-color': tool.color, animationDelay: `${index * 55}ms` } as CSSProperties} aria-label={`${tool.name} — ${copy.planned}`}>{content}</div>;
  }

  return (
    <Link
      to={tool.route}
      className="tool-card reveal"
      style={{ '--tool-color': tool.color, animationDelay: `${index * 55}ms` } as CSSProperties}
      onClick={() => trackEvent('tool_open', { tool_id: tool.id, tool_slug: tool.slug, category: tool.category })}
    >
      {content}
    </Link>
  );
}
