import type { LucideIcon } from 'lucide-react';

export type ToolCategory = 'Images' | 'Documents' | 'Text' | 'Developer';
export type ToolStatus = 'live' | 'planned';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  color: string;
  icon: LucideIcon;
  route: string;
  browserProcessing: boolean;
  keywords: string[];
  seo: { title: string; description: string; h1: string; canonical: string };
  content: {
    intro: string;
    howToUse: string[];
    privacy?: string;
    limitations?: string;
    faq: Array<{ question: string; answer: string }>;
  };
  relatedToolIds: string[];
}