import { 
  ShieldCheck, 
  UserX, 
  Cpu, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolId } from '../../types';
import { useI18n } from '../../i18n/context';
import { Seo } from '../seo/Seo';
import { ABOUT_META, getAboutJsonLd } from '../../constants/seo';

const pillarStyles = [
  { icon: ShieldCheck, bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' },
  { icon: UserX, bg: 'bg-stone-900 dark:bg-stone-800 text-stone-50 dark:text-stone-200' },
  { icon: Cpu, bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300' },
  { icon: Zap, bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' }
];

export function AboutPage() {
  const { t, tRaw, language } = useI18n();

  const pillars = tRaw<Array<{ title: string; desc: string }>>('about.pillars') || [];
  const tableRows = tRaw<Array<{ feature: string; traditional: string; imagekit: string }>>('about.tableRows') || [];

  return (
    <>
      <Seo
        title={ABOUT_META[language].title}
        description={ABOUT_META[language].description}
        path="/about"
        jsonLd={getAboutJsonLd()}
      />
      <div className="py-12 md:py-16 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-stone-200 dark:border-stone-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('about.manifestoBadge')}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            {t('about.title')}
          </h1>
          <p className="mt-3 text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const style = pillarStyles[idx] || pillarStyles[0];
            const IconComponent = style.icon;
            return (
              <div key={idx} className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.bg} mb-4`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">{pillar.title}</h3>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-4">
            {t('about.tableTitle')}
          </h2>

          <div className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/90 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">{t('about.tableHeaders.feature')}</th>
                  <th className="py-3.5 px-4 sm:px-6 text-stone-500 dark:text-stone-400">{t('about.tableHeaders.traditional')}</th>
                  <th className="py-3.5 px-4 sm:px-6 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">{t('about.tableHeaders.imagekit')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs sm:text-sm">
                {tableRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-stone-900 dark:text-stone-100">{row.feature}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      <span>{row.traditional}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{row.imagekit}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-12 rounded-2xl bg-stone-900 dark:bg-stone-900 border border-transparent dark:border-stone-800 p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white dark:text-stone-100">{t('about.ctaTitle')}</h3>
            <p className="text-xs text-stone-400 mt-1">{t('about.ctaSubtitle')}</p>
          </div>
          <Link
            to="/tools/compress"
            className="flex items-center gap-2 rounded-xl bg-white dark:bg-stone-100 px-5 py-2.5 text-xs font-bold text-stone-900 dark:text-stone-900 hover:bg-stone-100 dark:hover:bg-white transition-colors shrink-0"
          >
            <span>{t('about.ctaBtn')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
    </>
  );
}

