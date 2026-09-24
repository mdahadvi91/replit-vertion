import { Navigate, useParams } from 'react-router-dom';
import { categoryList } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import ToolsPage from '@/pages/ToolsPage';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const { getLocalizedPath } = useI18n();

  const category = categoryList.find(
    (candidate) => candidate.toLowerCase() === categorySlug?.toLowerCase()
  );

  if (!category || category === 'All') {
    return <Navigate to={getLocalizedPath('/tools')} replace />;
  }

  return <ToolsPage key={category} initialCategory={category} />;
}
