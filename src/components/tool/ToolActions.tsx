import type { ReactNode } from 'react';

export function ToolActions({ children }: { children: ReactNode }) {
  return <div className="tool-actions">{children}</div>;
}