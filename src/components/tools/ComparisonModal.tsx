import { useState } from 'react';
import { X, ZoomIn, Download, ArrowLeftRight } from 'lucide-react';
import { ProcessedFileItem } from '../../types';
import { formatBytes, downloadFile } from '../../utils/imageProcessor';
import { useI18n } from '../../i18n/context';

interface ComparisonModalProps {
  item: ProcessedFileItem;
  onClose: () => void;
}

export function ComparisonModal({ item, onClose }: ComparisonModalProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [activeTab, setActiveTab] = useState<'slider' | 'side-by-side'>('slider');
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 dark:bg-black/85 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl bg-white dark:bg-stone-900 shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/90">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 truncate max-w-md">
              {t('comparison.title', { name: item.name })}
            </h3>
            <span className="hidden sm:inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              {item.savedPercentage !== null && item.savedPercentage > 0
                ? t('comparison.smallerBadge', { percent: item.savedPercentage })
                : t('comparison.processedBadge')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('slider')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  activeTab === 'slider' 
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {t('comparison.splitSlider')}
              </button>
              <button
                onClick={() => setActiveTab('side-by-side')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  activeTab === 'side-by-side' 
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {t('comparison.sideBySide')}
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 dark:text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Visual Stage */}
        <div className="relative flex-1 overflow-auto bg-stone-950 p-4 sm:p-8 flex items-center justify-center min-h-[350px]">
          {activeTab === 'slider' && item.resultUrl ? (
            <div className="relative max-h-[60vh] max-w-full overflow-hidden rounded-lg shadow-lg select-none">
              {/* Processed image (Bottom layer) */}
              <img
                src={item.resultUrl}
                alt="Processed result"
                className="max-h-[60vh] max-w-full object-contain pointer-events-none"
              />

              {/* Original image (Clipped top layer) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={item.previewUrl}
                  alt="Original image"
                  className="max-h-[60vh] max-w-none object-contain pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Slider divider line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.8)] pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-900 shadow-md">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
              </div>

              {/* Invisible interactive range overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize z-20"
                aria-label="Comparison slider"
              />

              {/* Labels */}
              <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs pointer-events-none">
                {t('comparison.originalLabel', { size: formatBytes(item.originalSize) })}
              </div>
              <div className="absolute bottom-3 right-3 rounded-md bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-xs pointer-events-none">
                {t('comparison.optimizedLabel', { size: item.resultSize ? formatBytes(item.resultSize) : '—' })}
              </div>
            </div>
          ) : (
            /* Side-by-side mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-h-[60vh]">
              <div className="flex flex-col items-center justify-center rounded-lg bg-stone-900 p-2 overflow-hidden">
                <span className="text-xs text-stone-400 mb-2 font-medium">
                  {t('comparison.originalTitle')}: {formatBytes(item.originalSize)} ({item.originalWidth}×{item.originalHeight})
                </span>
                <img
                  src={item.previewUrl}
                  alt="Original"
                  className="max-h-[45vh] object-contain rounded"
                />
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg bg-stone-900 p-2 overflow-hidden">
                <span className="text-xs text-emerald-400 mb-2 font-medium">
                  {t('comparison.optimizedTitle')}: {item.resultSize ? formatBytes(item.resultSize) : '—'} ({item.resultWidth}×{item.resultHeight})
                </span>
                {item.resultUrl && (
                  <img
                    src={item.resultUrl}
                    alt="Optimized"
                    className="max-h-[45vh] object-contain rounded"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 py-4 gap-3">
          <div className="flex items-center gap-6 text-xs text-stone-600 dark:text-stone-400">
            <div>
              <span className="text-stone-400 dark:text-stone-500">{t('comparison.originalLabelShort')}:</span>{' '}
              <span className="font-semibold text-stone-900 dark:text-stone-100">{formatBytes(item.originalSize)}</span>
            </div>
            <div>
              <span className="text-stone-400 dark:text-stone-500">{t('comparison.resultLabelShort')}:</span>{' '}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {item.resultSize ? formatBytes(item.resultSize) : t('comparison.processingText')}
              </span>
            </div>
            {item.savedPercentage !== null && (
              <div>
                <span className="text-stone-400 dark:text-stone-500">{t('comparison.savingsLabel')}:</span>{' '}
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{item.savedPercentage}%</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-stone-300 dark:border-stone-700 px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              {t('comparison.closeBtn')}
            </button>
            <button
              onClick={() => downloadFile(item)}
              className="flex items-center gap-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 px-4 py-2 text-xs font-semibold text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t('comparison.downloadBtn')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

