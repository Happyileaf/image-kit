import { CropAspectEnum } from '../../../../constants/crop-aspect';
import { RegionResizeHandle } from '../types';

/**
 * 选区最小归一化尺寸
 * 宽与高均不小于图片宽高的 1%，避免误触产生零尺寸选区
 */
export const MIN_REGION_RATIO = 0.01;

/**
 * 比例锁定的容差
 * 判断初始选区是否已符合目标比例时的相对误差上限
 */
export const ASPECT_MATCH_TOLERANCE = 0.01;

/**
 * 裁剪宽高比枚举对应的像素宽高比映射
 * null 表示自由比例，不做比例约束
 */
export const CROP_ASPECT_RATIO_MAP: Record<CropAspectEnum, number | null> = {
  /** 自由比例 */
  [CropAspectEnum.Free]: null,
  /** 1:1 */
  [CropAspectEnum.Ratio1x1]: 1,
  /** 4:3 */
  [CropAspectEnum.Ratio4x3]: 4 / 3,
  /** 3:2 */
  [CropAspectEnum.Ratio3x2]: 3 / 2,
  /** 16:9 */
  [CropAspectEnum.Ratio16x9]: 16 / 9,
};

/**
 * 八向缩放手柄的渲染顺序
 */
export const REGION_RESIZE_HANDLES: RegionResizeHandle[] = [
  'nw',
  'n',
  'ne',
  'e',
  'se',
  's',
  'sw',
  'w',
];

/**
 * 各手柄对应的鼠标光标样式映射
 */
export const HANDLE_CURSOR_CLASSES: Record<RegionResizeHandle, string> = {
  /** 左上角手柄 */
  nw: 'cursor-nwse-resize',
  /** 上中手柄 */
  n: 'cursor-ns-resize',
  /** 右上角手柄 */
  ne: 'cursor-nesw-resize',
  /** 右中手柄 */
  e: 'cursor-ew-resize',
  /** 右下角手柄 */
  se: 'cursor-nwse-resize',
  /** 下中手柄 */
  s: 'cursor-ns-resize',
  /** 左下角手柄 */
  sw: 'cursor-nesw-resize',
  /** 左中手柄 */
  w: 'cursor-ew-resize',
};

/**
 * 各手柄在选区边框上的绝对定位样式映射
 */
export const HANDLE_POSITION_CLASSES: Record<RegionResizeHandle, string> = {
  /** 左上角手柄 */
  nw: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  /** 上中手柄 */
  n: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  /** 右上角手柄 */
  ne: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  /** 右中手柄 */
  e: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
  /** 右下角手柄 */
  se: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
  /** 下中手柄 */
  s: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  /** 左下角手柄 */
  sw: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  /** 左中手柄 */
  w: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
};
