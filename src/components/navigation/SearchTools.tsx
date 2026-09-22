import { Search } from 'lucide-react';
import { useState } from 'react';
import { tools } from '@/registry/tool-registry';

export function SearchTools() {
  const [query, setQuery] = useState('');
  const results = query ? tools.filter((tool) => `${tool.name} ${tool.description}`.toLowerCase().includes(query.toLowerCase())) : [];
  return (
    <div className="tool-search">
      <Search size={16} />
      <input data-testid="input-search-tools" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools…" />
      {results.length > 0 && <div className="search-results">{results.slice(0, 5).map((tool) => <a key={tool.id} href={tool.route}>{tool.name}</a>)}</div>}
    </div>
  );
}