import type { ReactNode } from 'react';

export function ToolGrid({ children }: { children: ReactNode }) {
  return <div className="tool-grid">{children}</div>;
}