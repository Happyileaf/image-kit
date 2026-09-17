import { Link } from 'react-router-dom';
import { ShieldCheck, HardDrive, Zap, Lock, Github } from 'lucide-react';
import { GITHUB_REPO_URL } from '../../constants/site';
import { useI18n } from '../../i18n/context';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 py-12 text-stone-600 dark:text-stone-400 transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-900 dark:bg-stone-800 text-stone-50">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-stone-900 dark:text-stone-100 tracking-tight">ImageKit</span>
            </div>
            
            <p className="max-w-md text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {t('footer.brandDesc')}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                {t('footer.zeroCloud')}
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                {t('footer.noCookies')}
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                {t('footer.nativeApis')}
              </span>
            </div>
          </div>

          {/* Tools Navigation */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-200 mb-3">
              {t('footer.toolsHeading')}
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/tools/compress"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  {t('footer.compressor')}
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/convert"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  {t('footer.converter')}
                </Link>
              </li>
              <li>
                <span className="text-stone-400 dark:text-stone-500 flex items-center justify-between">
                  {t('footer.resize')}
                  <span className="text-[10px] bg-stone-200/60 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-1 rounded">{t('footer.soon')}</span>
                </span>
              </li>
              <li>
                <span className="text-stone-400 dark:text-stone-500 flex items-center justify-between">
                  {t('footer.crop')}
                  <span className="text-[10px] bg-stone-200/60 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-1 rounded">{t('footer.soon')}</span>
                </span>
              </li>
              <li>
                <span className="text-stone-400 dark:text-stone-500 flex items-center justify-between">
                  {t('footer.watermark')}
                  <span className="text-[10px] bg-stone-200/60 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-1 rounded">{t('footer.soon')}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Privacy & Project */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-200 mb-3">
              {t('footer.principlesHeading')}
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  {t('footer.privacyArchitecture')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  {t('footer.whyLocal')}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  {t('footer.verifyDevTools')}
                </Link>
              </li>
              <li>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <Github className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                  {t('footer.openSource')}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 border-t border-stone-200 dark:border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 dark:text-stone-500 gap-3">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <p className="font-mono text-[11px]">{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
