import { useMemo } from 'react';
import { getRelatedTools, getLocalizedTool, type ToolDefinition } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import ToolCard from '@/components/tool/ToolCard';

export function RelatedTools({
  tool,
  limit = 3,
}: {
  tool: ToolDefinition;
  limit?: number;
}) {
  const { language } = useI18n();

  const related = useMemo(() => {
    const list = getRelatedTools(tool);
    return list.slice(0, limit).map((item) => getLocalizedTool(item, language));
  }, [tool, limit, language]);

  if (related.length === 0) return null;

  const isBn = language === 'bn';

  return (
    <section className="section section-tint" style={{ marginTop: 60 }}>
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{isBn ? 'সম্পর্কিত টুলস' : 'Explore Next'}</span>
            <h2>{isBn ? 'অন্যান্য দরকারি টুলস' : 'Related Tools You Might Need'}</h2>
          </div>
          <p>
            {isBn
              ? 'আপনার কাজকে আরও সহজ ও দ্রুত করতে নিচের টুলগুলো ব্যবহার করে দেখতে পারেন।'
              : 'Complementary browser utilities to keep your everyday digital tasks seamless and fast.'}
          </p>
        </div>
        <div className="tool-grid">
          {related.map((relatedTool, index) => (
            <ToolCard key={relatedTool.id} tool={relatedTool} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedTools;
