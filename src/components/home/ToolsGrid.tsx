import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ToolDefinition, ToolId } from '../../types';
import { useI18n } from '../../i18n/context';
import ToolIcon from '../tools/tool-icon';

interface ToolsGridProps {
  onSelectTool: (toolId: ToolId) => void;
}

export function ToolsGrid({ onSelectTool }: ToolsGridProps) {
  const { tools, t } = useI18n();

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-2xl">
            {t('grid.title')}
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {t('grid.subtitle')}
          </p>
        </div>

        {/* Tools Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool: ToolDefinition) => {
            const isAvailable = tool.isAvailable;
            const cardClass = `group relative flex flex-col justify-between rounded-xl border p-6 transition-all ${
              isAvailable
                ? 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-md cursor-pointer'
                : 'border-stone-200/70 dark:border-stone-800/70 opacity-80 bg-stone-50/60 dark:bg-stone-900/40'
            }`;

            const cardContent = (
              <div>
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg transition-transform ${
                        isAvailable
                          ? 'bg-stone-900 dark:bg-stone-800 text-emerald-400 group-hover:scale-105'
                          : 'bg-stone-100 dark:bg-stone-800/80 text-stone-400 dark:text-stone-500'
                      }`}
                    >
                      <ToolIcon iconName={tool.iconName} className="h-5 w-5" />
                    </div>

                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        {t('grid.readyToUse')}
                      </span>
                    ) : (
                      <span className="rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2.5 py-0.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                        {tool.badge || t('grid.inDevelopment')}
                      </span>
                    )}
                  </div>

                  {/* Tool Name & Description */}
                  <div className="mt-4">
                    <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                      {tool.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                      {tool.shortDesc}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tool.features.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[11px] text-stone-600 dark:text-stone-300 font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-stone-400 dark:text-stone-500 font-mono">
                    {tool.acceptedFormats.includes('/*') ? t('grid.allImages') : tool.acceptedFormats.replace(/image\//g, '').toUpperCase()}
                  </span>

                  {isAvailable ? (
                    <span className="flex items-center gap-1 font-semibold text-stone-900 dark:text-stone-100 group-hover:translate-x-0.5 transition-transform">
                      {t('grid.openTool')}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="text-stone-400 dark:text-stone-500">{t('grid.inDevelopment')}</span>
                  )}
                </div>
              </div>
            );

            return isAvailable ? (
              <Link
                key={tool.id}
                id={`tool-card-${tool.id}`}
                to={`/tools/${tool.id}`}
                className={cardClass}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={tool.id} id={`tool-card-${tool.id}`} className={cardClass}>
                {cardContent}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

