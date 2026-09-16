import { useEffect } from 'react';
import { X, Check, Crop, Trash2 } from 'lucide-react';
import { useI18n } from '../../../i18n/context';
import { HANDLE_CURSOR_CLASSES, HANDLE_POSITION_CLASSES, REGION_RESIZE_HANDLES } from './constants';
import { useRegionDrag } from './hooks/use-region-drag';
import { RegionEditorProps } from './types';
import { buildMaskPieces, clampRegionToUnit } from './utils/region-geometry';

/**
 * 共享可视化选区编辑器
 *
 * @description 全屏模态形态的区域框选组件：拖拽建框、八向手柄缩放、整框移动，
 * 选区外暗色遮罩与可选三分构图线，坐标全部以 0-1 归一化存储；
 * 单区域模式服务于裁剪场景，多区域模式服务于打码遮盖场景：
 * 空白拖拽追加选区、点击选中高亮、工具条删除当前选区、应用时输出全部选区
 * @param {RegionEditorProps} props 组件属性
 * @returns {JSX.Element} 选区编辑器模态
 * @example
 * <RegionEditor imageUrl={url} aspect={aspect} initialRegion={region} onApply={setRegion} onCancel={close} />
 */
export default function RegionEditor({
  imageUrl,
  aspect,
  initialRegion,
  onApply,
  onCancel,
  mode = 'single',
  initialRegions,
  onApplyRegions,
  showGrid = true,
}: RegionEditorProps) {
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
    removeRegion,
  } = useRegionDrag(imageUrl, aspect, initialRegion, { mode, initialRegions });

  const isMultiMode = mode === 'multi';
  const activeRegion = activeRegionIndex >= 0 ? regions[activeRegionIndex] || null : null;
  const maskPieces = buildMaskPieces(isMultiMode ? regions : activeRegion ? [activeRegion] : []);

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
   * 单区域模式输出激活选区，多区域模式输出全部选区（允许空数组）
   *
   * @returns {void} 无返回值
   */
  const handleApply = (): void => {
    if (isMultiMode) {
      onApplyRegions?.(regions.map((region) => clampRegionToUnit(region)));
      return;
    }
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
            {!isMultiMode && imageElement && activeRegion && (
              <span className="hidden sm:inline-block rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-stone-600 dark:text-stone-300">
                {t('regionEditor.sizeBadge', { width: pixelWidth, height: pixelHeight })}
              </span>
            )}
            {isMultiMode && (
              <span className="hidden sm:inline-block rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-stone-600 dark:text-stone-300">
                {t('regionEditor.countBadge', { count: regions.length })}
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
            {imageElement && (isMultiMode || activeRegion) && (
              <div className="absolute inset-0" onPointerDown={handleStagePointerDown}>
                {maskPieces.map((piece, pieceIndex) => (
                  <div
                    key={pieceIndex}
                    className="absolute bg-stone-950/70"
                    style={{
                      left: `${piece.x * 100}%`,
                      top: `${piece.y * 100}%`,
                      width: `${piece.width * 100}%`,
                      height: `${piece.height * 100}%`,
                    }}
                  />
                ))}

                {regions.map((region, regionIndex) => {
                  const isActive = regionIndex === activeRegionIndex;
                  if (!isMultiMode && !isActive) return null;
                  const regionPixelWidth = Math.round(region.width * imageElement.naturalWidth);
                  const regionPixelHeight = Math.round(region.height * imageElement.naturalHeight);
                  return (
                    <div
                      key={regionIndex}
                      className={`absolute border-2 ${
                        isActive
                          ? 'border-white/95 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]'
                          : 'border-white/50'
                      } ${dragMode === 'move' && isActive ? 'cursor-grabbing' : 'cursor-move'}`}
                      style={{
                        left: `${region.x * 100}%`,
                        top: `${region.y * 100}%`,
                        width: `${region.width * 100}%`,
                        height: `${region.height * 100}%`,
                      }}
                      onPointerDown={buildRegionPointerDown(regionIndex)}
                    >
                      {isActive && showGrid && (
                        <>
                          <div className="absolute left-1/3 top-0 h-full w-px bg-white/45 pointer-events-none" />
                          <div className="absolute left-2/3 top-0 h-full w-px bg-white/45 pointer-events-none" />
                          <div className="absolute left-0 top-1/3 w-full h-px bg-white/45 pointer-events-none" />
                          <div className="absolute left-0 top-2/3 w-full h-px bg-white/45 pointer-events-none" />
                        </>
                      )}

                      {isActive && (
                        <span className="absolute left-1 top-1 rounded bg-stone-950/70 px-1.5 py-0.5 text-[11px] font-mono text-white pointer-events-none">
                          {t('regionEditor.sizeBadge', { width: regionPixelWidth, height: regionPixelHeight })}
                        </span>
                      )}

                      {isActive &&
                        REGION_RESIZE_HANDLES.map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            onPointerDown={buildHandlePointerDown(regionIndex, handle)}
                            className={`absolute h-3.5 w-3.5 rounded-full bg-white ring-1 ring-stone-950/30 shadow-sm ${HANDLE_POSITION_CLASSES[handle]} ${HANDLE_CURSOR_CLASSES[handle]}`}
                          />
                        ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-stone-200 dark:border-stone-800 px-6 py-4 bg-stone-50 dark:bg-stone-900/90">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t(isMultiMode ? 'regionEditor.hintMulti' : 'regionEditor.hint')}
          </p>
          <div className="flex items-center gap-3">
            {isMultiMode && (
              <button
                type="button"
                onClick={() => removeRegion(activeRegionIndex)}
                disabled={!activeRegion}
                title={t('regionEditor.deleteSelected')}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 dark:border-stone-700 px-3 py-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onCancel}
              className="rounded-xl border border-stone-300 dark:border-stone-700 px-4 py-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {t('regionEditor.cancel')}
            </button>
            <button
              onClick={handleApply}
              disabled={!isMultiMode && !activeRegion}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-100 px-4 py-2 text-sm font-semibold text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
              {t(isMultiMode ? 'regionEditor.applyRegions' : 'regionEditor.apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
