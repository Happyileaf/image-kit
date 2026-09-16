import { Maximize2, Sparkles, Lock, LockOpen } from 'lucide-react';
import { ResizeOptions } from '../../../types';
import { ResizeModeEnum } from '../../../constants/resize-mode';
import { SettingsPanelProps } from '../../../modules/types';
import { useI18n } from '../../../i18n/context';

function ResizeSettings({
  options,
  onChange,
  onApply,
  isProcessing,
  itemCount
}: SettingsPanelProps<ResizeOptions>) {
  const { t } = useI18n();

  const modeOptions = [
    { label: t('resizer.modes.pixels'), value: ResizeModeEnum.Pixels },
    { label: t('resizer.modes.percent'), value: ResizeModeEnum.Percent }
  ];

  const dimensionPresets = [
    { label: '1080 × 1080', width: 1080, height: 1080 },
    { label: '1920 × 1080', width: 1920, height: 1080 },
    { label: '1280 × 720', width: 1280, height: 720 },
    { label: '800 × 800', width: 800, height: 800 }
  ];

  const clampDimensionValue = (rawValue: string): number => {
    return Math.max(1, Math.round(Number(rawValue) || 1));
  };

  const clampPercentValue = (rawValue: string): number => {
    return Math.min(200, Math.max(10, Number(rawValue) || 10));
  };

  const isPixelsMode = options.mode === ResizeModeEnum.Pixels;

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Maximize2 className="h-4 w-4 text-stone-700 dark:text-stone-300" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{t('resizer.title')}</h3>
        </div>
        <span className="text-[11px] font-mono font-medium rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-stone-700 dark:text-stone-300">
          {t('resizer.badge')}
        </span>
      </div>

      {/* 缩放模式 */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('resizer.modeLabel')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {modeOptions.map((modeOption) => (
            <button
              key={modeOption.value}
              type="button"
              onClick={() => onChange({ ...options, mode: modeOption.value })}
              className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors text-center ${
                options.mode === modeOption.value
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {modeOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* 像素模式：目标宽高与宽高比锁定 */}
      {isPixelsMode && (
        <div className="space-y-3 border-t border-stone-100 dark:border-stone-800 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label htmlFor="resize-width" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                {t('resizer.widthLabel')}
              </label>
              <input
                id="resize-width"
                type="number"
                min="1"
                step="1"
                value={options.width}
                onChange={(e) => onChange({ ...options, width: clampDimensionValue(e.target.value) })}
                className="w-full rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-2 text-xs font-medium text-stone-800 dark:text-stone-200 focus:border-stone-400 dark:focus:border-stone-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="resize-height" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                {t('resizer.heightLabel')}
              </label>
              <input
                id="resize-height"
                type="number"
                min="1"
                step="1"
                value={options.height}
                disabled={options.lockAspect}
                onChange={(e) => onChange({ ...options, height: clampDimensionValue(e.target.value) })}
                className="w-full rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-2 text-xs font-medium text-stone-800 dark:text-stone-200 focus:border-stone-400 dark:focus:border-stone-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {options.lockAspect && (
                <p className="text-[11px] text-stone-400 dark:text-stone-500">{t('resizer.heightAuto')}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ ...options, lockAspect: !options.lockAspect })}
            className={`w-full flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
              options.lockAspect
                ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
            }`}
          >
            {options.lockAspect ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
            <span>{t('resizer.lockAspect')}</span>
          </button>
        </div>
      )}

      {/* 百分比模式：缩放滑杆 */}
      {!isPixelsMode && (
        <div className="space-y-3 border-t border-stone-100 dark:border-stone-800 pt-4">
          <div className="flex items-center justify-between">
            <label htmlFor="resize-percent" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              {t('resizer.percentLabel')}
            </label>
            <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
              {options.percent}%
            </span>
          </div>
          <input
            id="resize-percent"
            type="range"
            min="10"
            max="200"
            step="5"
            value={options.percent}
            onChange={(e) => onChange({ ...options, percent: clampPercentValue(e.target.value) })}
            className="w-full accent-stone-900 dark:accent-stone-100 h-2 bg-stone-100 dark:bg-stone-800 rounded-lg cursor-pointer"
          />
        </div>
      )}

      {/* 社媒常用尺寸预设 */}
      <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('resizer.presetsLabel')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {dimensionPresets.map((preset) => {
            const isSelected =
              isPixelsMode &&
              !options.lockAspect &&
              options.width === preset.width &&
              options.height === preset.height;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  onChange({
                    ...options,
                    mode: ResizeModeEnum.Pixels,
                    width: preset.width,
                    height: preset.height,
                    lockAspect: false
                  })
                }
                className={`rounded-lg border px-2.5 py-2 text-xs font-medium font-mono transition-colors text-center ${
                  isSelected
                    ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 重新应用按钮 */}
      {itemCount > 0 && (
        <button
          type="button"
          disabled={isProcessing}
          onClick={onApply}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-100 py-3 text-xs font-semibold text-white dark:text-stone-900 shadow-xs hover:bg-stone-800 dark:hover:bg-white disabled:opacity-50 transition-colors"
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{t('resizer.applyBtn')}</span>
        </button>
      )}
    </div>
  );
}

export default ResizeSettings;
