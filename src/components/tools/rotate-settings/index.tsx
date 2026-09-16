import { RotateCw, Sparkles, FlipHorizontal, FlipVertical } from 'lucide-react';
import { RotateOptions } from '../../../types';
import { RotateAngleEnum } from '../../../constants/rotate-angle';
import { SettingsPanelProps } from '../../../modules/types';
import { useI18n } from '../../../i18n/context';

function RotateSettings({
  options,
  onChange,
  onApply,
  isProcessing,
  itemCount
}: SettingsPanelProps<RotateOptions>) {
  const { t } = useI18n();

  const angleOptions = [
    { label: t('rotator.angles.deg0'), value: RotateAngleEnum.Deg0 },
    { label: t('rotator.angles.deg90'), value: RotateAngleEnum.Deg90 },
    { label: t('rotator.angles.deg180'), value: RotateAngleEnum.Deg180 },
    { label: t('rotator.angles.deg270'), value: RotateAngleEnum.Deg270 }
  ];

  const flipToggles = [
    { key: 'flipHorizontal' as const, label: t('rotator.flipHorizontal'), Icon: FlipHorizontal },
    { key: 'flipVertical' as const, label: t('rotator.flipVertical'), Icon: FlipVertical }
  ];

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <RotateCw className="h-4 w-4 text-stone-700 dark:text-stone-300" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{t('rotator.title')}</h3>
        </div>
        <span className="text-[11px] font-mono font-medium rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-stone-700 dark:text-stone-300">
          {t('rotator.badge')}
        </span>
      </div>

      {/* 旋转角度 */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('rotator.angleLabel')}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {angleOptions.map((angleOption) => (
            <button
              key={angleOption.value}
              type="button"
              onClick={() => onChange({ ...options, angle: angleOption.value })}
              className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors text-center ${
                options.angle === angleOption.value
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {angleOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* 镜像翻转 */}
      <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('rotator.flipLabel')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {flipToggles.map((toggle) => {
            const isActive = options[toggle.key];
            return (
              <button
                key={toggle.key}
                type="button"
                onClick={() => onChange({ ...options, [toggle.key]: !isActive })}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
                }`}
              >
                <toggle.Icon className="h-3.5 w-3.5" />
                <span>{toggle.label}</span>
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
          <span>{t('rotator.applyBtn')}</span>
        </button>
      )}
    </div>
  );
}

export default RotateSettings;
