import { Navigate, useParams } from 'react-router-dom';
import { categoryList } from '@/registry/tool-registry';
import ToolsPage from '@/pages/ToolsPage';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const category = categoryList.find(
    (candidate) => candidate.toLowerCase() === categorySlug?.toLowerCase()
  );

  if (!category || category === 'All') {
    return <Navigate to="/tools" replace />;
  }

  return <ToolsPage key={category} initialCategory={category} />;
}
