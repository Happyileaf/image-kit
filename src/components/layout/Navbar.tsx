import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Layers,
  Info,
  Lock,
  ChevronDown,
  Menu,
  X,
  ImagePlus
} from 'lucide-react';
import { GITHUB_REPO_URL } from '../../constants/site';
import { useI18n } from '../../i18n/context';
import ToolIcon from '../tools/tool-icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Navbar() {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, tools, categories } = useI18n();
  const location = useLocation();

  const isToolActive = (toolId: string) =>
    location.pathname === `/tools/${toolId}`;

  const isAbout = location.pathname === '/about';
  const isPrivacy = location.pathname === '/privacy';

  /** 就绪状态直接派生自 i18n 工具定义，工具上线后无需再手动同步导航 */
  const availableTools = tools.filter((tool) => tool.isAvailable);
  const upcomingTools = tools.filter((tool) => !tool.isAvailable);
  const navCategories = categories.filter((cat) => cat.id !== 'all');

  const closeMenus = () => {
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            to="/"
            onClick={closeMenus}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 dark:bg-stone-800 text-stone-50 shadow-sm">
              <ImagePlus className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">ImageKit</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/tools/')
                    ? 'text-stone-900 dark:text-stone-100 bg-stone-200/60 dark:bg-stone-800/80' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>{t('nav.tools')}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-80 max-h-[75vh] overflow-y-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-2 shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50">
                  {/* 已就绪工具：按分类分组渲染为可点链接 */}
                  {navCategories.map((cat) => {
                    const categoryTools = availableTools.filter((tool) => tool.category === cat.id);
                    if (categoryTools.length === 0) return null;
                    return (
                      <div key={cat.id}>
                        <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                          {cat.name}
                        </div>
                        {categoryTools.map((tool) => (
                          <Link
                            key={tool.id}
                            to={`/tools/${tool.id}`}
                            onClick={closeMenus}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left ${
                              isToolActive(tool.id)
                                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                            }`}
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-100 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400">
                              <ToolIcon iconName={tool.iconName} className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-stone-900 dark:text-stone-100">{tool.name}</div>
                              <div className="text-xs text-stone-500 dark:text-stone-400">{tool.shortDesc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}

                  {/* 未就绪工具：仅展示名称，不可点击进入 */}
                  {upcomingTools.length > 0 && (
                    <>
                      <div className="my-1 border-t border-stone-100 dark:border-stone-800"></div>

                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center justify-between">
                        <span>{t('nav.upcomingTools')}</span>
                        <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-1.5 py-0.5 rounded">{t('nav.preview')}</span>
                      </div>

                      <div className="px-3 py-1.5 space-y-1">
                        {upcomingTools.map((tool) => (
                          <div key={tool.id} className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 py-1">
                            <span className="flex items-center gap-2">
                              <ToolIcon iconName={tool.iconName} className="h-3.5 w-3.5 text-stone-400" />
                              {tool.name}
                            </span>
                            <span className="text-[10px] text-stone-400">{t('nav.roadmap')}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* About Link */}
            <Link
              to="/about"
              onClick={closeMenus}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isAbout 
                  ? 'text-stone-900 dark:text-stone-100 bg-stone-200/60 dark:bg-stone-800/80' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>{t('nav.about')}</span>
            </Link>

            {/* Privacy Link */}
            <Link
              to="/privacy"
              onClick={closeMenus}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isPrivacy 
                  ? 'text-stone-900 dark:text-stone-100 bg-stone-200/60 dark:bg-stone-800/80' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>{t('nav.privacy')}</span>
            </Link>
          </nav>
        </div>

        {/* Right: Theme Switcher, Language Switcher, Privacy Status Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Desktop Theme Switcher */}
          <div className="hidden sm:block">
            <ThemeSwitcher variant="pill" />
          </div>

          {/* Desktop Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher variant="pill" />
          </div>

          {/* GitHub Link */}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center rounded-md p-1.5 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5.5 w-5.5">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>

          {/* Privacy Status Indicator */}
          <Link
            to="/privacy"
            onClick={closeMenus}
            className="flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-colors hover:bg-emerald-100/90 dark:hover:bg-emerald-900/50"
            title={t('nav.privacyTooltip')}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
            <span className="hidden lg:inline">{t('nav.onDevice')}</span>
            <span className="lg:hidden">{t('nav.local')}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden rounded-lg p-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-4 md:hidden space-y-3">
          {/* Mobile Theme & Language Switchers */}
          <div className="pb-3 border-b border-stone-100 dark:border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">{t('theme.label')}</span>
              <ThemeSwitcher variant="pill" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">{t('nav.switchLang')}</span>
              <LanguageSwitcher variant="pill" />
            </div>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              onClick={closeMenus}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-left"
            >
              <Layers className="h-4 w-4 text-stone-500 dark:text-stone-400" />
              {t('nav.allTools')}
            </Link>
            {availableTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.id}`}
                onClick={closeMenus}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-left"
              >
                <ToolIcon iconName={tool.iconName} className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {tool.name}
              </Link>
            ))}
            <div className="my-1 border-t border-stone-100 dark:border-stone-800"></div>
            <Link
              to="/about"
              onClick={closeMenus}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-left"
            >
              <Info className="h-4 w-4 text-stone-500 dark:text-stone-400" />
              {t('nav.about')}
            </Link>
            <Link
              to="/privacy"
              onClick={closeMenus}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-left"
            >
              <Lock className="h-4 w-4 text-stone-500 dark:text-stone-400" />
              {t('nav.privacy')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
