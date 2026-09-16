import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../../theme/context';
import { ThemeMode } from '../../theme/types';
import { useI18n } from '../../i18n/context';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'full';
}

export function ThemeSwitcher({ className = '', variant = 'pill' }: ThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const themeOptions: { id: ThemeMode; label: string; icon: typeof Sun; tooltip: string }[] = [
    {
      id: 'light',
      label: t('theme.light'),
      icon: Sun,
      tooltip: t('theme.switchToLight')
    },
    {
      id: 'dark',
      label: t('theme.dark'),
      icon: Moon,
      tooltip: t('theme.switchToDark')
    },
    {
      id: 'system',
      label: t('theme.system'),
      icon: Monitor,
      tooltip: resolvedTheme === 'dark' ? t('theme.systemActiveDark') : t('theme.systemActiveLight')
    }
  ];

  if (variant === 'compact') {
    const CurrentIcon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun;

    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          id="theme-switcher-compact-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors shadow-2xs focus:outline-none"
          title={`${t('theme.label')}: ${themeOptions.find((o) => o.id === theme)?.label}`}
          aria-label={t('theme.label')}
          aria-expanded={dropdownOpen}
        >
          <CurrentIcon className="h-4 w-4" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              {t('theme.label')}
            </div>
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  id={`theme-opt-${opt.id}`}
                  onClick={() => {
                    setTheme(opt.id);
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors text-left ${
                    isSelected
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" />
                    <span>{opt.label}</span>
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`grid grid-cols-3 gap-1.5 ${className}`}>
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              id={`theme-full-${opt.id}`}
              onClick={() => setTheme(opt.id)}
              className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 px-2 text-xs font-medium transition-all ${
                isSelected
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
              title={opt.tooltip}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented Pill (Default: icon buttons with tooltips for desktop navbar)
  return (
    <div
      id="theme-switcher-pill"
      className={`inline-flex items-center rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100/90 dark:bg-stone-900/90 p-0.5 text-xs text-stone-600 dark:text-stone-400 shadow-2xs ${className}`}
      role="radiogroup"
      aria-label={t('theme.label')}
    >
      {themeOptions.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            id={`btn-theme-${opt.id}`}
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTheme(opt.id)}
            title={opt.tooltip}
            className={`flex items-center justify-center rounded-md p-1.5 transition-all ${
              isSelected
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 shadow-xs font-semibold'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
            aria-label={opt.label}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
