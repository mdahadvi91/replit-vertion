import type { ReactNode } from 'react';
import { PageContainer } from './PageContainer';

export function ToolPageLayout({ children }: { children: ReactNode }) {
  return <main><PageContainer>{children}</PageContainer></main>;
}