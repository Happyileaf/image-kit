import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, HardDrive, Terminal, Lock, CheckCheck, ArrowRight, Github, ArrowUpRight, Code2, Copy, Check } from 'lucide-react';
import { GITHUB_REPO_URL } from '../../constants/site';
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

const CLONE_COMMAND = `git clone ${GITHUB_REPO_URL}.git`;

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  const { t, tRaw } = useI18n();

  const guarantees = tRaw<Array<{ title: string; desc: string }>>('privacy.guarantees') || [];
  const evidencePoints = tRaw<Array<{ title: string; desc: string }>>('privacy.evidence1Points') || [];
  const steps = tRaw<string[]>('privacy.steps') || [];

  const [isCopied, setIsCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyCloneCommand = async () => {
    let succeeded = false;
    try {
      await navigator.clipboard.writeText(CLONE_COMMAND);
      succeeded = true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = CLONE_COMMAND;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        succeeded = document.execCommand('copy');
      } catch {
        succeeded = false;
      }
      document.body.removeChild(textarea);
    }
    if (succeeded) {
      setIsCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => setIsCopied(false), 2000);
    }
  };

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

        {/* Evidence 1: Open Source Audit */}
        <div className="mt-12 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
                <Github className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Code2 className="h-4 w-4" />
                  <span>{t('privacy.evidence1Badge')}</span>
                </div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 sm:text-xl">
                  {t('privacy.evidence1Title')}
                </h2>
              </div>
            </div>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 shrink-0 self-start lg:self-center rounded-lg bg-stone-900 dark:bg-stone-100 px-4 py-2.5 text-xs font-semibold text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>{t('privacy.evidence1Cta')}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="my-6 border-t border-stone-100 dark:border-stone-800" />

          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('privacy.evidence1Desc')}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {evidencePoints.map((point, idx) => (
              <div key={idx} className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-950/20 p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {point.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-xs text-stone-500 dark:text-stone-500 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <Terminal className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500" />
              <code className="truncate font-mono text-xs text-stone-700 dark:text-stone-300 sm:text-sm">
                <span className="text-stone-400 dark:text-stone-500">$ </span>
                {CLONE_COMMAND}
              </code>
            </div>
            <button
              onClick={handleCopyCloneCommand}
              className="flex items-center justify-center gap-1.5 shrink-0 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{isCopied ? t('privacy.evidence1Copied') : t('privacy.evidence1CopyBtn')}</span>
            </button>
          </div>
        </div>

        {/* Evidence 2: DevTools Network Inspection */}
        <div className="mt-8 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-stone-900 p-6 sm:p-8 text-stone-100 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCheck className="h-4 w-4" />
            <span>{t('privacy.evidence2Badge')}</span>
          </div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            {t('privacy.evidence2Title')}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
            {t('privacy.evidence2Subtitle')}
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
