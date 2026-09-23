import { getRelatedTools, type ToolDefinition } from '@/registry/tool-registry';
import ToolCard from './ToolCard';

export function RelatedTools({ tool }: { tool: ToolDefinition }) {
  return (
    <section className="related-tools" aria-labelledby="related-tools-title">
      <h2 id="related-tools-title">Related tools</h2>
      <div className="tool-grid">
        {getRelatedTools(tool).slice(0, 3).map((related, index) => <ToolCard key={related.id} tool={related} index={index} />)}
      </div>
    </section>
  );
}
