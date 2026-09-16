import { Repeat, Sparkles, Check, Info } from 'lucide-react';
import { ConvertOptions, TargetFormat } from '../../types';
import { useI18n } from '../../i18n/context';

interface ConverterSettingsProps {
  options: ConvertOptions;
  onChange: (options: ConvertOptions) => void;
  onApply: () => void;
  isProcessing: boolean;
  itemCount: number;
}

export function ConverterSettings({
  options,
  onChange,
  onApply,
  isProcessing,
  itemCount
}: ConverterSettingsProps) {
  const { t } = useI18n();

  const formats: { id: TargetFormat; name: string; tag: string; desc: string; lossy: boolean }[] = [
    {
      id: 'image/webp',
      name: 'WebP',
      tag: t('converter.formats.webp.tag'),
      desc: t('converter.formats.webp.desc'),
      lossy: true
    },
    {
      id: 'image/jpeg',
      name: 'JPEG / JPG',
      tag: t('converter.formats.jpeg.tag'),
      desc: t('converter.formats.jpeg.desc'),
      lossy: true
    },
    {
      id: 'image/png',
      name: 'PNG',
      tag: t('converter.formats.png.tag'),
      desc: t('converter.formats.png.desc'),
      lossy: false
    },
    {
      id: 'image/avif',
      name: 'AVIF',
      tag: t('converter.formats.avif.tag'),
      desc: t('converter.formats.avif.desc'),
      lossy: true
    }
  ];

  const currentFormatMeta = formats.find((f) => f.id === options.targetFormat) || formats[0];

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Repeat className="h-4 w-4 text-stone-700 dark:text-stone-300" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{t('converter.title')}</h3>
        </div>
        <span className="text-[11px] font-mono font-medium rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-stone-700 dark:text-stone-300">
          {t('converter.badge')}
        </span>
      </div>

      {/* Target Format Options */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('converter.selectFormatLabel')}
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {formats.map((fmt) => {
            const isSelected = options.targetFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onChange({ ...options, targetFormat: fmt.id })}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm tracking-tight">{fmt.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isSelected
                        ? 'bg-stone-800 dark:bg-stone-200 text-emerald-400 dark:text-emerald-700'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {fmt.tag}
                  </span>
                </div>
                <p className={`mt-1 text-[11px] line-clamp-2 leading-tight ${isSelected ? 'text-stone-300 dark:text-stone-700' : 'text-stone-500 dark:text-stone-400'}`}>
                  {fmt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality control for lossy formats */}
      {currentFormatMeta.lossy ? (
        <div className="space-y-3 border-t border-stone-100 dark:border-stone-800 pt-4">
          <div className="flex items-center justify-between">
            <label htmlFor="convert-quality" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              {t('converter.qualityLabel', { format: currentFormatMeta.name })}
            </label>
            <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
              {options.quality}%
            </span>
          </div>

          <input
            id="convert-quality"
            type="range"
            min="20"
            max="100"
            value={options.quality}
            onChange={(e) => onChange({ ...options, quality: Number(e.target.value) })}
            className="w-full accent-stone-900 dark:accent-stone-100 h-2 bg-stone-100 dark:bg-stone-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500">
            <span>{t('converter.smallestSize')}</span>
            <span>{t('converter.balancedQuality')}</span>
            <span>{t('converter.maxQuality')}</span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 p-3 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2 border-t border-stone-100 dark:border-stone-800">
          <Info className="h-4 w-4 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
          <span>
            {t('converter.pngLosslessNote')}
          </span>
        </div>
      )}

      {/* Action Button */}
      {itemCount > 0 && (
        <button
          type="button"
          disabled={isProcessing}
          onClick={onApply}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-100 py-3 text-xs font-semibold text-white dark:text-stone-900 shadow-xs hover:bg-stone-800 dark:hover:bg-white disabled:opacity-50 transition-colors"
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{t('converter.convertAllBtn', { format: currentFormatMeta.name })}</span>
        </button>
      )}
    </div>
  );
}

