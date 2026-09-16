import { Globe, Check } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import { Language } from '../../i18n/types';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'full';
}

export function LanguageSwitcher({ className = '', variant = 'pill' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useI18n();

  if (variant === 'compact') {
    return (
      <button
        id="lang-switcher-compact"
        onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
        className={`flex items-center gap-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors shadow-xs ${className}`}
        title={language === 'en' ? '切换为简体中文' : 'Switch to English'}
      >
        <Globe className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" />
        <span>{language === 'en' ? '中文' : 'EN'}</span>
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          id="lang-select-en"
          onClick={() => setLanguage('en')}
          className={`flex flex-1 items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            language === 'en'
              ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
          }`}
        >
          <span>English</span>
          {language === 'en' && <Check className="h-3.5 w-3.5" />}
        </button>

        <button
          id="lang-select-zh"
          onClick={() => setLanguage('zh')}
          className={`flex flex-1 items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
            language === 'zh'
              ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
          }`}
        >
          <span>简体中文</span>
          {language === 'zh' && <Check className="h-3.5 w-3.5" />}
        </button>
      </div>
    );
  }

  // Default: segmented pill switcher
  return (
    <div
      id="lang-switcher-pill"
      className={`inline-flex items-center rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100/90 dark:bg-stone-900/90 p-0.5 text-xs font-medium text-stone-600 dark:text-stone-400 shadow-2xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        id="btn-lang-en"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
          language === 'en'
            ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-xs'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
        }`}
      >
        <span>EN</span>
      </button>

      <button
        type="button"
        id="btn-lang-zh"
        onClick={() => setLanguage('zh')}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
          language === 'zh'
            ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-xs'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
        }`}
      >
        <span>中文</span>
      </button>
    </div>
  );
}
