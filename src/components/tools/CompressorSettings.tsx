import { Sliders, Sparkles, Check } from 'lucide-react';
import { CompressOptions } from '../../types';
import { useI18n } from '../../i18n/context';

interface CompressorSettingsProps {
  options: CompressOptions;
  onChange: (options: CompressOptions) => void;
  onApply: () => void;
  isProcessing: boolean;
  itemCount: number;
}

export function CompressorSettings({
  options,
  onChange,
  onApply,
  isProcessing,
  itemCount
}: CompressorSettingsProps) {
  const { t } = useI18n();

  const presets = [
    { 
      label: t('compressor.presets.maxSavings'), 
      value: 60, 
      desc: t('compressor.presets.maxSavingsDesc') 
    },
    { 
      label: t('compressor.presets.balanced'), 
      value: 80, 
      desc: t('compressor.presets.balancedDesc') 
    },
    { 
      label: t('compressor.presets.highFidelity'), 
      value: 92, 
      desc: t('compressor.presets.highFidelityDesc') 
    }
  ];

  const dimensionPresets = [
    { label: t('compressor.dimOriginal'), value: 0 },
    { label: '2048px (2K)', value: 2048 },
    { label: '1920px (FHD)', value: 1920 },
    { label: '1280px (HD)', value: 1280 },
    { label: '800px (Web)', value: 800 }
  ];

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-stone-700 dark:text-stone-300" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{t('compressor.title')}</h3>
        </div>
        <span className="text-[11px] font-mono font-medium rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-stone-700 dark:text-stone-300">
          {t('compressor.badge')}
        </span>
      </div>

      {/* Quality Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="quality-range" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {t('compressor.qualityLabel')}
          </label>
          <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
            {options.quality}%
          </span>
        </div>

        <input
          id="quality-range"
          type="range"
          min="10"
          max="100"
          value={options.quality}
          onChange={(e) => onChange({ ...options, quality: Number(e.target.value) })}
          className="w-full accent-stone-900 dark:accent-stone-100 h-2 bg-stone-100 dark:bg-stone-800 rounded-lg cursor-pointer"
        />

        {/* Preset quick buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {presets.map((preset) => {
            const isSelected = options.quality === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange({ ...options, quality: preset.value })}
                className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-colors ${
                  isSelected
                    ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700'
                }`}
              >
                <span className="text-xs font-semibold">{preset.label}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-stone-300 dark:text-stone-600' : 'text-stone-400 dark:text-stone-500'}`}>
                  {preset.value}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Output Format */}
      <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('compressor.outputFormat')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'keep', label: t('compressor.formatKeep') },
            { id: 'image/webp', label: t('compressor.formatWebp') },
            { id: 'image/jpeg', label: t('compressor.formatJpg') }
          ].map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => onChange({ ...options, format: fmt.id as any })}
              className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors text-center ${
                options.format === fmt.id
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resize / Max Dimension */}
      <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <div className="flex items-center justify-between">
          <label htmlFor="dimension-select" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {t('compressor.maxDimension')}
          </label>
          <span className="text-[11px] text-stone-400 dark:text-stone-500">{t('compressor.aspectRatioNote')}</span>
        </div>
        <select
          id="dimension-select"
          value={options.maxWidthOrHeight}
          onChange={(e) => onChange({ ...options, maxWidthOrHeight: Number(e.target.value) })}
          className="w-full rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-2 text-xs font-medium text-stone-800 dark:text-stone-200 focus:border-stone-400 dark:focus:border-stone-500 focus:outline-none"
        >
          {dimensionPresets.map((dp) => (
            <option key={dp.value} value={dp.value}>
              {dp.label}
            </option>
          ))}
        </select>
      </div>

      {/* Re-apply Action Button */}
      {itemCount > 0 && (
        <button
          type="button"
          disabled={isProcessing}
          onClick={onApply}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-100 py-3 text-xs font-semibold text-white dark:text-stone-900 shadow-xs hover:bg-stone-800 dark:hover:bg-white disabled:opacity-50 transition-colors"
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{t('compressor.applyBtn')}</span>
        </button>
      )}
    </div>
  );
}

