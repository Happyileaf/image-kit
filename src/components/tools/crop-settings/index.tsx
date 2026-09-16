import { useState } from 'react';
import { Crop, Sparkles, Pencil } from 'lucide-react';
import { CropOptions, NormalizedRect } from '../../../types';
import { CropAspectEnum, CropAspectOptions } from '../../../constants/crop-aspect';
import { SettingsPanelProps } from '../../../modules/types';
import { useI18n } from '../../../i18n/context';
import RegionEditor from '../region-editor';

/**
 * 宽高比预设对应的 i18n 文案键映射
 * 用于预设按钮的文字标签
 */
const ASPECT_LABEL_KEYS: Record<CropAspectEnum, string> = {
  [CropAspectEnum.Free]: 'cropper.aspects.free',
  [CropAspectEnum.Ratio1x1]: 'cropper.aspects.ratio1x1',
  [CropAspectEnum.Ratio4x3]: 'cropper.aspects.ratio4x3',
  [CropAspectEnum.Ratio3x2]: 'cropper.aspects.ratio3x2',
  [CropAspectEnum.Ratio16x9]: 'cropper.aspects.ratio16x9',
};

/**
 * 裁剪设置面板
 *
 * @description 提供宽高比预设（自由 / 1:1 / 4:3 / 3:2 / 16:9）与可视化选区编辑入口：
 * 以列表首张代表图打开共享 RegionEditor 编辑归一化选区，region 为裁剪唯一事实来源，
 * aspect 仅作为编辑器内的交互约束；无文件时编辑入口禁用并提示；全部文案走 i18n
 * @param props - 设置面板属性
 * @param props.options - 当前裁剪参数
 * @param props.onChange - 参数变更回调
 * @param props.onApply - 应用参数并重新处理全部文件的回调
 * @param props.isProcessing - 是否正在处理中
 * @param props.itemCount - 当前文件数量
 * @param props.representativeItem - 列表首张代表图，用于打开可视化选区编辑器
 * @returns 裁剪设置面板组件
 * @example
 * <CropSettings options={options} onChange={setOptions} onApply={apply} isProcessing={false} itemCount={3} representativeItem={items[0]} />
 */
function CropSettings({
  options,
  onChange,
  onApply,
  isProcessing,
  itemCount,
  representativeItem,
}: SettingsPanelProps<CropOptions>) {
  const { t } = useI18n();

  /** 选区编辑器是否打开 */
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  /** 选区各边的百分比展示值（相对图片宽高，四舍五入） */
  const regionPercent = {
    x: Math.round(options.region.x * 100),
    y: Math.round(options.region.y * 100),
    width: Math.round(options.region.width * 100),
    height: Math.round(options.region.height * 100),
  };

  /**
   * 应用编辑器返回的选区
   *
   * @description 将编辑器确认的归一化选区写回参数并关闭编辑器
   * @param region - 编辑器确认的归一化选区
   * @returns 无返回值
   * @example
   * handleRegionApply({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
   */
  const handleRegionApply = (region: NormalizedRect): void => {
    onChange({ ...options, region });
    setIsEditorOpen(false);
  };

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Crop className="h-4 w-4 text-stone-700 dark:text-stone-300" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{t('cropper.title')}</h3>
        </div>
        <span className="text-[11px] font-mono font-medium rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-stone-700 dark:text-stone-300">
          {t('cropper.badge')}
        </span>
      </div>

      {/* 宽高比预设 */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('cropper.aspectLabel')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CropAspectOptions.map((aspectOption) => (
            <button
              key={aspectOption.value}
              type="button"
              onClick={() => onChange({ ...options, aspect: aspectOption.value })}
              className={`flex items-center justify-center rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                options.aspect === aspectOption.value
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {t(ASPECT_LABEL_KEYS[aspectOption.value])}
            </button>
          ))}
        </div>
      </div>

      {/* 裁剪选区 */}
      <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('cropper.regionLabel')}
        </label>
        <div className="rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 px-3 py-2">
          <span className="font-mono text-[11px] text-stone-600 dark:text-stone-300">
            {t('cropper.regionInfo', regionPercent)}
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
          <span>{t('cropper.editRegionBtn')}</span>
        </button>
        {!representativeItem && (
          <p className="text-[11px] text-stone-400 dark:text-stone-500">{t('cropper.noFileHint')}</p>
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
          <span>{t('cropper.applyBtn')}</span>
        </button>
      )}

      {isEditorOpen && representativeItem && (
        <RegionEditor
          imageUrl={representativeItem.previewUrl}
          aspect={options.aspect}
          initialRegion={options.region}
          onApply={handleRegionApply}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}

export default CropSettings;
