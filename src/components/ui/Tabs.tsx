import type { ReactNode } from 'react';

export function Tabs({ children }: { children: ReactNode }) {
  return <div className="tabs">{children}</div>;
}