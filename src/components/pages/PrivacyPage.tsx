import { ShieldCheck, HardDrive, Terminal, Lock, CheckCheck, ArrowRight } from 'lucide-react';
import { PageView, ToolId } from '../../types';
import { useI18n } from '../../i18n/context';

interface PrivacyPageProps {
  onNavigate: (view: PageView) => void;
}

const guaranteeIcons = [
  { icon: HardDrive, bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' },
  { icon: Lock, bg: 'bg-stone-900 dark:bg-stone-800 text-stone-50 dark:text-stone-200' },
  { icon: Terminal, bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300' }
];

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  const { t, tRaw } = useI18n();

  const guarantees = tRaw<Array<{ title: string; desc: string }>>('privacy.guarantees') || [];
  const steps = tRaw<string[]>('privacy.steps') || [];

  return (
    <div className="py-12 md:py-16 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-stone-200 dark:border-stone-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('privacy.badge')}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            {t('privacy.title')}
          </h1>
          <p className="mt-3 text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('privacy.subtitle')}
          </p>
        </div>

        {/* 3 Core Guarantees */}
        <div className="mt-10 space-y-6">
          {guarantees.map((item, idx) => {
            const style = guaranteeIcons[idx] || guaranteeIcons[0];
            const IconComponent = style.icon;
            return (
              <div key={idx} className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {item.title}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Section: DevTools Guide */}
        <div className="mt-12 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-stone-900 p-6 sm:p-8 text-stone-100 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCheck className="h-4 w-4" />
            <span>{t('privacy.verifyBadge')}</span>
          </div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            {t('privacy.verifyTitle')}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
            {t('privacy.verifySubtitle')}
          </p>

          <ol className="mt-6 space-y-3 text-xs sm:text-sm text-stone-300">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-800 font-mono text-xs font-bold text-stone-300">
                  {idx + 1}
                </span>
                <span>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex items-center justify-between border-t border-stone-200 dark:border-stone-800 pt-8">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t('privacy.ctaPrompt')}
          </p>
          <button
            onClick={() => onNavigate({ type: 'tool', toolId: 'compress' as ToolId })}
            className="flex items-center gap-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 px-4 py-2 text-xs font-semibold text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors"
          >
            <span>{t('privacy.ctaBtn')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

