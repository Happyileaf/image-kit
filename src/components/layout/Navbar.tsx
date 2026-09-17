import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Layers, 
  Info, 
  Lock, 
  ChevronDown, 
  Minimize2, 
  Repeat, 
  Maximize2, 
  Crop, 
  RotateCw, 
  Stamp, 
  Menu,
  X,
  ImagePlus,
  Github
} from 'lucide-react';
import { GITHUB_REPO_URL } from '../../constants/site';
import { useI18n } from '../../i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Navbar() {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, getToolById } = useI18n();
  const location = useLocation();

  const isToolActive = (toolId: string) => 
    location.pathname === `/tools/${toolId}`;

  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isPrivacy = location.pathname === '/privacy';

  const compressTool = getToolById('compress');
  const convertTool = getToolById('convert');

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
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 dark:bg-stone-800 text-stone-50 shadow-sm transition-transform group-hover:scale-105">
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
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-2 shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    {t('nav.essentials')}
                  </div>
                  
                  <Link
                    to="/tools/compress"
                    onClick={closeMenus}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left ${
                      isToolActive('compress') 
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium' 
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-100 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400">
                      <Minimize2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-stone-900 dark:text-stone-100">{compressTool?.name || 'Image Compressor'}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">{compressTool?.shortDesc || t('nav.compressDesc')}</div>
                    </div>
                  </Link>

                  <Link
                    to="/tools/convert"
                    onClick={closeMenus}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left ${
                      isToolActive('convert') 
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium' 
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-100 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400">
                      <Repeat className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-stone-900 dark:text-stone-100">{convertTool?.name || 'Image Converter'}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">{convertTool?.shortDesc || t('nav.convertDesc')}</div>
                    </div>
                  </Link>

                  <div className="my-1 border-t border-stone-100 dark:border-stone-800"></div>
                  
                  <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center justify-between">
                    <span>{t('nav.upcomingTools')}</span>
                    <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-1.5 py-0.5 rounded">{t('nav.preview')}</span>
                  </div>

                  <div className="px-3 py-1.5 space-y-1">
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 py-1">
                      <span className="flex items-center gap-2">
                        <Maximize2 className="h-3.5 w-3.5 text-stone-400" />
                        {getToolById('resize')?.name || 'Resize Image'}
                      </span>
                      <span className="text-[10px] text-stone-400">{t('nav.roadmap')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 py-1">
                      <span className="flex items-center gap-2">
                        <Crop className="h-3.5 w-3.5 text-stone-400" />
                        {getToolById('crop')?.name || 'Crop Image'}
                      </span>
                      <span className="text-[10px] text-stone-400">{t('nav.roadmap')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 py-1">
                      <span className="flex items-center gap-2">
                        <RotateCw className="h-3.5 w-3.5 text-stone-400" />
                        {getToolById('rotate')?.name || 'Rotate & Flip'}
                      </span>
                      <span className="text-[10px] text-stone-400">{t('nav.roadmap')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 py-1">
                      <span className="flex items-center gap-2">
                        <Stamp className="h-3.5 w-3.5 text-stone-400" />
                        {getToolById('watermark')?.name || 'Watermark'}
                      </span>
                      <span className="text-[10px] text-stone-400">{t('nav.roadmap')}</span>
                    </div>
                  </div>
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
            className="flex items-center justify-center rounded-lg p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50 transition-colors"
          >
            <Github className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
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
            <Link
              to="/tools/compress"
              onClick={closeMenus}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-left"
            >
              <Minimize2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {compressTool?.name || 'Image Compressor'}
            </Link>
            <Link
              to="/tools/convert"
              onClick={closeMenus}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-left"
            >
              <Repeat className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {convertTool?.name || 'Image Converter'}
            </Link>
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
