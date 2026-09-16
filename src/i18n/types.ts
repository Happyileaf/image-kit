import { ToolId, ToolCategory, ToolDefinition } from '../types';

export type Language = 'en' | 'zh';

export interface LocalizedToolDefinition extends ToolDefinition {
  // Can contain language-specific fields
}

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tRaw: <T = any>(key: string) => T;
  tools: ToolDefinition[];
  categories: { id: string; name: string; desc: string }[];
  getToolById: (id: ToolId) => ToolDefinition | undefined;
}
