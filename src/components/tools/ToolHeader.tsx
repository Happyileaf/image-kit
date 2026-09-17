import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Layers, Minimize2, Repeat } from 'lucide-react';
import { ToolDefinition } from '../../types';
import { useI18n } from '../../i18n/context';

interface ToolHeaderProps {
  tool: ToolDefinition;
  fileCount: number;
}

export function ToolHeader({ tool, fileCount }: ToolHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="border-b border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 py-6 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-3 font-medium">
          <Link
            to="/"
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t('workspace.breadcrumbTools')}</span>
          </Link>
          <span>/</span>
          <span className="text-stone-900 dark:text-stone-100">{tool.name}</span>
          {fileCount > 0 && (
            <>
              <span>/</span>
              <span className="rounded-full bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[11px] font-mono text-stone-700 dark:text-stone-300">
                {t('workspace.filesLoaded', { count: fileCount })}
              </span>
            </>
          )}
        </nav>

        {/* Tool Details & Privacy Assurance */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-900 dark:bg-stone-800 text-white shadow-xs">
              {tool.id === 'compress' ? (
                <Minimize2 className="h-6 w-6 text-emerald-400" />
              ) : tool.id === 'convert' ? (
                <Repeat className="h-6 w-6 text-emerald-400" />
              ) : (
                <Layers className="h-6 w-6 text-emerald-400" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl">
                {tool.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {tool.shortDesc}
              </p>
            </div>
          </div>

          {/* Privacy Badge on Top Right */}
          <div className="flex items-center gap-2 self-start sm:self-center rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-left">
              <span className="font-semibold block sm:inline">{t('workspace.clientSideNotice')}</span>{' '}
              <span className="text-emerald-700 dark:text-emerald-400">{t('workspace.clientSideDesc')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

