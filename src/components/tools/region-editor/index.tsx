import { useEffect } from 'react';
import { X, Check, Crop } from 'lucide-react';
import { useI18n } from '../../../i18n/context';
import { HANDLE_CURSOR_CLASSES, HANDLE_POSITION_CLASSES, REGION_RESIZE_HANDLES } from './constants';
import { useRegionDrag } from './hooks/use-region-drag';
import { RegionEditorProps } from './types';
import { clampRegionToUnit } from './utils/region-geometry';

/**
 * 共享可视化选区编辑器
 *
 * @description 全屏模态形态的区域框选组件：拖拽建框、八向手柄缩放、整框移动，
 * 选区外暗色遮罩与三分构图线，坐标全部以 0-1 归一化存储；
 * 当前版本仅暴露单区域交互，内部状态按多区域数组建模，供 Task 6 Blur 复用扩展
 * @param {RegionEditorProps} props 组件属性
 * @returns {JSX.Element} 选区编辑器模态
 * @example
 * <RegionEditor imageUrl={url} aspect={aspect} initialRegion={region} onApply={setRegion} onCancel={close} />
 */
export default function RegionEditor({ imageUrl, aspect, initialRegion, onApply, onCancel }: RegionEditorProps) {
  const { t } = useI18n();
  const {
    imageElement,
    regions,
    activeRegionIndex,
    dragMode,
    setStageElement,
    handleStagePointerDown,
    buildRegionPointerDown,
    buildHandlePointerDown,
  } = useRegionDrag(imageUrl, aspect, initialRegion);

  const activeRegion = regions[activeRegionIndex] || null;

  /**
   * 监听 Escape 关闭编辑器
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  /**
   * 应用当前选区并关闭
   *
   * @returns {void} 无返回值
   */
  const handleApply = (): void => {
    if (!activeRegion) return;
    onApply(clampRegionToUnit(activeRegion));
  };

  const pixelWidth = imageElement && activeRegion ? Math.round(activeRegion.width * imageElement.naturalWidth) : 0;
  const pixelHeight = imageElement && activeRegion ? Math.round(activeRegion.height * imageElement.naturalHeight) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 dark:bg-black/85 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl bg-white dark:bg-stone-900 shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/90">
          <div className="flex items-center gap-3">
            <Crop className="h-5 w-5 text-stone-500 dark:text-stone-400" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">{t('regionEditor.title')}</h3>
            {imageElement && activeRegion && (
              <span className="hidden sm:inline-block rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-stone-600 dark:text-stone-300">
                {t('regionEditor.sizeBadge', { width: pixelWidth, height: pixelHeight })}
              </span>
            )}
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-stone-400 dark:text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex-1 overflow-auto bg-stone-950 p-4 sm:p-8 flex items-center justify-center min-h-[350px]">
          <div ref={setStageElement} className="relative inline-block select-none" style={{ touchAction: 'none' }}>
            <img
              src={imageUrl}
              alt={t('regionEditor.title')}
              draggable={false}
              className="max-h-[62vh] max-w-full object-contain pointer-events-none"
            />
            {imageElement && activeRegion && (
              <div className="absolute inset-0" onPointerDown={handleStagePointerDown}>
                <div
                  className="absolute left-0 top-0 w-full bg-stone-950/70"
                  style={{ height: `${activeRegion.y * 100}%` }}
                />
                <div
                  className="absolute left-0 bottom-0 w-full bg-stone-950/70"
                  style={{ height: `${(1 - activeRegion.y - activeRegion.height) * 100}%` }}
                />
                <div
                  className="absolute left-0 bg-stone-950/70"
                  style={{
                    top: `${activeRegion.y * 100}%`,
                    width: `${activeRegion.x * 100}%`,
                    height: `${activeRegion.height * 100}%`,
                  }}
                />
                <div
                  className="absolute right-0 bg-stone-950/70"
                  style={{
                    top: `${activeRegion.y * 100}%`,
                    width: `${(1 - activeRegion.x - activeRegion.width) * 100}%`,
                    height: `${activeRegion.height * 100}%`,
                  }}
                />

                <div
                  className={`absolute border-2 border-white/95 shadow-[0_0_0_1px_rgba(0,0,0,0.35)] ${
                    dragMode === 'move' ? 'cursor-grabbing' : 'cursor-move'
                  }`}
                  style={{
                    left: `${activeRegion.x * 100}%`,
                    top: `${activeRegion.y * 100}%`,
                    width: `${activeRegion.width * 100}%`,
                    height: `${activeRegion.height * 100}%`,
                  }}
                  onPointerDown={buildRegionPointerDown(activeRegionIndex)}
                >
                  <div className="absolute left-1/3 top-0 h-full w-px bg-white/45 pointer-events-none" />
                  <div className="absolute left-2/3 top-0 h-full w-px bg-white/45 pointer-events-none" />
                  <div className="absolute left-0 top-1/3 w-full h-px bg-white/45 pointer-events-none" />
                  <div className="absolute left-0 top-2/3 w-full h-px bg-white/45 pointer-events-none" />

                  <span className="absolute left-1 top-1 rounded bg-stone-950/70 px-1.5 py-0.5 text-[11px] font-mono text-white pointer-events-none">
                    {t('regionEditor.sizeBadge', { width: pixelWidth, height: pixelHeight })}
                  </span>

                  {REGION_RESIZE_HANDLES.map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onPointerDown={buildHandlePointerDown(activeRegionIndex, handle)}
                      className={`absolute h-3.5 w-3.5 rounded-full bg-white ring-1 ring-stone-950/30 shadow-sm ${HANDLE_POSITION_CLASSES[handle]} ${HANDLE_CURSOR_CLASSES[handle]}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/90">
          <p className="text-xs text-stone-500 dark:text-stone-400">{t('regionEditor.hint')}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="rounded-xl border border-stone-300 dark:border-stone-700 px-4 py-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {t('regionEditor.cancel')}
            </button>
            <button
              onClick={handleApply}
              disabled={!activeRegion}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-100 px-4 py-2 text-sm font-semibold text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
              {t('regionEditor.apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
