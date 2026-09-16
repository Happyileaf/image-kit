import { useRef } from 'react';
import { Stamp, Sparkles, Type, Image as ImageIcon, Upload, X } from 'lucide-react';
import { WatermarkOptions } from '../../../types';
import { WatermarkTypeEnum } from '../../../constants/watermark-type';
import { WatermarkPositionEnum } from '../../../constants/watermark-position';
import { SettingsPanelProps } from '../../../modules/types';
import { useI18n } from '../../../i18n/context';

/**
 * 九宫格锚点按行排列的位置矩阵
 * 与界面 3×3 按钮网格的行列一一对应
 */
const POSITION_ROWS: WatermarkPositionEnum[][] = [
  [
    WatermarkPositionEnum.TopLeft,
    WatermarkPositionEnum.TopCenter,
    WatermarkPositionEnum.TopRight,
  ],
  [
    WatermarkPositionEnum.MiddleLeft,
    WatermarkPositionEnum.MiddleCenter,
    WatermarkPositionEnum.MiddleRight,
  ],
  [
    WatermarkPositionEnum.BottomLeft,
    WatermarkPositionEnum.BottomCenter,
    WatermarkPositionEnum.BottomRight,
  ],
];

/**
 * 九宫格锚点指示圆点的定位样式映射
 * 以绝对定位圆点直观表达每个锚点按钮代表的位置
 */
const POSITION_DOT_CLASSES: Record<WatermarkPositionEnum, string> = {
  [WatermarkPositionEnum.TopLeft]: 'top-1.5 left-1.5',
  [WatermarkPositionEnum.TopCenter]: 'top-1.5 left-1/2 -translate-x-1/2',
  [WatermarkPositionEnum.TopRight]: 'top-1.5 right-1.5',
  [WatermarkPositionEnum.MiddleLeft]: 'top-1/2 left-1.5 -translate-y-1/2',
  [WatermarkPositionEnum.MiddleCenter]: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  [WatermarkPositionEnum.MiddleRight]: 'top-1/2 right-1.5 -translate-y-1/2',
  [WatermarkPositionEnum.BottomLeft]: 'bottom-1.5 left-1.5',
  [WatermarkPositionEnum.BottomCenter]: 'bottom-1.5 left-1/2 -translate-x-1/2',
  [WatermarkPositionEnum.BottomRight]: 'bottom-1.5 right-1.5',
};

/**
 * 九宫格锚点对应的 i18n 文案键映射
 * 用于锚点按钮的悬浮提示
 */
const POSITION_LABEL_KEYS: Record<WatermarkPositionEnum, string> = {
  [WatermarkPositionEnum.TopLeft]: 'watermarker.positions.topLeft',
  [WatermarkPositionEnum.TopCenter]: 'watermarker.positions.topCenter',
  [WatermarkPositionEnum.TopRight]: 'watermarker.positions.topRight',
  [WatermarkPositionEnum.MiddleLeft]: 'watermarker.positions.middleLeft',
  [WatermarkPositionEnum.MiddleCenter]: 'watermarker.positions.middleCenter',
  [WatermarkPositionEnum.MiddleRight]: 'watermarker.positions.middleRight',
  [WatermarkPositionEnum.BottomLeft]: 'watermarker.positions.bottomLeft',
  [WatermarkPositionEnum.BottomCenter]: 'watermarker.positions.bottomCenter',
  [WatermarkPositionEnum.BottomRight]: 'watermarker.positions.bottomRight',
};

/**
 * 水印设置面板
 *
 * @description 提供文字 / Logo 两种水印类型的参数配置：文字内容、颜色与相对字号，
 * 本地 Logo 选择（FileReader 读取为 Data URL，绝不上传）与相对宽度，
 * 九宫格锚点定位、边距、不透明度与斜向平铺开关；全部文案走 i18n
 * @param props - 设置面板属性
 * @param props.options - 当前水印参数
 * @param props.onChange - 参数变更回调
 * @param props.onApply - 应用参数并重新处理全部文件的回调
 * @param props.isProcessing - 是否正在处理中
 * @param props.itemCount - 当前文件数量
 * @returns 水印设置面板组件
 * @example
 * <WatermarkSettings options={options} onChange={setOptions} onApply={apply} isProcessing={false} itemCount={3} />
 */
function WatermarkSettings({
  options,
  onChange,
  onApply,
  isProcessing,
  itemCount
}: SettingsPanelProps<WatermarkOptions>) {
  const { t } = useI18n();

  /** Logo 本地文件选择的隐藏 input 引用 */
  const logoInputRef = useRef<HTMLInputElement>(null);

  /** 是否为文字水印模式 */
  const isTextMode = options.type === WatermarkTypeEnum.Text;

  /** 字号滑杆的百分比显示值（相对图片宽度，保留一位小数） */
  const fontSizePercent = Math.round(options.fontSizeRatio * 1000) / 10;

  /** Logo 宽度滑杆的百分比显示值（相对图片宽度） */
  const logoWidthPercent = Math.round(options.logoWidthRatio * 100);

  /** 边距滑杆的百分比显示值（相对图片宽度，保留一位小数） */
  const marginPercent = Math.round(options.marginRatio * 1000) / 10;

  /**
   * 处理 Logo 文件选择
   *
   * @description 仅通过 FileReader 将所选图片读取为 Data URL 存入本地参数，
   * 不读取文件名、不发出任何网络请求；读取完成后清空 input 以便重复选择同一文件
   * @param event - 文件输入变更事件
   * @returns 无返回值
   * @example
   * <input type="file" accept="image/*" onChange={handleLogoFileChange} />
   */
  const handleLogoFileChange = (event: any) => {
    /** 用户选择的第一个 Logo 文件 */
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...options, logoDataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  /**
   * 清除已选择的 Logo
   *
   * @description 将 logoDataUrl 置空，Logo 模式下处理将退化为不叠加水印
   * @returns 无返回值
   * @example
   * handleLogoClear();
   */
  const handleLogoClear = () => {
    onChange({ ...options, logoDataUrl: null });
  };

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Stamp className="h-4 w-4 text-stone-700 dark:text-stone-300" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{t('watermarker.title')}</h3>
        </div>
        <span className="text-[11px] font-mono font-medium rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-stone-700 dark:text-stone-300">
          {t('watermarker.badge')}
        </span>
      </div>

      {/* 水印类型 */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('watermarker.typeLabel')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...options, type: WatermarkTypeEnum.Text })}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
              isTextMode
                ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
            }`}
          >
            <Type className="h-3.5 w-3.5" />
            <span>{t('watermarker.types.text')}</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...options, type: WatermarkTypeEnum.Logo })}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
              !isTextMode
                ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>{t('watermarker.types.logo')}</span>
          </button>
        </div>
      </div>

      {/* 文字模式：文本、颜色与字号 */}
      {isTextMode && (
        <div className="space-y-3 border-t border-stone-100 dark:border-stone-800 pt-4">
          <div className="space-y-1.5">
            <label htmlFor="watermark-text" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              {t('watermarker.textLabel')}
            </label>
            <input
              id="watermark-text"
              type="text"
              value={options.text}
              placeholder={t('watermarker.textPlaceholder')}
              onChange={(e) => onChange({ ...options, text: e.target.value })}
              className="w-full rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-2 text-xs font-medium text-stone-800 dark:text-stone-200 focus:border-stone-400 dark:focus:border-stone-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="watermark-color" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              {t('watermarker.colorLabel')}
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-500 dark:text-stone-400 uppercase">{options.color}</span>
              <input
                id="watermark-color"
                type="color"
                value={options.color}
                onChange={(e) => onChange({ ...options, color: e.target.value })}
                className="h-7 w-10 cursor-pointer rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-0.5"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="watermark-font-size" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                {t('watermarker.fontSizeLabel')}
              </label>
              <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                {fontSizePercent}%
              </span>
            </div>
            <input
              id="watermark-font-size"
              type="range"
              min="2"
              max="20"
              step="0.5"
              value={options.fontSizeRatio * 100}
              onChange={(e) => onChange({ ...options, fontSizeRatio: Number(e.target.value) / 100 })}
              className="w-full accent-stone-900 dark:accent-stone-100 h-2 bg-stone-100 dark:bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Logo 模式：本地选择、预览与宽度 */}
      {!isTextMode && (
        <div className="space-y-3 border-t border-stone-100 dark:border-stone-800 pt-4">
          <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {t('watermarker.logoLabel')}
          </label>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoFileChange}
            className="hidden"
          />
          {options.logoDataUrl ? (
            <div className="flex items-center gap-3">
              <img
                src={options.logoDataUrl}
                alt={t('watermarker.logoLabel')}
                className="h-12 w-12 rounded-lg border border-stone-200 dark:border-stone-700 object-contain bg-white dark:bg-stone-800 p-1"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                >
                  {t('watermarker.logoChange')}
                </button>
                <button
                  type="button"
                  onClick={handleLogoClear}
                  title={t('watermarker.logoClear')}
                  className="flex items-center justify-center rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-1.5 text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/70 px-2.5 py-3 text-xs font-medium text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-100/50 dark:hover:bg-stone-800/50 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{t('watermarker.logoPick')}</span>
            </button>
          )}
          <p className="text-[11px] text-stone-400 dark:text-stone-500">{t('watermarker.logoPrivacyNote')}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="watermark-logo-width" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                {t('watermarker.logoWidthLabel')}
              </label>
              <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                {logoWidthPercent}%
              </span>
            </div>
            <input
              id="watermark-logo-width"
              type="range"
              min="5"
              max="40"
              step="1"
              value={options.logoWidthRatio * 100}
              onChange={(e) => onChange({ ...options, logoWidthRatio: Number(e.target.value) / 100 })}
              className="w-full accent-stone-900 dark:accent-stone-100 h-2 bg-stone-100 dark:bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 九宫格锚点定位 */}
      <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
        <label className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {t('watermarker.positionLabel')}
        </label>
        <div className={options.tiled ? 'opacity-40' : ''}>
          <div className="grid grid-cols-3 gap-1.5 w-28">
            {POSITION_ROWS.map((row) =>
              row.map((position) => (
                <button
                  key={position}
                  type="button"
                  disabled={options.tiled}
                  title={t(POSITION_LABEL_KEYS[position])}
                  onClick={() => onChange({ ...options, position })}
                  className={`relative h-8 rounded-md border transition-colors disabled:cursor-not-allowed ${
                    options.position === position
                      ? 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-400 dark:text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-700'
                  }`}
                >
                  <span
                    className={`absolute h-1.5 w-1.5 rounded-full bg-current ${POSITION_DOT_CLASSES[position]}`}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 边距 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="watermark-margin" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {t('watermarker.marginLabel')}
          </label>
          <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
            {marginPercent}%
          </span>
        </div>
        <input
          id="watermark-margin"
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={options.marginRatio * 100}
          onChange={(e) => onChange({ ...options, marginRatio: Number(e.target.value) / 100 })}
          className="w-full accent-stone-900 dark:accent-stone-100 h-2 bg-stone-100 dark:bg-stone-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* 不透明度 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="watermark-opacity" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {t('watermarker.opacityLabel')}
          </label>
          <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
            {options.opacity}%
          </span>
        </div>
        <input
          id="watermark-opacity"
          type="range"
          min="0"
          max="100"
          step="1"
          value={options.opacity}
          onChange={(e) => onChange({ ...options, opacity: Number(e.target.value) })}
          className="w-full accent-stone-900 dark:accent-stone-100 h-2 bg-stone-100 dark:bg-stone-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* 平铺开关 */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => onChange({ ...options, tiled: !options.tiled })}
          className={`w-full flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
            options.tiled
              ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
              : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
          }`}
        >
          <span>{t('watermarker.tiledLabel')}</span>
        </button>
        {options.tiled && (
          <p className="text-[11px] text-stone-400 dark:text-stone-500">{t('watermarker.tiledHint')}</p>
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
          <span>{t('watermarker.applyBtn')}</span>
        </button>
      )}
    </div>
  );
}

export default WatermarkSettings;
