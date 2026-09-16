import { useState } from 'react';
import { EyeOff, Sparkles, Pencil, Eraser } from 'lucide-react';
import { BlurOptions, NormalizedRect } from '../../../types';
import { BlurEffectEnum, BlurEffectOptions } from '../../../constants/blur-effect';
import { CropAspectEnum } from '../../../constants/crop-aspect';
import { SettingsPanelProps } from '../../../modules/types';
import { useI18n } from '../../../i18n/context';
import RegionEditor from '../region-editor';

/**
 * 打码遮盖效果对应的 i18n 文案键映射
 * 用于效果分段切换按钮的文字标签
 */
const EFFECT_LABEL_KEYS: Record<BlurEffectEnum, string> = {
  [BlurEffectEnum.Pixelate]: 'redactor.effects.pixelate',
  [BlurEffectEnum.Gaussian]: 'redactor.effects.gaussian',
};

/**
 * 打码遮盖设置面板
 *
 * @description 提供遮盖效果分段切换（像素化 / 高斯模糊）、强度滑杆（1 到 100）与
 * 多区域编辑入口：以列表首张代表图打开共享 RegionEditor 多区域模式编辑归一化选区数组，
 * regions 为打码唯一事实来源；支持一键清除全部选区；无文件时编辑入口禁用并提示；全部文案走 i18n
 * @param props - 设置面板属性
 * @param props.options - 当前打码参数
 * @param props.onChange - 参数变更回调
 * @param props.onApply - 应用参数并重新处理全部文件的回调
 * @param props.isProcessing - 是否正在处理中
 * @param props.itemCount - 当前文件数量
 * @param props.representativeItem - 列表首张代表图，用于打开可视化选区编辑器
 * @returns 打码遮盖设置面板组件
 * @example
 * <BlurSettings options={options} onChange={setOptions} onApply={apply} isProcessing={false} itemCount={3} representativeItem={items[0]} />
 */
function BlurSettings({
  options,
  onChange,
  onApply,
  isProcessing,
  itemCount,
  representativeItem,
}: SettingsPanelProps<BlurOptions>) {
  const { t } = useI18n();

  /** 选区编辑器是否打开 */
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  /**
   * 应用编辑器返回的全部选区
   *
   * @description 将编辑器确认的归一化选区数组写回参数并关闭编辑器，允许空数组
   * @param regions - 编辑器确认的全部归一化选区
   * @returns 无返回值
   * @example
   * handleRegionsApply([{ x: 0.1, y: 0.1, width: 0.3, height: 0.2 }]);
   */
  const handleRegionsApply = (regions: NormalizedRect[]): void => {
    onChange({ ...options, regions });
    setIsEditorOpen(false);
  };

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <EyeOff className="h-4 w-4 text-stone-700 dark:text-stone-300" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{t('redactor.title')}</h3>
        </div>
        <span className="text-[11px] font-mono font-medium rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-stone-700 dark:text-stone-300">
          {t('redactor.badge')}
        </span>
      </div>

      {/* 遮盖效果 */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('redactor.effectLabel')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BlurEffectOptions.map((effectOption) => (
            <button
              key={effectOption.value}
              type="button"
              onClick={() => onChange({ ...options, effect: effectOption.value })}
              className={`flex items-center justify-center rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                options.effect === effectOption.value
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {t(EFFECT_LABEL_KEYS[effectOption.value])}
            </button>
          ))}
        </div>
      </div>

      {/* 遮盖强度 */}
      <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {t('redactor.strengthLabel')}
          </label>
          <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
            {options.strength}%
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={options.strength}
          onChange={(event) => onChange({ ...options, strength: Number(event.target.value) })}
          className="w-full accent-stone-900 dark:accent-stone-100 h-2 bg-stone-100 dark:bg-stone-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* 打码区域 */}
      <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('redactor.regionsLabel')}
        </label>
        <div className="rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 px-3 py-2">
          <span className="font-mono text-[11px] text-stone-600 dark:text-stone-300">
            {t('redactor.regionCount', { count: options.regions.length })}
          </span>
        </div>
        <button
          type="button"
          disabled={!representativeItem}
          onClick={() => setIsEditorOpen(true)}
          className={`w-full flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
            representativeItem
              ? 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
              : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-400 dark:text-stone-500 cursor-not-allowed'
          }`}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>{t('redactor.editRegionsBtn')}</span>
        </button>
        {options.regions.length > 0 && (
          <button
            type="button"
            onClick={() => onChange({ ...options, regions: [] })}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
          >
            <Eraser className="h-3.5 w-3.5" />
            <span>{t('redactor.clearRegionsBtn')}</span>
          </button>
        )}
        {!representativeItem && (
          <p className="text-[11px] text-stone-400 dark:text-stone-500">{t('redactor.noFileHint')}</p>
        )}
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
          <span>{t('redactor.applyBtn')}</span>
        </button>
      )}

      {isEditorOpen && representativeItem && (
        <RegionEditor
          imageUrl={representativeItem.previewUrl}
          aspect={CropAspectEnum.Free}
          initialRegion={{ x: 0, y: 0, width: 1, height: 1 }}
          mode="multi"
          initialRegions={options.regions}
          onApplyRegions={handleRegionsApply}
          showGrid={false}
          onApply={() => undefined}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}

export default BlurSettings;
