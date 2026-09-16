import { ShieldCheck, Lock, HardDrive, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { ToolId } from '../../types';
import { useI18n } from '../../i18n/context';

interface HeroProps {
  onSelectTool: (toolId: ToolId) => void;
  onTrySample: () => void;
}

export function Hero({ onSelectTool, onTrySample }: HeroProps) {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-b border-stone-200/70 dark:border-stone-800 bg-gradient-to-b from-stone-50 via-stone-50 to-stone-100/40 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900/40 py-12 md:py-16 transition-colors duration-150">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* Subtle Privacy Capsule */}
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 px-3.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 shadow-xs mb-6">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>{t('hero.badgeProcessing')}</span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-stone-500 dark:text-stone-400">{t('hero.badgeNoAccount')}</span>
        </div>

        {/* Clean Headline */}
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl md:text-5xl">
          {t('hero.headline')}
          <span className="text-stone-900 dark:text-stone-100 underline decoration-stone-300 dark:decoration-stone-700 decoration-wavy decoration-1 underline-offset-8">
            {t('hero.headlineUnderline')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-stone-600 dark:text-stone-400 sm:text-lg leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Quick Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            id="hero-compress-btn"
            onClick={() => onSelectTool('compress')}
            className="flex items-center gap-2 rounded-lg bg-stone-900 dark:bg-stone-100 px-5 py-2.5 text-sm font-medium text-white dark:text-stone-900 shadow-xs hover:bg-stone-800 dark:hover:bg-white transition-colors focus:outline-none"
          >
            <span>{t('hero.openCompressor')}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            id="hero-convert-btn"
            onClick={() => onSelectTool('convert')}
            className="flex items-center gap-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 shadow-xs hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors focus:outline-none"
          >
            <span>{t('hero.openConverter')}</span>
          </button>

          <button
            id="hero-sample-btn"
            onClick={onTrySample}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 px-4 py-2.5 text-sm font-medium text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            title={t('hero.sampleTooltip')}
          >
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('hero.trySample')}</span>
          </button>
        </div>

        {/* Minimalist Trust Features */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl mx-auto pt-6 border-t border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400 py-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('hero.zeroUploads')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400 py-1">
            <HardDrive className="h-4 w-4 text-stone-700 dark:text-stone-300 shrink-0" />
            <span>{t('hero.noDataStored')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400 py-1">
            <Lock className="h-4 w-4 text-stone-700 dark:text-stone-300 shrink-0" />
            <span>{t('hero.noLogin')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400 py-1">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t('hero.runsInMemory')}</span>
          </div>
        </div>

      </div>
    </section>
  );
}

