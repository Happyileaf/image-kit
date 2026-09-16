import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language, I18nContextType } from './types';
import { en, enTools, enCategories } from './locales/en';
import { zh, zhTools, zhCategories } from './locales/zh';
import { ToolId, ToolDefinition } from '../types';

const STORAGE_KEY = 'imagekit_language';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') {
      return saved;
    }
    const browserLang = navigator.language || (navigator as any).userLanguage || '';
    if (browserLang.toLowerCase().startsWith('zh')) {
      return 'zh';
    }
  }
  return 'en';
}

function resolvePath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = 'ImageKit v1.0';
  }, [language]);

  const dictionary = useMemo(() => {
    return language === 'zh' ? zh : en;
  }, [language]);

  const fallbackDictionary = en;

  const t = (path: string, params?: Record<string, string | number>): string => {
    let value = resolvePath(dictionary, path);
    if (value === undefined || typeof value !== 'string') {
      // Try fallback to English
      value = resolvePath(fallbackDictionary, path);
    }

    if (typeof value !== 'string') {
      return path;
    }

    if (params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }, value);
    }

    return value;
  };

  const tRaw = <T = any,>(path: string): T => {
    let value = resolvePath(dictionary, path);
    if (value === undefined) {
      value = resolvePath(fallbackDictionary, path);
    }
    return value as T;
  };

  const tools = useMemo(() => {
    return language === 'zh' ? zhTools : enTools;
  }, [language]);

  const categories = useMemo(() => {
    return language === 'zh' ? zhCategories : enCategories;
  }, [language]);

  const getToolById = (id: ToolId): ToolDefinition | undefined => {
    return tools.find((tool) => tool.id === id);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      tRaw,
      tools,
      categories,
      getToolById
    }),
    [language, tools, categories]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
