import { NormalizedRect } from '../../../../types';
import { CropAspectEnum } from '../../../../constants/crop-aspect';

/**
 * 归一化坐标点接口
 * 坐标分量均为 0 到 1，相对图片自身宽高
 */
export interface NormalizedPoint {
  /** 水平坐标（0 到 1，相对图片宽度） */
  x: number;
  /** 垂直坐标（0 到 1，相对图片高度） */
  y: number;
}

/**
 * 选区缩放手柄方位类型
 * 八向手柄：四角与四边中点
 */
export type RegionResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

/**
 * 选区拖拽交互模式类型
 * create 为拖拽建框，move 为整框移动，resize 为手柄缩放
 */
export type RegionDragMode = 'create' | 'move' | 'resize';

/**
 * 选区编辑器交互模式类型
 * single 为单区域模式（裁剪等场景），multi 为多区域模式（打码遮盖等场景）
 */
export type RegionEditorMode = 'single' | 'multi';

/**
 * 选区拖拽会话接口
 * 记录一次 pointerdown 到 pointerup 之间的拖拽上下文
 */
export interface RegionDragSession {
  /** 拖拽交互模式 */
  mode: RegionDragMode;
  /** 触发会话的指针标识，用于多指场景下仅响应同一指针 */
  pointerId: number;
  /** 拖拽起点（归一化坐标） */
  startPoint: NormalizedPoint;
  /** 拖拽开始时的选区快照 */
  startRegion: NormalizedRect;
  /** 缩放模式下的手柄方位，其余模式为 null */
  handle: RegionResizeHandle | null;
  /** 被拖拽选区在区域数组中的索引，为多区域模式预留 */
  regionIndex: number;
}

/**
 * 共享选区编辑器属性接口
 */
export interface RegionEditorProps {
  /** 代表图片地址（本地 Object URL，绝不上传） */
  imageUrl: string;
  /** 比例锁定模式，仅作为编辑器内的交互约束；多区域模式下忽略 */
  aspect: CropAspectEnum;
  /** 打开编辑器时的初始选区（归一化坐标），单区域模式使用 */
  initialRegion: NormalizedRect;
  /** 确认选区回调，输出归一化矩形，单区域模式使用 */
  onApply: (region: NormalizedRect) => void;
  /** 取消编辑回调 */
  onCancel: () => void;
  /** 交互模式，默认 single 单区域 */
  mode?: RegionEditorMode;
  /** 多区域模式的初始选区数组（归一化坐标） */
  initialRegions?: NormalizedRect[];
  /** 多区域模式的确认回调，输出全部归一化选区（允许空数组） */
  onApplyRegions?: (regions: NormalizedRect[]) => void;
  /** 是否显示三分构图线，默认 true；多区域打码场景传 false */
  showGrid?: boolean;
}
