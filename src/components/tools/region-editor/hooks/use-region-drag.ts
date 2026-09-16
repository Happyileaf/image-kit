import { useEffect, useRef, useState } from 'react';
import { CropAspectEnum } from '../../../../constants/crop-aspect';
import { NormalizedRect } from '../../../../types';
import { loadImageElement } from '../../../../utils/canvas-utils';
import { NormalizedPoint, RegionDragMode, RegionDragSession, RegionEditorMode, RegionResizeHandle } from '../types';
import { MIN_REGION_RATIO } from '../constants';
import {
  clampRegionToUnit,
  createRegion,
  fitRegionToAspect,
  moveRegion,
  replaceRegionAt,
  resizeRegion,
  resolveAspectRatioValue,
} from '../utils/region-geometry';

/**
 * 区域拖拽 Hook 返回值接口
 *
 * @description 封装选区编辑器的交互状态与事件处理器，index.tsx 只负责渲染
 * @property {HTMLImageElement | null} imageElement 已加载的图片元素，用于读取原始尺寸
 * @property {NormalizedRect[]} regions 当前全部选区（单区域模式恒为单元素数组）
 * @property {number} activeRegionIndex 当前激活的选区下标，无激活选区时为 -1
 * @property {RegionDragMode | null} dragMode 当前拖拽模式，空闲时为 null
 * @property {(stage: HTMLElement | null) => void} setStageElement 绑定舞台容器的回调 ref
 * @property {(event: any) => void} handleStagePointerDown 空白区域按下，开始新建选区
 * @property {(index: number) => (event: any) => void} buildRegionPointerDown 选区按下，选中并开始移动选区
 * @property {(index: number, handle: RegionResizeHandle) => (event: any) => void} buildHandlePointerDown 手柄按下，开始缩放选区
 * @property {(index: number) => void} removeRegion 删除指定下标的选区并修正激活下标
 */
interface UseRegionDragResult {
  imageElement: HTMLImageElement | null;
  regions: NormalizedRect[];
  activeRegionIndex: number;
  dragMode: RegionDragMode | null;
  setStageElement: (stage: HTMLElement | null) => void;
  handleStagePointerDown: (event: any) => void;
  buildRegionPointerDown: (index: number) => (event: any) => void;
  buildHandlePointerDown: (index: number, handle: RegionResizeHandle) => (event: any) => void;
  removeRegion: (index: number) => void;
}

/**
 * 区域拖拽 Hook 可选配置接口
 */
interface UseRegionDragOptions {
  /** 交互模式，默认 single 单区域 */
  mode?: RegionEditorMode;
  /** 多区域模式的初始选区数组 */
  initialRegions?: NormalizedRect[];
}

/**
 * 读取事件相对舞台的归一化坐标
 *
 * @param {HTMLElement | null} stage 舞台容器元素
 * @param {any} event 指针事件对象
 * @returns {NormalizedPoint | null} 相对舞台的 0-1 坐标，舞台不可用时返回 null
 * @example
 * const point = resolveStagePoint(stageRef.current, event);
 */
function resolveStagePoint(stage: HTMLElement | null, event: any): NormalizedPoint | null {
  if (!stage) return null;
  const bounds = stage.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return null;
  return {
    x: (event.clientX - bounds.left) / bounds.width,
    y: (event.clientY - bounds.top) / bounds.height,
  };
}

/**
 * 选区拖拽 Hook
 *
 * @description 管理选区数组与拖拽会话：加载图片获取原始尺寸、初始化选区、
 * 响应 pointerdown/move/up 完成新建、移动与八向缩放，全程使用 Pointer Events 与 setPointerCapture；
 * 单区域模式行为与既有裁剪用法一致，多区域模式支持追加新建、点击选中与删除，且不锁比例
 * @param {string} imageUrl 代表图地址
 * @param {CropAspectEnum} aspect 当前宽高比约束（多区域模式下忽略）
 * @param {NormalizedRect} initialRegion 进入编辑器时的初始选区（单区域模式使用）
 * @param {UseRegionDragOptions} [options] 可选配置，多区域模式传 mode 与 initialRegions
 * @returns {UseRegionDragResult} 选区状态与事件处理器集合
 * @example
 * const { regions, handleStagePointerDown } = useRegionDrag(imageUrl, aspect, initialRegion);
 */
export function useRegionDrag(
  imageUrl: string,
  aspect: CropAspectEnum,
  initialRegion: NormalizedRect,
  options?: UseRegionDragOptions,
): UseRegionDragResult {
  const mode = options?.mode ?? 'single';
  const initialRegions = options?.initialRegions;
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [regions, setRegions] = useState<NormalizedRect[]>(
    mode === 'multi' ? initialRegions ?? [] : [initialRegion],
  );
  const [activeRegionIndex, setActiveRegionIndex] = useState(
    mode === 'multi' ? ((initialRegions ?? []).length > 0 ? 0 : -1) : 0,
  );
  const [dragMode, setDragMode] = useState<RegionDragMode | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const sessionRef = useRef<RegionDragSession | null>(null);
  const hasDraggedRef = useRef(false);

  /**
   * 加载图片并按比例约束校正初始选区
   * 多区域模式下不锁比例，仅对初始选区数组做边界约束
   */
  useEffect(() => {
    let cancelled = false;
    loadImageElement(imageUrl)
      .then((image) => {
        if (cancelled) return;
        setImageElement(image);
        if (mode === 'multi') {
          const nextRegions = (initialRegions ?? []).map((region) => clampRegionToUnit(region));
          setRegions(nextRegions);
          setActiveRegionIndex(nextRegions.length > 0 ? 0 : -1);
          return;
        }
        const aspectRatio = resolveAspectRatioValue(aspect);
        setRegions([fitRegionToAspect(initialRegion, aspectRatio, image.naturalWidth, image.naturalHeight)]);
        setActiveRegionIndex(0);
      })
      .catch(() => {
        if (!cancelled) setImageElement(null);
      });
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  /**
   * 宽高比约束变化时重新校正当前选区
   * 多区域模式不锁比例，跳过校正
   */
  useEffect(() => {
    if (!imageElement || mode === 'multi') return;
    const aspectRatio = resolveAspectRatioValue(aspect);
    setRegions((previous) =>
      previous.map((region) =>
        fitRegionToAspect(region, aspectRatio, imageElement.naturalWidth, imageElement.naturalHeight),
      ),
    );
  }, [aspect, imageElement]);

  /**
   * 更新指定下标的选区
   *
   * @param {number} index 选区下标
   * @param {NormalizedRect} next 新选区
   * @returns {void} 无返回值
   */
  const updateRegion = (index: number, next: NormalizedRect): void => {
    setRegions((previous) => replaceRegionAt(previous, index, next));
  };

  /**
   * 开始一次拖拽会话并捕获指针
   *
   * @param {any} event 指针按下事件
   * @param {RegionDragSession} session 会话信息
   * @returns {void} 无返回值
   */
  const beginSession = (event: any, session: RegionDragSession): void => {
    sessionRef.current = session;
    hasDraggedRef.current = false;
    setDragMode(session.mode);
    setActiveRegionIndex(session.regionIndex);
    if (event.currentTarget && event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);
  };

  /**
   * 结束当前拖拽会话
   *
   * @returns {void} 无返回值
   */
  const endSession = (): void => {
    sessionRef.current = null;
    setDragMode(null);
    window.removeEventListener('pointermove', handleWindowPointerMove);
    window.removeEventListener('pointerup', handleWindowPointerUp);
    window.removeEventListener('pointercancel', handleWindowPointerUp);
  };

  /**
   * 全局指针移动：按会话模式分发到新建、移动或缩放逻辑
   *
   * @param {any} event 指针移动事件
   * @returns {void} 无返回值
   */
  const handleWindowPointerMove = (event: any): void => {
    const session = sessionRef.current;
    if (!session || event.pointerId !== session.pointerId || !imageElement) return;
    const point = resolveStagePoint(stageRef.current, event);
    if (!point) return;
    hasDraggedRef.current = true;
    const aspectRatio = mode === 'multi' ? null : resolveAspectRatioValue(aspect);
    const imageWidth = imageElement.naturalWidth;
    const imageHeight = imageElement.naturalHeight;
    if (session.mode === 'create') {
      updateRegion(session.regionIndex, createRegion(session.startPoint, point, aspectRatio, imageWidth, imageHeight));
      return;
    }
    if (session.mode === 'move') {
      const delta = { x: point.x - session.startPoint.x, y: point.y - session.startPoint.y };
      updateRegion(session.regionIndex, moveRegion(session.startRegion, delta));
      return;
    }
    if (session.mode === 'resize' && session.handle) {
      updateRegion(
        session.regionIndex,
        resizeRegion(session.startRegion, session.handle, point, aspectRatio, imageWidth, imageHeight),
      );
    }
  };

  /**
   * 全局指针抬起：结束会话
   * 多区域模式下，若新建会话未发生拖拽（单击空白），移除刚追加的微型选区
   *
   * @param {any} event 指针抬起事件
   * @returns {void} 无返回值
   */
  const handleWindowPointerUp = (event: any): void => {
    const session = sessionRef.current;
    if (!session || event.pointerId !== session.pointerId) return;
    if (mode === 'multi' && session.mode === 'create' && !hasDraggedRef.current) {
      setRegions((previous) =>
        previous.filter((region, index) => {
          if (index !== session.regionIndex) return true;
          return region.width > MIN_REGION_RATIO || region.height > MIN_REGION_RATIO;
        }),
      );
      setActiveRegionIndex(-1);
    }
    endSession();
  };

  /**
   * 空白区域按下：从按下点开始新建选区
   * 单区域模式重建当前选区，多区域模式将新选区追加到数组末尾
   *
   * @param {any} event 指针按下事件
   * @returns {void} 无返回值
   */
  const handleStagePointerDown = (event: any): void => {
    if (event.button !== 0) return;
    const point = resolveStagePoint(stageRef.current, event);
    if (!point) return;
    event.preventDefault();
    const startRegion = clampRegionToUnit({ x: point.x, y: point.y, width: 0, height: 0 });
    if (mode === 'multi') {
      const regionIndex = regions.length;
      setRegions((previous) => [...previous, startRegion]);
      beginSession(event, {
        mode: 'create',
        pointerId: event.pointerId,
        startPoint: point,
        startRegion,
        handle: null,
        regionIndex,
      });
      return;
    }
    beginSession(event, {
      mode: 'create',
      pointerId: event.pointerId,
      startPoint: point,
      startRegion,
      handle: null,
      regionIndex: activeRegionIndex,
    });
  };

  /**
   * 构造选区移动处理器
   *
   * @param {number} index 选区下标
   * @returns {(event: any) => void} 指针按下处理器
   */
  const buildRegionPointerDown = (index: number) => (event: any): void => {
    if (event.button !== 0) return;
    const point = resolveStagePoint(stageRef.current, event);
    if (!point) return;
    event.preventDefault();
    event.stopPropagation();
    beginSession(event, {
      mode: 'move',
      pointerId: event.pointerId,
      startPoint: point,
      startRegion: regions[index],
      handle: null,
      regionIndex: index,
    });
  };

  /**
   * 构造手柄缩放处理器
   *
   * @param {number} index 选区下标
   * @param {RegionResizeHandle} handle 手柄方向
   * @returns {(event: any) => void} 指针按下处理器
   */
  const buildHandlePointerDown = (index: number, handle: RegionResizeHandle) => (event: any): void => {
    if (event.button !== 0) return;
    const point = resolveStagePoint(stageRef.current, event);
    if (!point) return;
    event.preventDefault();
    event.stopPropagation();
    beginSession(event, {
      mode: 'resize',
      pointerId: event.pointerId,
      startPoint: point,
      startRegion: regions[index],
      handle,
      regionIndex: index,
    });
  };

  /**
   * 删除指定下标的选区
   *
   * @description 以不可变方式移除选区，并修正激活下标：
   * 删除激活选区后无激活（-1），删除其前方选区时下标前移一位
   * @param {number} index 待删除的选区下标
   * @returns {void} 无返回值
   */
  const removeRegion = (index: number): void => {
    setRegions((previous) => previous.filter((_, regionIndex) => regionIndex !== index));
    setActiveRegionIndex((previous) => {
      if (previous === index) return -1;
      if (previous > index) return previous - 1;
      return previous;
    });
  };

  /**
   * 绑定舞台容器
   *
   * @param {HTMLElement | null} stage 舞台元素
   * @returns {void} 无返回值
   */
  const setStageElement = (stage: HTMLElement | null): void => {
    stageRef.current = stage;
  };

  /**
   * 卸载时清理全局监听
   */
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, []);

  return {
    imageElement,
    regions,
    activeRegionIndex,
    dragMode,
    setStageElement,
    handleStagePointerDown,
    buildRegionPointerDown,
    buildHandlePointerDown,
    removeRegion,
  };
}
