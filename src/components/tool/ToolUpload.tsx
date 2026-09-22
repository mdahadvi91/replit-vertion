import type { ReactNode } from 'react';

export function ToolUpload({ children }: { children: ReactNode }) {
  return <div className="upload-zone">{children}</div>;
}